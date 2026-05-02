"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"
import useContentStore from "@/store/useContentStore"

const ORBIT_TECHS = [
  { name: "React", pct: 92, color: "#61DAFB", symbol: "Re" },
  { name: "Next.js", pct: 88, color: "#000000", symbol: "N." },
  { name: "Node.js", pct: 85, color: "#339933", symbol: "No" },
  { name: "MongoDB", pct: 80, color: "#47A248", symbol: "Mg" },
  { name: "TypeScript", pct: 78, color: "#3178C6", symbol: "TS" },
  { name: "Express", pct: 87, color: "#404040", symbol: "Ex" },
]

const SUPPORTING = [
  "REST APIs", "GraphQL", "Redis", "Docker", "Git", "Vercel", "AWS",
  "Socket.io", "Prisma", "PostgreSQL", "TailwindCSS", "Framer Motion",
  "Jest", "Linux", "Webpack", "Supabase", "GitHub Actions",
]

const LEARNING_MARQUEE = "Rust · WebGL Shaders · Edge Computing · LLM Fine-Tuning · System Design at Scale · tRPC · Bun Runtime · "

function SkillBar({ tech, pct, index, inView }) {
  const prefersReduced = useReducedMotion()
  return (
    <div style={{ marginBottom: "28px" }}>
      <div className="flex justify-between items-center mb-2">
        <span className="font-dm-sans text-[#1A1814]" style={{ fontSize: "14px", fontWeight: 500 }}>{tech}</span>
        <span className="font-dm-mono text-[#B8B3AC]" style={{ fontSize: "11px" }}>{pct}%</span>
      </div>
      <div
        style={{
          width: "100%",
          height: "4px",
          background: "rgba(26,24,20,0.08)",
          borderRadius: "100px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <motion.div
          style={{
            height: "100%",
            background: "linear-gradient(90deg, #2D5A3D, #4A8B5C)",
            borderRadius: "100px",
          }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : { width: 0 }}
          transition={{
            duration: prefersReduced ? 0 : 1.2,
            delay: prefersReduced ? 0 : index * 0.1,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        />
      </div>
    </div>
  )
}

function OrbitDisplay({ techs }) {
  const prefersReduced = useReducedMotion()
  const [hoveredTech, setHoveredTech] = useState(null)
  const radius = 180
  const centerSize = 140

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: "100%", height: "440px" }}
      aria-label="Technology orbit display"
    >
      {/* Orbit ring */}
      <div
        style={{
          position: "absolute",
          width: radius * 2 + 72 + "px",
          height: radius * 2 + 72 + "px",
          borderRadius: "50%",
          border: "1px dashed rgba(26,24,20,0.08)",
        }}
      />

      {/* Rotating system */}
      <motion.div
        style={{ position: "absolute", width: "100%", height: "100%" }}
        animate={prefersReduced ? {} : { rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {techs.map((tech, i) => {
          const angle = (i * 360) / techs.length
          const rad = (angle * Math.PI) / 180
          const x = Math.cos(rad) * radius
          const y = Math.sin(rad) * radius

          return (
            <motion.div
              key={tech.name}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: "72px",
                height: "72px",
                marginLeft: Math.round(x - 36) + "px",
                marginTop: Math.round(y - 36) + "px",
                borderRadius: "50%",
                background: "white",
                border: hoveredTech === tech.name ? "2px solid rgba(45,90,61,0.4)" : "1px solid rgba(26,24,20,0.08)",
                boxShadow: "0 2px 16px rgba(26,24,20,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 10,
              }}
              animate={prefersReduced ? {} : { rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              whileHover={{ scale: 1.2 }}
              onHoverStart={() => setHoveredTech(tech.name)}
              onHoverEnd={() => setHoveredTech(null)}
            >
              <span
                className="font-dm-mono font-bold"
                style={{ fontSize: "13px", color: tech.color, letterSpacing: "0.05em" }}
              >
                {tech.symbol}
              </span>

              {/* Tooltip */}
              {hoveredTech === tech.name && (
                <motion.div
                  style={{
                    position: "absolute",
                    bottom: "calc(100% + 10px)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "white",
                    borderRadius: "10px",
                    padding: "8px 14px",
                    boxShadow: "0 4px 20px rgba(26,24,20,0.1)",
                    whiteSpace: "nowrap",
                    zIndex: 20,
                    pointerEvents: "none",
                  }}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <p className="font-dm-sans text-[#1A1814]" style={{ fontSize: "13px", fontWeight: 500 }}>{tech.name}</p>
                  <p className="font-dm-mono text-[#2D5A3D]" style={{ fontSize: "11px" }}>{tech.pct}%</p>
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </motion.div>

      {/* Center */}
      <div
        style={{
          width: centerSize + "px",
          height: centerSize + "px",
          borderRadius: "50%",
          background: "white",
          border: "1px solid rgba(26,24,20,0.08)",
          boxShadow: "0 4px 40px rgba(26,24,20,0.08)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 5,
          position: "relative",
        }}
      >
        <span className="font-dm-mono text-[#6B6560]" style={{ fontSize: "11px", letterSpacing: "0.1em" }}>VIKRAM</span>
        <span className="font-dm-mono text-[#B8B3AC]" style={{ fontSize: "9px", letterSpacing: "0.1em", marginTop: "2px" }}>STACK</span>
      </div>
    </div>
  )
}

function SectionHeading({ label, title }) {
  const prefersReduced = useReducedMotion()
  const titleArray = Array.isArray(title) ? title : [title]

  return (
    <div className="mb-16">
      <motion.p
        className="font-dm-mono text-[#2D5A3D] uppercase mb-4"
        style={{ fontSize: "11px", letterSpacing: "0.2em", fontWeight: 700 }}
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {label}
      </motion.p>
      <div className="flex flex-col">
        {titleArray.map((line, i) => (
          <motion.h2
            key={i}
            className="font-playfair text-[#1A1814]"
            style={{ 
              fontSize: "clamp(64px, 9vw, 130px)", 
              fontWeight: 800, 
              lineHeight: 1,
              display: "block"
            }}
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.215, 0.61, 0.355, 1] }}
          >
            {line}
          </motion.h2>
        ))}
      </div>
    </div>
  )
}

export default function SkillsSection() {
  const prefersReduced = useReducedMotion()
  const barsRef = useRef(null)
  const barsInView = useInView(barsRef, { once: true, margin: "-80px" })
  const { content, fetchContent } = useContentStore()

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  const majorSkills = content?.skills?.major || [
    { name: "React", pct: 92, color: "#61DAFB", symbol: "Re" },
    { name: "Next.js", pct: 88, color: "#000000", symbol: "N." },
    { name: "Node.js", pct: 85, color: "#339933", symbol: "No" },
    { name: "MongoDB", pct: 80, color: "#47A248", symbol: "Mg" },
    { name: "TypeScript", pct: 78, color: "#3178C6", symbol: "TS" },
    { name: "Express", pct: 87, color: "#404040", symbol: "Ex" },
  ]

  const minorSkills = content?.skills?.minor || [
    "REST APIs", "GraphQL", "Redis", "Docker", "Git", "Vercel", "AWS",
    "Socket.io", "Prisma", "PostgreSQL", "TailwindCSS", "Framer Motion",
    "Jest", "Linux", "Webpack", "Supabase", "GitHub Actions",
  ]

  const exploringSkills = content?.skills?.exploring || [
    "Rust", "WebGL Shaders", "Edge Computing", "LLM Fine-Tuning", 
    "System Design at Scale", "tRPC", "Bun Runtime"
  ]

  const exploringMarquee = exploringSkills.join(" · ") + " · "

  return (
    <section
      id="skills"
      style={{
        background: "var(--section-skills)",
        padding: "120px clamp(24px, 5vw, 64px)",
      }}
    >
      <SectionHeading label="03 — Technical Skills" title={["The", "Arsenal."]} />

      {/* Sub-layout 1+2: orbit + bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
        {/* Orbit */}
        <OrbitDisplay techs={majorSkills} />

        {/* Skill bars */}
        <div ref={barsRef} className="flex flex-col justify-center">
          {majorSkills.map((tech, i) => (
            <SkillBar key={tech.name} tech={tech.name} pct={tech.pct} index={i} inView={barsInView} />
          ))}
        </div>
      </div>

      {/* Sub-layout 3: supporting pills */}
      <motion.div
        className="flex flex-wrap gap-3 mb-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: prefersReduced ? 0 : 0.02, delayChildren: 0.3 } },
        }}
      >
        {minorSkills.map((pill) => (
          <motion.span
            key={pill}
            className="font-dm-mono text-[#6B6560] hover:text-[#2D5A3D] cursor-default"
            style={{
              fontSize: "11px",
              padding: "8px 20px",
              borderRadius: "100px",
              background: "white",
              border: "1px solid rgba(26,24,20,0.08)",
              transition: "all 200ms ease",
            }}
            variants={{
              hidden: { y: 10, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
            whileHover={{
              background: "rgba(45,90,61,0.07)",
              borderColor: "rgba(45,90,61,0.2)",
              y: -2,
            }}
          >
            {pill}
          </motion.span>
        ))}
      </motion.div>

      {/* Sub-layout 4: currently learning */}
      <motion.div
        style={{
          background: "white",
          borderRadius: "16px",
          border: "1px solid rgba(26,24,20,0.06)",
          padding: "24px 32px",
          display: "flex",
          alignItems: "center",
          gap: "32px",
          overflow: "hidden",
        }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <span
          className="font-dm-mono text-[#2D5A3D] uppercase whitespace-nowrap flex-shrink-0"
          style={{ fontSize: "11px", letterSpacing: "0.15em" }}
        >
          // Currently Exploring
        </span>
        <div key={exploringMarquee} style={{ overflow: "hidden", flex: 1, maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)" }}>
          <motion.p
            className="font-dm-sans text-[#6B6560] whitespace-nowrap"
            style={{ fontSize: "14px", fontWeight: 300 }}
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
            {exploringMarquee.repeat(4)}
          </motion.p>
        </div>
      </motion.div>
    </section>
  )
}
