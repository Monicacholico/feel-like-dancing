import { useEffect, useRef, useState, type ReactNode } from 'react';
import { gsap } from 'gsap';

interface ScrollStep {
  content: ReactNode;
  visualId: string;
}

interface Props {
  steps: ScrollStep[];
  children?: ReactNode;
}

export default function ScrollySection({ steps, children }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const observers: IntersectionObserver[] = [];

    const stepElements = containerRef.current?.querySelectorAll<HTMLElement>('.scrolly-step');
    if (!stepElements) return;

    stepElements.forEach((el, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveStep(index);
          }
        },
        { rootMargin: '-40% 0px -40% 0px', threshold: 0 },
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, [steps.length]);

  useEffect(() => {
    if (!stickyRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const visuals = stickyRef.current.querySelectorAll<HTMLElement>('.scrolly-visual');

    visuals.forEach((visual, index) => {
      if (index === activeStep) {
        gsap.to(visual, {
          opacity: 1,
          y: 0,
          duration: prefersReducedMotion ? 0 : 0.6,
          ease: 'power2.out',
        });
      } else {
        gsap.to(visual, {
          opacity: 0,
          y: index < activeStep ? -20 : 20,
          duration: prefersReducedMotion ? 0 : 0.4,
          ease: 'power2.in',
        });
      }
    });
  }, [activeStep]);

  return (
    <div className="scrolly-container" ref={containerRef}>
      <div className="scrolly-sticky" ref={stickyRef}>
        {steps.map((step, index) => (
          <div
            key={step.visualId}
            className="scrolly-visual"
            data-visual={step.visualId}
            style={{ opacity: index === 0 ? 1 : 0 }}
            aria-hidden={index !== activeStep}
          >
            {children}
          </div>
        ))}
      </div>
      <div className="scrolly-steps">
        {steps.map((step, index) => (
          <div
            key={step.visualId}
            className={`scrolly-step ${index === activeStep ? 'is-active' : ''}`}
          >
            <div className="scrolly-step-inner">
              {step.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
