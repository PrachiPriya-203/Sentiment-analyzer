export default function WordCloudPanel({ words }) {
    if (!words || words.length === 0) return null;

    const max = words[0]?.count || 1;
    const min = words[words.length - 1]?.count || 1;

    const getSize = (count) => {
        const norm = (count - min) / Math.max(max - min, 1);
        return 0.75 + norm * 1.5; 
    };

    const getOpacity = (count) => {
        const norm = (count - min) / Math.max(max - min, 1);
        return 0.55 + norm * 0.45;
    };

    const colors = [
        'var(--accent-purple-light)', 'var(--accent-blue-light)',
        '#34d399', '#fb923c', '#f472b6', '#38bdf8', '#a3e635'
    ];

    return (
        <div className="chart-card">
            <div className="chart-title">☁️ Top Keywords by Frequency</div>
            <div className="wordcloud-grid">
                {words.map((w, i) => (
                    <span
                        key={w.word}
                        className="wc-word"
                        title={`"${w.word}" — ${w.count.toLocaleString()} occurrences`}
                        style={{
                            fontSize: `${getSize(w.count)}rem`,
                            opacity: getOpacity(w.count),
                            color: colors[i % colors.length],
                            fontWeight: w.count > (max * 0.6) ? 700 : w.count > (max * 0.3) ? 600 : 500,
                            borderColor: 'transparent',
                            background: `${colors[i % colors.length]}15`
                        }}
                    >
                        {w.word}
                        <span style={{ fontSize: '0.65em', marginLeft: 4, opacity: 0.6 }}>{w.count}</span>
                    </span>
                ))}
            </div>
        </div>
    );
}
