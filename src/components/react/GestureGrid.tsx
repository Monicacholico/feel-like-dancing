import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface Gesture {
  icon: string;
  title: string;
  description: string;
}

interface Props {
  gestures: Gesture[];
  locale: 'en' | 'es';
}

export default function GestureGrid({ gestures, locale }: Props) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll<HTMLElement>('.gg-card');
    if (!cards) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      cards.forEach((c) => (c.style.opacity = '1'));
      return;
    }

    const observers: IntersectionObserver[] = [];
    cards.forEach((card, i) => {
      gsap.set(card, { opacity: 0, y: 20 });
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            gsap.to(card, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power2.out',
              delay: i * 0.1,
            });
            obs.unobserve(card);
          }
        },
        { threshold: 0.2 },
      );
      obs.observe(card);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [gestures.length]);

  return (
    <div className="gg-grid" ref={gridRef}>
      {gestures.map((g, i) => (
        <div key={i} className="gg-card">
          <span className="gg-icon" aria-hidden="true">{g.icon}</span>
          <h3 className="gg-title">{g.title}</h3>
          <p className="gg-desc">{g.description}</p>
        </div>
      ))}
    </div>
  );
}
