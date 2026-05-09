import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement,
    Title, Tooltip, Legend
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BINS = 20;

export default function ScoreHistogram({ results }) {
    const binWidth = 2 / BINS;
    const bins = Array(BINS).fill(0);
    const colors = [];

    for (const r of results) {
        const idx = Math.min(BINS - 1, Math.floor((r.score + 1) / binWidth));
        bins[idx]++;
    }

    const labels = Array.from({ length: BINS }, (_, i) => {
        const lo = (-1 + i * binWidth).toFixed(2);
        const hi = (-1 + (i + 1) * binWidth).toFixed(2);
        return `${lo}`;
    });

    for (let i = 0; i < BINS; i++) {
        const mid = -1 + (i + 0.5) * binWidth;
        if (mid > 0.05) colors.push('rgba(34,197,94,0.75)');
        else if (mid < -0.05) colors.push('rgba(239,68,68,0.75)');
        else colors.push('rgba(245,158,11,0.75)');
    }

    const data = {
        labels,
        datasets: [{
            label: 'Comment Count',
            data: bins,
            backgroundColor: colors,
            borderColor: colors.map(c => c.replace('0.75', '1')),
            borderWidth: 1,
            borderRadius: 4
        }]
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
                    title: (items) => {
                        const idx = items[0].dataIndex;
                        const lo = (-1 + idx * binWidth).toFixed(2);
                        const hi = (-1 + (idx + 1) * binWidth).toFixed(2);
                        return `Score: ${lo} to ${hi}`;
                    },
                    label: (ctx) => ` ${ctx.parsed.y.toLocaleString()} comments`
                }
            }
        },
        scales: {
            x: {
                ticks: { color: '#5a5a7a', font: { size: 9 }, maxRotation: 0, maxTicksLimit: 10 },
                grid: { display: false }
            },
            y: {
                ticks: { color: '#5a5a7a', font: { size: 11 } },
                grid: { color: 'rgba(42,42,62,0.5)' },
                title: { display: true, text: 'Count', color: '#5a5a7a', font: { size: 11 } }
            }
        }
    };

    return (
        <div className="chart-card">
            <div className="chart-title">📊 Score Distribution Histogram</div>
            <div className="chart-wrapper" style={{ height: 260 }}>
                <Bar data={data} options={options} />
            </div>
        </div>
    );
}
