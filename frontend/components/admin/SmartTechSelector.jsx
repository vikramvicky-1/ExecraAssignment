"use client"

import { useState, useEffect, useMemo } from "react"
import { Command } from "cmdk"
import { Search, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import techList from "@/constants/tech-list.json"

const getLogoUrl = (nameOrSlug) => {
  // Try to find slug in our tech list first
  const tech = techList.find(t => t.name.toLowerCase() === nameOrSlug.toLowerCase() || t.slug === nameOrSlug.toLowerCase())
  const slug = tech ? tech.slug : nameOrSlug.toLowerCase().replace(/\s+/g, '').replace(/\.js/g, 'js')
  return `https://cdn.simpleicons.org/${slug}`
}

export default function SmartTechSelector({ value, onChange, onSelect }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState(value || "")

  // Enhanced search: prioritize exact starts, then inclusions
  const filteredTech = useMemo(() => {
    if (!search) return []
    const lowerSearch = search.toLowerCase()
    return techList
      .filter(tech => 
        tech.name.toLowerCase().includes(lowerSearch) || 
        tech.slug.includes(lowerSearch)
      )
      .sort((a, b) => {
        const aStart = a.name.toLowerCase().startsWith(lowerSearch)
        const bStart = b.name.toLowerCase().startsWith(lowerSearch)
        if (aStart && !bStart) return -1
        if (!aStart && bStart) return 1
        return a.name.length - b.name.length
      })
      .slice(0, 50) // Limit to 50 results for performance
  }, [search])

  return (
    <div className="relative w-full">
      <div className="relative">
        <input 
          type="text"
          placeholder="Search 3,400+ tech (e.g. React, Docker, AWS...)"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            onChange(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          className="w-full bg-[#FAF8F4] border border-black/[0.05] rounded-2xl px-6 py-4 font-dm-sans text-sm focus:ring-2 focus:ring-[#2D5A3D]/20 outline-none transition-all pr-12"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {search && (
            <div className="w-6 h-6 flex items-center justify-center">
              <img 
                src={getLogoUrl(search)} 
                alt="" 
                className="w-full h-full object-contain"
                onError={(e) => e.target.style.display = 'none'}
                onLoad={(e) => e.target.style.display = 'block'}
              />
            </div>
          )}
          <Search size={18} className="text-[#B8B3AC]" />
        </div>
      </div>

      <AnimatePresence>
        {open && search && (
          <>
            <div 
              className="fixed inset-0 z-[190]" 
              onClick={() => setOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-black/[0.05] rounded-3xl shadow-2xl z-[200] overflow-hidden"
            >
              <Command className="p-2">
                <Command.List className="max-h-[300px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
                  {filteredTech.length === 0 ? (
                    <div className="p-4 text-center">
                      <p className="font-dm-sans text-xs text-[#B8B3AC]">No match found. Using "{search}"</p>
                    </div>
                  ) : (
                    filteredTech.map((tech) => (
                      <Command.Item
                        key={tech.slug}
                        onSelect={() => {
                          setSearch(tech.name)
                          onSelect(tech.name)
                          setOpen(false)
                        }}
                        className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-[#FAF8F4] transition-colors aria-selected:bg-[#FAF8F4]"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#FAF8F4] flex items-center justify-center p-1.5 border border-black/[0.03]">
                          <img 
                            src={`https://cdn.simpleicons.org/${tech.slug}`} 
                            alt={tech.name} 
                            className="w-full h-full object-contain" 
                            loading="lazy"
                          />
                        </div>
                        <span className="font-dm-sans text-sm font-medium text-[#1A1814]">{tech.name}</span>
                        <span className="font-dm-mono text-[9px] text-[#B8B3AC] ml-auto uppercase tracking-tighter">{tech.slug}</span>
                      </Command.Item>
                    ))
                  )}
                </Command.List>
              </Command>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
