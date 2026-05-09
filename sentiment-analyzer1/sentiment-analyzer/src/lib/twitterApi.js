export function extractTweetId(url) {
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname.includes('twitter.com') || urlObj.hostname.includes('x.com')) {
            const parts = urlObj.pathname.split('/');
            const statusIndex = parts.indexOf('status');
            if (statusIndex !== -1 && parts.length > statusIndex + 1) {
                return parts[statusIndex + 1];
            }
        }
    } catch (e) {
        return null;
    }
    return null;
}

export async function fetchTwitterReplies(tweetId, bearerToken, maxResults = 1000, onProgress) {
    let comments = [];
    let nextToken = '';
    
    while (comments.length < maxResults) {
        let url = `https://api.twitter.com/2/tweets/search/all?query=conversation_id:${tweetId}&tweet.fields=author_id,created_at&expansions=author_id&user.fields=username,name&max_results=100`;
        if (nextToken) {
            url += `&next_token=${nextToken}`;
        }

        const res = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${bearerToken}`
            }
        });
        
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Twitter API error: ${res.status} ${res.statusText} - ${errorText}`);
        }
        
        const data = await res.json();
        
        if (!data.data || data.data.length === 0) {
            break; // No more replies
        }
        
        const users = data.includes?.users || [];
        const userMap = {};
        users.forEach(u => {
            userMap[u.id] = u.name || u.username;
        });
        
        const newComments = data.data.map(item => ({
            id: item.id,
            text: item.text,
            date: item.created_at,
            author: userMap[item.author_id] || 'Unknown User',
            raw: item
        }));
        
        comments.push(...newComments);
        
        if (onProgress) {
            onProgress(comments.length);
        }
        
        nextToken = data.meta?.next_token;
        if (!nextToken) break; 
    }
    
    return comments.slice(0, maxResults); 
}
