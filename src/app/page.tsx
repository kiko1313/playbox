'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { getYouTubeID } from '@/lib/utils';
import Link from 'next/link';
import { Play } from 'lucide-react';

interface Video {
  id: number;
  title: string;
  type: string;
  src: string;
  views: string;
  date: string;
}

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'videos'), orderBy('id', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as Video);
      setVideos(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="page-container">
      <div className="header-section">
        <span className="badge">New Release</span>
        <h1>Unlimited Stream / <span className="text-gradient">Zero Limits</span></h1>
        <p className="subtitle">Experience high quality content curated for you.</p>
      </div>

      <div className="content-section">
        <h2 className="section-title">Trending Now</h2>

        {loading ? (
          <div className="loading-grid">Loading...</div>
        ) : (
          <div className="video-grid">
            {videos.map((video) => {
              const ytId = getYouTubeID(video.src);
              const thumb = ytId
                ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`
                : `https://picsum.photos/seed/${video.id}/400/225`;

              return (
                <Link href={`/watch/${video.id}`} key={video.id} className="video-card">
                  <div className="thumbnail-wrapper">
                    <img src={thumb} alt={video.title} className="thumbnail" />
                    <div className="play-overlay">
                      <Play fill="white" size={32} />
                    </div>
                  </div>
                  <div className="video-info">
                    <h3>{video.title}</h3>
                    <div className="meta">
                      <span>{video.views} views</span>
                      <span>•</span>
                      <span>{video.date}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        .page-container {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .header-section {
          margin-bottom: 3rem;
          text-align: center;
          padding: 2rem 0;
        }

        .badge {
          background: rgba(255,255,255,0.1);
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          margin-bottom: 1rem;
          display: inline-block;
          color: var(--color-item);
        }

        h1 {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .subtitle {
          color: var(--text-muted);
          font-size: 1.1rem;
        }

        .section-title {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          font-weight: 600;
        }

        .video-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
        }

        .video-card {
          display: block;
          transition: transform 0.3s ease;
        }

        .video-card:hover {
          transform: translateY(-5px);
        }

        .thumbnail-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          border-radius: var(--radius-md);
          overflow: hidden;
          margin-bottom: 1rem;
          border: 1px solid var(--border-color);
          background: #000;
        }

        .thumbnail {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .video-card:hover .thumbnail {
          transform: scale(1.05);
        }

        .play-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .video-card:hover .play-overlay {
          opacity: 1;
        }

        .video-info h3 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.4rem;
          line-height: 1.4;
        }

        .meta {
          font-size: 0.85rem;
          color: var(--text-muted);
          display: flex;
          gap: 8px;
        }
        
        @media (max-width: 768px) {
           h1 { font-size: 2rem; }
           .page-container { padding: 1rem; }
        }
      `}</style>
    </div>
  );
}
