"use client";

import { useEffect, useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import useContentStore from "@/store/useContentStore";
import StudioBackground from "./StudioBackground";

const NAV_LINKS = ["work", "skills", "about", "contact"];

// High-end staggered reveal link component (Vertical Rotation)
const MagneticLink = ({ title, onClick, isActive }) => {
  const letters = (title + ".").split("");

  return (
    <motion.button
      whileHover="hover"
      animate={isActive ? "hover" : "initial"}
      onClick={onClick}
      className="relative overflow-hidden cursor-pointer h-8 flex items-center font-manrope text-[18px] lg:text-[22px] font-black lowercase tracking-tight text-[#1A1814]"
    >
      <div className="flex">
        {letters.map((l, i) => (
          <motion.span
            key={i}
            variants={{
              initial: { y: 0 },
              hover: { y: "-110%" },
            }}
            transition={{
              duration: 0.6,
              ease: [0.33, 1, 0.68, 1],
              delay: i * 0.02,
            }}
            className="inline-block"
          >
            {l}
          </motion.span>
        ))}
      </div>
      <div className="absolute inset-0 flex">
        {letters.map((l, i) => (
          <motion.span
            key={i}
            initial={{ y: "110%" }}
            variants={{
              initial: { y: "110%" },
              hover: { y: 0 },
            }}
            transition={{
              duration: 0.6,
              ease: [0.33, 1, 0.68, 1],
              delay: i * 0.02,
            }}
            className="inline-block text-portfolio-accent"
          >
            {l}
          </motion.span>
        ))}
      </div>
    </motion.button>
  );
};

// Premium Interactive Button with Unified Kinetic Motion (Text & Arrow)
const ContactButton = ({ onClick }) => {
  const letters = "Get in touch".split("");

  return (
    <motion.button
      whileHover="hover"
      initial="initial"
      onClick={onClick}
      className="group relative mt-6 w-full md:w-auto px-12 py-5 bg-portfolio-accent overflow-hidden flex items-center justify-center gap-4 cursor-pointer"
    >
      {/* Smooth Black Overlay Slide (Left to Right) */}
      <motion.div
        variants={{
          initial: { x: "-100%" },
          hover: { x: 0 },
        }}
        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        className="absolute inset-0 bg-[#1A1814]"
      />

      {/* Animated Text Layer - Initial White Text */}
      <div className="relative z-10 flex h-[18px] items-center overflow-hidden">
        <div className="flex">
          {letters.map((l, i) => (
            <motion.span
              key={i}
              variants={{
                initial: { y: 0 },
                hover: { y: "-120%" },
              }}
              transition={{
                duration: 0.5,
                ease: [0.33, 1, 0.68, 1],
                delay: i * 0.02,
              }}
              className="inline-block font-universo text-[14px] font-black uppercase tracking-widest text-white whitespace-pre leading-none"
            >
              {l === " " ? "\u00A0" : l}
            </motion.span>
          ))}
        </div>

        <div className="absolute inset-0 flex items-center">
          {letters.map((l, i) => (
            <motion.span
              key={i}
              variants={{
                initial: { y: "120%" },
                hover: { y: 0 },
              }}
              transition={{
                duration: 0.5,
                ease: [0.33, 1, 0.68, 1],
                delay: i * 0.02,
              }}
              className="inline-block font-universo text-[14px] font-black uppercase tracking-widest text-portfolio-accent whitespace-pre leading-none"
            >
              {l === " " ? "\u00A0" : l}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Kinetic Arrow - Sliding and Rotating Sync */}
      <div className="relative z-10 h-5 w-5 overflow-hidden flex items-center justify-center">
        <motion.div
          variants={{
            initial: { y: 0, rotate: 0, color: "#FFFFFF" },
            hover: { y: "-150%", rotate: 45, color: "#FFFFFF" },
          }}
          transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
          className="absolute"
        >
          <ArrowUpRight size={20} strokeWidth={2.5} />
        </motion.div>
        <motion.div
          variants={{
            initial: { y: "150%", rotate: 0, color: "#F63D18" },
            hover: { y: 0, rotate: 45, color: "#F63D18" },
          }}
          transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
          className="absolute"
        >
          <ArrowUpRight size={20} strokeWidth={2.5} />
        </motion.div>
      </div>
    </motion.button>
  );
};

// 3D Magnetic Logo with Landing Animation (Letter Stagger)
const MagneticLogo = ({ onClick, visible, isMobile }) => {
  const containerRef = useRef(null);
  const letters = "VIKRAM".split("");

  const springConfig = { stiffness: 150, damping: 20, mass: 0.5 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const translateX = useSpring(0, springConfig);
  const translateY = useSpring(0, springConfig);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = (e.clientX - centerX) / (rect.width / 2);
    const distanceY = (e.clientY - centerY) / (rect.height / 2);
    rotateX.set(distanceY * -15);
    rotateY.set(distanceX * 15);
    translateX.set(distanceX * 20);
    translateY.set(distanceY * 20);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    translateX.set(0);
    translateY.set(0);
  };

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        perspective: "1000px",
        rotateX,
        rotateY,
        x: translateX,
        y: translateY,
      }}
      className="cursor-pointer select-none py-10 px-10 -m-10"
    >
      <div className="flex">
        {letters.map((char, i) => (
          <div key={i} className="inline-block overflow-hidden pb-4 -mb-4">
            <motion.span
              initial={{ y: "100%", opacity: 0 }}
              animate={
                visible ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }
              }
              transition={{
                duration: 1.2,
                ease: [0.22, 1, 0.36, 1],
                delay: i * 0.08,
              }}
              className="font-universo text-portfolio-accent leading-none tracking-[-0.06em] font-black inline-block"
              style={{
                fontSize: isMobile ? "16vw" : "clamp(24px, 12vw, 180px)",
                textShadow: "0 10px 30px rgba(246, 61, 24, 0.1)",
              }}
            >
              {char}
            </motion.span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const AnimatedWord = ({ children, delay, visible }) => (
  <span className="inline-block overflow-hidden pb-[0.2em] -mb-[0.2em] mr-[0.2em]">
    <motion.span
      initial={{ y: "100%", opacity: 0 }}
      animate={visible ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay }}
      className="inline-block"
    >
      {children}
    </motion.span>
  </span>
);

const HeroSection = ({ visible, activeSection }) => {
  const prefersReduced = useReducedMotion();
  const { content, fetchContent } = useContentStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const logoScale = useTransform(
    scrollY,
    [0, 500],
    [1, isMobile ? 0.45 : 0.25],
  );
  const logoY = useTransform(scrollY, [0, 500], [isMobile ? 80 : 50, 0]);
  const contentOpacity = useTransform(scrollY, [150, 450], [1, 0]);
  const headerBg = useTransform(
    scrollY,
    [0, 50],
    ["rgba(250, 248, 244, 0)", "rgba(250, 248, 244, 0.8)"],
  );
  const headerBlur = useTransform(
    scrollY,
    [0, 50],
    ["blur(0px)", "blur(20px)"],
  );
  const headerBorder = useTransform(
    scrollY,
    [0, 50],
    ["1px solid rgba(26, 24, 20, 0)", "1px solid rgba(26, 24, 20, 0.05)"],
  );

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const scrollTo = (id) => {
    const el =
      id === "hero"
        ? document.getElementById("hero")
        : document.getElementById(id.toLowerCase());
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  const HamburgerIcon = ({ isOpen }) => (
    <div className="relative w-8 h-8 flex flex-col items-center justify-center gap-[5px] group focus:outline-none">
      <motion.div 
        animate={isOpen ? { rotate: 45, y: 7, width: "24px" } : { rotate: 0, y: 0, width: "32px" }}
        className="h-[2px] bg-[#1A1814] origin-center transition-all duration-500"
      />
      <motion.div 
        animate={isOpen ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
        className="h-[2px] w-[20px] bg-[#1A1814] self-end transition-all duration-500"
      />
      <motion.div 
        animate={isOpen ? { rotate: -45, y: -7, width: "24px" } : { rotate: 0, y: 0, width: "28px" }}
        className="h-[2px] bg-[#1A1814] origin-center transition-all duration-500"
      />
    </div>
  );

  const liveStats = content?.hero?.stats || [
    { label: "Projects", value: "20+" },
    { label: "Years", value: "2+" },
    { label: "Users", value: "10K+" },
  ];

  return (
    <section
      id="hero"
      className="relative h-screen flex flex-col justify-center overflow-hidden bg-[#FAF8F4]"
    >
      <StudioBackground isMobile={isMobile} />

      {/* HEADER */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-[4000] flex items-center justify-between px-6 md:px-12 h-16 md:h-24 pointer-events-none transition-all duration-300"
      >
        <motion.div
          style={{
            scale: logoScale,
            y: logoY,
            originX: 0,
            originY: 0.5,
            width: isMobile ? "calc(100vw - 48px)" : "auto",
          }}
          className="pointer-events-auto flex items-center"
        >
          <MagneticLogo
            onClick={() => scrollTo("hero")}
            visible={visible}
            isMobile={isMobile}
          />
        </motion.div>

        <div className="hidden md:flex gap-6 items-center pointer-events-auto h-12 px-8 bg-[#FAF8F4]/40 backdrop-blur-[8px] rounded-full border border-black/5 shadow-sm">
          {NAV_LINKS.map((link, i) => (
            <motion.div
              key={link}
              initial={{ opacity: 0, y: 10 }}
              animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{
                duration: 1,
                delay: 0.4 + i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <MagneticLink
                title={link}
                onClick={() => scrollTo(link)}
                isActive={activeSection === link}
              />
            </motion.div>
          ))}
        </div>

        <div className="md:hidden pointer-events-auto text-[#1A1814] flex items-center h-full">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-12 h-12 bg-[#FAF8F4]/40 backdrop-blur-[8px] rounded-full border border-black/5 shadow-sm flex items-center justify-center transition-transform active:scale-90"
          >
            <HamburgerIcon isOpen={mobileOpen} />
          </button>
        </div>
      </motion.header>

      {/* FLUID GRID CONTENT */}
      <div className="relative z-10 px-6 md:px-16 max-w-[1600px] mx-auto w-full mt-32 md:mt-52">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-8 md:gap-y-16 items-end">
          <div
            className="md:col-start-1 md:col-span-12 lg:col-span-11 gsap-parallax"
            data-speed="80"
          >
            <motion.div style={{ opacity: contentOpacity }}>
              <h2 className="font-mosvita text-[9vw] md:text-[5.5vw] lg:text-[5vw] leading-[0.95] font-black text-[#1A1814] tracking-tighter">
                <AnimatedWord delay={0.4} visible={visible}>
                  Building
                </AnimatedWord>
                <AnimatedWord delay={0.45} visible={visible}>
                  high-performance
                </AnimatedWord>
                <br />
                <AnimatedWord delay={0.5} visible={visible}>
                  <span className="italic font-light text-[#6B6560] font-playfair">
                    systems
                  </span>
                </AnimatedWord>
                <AnimatedWord delay={0.55} visible={visible}>
                  that
                </AnimatedWord>
                <AnimatedWord delay={0.6} visible={visible}>
                  create
                </AnimatedWord>
                <br />
                <AnimatedWord delay={0.65} visible={visible}>
                  real-world
                </AnimatedWord>
                <AnimatedWord delay={0.7} visible={visible}>
                  <span className="text-portfolio-accent">impact</span>.
                </AnimatedWord>
              </h2>
            </motion.div>
          </div>

          <motion.div
            style={{ opacity: contentOpacity }}
            className="md:col-start-1 md:col-span-8 lg:col-start-9 lg:col-span-4 mt-6"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 1.2, delay: 1, ease: [0.22, 1, 0.36, 1] }}
              className="font-mosvita text-xl md:text-2xl text-[#1A1814]/70 leading-relaxed font-medium"
            >
              Lead engineer specializing in MERN architectures, real-time
              ecosystems, and high-performance products.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{
                duration: 1.2,
                delay: 1.2,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <ContactButton onClick={() => scrollTo("contact")} />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* STATISTICS */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="absolute bottom-12 left-6 md:left-16 flex flex-wrap gap-8 md:gap-24 max-w-[90vw] z-10"
      >
        {liveStats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{
              duration: 1,
              delay: 1.4 + i * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col gap-0 md:gap-1"
          >
            <span className="font-manrope text-[32px] md:text-[54px] font-black text-[#1A1814] leading-none tracking-tighter">
              {stat.value}
            </span>
            <span className="font-mosvita text-[8px] md:text-[12px] uppercase tracking-[0.3em] text-[#1A1814]/40 font-extrabold">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Dark Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/10 z-[2999] backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ x: "100%", skewX: "5deg" }}
              animate={{ x: 0, skewX: 0 }}
              exit={{ x: "100%", skewX: "-5deg" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 right-0 w-full md:w-[60vw] z-[3000] bg-[#FAF8F4] flex flex-col shadow-2xl p-8 md:p-24 overflow-hidden"
            >
              {/* Menu Label */}
              <div className="absolute top-1/2 -left-20 -translate-y-1/2 rotate-90 hidden lg:block pointer-events-none">
                <span className="font-dm-sans text-[10px] font-black uppercase tracking-[0.5em] opacity-10">NAVIGATION MENU</span>
              </div>

              <div className="flex flex-col gap-6 mt-32">
                <span className="font-dm-sans text-[10px] font-black uppercase tracking-[0.3em] text-[#1A1814]/30 mb-4">Selection</span>
                
                {NAV_LINKS.map((link, i) => {
                  const isActive = activeSection === link.toLowerCase();
                  return (
                    <div key={link} className="flex items-center group overflow-hidden">
                      <motion.button
                        onClick={() => scrollTo(link)}
                        className={`flex items-center gap-6 transition-all duration-500 uppercase text-left relative ${isActive ? 'text-portfolio-accent' : 'text-[#1A1814]'}`}
                        style={{ 
                          fontSize: "clamp(48px, 12vw, 96px)", 
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
                            initial={{ y: "110%" }}
                            animate={{ y: 0 }}
                            transition={{ 
                              delay: 0.3 + i * 0.1, 
                              duration: 0.8, 
                              ease: [0.16, 1, 0.3, 1] 
                            }}
                          >
                            {link}
                          </motion.span>
                        </span>
                        
                        <motion.div 
                          className="transition-all duration-500"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ 
                            opacity: isActive ? 1 : 0.2, 
                            x: 0 
                          }}
                          transition={{ delay: 0.6 + i * 0.1 }}
                        >
                          <ArrowUpRight size={isMobile ? 32 : 48} strokeWidth={4} />
                        </motion.div>
                      </motion.button>
                    </div>
                  );
                })}
              </div>

              <div className="mt-auto pt-12 border-t border-black/5 grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <p className="font-dm-sans text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Inquiries</p>
                  <a href="mailto:vikram517879@gmail.com" className="font-manrope text-xl font-bold hover:text-portfolio-accent transition-colors block">
                    vikram517879@gmail.com
                  </a>
                </div>
                <div className="space-y-6">
                  <p className="font-dm-sans text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Connect</p>
                  <div className="flex gap-8">
                    {["LinkedIn", "GitHub", "Instagram"].map((social, i) => (
                      <motion.a 
                        key={social}
                        href="#"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                        className="font-dm-sans text-[10px] font-black uppercase tracking-widest opacity-50 hover:opacity-100 hover:text-portfolio-accent transition-all"
                      >
                        {social}
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Background Accent */}
              <div className="absolute -bottom-10 -right-10 opacity-[0.03] pointer-events-none select-none">
                <span className="font-universo font-black text-[60vw] leading-none">V</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
export default HeroSection;
