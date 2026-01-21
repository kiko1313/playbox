'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { FileText, Link as LinkIcon, Download, ExternalLink } from 'lucide-react';

interface FileItem {
    id: number;
    title: string;
    type: 'file' | 'link';
    url: string;
    desc: string;
}

export default function LinksPage() {
    const [files, setFiles] = useState<FileItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [smartLink, setSmartLink] = useState('');

    useEffect(() => {
        // Fetch Files
        const q = query(collection(db, 'files'), orderBy('id', 'desc'));
        const unsubscribeFiles = onSnapshot(q, (snapshot) => {
            setFiles(snapshot.docs.map(doc => doc.data() as FileItem));
            setLoading(false);
        });

        // Fetch Smart Link Settings
        const fetchSettings = async () => {
            const docRef = doc(db, 'settings', 'ads');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setSmartLink(docSnap.data().smartLinkUrl);
            }
        };
        fetchSettings();

        return () => unsubscribeFiles();
    }, []);

    const handleLinkClick = (targetUrl: string) => {
        const AD_COOLDOWN = 30 * 60 * 1000;
        const lastClick = localStorage.getItem('playbox_last_ad_click');
        const now = Date.now();

        if (smartLink && smartLink.startsWith('http')) {
            if (!lastClick || (now - parseInt(lastClick)) > AD_COOLDOWN) {
                window.open(smartLink, '_blank');
                localStorage.setItem('playbox_last_ad_click', now.toString());

                // Open target after delay
                setTimeout(() => {
                    window.open(targetUrl, '_blank');
                }, 100);
            } else {
                window.open(targetUrl, '_blank');
            }
        } else {
            window.open(targetUrl, '_blank');
        }
    };

    return (
        <div className="page-container">
            <div className="header">
                <h1>Files & <span className="text-gradient">Resources</span></h1>
                <p className="subtitle">Curated tools, downloads, and external links.</p>
            </div>

            <div className="resources-grid">
                {loading ? <p>Loading resources...</p> : files.map((file) => (
                    <div key={file.id} className="resource-card" onClick={() => handleLinkClick(file.url)}>
                        <div className="icon-box">
                            {file.type === 'file' ? <FileText size={24} /> : <LinkIcon size={24} />}
                        </div>
                        <div className="info">
                            <h3>{file.title}</h3>
                            <p>{file.desc}</p>
                        </div>
                        <div className="action-icon">
                            {file.type === 'file' ? <Download size={20} /> : <ExternalLink size={20} />}
                        </div>
                    </div>
                ))}
                {!loading && files.length === 0 && <p className="empty-state">No files available yet.</p>}
            </div>

            <style jsx>{`
        .page-container {
          padding: 3rem 2rem;
          max-width: 1000px;
          margin: 0 auto;
        }
        
        .header {
          margin-bottom: 3rem;
          text-align: center;
        }

        h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
        .subtitle { color: var(--text-muted); }

        .resources-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .resource-card {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          background: var(--bg-card);
          padding: 1.5rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .resource-card:hover {
          background: rgba(255,255,255,0.05);
          border-color: var(--primary);
          transform: translateX(5px);
        }

        .icon-box {
          width: 50px;
          height: 50px;
          background: rgba(242, 43, 185, 0.1);
          color: var(--primary);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .info { flex: 1; }

        .info h3 {
          font-size: 1.1rem;
          margin-bottom: 0.3rem;
        }

        .info p {
           font-size: 0.9rem;
           color: var(--text-muted);
        }

        .action-icon {
          color: var(--text-muted);
          transition: color 0.3s;
        }

        .resource-card:hover .action-icon {
          color: white;
        }
        
        .empty-state { text-align: center; color: var(--text-muted); padding: 2rem; }
      `}</style>
        </div>
    );
}
