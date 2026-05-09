import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

export default function SentimentPieChart({ results }) {
    const positive = results.filter(r => r.label === 'positive').length;
    const negative = results.filter(r => r.label === 'negative').length;
    const neutral = results.filter(r => r.label === 'neutral').length;

    const data = {
        labels: ['Positive', 'Negative', 'Neutral'],
        datasets: [{
            data: [positive, negative, neutral],
            backgroundColor: ['rgba(34,197,94,0.85)', 'rgba(239,68,68,0.85)', 'rgba(245,158,11,0.85)'],
            borderColor: ['#22c55e', '#ef4444', '#f59e0b'],
            borderWidth: 2,
            hoverOffset: 10
        }]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: { color: '#9090b0', font: { family: 'Inter', size: 12 }, padding: 20, usePointStyle: true }
            },
            tooltip: {
                callbacks: {
                    label: (ctx) => {
                        const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                        const pct = ((ctx.parsed / total) * 100).toFixed(1);
                        return ` ${ctx.label}: ${ctx.parsed.toLocaleString()} (${pct}%)`;
                    }
                },
                backgroundColor: '#1a1a26', borderColor: '#2a2a3e', borderWidth: 1,
                titleColor: '#f0f0ff', bodyColor: '#9090b0', padding: 12
            }
        }
    };

    return (
        <div className="chart-card">
            <div className="chart-title">🥧 Sentiment Distribution</div>
            <div className="chart-wrapper" style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Pie data={data} options={options} />
            </div>
        </div>
    );
}
