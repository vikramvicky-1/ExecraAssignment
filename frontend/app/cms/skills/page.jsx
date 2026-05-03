"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import CMSLayout from "@/components/admin/CMSLayout"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Save, 
  ChevronRight, 
  Sparkles,
  Zap,
  Globe,
  Settings,
  X,
  RotateCcw,
  AlertCircle,
  Loader2
} from "lucide-react"
import useContentStore from "@/store/useContentStore"
import { toast } from "react-hot-toast"
import ConfirmationDialog from "@/components/admin/ConfirmationDialog"
import SmartTechSelector from "@/components/admin/SmartTechSelector"
import techList from "@/constants/tech-list.json"

// Custom debounce function
function debounce(fn, delay) {
  let timeoutId
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

const getLogoUrl = (nameOrSlug) => {
  const tech = techList.find(t => t.name.toLowerCase() === nameOrSlug.toLowerCase() || t.slug === nameOrSlug.toLowerCase())
  const slug = tech ? tech.slug : nameOrSlug.toLowerCase().replace(/\s+/g, '').replace(/\.js/g, 'js')
  return `https://cdn.simpleicons.org/${slug}`
}

export default function SkillsCMS() {
  const { content, fetchContent, updateContent, isUpdating } = useContentStore()
  const [formData, setFormData] = useState({
    major: [],
    minor: [],
    exploring: []
  })

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newSkill, setNewSkill] = useState({ name: "", pct: 80 })
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, onConfirm: null, title: "", desc: "" })

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  useEffect(() => {
    if (content?.skills) {
      setFormData({
        major: content.skills.major || [],
        minor: content.skills.minor || [],
        exploring: content.skills.exploring || []
      })
    }
  }, [content])

  // Auto-save logic (debounced for inputs)
  const debouncedUpdate = useCallback(
    debounce(async (data) => {
      try {
        await updateContent({ skills: data })
      } catch (error) {
        toast.error("Sync failed")
      }
    }, 1000),
    [updateContent]
  )

  // Instant save (for add/remove actions)
  const instantUpdate = async (data) => {
    try {
      setFormData(data)
      await updateContent({ skills: data })
    } catch (error) {
      toast.error("Update failed")
    }
  }

  const handleInputChange = (newData) => {
    setFormData(newData)
    debouncedUpdate(newData)
  }

  // Seed existing data (cleanup)
  const seedExistingData = async () => {
    const cleanedMajor = formData.major.map(skill => ({
      name: skill.name,
      pct: skill.pct
    }))
    const newData = { ...formData, major: cleanedMajor }
    await instantUpdate(newData)
    toast.success("Arsenal data sanitized successfully")
  }

  // Major Skills Handlers
  const addMajorSkill = () => {
    if (!newSkill.name.trim()) {
      toast.error("Skill name is required")
      return
    }
    const newData = {
      ...formData,
      major: [...formData.major, { name: newSkill.name, pct: newSkill.pct }]
    }
    instantUpdate(newData)
    setNewSkill({ name: "", pct: 80 })
    setIsModalOpen(false)
    toast.success("Skill added and synced")
  }

  const removeMajorSkill = (index) => {
    setConfirmConfig({
      isOpen: true,
      title: "Remove Major Skill?",
      desc: `This will remove "${formData.major[index].name}" from your core skills and orbit display.`,
      onConfirm: () => {
        const newData = {
          ...formData,
          major: formData.major.filter((_, i) => i !== index)
        }
        instantUpdate(newData)
        setConfirmConfig(prev => ({ ...prev, isOpen: false }))
      }
    })
  }

  const updateMajorSkill = (index, field, value) => {
    const newMajor = [...formData.major]
    newMajor[index] = { ...newMajor[index], [field]: value }
    const newData = { ...formData, major: newMajor }
    handleInputChange(newData)
  }

  // Minor Skills Handlers
  const [minorInput, setMinorInput] = useState("")
  const addMinorSkill = (e) => {
    if (e.key === 'Enter' && minorInput.trim()) {
      e.preventDefault()
      if (!formData.minor.includes(minorInput.trim())) {
        const newData = { ...formData, minor: [...formData.minor, minorInput.trim()] }
        instantUpdate(newData)
      }
      setMinorInput("")
    }
  }
  const removeMinorSkill = (skill) => {
    setConfirmConfig({
      isOpen: true,
      title: "Delete Supporting Skill?",
      desc: `Remove "${skill}" from your supporting skills cloud?`,
      onConfirm: () => {
        const newData = { ...formData, minor: formData.minor.filter(s => s !== skill) }
        instantUpdate(newData)
        setConfirmConfig(prev => ({ ...prev, isOpen: false }))
      }
    })
  }

  // Exploring Handlers
  const [exploringInput, setExploringInput] = useState("")
  const addExploring = (e) => {
    if (e.key === 'Enter' && exploringInput.trim()) {
      e.preventDefault()
      if (!formData.exploring.includes(exploringInput.trim())) {
        const newData = { ...formData, exploring: [...formData.exploring, exploringInput.trim()] }
        instantUpdate(newData)
      }
      setExploringInput("")
    }
  }
  const removeExploring = (item) => {
    setConfirmConfig({
      isOpen: true,
      title: "Remove Exploration?",
      desc: `Delete "${item}" from your currently exploring list?`,
      onConfirm: () => {
        const newData = { ...formData, exploring: formData.exploring.filter(i => i !== item) }
        instantUpdate(newData)
        setConfirmConfig(prev => ({ ...prev, isOpen: false }))
      }
    })
  }

  return (
    <CMSLayout 
      title="The Arsenal" 
      subtitle="Manage your technical stack. All changes are saved and updated instantly."
    >
      {/* Real-time Status Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 bg-white p-6 rounded-[32px] border border-black/[0.05] shadow-sm">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isUpdating ? 'bg-orange-400 animate-pulse' : 'bg-portfolio-accent'}`} />
          <div>
            <p className="font-dm-mono text-[10px] uppercase tracking-widest text-[#1A1814] font-bold">
              {isUpdating ? "Syncing to Live Site..." : "Real-time Cloud Sync Active"}
            </p>
            <p className="font-dm-sans text-xs text-[#B8B3AC]">
              {isUpdating ? "Applying your latest modifications..." : "Every change you make is instantly deployed."}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={seedExistingData}
            className="flex items-center gap-2 px-4 py-2 bg-[#FAF8F4] rounded-full border border-black/[0.03] font-dm-mono text-[9px] uppercase tracking-widest text-[#6B6560] hover:bg-[#1A1814] hover:text-white transition-all"
          >
            <RotateCcw size={14} />
            Sanitize Data
          </button>
          <AnimatePresence>
            {isUpdating && (
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-2 px-4 py-2 bg-[#FAF8F4] rounded-full border border-black/[0.03]"
              >
                <Loader2 size={14} className="animate-spin text-portfolio-accent" />
                <span className="font-dm-mono text-[9px] uppercase tracking-widest text-[#6B6560]">Saving</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Major Skills */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-black/[0.05] rounded-[32px] p-8 shadow-sm overflow-hidden relative">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-playfair text-xl font-bold text-[#1A1814]">Major Skills</h3>
                <p className="font-dm-sans text-sm text-[#6B6560] font-light">Shown in the orbit and proficiency bars.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-[#FAF8F4] text-portfolio-accent px-4 py-2 rounded-full font-dm-mono text-[10px] uppercase tracking-widest font-bold hover:bg-portfolio-accent hover:text-white transition-all shadow-sm group"
              >
                <Plus size={14} />
                <span>Add Skill</span>
              </button>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {formData.major.map((skill, index) => (
                  <motion.div
                    key={`${skill.name}-${index}`}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-2xl border border-black/[0.03] bg-[#FAF8F4]/50 hover:bg-white hover:border-portfolio-accent/20 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="text-[#B8B3AC] cursor-grab active:cursor-grabbing">
                        <GripVertical size={16} />
                      </div>
                      <div 
                        className="w-14 h-14 rounded-full bg-white flex items-center justify-center p-3 shadow-sm border border-black/[0.05] shrink-0"
                      >
                        <img 
                          src={getLogoUrl(skill.name)} 
                          alt={skill.name} 
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${skill.name}&background=random`
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                      <div className="col-span-2">
                        <label className="block font-dm-mono text-[9px] uppercase tracking-tighter text-[#B8B3AC] mb-1">Skill Name</label>
                        <input 
                          type="text"
                          value={skill.name}
                          onChange={(e) => updateMajorSkill(index, 'name', e.target.value)}
                          placeholder="e.g. React"
                          className="w-full bg-transparent border-none p-0 font-dm-sans text-sm font-semibold text-[#1A1814] focus:ring-0 placeholder:text-[#B8B3AC]"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block font-dm-mono text-[9px] uppercase tracking-tighter text-[#B8B3AC] mb-1">Pct (%)</label>
                        <div className="flex items-center gap-3">
                          <input 
                            type="number"
                            min="0"
                            max="100"
                            value={skill.pct}
                            onChange={(e) => updateMajorSkill(index, 'pct', parseInt(e.target.value) || 0)}
                            className="w-12 bg-transparent border-none p-0 font-dm-mono text-sm font-bold text-portfolio-accent focus:ring-0"
                          />
                          <input 
                            type="range"
                            min="0"
                            max="100"
                            value={skill.pct}
                            onChange={(e) => updateMajorSkill(index, 'pct', parseInt(e.target.value) || 0)}
                            className="flex-1 h-1 bg-portfolio-accent/10 rounded-full appearance-none cursor-pointer accent-[#2D5A3D]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button 
                        onClick={() => removeMajorSkill(index)}
                        className="p-2 text-[#B8B3AC] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {formData.major.length === 0 && (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-3xl bg-[#FAF8F4] flex items-center justify-center text-[#B8B3AC] mb-4">
                    <Globe size={24} />
                  </div>
                  <p className="font-dm-sans text-sm text-[#B8B3AC]">No major skills added yet.</p>
                  <button onClick={() => setIsModalOpen(true)} className="mt-4 text-portfolio-accent font-dm-mono text-xs uppercase tracking-widest font-bold">Add One Now</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Minor Skills & Exploring */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Minor Skills */}
          <div className="bg-white border border-black/[0.05] rounded-[32px] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles size={18} className="text-portfolio-accent" />
              <h3 className="font-playfair text-xl font-bold text-[#1A1814]">Supporting Skills</h3>
            </div>
            <p className="font-dm-sans text-sm text-[#6B6560] font-light mb-6">Displayed as a dynamic pill cloud.</p>
            
            <div className="mb-6">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Type skill and press Enter..."
                  value={minorInput}
                  onChange={(e) => setMinorInput(e.target.value)}
                  onKeyDown={addMinorSkill}
                  className="w-full bg-[#FAF8F4] border border-black/[0.03] rounded-2xl px-5 py-4 font-dm-sans text-sm focus:ring-2 focus:ring-[#2D5A3D]/20 outline-none transition-all placeholder:text-[#B8B3AC]"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B8B3AC]">
                  <Plus size={18} />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {formData.minor.map((skill) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FAF8F4] border border-black/[0.03] font-dm-mono text-[10px] text-[#6B6560] hover:border-portfolio-accent/30 hover:text-portfolio-accent transition-all group cursor-default"
                  >
                    {skill}
                    <button 
                      onClick={() => removeMinorSkill(skill)}
                      className="text-[#B8B3AC] hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Currently Exploring */}
          <div className="bg-white border border-black/[0.05] rounded-[32px] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Globe size={18} className="text-portfolio-accent" />
              <h3 className="font-playfair text-xl font-bold text-[#1A1814]">Currently Exploring</h3>
            </div>
            <p className="font-dm-sans text-sm text-[#6B6560] font-light mb-6">Animated marquee items.</p>

            <div className="mb-6">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Type new exploration and press Enter..."
                  value={exploringInput}
                  onChange={(e) => setExploringInput(e.target.value)}
                  onKeyDown={addExploring}
                  className="w-full bg-[#FAF8F4] border border-black/[0.03] rounded-2xl px-5 py-4 font-dm-sans text-sm focus:ring-2 focus:ring-[#2D5A3D]/20 outline-none transition-all placeholder:text-[#B8B3AC]"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B8B3AC]">
                  <Plus size={18} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <AnimatePresence>
                {formData.exploring.map((item) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-[#FAF8F4] border border-black/[0.03] group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-portfolio-accent" />
                      <span className="font-dm-sans text-sm text-[#1A1814]">{item}</span>
                    </div>
                    <button 
                      onClick={() => removeExploring(item)}
                      className="text-[#B8B3AC] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {formData.exploring.length === 0 && (
                <div className="py-8 text-center border-2 border-dashed border-black/[0.03] rounded-2xl">
                  <p className="font-dm-mono text-[10px] text-[#B8B3AC] uppercase tracking-widest">No exploration points</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Add Skill Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#1A1814]/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] p-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-portfolio-accent" />
              
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-portfolio-accent/10 flex items-center justify-center text-portfolio-accent">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h2 className="font-playfair text-2xl font-bold text-[#1A1814]">New Major Skill</h2>
                    <p className="font-dm-sans text-sm text-[#6B6560] font-light">Add a core competency with smart logo matching.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 rounded-full hover:bg-[#FAF8F4] flex items-center justify-center text-[#B8B3AC] hover:text-[#1A1814] transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block font-dm-mono text-[10px] uppercase tracking-widest text-[#B8B3AC] mb-3">Skill Identity</label>
                  <SmartTechSelector 
                    value={newSkill.name} 
                    onChange={(val) => setNewSkill({...newSkill, name: val})}
                    onSelect={(val) => setNewSkill({...newSkill, name: val})}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block font-dm-mono text-[10px] uppercase tracking-widest text-[#B8B3AC]">Proficiency Level</label>
                    <span className="font-dm-mono text-sm font-bold text-portfolio-accent">{newSkill.pct}%</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    value={newSkill.pct}
                    onChange={(e) => setNewSkill({...newSkill, pct: parseInt(e.target.value)})}
                    className="w-full h-2 bg-[#FAF8F4] rounded-full appearance-none cursor-pointer accent-[#2D5A3D]"
                  />
                  <div className="flex justify-between mt-2 font-dm-mono text-[9px] text-[#B8B3AC] uppercase tracking-tighter">
                    <span>Learning</span>
                    <span>Expert</span>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={addMajorSkill}
                    className="w-full bg-portfolio-accent text-white py-5 rounded-2xl font-dm-sans font-bold hover:bg-[#1A1814] transition-all shadow-xl shadow-[#2D5A3D]/20"
                  >
                    Add to Arsenal
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <ConfirmationDialog 
        isOpen={confirmConfig.isOpen}
        onOpenChange={(open) => setConfirmConfig(prev => ({ ...prev, isOpen: open }))}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        description={confirmConfig.desc}
      />
    </CMSLayout>
  )
}
