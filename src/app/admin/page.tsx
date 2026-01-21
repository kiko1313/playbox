'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, User } from 'firebase/auth';
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc, where, getDocs, setDoc, getDoc } from 'firebase/firestore';
import { Trash2, Upload, Video as VideoIcon, FileText, Settings, Plus } from 'lucide-react';

// --- TYPES ---
interface Video { id: number; title: string; type: string; src: string; views: string; date: string; }
interface FileItem { id: number; title: string; type: string; url: string; desc: string; }

// --- WORKER CONFIG ---
// --- WORKER CONFIG ---
const WORKER_ENDPOINT = "/api/upload"; // Internal Next.js API Route

export default function AdminPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    if (loading) return <div className="center-screen">Loading...</div>;
    if (!user) return <LoginForm />;

    return <AdminDashboard />;
}

// --- SUB COMPONENTS ---

function LoginForm() {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Allow username only login by appending domain if needed, matching legacy behavior
            const userEmail = email.includes('@') ? email : `${email}@admin.com`;
            await signInWithEmailAndPassword(auth, userEmail, pass);
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="center-screen">
            <div className="login-card">
                <h2>Admin Access</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Username / Email</label>
                        <input className="input" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input className="input" type="password" value={pass} onChange={e => setPass(e.target.value)} required />
                    </div>
                    {error && <p className="error">{error}</p>}
                    <button className="btn btn-primary full-width">Login</button>
                </form>
            </div>
            <style jsx>{`
        .center-screen { height: 100vh; display: flex; align-items: center; justify-content: center; }
        .login-card { background: var(--bg-card); padding: 2rem; border-radius: 12px; width: 100%; max-width: 400px; border: 1px solid var(--border-color); }
        h2 { text-align: center; margin-bottom: 2rem; }
        .form-group { margin-bottom: 1rem; }
        .input { width: 100%; padding: 0.8rem; background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); color: white; border-radius: 8px; }
        .btn { padding: 0.8rem; border-radius: 8px; font-weight: 600; margin-top: 1rem; }
        .btn-primary { background: var(--gradient-primary); color: white; }
        .full-width { width: 100%; }
        .error { color: #ff4444; font-size: 0.9rem; margin-top: 0.5rem; }
      `}</style>
        </div>
    );
}

function AdminDashboard() {
    const [tab, setTab] = useState<'videos' | 'files' | 'settings'>('videos');

    return (
        <div className="page-container">
            <div className="header-section">
                <h1>Admin <span className="text-gradient">Dashboard</span></h1>
                <p className="subtitle">Manage content and monetization settings.</p>
            </div>

            <div className="admin-tabs">
                <button className={`tab-btn ${tab === 'videos' ? 'active' : ''}`} onClick={() => setTab('videos')}>
                    <VideoIcon size={18} /> Videos
                </button>
                <button className={`tab-btn ${tab === 'files' ? 'active' : ''}`} onClick={() => setTab('files')}>
                    <FileText size={18} /> Files
                </button>
                <button className={`tab-btn ${tab === 'settings' ? 'active' : ''}`} onClick={() => setTab('settings')}>
                    <Settings size={18} /> Settings
                </button>
            </div>

            <main className="admin-content">
                {tab === 'videos' && <VideosManager />}
                {tab === 'files' && <FilesManager />}
                {tab === 'settings' && <SettingsManager />}
            </main>

            <style jsx>{`
        .page-container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        .header-section { text-align: center; margin-bottom: 3rem; }
        .header-section h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem; }
        .subtitle { color: var(--text-muted); font-size: 1.1rem; }
        
        .admin-tabs { display: flex; gap: 1rem; margin-bottom: 2rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; justify-content: center; }
        .tab-btn { display: flex; align-items: center; gap: 8px; padding: 0.8rem 1.5rem; background: rgba(255,255,255,0.05); color: var(--text-muted); border-radius: 8px; transition: 0.3s; font-weight: 500; }
        .tab-btn:hover { background: rgba(255,255,255,0.1); color: white; }
        .tab-btn.active { background: var(--gradient-primary); color: white; }
        
        .admin-content { background: var(--bg-panel); padding: 2rem; border-radius: 12px; min-height: 400px; border: 1px solid var(--border-color); }
        
        @media (max-width: 768px) { 
            .admin-tabs { flex-wrap: wrap; }
            .tab-btn { flex: 1; justify-content: center; padding: 0.6rem; font-size: 0.9rem; }
        }
      `}</style>
        </div>
    );
}

function VideosManager() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [type, setType] = useState('youtube');

    useEffect(() => {
        const q = query(collection(db, 'videos'), orderBy('id', 'desc'));
        return onSnapshot(q, snap => setVideos(snap.docs.map(d => d.data() as Video)));
    }, []);

    const handleAdd = async () => {
        if (!title || !url) return alert('Missing fields');
        await addDoc(collection(db, 'videos'), {
            id: Date.now(),
            title, type, src: url,
            views: '0',
            date: new Date().toLocaleDateString()
        });
        setTitle(''); setUrl('');
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete?')) return;
        const q = query(collection(db, 'videos'), where('id', '==', id));
        const snap = await getDocs(q);
        snap.forEach(d => deleteDoc(d.ref));
    };

    return (
        <div>
            <h2>Videos</h2>
            <div className="add-box">
                <input className="input" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
                <select className="input" value={type} onChange={e => setType(e.target.value)}>
                    <option value="youtube">YouTube</option>
                    <option value="url">Direct URL</option>
                </select>
                <input className="input full" placeholder="Video URL" value={url} onChange={e => setUrl(e.target.value)} />
                <button className="btn btn-primary" onClick={handleAdd}>Add Video</button>
            </div>
            <div className="list">
                {videos.map(v => (
                    <div key={v.id} className="list-item">
                        <span>{v.title}</span>
                        <button className="btn-icon" onClick={() => handleDelete(v.id)}><Trash2 size={16} /></button>
                    </div>
                ))}
            </div>
            <style jsx>{`
        .add-box { background: rgba(0,0,0,0.2); padding: 1.5rem; border-radius: 8px; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem; }
        .full { grid-column: span 2; }
        .input { padding: 0.8rem; background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); color: white; border-radius: 6px; }
        .btn { padding: 0.8rem 1.5rem; border-radius: 6px; background: var(--gradient-primary); color: white; font-weight: 600; }
        .list-item { display: flex; justify-content: space-between; padding: 1rem; border-bottom: 1px solid var(--border-color); }
        .btn-icon { color: #ff4444; background: rgba(255,68,68,0.1); padding: 0.5rem; border-radius: 6px; }
      `}</style>
        </div>
    );
}

function FilesManager() {
    const [files, setFiles] = useState<FileItem[]>([]);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [type, setType] = useState('link');
    const [url, setUrl] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const q = query(collection(db, 'files'), orderBy('id', 'desc'));
        return onSnapshot(q, snap => setFiles(snap.docs.map(d => d.data() as FileItem)));
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            // 1️⃣ Get Signed URL
            const res = await fetch("/api/upload/sign", {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    filename: file.name,
                    contentType: file.type
                })
            });
            const { uploadUrl, fileUrl, error } = await res.json();
            if (error) throw new Error(error);

            // 2️⃣ Upload directly to R2
            const uploadRes = await fetch(uploadUrl, {
                method: 'PUT',
                body: file,
                headers: { 'Content-Type': file.type }
            });

            if (!uploadRes.ok) throw new Error('R2 Upload failed');

            // 3️⃣ Metadata Preparation (Success)
            setUrl(fileUrl);
            alert('File uploaded to R2 successfully!');
        } catch (err: any) {
            alert('Upload failed: ' + err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleAdd = async () => {
        if (!title || (!url && type === 'link')) return alert('Missing fields');
        await addDoc(collection(db, 'files'), {
            id: Date.now(), title, type, url, desc
        });
        setTitle(''); setUrl(''); setDesc('');
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete?')) return;
        const q = query(collection(db, 'files'), where('id', '==', id));
        const snap = await getDocs(q);
        snap.forEach(d => deleteDoc(d.ref));
    };

    return (
        <div>
            <h2>Files & Links</h2>
            <div className="add-box">
                <input className="input" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
                <select className="input" value={type} onChange={e => setType(e.target.value)}>
                    <option value="link">External Link</option>
                    <option value="file">File Upload</option>
                </select>
                <input className="input full" placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} />

                {type === 'link' ? (
                    <input className="input full" placeholder="URL" value={url} onChange={e => setUrl(e.target.value)} />
                ) : (
                    <div className="full">
                        <input type="file" className="input" onChange={handleFileUpload} />
                        {uploading && <span>Uploading...</span>}
                        {url && <span style={{ color: '#00ff00', marginLeft: '10px' }}>Ready: {url}</span>}
                    </div>
                )}

                <button className="btn btn-primary" onClick={handleAdd} disabled={uploading}>Add Resource</button>
            </div>
            <div className="list">
                {files.map(f => (
                    <div key={f.id} className="list-item">
                        <span>{f.title} ({f.type})</span>
                        <button className="btn-icon" onClick={() => handleDelete(f.id)}><Trash2 size={16} /></button>
                    </div>
                ))}
            </div>
            <style jsx>{`
        .add-box { background: rgba(0,0,0,0.2); padding: 1.5rem; border-radius: 8px; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem; }
        .full { grid-column: span 2; }
        .input { padding: 0.8rem; background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); color: white; border-radius: 6px; width: 100%; }
        .btn { padding: 0.8rem 1.5rem; border-radius: 6px; background: var(--gradient-primary); color: white; font-weight: 600; margin-top: 1rem; }
        .list-item { display: flex; justify-content: space-between; padding: 1rem; border-bottom: 1px solid var(--border-color); }
        .btn-icon { color: #ff4444; background: rgba(255,68,68,0.1); padding: 0.5rem; border-radius: 6px; }
      `}</style>
        </div>
    );
}

function SettingsManager() {
    const [smartLink, setSmartLink] = useState('');

    useEffect(() => {
        getDoc(doc(db, 'settings', 'ads')).then(d => {
            if (d.exists()) setSmartLink(d.data().smartLinkUrl);
        });
    }, []);

    const handleSave = async () => {
        if (!db) return alert('Database connection not ready');
        try {
            const docRef = doc(db, 'settings', 'ads');
            await setDoc(docRef, { smartLinkUrl: smartLink }, { merge: true });
            alert('Settings saved successfully!');
        } catch (error: any) {
            console.error('Save failed:', error);
            alert('Error: ' + error.message);
        }
    };

    return (
        <div>
            <h2>Monetization Settings</h2>
            <div className="add-box">
                <label style={{ marginBottom: '0.5rem', display: 'block' }}>Smart Link URL</label>
                <input className="input full" value={smartLink} onChange={e => setSmartLink(e.target.value)} />
                <button type="button" className="btn btn-primary" onClick={handleSave}>Save Settings</button>
            </div>
            <style jsx>{`
         .add-box { background: rgba(0,0,0,0.2); padding: 1.5rem; border-radius: 8px; }
         .input { padding: 0.8rem; background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); color: white; border-radius: 6px; width: 100%; margin-bottom: 1rem; }
         .btn { padding: 0.8rem 1.5rem; border-radius: 6px; background: var(--gradient-primary); color: white; font-weight: 600; }
      `}</style>
        </div>
    );
}
