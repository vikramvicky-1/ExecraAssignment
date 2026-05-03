"use client"

import { useRef, useEffect } from "react"
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"
import useContentStore from "@/store/useContentStore"

function WordReveal({ text }) {
  const ref = useRef(null)
  const prefersReduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end center"] })

  const words = text.split(" ")

  return (
    <p ref={ref} className="font-dm-sans text-[#6B6560]" style={{ fontSize: "clamp(16px, 1.3vw, 18px)", fontWeight: 300, lineHeight: 1.9 }}>
      {words.map((word, i) => {
        const start = i / words.length
        const end = (i + 1) / words.length
        return (
          <Word
            key={i}
            word={word}
            scrollYProgress={scrollYProgress}
            start={start}
            end={end}
            prefersReduced={!!prefersReduced}
          />
        )
      })}
    </p>
  )
}

function Word({ word, scrollYProgress, start, end, prefersReduced }) {
  const opacity = useTransform(scrollYProgress, [start, end], [0.15, 1])
  return (
    <motion.span
      style={{ opacity: prefersReduced ? 1 : opacity, display: "inline-block", marginRight: "0.28em" }}
    >
      {word}
    </motion.span>
  )
}

function SectionHeading({ label, title }) {
  const prefersReduced = useReducedMotion()
  const titleArray = Array.isArray(title) ? title : [title]

  return (
    <div className="mb-12">
      <motion.p
        className="font-dm-mono text-portfolio-accent uppercase mb-4"
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
          <h2
            key={i}
            className="font-universo text-[#1A1814] uppercase gsap-reveal-text"
            style={{ 
              fontSize: "clamp(64px, 9vw, 130px)", 
              fontWeight: 900, 
              lineHeight: 0.9,
              letterSpacing: "-0.05em",
              display: "block"
            }}
          >
            {line}
          </h2>
        ))}
      </div>
    </div>
  )
}

export default function AboutSection() {
  const prefersReduced = useReducedMotion()
  const { content, fetchContent } = useContentStore()

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  const manifesto = content?.about?.manifesto || [
    "I'm Vikram. I build things that hold weight. Not just visually — architecturally. Every system I ship is designed to still be standing at 10x the original load.",
    "MERN and Next.js are my native languages. I've built platforms that sustain ten thousand concurrent users. The architecture was right from line one because it had to be.",
    "I believe that the best interfaces are the ones nobody notices. They just work. That invisibility is the hardest thing to achieve. It is what I spend every project chasing.",
  ]

  const milestones = content?.about?.milestones || [
    { year: "2021", title: "Started Engineering", desc: "First project shipped. Broke everything twice, then fixed it properly." },
    { year: "2022", title: "First Client", desc: "Freelance launch. Real problems, real deadlines, real growth." },
    { year: "2023", title: "MERN Mastery", desc: "Built first 1K user app. Learned what scale actually feels like." },
    { year: "2024", title: "Scale Achieved", desc: "10K concurrent users platform. The architecture held every time." },
    { year: "2025", title: "Next.js Era", desc: "Full-stack SSR architecture. The fastest apps I've ever shipped." },
  ]

  return (
    <section
      id="about"
      style={{
        padding: "120px clamp(24px, 5vw, 64px)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeading label="ENGINEERING MINDSET — 2021/25" title={["The", "Architect."]} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mt-24 items-start">
          {/* Left: Manifesto */}
          <div className="space-y-12 gsap-parallax" data-speed="40">
            {manifesto.map((paragraph, i) => (
              <WordReveal key={i} text={paragraph} />
            ))}
          </div>

          {/* Right: Milestones */}
          <div className="lg:pl-12 space-y-16 gsap-parallax" data-speed="80">
            <div className="space-y-4">
              <h3 className="font-playfair text-3xl italic text-[#1A1814]">The Milestones</h3>
              <div className="w-12 h-[1px] bg-portfolio-accent" />
            </div>

            <div className="space-y-12 border-l border-black/5 pl-8 py-2">
              {milestones.map((milestone, i) => (
                <motion.div
                  key={i}
                  className="relative"
                  initial={prefersReduced ? { opacity: 0 } : { x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="absolute -left-[37px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-portfolio-accent" />
                  <div className="font-dm-mono text-portfolio-accent text-[10px] mb-1">{milestone.year}</div>
                  <h4 className="font-dm-sans text-[#1A1814] font-semibold text-lg mb-2">{milestone.title}</h4>
                  <p className="font-dm-sans text-[#6B6560] text-sm leading-relaxed">{milestone.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
