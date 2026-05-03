"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from "framer-motion"
import { Menu, X, Github, Linkedin, Instagram, Mail } from "lucide-react"

const NAV_LINKS = ["Work", "About", "Skills", "Contact"]

const MenuFooterLink = ({ title, href, icon: Icon, delay }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="flex items-center gap-2 font-dm-sans text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1814]/50 hover:text-portfolio-accent transition-colors"
  >
    {Icon && <Icon size={12} />}
    {title}
  </motion.a>
)

export default function Navigation({ activeSection }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const prefersReduced = useReducedMotion()
  const { scrollY } = useScroll()
  
  const logoOpacity = useTransform(scrollY, [200, 300], [0, 1])
  const logoY = useTransform(scrollY, [200, 300], [10, 0])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id.toLowerCase())
    if (el) el.scrollIntoView({ behavior: "smooth" })
    setMobileOpen(false)
  }

  const menuVariants = {
    initial: { 
      clipPath: "inset(0% 0% 100% 0%)",
      opacity: 0 
    },
    animate: { 
      clipPath: "inset(0% 0% 0% 0%)",
      opacity: 1,
      transition: { 
        duration: 0.8, 
        ease: [0.76, 0, 0.24, 1] 
      }
    },
    exit: { 
      clipPath: "inset(100% 0% 0% 0%)",
      opacity: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.76, 0, 0.24, 1] 
      }
    }
  }

  return (
    <>
      <nav
        role="navigation"
        className="fixed top-0 left-0 right-0 z-[999] flex items-center justify-between"
        style={{
          padding: scrolled ? "16px 40px" : "32px 40px",
          background: scrolled ? "rgba(250,248,244,0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(24px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(26,24,20,0.05)" : "1px solid transparent",
          transition: "all 600ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <motion.button
          onClick={() => scrollTo("hero")}
          className="font-manrope text-[#1A1814] tracking-tight"
          style={{ fontSize: "20px", fontWeight: 900, background: "none", border: "none", cursor: "pointer", opacity: logoOpacity, y: logoY, letterSpacing: "-0.04em" }}
        >
          VIKRAM
        </motion.button>

        <div className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.toLowerCase()
            return (
              <div key={link} className="relative flex items-center group">
                <button
                  onClick={() => scrollTo(link.toLowerCase())}
                  className="font-manrope transition-all duration-300"
                  style={{ fontSize: "11px", fontWeight: 900, color: isActive ? "#F63D18" : "#1A1814", background: "none", border: "none", cursor: "pointer", letterSpacing: "0.15em", textTransform: "uppercase" }}
                >
                  {link}
                </button>
                <div className={`absolute -bottom-1 left-0 w-0 h-[2px] bg-portfolio-accent transition-all duration-300 group-hover:w-full ${isActive ? 'w-full' : ''}`} />
              </div>
            )
          })}
        </div>

        <button className="md:hidden text-[#1A1814] p-2" onClick={() => setMobileOpen(true)}>
          <div className="flex flex-col gap-1.5 w-6">
            <div className="h-0.5 w-full bg-current" />
            <div className="h-0.5 w-full bg-current" />
          </div>
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[9998] flex flex-col bg-[#FAF8F4] overflow-y-auto"
            variants={menuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {/* Inner Wrapper to handle flex and spacing correctly */}
            <div className="flex flex-col min-h-full p-8 md:p-20">
              {/* Header */}
              <div className="flex justify-between items-center mb-10">
                <span className="font-manrope font-black text-lg tracking-tighter">VIKRAM</span>
                <button className="w-12 h-12 flex items-center justify-center rounded-full bg-black/5" onClick={() => setMobileOpen(false)}>
                  <X size={24} />
                </button>
              </div>

              {/* Primary Links - Using slightly smaller font on small mobile to ensure footer visibility */}
              <div className="flex flex-col gap-2 md:gap-4 my-10">
                {NAV_LINKS.map((link, i) => (
                  <div key={link} className="overflow-hidden">
                    <motion.button
                      onClick={() => scrollTo(link.toLowerCase())}
                      className="font-manrope text-[#1A1814] hover:text-portfolio-accent transition-colors uppercase text-left"
                      style={{ fontSize: "clamp(48px, 12vw, 96px)", fontWeight: 900, background: "none", border: "none", cursor: "pointer", letterSpacing: "-0.04em", lineHeight: 1 }}
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
                    >
                      {link}
                    </motion.button>
                  </div>
                ))}
              </div>

              {/* Mobile Menu Footer - Now using flex-1 push logic */}
              <div className="mt-auto pt-10 border-t border-black/5 flex flex-col gap-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="font-dm-sans text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
                      Contact
                    </motion.p>
                    <motion.a href="mailto:vikram517879@gmail.com" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="block font-manrope text-lg md:text-xl font-bold">
                      vikram517879@gmail.com
                    </motion.a>
                  </div>

                  <div className="space-y-4">
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="font-dm-sans text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
                      Connect
                    </motion.p>
                    <div className="flex flex-wrap gap-x-8 gap-y-4">
                      <MenuFooterLink title="Linkedin" href="https://www.linkedin.com/in/vsvikram18/" icon={Linkedin} delay={1.1} />
                      <MenuFooterLink title="Github" href="https://github.com/vikramvicky-1" icon={Github} delay={1.2} />
                      <MenuFooterLink title="Instagram" href="https://www.instagram.com/__vikram.vicky__" icon={Instagram} delay={1.3} />
                    </div>
                  </div>
                </div>
                
                {/* Copyright info inside menu for completeness */}
                <div className="mt-4 pt-4 border-t border-black/[0.03]">
                  <span className="font-dm-sans text-[9px] font-bold opacity-30 uppercase tracking-widest">© 2025 Vikram Edition</span>
                </div>
              </div>

              {/* Watermark */}
              <div className="absolute bottom-0 right-0 p-10 opacity-[0.02] pointer-events-none select-none">
                <span className="font-manrope font-black text-[40vw] leading-none">V</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
