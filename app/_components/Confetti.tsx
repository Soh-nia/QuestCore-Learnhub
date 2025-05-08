'use client';

import confetti from 'canvas-confetti';
import { useEffect, useRef, useCallback } from 'react';

type ConfettiVariant = 'realistic' | 'fireworks';

interface ConfettiProps {
  trigger: boolean;
  variant?: ConfettiVariant;
  onComplete?: () => void;
}

const Confetti: React.FC<ConfettiProps> = ({
  trigger,
  variant = 'realistic',
  onComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate random hex color
  const randomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Realistic confetti: Random bursts with varied particle counts and directions
  const realisticConfetti = useCallback(() => {
    try {
      const defaults = {
        spread: 360,
        ticks: 100,
        gravity: 0,
        decay: 0.92,
        startVelocity: 30,
        shapes: ['square', 'circle'],
        colors: [randomColor(), randomColor(), randomColor(), randomColor(), randomColor()],
      };

      const shoot = () => {
        confetti({
          ...defaults,
          particleCount: 40,
          scalar: 1.2,
          shapes: ['square'],
          colors: [randomColor(), randomColor()],
        });

        confetti({
          ...defaults,
          particleCount: 20,
          scalar: 0.75,
          shapes: ['circle'],
          colors: [randomColor(), randomColor()],
        });
      };

      // Fire multiple bursts
      setTimeout(shoot, 0);
      setTimeout(shoot, 100);
      setTimeout(shoot, 200);

      // Clean up after animation
      setTimeout(() => {
        if (canvasRef.current) {
          confetti.reset();
          onComplete?.();
        }
      }, 4000);
    } catch (error) {
      console.error('Confetti: Error in realisticConfetti:', error);
    }
  }, [onComplete]);

  // Fireworks confetti: Staggered bursts from sides
  const fireworksConfetti = useCallback(() => {
    try {
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = {
        startVelocity: 30,
        spread: 360,
        ticks: 100,
        zIndex: 10000,
        decay: 0.92,
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          if (canvasRef.current) {
            confetti.reset();
            onComplete?.();
          }
          return;
        }

        const particleCount = 50 * (timeLeft / duration);
        // Fire from left
        confetti({
          ...defaults,
          particleCount,
          origin: { x: Math.random() / 3, y: Math.random() - 0.2 },
          colors: [randomColor(), randomColor()],
        });
        // Fire from right
        confetti({
          ...defaults,
          particleCount,
          origin: { x: 1 - Math.random() / 3, y: Math.random() - 0.2 },
          colors: [randomColor(), randomColor()],
        });
      }, 250);
    } catch (error) {
      console.error('Confetti: Error in fireworksConfetti:', error);
    }
  }, [onComplete]);

  useEffect(() => {
    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    if (trigger) {
      try {
        // Initialize canvas
        if (!canvasRef.current) {
          console.log('Confetti: Creating canvas');
          canvasRef.current = document.createElement('canvas');
          canvasRef.current.style.position = 'fixed';
          canvasRef.current.style.top = '0';
          canvasRef.current.style.left = '0';
          canvasRef.current.style.width = '100%';
          canvasRef.current.style.height = '100%';
          canvasRef.current.style.pointerEvents = 'none';
          canvasRef.current.style.zIndex = '10000';
          document.body.appendChild(canvasRef.current);
          confetti.create(canvasRef.current, { resize: true });
        } else {
          console.log('Confetti: Canvas already exists');
        }

        // Trigger the appropriate variant
        if (variant === 'realistic') {
          realisticConfetti();
        } else if (variant === 'fireworks') {
          fireworksConfetti();
        }
      } catch (error) {
        console.error('Confetti: Error in useEffect:', error);
      }
    }

    // Cleanup on unmount
    return () => {
      if (canvasRef.current) {
        confetti.reset();
        canvasRef.current.remove();
        canvasRef.current = null;
      }
    };
  }, [trigger, variant, realisticConfetti, fireworksConfetti]);

  return null;
};

export default Confetti;