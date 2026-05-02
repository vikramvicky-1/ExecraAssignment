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
          className="font-dm-mono text-[#2D5A3D] uppercase mb-4"
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
              className="font-playfair text-[#1A1814]"
              style={{ 
                fontSize: "clamp(48px, 6vw, 84px)", 
                fontWeight: 800, 
                lineHeight: 1.1,
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
      className={`relative rounded-[24px] overflow-hidden border border-black/[0.05] bg-white flex flex-col group ${span}`}
      initial={prefersReduced ? { opacity: 0 } : { y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: (index % 3) * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Banner Section - More Compact */}
      <div 
        className="relative overflow-hidden transition-all duration-700 h-[180px] lg:h-[220px]"
      >
        <div className="w-full h-full transition-transform duration-700 group-hover:scale-105">
          <img 
            src={project.banner?.url} 
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
        </div>
      </div>

      {/* Content Section - Tightened Padding */}
      <div className="p-5 lg:p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <span className="font-dm-mono text-[8px] uppercase tracking-[0.2em] text-[#B8B3AC] font-bold">
            Project 0{index + 1}
          </span>
          <span className="font-dm-mono text-[8px] text-[#B8B3AC] font-bold">
            {project.year}
          </span>
        </div>
        
        <h3 className={`font-playfair font-bold text-[#1A1814] mb-2 leading-tight ${isLarge ? 'text-xl lg:text-3xl' : 'text-lg lg:text-xl'}`}>
          {project.title}
        </h3>
        
        <p className="font-dm-sans text-[#6B6560] text-xs lg:text-sm font-light leading-relaxed mb-5 line-clamp-2">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.techStack?.map((tech, i) => (
            <span key={i} className="text-[10px] lg:text-[11px] font-dm-mono uppercase tracking-[0.15em] px-3 py-1.5 rounded-lg bg-[#F1F1EF] border border-black/[0.04] text-[#4A4642] font-bold shadow-sm">
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-auto pt-3 border-t border-black/[0.03]">
          <a href={project.githubLink || "#"} className="text-[#B8B3AC] hover:text-[#2D5A3D] transition-colors">
            <Github size={16} />
          </a>
          <a href={project.liveLink || "#"} className="text-[#B8B3AC] hover:text-[#2D5A3D] transition-colors">
            <ExternalLink size={16} />
          </a>
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
      className="bg-[#FAF8F4] py-24 px-6 md:px-12 lg:px-16"
    >
      <div className="max-w-[1200px] mx-auto">
        <SectionHeading 
          label="Selected Works — 2023/25" 
          title={["Recent", "Projects."]} 
          subtitle="A selection of recent work spanning full-stack applications, developer tools, and real-time systems."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:auto-flow-dense">
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
          className="mt-16 flex justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <a href="#" className="group flex items-center gap-3 bg-white border border-black/5 px-8 py-4 rounded-full hover:bg-black hover:text-white transition-all shadow-sm">
            <span className="font-dm-sans font-bold text-xs">View all repositories on GitHub</span>
            <div className="w-5 h-5 rounded-full bg-[#2D5A3D] text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowRight size={12} />
            </div>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
