import { useState, useCallback, useRef, useEffect } from 'react';
import UploadZone from './components/UploadZone.jsx';
import ProgressBar from './components/ProgressBar.jsx';
import StatsPanel from './components/StatsPanel.jsx';
import SentimentPieChart from './components/SentimentPieChart.jsx';
import SentimentTrendChart from './components/SentimentTrendChart.jsx';
import LiveSentimentTrendChart from './components/LiveSentimentTrendChart.jsx';
import ScoreHistogram from './components/ScoreHistogram.jsx';
import TopCommentsTable from './components/TopCommentsTable.jsx';
import WordCloudPanel from './components/WordCloudPanel.jsx';
import SummaryPanel from './components/SummaryPanel.jsx';
import InteractiveBackground from './components/InteractiveBackground.jsx';
import { parseFile, generateSampleData } from './lib/dataParser.js';
import { getTopWords, analyzeComment } from './lib/sentimentEngine.js';
import { useScrollReveal } from './lib/useScrollReveal.jsx';
import SentimentWorker from './sentiment.worker.js?worker';
import { extractVideoId, fetchVideoDetails, fetchCommentThreads, fetchLiveChatMessages } from './lib/youtubeApi.js';
import { extractTweetId, fetchTwitterReplies } from './lib/twitterApi.js';
import { extractFacebookPostId, fetchFacebookComments } from './lib/facebookApi.js';
import { extractInstagramMediaId, fetchInstagramComments } from './lib/instagramApi.js';

const STATE = { IDLE: 'idle', PARSING: 'parsing', PROCESSING: 'processing', DONE: 'done', FETCHING_YT: 'fetching_yt', LIVE_POLLING: 'live_polling', FETCHING_TWITTER: 'fetching_twitter', FETCHING_FACEBOOK: 'fetching_facebook', FETCHING_INSTAGRAM: 'fetching_instagram' };

function Dashboard({ results, topWords, fileName, onReset, onExport, isLivePolling }) {
    useScrollReveal();
    return (
        <main className="dashboard fade-in">
            <div className="dashboard-header reveal">
                <div>
                    <h2 className="dashboard-title">
                        {isLivePolling ? '🔴 Live Sentiment Analysis' : '📊 Analysis Results'}
                    </h2>
                    <p className="dashboard-sub">
                        {fileName && (
                            <span style={{ fontFamily: 'var(--mono)', color: 'var(--accent-mid)', marginRight: 8 }}>{fileName}</span>
                        )}
                        {results.length.toLocaleString()} messages analyzed
                    </p>
                </div>
                <div className="toolbar">
                    <span className="results-count">{results.length.toLocaleString()} results</span>
                    <button className="btn btn-ghost btn-sm" onClick={onReset}>
                        {isLivePolling ? '⏹ Stop & Reset' : '↺ New Analysis'}
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={onExport}>⬇ Export CSV</button>
                </div>
            </div>

            <div className="reveal delay-1">
                <div className="section-label">📈 Overview Statistics</div>
                <StatsPanel results={results} />
            </div>

            <div className="reveal delay-1">
                <div className="section-label">📊 Sentiment Charts</div>
                <div className="charts-row">
                    <SentimentPieChart results={results} />
                    {isLivePolling ? <LiveSentimentTrendChart results={results} /> : <SentimentTrendChart results={results} />}
                </div>
            </div>

            <div className="reveal">
                <div className="section-label">📉 Score Distribution</div>
                <ScoreHistogram results={results} />
            </div>

            <div className="reveal">
                <div className="section-label">☁️ Keyword Frequency</div>
                <WordCloudPanel words={topWords} />
            </div>

            <div className="reveal">
                <div className="section-label">💬 Comment Explorer</div>
                <TopCommentsTable results={results} />
            </div>

            <div className="reveal">
                <div className="section-label">✨ AI Summary</div>
                <SummaryPanel results={results} />
            </div>
        </main>
    );
}

export default function App() {
    const [state, setState] = useState(STATE.IDLE);
    const [progress, setProgress] = useState(0);
    const [processed, setProcessed] = useState(0);
    const [total, setTotal] = useState(0);
    const [results, setResults] = useState([]);
    const [topWords, setTopWords] = useState([]);
    const [error, setError] = useState(null);
    const [fileName, setFileName] = useState('');
    const workerRef = useRef(null);
    const livePollRef = useRef(null);
    const resultsRef = useRef([]);

    const handleReset = () => {
        if (workerRef.current) { workerRef.current.terminate(); workerRef.current = null; }
        if (livePollRef.current) { clearTimeout(livePollRef.current); livePollRef.current = null; }
        setState(STATE.IDLE); 
        setResults([]); 
        setTopWords([]); 
        setError(null); 
        setFileName('');
        resultsRef.current = [];
    };

    const processComments = useCallback((comments, name = '') => {
        handleReset();
        setError(null);
        setFileName(name);
        setTotal(comments.length);
        setProcessed(0);
        setProgress(0);
        setState(STATE.PROCESSING);

        const worker = new SentimentWorker();
        workerRef.current = worker;

        worker.onmessage = (e) => {
            const { type, progress: p, processed: proc, results: res } = e.data;
            if (type === 'progress') {
                setProgress(p);
                setProcessed(proc);
            } else if (type === 'done') {
                setResults(res);
                setTopWords(getTopWords(res));
                setState(STATE.DONE);
                setProgress(100);
                setProcessed(res.length);
                worker.terminate();
            }
        };
        worker.onerror = (err) => {
            setError('Worker error: ' + err.message);
            setState(STATE.IDLE);
        };
        worker.postMessage({ comments });
    }, []);

    const handleFileSelect = useCallback((file) => {
        setState(STATE.PARSING);
        setError(null);
        parseFile(
            file,
            (comments) => processComments(comments, file.name),
            (err) => { setError(err.message || 'Failed to parse file.'); setState(STATE.IDLE); }
        );
    }, [processComments]);

    const handleSampleLoad = useCallback((count) => {
        processComments(generateSampleData(count), `sample-${count.toLocaleString()}.csv`);
    }, [processComments]);

    const handleYoutubeSubmit = async (url, apiKey, maxComments = 5000) => {
        handleReset();
        const videoId = extractVideoId(url);
        if (!videoId) {
            setError("Invalid YouTube URL.");
            return;
        }

        setState(STATE.FETCHING_YT);
        try {
            const details = await fetchVideoDetails(videoId, apiKey);
            setFileName(details.title);
            
            if (details.isLive) {
                if (!details.liveChatId) {
                    throw new Error("Live chat is disabled or unavailable for this stream.");
                }
                setState(STATE.LIVE_POLLING);
                startLivePolling(details.liveChatId, apiKey);
            } else {
                const expectedTotal = Math.min(details.commentCount || maxComments, maxComments);
                const comments = await fetchCommentThreads(videoId, apiKey, maxComments, (c) => {
                    setProgress(Math.min(100, (c / expectedTotal) * 100));
                    setProcessed(c);
                    setTotal(expectedTotal); 
                });
                processComments(comments, details.title);
            }
        } catch (err) {
            setError(err.message);
            setState(STATE.IDLE);
        }
    };

    const handleTwitterSubmit = async (url, bearerToken, maxComments = 5000) => {
        handleReset();
        const tweetId = extractTweetId(url);
        if (!tweetId) {
            setError("Invalid X (Twitter) URL.");
            return;
        }

        setState(STATE.FETCHING_TWITTER);
        try {
            setFileName(`X Post ${tweetId}`);
            const comments = await fetchTwitterReplies(tweetId, bearerToken, maxComments, (c) => {
                setProgress(Math.min(100, (c / maxComments) * 100));
                setProcessed(c);
                setTotal(maxComments); 
            });
            processComments(comments, `X Replies - ${tweetId}`);
        } catch (err) {
            setError(err.message);
            setState(STATE.IDLE);
        }
    };

    const handleFacebookSubmit = async (postIdInput, accessToken, maxComments = 5000) => {
        handleReset();
        const postId = extractFacebookPostId(postIdInput);
        if (!postId) {
            setError("Invalid Facebook Post ID.");
            return;
        }

        setState(STATE.FETCHING_FACEBOOK);
        try {
            setFileName(`Facebook Post ${postId}`);
            const comments = await fetchFacebookComments(postId, accessToken, maxComments, (c) => {
                setProgress(Math.min(100, (c / maxComments) * 100));
                setProcessed(c);
                setTotal(maxComments); 
            });
            processComments(comments, `FB Comments - ${postId}`);
        } catch (err) {
            setError(err.message);
            setState(STATE.IDLE);
        }
    };

    const handleInstagramSubmit = async (mediaIdInput, accessToken, maxComments = 5000) => {
        handleReset();
        const mediaId = extractInstagramMediaId(mediaIdInput);
        if (!mediaId) {
            setError("Invalid Instagram Media ID.");
            return;
        }

        setState(STATE.FETCHING_INSTAGRAM);
        try {
            setFileName(`IG Post ${mediaId}`);
            const comments = await fetchInstagramComments(mediaId, accessToken, maxComments, (c) => {
                setProgress(Math.min(100, (c / maxComments) * 100));
                setProcessed(c);
                setTotal(maxComments); 
            });
            processComments(comments, `IG Comments - ${mediaId}`);
        } catch (err) {
            setError(err.message);
            setState(STATE.IDLE);
        }
    };

    const startLivePolling = (liveChatId, apiKey) => {
        let pageToken = '';
        
        const poll = async () => {
            try {
                const data = await fetchLiveChatMessages(liveChatId, apiKey, pageToken);
                pageToken = data.nextPageToken;
                
                if (data.messages && data.messages.length > 0) {
                    const analyzed = data.messages.map(m => ({
                        ...m,
                        ...analyzeComment(m.text)
                    }));
                    resultsRef.current = [...resultsRef.current, ...analyzed];
                    
                    if (resultsRef.current.length > 20000) {
                        resultsRef.current = resultsRef.current.slice(resultsRef.current.length - 20000);
                    }
                    
                    setResults([...resultsRef.current]);
                    setTopWords(getTopWords(resultsRef.current));
                }
                
                livePollRef.current = setTimeout(poll, data.pollingIntervalMillis || 5000);
            } catch (err) {
                setError(err.message);
                setState(STATE.IDLE);
            }
        };
        
        poll();
    };

    const handleExport = () => {
        const headers = ['id', 'text', 'sentiment', 'score', 'date', 'author'];
        const rows = results.map(r => [
            r.id || '', `"${(r.text || '').replace(/"/g, '""')}"`, r.label || '', r.score || 0, r.date || '', `"${(r.author || '').replace(/"/g, '""')}"`
        ]);
        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `voxsense-results-${Date.now()}.csv`;
        a.click(); URL.revokeObjectURL(url);
    };

    const isProcessing = state === STATE.PARSING || state === STATE.PROCESSING || state === STATE.FETCHING_YT || state === STATE.FETCHING_TWITTER || state === STATE.FETCHING_FACEBOOK || state === STATE.FETCHING_INSTAGRAM;
    const isDashboard = state === STATE.DONE || state === STATE.LIVE_POLLING;

    return (
        <div className="app">
            <InteractiveBackground />
            <nav className="navbar">
                <div className="navbar-brand">
                    <div className="navbar-logo">
                        <img src="/logo.png" alt="VoxSense" />
                    </div>
                    <div>
                        <div className="navbar-name"><span>Vox</span>Sense</div>
                        <div className="navbar-tagline">Sentiment Intelligence Platform</div>
                    </div>
                </div>
                <div className="navbar-right">
                    {isDashboard && (
                        <>
                            <span className="nav-pill">
                                <span className={state === STATE.LIVE_POLLING ? "nav-dot error" : "nav-dot"} style={state === STATE.LIVE_POLLING ? {backgroundColor: '#ff3366', boxShadow: '0 0 8px #ff3366'} : {}} />
                                {results.length.toLocaleString()} analyzed
                            </span>
                            <button className="btn btn-ghost btn-sm" onClick={handleReset}>↺ Reset</button>
                            <button className="btn btn-primary btn-sm" onClick={handleExport}>⬇ Export</button>
                        </>
                    )}
                    {state === STATE.IDLE && (
                        <span className="nav-pill" style={{ background: 'var(--accent-pill)', color: 'var(--accent)', borderColor: 'rgba(124,58,237,0.2)' }}>
                            ✨ Ready
                        </span>
                    )}
                </div>
            </nav>

            {state === STATE.IDLE && (
                <section className="hero">
                    <div className="hero-orb hero-orb-1" />
                    <div className="hero-orb hero-orb-2" />
                    <span className="hero-eyebrow">🔬 Powered by AFINN-165 + Emoji Intelligence</span>
                    <h1>
                        Understand What People<br />
                        <span className="gradient-text">Really Feel</span>
                    </h1>
                    <p className="hero-sub">
                        Upload comment data from any social platform or paste a YouTube URL and get deep sentiment insights — with beautiful charts, keyword trends, and AI-quality narrative summaries.
                    </p>
                    <div className="hero-badges">
                        <span className="hero-badge">⚡ 50K+ Comments</span>
                        <span className="hero-badge">📺 YouTube</span>
                        <span className="hero-badge">𝕏 Twitter</span>
                        <span className="hero-badge">📘 Facebook</span>
                        <span className="hero-badge">📷 Instagram</span>
                        <span className="hero-badge">📊 {state === STATE.LIVE_POLLING ? 'Live Graph' : '6 Chart Types'}</span>
                        <span className="hero-badge">😀 Emoji Scoring</span>
                        <span className="hero-badge">💾 Export CSV</span>
                    </div>
                </section>
            )}

            {error && (
                <div style={{ padding: '0 48px 16px' }}>
                    <div className="error-banner">⚠️ {error}</div>
                </div>
            )}

            {!isDashboard && (
                <UploadZone
                    onFileSelect={handleFileSelect}
                    onSampleLoad={handleSampleLoad}
                    onYoutubeSubmit={handleYoutubeSubmit}
                    onTwitterSubmit={handleTwitterSubmit}
                    onFacebookSubmit={handleFacebookSubmit}
                    onInstagramSubmit={handleInstagramSubmit}
                    isProcessing={isProcessing}
                />
            )}

            {isProcessing && (
                <ProgressBar progress={progress} processed={processed} total={total} />
            )}

            {isDashboard && results.length > 0 && (
                <Dashboard
                    results={results}
                    topWords={topWords}
                    fileName={fileName}
                    onReset={handleReset}
                    onExport={handleExport}
                    isLivePolling={state === STATE.LIVE_POLLING}
                />
            )}

            <footer className="footer">
                <img src="/logo.png" alt="VoxSense" />
                VoxSense · Sentiment Intelligence · No data leaves your browser · Built with AFINN-165 Lexicon
            </footer>
        </div>
    );
}
