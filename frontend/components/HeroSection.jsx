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
import { ArrowUpRight } from "lucide-react";
import useContentStore from "@/store/useContentStore";

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
              hover: { y: "-110%" }
            }}
            transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1], delay: i * 0.02 }}
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
              hover: { y: 0 }
            }}
            transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1], delay: i * 0.02 }}
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
      className="group relative mt-6 w-full md:w-auto px-12 py-5 bg-portfolio-accent overflow-hidden flex items-center justify-center gap-4"
    >
      {/* Smooth Black Overlay Slide (Left to Right) */}
      <motion.div
        variants={{
          initial: { x: "-100%" },
          hover: { x: 0 }
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
                hover: { y: "-120%" }
              }}
              transition={{ 
                duration: 0.5, 
                ease: [0.33, 1, 0.68, 1], 
                delay: i * 0.02 
              }}
              className="inline-block font-manrope text-[14px] font-black uppercase tracking-widest text-white whitespace-pre leading-none"
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
                hover: { y: 0 }
              }}
              transition={{ 
                duration: 0.5, 
                ease: [0.33, 1, 0.68, 1], 
                delay: i * 0.02 
              }}
              className="inline-block font-manrope text-[14px] font-black uppercase tracking-widest text-portfolio-accent whitespace-pre leading-none"
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
            hover: { y: "-150%", rotate: 45, color: "#FFFFFF" }
          }}
          transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
          className="absolute"
        >
          <ArrowUpRight size={20} strokeWidth={2.5} />
        </motion.div>
        <motion.div
          variants={{
            initial: { y: "150%", rotate: 0, color: "#F63D18" },
            hover: { y: 0, rotate: 45, color: "#F63D18" }
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
      style={{ perspective: "1000px", rotateX, rotateY, x: translateX, y: translateY }}
      className="cursor-pointer select-none py-10 px-10 -m-10"
    >
      <div className="flex">
        {letters.map((char, i) => (
          <div key={i} className="inline-block overflow-hidden pb-4 -mb-4">
            <motion.span
              initial={{ y: "100%", opacity: 0 }}
              animate={visible ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
              transition={{ 
                duration: 1.2, 
                ease: [0.22, 1, 0.36, 1], 
                delay: i * 0.08 
              }}
              className="font-manrope text-portfolio-accent leading-none tracking-[-0.06em] font-black inline-block"
              style={{ 
                fontSize: isMobile ? "22vw" : "clamp(32px, 16vw, 240px)",
                textShadow: "0 10px 30px rgba(246, 61, 24, 0.1)"
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

export default function HeroSection({ visible, activeSection }) {
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

  const logoScale = useTransform(scrollY, [0, 500], [1, isMobile ? 0.45 : 0.25]);
  const logoY = useTransform(scrollY, [0, 500], [isMobile ? 80 : 50, 0]);
  const contentOpacity = useTransform(scrollY, [150, 450], [1, 0]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const scrollTo = (id) => {
    const el = id === "hero" ? document.getElementById("hero") : document.getElementById(id.toLowerCase());
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  const HamburgerIcon = ({ isOpen }) => (
    <div className="w-8 h-6 flex flex-col justify-between relative cursor-pointer">
      <motion.span animate={isOpen ? { rotate: 45, y: 10, backgroundColor: "#1A1814" } : { rotate: 0, y: 0, backgroundColor: "#1A1814" }} className="w-full h-[3px] block origin-center rounded-full" />
      <motion.span animate={isOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0, backgroundColor: "#1A1814" }} className="w-3/4 h-[3px] block rounded-full ml-auto" />
      <motion.span animate={isOpen ? { rotate: -45, y: -11, backgroundColor: "#1A1814" } : { rotate: 0, y: 0, backgroundColor: "#1A1814" }} className="w-full h-[3px] block origin-center rounded-full" />
    </div>
  );

  const liveStats = content?.hero?.stats || [
    { label: "Projects", value: "20+" },
    { label: "Years", value: "2+" },
    { label: "Users", value: "10K+" },
  ];

  return (
    <section id="hero" className="relative h-screen flex flex-col justify-center overflow-hidden">
      
      {/* Subtle Background Effects */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.4]">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(246,61,24,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(26,24,20,0.01)_1px,transparent_1px)] bg-[size:100%_40px]" />
      </div>

      {/* HEADER */}
      <motion.header className="fixed top-0 left-0 right-0 z-[2000] flex items-center justify-between px-6 md:px-12 h-16 md:h-24 bg-transparent pointer-events-none">
        <motion.div 
          style={{ scale: logoScale, y: logoY, originX: 0, originY: 0.5, width: isMobile ? "calc(100vw - 48px)" : "auto" }} 
          className="pointer-events-auto flex items-center"
        >
          <MagneticLogo onClick={() => scrollTo("hero")} visible={visible} isMobile={isMobile} />
        </motion.div>

        <div className="hidden md:flex gap-6 items-center pointer-events-auto h-full">
          {NAV_LINKS.map((link, i) => (
            <motion.div 
              key={link}
              initial={{ opacity: 0, y: 10 }}
              animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 1, delay: 0.8 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <MagneticLink title={link} onClick={() => scrollTo(link)} isActive={activeSection === link} />
            </motion.div>
          ))}
        </div>

        <div className="md:hidden pointer-events-auto text-[#1A1814] flex items-center h-full pt-2">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 transition-transform active:scale-90 flex items-center justify-center">
            <HamburgerIcon isOpen={mobileOpen} />
          </button>
        </div>
      </motion.header>

      {/* FLUID GRID CONTENT */}
      <div className="relative z-10 px-6 md:px-16 max-w-[1600px] mx-auto w-full mt-32 md:mt-52">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-8 md:gap-y-16 items-end">
          <div className="md:col-start-1 md:col-span-12 lg:col-span-11 gsap-parallax" data-speed="80">
            <motion.div style={{ opacity: contentOpacity }}>
              <h2 className="font-manrope text-[11vw] md:text-[7vw] lg:text-[6.5vw] leading-[0.85] font-black text-[#1A1814] tracking-tighter">
                <AnimatedWord delay={0.4} visible={visible}>Architecting</AnimatedWord>
                <AnimatedWord delay={0.45} visible={visible}>high-performance</AnimatedWord>
                <AnimatedWord delay={0.5} visible={visible}>
                  <span className="italic font-light text-[#6B6560] font-playfair">logic</span>
                </AnimatedWord>
                <br className="hidden md:block" />
                <AnimatedWord delay={0.55} visible={visible}>into</AnimatedWord>
                <AnimatedWord delay={0.6} visible={visible}>digital</AnimatedWord>
                <AnimatedWord delay={0.65} visible={visible}>
                  <span className="text-portfolio-accent">impact</span>.
                </AnimatedWord>
              </h2>
            </motion.div>
          </div>

          <motion.div style={{ opacity: contentOpacity }} className="md:col-start-1 md:col-span-8 lg:col-start-9 lg:col-span-4 mt-6">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 1.2, delay: 1, ease: [0.22, 1, 0.36, 1] }}
              className="font-mosvita text-xl md:text-2xl text-[#1A1814]/70 leading-relaxed font-medium"
            >
              Lead engineer specializing in MERN architectures, real-time ecosystems, and high-performance products.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 1.2, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <ContactButton onClick={() => scrollTo("contact")} />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* STATISTICS */}
      <motion.div style={{ opacity: contentOpacity }} className="absolute bottom-12 left-6 md:left-16 flex flex-wrap gap-8 md:gap-24 max-w-[90vw] z-10">
        {liveStats.map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 30 }}
            animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 1, delay: 1.4 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-0 md:gap-1"
          >
            <span className="font-manrope text-[32px] md:text-[54px] font-black text-[#1A1814] leading-none tracking-tighter">{stat.value}</span>
            <span className="font-mosvita text-[8px] md:text-[12px] uppercase tracking-[0.3em] text-[#1A1814]/40 font-extrabold">{stat.label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ y: "-100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="fixed inset-0 z-[1500] bg-[#FAF8F4] flex flex-col justify-center px-6 md:px-12">
            <div className="flex flex-col gap-4">
              {NAV_LINKS.map((link, i) => (
                <motion.button key={link} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1, duration: 0.8 }} onClick={() => scrollTo(link)} className={`font-manrope text-[18vw] font-black text-left uppercase tracking-tighter hover:text-portfolio-accent transition-colors leading-[0.8] ${activeSection === link ? 'text-portfolio-accent' : 'text-[#1A1814]'}`}>{link}</motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
