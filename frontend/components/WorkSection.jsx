"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Github, ExternalLink, ArrowRight } from "lucide-react"
import useProjectStore from "@/store/useProjectStore"

function SectionHeading({ label, title, subtitle }) {
  const prefersReduced = useReducedMotion()
  const titleArray = Array.isArray(title) ? title : [title]

  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
      <div className="max-w-2xl">
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
            <motion.h2
              key={i}
              className="font-manrope text-[#1A1814] uppercase"
              style={{ 
                fontSize: "clamp(48px, 6vw, 84px)", 
                fontWeight: 900, 
                lineHeight: 0.9,
                letterSpacing: "-0.04em",
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
      <motion.p 
        className="font-dm-sans text-[#6B6560] max-w-sm text-base font-light leading-relaxed lg:mb-3"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        {subtitle}
      </motion.p>
    </div>
  )
}

function ProjectCard({ project, index, span }) {
  const prefersReduced = useReducedMotion()
  const isLarge = span.includes("col-span-8")

  return (
    <motion.div
      className={`relative rounded-[24px] overflow-hidden border border-black/[0.05] bg-white flex flex-col group gsap-scrub-up ${span}`}
      initial={prefersReduced ? { opacity: 0 } : { y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: (index % 3) * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Banner Section with Precision Zoom */}
      <div 
        className="relative overflow-hidden transition-all duration-700 h-[220px] lg:h-[280px]"
      >
        <motion.div className="w-full h-full" whileHover={{ scale: 1.05 }} transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}>
          <img 
            src={project.banner?.url} 
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
        </motion.div>
        
        {/* Floating Year Tag */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-black/5">
          <span className="font-dm-mono text-[10px] text-[#1A1814] font-black">{project.year}</span>
        </div>
      </div>

      {/* Content Section - Refined Typography */}
      <div className="p-6 lg:p-8 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-portfolio-accent" />
          <span className="font-dm-mono text-[10px] uppercase tracking-[0.2em] text-[#B8B3AC] font-bold">
            Case Study 0{index + 1}
          </span>
        </div>
        
        <h3 className={`font-mosvita font-bold text-[#1A1814] mb-4 leading-tight tracking-tight ${isLarge ? 'text-2xl lg:text-4xl' : 'text-xl lg:text-2xl'}`}>
          {project.title}
        </h3>
        
        <p className="font-dm-sans text-[#6B6560] text-sm lg:text-base font-light leading-relaxed mb-6 line-clamp-3">
          {project.description}
        </p>

        {/* Tech Stack - Elevated Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {project.techStack?.map((tech, i) => (
            <span key={i} className="text-[10px] font-dm-mono uppercase tracking-[0.1em] px-3 py-1.5 rounded-md bg-black/[0.03] border border-black/[0.04] text-[#4A4642] font-semibold">
              {tech}
            </span>
          ))}
        </div>

        {/* Interaction Bar */}
        <div className="flex items-center justify-between mt-auto pt-6 border-t border-black/[0.03]">
          <div className="flex items-center gap-5">
            <motion.a 
              href={project.githubLink || "#"} 
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1A1814] hover:text-portfolio-accent transition-colors flex items-center gap-2 font-dm-sans font-bold text-xs"
              whileHover={{ y: -2 }}
            >
              <Github size={18} />
              <span>Source</span>
            </motion.a>
            <motion.a 
              href={project.liveLink || "#"} 
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1A1814] hover:text-portfolio-accent transition-colors flex items-center gap-2 font-dm-sans font-bold text-xs"
              whileHover={{ y: -2 }}
            >
              <ExternalLink size={18} />
              <span>Preview</span>
            </motion.a>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function WorkSection() {
  const { projects, fetchProjects } = useProjectStore()

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const projectSpans = useMemo(() => {
    return projects.map((project, i) => {
      let span = "col-span-12 "
      if (project.featured) {
        span += "lg:col-span-8"
      } else {
        span += "lg:col-span-4"
      }
      return span
    })
  }, [projects])

  return (
    <section
      id="work"
      className="py-32 px-6 md:px-12 lg:px-16"
    >
      <div className="max-w-[1200px] mx-auto">
        <SectionHeading 
          label="LATEST OUTPUT — 24/25" 
          title={["Curated", "Productions."]} 
          subtitle="A selection of recent work spanning full-stack applications, developer tools, and real-time systems."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:auto-flow-dense">
          {projects.map((project, i) => (
            <ProjectCard 
              key={project._id} 
              project={project} 
              index={i} 
              span={projectSpans[i]} 
            />
          ))}
        </div>

        <motion.div 
          className="mt-20 flex justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <a 
            href="https://github.com/vikramvicky-1" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group flex items-center gap-3 bg-white border border-black/5 px-10 py-5 rounded-full hover:bg-black hover:text-white transition-all shadow-sm"
          >
            <span className="font-dm-sans font-bold text-sm tracking-tight uppercase">EXPLORE MORE ON GITHUB</span>
            <div className="w-6 h-6 rounded-full bg-portfolio-accent text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowRight size={14} />
            </div>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
