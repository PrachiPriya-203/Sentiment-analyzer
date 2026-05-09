export function extractInstagramMediaId(urlOrId) {
    if (!urlOrId) return null;
    
    // If it's a numeric ID, return as is.
    if (/^\d+$/.test(urlOrId)) {
        return urlOrId; 
    }
    
    // It's very difficult to get the Graph API Media ID from a shortcode url without another API layer.
    // We try to grab the shortcode just in case, but warn the user they typically need the numeric ID.
    try {
        const urlObj = new URL(urlOrId);
        if (urlObj.hostname.includes('instagram.com')) {
            const parts = urlObj.pathname.split('/').filter(Boolean);
            if (parts[0] === 'p' || parts[0] === 'reel') {
                return parts[1]; // Shortcode
            }
        }
    } catch(e) {}
    
    return urlOrId; 
}

export async function fetchInstagramComments(mediaId, accessToken, maxResults = 1000, onProgress) {
    let comments = [];
    let afterCursor = '';
    
    while (comments.length < maxResults) {
        let url = `https://graph.facebook.com/v19.0/${mediaId}/comments?access_token=${accessToken}&fields=id,text,timestamp,username&limit=100`;
        if (afterCursor) {
            url += `&after=${afterCursor}`;
        }

        const res = await fetch(url);
        
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(`Instagram API error: ${res.status} ${res.statusText} - ${errorData.error?.message || 'Unknown. Make sure you use a numeric Media ID and linked Page token.'}`);
        }
        
        const data = await res.json();
        
        if (!data.data || data.data.length === 0) {
            break; 
        }
        
        const newComments = data.data.map(item => ({
            id: item.id,
            text: item.text,
            date: item.timestamp,
            author: item.username || 'Unknown User',
            raw: item
        }));
        
        comments.push(...newComments);
        
        if (onProgress) {
            onProgress(comments.length);
        }
        
        afterCursor = data.paging?.cursors?.after;
        if (!afterCursor || !data.paging?.next) break; 
    }
    
    return comments.slice(0, maxResults); 
}
