"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useReducedMotion } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import LoadingScreen from "@/components/LoadingScreen"
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
  hero: "#FFF8F6",
  marquee: "#F8FBFA",
  work: "#FDFBF8",
  skills: "#F8FAFD",
  about: "#FAF9F8",
  contact: "#F9FBFA",
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

  // GSAP ScrollTrigger background color transitions & Content Scrub Animations
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

    // Content Scrub Animations (Slide Up and Reveal)
    const scrubUpElements = document.querySelectorAll('.gsap-scrub-up')
    scrubUpElements.forEach((el) => {
      gsap.fromTo(el, 
        { y: 150, opacity: 0 },
        { 
          y: 0, 
          opacity: 1,
          scrollTrigger: {
            trigger: el,
            start: "top bottom-=5%",
            end: "top center+=20%",
            scrub: 1.2,
          }
        }
      )
    })

    // Parallax Effects
    const parallaxElements = document.querySelectorAll('.gsap-parallax')
    parallaxElements.forEach((el) => {
      const speed = el.dataset.speed || 100
      gsap.to(el, {
        y: -speed,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      })
    })

    return () => {
      triggers.forEach((t) => t.kill())
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [loadingDone])

  const handleLoadingComplete = () => {
    // Force reset scroll to top before revealing hero
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
    
    setLoadingDone(true);
    setTimeout(() => setHeroVisible(true), 200);
  };

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
        <HeroSection visible={heroVisible} activeSection={activeSection} />
        <MarqueeSection />
        <WorkSection />
        <SkillsSection />
        <AboutSection />
        <ContactSection />
      </motion.main>
    </>
  )
}
