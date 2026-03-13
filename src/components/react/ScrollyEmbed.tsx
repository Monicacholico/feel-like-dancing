import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface Step {
  title: string;
  text: string;
  imageSrc?: string;
  imageAlt: string;
}

interface Props {
  steps: Step[];
}

export default function ScrollyEmbed({ steps }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const stepsEls = containerRef.current?.querySelectorAll<HTMLElement>('.sce-step');
    if (!stepsEls) return;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      stepsEls.forEach((el) => el.classList.add('is-active'));
      return;
    }

    const observers: IntersectionObserver[] = [];
    stepsEls.forEach((el, i) => {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveStep(i);
            stepsEls.forEach((s) => s.classList.remove('is-active'));
            el.classList.add('is-active');
          }
        },
        { rootMargin: '-35% 0px -35% 0px', threshold: 0 },
      );
      obs.observe(el);
      observers.push(obs);
    });

    stepsEls[0]?.classList.add('is-active');

    return () => observers.forEach((o) => o.disconnect());
  }, [steps.length]);

  useEffect(() => {
    const step = steps[activeStep];
    if (!step || !imageRef.current) return;

    const src = step.imageSrc || `https://placehold.co/600x700/f0eeeb/8b4c6a?text=${encodeURIComponent(step.title)}`;
    if (imageRef.current.src === src) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      imageRef.current.src = src;
      imageRef.current.alt = step.imageAlt;
      return;
    }

    gsap.to(imageRef.current, {
      opacity: 0,
      duration: 0.25,
      onComplete: () => {
        if (!imageRef.current) return;
        imageRef.current.src = src;
        imageRef.current.alt = step.imageAlt;
        gsap.to(imageRef.current, { opacity: 1, duration: 0.4 });
      },
    });

    if (labelRef.current) {
      labelRef.current.textContent = step.title;
    }
  }, [activeStep, steps]);

  return (
    <div className="sce-container" ref={containerRef}>
      <div className="sce-sticky">
        <div className="sce-image-wrap">
          <img
            ref={imageRef}
            className="sce-image"
            src={`https://placehold.co/600x700/f0eeeb/8b4c6a?text=${encodeURIComponent(steps[0]?.title ?? '')}`}
            alt={steps[0]?.imageAlt ?? ''}
            loading="lazy"
          />
          <div ref={labelRef} className="sce-label">{steps[0]?.title}</div>
        </div>
      </div>
      <div className="sce-steps">
        {steps.map((step, i) => (
          <div key={i} className="sce-step">
            <div className="sce-step-inner">
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
