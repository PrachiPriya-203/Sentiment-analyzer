import { useRef, useState, useEffect } from 'react';

export default function UploadZone({ onFileSelect, onSampleLoad, onYoutubeSubmit, onTwitterSubmit, onFacebookSubmit, onInstagramSubmit, isProcessing }) {
    const [dragging, setDragging] = useState(false);
    const [tab, setTab] = useState('file'); 
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [twitterUrl, setTwitterUrl] = useState('');
    const [twitterBearer, setTwitterBearer] = useState('');
    const [facebookPostId, setFacebookPostId] = useState('');
    const [facebookToken, setFacebookToken] = useState('');
    const [instagramMediaId, setInstagramMediaId] = useState('');
    const [instagramToken, setInstagramToken] = useState('');
    const [maxComments, setMaxComments] = useState(5000);
    const inputRef = useRef();

    useEffect(() => {
        const savedKey = localStorage.getItem('youtube_api_key');
        if (savedKey) setApiKey(savedKey);
        const savedBearer = localStorage.getItem('twitter_bearer_token');
        if (savedBearer) setTwitterBearer(savedBearer);
        const savedFbToken = localStorage.getItem('facebook_access_token');
        if (savedFbToken) setFacebookToken(savedFbToken);
        const savedIgToken = localStorage.getItem('instagram_access_token');
        if (savedIgToken) setInstagramToken(savedIgToken);
    }, []);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        if (tab !== 'file') return;
        const file = e.dataTransfer.files[0];
        if (file) onFileSelect(file);
    };

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) onFileSelect(file);
        e.target.value = '';
    };

    const handleYoutubeSubmit = (e) => {
        e.preventDefault();
        if (!youtubeUrl || !apiKey) return;
        localStorage.setItem('youtube_api_key', apiKey);
        onYoutubeSubmit(youtubeUrl, apiKey, maxComments);
    };

    const handleTwitterSubmit = (e) => {
        e.preventDefault();
        if (!twitterUrl || !twitterBearer) return;
        localStorage.setItem('twitter_bearer_token', twitterBearer);
        onTwitterSubmit(twitterUrl, twitterBearer, maxComments);
    };

    const handleFacebookSubmit = (e) => {
        e.preventDefault();
        if (!facebookPostId || !facebookToken) return;
        localStorage.setItem('facebook_access_token', facebookToken);
        onFacebookSubmit(facebookPostId, facebookToken, maxComments);
    };

    const handleInstagramSubmit = (e) => {
        e.preventDefault();
        if (!instagramMediaId || !instagramToken) return;
        localStorage.setItem('instagram_access_token', instagramToken);
        onInstagramSubmit(instagramMediaId, instagramToken, maxComments);
    };

    return (
        <section className="upload-section">
            <div className="tabs" style={{ display: 'flex', gap: 10, marginBottom: 16, justifyContent: 'center' }}>
                <button 
                    className={`btn ${tab === 'file' ? 'btn-primary' : 'btn-secondary'}`} 
                    onClick={() => setTab('file')}
                    disabled={isProcessing}
                >📁 File Upload</button>
                <button 
                    className={`btn ${tab === 'youtube' ? 'btn-primary' : 'btn-secondary'}`} 
                    onClick={() => setTab('youtube')}
                    disabled={isProcessing}
                >▶️ YouTube Analyzer</button>
                <button 
                    className={`btn ${tab === 'twitter' ? 'btn-primary' : 'btn-secondary'}`} 
                    onClick={() => setTab('twitter')}
                    disabled={isProcessing}
                >𝕏 Twitter Analyzer</button>
                <button 
                    className={`btn ${tab === 'facebook' ? 'btn-primary' : 'btn-secondary'}`} 
                    onClick={() => setTab('facebook')}
                    disabled={isProcessing}
                >📘 Facebook Analyzer</button>
                <button 
                    className={`btn ${tab === 'instagram' ? 'btn-primary' : 'btn-secondary'}`} 
                    onClick={() => setTab('instagram')}
                    disabled={isProcessing}
                >📷 Instagram Analyzer</button>
            </div>

            {tab === 'file' && (
                <div
                    className={`upload-zone${dragging ? ' dragging' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => !isProcessing && inputRef.current.click()}
                >
                    <span className="upload-icon">📥</span>
                    <h3>Drop your comment dataset here</h3>
                    <p>Supports CSV, JSON, and TXT — up to 50,000+ comments at a time</p>
                    <p style={{ marginTop: 6, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        CSV: auto-detects <code style={{ background: 'var(--bg-secondary)', padding: '1px 6px', borderRadius: 4 }}>text</code>,&nbsp;
                        <code style={{ background: 'var(--bg-secondary)', padding: '1px 6px', borderRadius: 4 }}>comment</code>,&nbsp;
                        <code style={{ background: 'var(--bg-secondary)', padding: '1px 6px', borderRadius: 4 }}>review</code>,&nbsp;
                        <code style={{ background: 'var(--bg-secondary)', padding: '1px 6px', borderRadius: 4 }}>tweet</code>&nbsp;columns
                    </p>
                    <div className="upload-actions" onClick={(e) => e.stopPropagation()}>
                        <button className="btn btn-primary" disabled={isProcessing} onClick={() => inputRef.current.click()}>
                            📂 Browse File
                        </button>
                        <button className="btn btn-secondary" disabled={isProcessing} onClick={() => onSampleLoad(1000)}>
                            🎲 Load 1K Sample
                        </button>
                        <button className="btn btn-secondary" disabled={isProcessing} onClick={() => onSampleLoad(50000)}>
                            ⚡ Load 50K Sample
                        </button>
                    </div>
                    <input
                        ref={inputRef}
                        type="file"
                        className="file-input-hidden"
                        accept=".csv,.json,.txt"
                        onChange={handleChange}
                    />
                </div>
            )}

            {tab === 'youtube' && (
                <div className="card card-inner" style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
                    <span className="upload-icon" style={{ marginBottom: 16 }}>▶️</span>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Analyze YouTube Comments & Live Streams</h3>
                    <p style={{ marginBottom: 24, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Paste a YouTube video or live stream URL to analyze sentiment in real-time.</p>
                    
                    <form onSubmit={handleYoutubeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400, margin: '0 auto', textAlign: 'left' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 600 }}>
                                YouTube URL (Video or Live Stream)
                            </label>
                            <input 
                                type="url" 
                                required
                                disabled={isProcessing}
                                placeholder="https://www.youtube.com/watch?v=..."
                                value={youtubeUrl}
                                onChange={e => setYoutubeUrl(e.target.value)}
                                style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 600 }}>
                                YouTube Data API v3 Key <span style={{ fontSize: 11, color: 'var(--negative)' }}>(Required)</span>
                            </label>
                            <input 
                                type="password" 
                                required
                                disabled={isProcessing}
                                placeholder="AIzaSy..."
                                value={apiKey}
                                onChange={e => setApiKey(e.target.value)}
                                style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                            />
                            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
                                Your key is saved locally in your browser and never sent to our servers.
                            </p>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 600 }}>
                                Max Comments to Fetch
                            </label>
                            <select 
                                disabled={isProcessing}
                                value={maxComments}
                                onChange={e => setMaxComments(Number(e.target.value))}
                                style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                            >
                                <option value={1000}>1,000</option>
                                <option value={5000}>5,000 (Default)</option>
                                <option value={10000}>10,000</option>
                                <option value={50000}>50,000</option>
                                <option value={100000}>100,000 (High API Cost)</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={isProcessing} style={{ marginTop: 8, display: 'flex', justifyContent: 'center' }}>
                            {isProcessing ? 'Connecting...' : 'Fetch & Analyze'}
                        </button>
                    </form>
                </div>
            )}

            {tab === 'twitter' && (
                <div className="card card-inner" style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
                    <span className="upload-icon" style={{ marginBottom: 16 }}>𝕏</span>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Analyze X (Twitter) Replies</h3>
                    <p style={{ marginBottom: 24, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Paste an X (Twitter) post URL to analyze the sentiment of its replies.</p>
                    
                    <form onSubmit={handleTwitterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400, margin: '0 auto', textAlign: 'left' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 600 }}>
                                X (Twitter) Post URL
                            </label>
                            <input 
                                type="url" 
                                required
                                disabled={isProcessing}
                                placeholder="https://x.com/user/status/123456789"
                                value={twitterUrl}
                                onChange={e => setTwitterUrl(e.target.value)}
                                style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 600 }}>
                                Bearer Token <span style={{ fontSize: 11, color: 'var(--negative)' }}>(Required)</span>
                            </label>
                            <input 
                                type="password" 
                                required
                                disabled={isProcessing}
                                placeholder="AAAAAAAAAAAAAAAAAAAA..."
                                value={twitterBearer}
                                onChange={e => setTwitterBearer(e.target.value)}
                                style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                            />
                            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
                                Your Bearer Token is saved locally in your browser and never sent to our servers.
                            </p>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 600 }}>
                                Max Replies to Fetch
                            </label>
                            <select 
                                disabled={isProcessing}
                                value={maxComments}
                                onChange={e => setMaxComments(Number(e.target.value))}
                                style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                            >
                                <option value={100}>100</option>
                                <option value={500}>500</option>
                                <option value={1000}>1,000</option>
                                <option value={5000}>5,000</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={isProcessing} style={{ marginTop: 8, display: 'flex', justifyContent: 'center' }}>
                            {isProcessing ? 'Connecting...' : 'Fetch & Analyze'}
                        </button>
                    </form>
                </div>
            )}

            {tab === 'facebook' && (
                <div className="card card-inner" style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
                    <span className="upload-icon" style={{ marginBottom: 16 }}>📘</span>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Analyze Facebook Post Comments</h3>
                    <p style={{ marginBottom: 24, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Enter a Facebook Object/Post ID to analyze the sentiment of its comments.</p>
                    
                    <form onSubmit={handleFacebookSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400, margin: '0 auto', textAlign: 'left' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 600 }}>
                                Facebook Post / Object ID
                            </label>
                            <input 
                                type="text" 
                                required
                                disabled={isProcessing}
                                placeholder="123456789_987654321..."
                                value={facebookPostId}
                                onChange={e => setFacebookPostId(e.target.value)}
                                style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 600 }}>
                                Graph API Token <span style={{ fontSize: 11, color: 'var(--negative)' }}>(Required)</span>
                            </label>
                            <input 
                                type="password" 
                                required
                                disabled={isProcessing}
                                placeholder="EAA..."
                                value={facebookToken}
                                onChange={e => setFacebookToken(e.target.value)}
                                style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                            />
                            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
                                Your Token is saved locally in your browser and never sent to our servers.
                            </p>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 600 }}>
                                Max Comments to Fetch
                            </label>
                            <select 
                                disabled={isProcessing}
                                value={maxComments}
                                onChange={e => setMaxComments(Number(e.target.value))}
                                style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                            >
                                <option value={100}>100</option>
                                <option value={500}>500</option>
                                <option value={1000}>1,000</option>
                                <option value={5000}>5,000</option>
                                <option value={20000}>20,000</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={isProcessing} style={{ marginTop: 8, display: 'flex', justifyContent: 'center' }}>
                            {isProcessing ? 'Connecting...' : 'Fetch & Analyze'}
                        </button>
                    </form>
                </div>
            )}

            {tab === 'instagram' && (
                <div className="card card-inner" style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
                    <span className="upload-icon" style={{ marginBottom: 16 }}>📷</span>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Analyze Instagram Post Comments</h3>
                    <p style={{ marginBottom: 24, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Enter an Instagram Media ID to analyze the sentiment of its comments.</p>
                    
                    <form onSubmit={handleInstagramSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400, margin: '0 auto', textAlign: 'left' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 600 }}>
                                Instagram Media ID <span style={{ fontSize: 11, color: 'var(--negative)' }}>(Required)</span>
                            </label>
                            <input 
                                type="text" 
                                required
                                disabled={isProcessing}
                                placeholder="178... (Numeric Graph API ID)"
                                value={instagramMediaId}
                                onChange={e => setInstagramMediaId(e.target.value)}
                                style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 600 }}>
                                Graph API Token
                            </label>
                            <input 
                                type="password" 
                                required
                                disabled={isProcessing}
                                placeholder="EAAG..."
                                value={instagramToken}
                                onChange={e => setInstagramToken(e.target.value)}
                                style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                            />
                            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
                                Your Token is saved locally in your browser and never sent to our servers.
                            </p>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 600 }}>
                                Max Comments to Fetch
                            </label>
                            <select 
                                disabled={isProcessing}
                                value={maxComments}
                                onChange={e => setMaxComments(Number(e.target.value))}
                                style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                            >
                                <option value={100}>100</option>
                                <option value={500}>500</option>
                                <option value={1000}>1,000</option>
                                <option value={5000}>5,000</option>
                                <option value={20000}>20,000</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={isProcessing} style={{ marginTop: 8, display: 'flex', justifyContent: 'center' }}>
                            {isProcessing ? 'Connecting...' : 'Fetch & Analyze'}
                        </button>
                    </form>
                </div>
            )}
        </section>
    );
}
