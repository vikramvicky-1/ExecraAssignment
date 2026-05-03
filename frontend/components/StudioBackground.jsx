"use client";

import React, { useEffect, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const InteractiveGrid = () => {
  const canvasRef = useRef(null);
  const mouse = { x: 0, y: 0 };
  const targetMouse = { x: 0, y: 0 };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      targetMouse.x = e.clientX;
      targetMouse.y = e.clientY;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    resize();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Smoothly lerp mouse
      mouse.x += (targetMouse.x - mouse.x) * 0.1;
      mouse.y += (targetMouse.y - mouse.y) * 0.1;

      const gridSize = 32;
      const boxSize = 1.5;
      const columns = Math.ceil(canvas.width / gridSize);
      const rows = Math.ceil(canvas.height / gridSize);

      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * gridSize;
          const y = j * gridSize;
          
          const dx = mouse.x - x;
          const dy = mouse.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          // Interaction radius and intensity
          const radius = 180;
          let opacity = 0.08;
          let scale = 1;
          let color = 'rgba(26, 24, 20, 0.08)'; // Base dark color
          
          if (dist < radius) {
            const factor = 1 - dist / radius;
            opacity = 0.08 + factor * 0.5;
            scale = 1 + factor * 3;
            color = `rgba(246, 61, 24, ${opacity})`; // #F63D18 with dynamic opacity
            
            // Draw subtle highlight shadow
            ctx.shadowBlur = 15 * factor;
            ctx.shadowColor = 'rgba(246, 61, 24, 0.3)';
          } else {
            ctx.shadowBlur = 0;
            color = `rgba(246, 61, 24, ${opacity * 0.4})`; // Subtle accent even when not hovered
          }

          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.rect(x - (boxSize * scale) / 2, y - (boxSize * scale) / 2, boxSize * scale, boxSize * scale);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

const StudioBackground = ({ isMobile }) => {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#FAF8F4] z-0 pointer-events-none">
      {!isMobile && <InteractiveGrid />}
      
      {/* Animated Gradient Mesh - Sophisticated and Minimal */}
      <motion.div 
        animate={{
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-[#F63D18]/[0.03] rounded-full blur-[120px]"
      />
      
      <motion.div 
        animate={{
          x: [0, -30, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-[#1A1814]/[0.02] rounded-full blur-[100px]"
      />

      {/* High-Fidelity Grain Overlay */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* Subtle Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(26,24,20,0.02)_100%)]" />
    </div>
  );
};

export default StudioBackground;
