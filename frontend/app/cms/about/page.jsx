"use client"

import { useState, useEffect, useCallback } from "react"
import CMSLayout from "@/components/admin/CMSLayout"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Sparkles,
  Zap,
  Globe,
  X,
  Loader2,
  Calendar,
  Quote,
  MessageSquare,
  Clock
} from "lucide-react"
import useContentStore from "@/store/useContentStore"
import { toast } from "react-hot-toast"
import ConfirmationDialog from "@/components/admin/ConfirmationDialog"

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

export default function AboutCMS() {
  const { content, fetchContent, updateContent, isUpdating } = useContentStore()
  const [formData, setFormData] = useState({
    manifesto: [],
    milestones: []
  })

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newMilestone, setNewMilestone] = useState({ year: "2026", title: "", desc: "" })
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, onConfirm: null, title: "", desc: "" })

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  useEffect(() => {
    if (content?.about) {
      setFormData({
        manifesto: content.about.manifesto || [],
        milestones: content.about.milestones || []
      })
    }
  }, [content])

  // Auto-save logic
  const debouncedUpdate = useCallback(
    debounce(async (data) => {
      try {
        await updateContent({ about: data })
      } catch (error) {
        toast.error("Sync failed")
      }
    }, 1000),
    [updateContent]
  )

  const instantUpdate = async (data) => {
    try {
      setFormData(data)
      await updateContent({ about: data })
    } catch (error) {
      toast.error("Update failed")
    }
  }

  const handleInputChange = (newData) => {
    setFormData(newData)
    debouncedUpdate(newData)
  }

  // Manifesto Handlers
  const addManifestoParagraph = () => {
    const newData = {
      ...formData,
      manifesto: [...formData.manifesto, ""]
    }
    instantUpdate(newData)
  }

  const updateManifesto = (index, value) => {
    const newManifesto = [...formData.manifesto]
    newManifesto[index] = value
    const newData = { ...formData, manifesto: newManifesto }
    handleInputChange(newData)
  }

  const removeManifesto = (index) => {
    setConfirmConfig({
      isOpen: true,
      title: "Delete Paragraph?",
      desc: "Remove this paragraph from your engineering manifesto?",
      onConfirm: () => {
        const newData = {
          ...formData,
          manifesto: formData.manifesto.filter((_, i) => i !== index)
        }
        instantUpdate(newData)
        setConfirmConfig(prev => ({ ...prev, isOpen: false }))
      }
    })
  }

  // Milestones Handlers
  const handleAddMilestone = () => {
    if (!newMilestone.title.trim()) {
      toast.error("Milestone title is required")
      return
    }
    const newData = {
      ...formData,
      milestones: [...formData.milestones, newMilestone]
    }
    instantUpdate(newData)
    setNewMilestone({ year: "2026", title: "", desc: "" })
    setIsModalOpen(false)
    toast.success("Milestone added and synced")
  }

  const updateMilestone = (index, field, value) => {
    const newMilestones = [...formData.milestones]
    newMilestones[index] = { ...newMilestones[index], [field]: value }
    const newData = { ...formData, milestones: newMilestones }
    handleInputChange(newData)
  }

  const removeMilestone = (index) => {
    setConfirmConfig({
      isOpen: true,
      title: "Remove Milestone?",
      desc: `Delete "${formData.milestones[index].title}" from your career timeline?`,
      onConfirm: () => {
        const newData = {
          ...formData,
          milestones: formData.milestones.filter((_, i) => i !== index)
        }
        instantUpdate(newData)
        setConfirmConfig(prev => ({ ...prev, isOpen: false }))
      }
    })
  }

  return (
    <CMSLayout 
      title="The Engineer" 
      subtitle="Refine your manifesto and career timeline. All changes are live instantly."
    >
      {/* Real-time Status Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 bg-white p-6 rounded-[32px] border border-black/[0.05] shadow-sm">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isUpdating ? 'bg-orange-400 animate-pulse' : 'bg-[#2D5A3D]'}`} />
          <div>
            <p className="font-dm-mono text-[10px] uppercase tracking-widest text-[#1A1814] font-bold">
              {isUpdating ? "Syncing Story..." : "Story Real-time Sync Active"}
            </p>
            <p className="font-dm-sans text-xs text-[#B8B3AC]">
              {isUpdating ? "Applying your latest edits..." : "Every word is instantly reflected on your site."}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <AnimatePresence>
            {isUpdating && (
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-2 px-4 py-2 bg-[#FAF8F4] rounded-full border border-black/[0.03]"
              >
                <Loader2 size={14} className="animate-spin text-[#2D5A3D]" />
                <span className="font-dm-mono text-[9px] uppercase tracking-widest text-[#6B6560]">Saving</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Manifesto */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-black/[0.05] rounded-[32px] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Quote size={20} className="text-[#2D5A3D]" />
                <div>
                  <h3 className="font-playfair text-xl font-bold text-[#1A1814]">My Manifesto</h3>
                  <p className="font-dm-sans text-sm text-[#6B6560] font-light">Your engineering philosophy paragraphs.</p>
                </div>
              </div>
              <button 
                onClick={addManifestoParagraph}
                className="flex items-center gap-2 bg-[#FAF8F4] text-[#2D5A3D] px-4 py-2 rounded-full font-dm-mono text-[10px] uppercase tracking-widest font-bold hover:bg-[#2D5A3D] hover:text-white transition-all shadow-sm group"
              >
                <Plus size={14} />
                <span>Add Paragraph</span>
              </button>
            </div>

            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {formData.manifesto.map((paragraph, index) => (
                  <motion.div
                    key={index}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative group"
                  >
                    <div className="absolute -left-3 top-4 text-[#B8B3AC] font-dm-mono text-[10px] opacity-50">
                      0{index + 1}
                    </div>
                    <div className="flex gap-4">
                      <textarea 
                        value={paragraph}
                        onChange={(e) => updateManifesto(index, e.target.value)}
                        className="w-full bg-[#FAF8F4] border border-black/[0.03] rounded-2xl p-6 font-dm-sans text-base text-[#1A1814] focus:outline-none focus:ring-2 focus:ring-[#2D5A3D]/10 focus:bg-white transition-all min-h-[120px] resize-none"
                        placeholder="Type your philosophy..."
                      />
                      <button 
                        onClick={() => removeManifesto(index)}
                        className="mt-2 p-2 text-[#B8B3AC] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 h-10 w-10 shrink-0"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {formData.manifesto.length === 0 && (
                <div className="py-12 flex flex-col items-center justify-center text-center border-2 border-dashed border-black/[0.03] rounded-3xl">
                  <p className="font-dm-sans text-sm text-[#B8B3AC]">No manifesto paragraphs added.</p>
                  <button onClick={addManifestoParagraph} className="mt-4 text-[#2D5A3D] font-dm-mono text-xs uppercase tracking-widest font-bold">Start Writing</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Milestones */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-black/[0.05] rounded-[32px] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-[#2D5A3D]" />
                <div>
                  <h3 className="font-playfair text-xl font-bold text-[#1A1814]">The Milestones</h3>
                  <p className="font-dm-sans text-sm text-[#6B6560] font-light">Your career timeline.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-[#FAF8F4] text-[#2D5A3D] px-4 py-2 rounded-full font-dm-mono text-[10px] uppercase tracking-widest font-bold hover:bg-[#2D5A3D] hover:text-white transition-all shadow-sm"
              >
                <Plus size={14} />
                <span>Add</span>
              </button>
            </div>

            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {formData.milestones.map((milestone, index) => (
                  <motion.div
                    key={index}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-6 rounded-2xl bg-[#FAF8F4] border border-black/[0.03] group relative"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1 grid grid-cols-12 gap-3">
                        <div className="col-span-4">
                          <label className="block font-dm-mono text-[9px] uppercase tracking-tighter text-[#B8B3AC] mb-1">Year</label>
                          <input 
                            type="text"
                            value={milestone.year}
                            onChange={(e) => updateMilestone(index, 'year', e.target.value)}
                            className="w-full bg-transparent border-none p-0 font-dm-mono text-sm font-bold text-[#2D5A3D] focus:ring-0"
                          />
                        </div>
                        <div className="col-span-8">
                          <label className="block font-dm-mono text-[9px] uppercase tracking-tighter text-[#B8B3AC] mb-1">Title</label>
                          <input 
                            type="text"
                            value={milestone.title}
                            onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                            className="w-full bg-transparent border-none p-0 font-dm-sans text-sm font-semibold text-[#1A1814] focus:ring-0"
                          />
                        </div>
                      </div>
                      <button 
                        onClick={() => removeMilestone(index)}
                        className="p-1 text-[#B8B3AC] hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div>
                      <label className="block font-dm-mono text-[9px] uppercase tracking-tighter text-[#B8B3AC] mb-1">Description</label>
                      <textarea 
                        value={milestone.desc}
                        onChange={(e) => updateMilestone(index, 'desc', e.target.value)}
                        className="w-full bg-transparent border-none p-0 font-dm-sans text-xs text-[#6B6560] focus:ring-0 resize-none"
                        rows={2}
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {formData.milestones.length === 0 && (
                <div className="py-12 text-center border-2 border-dashed border-black/[0.03] rounded-3xl">
                  <p className="font-dm-sans text-sm text-[#B8B3AC]">No milestones added yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Add Milestone Modal */}
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
              <div className="absolute top-0 left-0 w-full h-2 bg-[#2D5A3D]" />
              
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#2D5A3D]/10 flex items-center justify-center text-[#2D5A3D]">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h2 className="font-playfair text-2xl font-bold text-[#1A1814]">New Milestone</h2>
                    <p className="font-dm-sans text-sm text-[#6B6560] font-light">Mark a new point in your story.</p>
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
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-4">
                    <label className="block font-dm-mono text-[10px] uppercase tracking-widest text-[#B8B3AC] mb-3">Year</label>
                    <input 
                      type="text"
                      placeholder="2026"
                      value={newMilestone.year}
                      onChange={(e) => setNewMilestone({...newMilestone, year: e.target.value})}
                      className="w-full bg-[#FAF8F4] border border-black/[0.05] rounded-2xl px-6 py-4 font-dm-mono text-sm font-bold text-[#2D5A3D] focus:ring-2 focus:ring-[#2D5A3D]/20 outline-none transition-all"
                    />
                  </div>
                  <div className="col-span-8">
                    <label className="block font-dm-mono text-[10px] uppercase tracking-widest text-[#B8B3AC] mb-3">Title</label>
                    <input 
                      type="text"
                      placeholder="e.g. Started AI Lab"
                      value={newMilestone.title}
                      onChange={(e) => setNewMilestone({...newMilestone, title: e.target.value})}
                      className="w-full bg-[#FAF8F4] border border-black/[0.05] rounded-2xl px-6 py-4 font-dm-sans text-sm font-semibold text-[#1A1814] focus:ring-2 focus:ring-[#2D5A3D]/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-dm-mono text-[10px] uppercase tracking-widest text-[#B8B3AC] mb-3">Description</label>
                  <textarea 
                    placeholder="Describe this milestone..."
                    value={newMilestone.desc}
                    onChange={(e) => setNewMilestone({...newMilestone, desc: e.target.value})}
                    className="w-full bg-[#FAF8F4] border border-black/[0.05] rounded-2xl px-6 py-4 font-dm-sans text-sm text-[#1A1814] focus:ring-2 focus:ring-[#2D5A3D]/20 outline-none transition-all min-h-[120px] resize-none"
                  />
                </div>

                <div className="pt-4">
                  <button 
                    onClick={handleAddMilestone}
                    className="w-full bg-[#2D5A3D] text-white py-5 rounded-2xl font-dm-sans font-bold hover:bg-[#1A1814] transition-all shadow-xl shadow-[#2D5A3D]/20"
                  >
                    Add Milestone
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
