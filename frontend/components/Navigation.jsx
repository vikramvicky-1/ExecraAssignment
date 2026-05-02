"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Menu, X } from "lucide-react"

const NAV_LINKS = ["Work", "About", "Skills", "Contact"]

export default function Navigation({ activeSection }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id.toLowerCase())
    if (el) el.scrollIntoView({ behavior: "smooth" })
    setMobileOpen(false)
  }

  return (
    <>
      <nav
        role="navigation"
        aria-label="Main navigation"
        className="fixed top-0 left-0 right-0 z-[999] flex items-center justify-between"
        style={{
          padding: "28px 64px",
          background: scrolled ? "rgba(250,248,244,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(26,24,20,0.06)" : "1px solid transparent",
          transition: "all 400ms ease",
        }}
      >
        <button
          onClick={() => scrollTo("hero")}
          className="font-dm-sans text-[#1A1814] tracking-[0.1em]"
          style={{ fontSize: "14px", fontWeight: 500, background: "none", border: "none", cursor: "pointer" }}
        >
          VIKRAM
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.toLowerCase()
            return (
              <div key={link} className="relative flex items-center">
                <button
                  onClick={() => scrollTo(link.toLowerCase())}
                  className="font-dm-sans transition-colors duration-200"
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: isActive ? "#2D5A3D" : "#6B6560",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    letterSpacing: "0.04em",
                  }}
                >
                  {link}
                </button>
                {isActive && !prefersReduced && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[3px] h-[3px] rounded-full bg-[#2D5A3D]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-[#1A1814] p-1"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <Menu size={22} />
        </button>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[9998] flex flex-col items-center justify-center"
            style={{ background: "#FAF8F4" }}
            initial={prefersReduced ? { opacity: 0 } : { y: "-100%" }}
            animate={prefersReduced ? { opacity: 1 } : { y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { y: "-100%" }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          >
            <button
              className="absolute top-7 right-8 text-[#1A1814]"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <X size={24} />
            </button>
            <div className="flex flex-col items-center gap-10">
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link}
                  onClick={() => scrollTo(link.toLowerCase())}
                  className="font-playfair text-[#1A1814] hover:text-[#2D5A3D] transition-colors"
                  style={{ fontSize: "48px", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}
                  initial={prefersReduced ? { opacity: 0 } : { y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.07, duration: 0.5 }}
                >
                  {link}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
