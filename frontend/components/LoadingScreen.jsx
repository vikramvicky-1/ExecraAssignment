"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const STRIPE_COLORS = [
  "#EDF2EE",
  "#FDF6ED",
  "#EDF4F7",
  "#F2F0EB",
  "#EEF2ED",
  "#EDF2EE",
  "#FDF6ED",
]

export default function LoadingScreen({ onComplete }) {
  const [phase, setPhase] = useState("loading")
  const [roleText, setRoleText] = useState("")
  const [barWidth, setBarWidth] = useState(0)
  const [counter, setCounter] = useState(0)
  const [showName, setShowName] = useState(false)
  const [showRole, setShowRole] = useState(false)
  const [showBar, setShowBar] = useState(false)
  const rafRef = useRef(null)
  const startTimeRef = useRef(null)
  const roleFullText = "Full Stack Engineer"

  useEffect(() => {
    // 100ms: show name
    const t1 = setTimeout(() => setShowName(true), 100)
    // 400ms: type role
    const t2 = setTimeout(() => setShowRole(true), 400)
    // 800ms: start bar
    const t3 = setTimeout(() => setShowBar(true), 800)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [])

  // Type-in role
  useEffect(() => {
    if (!showRole) return
    let i = 0
    const iv = setInterval(() => {
      i++
      setRoleText(roleFullText.slice(0, i))
      if (i >= roleFullText.length) clearInterval(iv)
    }, 30)
    return () => clearInterval(iv)
  }, [showRole])

  // Loading bar + counter
  useEffect(() => {
    if (!showBar) return
    const duration = 1200
    const ease = (t) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    }
    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const elapsed = timestamp - startTimeRef.current
      const rawT = Math.min(elapsed / duration, 1)
      const t = ease(rawT)
      const pct = Math.round(t * 100)
      setBarWidth(t * 100)
      setCounter(pct)
      if (rawT < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        // 100% reached — wait 150ms then reveal
        setTimeout(() => {
          setPhase("revealing")
          setTimeout(() => {
            setPhase("done")
            onComplete()
          }, 800)
        }, 150)
      }
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [showBar, onComplete])

  if (phase === "done") return null

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          aria-label="Loading portfolio for Vikram"
          role="status"
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          exit={{ opacity: 1 }}
        >
          {/* Stripes */}
          <div className="absolute inset-0 flex">
            {STRIPE_COLORS.map((color, i) => (
              <motion.div
                key={i}
                style={{ backgroundColor: color, width: `${100 / 7}%`, height: "100%" }}
                animate={
                  phase === "revealing"
                    ? { y: "-100%" }
                    : { y: 0 }
                }
                transition={
                  phase === "revealing"
                    ? {
                        duration: 0.9,
                        delay: i * 0.08,
                        ease: [0.76, 0, 0.24, 1],
                      }
                    : { duration: 0 }
                }
              />
            ))}
          </div>

          {/* Center content */}
          <motion.div
            className="relative z-10 flex flex-col items-center gap-4"
            animate={phase === "revealing" ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* VIKRAM name */}
            <motion.h1
              className="font-playfair font-black italic text-[#1A1814] select-none"
              style={{
                fontSize: "clamp(80px, 14vw, 180px)",
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
              initial={{ y: 30, opacity: 0 }}
              animate={showName ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 80, damping: 20, duration: 0.6 }}
            >
              VIKRAM
            </motion.h1>

            {/* Role text */}
            <motion.p
              className="font-dm-sans text-[#6B6560] tracking-[0.08em]"
              style={{ fontSize: "18px", fontWeight: 500, minHeight: "27px" }}
              initial={{ opacity: 0 }}
              animate={showRole ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {roleText}
              {showRole && roleText.length < roleFullText.length && (
                <span className="opacity-60">|</span>
              )}
            </motion.p>

            {/* Loading bar */}
            <motion.div
              className="flex items-center gap-3 mt-2"
              initial={{ opacity: 0 }}
              animate={showBar ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="relative overflow-hidden"
                style={{ width: "280px", height: "2px", background: "rgba(26,24,20,0.1)", borderRadius: "2px" }}
              >
                <div
                  style={{
                    width: `${barWidth}%`,
                    height: "100%",
                    background: "#2D5A3D",
                    borderRadius: "2px",
                    transition: "none",
                  }}
                />
              </div>
              <span
                className="font-dm-mono text-[#2D5A3D]"
                style={{ fontSize: "13px", minWidth: "36px", textAlign: "right" }}
              >
                {counter}%
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
