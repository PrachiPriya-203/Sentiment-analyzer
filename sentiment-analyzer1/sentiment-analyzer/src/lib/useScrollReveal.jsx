import { useEffect, useRef } from 'react';
export function useScrollReveal(selector = '.reveal, .reveal-left, .reveal-right, .reveal-scale') {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );

        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    });
}
export function Reveal({ children, className = '', type = 'reveal', delay = 0, as: Tag = 'div', ...props }) {
    const delayClass = delay > 0 ? `delay-${delay}` : '';
    return (
        <Tag className={`${type} ${delayClass} ${className}`} {...props}>
            {children}
        </Tag>
    );
}
