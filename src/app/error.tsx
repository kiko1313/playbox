'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="error-container">
            <div className="content">
                <AlertCircle size={80} color="#F22BB9" className="error-icon" />
                <h1>Oops!</h1>
                <h2>Something went wrong</h2>
                <p>A technical glitch interrupted the stream.</p>
                <button className="reset-btn" onClick={() => reset()}>
                    <RefreshCw size={18} /> Try Again
                </button>
            </div>

            <style jsx>{`
        .error-container {
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

        .error-icon {
          margin-bottom: 1.5rem;
        }

        h1 {
          font-size: 4rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          color: white;
        }

        h2 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: var(--primary);
        }

        p {
          color: var(--text-muted);
          margin-bottom: 2rem;
        }

        .reset-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 255, 255, 0.05);
          color: white;
          padding: 0.8rem 2rem;
          border-radius: 50px;
          font-weight: 600;
          transition: 0.3s;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .reset-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--primary);
        }
      `}</style>
        </div>
    );
}
