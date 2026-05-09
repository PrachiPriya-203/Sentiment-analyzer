export function extractFacebookPostId(urlOrId) {
    if (!urlOrId) return null;
    if (/^\d+(_\d+)?$/.test(urlOrId)) {
        return urlOrId; 
    }
    
    try {
        const urlObj = new URL(urlOrId);
        if (urlObj.hostname.includes('facebook.com')) {
            const fbid = urlObj.searchParams.get('fbid');
            if (fbid) return fbid;
            
            const parts = urlObj.pathname.split('/').filter(Boolean);
            if (parts.includes('posts')) {
                return parts[parts.indexOf('posts') + 1];
            }
        }
    } catch(e) {}
    
    return urlOrId; 
}

export async function fetchFacebookComments(postId, accessToken, maxResults = 1000, onProgress) {
    let comments = [];
    let afterCursor = '';
    
    while (comments.length < maxResults) {
        let url = `https://graph.facebook.com/v19.0/${postId}/comments?access_token=${accessToken}&fields=id,message,created_time,from&limit=100`;
        if (afterCursor) {
            url += `&after=${afterCursor}`;
        }

        const res = await fetch(url);
        
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(`Facebook API error: ${res.status} ${res.statusText} - ${errorData.error?.message || 'Unknown'}`);
        }
        
        const data = await res.json();
        
        if (!data.data || data.data.length === 0) {
            break; 
        }
        
        const newComments = data.data.map(item => ({
            id: item.id,
            text: item.message,
            date: item.created_time,
            author: item.from?.name || 'Unknown User',
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
