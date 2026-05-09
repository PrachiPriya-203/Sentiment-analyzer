import { analyzeComment } from './lib/sentimentEngine.js';

const BATCH_SIZE = 500;

self.onmessage = function (e) {
    const { comments } = e.data;
    const total = comments.length;
    const results = [];

    for (let i = 0; i < total; i += BATCH_SIZE) {
        const batch = comments.slice(i, i + BATCH_SIZE);
        const batchResults = batch.map(comment => ({
            ...comment,
            ...analyzeComment(comment.text)
        }));
        results.push(...batchResults);
        self.postMessage({
            type: 'progress',
            progress: Math.round(((i + batch.length) / total) * 100),
            processed: i + batch.length
        });
    }

    self.postMessage({ type: 'done', results });
};
