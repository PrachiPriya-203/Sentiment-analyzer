import Papa from 'papaparse';

const TEXT_COLUMNS = ['text', 'comment', 'body', 'content', 'message', 'tweet', 'review', 'post', 'description', 'caption', 'feedback', 'response'];
const DATE_COLUMNS = ['date', 'created_at', 'timestamp', 'time', 'datetime', 'published_at', 'posted_at'];

function detectColumn(headers, candidates) {
    for (const candidate of candidates) {
        const found = headers.find(h => h.toLowerCase().trim() === candidate);
        if (found) return found;
    }
    return headers.find(h => !['id', 'likes', 'shares', 'retweets', 'count', 'score'].includes(h.toLowerCase())) || headers[0];
}

export function parseCSV(file, onComplete, onError) {
    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        worker: false,
        complete: (results) => {
            const headers = results.meta.fields || [];
            const textCol = detectColumn(headers, TEXT_COLUMNS);
            const dateCol = headers.find(h => DATE_COLUMNS.includes(h.toLowerCase().trim()));

            const comments = results.data
                .map((row, i) => ({
                    id: i,
                    text: String(row[textCol] || '').trim(),
                    date: dateCol ? row[dateCol] : null,
                    raw: row
                }))
                .filter(c => c.text.length > 0);

            onComplete(comments);
        },
        error: onError
    });
}

export function parseJSON(file, onComplete, onError) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            const arr = Array.isArray(data) ? data : data.data || data.comments || data.results || Object.values(data);
            const comments = arr.map((item, i) => {
                const text = typeof item === 'string' ? item
                    : item.text || item.comment || item.body || item.content || item.message || item.tweet || item.review || JSON.stringify(item);
                return {
                    id: i,
                    text: String(text || '').trim(),
                    date: item.date || item.created_at || item.timestamp || null,
                    raw: item
                };
            }).filter(c => c.text.length > 0);
            onComplete(comments);
        } catch (err) {
            onError(err);
        }
    };
    reader.onerror = onError;
    reader.readAsText(file);
}

export function parseTXT(file, onComplete, onError) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const lines = e.target.result.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            const comments = lines.map((text, i) => ({ id: i, text, date: null, raw: { text } }));
            onComplete(comments);
        } catch (err) {
            onError(err);
        }
    };
    reader.onerror = onError;
    reader.readAsText(file);
}

export function parseFile(file, onComplete, onError) {
    const name = file.name.toLowerCase();
    if (name.endsWith('.csv')) return parseCSV(file, onComplete, onError);
    if (name.endsWith('.json')) return parseJSON(file, onComplete, onError);
    if (name.endsWith('.txt')) return parseTXT(file, onComplete, onError);
    onError(new Error('Unsupported file type. Please use CSV, JSON, or TXT.'));
}
export function generateSampleData(count = 1000) {
    const positives = [
        "This product is absolutely amazing! I love it so much.",
        "Fantastic service, really impressed with the quality.",
        "Best experience I've ever had. Totally recommend!",
        "Wonderful! The team was super helpful and kind.",
        "I'm so happy with this purchase. 10/10 would buy again!",
        "Outstanding quality and fast delivery. Very satisfied!",
        "The customer support was brilliant and resolved my issue quickly.",
        "Love this brand! Always exceeds expectations. ❤️",
        "Such a great product. Works perfectly and looks beautiful.",
        "Incredible value for money. Genuinely impressed!",
        "Exceeded all expectations! Great job team 👏",
        "Absolutely delightful experience from start to finish ✨",
        "Top notch quality and amazing customer service 🌟",
        "Super happy with the results! Recommend to everyone.",
        "This made my day! Thank you so much! 🎉"
    ];
    const negatives = [
        "Terrible experience. Completely disappointed with this.",
        "Waste of money. The product broke after 2 days.",
        "Horrible customer service. Never buying from here again!",
        "This is the worst thing I've ever bought. Absolute garbage.",
        "Very frustrated. My order never arrived and no one helped.",
        "Disgusting quality. Looks nothing like the pictures.",
        "I hate this product. Total scam, avoid at all costs!",
        "Broken on arrival. The support team was rude and unhelpful.",
        "Extremely disappointing. Expected so much more from this brand.",
        "Do NOT buy this. It's a complete waste of your hard-earned money.",
        "Awful! The product was damaged and customer support ignored me 😡",
        "Shocking quality. Returned it immediately. Very angry. 👎",
        "Complete disaster. Nothing works as advertised.",
        "Furious with this company. Zero stars if I could.",
        "Regret buying this. terrible terrible terrible 😤"
    ];
    const neutrals = [
        "It's okay, nothing special but does what it says.",
        "Average product. Delivery was on time.",
        "Decent enough. Not great, not terrible.",
        "It arrived in good condition. Haven't tested it fully yet.",
        "Standard quality. As expected for the price.",
        "Seems fine. Will update after more use.",
        "Normal experience. Nothing stood out.",
        "It works. That's about all I can say.",
        "Pretty much what I expected. No complaints.",
        "Package arrived intact. Product looks as described."
    ];

    const allSentences = [...positives, ...negatives, ...neutrals];
    const comments = [];
    const base = new Date();
    base.setDate(base.getDate() - 90);

    for (let i = 0; i < count; i++) {
        const text = allSentences[Math.floor(Math.random() * allSentences.length)];
        const date = new Date(base.getTime() + Math.random() * 90 * 24 * 60 * 60 * 1000);
        comments.push({
            id: i,
            text: text + (Math.random() > 0.7 ? ' ' + allSentences[Math.floor(Math.random() * allSentences.length)] : ''),
            date: date.toISOString().split('T')[0],
            raw: {}
        });
    }
    return comments;
}
