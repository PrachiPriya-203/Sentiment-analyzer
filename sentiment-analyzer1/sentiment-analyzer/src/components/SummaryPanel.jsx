export default function SummaryPanel({ results }) {
    const total = results.length;
    const positive = results.filter(r => r.label === 'positive').length;
    const negative = results.filter(r => r.label === 'negative').length;
    const neutral = results.filter(r => r.label === 'neutral').length;
    const avgScore = (results.reduce((s, r) => s + r.score, 0) / total);
    const posRatio = positive / (positive + negative || 1);
    const posPercent = ((positive / total) * 100).toFixed(1);
    const negPercent = ((negative / total) * 100).toFixed(1);
    const neuPercent = ((neutral / total) * 100).toFixed(1);
    let tone, toneEmoji, tonescore;
    if (avgScore >= 0.3) { tone = 'strongly positive'; toneEmoji = '🌟'; tonescore = 'var(--positive)'; }
    else if (avgScore >= 0.05) { tone = 'mildly positive'; toneEmoji = '😊'; tonescore = 'var(--positive)'; }
    else if (avgScore <= -0.3) { tone = 'strongly negative'; toneEmoji = '⚠️'; tonescore = 'var(--negative)'; }
    else if (avgScore <= -0.05) { tone = 'mildly negative'; toneEmoji = '😟'; tonescore = 'var(--negative)'; }
    else { tone = 'largely neutral'; toneEmoji = '⚖️'; tonescore = 'var(--neutral)'; }
    const dominantCount = Math.max(positive, negative, neutral);
    const dominant = positive === dominantCount ? 'positive' : negative === dominantCount ? 'negative' : 'neutral';
    const recommendation = avgScore >= 0.05
        ? 'The overall reception is favorable. Content is resonating well with the audience — continue the current strategy.'
        : avgScore <= -0.05
            ? 'Negative sentiment is significant. Consider reviewing user pain points and addressing key concerns highlighted in the top negative comments.'
            : 'Sentiment skews neutral. Engagement-driving content and clearer calls-to-action may help shift the balance more positively.';
    const polarization = ((positive + negative) / total * 100).toFixed(1);

    const now = new Date();
    const timestamp = now.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

    return (
        <div className="summary-panel reveal">
            <div className="summary-header">
                <div className="summary-icon-wrap">✨</div>
                <div>
                    <h3>Analysis Summary</h3>
                    <p>Auto-generated narrative · {total.toLocaleString()} comments · {timestamp}</p>
                </div>
            </div>

            <div className="summary-body">
                {/* Main narrative */}
                <p className="summary-narrative">
                    A total of <strong>{total.toLocaleString()} comments</strong> were analyzed. The overall sentiment is{' '}
                    <strong style={{ color: tonescore }}>{tone} {toneEmoji}</strong>, with an average compound score of{' '}
                    <strong style={{ fontFamily: 'var(--mono)', color: tonescore }}>
                        {avgScore > 0 ? '+' : ''}{avgScore.toFixed(4)}
                    </strong>{' '}
                    on a scale of −1 to +1. The <strong>{dominant}</strong> category was the most dominant segment,
                    representing <strong>{dominant === 'positive' ? posPercent : dominant === 'negative' ? negPercent : neuPercent}%</strong> of all comments.
                    Polarization (comments that are clearly positive or negative) stands at{' '}
                    <strong>{polarization}%</strong>, indicating{' '}
                    {parseFloat(polarization) > 70 ? 'a highly opinionated audience' : parseFloat(polarization) > 40 ? 'a moderately engaged audience' : 'a largely passive or undecided audience'}.
                </p>

                {/* Stat pills */}
                <div className="summary-stats-row">
                    <div className="summary-stat-pill">
                        <div>
                            <span className="s-label">Avg Score</span>
                            <span className="s-val" style={{ color: tonescore }}>{avgScore > 0 ? '+' : ''}{avgScore.toFixed(4)}</span>
                        </div>
                    </div>
                    <div className="summary-stat-pill">
                        <div>
                            <span className="s-label">✅ Positive</span>
                            <span className="s-val" style={{ color: 'var(--positive)' }}>{posPercent}%</span>
                        </div>
                    </div>
                    <div className="summary-stat-pill">
                        <div>
                            <span className="s-label">❌ Negative</span>
                            <span className="s-val" style={{ color: 'var(--negative)' }}>{negPercent}%</span>
                        </div>
                    </div>
                    <div className="summary-stat-pill">
                        <div>
                            <span className="s-label">⚖️ Neutral</span>
                            <span className="s-val" style={{ color: 'var(--neutral)' }}>{neuPercent}%</span>
                        </div>
                    </div>
                    <div className="summary-stat-pill">
                        <div>
                            <span className="s-label">Positivity Ratio</span>
                            <span className="s-val" style={{ color: 'var(--accent-mid)' }}>
                                {(posRatio * 100).toFixed(0)}%
                            </span>
                        </div>
                    </div>
                    <div className="summary-stat-pill">
                        <div>
                            <span className="s-label">Polarization</span>
                            <span className="s-val" style={{ color: 'var(--text-primary)' }}>{polarization}%</span>
                        </div>
                    </div>
                </div>

                {/* Verdict box */}
                <div className="summary-verdict">
                    <span className="verdict-icon">💡</span>
                    <div className="verdict-text">
                        <strong>Recommendation: </strong>{recommendation}
                    </div>
                </div>

                {/* Breakdown bar */}
                <div>
                    <div style={{ display: 'flex', gap: 4, height: 10, borderRadius: 6, overflow: 'hidden', marginBottom: 8 }}>
                        <div style={{ width: `${posPercent}%`, background: 'var(--positive)', transition: 'width 1s' }} />
                        <div style={{ width: `${neuPercent}%`, background: 'var(--neutral)', transition: 'width 1s' }} />
                        <div style={{ width: `${negPercent}%`, background: 'var(--negative)', transition: 'width 1s' }} />
                    </div>
                    <div style={{ display: 'flex', gap: 16, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        <span style={{ color: 'var(--positive)' }}>● Positive {posPercent}%</span>
                        <span style={{ color: 'var(--neutral)' }}>● Neutral {neuPercent}%</span>
                        <span style={{ color: 'var(--negative)' }}>● Negative {negPercent}%</span>
                    </div>
                </div>

                <div className="summary-footer">
                    <img src="/logo.png" alt="VoxSense" style={{ width: 16, height: 16, borderRadius: 4, opacity: 0.6 }} />
                    Powered by VoxSense Sentiment Engine (AFINN-165 + Emoji Scoring + Negation Detection)
                    · All processing happens locally in your browser
                </div>
            </div>
        </div>
    );
}
