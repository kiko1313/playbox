'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Folder, Shield, LogOut, PlayCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function NavBar() {
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        window.location.href = '/';
    };

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <Link href="/" className="brand">
                    <PlayCircle size={32} color="#F22BB9" />
                    <span className="brand-text">PlayBox</span>
                </Link>

                <div className="nav-links">
                    <Link href="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
                        <Home size={20} />
                        <span>Overview</span>
                    </Link>

                    <Link href="/links" className={`nav-item ${isActive('/links') ? 'active' : ''}`}>
                        <Folder size={20} />
                        <span>Links & Files</span>
                    </Link>

                    <Link href="/admin" className={`nav-item ${isActive('/admin') ? 'active' : ''}`}>
                        <Shield size={20} />
                        <span>Admin</span>
                    </Link>

                    {user && (
                        <button onClick={handleLogout} className="nav-item logout-btn">
                            <LogOut size={20} />
                            <span className="mobile-hidden">Logout</span>
                        </button>
                    )}
                </div>
            </div>

            <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 70px;
          background: rgba(15, 14, 15, 0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-color);
          z-index: 1000;
          display: flex;
          justify-content: center;
        }

        .navbar-content {
          width: 100%;
          max-width: 1400px;
          padding: 0 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
          font-size: 1.5rem;
          color: white;
        }

        .nav-links {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0.6rem 1.2rem;
          border-radius: 50px;
          color: var(--text-muted);
          transition: all 0.3s ease;
          font-size: 0.95rem;
          font-weight: 500;
          background: transparent;
        }

        .nav-item:hover {
          color: white;
          background: rgba(255, 255, 255, 0.05);
        }

        .nav-item.active {
          color: white;
          background: var(--gradient-primary);
          box-shadow: 0 4px 15px rgba(242, 43, 185, 0.3);
        }
        
        .logout-btn {
           border: 1px solid rgba(255,255,255,0.1);
        }

        @media (max-width: 768px) {
          .brand-text { display: none; }
          .nav-links { gap: 0.5rem; }
          .nav-item span { display: none; }
          .nav-item { padding: 0.8rem; }
        }
      `}</style>
        </nav>
    );
}
