"use client";

import React, { useEffect, useRef, useState } from 'react';

interface LiquidEtherBackgroundEnhancedProps {
  className?: string;
  theme?: 'health' | 'ocean' | 'forest' | 'sunset' | 'custom';
  customColors?: {
    primary: string;
    secondary: string;
    tertiary: string;
    accent: string;
  };
  intensity?: 'subtle' | 'medium' | 'strong';
  animationSpeed?: number;
  blobCount?: number;
  interactive?: boolean;
  showConnections?: boolean;
  pulseEffect?: boolean;
  particleCount?: number;
}

interface Blob {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  originalRadius: number;
  color: string;
  pulsePhase: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

const colorThemes = {
  health: {
    primary: "rgba(245, 158, 11, 0.12)",    // Amber
    secondary: "rgba(251, 191, 36, 0.08)",   // Light amber
    tertiary: "rgba(217, 119, 6, 0.06)",     // Dark amber
    accent: "rgba(34, 197, 94, 0.1)"        // Green for health
  },
  ocean: {
    primary: "rgba(59, 130, 246, 0.12)",    // Blue
    secondary: "rgba(147, 197, 253, 0.08)",  // Light blue
    tertiary: "rgba(37, 99, 235, 0.06)",     // Dark blue
    accent: "rgba(6, 182, 212, 0.1)"        // Cyan
  },
  forest: {
    primary: "rgba(34, 197, 94, 0.12)",      // Green
    secondary: "rgba(134, 239, 172, 0.08)",  // Light green
    tertiary: "rgba(21, 128, 61, 0.06)",     // Dark green
    accent: "rgba(101, 163, 13, 0.1)"        // Olive
  },
  sunset: {
    primary: "rgba(239, 68, 68, 0.12)",      // Red
    secondary: "rgba(251, 146, 60, 0.08)",   // Orange
    tertiary: "rgba(245, 158, 11, 0.06)",    // Amber
    accent: "rgba(168, 85, 247, 0.1)"        // Purple
  }
};

const LiquidEtherBackgroundEnhanced: React.FC<LiquidEtherBackgroundEnhancedProps> = ({
  className = "",
  theme = 'health',
  customColors,
  intensity = 'medium',
  animationSpeed = 1,
  blobCount = 5,
  interactive = true,
  showConnections = true,
  pulseEffect = true,
  particleCount = 20
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [blobs, setBlobs] = useState<Blob[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [time, setTime] = useState(0);

  const colors = customColors || (theme !== 'custom' ? colorThemes[theme] : colorThemes.health);

  const intensitySettings = {
    subtle: { opacity: 0.3, connectionOpacity: 0.1, particleOpacity: 0.2 },
    medium: { opacity: 0.6, connectionOpacity: 0.2, particleOpacity: 0.4 },
    strong: { opacity: 0.9, connectionOpacity: 0.3, particleOpacity: 0.6 }
  };

  const settings = intensitySettings[intensity];

  // Initialize blobs
  const initBlobs = (width: number, height: number) => {
    const newBlobs: Blob[] = [];
    const colorArray = Object.values(colors);

    for (let i = 0; i < blobCount; i++) {
      const radius = 80 + Math.random() * 150;
      newBlobs.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius,
        originalRadius: radius,
        vx: (Math.random() - 0.5) * 2 * animationSpeed,
        vy: (Math.random() - 0.5) * 2 * animationSpeed,
        color: colorArray[i % colorArray.length],
        pulsePhase: Math.random() * Math.PI * 2
      });
    }
    setBlobs(newBlobs);
  };

  // Initialize particles
  const initParticles = (width: number, height: number) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        color: colors.accent
      });
    }
    setParticles(newParticles);
  };

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setDimensions({ width, height });
      initBlobs(width, height);
      initParticles(width, height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [blobCount, animationSpeed, colors, particleCount]);

  // Handle mouse movement
  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactive]);

  // Animation loop
  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0 || dimensions.height === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setTime(t => t + 0.016 * animationSpeed);

      // Update and draw particles
      const updatedParticles = particles.map(particle => {
        const { size, opacity, color, vx, vy } = particle;
        let { x, y } = particle;

        x += vx;
        y += vy;

        // Wrap around edges
        if (x < 0) x = canvas.width;
        if (x > canvas.width) x = 0;
        if (y < 0) y = canvas.height;
        if (y > canvas.height) y = 0;

        // Draw particle
        ctx.globalAlpha = opacity * settings.particleOpacity;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();

        return { ...particle, x, y };
      });

      setParticles(updatedParticles);

      // Update blob positions
      const updatedBlobs = blobs.map(blob => {
        const { radius, originalRadius, pulsePhase } = blob;
        let { x, y, vx, vy } = blob;

        // Mouse interaction
        if (interactive) {
          const dx = mousePos.x - x;
          const dy = mousePos.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 250) {
            const force = (250 - distance) / 250;
            vx -= (dx / distance) * force * 0.8;
            vy -= (dy / distance) * force * 0.8;
          }
        }

        // Update position
        x += vx;
        y += vy;

        // Bounce off walls
        if (x - radius < 0 || x + radius > canvas.width) {
          vx *= -0.9;
          x = Math.max(radius, Math.min(canvas.width - radius, x));
        }
        if (y - radius < 0 || y + radius > canvas.height) {
          vy *= -0.9;
          y = Math.max(radius, Math.min(canvas.height - radius, y));
        }

        // Apply friction
        vx *= 0.995;
        vy *= 0.995;

        // Add random movement
        vx += (Math.random() - 0.5) * 0.2 * animationSpeed;
        vy += (Math.random() - 0.5) * 0.2 * animationSpeed;

        // Pulse effect
        let currentRadius = originalRadius;
        if (pulseEffect) {
          currentRadius = originalRadius + Math.sin(time * 2 + pulsePhase) * 10;
        }

        return { ...blob, x, y, vx, vy, radius: currentRadius };
      });

      setBlobs(updatedBlobs);

      // Draw background gradient
      const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      bgGradient.addColorStop(0, colors.primary.replace(/[\d.]+\)$/, '0.02)'));
      bgGradient.addColorStop(0.5, colors.secondary.replace(/[\d.]+\)$/, '0.01)'));
      bgGradient.addColorStop(1, colors.tertiary.replace(/[\d.]+\)$/, '0.02)'));

      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw blobs with enhanced effects
      updatedBlobs.forEach((blob, index) => {
        // Create radial gradient for blob
        const blobGradient = ctx.createRadialGradient(
          blob.x, blob.y, 0,
          blob.x, blob.y, blob.radius
        );
        blobGradient.addColorStop(0, blob.color.replace(/[\d.]+\)$/, `${settings.opacity * 0.4})`));
        blobGradient.addColorStop(0.4, blob.color.replace(/[\d.]+\)$/, `${settings.opacity * 0.2})`));
        blobGradient.addColorStop(0.7, blob.color.replace(/[\d.]+\)$/, `${settings.opacity * 0.05})`));
        blobGradient.addColorStop(1, blob.color.replace(/[\d.]+\)$/, '0)'));

        ctx.globalAlpha = settings.opacity;
        ctx.fillStyle = blobGradient;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        ctx.fill();

        // Add glow effect
        ctx.shadowBlur = 20;
        ctx.shadowColor = blob.color;
        ctx.globalAlpha = settings.opacity * 0.3;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.radius * 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw connections
        if (showConnections) {
          updatedBlobs.slice(index + 1).forEach(otherBlob => {
            const dx = blob.x - otherBlob.x;
            const dy = blob.y - otherBlob.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = blob.radius + otherBlob.radius + 100;

            if (distance < maxDistance) {
              const opacity = (1 - distance / maxDistance) * settings.connectionOpacity;
              ctx.strokeStyle = blob.color.replace(/[\d.]+\)$/, `${opacity})`);
              ctx.lineWidth = 3;
              ctx.beginPath();
              ctx.moveTo(blob.x, blob.y);
              ctx.lineTo(otherBlob.x, otherBlob.y);
              ctx.stroke();
            }
          });
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, blobs, particles, mousePos, colors, settings, animationSpeed, interactive, showConnections, pulseEffect, time]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{
        background: `linear-gradient(135deg,
          ${colors.primary.replace(/[\d.]+\)$/, '0.01)')} 0%,
          ${colors.secondary.replace(/[\d.]+\)$/, '0.005)')} 50%,
          ${colors.tertiary.replace(/[\d.]+\)$/, '0.01)')} 100%)`
      }}
    />
  );
};

export default LiquidEtherBackgroundEnhanced;