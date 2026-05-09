import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement,
    LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);
function buildLiveTrendData(results, windowSizeSeconds = 300, bucketSeconds = 5) {
    if (!results || results.length === 0) {
        return { labels: [], values: [], counts: [] };
    }

    const nowStr = results[results.length - 1].date || new Date().toISOString();
    let nowTime = new Date(nowStr).getTime();
    if (isNaN(nowTime)) nowTime = Date.now();

    const startTime = nowTime - (windowSizeSeconds * 1000);
    const numBuckets = Math.ceil(windowSizeSeconds / bucketSeconds);
    const buckets = Array(numBuckets).fill(0).map(() => ({ sum: 0, count: 0 }));

    for (let i = results.length - 1; i >= 0; i--) {
        const r = results[i];
        let rTime = new Date(r.date).getTime();
        if (isNaN(rTime)) continue;
        
        if (rTime < startTime) break; 
        if (rTime > nowTime) rTime = nowTime;

        const delta = nowTime - rTime;
        const bucketIdx = numBuckets - 1 - Math.floor(delta / (bucketSeconds * 1000));
        if (bucketIdx >= 0 && bucketIdx < numBuckets) {
            buckets[bucketIdx].sum += r.score;
            buckets[bucketIdx].count++;
        }
    }

    const labels = [];
    const values = [];
    const counts = [];
    
    for (let i = 0; i < numBuckets; i++) {
        const secondsAgo = (numBuckets - 1 - i) * bucketSeconds;
        labels.push(secondsAgo === 0 ? 'Now' : `-${secondsAgo}s`);
        counts.push(buckets[i].count);
        values.push(buckets[i].count > 0 ? parseFloat((buckets[i].sum / buckets[i].count).toFixed(4)) : 0);
    }

    return { labels, values, counts };
}

export default function LiveSentimentTrendChart({ results }) {
    const { labels, values, counts } = buildLiveTrendData(results, 60, 5);

    const data = {
        labels,
        datasets: [
            {
                label: 'Avg Sentiment Score',
                data: values,
                borderColor: '#10b981', 
                backgroundColor: (ctx) => {
                    const chart = ctx.chart;
                    const { ctx: canvasCtx, chartArea } = chart;
                    if (!chartArea) return 'transparent';
                    const gradient = canvasCtx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                    gradient.addColorStop(0, 'rgba(16,185,129,0.3)');
                    gradient.addColorStop(1, 'rgba(16,185,129,0)');
                    return gradient;
                },
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointHoverRadius: 6,
                pointBackgroundColor: '#10b981',
                borderWidth: 2
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 0 
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1a1a26', borderColor: '#2a2a3e', borderWidth: 1,
                titleColor: '#f0f0ff', bodyColor: '#9090b0', padding: 12,
                callbacks: {
                    afterLabel: (ctx) => ` Messages: ${counts[ctx.dataIndex]?.toLocaleString()}`
                }
            }
        },
        scales: {
            x: {
                ticks: { color: '#5a5a7a', font: { size: 10 } },
                grid: { color: 'rgba(42,42,62,0.5)' }
            },
            y: {
                ticks: { color: '#5a5a7a', font: { size: 11 } },
                grid: { color: 'rgba(42,42,62,0.5)' },
                min: -1, max: 1,
                title: { display: true, text: 'Score', color: '#5a5a7a', font: { size: 11 } }
            }
        }
    };

    return (
        <div className="chart-card">
            <div className="chart-title">
                🔴 Live Sentiment (Last 60s)
            </div>
            <div className="chart-wrapper" style={{ height: 260 }}>
                <Line data={data} options={options} />
            </div>
        </div>
    );
}
