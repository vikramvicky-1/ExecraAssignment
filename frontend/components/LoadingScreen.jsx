"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ACCENT_COLOR = "#F63D18";
// Reduced to 10 strips with 10% opacity intervals for a bolder, more pronounced look
const STRIPE_COUNT = 10;
const STRIPE_OPACITIES = Array.from({ length: STRIPE_COUNT }, (_, i) => 
  (i + 1) * 0.10 // 0.1, 0.2, 0.3, ..., 1.0
);

export default function LoadingScreen({ onComplete }) {
  const [phase, setPhase] = useState("loading");
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const duration = 2800; 
    const ease = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const rawT = Math.min(elapsed / duration, 1);
      const t = ease(rawT);
      
      setProgress(t);

      if (rawT < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          setPhase("revealing");
          setTimeout(() => {
            setPhase("done");
            onComplete();
          }, 1200);
        }, 500);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [onComplete]);

  if (phase === "done") return null;

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[9999] bg-[#FAF8F4] overflow-hidden"
    >
      
      {/* Reduced Strips: 10% Intervals for Bolder Architectural Rhythm */}
      <div className="absolute inset-0 flex">
        {STRIPE_OPACITIES.map((baseOpacity, i) => {
          const stripThreshold = i / STRIPE_OPACITIES.length;
          const isActive = progress >= stripThreshold;

          return (
            <motion.div
              key={i}
              initial={{ y: 0 }}
              animate={phase === "revealing" ? { y: "-100%" } : { y: 0 }}
              transition={{ 
                duration: 1.4, 
                delay: i * 0.08, // Slightly more delay per strip for a weightier reveal
                ease: [0.76, 0, 0.24, 1] 
              }}
              style={{ 
                width: `${100 / STRIPE_COUNT}%`, 
                height: "100%",
                position: "relative"
              }}
            >
              {/* Bold Base Layer with 10% step opacity */}
              <div 
                className="absolute inset-0" 
                style={{ opacity: baseOpacity, backgroundColor: ACCENT_COLOR }} 
              />
              
              {/* High-Contrast Progress Lighting */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive ? 0.35 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
                style={{ backgroundColor: ACCENT_COLOR }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Main Branding */}
      <motion.div 
        animate={phase === "revealing" ? { opacity: 0, scale: 0.95, y: -20 } : { opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6"
      >
        <div className="overflow-hidden pb-2">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-universo font-black uppercase text-[#1A1814] select-none tracking-[-0.05em] text-center"
            style={{ fontSize: "clamp(60px, 15vw, 240px)" }}
          >
            VIKRAM
          </motion.h1>
        </div>

        <div className="overflow-hidden">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={showContent ? { opacity: 0.6, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-universo font-bold uppercase text-[#1A1814] tracking-[0.4em] text-[10px] md:text-[14px] mt-2 md:mt-4"
          >
            Full Stack Engineer
          </motion.p>
        </div>
      </motion.div>

      {/* Progress Dash */}
      {phase === "loading" && (
        <div className="fixed bottom-0 left-0 w-full h-[4px] bg-[#1A1814]/10">
          <motion.div 
            style={{ 
              width: `${progress * 100}%`,
              backgroundColor: ACCENT_COLOR
            }}
            className="h-full shadow-[0_0_20px_rgba(246,61,24,0.4)]"
          />
        </div>
      )}

      {/* System Status */}
      <AnimatePresence>
        {phase === "loading" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-8 right-8 md:bottom-12 md:right-12"
          >
            <p className="font-universo font-black text-[10px] md:text-[12px] uppercase tracking-[0.3em] text-[#1A1814]/30 flex items-center gap-3">
              Initializing System
              <motion.span 
                animate={{ opacity: [1, 0.3, 1] }} 
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-1.5 h-1.5 rounded-full bg-portfolio-accent" 
              />
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
