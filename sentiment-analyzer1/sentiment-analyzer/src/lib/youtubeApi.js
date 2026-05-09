export function extractVideoId(url) {
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === 'youtu.be') {
            return urlObj.pathname.slice(1);
        }
        if (urlObj.hostname.includes('youtube.com')) {
            if (urlObj.pathname === '/watch') {
                return urlObj.searchParams.get('v');
            }
            if (urlObj.pathname.startsWith('/live/')) {
                return urlObj.pathname.split('/')[2];
            }
            if (urlObj.pathname.startsWith('/shorts/')) {
                return urlObj.pathname.split('/')[2];
            }
            if (urlObj.pathname.startsWith('/v/')) {
                return urlObj.pathname.split('/')[2];
            }
            if (urlObj.pathname.startsWith('/embed/')) {
                return urlObj.pathname.split('/')[2];
            }
        }
    } catch (e) {
        return null;
    }
    return null;
}

export async function fetchVideoDetails(videoId, apiKey) {
    if (apiKey === 'TEST') {
        return { isLive: false, liveChatId: null, title: 'Mock YouTube Video', commentCount: 50 };
    }

    const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,liveStreamingDetails,statistics&id=${videoId}&key=${apiKey}`);
    if (!res.ok) {
        throw new Error(`YouTube API error: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    if (!data.items || data.items.length === 0) {
        throw new Error('Video not found.');
    }
    const item = data.items[0];
    const isLive = item.snippet?.liveBroadcastContent === 'live';
    const liveChatId = item.liveStreamingDetails?.activeLiveChatId || null;
    const title = item.snippet?.title || 'YouTube Video';
    const commentCount = item.statistics?.commentCount ? parseInt(item.statistics.commentCount, 10) : 0;
    
    return { isLive, liveChatId, title, commentCount };
}

export async function fetchCommentThreads(videoId, apiKey, maxResults = 1000, onProgress) {
    if (apiKey === 'TEST') {
        let comments = [];
        for (let i = 0; i < Math.min(maxResults, 100); i++) {
            comments.push({
                id: `mock_id_${i}`,
                text: `This is a mock comment number ${i}. I absolutely love this video, it's amazing!`,
                date: new Date().toISOString(),
                author: `User${i}`,
                raw: {}
            });
        }
        if (onProgress) onProgress(comments.length);
        return comments;
    }

    let comments = [];
    let pageToken = '';
    
    while (comments.length < maxResults) {
        const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${apiKey}&maxResults=100${pageToken ? '&pageToken=' + pageToken : ''}`;
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Failed to fetch comments: ${res.statusText}`);
        }
        const data = await res.json();
        
        const newComments = data.items.map(item => {
            const topLevel = item.snippet.topLevelComment.snippet;
            return {
                id: item.id,
                text: topLevel.textDisplay,
                date: topLevel.publishedAt,
                author: topLevel.authorDisplayName,
                raw: item
            };
        });
        
        comments.push(...newComments);
        
        if (onProgress) {
            onProgress(comments.length);
        }
        
        pageToken = data.nextPageToken;
        if (!pageToken) break; 
    }
    
    return comments.slice(0, maxResults); 
}

export async function fetchLiveChatMessages(liveChatId, apiKey, pageToken = '') {
    if (apiKey === 'TEST') {
        return {
            messages: [{
                id: `mock_live_${Date.now()}`,
                text: 'Wow, great live stream!',
                date: new Date().toISOString(),
                author: 'LiveViewer1',
                raw: {}
            }],
            nextPageToken: 'mock_token',
            pollingIntervalMillis: 5000
        };
    }

    const url = `https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${liveChatId}&part=snippet,authorDetails&key=${apiKey}${pageToken ? '&pageToken=' + pageToken : ''}`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to fetch live chat: ${res.statusText}`);
    }
    const data = await res.json();
    
    const newMessages = data.items.map(item => ({
        id: item.id,
        text: item.snippet.displayMessage,
        date: item.snippet.publishedAt,
        author: item.authorDetails?.displayName,
        raw: item
    }));
    
    return {
        messages: newMessages,
        nextPageToken: data.nextPageToken,
        pollingIntervalMillis: data.pollingIntervalMillis
    };
}
