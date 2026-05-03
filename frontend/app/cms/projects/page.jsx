"use client"

import { useEffect, useState } from "react"
import CMSLayout from "@/components/admin/CMSLayout"
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  ExternalLink, 
  Github,
  Star,
  X,
  Upload,
  Loader2
} from "lucide-react"
import useProjectStore from "@/store/useProjectStore"
import { toast } from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"

export default function ProjectsManagementPage() {
  const { projects, fetchProjects, deleteProject, addProject, updateProject, isLoading } = useProjectStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleDelete = async () => {
    if (!projectToDelete) return
    const result = await deleteProject(projectToDelete._id)
    if (result.success) {
      toast.success("Project deleted successfully")
      setIsDeleteModalOpen(false)
    } else {
      toast.error(result.message)
    }
  }

  const openEditModal = (project) => {
    setEditingProject(project)
    setIsModalOpen(true)
  }

  const openAddModal = () => {
    setEditingProject(null)
    setIsModalOpen(true)
  }

  return (
    <CMSLayout 
      title="Project Portfolio" 
      subtitle="Manage your projects, case studies, and featured works."
    >
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-10">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8B3AC]" size={18} />
          <input 
            type="text" 
            placeholder="Search projects..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-black/[0.05] rounded-2xl pl-12 pr-4 py-3 font-dm-sans text-sm focus:outline-none focus:border-portfolio-accent/40 transition-all shadow-sm"
          />
        </div>
        <div className="flex gap-3">
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 bg-portfolio-accent text-white px-6 py-3 rounded-2xl text-sm font-dm-sans font-bold hover:bg-[#234730] transition-all shadow-lg shadow-[#2D5A3D]/20"
          >
            <Plus size={18} />
            Add Project
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard 
            key={project._id} 
            project={project} 
            onEdit={() => openEditModal(project)}
            onDelete={() => {
              setProjectToDelete(project)
              setIsDeleteModalOpen(true)
            }}
          />
        ))}
        
        {filteredProjects.length === 0 && !isLoading && (
          <div className="col-span-full py-20 text-center bg-white border border-dashed border-black/[0.1] rounded-3xl">
            <p className="font-dm-sans text-[#B8B3AC]">
              {searchQuery ? "No projects match your search." : "No projects found. Add your first project!"}
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <ProjectModal 
            project={editingProject} 
            onClose={() => setIsModalOpen(false)}
            onSubmit={editingProject ? updateProject : addProject}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <h3 className="font-playfair text-2xl font-bold text-[#1A1814] mb-4">Delete Project?</h3>
              <p className="font-dm-sans text-[#6B6560] mb-8">
                Are you sure you want to delete <span className="font-bold text-[#1A1814]">"{projectToDelete?.title}"</span>? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-4 rounded-2xl font-dm-sans font-bold text-sm text-[#6B6560] hover:bg-black/[0.03] transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-dm-sans font-bold text-sm hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Delete Project"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </CMSLayout>
  )
}

function ProjectCard({ project, onEdit, onDelete }) {
  return (
    <div className="bg-white border border-black/[0.05] rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group">
      <div className="flex gap-6">
        {/* Banner Preview */}
        <div className="w-32 h-32 rounded-2xl bg-[#FAF8F4] overflow-hidden shrink-0 border border-black/[0.03]">
          {project.banner?.url ? (
            <img src={project.banner.url} alt={project.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#B8B3AC]">
              <Upload size={24} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-dm-sans font-bold text-[#1A1814] text-lg truncate pr-4">{project.title}</h3>
            <div className="flex items-center gap-1">
              {project.featured && <Star size={16} className="text-amber-400 fill-amber-400" />}
              <button onClick={onEdit} className="p-2 text-[#B8B3AC] hover:text-portfolio-accent hover:bg-portfolio-accent/5 rounded-lg transition-all"><Edit2 size={16} /></button>
              <button onClick={onDelete} className="p-2 text-[#B8B3AC] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
            </div>
          </div>
          
          <p className="font-dm-sans text-sm text-[#6B6560] line-clamp-2 mb-4 leading-relaxed">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {project.techStack?.slice(0, 3).map((tech, i) => (
              <span key={i} className="text-[10px] font-dm-mono uppercase tracking-widest text-[#B8B3AC] bg-black/[0.03] px-2 py-0.5 rounded-full">
                {tech}
              </span>
            ))}
            {project.techStack?.length > 3 && (
              <span className="text-[10px] font-dm-mono text-[#B8B3AC] px-1">+ {project.techStack.length - 3}</span>
            )}
          </div>

          <div className="flex gap-4">
            {project.liveLink && (
              <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[11px] font-dm-mono uppercase tracking-widest text-portfolio-accent font-bold hover:underline">
                Live <ExternalLink size={12} />
              </a>
            )}
            {project.githubLink && (
              <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[11px] font-dm-mono uppercase tracking-widest text-[#6B6560] font-bold hover:underline">
                Github <Github size={12} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProjectModal({ project, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: project?.title || "",
    description: project?.description || "",
    techStack: project?.techStack || [],
    githubLink: project?.githubLink || "",
    liveLink: project?.liveLink || "",
    featured: project?.featured || false,
    year: project?.year || new Date().getFullYear().toString(),
  })
  const [newTech, setNewTech] = useState("")
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(project?.banner?.url || null)
  const [isLoading, setIsLoading] = useState(false)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const addTech = () => {
    if (newTech.trim()) {
      setFormData({ ...formData, techStack: [...formData.techStack, newTech.trim()] })
      setNewTech("")
    }
  }

  const removeTech = (index) => {
    setFormData({ ...formData, techStack: formData.techStack.filter((_, i) => i !== index) })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    const data = new FormData()
    data.append("title", formData.title)
    data.append("description", formData.description)
    data.append("techStack", JSON.stringify(formData.techStack))
    data.append("githubLink", formData.githubLink)
    data.append("liveLink", formData.liveLink)
    data.append("featured", formData.featured)
    data.append("year", formData.year)
    if (image) data.append("banner", image)

    const result = project 
      ? await onSubmit(project._id, data)
      : await onSubmit(data)

    setIsLoading(false)
    if (result.success) {
      toast.success(`Project ${project ? 'updated' : 'created'} successfully`)
      onClose()
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 40 }}
        className="relative bg-white rounded-[40px] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
      >
        {/* Modal Header */}
        <div className="p-8 border-b border-black/[0.05] flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-playfair text-3xl font-bold text-[#1A1814]">{project ? "Edit Project" : "Add New Project"}</h2>
            <p className="font-dm-sans text-[#B8B3AC] text-sm mt-1">Fill in the details for your portfolio project.</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-full border border-black/[0.05] flex items-center justify-center text-[#B8B3AC] hover:text-red-500 hover:bg-red-50 transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
          <form id="project-form" onSubmit={handleSubmit} className="space-y-10">
            {/* Banner Upload */}
            <div className="space-y-4">
              <label className="font-dm-sans text-[11px] uppercase tracking-[0.2em] text-[#B8B3AC] font-bold ml-1">Project Banner</label>
              <div className="relative group cursor-pointer h-64 rounded-[32px] overflow-hidden border-2 border-dashed border-black/[0.05] hover:border-portfolio-accent/40 transition-all bg-[#FAF8F4]">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                    <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center text-portfolio-accent shadow-sm">
                      <Upload size={28} />
                    </div>
                    <div className="text-center">
                      <p className="font-dm-sans font-semibold text-[#1A1814]">Drop your banner here</p>
                      <p className="font-dm-sans text-xs text-[#B8B3AC] mt-1">PNG, JPG, WebP up to 10MB</p>
                    </div>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                {imagePreview && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white font-dm-sans font-bold text-sm">Change Image</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Title */}
              <div className="space-y-2">
                <label className="font-dm-sans text-[11px] uppercase tracking-[0.2em] text-[#B8B3AC] font-bold ml-1">Project Title</label>
                <input 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-[#FAF8F4] border border-black/[0.05] rounded-2xl px-6 py-4 font-dm-sans text-[#1A1814] focus:outline-none focus:border-portfolio-accent/40 transition-all"
                  placeholder="E.g. Nexus Dashboard"
                />
              </div>

              {/* Project Settings */}
              <div className="space-y-6 pt-4">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-black/[0.05]" />
                  <label className="font-dm-sans text-[10px] uppercase tracking-[0.2em] text-[#B8B3AC] font-bold">Metadata & Status</label>
                  <div className="h-px flex-1 bg-black/[0.05]" />
                </div>
                
                <div className="space-y-5">
                  {/* Year Input - Compact & Clean */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="space-y-1">
                      <label className="font-dm-sans text-[13px] text-[#1A1814] font-bold">Completion Year</label>
                      <p className="text-[11px] text-[#B8B3AC] font-dm-sans">When was this project finalized?</p>
                    </div>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="e.g. 2024"
                        value={formData.year}
                        onChange={(e) => setFormData({...formData, year: e.target.value})}
                        className="w-full bg-[#FAF8F4] border border-black/[0.05] rounded-xl px-4 py-3 font-dm-sans text-sm font-bold text-[#1A1814] focus:outline-none focus:border-portfolio-accent/30 transition-all"
                      />
                    </div>
                  </div>

                  {/* Featured Toggle - Professional Card */}
                  <div 
                    onClick={() => setFormData({...formData, featured: !formData.featured})}
                    className={`flex items-center justify-between p-4 lg:p-5 rounded-2xl cursor-pointer transition-all border ${
                      formData.featured 
                        ? "bg-portfolio-accent/5 border-portfolio-accent/20 shadow-sm shadow-[#2D5A3D]/5" 
                        : "bg-[#FAF8F4] border-black/[0.05] hover:bg-black/[0.02]"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                        formData.featured ? "bg-portfolio-accent text-white shadow-lg shadow-[#2D5A3D]/20" : "bg-white text-[#B8B3AC]"
                      }`}>
                        <Star size={20} className={formData.featured ? "fill-white" : ""} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-dm-sans text-[15px] text-[#1A1814] font-bold">Featured Spotlight</span>
                        <p className={`text-[11px] font-dm-sans transition-colors ${
                          formData.featured ? "text-portfolio-accent/70" : "text-[#B8B3AC]"
                        }`}>
                          Promote to the hero section (overrides current featured)
                        </p>
                      </div>
                    </div>
                    <div className={`w-12 h-6 rounded-full relative transition-all duration-300 ${
                      formData.featured ? "bg-portfolio-accent" : "bg-[#E8E4DF]"
                    }`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${
                        formData.featured ? "left-7" : "left-1"
                      }`} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="font-dm-sans text-[11px] uppercase tracking-[0.2em] text-[#B8B3AC] font-bold ml-1">Project Description</label>
              <textarea 
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-[#FAF8F4] border border-black/[0.05] rounded-3xl px-6 py-4 font-dm-sans text-[#1A1814] focus:outline-none focus:border-portfolio-accent/40 transition-all resize-none text-base"
                placeholder="Describe your project, the challenges, and your role..."
              />
            </div>

            {/* Tech Stack */}
            <div className="space-y-4">
              <label className="font-dm-sans text-[11px] uppercase tracking-[0.2em] text-[#B8B3AC] font-bold ml-1">Tech Stack</label>
              <div className="flex flex-wrap gap-3 min-h-[64px] p-4 rounded-[32px] border border-black/[0.05] bg-[#FAF8F4]">
                {formData.techStack.map((tech, i) => (
                  <span key={i} className="flex items-center gap-2.5 bg-white border border-black/[0.05] px-5 py-2.5 rounded-2xl font-dm-sans text-sm font-bold text-[#1A1814] shadow-sm hover:border-portfolio-accent/20 transition-all">
                    {tech}
                    <button type="button" onClick={() => removeTech(i)} className="text-[#B8B3AC] hover:text-red-500 transition-colors p-0.5">
                      <X size={16} />
                    </button>
                  </span>
                ))}
                <input 
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                  className="bg-transparent border-none focus:outline-none px-4 py-2 font-dm-sans text-sm flex-1 min-w-[150px]"
                  placeholder="Add technology (Press Enter)"
                />
              </div>
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="font-dm-sans text-[11px] uppercase tracking-[0.2em] text-[#B8B3AC] font-bold ml-1">Live Demo Link</label>
                <div className="relative">
                  <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8B3AC]" size={16} />
                  <input 
                    value={formData.liveLink}
                    onChange={(e) => setFormData({...formData, liveLink: e.target.value})}
                    className="w-full bg-[#FAF8F4] border border-black/[0.05] rounded-2xl pl-12 pr-4 py-4 font-dm-sans text-sm text-[#1A1814] focus:outline-none focus:border-portfolio-accent/40 transition-all"
                    placeholder="https://your-site.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-dm-sans text-[11px] uppercase tracking-[0.2em] text-[#B8B3AC] font-bold ml-1">Github Repository</label>
                <div className="relative">
                  <Github className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8B3AC]" size={16} />
                  <input 
                    value={formData.githubLink}
                    onChange={(e) => setFormData({...formData, githubLink: e.target.value})}
                    className="w-full bg-[#FAF8F4] border border-black/[0.05] rounded-2xl pl-12 pr-4 py-4 font-dm-sans text-sm text-[#1A1814] focus:outline-none focus:border-portfolio-accent/40 transition-all"
                    placeholder="https://github.com/your-repo"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="p-8 border-t border-black/[0.05] flex justify-end gap-4 shrink-0 bg-white/50 backdrop-blur-xl">
          <button 
            type="button"
            onClick={onClose}
            className="px-8 py-4 rounded-2xl font-dm-sans font-bold text-sm text-[#6B6560] hover:bg-black/[0.03] transition-all"
          >
            Cancel
          </button>
          <button 
            form="project-form"
            type="submit"
            disabled={isLoading}
            className="bg-portfolio-accent text-white px-10 py-4 rounded-2xl flex items-center gap-3 font-dm-sans font-bold text-sm shadow-[0_12px_24px_rgba(45,90,61,0.25)] hover:bg-[#234730] disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98]"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : project ? "Save Changes" : "Create Project"}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
