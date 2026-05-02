"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowDown } from "lucide-react"
import useContentStore from "@/store/useContentStore"

const VIKRAM_LETTERS = "VIKRAM".split("")

function useCountUp(target, duration, start) {
  const [value, setValue] = useState(0)
  
  const numericTarget = typeof target === 'string' 
    ? parseFloat(target.replace(/[^0-9.]/g, '')) || 0
    : target

  useEffect(() => {
    if (!start || !numericTarget) return
    let raf
    const startTime = performance.now()
    const animate = (now) => {
      const elapsed = now - startTime
      const t = Math.min(elapsed / duration, 1)
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
      setValue(Math.round(eased * numericTarget))
      if (t < 1) raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [numericTarget, duration, start])

  return value
}

export default function HeroSection({ visible }) {
  const prefersReduced = useReducedMotion()
  const [iLineVisible, setILineVisible] = useState(false)
  const { content, fetchContent } = useContentStore()

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  const stats = content?.hero?.stats || [
    { label: "Projects", value: "40+" },
    { label: "Years", value: "3+" },
    { label: "Load", value: "10K+" }
  ]

  const count1 = useCountUp(stats[0]?.value, 1800, visible)
  const count2 = useCountUp(stats[1]?.value, 1800, visible)
  const count3 = useCountUp(stats[2]?.value, 1800, visible)

  const getSuffix = (val) => typeof val === 'string' ? val.replace(/[0-9.]/g, '') : ""

  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setILineVisible(true), 1400)
      return () => clearTimeout(t)
    }
  }, [visible])

  const letterVariants = {
    initial: { y: "110%", opacity: 0 },
    animate: (i) => ({
      y: "0%",
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 60,
        damping: 14,
        delay: prefersReduced ? 0 : i * 0.07,
      },
    }),
  }

  return (
    <section
      id="hero"
      style={{
        background: "var(--section-hero)",
        paddingTop: "180px",
        paddingBottom: "100px",
        paddingLeft: "clamp(24px, 5vw, 80px)",
        paddingRight: "clamp(24px, 5vw, 80px)",
      }}
    >
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-0">
        <div style={{ flex: "0 0 65%" }}>
          <motion.div
            className="font-dm-mono text-[#2D5A3D] uppercase mb-6"
            style={{ fontSize: "11px", letterSpacing: "0.2em" }}
            initial={prefersReduced ? { opacity: 0 } : { x: -20, opacity: 0 }}
            animate={visible ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            &gt; Full Stack Engineer — 2025
          </motion.div>

          <div className="flex overflow-visible mb-8" style={{ gap: "0.01em" }} aria-label="VIKRAM">
            {VIKRAM_LETTERS.map((letter, i) => (
              <div key={i} style={{ overflow: "hidden", display: "inline-block" }}>
                <motion.span
                  className="font-playfair text-[#1A1814] inline-block"
                  style={{ fontSize: "clamp(96px, 15vw, 190px)", fontWeight: 900, lineHeight: 0.85 }}
                  variants={letterVariants}
                  initial="initial"
                  animate={visible ? "animate" : "initial"}
                  custom={i}
                >
                  {letter}
                </motion.span>
              </div>
            ))}
          </div>

          <div className="max-w-2xl mb-12">
            <h1 className="font-playfair text-[#1A1814] text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-2 overflow-hidden">
              <motion.span 
                className="inline-block"
                initial={{ y: "100%" }}
                animate={visible ? { y: 0 } : { y: "100%" }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.76, 0, 0.24, 1] }}
              >
                Building scalable MERN applications
              </motion.span>
            </h1>
            <h1 className="font-playfair text-[#6B6560] text-3xl md:text-5xl lg:text-6xl font-light leading-[1.1] italic overflow-hidden">
              <motion.span 
                className="inline-block"
                initial={{ y: "100%" }}
                animate={visible ? { y: 0 } : { y: "100%" }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.76, 0, 0.24, 1] }}
              >
                Next.js experiences that matter.
              </motion.span>
            </h1>
          </div>

          <motion.div className="flex items-center gap-6" initial={{ opacity: 0 }} animate={visible ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 1.2 }}>
            <a href="#work" className="w-16 h-16 rounded-full border border-black/10 flex items-center justify-center text-[#1A1814] hover:bg-[#1A1814] hover:text-white transition-all group">
              <ArrowDown size={20} className="group-hover:translate-y-1 transition-transform" />
            </a>
            <span className="font-dm-mono text-[10px] uppercase tracking-widest text-[#B8B3AC]">Experience — Work</span>
          </motion.div>
        </div>

        <div style={{ flex: "1", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div className="flex flex-col gap-12 lg:pl-12">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="w-[1px] h-12 bg-black/10 mt-2" />
                <div>
                  <div className="font-playfair text-[#1A1814] text-5xl md:text-6xl font-bold mb-2 relative">
                    {i === 0 ? count1 : i === 1 ? count2 : count3}{getSuffix(stats[i]?.value)}
                    {i === 2 && (
                      <motion.div className="absolute -right-6 top-0 w-2 h-2 rounded-full bg-[#2D5A3D]" initial={{ scale: 0 }} animate={iLineVisible ? { scale: 1 } : { scale: 0 }} />
                    )}
                  </div>
                  <div className="font-dm-mono text-[10px] uppercase tracking-widest text-[#B8B3AC]">{stats[i]?.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
