import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement,
    LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function buildTrendData(results) {
    const hasDate = results.some(r => r.date);

    if (hasDate) {
        const grouped = {};
        for (const r of results) {
            const key = r.date ? String(r.date).slice(0, 10) : 'unknown';
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(r.score);
        }
        const sorted = Object.keys(grouped).sort();
        return {
            labels: sorted,
            values: sorted.map(k => {
                const arr = grouped[k];
                return parseFloat((arr.reduce((s, v) => s + v, 0) / arr.length).toFixed(4));
            }),
            counts: sorted.map(k => grouped[k].length)
        };
    } else {
        const bucketSize = Math.max(1, Math.ceil(results.length / 30));
        const labels = [], values = [], counts = [];
        for (let i = 0; i < results.length; i += bucketSize) {
            const slice = results.slice(i, i + bucketSize);
            const avg = slice.reduce((s, r) => s + r.score, 0) / slice.length;
            labels.push(`#${i + 1}–${Math.min(i + bucketSize, results.length)}`);
            values.push(parseFloat(avg.toFixed(4)));
            counts.push(slice.length);
        }
        return { labels, values, counts };
    }
}

export default function SentimentTrendChart({ results }) {
    const { labels, values, counts } = buildTrendData(results);
    const hasDate = results.some(r => r.date);

    const data = {
        labels,
        datasets: [
            {
                label: 'Avg Sentiment Score',
                data: values,
                borderColor: '#a78bfa',
                backgroundColor: (ctx) => {
                    const chart = ctx.chart;
                    const { ctx: canvasCtx, chartArea } = chart;
                    if (!chartArea) return 'transparent';
                    const gradient = canvasCtx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                    gradient.addColorStop(0, 'rgba(167,139,250,0.3)');
                    gradient.addColorStop(1, 'rgba(167,139,250,0)');
                    return gradient;
                },
                fill: true,
                tension: 0.4,
                pointRadius: labels.length > 20 ? 0 : 4,
                pointHoverRadius: 6,
                pointBackgroundColor: '#a78bfa',
                borderWidth: 2
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1a1a26', borderColor: '#2a2a3e', borderWidth: 1,
                titleColor: '#f0f0ff', bodyColor: '#9090b0', padding: 12,
                callbacks: {
                    afterLabel: (ctx) => ` Comments: ${counts[ctx.dataIndex]?.toLocaleString()}`
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#5a5a7a', font: { size: 10 },
                    maxTicksLimit: 10,
                    maxRotation: 30
                },
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
                📈 Sentiment Trend {hasDate ? 'Over Time' : 'Over Comments'}
            </div>
            <div className="chart-wrapper" style={{ height: 260 }}>
                <Line data={data} options={options} />
            </div>
        </div>
    );
}
