"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { motion, useReducedMotion, AnimatePresence } from "framer-motion"
import { Github, ExternalLink, ArrowRight, GithubIcon } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import useProjectStore from "@/store/useProjectStore"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * Custom Cursor Component
 */
function ProjectCursor({ active, text = "VIEW" }) {
  const cursorRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.6,
          ease: "power3.out"
        })
      }
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center rounded-full transition-all duration-500 ease-out mix-blend-difference ${
        active ? "opacity-100 scale-100" : "opacity-0 scale-0"
      }`}
      style={{
        width: "100px",
        height: "100px",
        backgroundColor: "white",
        marginLeft: "-50px",
        marginTop: "-50px"
      }}
    >
      <span className="font-dm-mono text-[11px] font-black tracking-tighter text-black uppercase">
        {text}
      </span>
    </div>
  )
}

function SectionHeading({ label, title, subtitle }) {
  const titleArray = Array.isArray(title) ? title : [title]

  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-32 gap-12 px-4 lg:px-12">
      <div className="max-w-3xl">
        <motion.p
          className="font-dm-mono text-portfolio-accent uppercase mb-6"
          style={{ fontSize: "12px", letterSpacing: "0.3em", fontWeight: 800 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {label}
        </motion.p>
        <div className="flex flex-col overflow-hidden">
          {titleArray.map((line, i) => (
            <motion.h2
              key={i}
              className="font-universo text-ink uppercase leading-[0.85] tracking-[-0.05em]"
              style={{ 
                fontSize: "clamp(60px, 8vw, 100px)", 
                fontWeight: 900,
              }}
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + (i * 0.1), duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              {line}
            </motion.h2>
          ))}
        </div>
      </div>
      <motion.p 
        className="font-dm-sans text-ink-mid max-w-xs text-base font-light leading-relaxed lg:mb-4 border-l border-ink/10 pl-6"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 1 }}
      >
        {subtitle}
      </motion.p>
    </div>
  )
}

function ProjectCard({ project, index, span, onHover }) {
  const cardRef = useRef(null)
  const imageRef = useRef(null)
  const innerRef = useRef(null)
  const isLarge = span.includes("lg:col-span-2")
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024)
    checkDesktop()
    window.addEventListener("resize", checkDesktop)
    
    if (!cardRef.current || !imageRef.current) return
    const card = cardRef.current
    const image = imageRef.current

    // Single Timeline for Entry, Static phase, and Exit
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: "top 95%",
        end: "bottom 5%",
        scrub: 2,
      }
    })

    tl.fromTo(card, 
      { 
        scale: 0.85, 
        opacity: 0,
        y: 80,
        filter: "blur(10px)",
        rotateX: -10
      }, 
      {
        scale: 1,
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        rotateX: 0,
        duration: 1,
        ease: "none"
      }
    )
    .to(card, {
      opacity: 1, // Stay visible
      y: -20, // Gentle upward move while visible
      duration: 2, // Long duration for the middle section
      ease: "none"
    })
    .to(card, {
      opacity: 0,
      scale: 0.85,
      y: -100,
      filter: "blur(10px)",
      rotateX: 10,
      duration: 1,
      ease: "none"
    })

    return () => window.removeEventListener("resize", checkDesktop)
  }, [index])

  const handleMouseMove = (e) => {
    if (!innerRef.current || !isDesktop) return
    const { clientX, clientY } = e
    const { left, top, width, height } = innerRef.current.getBoundingClientRect()
    const x = (clientX - left) / width - 0.5
    const y = (clientY - top) / height - 0.5
    
    gsap.to(innerRef.current, {
      rotateX: -y * 8,
      rotateY: x * 8,
      duration: 0.5,
      ease: "power2.out"
    })
  }

  const handleMouseEnter = () => {
    if (isDesktop) onHover(true)
  }

  const handleMouseLeave = () => {
    if (isDesktop) onHover(false)
    if (!innerRef.current) return
    gsap.to(innerRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: "power2.out"
    })
  }

  return (
    <div
      ref={cardRef}
      className={`relative perspective-2000 ${span}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        ref={innerRef}
        className="group relative flex flex-col bg-white overflow-hidden border border-black/5 h-full transform-gpu transition-shadow duration-500 lg:hover:shadow-2xl lg:hover:shadow-black/10"
      >
        {/* Image Container */}
        <div className={`relative overflow-hidden ${isLarge ? 'aspect-video' : 'aspect-[4/3] lg:aspect-[4/5]'}`}>
          <div ref={imageRef} className="absolute inset-0 w-full h-full scale-125">
            <img 
              src={project.banner?.url} 
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-1000 ease-out lg:group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/5 lg:group-hover:bg-transparent transition-colors duration-700" />
          </div>

          {/* Year Tag */}
          <div className="absolute top-4 left-4 lg:top-6 lg:left-6 z-10 opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500">
            <div className="bg-white/90 backdrop-blur-md px-3 py-1 lg:px-4 lg:py-1.5 rounded-full border border-black/5">
              <span className="font-dm-mono text-[9px] lg:text-[10px] text-ink font-bold uppercase">{project.year}</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 lg:p-10 flex flex-col flex-1 bg-white relative z-20">
          <div className="flex items-center gap-3 mb-4 lg:mb-6">
            <span className="font-dm-mono text-[10px] lg:text-[11px] uppercase tracking-[0.2em] text-ink-light font-bold">
              0{index + 1}
            </span>
            <div className="h-px flex-1 bg-ink/5" />
          </div>
          
          <h3 className={`font-mosvita font-bold text-ink mb-4 lg:mb-6 leading-tight tracking-tight lg:group-hover:text-portfolio-accent transition-colors duration-500 ${isLarge ? 'text-xl lg:text-4xl' : 'text-base lg:text-xl'}`}>
            {project.title}
          </h3>
          
          <p className="font-dm-sans text-ink-mid text-xs lg:text-sm font-light leading-relaxed mb-6 lg:mb-10 line-clamp-2 max-w-xl">
            {project.description}
          </p>

          <div className="flex items-center justify-between mt-auto">
            <div className="flex gap-4 lg:gap-6">
              <a 
                href={project.githubLink || "#"} 
                target="_blank" 
                className="text-ink hover:text-portfolio-accent transition-all lg:hover:scale-110"
                title="View Source"
              >
                <Github size={isDesktop ? 22 : 18} strokeWidth={1.5} />
              </a>
              <a 
                href={project.liveLink || "#"} 
                target="_blank" 
                className="text-ink hover:text-portfolio-accent transition-all lg:hover:scale-110"
                title="Live Preview"
              >
                <ExternalLink size={isDesktop ? 22 : 18} strokeWidth={1.5} />
              </a>
            </div>
            <div className="flex flex-wrap gap-2 lg:gap-3 justify-end">
              {project.techStack?.map((tech, i) => (
                <span key={i} className="text-[8px] lg:text-[9px] font-dm-mono uppercase tracking-[0.1em] text-ink-mid font-medium bg-black/[0.03] px-2 py-1 rounded">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-1 bg-portfolio-accent scale-x-0 lg:group-hover:scale-x-100 transition-transform duration-700 origin-left" />
      </motion.div>
    </div>
  )
}

export default function WorkSection() {
  const { projects, fetchProjects } = useProjectStore()
  const [cursorActive, setCursorActive] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  // 3-Column layout
  const projectSpans = useMemo(() => {
    return projects.map((_, i) => {
      if (i === 0) return "col-span-12 lg:col-span-2"
      return "col-span-12 lg:col-span-1"
    })
  }, [projects])

  return (
    <section id="work" className="py-24 md:py-40 lg:py-56 px-4 md:px-8 lg:px-24 bg-[#FAF8F4] overflow-hidden">
      <ProjectCursor active={cursorActive} />
      
      <div className="max-w-[1500px] mx-auto">
        <SectionHeading 
          label="LATEST OUTPUT — 2024/25" 
          title={["Curated", "Creations."]} 
          subtitle="A spatial exploration of high-performance architecture where elements emerge and dissolve in a 3D landscape."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-20 auto-rows-fr px-2 md:px-6 lg:px-12">
          {projects.map((project, i) => (
            <ProjectCard 
              key={project._id} 
              project={project} 
              index={i} 
              span={projectSpans[i]} 
              onHover={setCursorActive}
            />
          ))}
        </div>

        <motion.div 
          className="mt-56 flex flex-col items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <a 
            href="https://github.com/vikramvicky-1" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group relative flex items-center gap-6 bg-ink text-white px-10 py-6 rounded-full overflow-hidden hover:pr-14 transition-all duration-500 shadow-xl"
          >
            <div className="absolute inset-0 bg-portfolio-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            
            <GithubIcon size={24} className="relative z-10" />
            <span className="relative z-10 font-dm-mono font-black text-xs tracking-[0.2em] uppercase">
              SEE ALL ON GITHUB
            </span>
            <ArrowRight size={20} className="absolute right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-0 -translate-x-4 z-10" />
          </a>
          
          <div className="mt-12 flex items-center gap-4 opacity-30">
            <div className="h-px w-8 bg-ink" />
            <span className="font-dm-mono text-[10px] uppercase tracking-widest font-bold text-ink">Scroll to explore</span>
            <div className="h-px w-8 bg-ink" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}




