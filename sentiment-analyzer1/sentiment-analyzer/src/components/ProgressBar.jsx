export default function ProgressBar({ progress, processed, total }) {
    return (
        <section className="progress-section fade-in">
            <div className="progress-card">
                <div className="progress-header">
                    <div className="progress-title">
                        <div className="progress-spinner" />
                        Analyzing sentiment…
                    </div>
                    <span className="progress-count">
                        {processed.toLocaleString()} / {total.toLocaleString()} comments
                    </span>
                </div>
                <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Processing in batches of 500 via Web Worker — UI stays responsive
                    </span>
                    <span className="progress-pct">{progress}%</span>
                </div>
            </div>
        </section>
    );
}
