"use client";
import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  animation?: 'fade-in' | 'slide-up' | 'scale-in';
}

const AnimatedSection = ({ 
  children, 
  className, 
  delay = 0,
  animation = 'fade-in'
}: AnimatedSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    // Set up the intersection observer
    try {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsVisible(true);
            }, delay);
            
            // Once visible, disconnect the observer
            if (sectionRef.current) {
              observer.unobserve(sectionRef.current);
            }
          }
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: 0.1
        }
      );

      const currentRef = sectionRef.current;
      if (currentRef) {
        observer.observe(currentRef);
      }

      return () => {
        if (currentRef) {
          observer.unobserve(currentRef);
        }
      };
    } catch (error) {
      // If intersection observer fails, show the content
      console.error('Intersection Observer error:', error);
      setIsVisible(true);
      return;
    }
  }, [delay]);

  // Determine animation class based on prop
  const getAnimationClass = () => {
    if (!isVisible) return '';
    
    switch (animation) {
      case 'slide-up':
        return 'animate-slide-up';
      case 'scale-in':
        return 'animate-scale-in';
      case 'fade-in':
      default:
        return 'animate-fade-in';
    }
  };

  return (
    <div
      ref={sectionRef}
      className={cn(
        'transition-opacity duration-500',
        isVisible ? 'opacity-100' : 'opacity-0',
        getAnimationClass(),
        className
      )}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
