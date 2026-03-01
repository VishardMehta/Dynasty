import { useState, useEffect, useRef } from 'react';

export function useCountUp(end, duration = 1500, startOnMount = true) {
    const [value, setValue] = useState(0);
    const startTime = useRef(null);
    const rafId = useRef(null);

    useEffect(() => {
        if (!startOnMount) return;
        const numericEnd = typeof end === 'number' ? end : parseFloat(end);
        if (isNaN(numericEnd)) { setValue(end); return; }

        const animate = (timestamp) => {
            if (!startTime.current) startTime.current = timestamp;
            const progress = Math.min((timestamp - startTime.current) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setValue(Math.round(eased * numericEnd * 10) / 10);
            if (progress < 1) {
                rafId.current = requestAnimationFrame(animate);
            } else {
                setValue(numericEnd);
            }
        };

        rafId.current = requestAnimationFrame(animate);
        return () => { if (rafId.current) cancelAnimationFrame(rafId.current); };
    }, [end, duration, startOnMount]);

    return value;
}

export function useInView(threshold = 0.2) {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
            { threshold }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);

    return [ref, inView];
}
