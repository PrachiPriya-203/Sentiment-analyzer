import { useState } from 'react';

const PAGE_SIZE = 20;

export default function TopCommentsTable({ results }) {
    const [tab, setTab] = useState('positive');
    const [page, setPage] = useState(1);

    const sorted = [...results].sort((a, b) =>
        tab === 'positive' ? b.score - a.score :
            tab === 'negative' ? a.score - b.score :
                Math.abs(b.score) - Math.abs(a.score)
    );

    const total = sorted.length;
    const totalPages = Math.ceil(total / PAGE_SIZE);
    const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleTab = (t) => { setTab(t); setPage(1); };

    return (
        <div className="chart-card">
            <div className="section-header">
                <div className="section-title"><span className="icon">💬</span> Comments Explorer</div>
                <span className="results-count">{total.toLocaleString()} results</span>
            </div>
            <div className="tabs">
                {[
                    { key: 'positive', label: '✅ Top Positive' },
                    { key: 'negative', label: '❌ Top Negative' },
                    { key: 'extreme', label: '⚡ Most Extreme' }
                ].map(t => (
                    <button
                        key={t.key}
                        className={`tab${tab === t.key ? ' active' : ''}`}
                        onClick={() => handleTab(t.key)}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <div className="comments-table-wrap">
                <table className="comments-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Comment</th>
                            <th>Sentiment</th>
                            <th>Score</th>
                            {results[0]?.date && <th>Date</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {paged.map((r, i) => (
                            <tr key={r.id ?? i}>
                                <td style={{ color: 'var(--text-muted)', fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>
                                    {(page - 1) * PAGE_SIZE + i + 1}
                                </td>
                                <td>
                                    <div className="comment-text">
                                        {r.text?.length > 200 ? r.text.slice(0, 200) + '…' : r.text}
                                    </div>
                                </td>
                                <td>
                                    <span className={`sentiment-badge ${r.label}`}>
                                        {r.label === 'positive' ? '✅' : r.label === 'negative' ? '❌' : '⚖️'} {r.label}
                                    </span>
                                </td>
                                <td>
                                    <span className={`score-chip ${r.label}`}>
                                        {r.score > 0 ? '+' : ''}{r.score?.toFixed(4)}
                                    </span>
                                </td>
                                {results[0]?.date && (
                                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                                        {String(r.date || '').slice(0, 10)}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16, alignItems: 'center' }}>
                    <button className="btn btn-ghost btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'var(--mono)' }}>
                        {page} / {totalPages}
                    </span>
                    <button className="btn btn-ghost btn-sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
                </div>
            )}
        </div>
    );
}
