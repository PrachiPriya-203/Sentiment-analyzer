export default function StatsPanel({ results }) {
    const total = results.length;
    const positive = results.filter(r => r.label === 'positive').length;
    const negative = results.filter(r => r.label === 'negative').length;
    const neutral = results.filter(r => r.label === 'neutral').length;
    const avgScore = (results.reduce((s, r) => s + r.score, 0) / total).toFixed(4);
    const maxPositive = results.reduce((m, r) => r.score > m.score ? r : m, results[0]);
    const maxNegative = results.reduce((m, r) => r.score < m.score ? r : m, results[0]);
    const posPercent = ((positive / total) * 100).toFixed(1);
    const negPercent = ((negative / total) * 100).toFixed(1);
    const neuPercent = ((neutral / total) * 100).toFixed(1);

    const scoreLabel = avgScore > 0.05 ? 'Overall Positive' : avgScore < -0.05 ? 'Overall Negative' : 'Mostly Neutral';
    const scoreColor = avgScore > 0.05 ? 'var(--positive)' : avgScore < -0.05 ? 'var(--negative)' : 'var(--neutral)';

    return (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Score Meter */}
            <div className="score-meter-card">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <div style={{
                        width: 100, height: 100, borderRadius: '50%',
                        background: `conic-gradient(${scoreColor} ${Math.abs(avgScore) * 100}%, var(--border) 0)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: `0 0 30px ${scoreColor}40`
                    }}>
                        <div style={{
                            width: 72, height: 72, borderRadius: '50%',
                            background: 'var(--bg-card)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexDirection: 'column'
                        }}>
                            <span style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'var(--mono)', color: scoreColor }}>
                                {avgScore > 0 ? '+' : ''}{avgScore}
                            </span>
                        </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: scoreColor }}>
                        {scoreLabel}
                    </span>
                </div>

                <div className="score-info">
                    <h3 style={{ color: scoreColor }}>
                        {avgScore > 0.05 ? '😊' : avgScore < -0.05 ? '😟' : '😐'} {scoreLabel}
                    </h3>
                    <p>Average compound sentiment score across <strong>{total.toLocaleString()}</strong> comments (−1 most negative → +1 most positive)</p>
                    <div className="score-breakdown">
                        <div className="score-breakdown-item">
                            <span className="label">Total Comments</span>
                            <span className="val" style={{ color: 'var(--text-primary)' }}>{total.toLocaleString()}</span>
                        </div>
                        <div className="score-breakdown-item">
                            <span className="label">Avg Score</span>
                            <span className="val" style={{ color: scoreColor }}>{avgScore}</span>
                        </div>
                        <div className="score-breakdown-item">
                            <span className="label">Most Positive</span>
                            <span className="val" style={{ color: 'var(--positive)' }}>+{maxPositive.score.toFixed(3)}</span>
                        </div>
                        <div className="score-breakdown-item">
                            <span className="label">Most Negative</span>
                            <span className="val" style={{ color: 'var(--negative)' }}>{maxNegative.score.toFixed(3)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card positive">
                    <div className="stat-label">✅ Positive</div>
                    <div className="stat-value positive">{positive.toLocaleString()}</div>
                    <div className="stat-sub">{posPercent}% of total</div>
                    <div className="stat-bar">
                        <div className="stat-bar-fill" style={{ width: `${posPercent}%`, background: 'var(--positive)' }} />
                    </div>
                </div>
                <div className="stat-card negative">
                    <div className="stat-label">❌ Negative</div>
                    <div className="stat-value negative">{negative.toLocaleString()}</div>
                    <div className="stat-sub">{negPercent}% of total</div>
                    <div className="stat-bar">
                        <div className="stat-bar-fill" style={{ width: `${negPercent}%`, background: 'var(--negative)' }} />
                    </div>
                </div>
                <div className="stat-card neutral">
                    <div className="stat-label">⚖️ Neutral</div>
                    <div className="stat-value neutral">{neutral.toLocaleString()}</div>
                    <div className="stat-sub">{neuPercent}% of total</div>
                    <div className="stat-bar">
                        <div className="stat-bar-fill" style={{ width: `${neuPercent}%`, background: 'var(--neutral)' }} />
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">📊 Positivity Ratio</div>
                    <div className="stat-value" style={{ fontSize: '2rem', color: 'var(--accent-purple-light)' }}>
                        {positive > 0 || negative > 0 ? (positive / (positive + negative)).toFixed(2) : 'N/A'}
                    </div>
                    <div className="stat-sub">Positive ÷ (Positive + Negative)</div>
                </div>
                <div className="stat-card" style={{ gridColumn: 'span 2' }}>
                    <div className="stat-label">🌟 Most Positive Comment</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.6, marginTop: 8 }}>
                        "{maxPositive.text?.slice(0, 180)}{maxPositive.text?.length > 180 ? '…' : ''}"
                    </div>
                    <div style={{ marginTop: 8 }}>
                        <span className="sentiment-badge positive">positive</span>
                        <span style={{ marginLeft: 8, fontFamily: 'var(--mono)', fontSize: '0.8rem', color: 'var(--positive)' }}>
                            +{maxPositive.score.toFixed(4)}
                        </span>
                    </div>
                </div>
                <div className="stat-card" style={{ gridColumn: 'span 2' }}>
                    <div className="stat-label">💢 Most Negative Comment</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.6, marginTop: 8 }}>
                        "{maxNegative.text?.slice(0, 180)}{maxNegative.text?.length > 180 ? '…' : ''}"
                    </div>
                    <div style={{ marginTop: 8 }}>
                        <span className="sentiment-badge negative">negative</span>
                        <span style={{ marginLeft: 8, fontFamily: 'var(--mono)', fontSize: '0.8rem', color: 'var(--negative)' }}>
                            {maxNegative.score.toFixed(4)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
