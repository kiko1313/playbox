'use client';

import Link from 'next/link';
import { Ghost } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="not-found-container">
            <div className="content">
                <Ghost size={80} color="#F22BB9" className="ghost-icon" />
                <h1>404</h1>
                <h2>Page Not Found</h2>
                <p>The content you are looking for has vanished into the void.</p>
                <Link href="/" className="back-btn">
                    Back to Safety
                </Link>
            </div>

            <style jsx>{`
        .not-found-container {
          min-height: calc(100vh - 70px);
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 2rem;
          background: var(--bg-dark);
        }

        .content {
          max-width: 400px;
        }

        .ghost-icon {
          margin-bottom: 1.5rem;
          animation: float 3s ease-in-out infinite;
        }

        h1 {
          font-size: 5rem;
          font-weight: 800;
          line-height: 1;
          margin-bottom: 0.5rem;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        h2 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: white;
        }

        p {
          color: var(--text-muted);
          margin-bottom: 2rem;
        }

        .back-btn {
          display: inline-block;
          background: var(--gradient-primary);
          color: white;
          padding: 0.8rem 2rem;
          border-radius: 50px;
          font-weight: 600;
          transition: 0.3s;
          box-shadow: 0 4px 20px rgba(242, 43, 185, 0.3);
        }

        .back-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(242, 43, 185, 0.5);
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
        </div>
    );
}
