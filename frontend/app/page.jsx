"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useReducedMotion } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import LoadingScreen from "@/components/LoadingScreen"
import Navigation from "@/components/Navigation"
import HeroSection from "@/components/HeroSection"
import MarqueeSection from "@/components/MarqueeSection"
import WorkSection from "@/components/WorkSection"
import SkillsSection from "@/components/SkillsSection"
import AboutSection from "@/components/AboutSection"
import ContactSection from "@/components/ContactSection"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const SECTION_COLORS = {
  hero: "#FAF8F4",
  marquee: "#EDF2EE",
  work: "#FDF6ED",
  skills: "#EDF4F7",
  about: "#F2F0EB",
  contact: "#EEF2ED",
}

export default function Portfolio() {
  const prefersReduced = useReducedMotion()
  const [loadingDone, setLoadingDone] = useState(false)
  const [heroVisible, setHeroVisible] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")
  const lenisRef = useRef(null)

  // Skip loading for reduced motion
  useEffect(() => {
    if (prefersReduced) {
      setLoadingDone(true)
      setHeroVisible(true)
    }
  }, [prefersReduced])

  // Lenis smooth scroll
  useEffect(() => {
    if (!loadingDone) return

    let lenis
    let tickerFn

    const initLenis = async () => {
      try {
        const LenisModule = await import("lenis")
        const Lenis = LenisModule.default
        lenis = new Lenis({ 
          lerp: 0.1, 
          duration: 1.2,
          smoothWheel: true,
          syncTouch: true
        })
        lenisRef.current = lenis

        tickerFn = (time) => lenis.raf(time * 1000)
        gsap.ticker.add(tickerFn)
        gsap.ticker.lagSmoothing(0)

        lenis.on("scroll", () => {
          ScrollTrigger.update()
        })
      } catch (err) {
        console.error("Lenis init error:", err)
      }
    }
    initLenis()

    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy()
      }
      if (tickerFn) {
        gsap.ticker.remove(tickerFn)
      }
    }
  }, [loadingDone])

  // GSAP ScrollTrigger background color transitions
  useEffect(() => {
    if (!loadingDone) return

    const sections = ["hero", "marquee", "work", "skills", "about", "contact"]
    const triggers = []

    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const color = SECTION_COLORS[id]

      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 60%",
        end: "bottom 40%",
        onEnter: () => {
          gsap.to("body", { backgroundColor: color, duration: 0.8, ease: "power2.inOut" })
          setActiveSection(id)
        },
        onEnterBack: () => {
          gsap.to("body", { backgroundColor: color, duration: 0.8, ease: "power2.inOut" })
          setActiveSection(id)
        },
      })
      triggers.push(st)
    })

    return () => triggers.forEach((t) => t.kill())
  }, [loadingDone])

  const handleLoadingComplete = () => {
    setLoadingDone(true)
    setTimeout(() => setHeroVisible(true), 200)
  }

  return (
    <>
      {/* Loading screen */}
      {!prefersReduced && !loadingDone && (
        <LoadingScreen onComplete={handleLoadingComplete} />
      )}

      {/* Main content */}
      <motion.main
        initial={prefersReduced ? { opacity: 1 } : { y: 40, opacity: 0 }}
        animate={heroVisible ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Navigation activeSection={activeSection} />
        <HeroSection visible={heroVisible} />
        <MarqueeSection />
        <WorkSection />
        <SkillsSection />
        <AboutSection />
        <ContactSection />
      </motion.main>
    </>
  )
}
