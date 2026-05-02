"use client"

import { motion } from "framer-motion"
import { useReducedMotion } from "framer-motion"

const MARQUEE_TOKENS = [
  "FULL STACK ENGINEER",
  "·",
  "MERN STACK",
  "·",
  "NEXT.JS",
  "·",
  "VIKRAM",
  "·",
  "REAL-TIME SYSTEMS",
  "·",
  "NODE.JS",
  "·",
  "MONGODB",
  "·",
  "REACT",
  "·",
]

const ACCENT = "#2D5A3D"
const ACCENT_TOKENS = ["VIKRAM", "REACT"]

function MarqueeRow({ direction }) {
  const prefersReduced = useReducedMotion()
  const tokens = [...MARQUEE_TOKENS, ...MARQUEE_TOKENS]

  if (prefersReduced) {
    return (
      <div className="flex items-center gap-6 overflow-hidden py-2">
        {MARQUEE_TOKENS.map((token, i) => (
          <span
            key={i}
            className="font-playfair italic whitespace-nowrap"
            style={{
              fontSize: "clamp(48px, 6vw, 80px)",
              fontWeight: 700,
              color: ACCENT_TOKENS.includes(token)
                ? ACCENT
                : i % 3 === 0
                ? "transparent"
                : "#1A1814",
              WebkitTextStroke:
                i % 3 === 0 && !ACCENT_TOKENS.includes(token)
                  ? "1.5px rgba(26,24,20,0.25)"
                  : undefined,
            }}
          >
            {token}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="flex overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)" }}>
      <motion.div
        className="flex items-center gap-6 py-2 whitespace-nowrap"
        animate={{ x: direction === 1 ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        style={{ willChange: "transform" }}
      >
        {tokens.map((token, i) => (
          <span
            key={i}
            className="font-playfair italic"
            style={{
              fontSize: "clamp(48px, 6vw, 80px)",
              fontWeight: 700,
              lineHeight: 1,
              color: ACCENT_TOKENS.includes(token)
                ? ACCENT
                : i % 3 === 0
                ? "transparent"
                : "#1A1814",
              WebkitTextStroke:
                i % 3 === 0 && !ACCENT_TOKENS.includes(token)
                  ? "1.5px rgba(26,24,20,0.25)"
                  : undefined,
              flexShrink: 0,
              paddingLeft: "24px",
              paddingRight: "24px",
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
  return (
    <section
      id="marquee"
      aria-hidden="true"
      style={{
        background: "var(--section-marquee)",
        borderTop: "1px solid rgba(26,24,20,0.08)",
        borderBottom: "1px solid rgba(26,24,20,0.08)",
        padding: "28px 0",
        overflow: "hidden",
      }}
    >
      <MarqueeRow direction={1} />
      <MarqueeRow direction={-1} />
    </section>
  )
}
