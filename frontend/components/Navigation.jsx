"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from "framer-motion"
import { Menu, X, Github, Linkedin, Instagram, Mail, ArrowUpRight } from "lucide-react"

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

const HamburgerIcon = ({ isOpen, onClick }) => (
  <button 
    onClick={onClick}
    className="relative z-[9999] w-12 h-12 flex flex-col items-center justify-center gap-[6px] group focus:outline-none"
  >
    <motion.div 
      animate={isOpen ? { rotate: 45, y: 8, width: "24px" } : { rotate: 0, y: 0, width: "32px" }}
      className="h-[2px] bg-[#1A1814] origin-center transition-all duration-500"
    />
    <motion.div 
      animate={isOpen ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
      className="h-[2px] w-[20px] bg-[#1A1814] self-end transition-all duration-500"
    />
    <motion.div 
      animate={isOpen ? { rotate: -45, y: -8, width: "24px" } : { rotate: 0, y: 0, width: "28px" }}
      className="h-[2px] bg-[#1A1814] origin-center transition-all duration-500"
    />
  </button>
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
      x: "100%",
      skewX: "5deg",
    },
    animate: { 
      x: 0,
      skewX: 0,
      transition: { 
        duration: 0.9, 
        ease: [0.16, 1, 0.3, 1] 
      }
    },
    exit: { 
      x: "100%",
      skewX: "-5deg",
      transition: { 
        duration: 0.7, 
        ease: [0.16, 1, 0.3, 1] 
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
          className="font-universo text-[#1A1814] tracking-tight"
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

        <div className="md:hidden">
          <HamburgerIcon isOpen={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)} />
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Dark Backdrop Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/20 z-[9997] backdrop-blur-sm"
            />
            
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-full md:w-[60vw] z-[9998] flex flex-col bg-[#FAF8F4] shadow-2xl"
              variants={menuVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="flex flex-col h-full p-8 md:p-24 relative overflow-hidden">
                {/* Side Label */}
                <div className="absolute top-1/2 -left-20 -translate-y-1/2 rotate-90 hidden md:block">
                  <span className="font-dm-sans text-[10px] font-black uppercase tracking-[0.5em] opacity-10">NAVIGATION MENU</span>
                </div>

                <div className="flex flex-col gap-2 mt-20">
                  <span className="font-dm-sans text-[10px] font-black uppercase tracking-[0.3em] text-[#1A1814]/30 mb-6">Menu Selection</span>
                  
                  {NAV_LINKS.map((link, i) => (
                    <div key={link} className="flex items-center group overflow-hidden">
                      <motion.button
                        onClick={() => scrollTo(link.toLowerCase())}
                        className="flex items-center gap-6 text-[#1A1814] hover:text-portfolio-accent transition-all duration-500 uppercase text-left relative"
                        style={{ 
                          fontSize: "clamp(42px, 10vw, 84px)", 
                          fontWeight: 900, 
                          background: "none", 
                          border: "none", 
                          cursor: "pointer", 
                          letterSpacing: "-0.04em", 
                          lineHeight: 1,
                          fontFamily: "var(--font-universo)"
                        }}
                      >
                        <span className="relative block overflow-hidden">
                          <motion.span
                            className="block"
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            transition={{ 
                              delay: 0.2 + i * 0.1, 
                              duration: 0.8, 
                              ease: [0.16, 1, 0.3, 1] 
                            }}
                          >
                            {link}
                          </motion.span>
                        </span>
                        
                        <motion.div 
                          className="opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0"
                          initial={{ opacity: 0, x: -20, rotate: 0 }}
                          animate={{ opacity: 0.4, x: 0, rotate: 0 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                        >
                          <ArrowUpRight size={window.innerWidth < 768 ? 24 : 40} strokeWidth={4} />
                        </motion.div>
                      </motion.button>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-12 border-t border-black/5 grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <p className="font-dm-sans text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-4">Inquiries</p>
                      <a href="mailto:vikram517879@gmail.com" className="font-manrope text-xl font-bold hover:text-portfolio-accent transition-colors">
                        vikram517879@gmail.com
                      </a>
                    </motion.div>
                  </div>

                  <div className="space-y-6">
                    <p className="font-dm-sans text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-4">Connect</p>
                    <div className="flex flex-col gap-4">
                      <MenuFooterLink title="Linkedin" href="https://www.linkedin.com/in/vsvikram18/" icon={Linkedin} delay={0.8} />
                      <MenuFooterLink title="Github" href="https://github.com/vikramvicky-1" icon={Github} delay={0.9} />
                      <MenuFooterLink title="Instagram" href="https://www.instagram.com/__vikram.vicky__" icon={Instagram} delay={1.0} />
                    </div>
                  </div>
                </div>

                {/* Aesthetic Background Letter */}
                <div className="absolute -bottom-10 -right-10 opacity-[0.03] pointer-events-none select-none">
                  <span className="font-universo font-black text-[60vw] leading-none">V</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
