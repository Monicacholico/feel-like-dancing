import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface Era {
  year: string;
  title: string;
  description: string;
  color: string;
}

interface Props {
  eras: Era[];
  locale: 'en' | 'es';
}

export default function TimelineBlock({ eras, locale }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const items = containerRef.current?.querySelectorAll<HTMLElement>('.timeline-item');
    if (!items) return;

    const observers: IntersectionObserver[] = [];

    items.forEach((item, index) => {
      if (prefersReducedMotion) {
        item.style.opacity = '1';
        item.style.transform = 'none';
        return;
      }

      gsap.set(item, { opacity: 0, x: index % 2 === 0 ? -30 : 30 });

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            gsap.to(item, {
              opacity: 1,
              x: 0,
              duration: 0.8,
              ease: 'power2.out',
              delay: 0.1,
            });
            setVisibleItems((prev) => new Set(prev).add(index));
            observer.unobserve(item);
          }
        },
        { threshold: 0.3 },
      );
      observer.observe(item);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, [eras.length]);

  return (
    <div className="timeline-container" ref={containerRef} role="list" aria-label={locale === 'en' ? 'Ballet timeline' : 'Línea del tiempo del ballet'}>
      <div className="timeline-line" aria-hidden="true" />
      {eras.map((era, index) => (
        <div
          key={era.year}
          className={`timeline-item ${index % 2 === 0 ? 'timeline-left' : 'timeline-right'}`}
          role="listitem"
        >
          <div className="timeline-dot" style={{ backgroundColor: era.color }} aria-hidden="true" />
          <div className="timeline-card">
            <span className="timeline-year" style={{ color: era.color }}>{era.year}</span>
            <h3 className="timeline-title">{era.title}</h3>
            <p className="timeline-desc">{era.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
