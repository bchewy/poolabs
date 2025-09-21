"use client";

import React, { useEffect, useRef, useState } from 'react';

interface LiquidEtherBackgroundProps {
  className?: string;
  colors?: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  opacity?: number;
  animationSpeed?: number;
  blobCount?: number;
  interactive?: boolean;
}

interface Blob {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  color: string;
}

const LiquidEtherBackground: React.FC<LiquidEtherBackgroundProps> = ({
  className = "",
  colors = {
    primary: "rgba(245, 158, 11, 0.1)",    // Amber - matches PooLabs theme
    secondary: "rgba(251, 191, 36, 0.08)", // Light amber
    tertiary: "rgba(217, 119, 6, 0.06)"   // Dark amber
  },
  opacity = 0.8,
  animationSpeed = 1,
  blobCount = 5,
  interactive = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [blobs, setBlobs] = useState<Blob[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Initialize blobs
  const initBlobs = (width: number, height: number) => {
    const newBlobs: Blob[] = [];
    const colorArray = [colors.primary, colors.secondary, colors.tertiary];

    for (let i = 0; i < blobCount; i++) {
      newBlobs.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 100 + Math.random() * 200,
        vx: (Math.random() - 0.5) * 2 * animationSpeed,
        vy: (Math.random() - 0.5) * 2 * animationSpeed,
        color: colorArray[i % colorArray.length]
      });
    }
    setBlobs(newBlobs);
  };

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setDimensions({ width, height });
      initBlobs(width, height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [blobCount, animationSpeed, colors]);

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

      // Update blob positions
      const updatedBlobs = blobs.map(blob => {
        const { radius } = blob;
        let { x, y, vx, vy } = blob;

        // Mouse interaction
        if (interactive) {
          const dx = mousePos.x - x;
          const dy = mousePos.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 200) {
            const force = (200 - distance) / 200;
            vx -= (dx / distance) * force * 0.5;
            vy -= (dy / distance) * force * 0.5;
          }
        }

        // Update position
        x += vx;
        y += vy;

        // Bounce off walls
        if (x - radius < 0 || x + radius > canvas.width) {
          vx *= -0.8;
          x = Math.max(radius, Math.min(canvas.width - radius, x));
        }
        if (y - radius < 0 || y + radius > canvas.height) {
          vy *= -0.8;
          y = Math.max(radius, Math.min(canvas.height - radius, y));
        }

        // Add some friction
        vx *= 0.99;
        vy *= 0.99;

        // Add some random movement
        vx += (Math.random() - 0.5) * 0.1 * animationSpeed;
        vy += (Math.random() - 0.5) * 0.1 * animationSpeed;

        return { ...blob, x, y, vx, vy };
      });

      setBlobs(updatedBlobs);

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, colors.primary);
      gradient.addColorStop(0.5, colors.secondary);
      gradient.addColorStop(1, colors.tertiary);

      // Draw blobs with metaball effect
      ctx.globalAlpha = opacity;

      updatedBlobs.forEach((blob, index) => {
        // Create radial gradient for each blob
        const blobGradient = ctx.createRadialGradient(
          blob.x, blob.y, 0,
          blob.x, blob.y, blob.radius
        );
        blobGradient.addColorStop(0, blob.color.replace(/[\d.]+\)$/, '0.3)'));
        blobGradient.addColorStop(0.5, blob.color.replace(/[\d.]+\)$/, '0.1)'));
        blobGradient.addColorStop(1, blob.color.replace(/[\d.]+\)$/, '0)'));

        ctx.fillStyle = blobGradient;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw connections between nearby blobs
        updatedBlobs.slice(index + 1).forEach(otherBlob => {
          const dx = blob.x - otherBlob.x;
          const dy = blob.y - otherBlob.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = blob.radius + otherBlob.radius;

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.3;
            ctx.strokeStyle = `rgba(245, 158, 11, ${opacity})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(blob.x, blob.y);
            ctx.lineTo(otherBlob.x, otherBlob.y);
            ctx.stroke();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, blobs, mousePos, colors, opacity, animationSpeed, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{
        background: `linear-gradient(135deg,
          ${colors.primary.replace(/[\d.]+\)$/, '0.02)')} 0%,
          ${colors.secondary.replace(/[\d.]+\)$/, '0.01)')} 50%,
          ${colors.tertiary.replace(/[\d.]+\)$/, '0.02)')} 100%)`
      }}
    />
  );
};

export default LiquidEtherBackground;