"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useReducedMotion } from "framer-motion"

const MARQUEE_TOKENS = [
  "MERN SKILLS",
  "·",
  "NODE.JS",
  "·",
  "NEXT.JS",
  "·",
  "FASTAPI",
  "·",
  "EXPRESS.JS",
  "·",
  "REACT.JS",
  "·",
  "SCALABLE SYSTEMS",
  "·",
  "SAAS",
  "·",
]

const ACCENT = "#F63D18"
const ACCENT_TOKENS = ["MERN SKILLS", "SAAS"]

function MarqueeRow({ direction, reverseOrder, duration, isRevealLayer = false }) {
  const baseTokens = reverseOrder ? [...MARQUEE_TOKENS].reverse() : MARQUEE_TOKENS
  const tokens = [...baseTokens, ...baseTokens, ...baseTokens]
  const prefersReduced = useReducedMotion()

  return (
    <div className="flex overflow-hidden py-2 lg:py-4">
      <motion.div
        className="flex items-center gap-3 lg:gap-6 whitespace-nowrap"
        animate={!prefersReduced ? { x: direction === 1 ? ["0%", "-33.33%"] : ["-33.33%", "0%"] } : {}}
        transition={{ duration: duration, repeat: Infinity, ease: "linear" }}
        style={{ willChange: "transform" }}
      >
        {tokens.map((token, i) => (
          <span
            key={i}
            className="font-universo uppercase px-3 lg:px-6 flex-shrink-0"
            style={{
              fontSize: "clamp(32px, 5vw, 64px)",
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-0.04em",
              // Base Layer Styles
              color: !isRevealLayer 
                ? (ACCENT_TOKENS.includes(token) ? ACCENT : (i % 3 === 0 ? "transparent" : "#1A1814"))
                : (ACCENT_TOKENS.includes(token) ? "#1A1814" : (i % 3 === 0 ? "transparent" : ACCENT)), // Swap: Orange to Black, Black to Orange
              WebkitTextStroke: (i % 3 === 0 && !ACCENT_TOKENS.includes(token)) 
                ? `1px ${!isRevealLayer ? "rgba(26,24,20,1)" : ACCENT}` // Outline also flips: Black to Orange
                : undefined,
              // No more gradients or blend modes on the container to keep background clean
              background: "none",
              WebkitBackgroundClip: "none",
              backgroundClip: "none",
              animation: "none",
            }}
          >
            {token}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

export default function MarqueeSection() {
  const sectionRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [duration, setDuration] = useState(35)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const updateState = () => {
      const width = window.innerWidth
      setDuration(width < 768 ? 18 : 35)
      setIsDesktop(width >= 1024)
    }

    updateState()
    window.addEventListener("resize", updateState)

    const handleMouseMove = (e) => {
      if (window.innerWidth < 1024) return
      const rect = section.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      section.style.setProperty("--mx", `${x}px`)
      section.style.setProperty("--my", `${y}px`)
    }

    section.addEventListener("mousemove", handleMouseMove)
    return () => {
      section.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", updateState)
    }
  }, [])

  return (
    <section
      id="marquee"
      ref={sectionRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative bg-[#FAF8F4] overflow-hidden border-y border-black/5"
    >
      {/* Base Layer - Normal Scrolling */}
      <div className="relative z-0">
        <MarqueeRow direction={1} reverseOrder={false} duration={duration} />
        <MarqueeRow direction={-1} reverseOrder={true} duration={duration} />
      </div>

      {/* Reveal Layer - Stays exactly on top but only visible through mask - Desktop Only */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none select-none transition-opacity duration-500 hidden lg:block"
        style={{
          opacity: (isHovered && isDesktop) ? 1 : 0,
          maskImage: "radial-gradient(circle 100px at var(--mx) var(--my), black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(circle 100px at var(--mx) var(--my), black 40%, transparent 100%)",
        }}
      >
        <MarqueeRow direction={1} reverseOrder={false} duration={duration} isRevealLayer={true} />
        <MarqueeRow direction={-1} reverseOrder={true} duration={duration} isRevealLayer={true} />
      </div>

      <style jsx global>{`
        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </section>
  )
}



