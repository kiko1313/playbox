'use client';

import { useEffect, useState, use } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { getYouTubeID } from '@/lib/utils';
import { ArrowLeft, ThumbsUp, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Video {
    id: number;
    title: string;
    type: string;
    src: string;
    views: string;
    date: string;
}

export default function WatchPage({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap params using React.use() or await in useEffect if not using Canary React
    // Since 'use client', we can use `use` from React if available, or just standard useEffect.
    // Next.js 15 requires awaiting params.
    const { id } = use(params);

    const [video, setVideo] = useState<Video | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!id) return;
        const fetchVideo = async () => {
            const q = query(collection(db, 'videos'), where('id', '==', parseInt(id)), limit(1));
            const snap = await getDocs(q);
            if (!snap.empty) {
                setVideo(snap.docs[0].data() as Video);
            }
            setLoading(false);
        };
        fetchVideo();
    }, [id]);

    if (loading) return <div className="loading">Loading Player...</div>;
    if (!video) return <div className="error">Video not found.</div>;

    const ytId = getYouTubeID(video.src);
    const isYouTube = !!ytId;

    return (
        <div className="player-page">
            <div className="player-container">
                <div className="video-wrapper">
                    {isYouTube ? (
                        <iframe
                            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
                            frameBorder="0"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                            className="iframe-player"
                        />
                    ) : (
                        <video
                            controls
                            preload="metadata"
                            className="w-full rounded-xl native-player"
                        >
                            <source src={video.src} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    )}
                </div>

                <div className="info-section">
                    <h1>{video.title}</h1>
                    <div className="meta-row">
                        <span className="views">{video.views} views • {video.date}</span>
                        <div className="actions">
                            <button className="action-btn"><ThumbsUp size={18} /> Like</button>
                            <button className="action-btn"><Share2 size={18} /> Share</button>
                        </div>
                    </div>
                    <p className="desc">
                        Premium streaming experience.
                    </p>
                </div>
            </div>

            <style jsx>{`
        .player-page {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .loading, .error { text-align: center; margin-top: 5rem; font-size: 1.2rem; color: var(--text-muted); }
        
        .video-wrapper {
          width: 100%;
          aspect-ratio: 16/9;
          background: #000;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
          margin-bottom: 1.5rem;
        }
        
        .iframe-player, .native-player {
          width: 100%;
          height: 100%;
        }
        
        .info-section h1 {
          font-size: 1.8rem;
          margin-bottom: 0.5rem;
        }
        
        .meta-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 1rem;
        }
        
        .views { color: var(--text-muted); }
        
        .actions { display: flex; gap: 1rem; }
        
        .action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.05);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          color: white;
          transition: 0.3s;
        }
        
        .action-btn:hover { background: rgba(255,255,255,0.1); }
        
        .desc { color: var(--text-muted); line-height: 1.6; }
        
        @media (max-width: 768px) {
           .meta-row { flex-direction: column; align-items: flex-start; gap: 1rem; }
           .player-page { padding: 1rem; }
        }
      `}</style>
        </div>
    );
}
