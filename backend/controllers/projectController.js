import Project from "../models/Project.js"
import { v2 as cloudinary } from "cloudinary"

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ featured: -1, createdAt: -1 })
    res.status(200).json(projects)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createProject = async (req, res) => {
  try {
    const projectData = { ...req.body }
    const isFeatured = projectData.featured === 'true' || projectData.featured === true

    if (typeof projectData.techStack === 'string') {
      projectData.techStack = JSON.parse(projectData.techStack)
    }

    // Handle single featured project logic
    if (isFeatured) {
      const existingFeatured = await Project.findOne({ featured: true })
      if (existingFeatured) {
        existingFeatured.featured = false
        await existingFeatured.save()
        if (req.io) req.io.emit("projectUpdated", existingFeatured)
      }
    }

    // Handle file upload
    if (req.file) {
      projectData.banner = {
        url: req.file.path,
        public_id: req.file.filename
      }
    }

    const project = new Project(projectData)
    await project.save()

    if (req.io) req.io.emit("projectCreated", project)

    res.status(201).json(project)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = { ...req.body }
    const isFeatured = updateData.featured === 'true' || updateData.featured === true

    if (typeof updateData.techStack === 'string') {
      updateData.techStack = JSON.parse(updateData.techStack)
    }

    // Handle single featured project logic
    if (isFeatured) {
      const existingFeatured = await Project.findOne({ featured: true, _id: { $ne: id } })
      if (existingFeatured) {
        existingFeatured.featured = false
        await existingFeatured.save()
        if (req.io) req.io.emit("projectUpdated", existingFeatured)
      }
    }

    // Handle new image upload
    if (req.file) {
      const oldProject = await Project.findById(id)
      if (oldProject?.banner?.public_id) {
        await cloudinary.uploader.destroy(oldProject.banner.public_id)
      }
      
      updateData.banner = {
        url: req.file.path,
        public_id: req.file.filename
      }
    }

    const project = await Project.findByIdAndUpdate(id, updateData, { new: true })
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    if (req.io) req.io.emit("projectUpdated", project)

    res.status(200).json(project)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params
    const project = await Project.findById(id)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    // Delete image from cloudinary if exists
    if (project.banner?.public_id) {
      await cloudinary.uploader.destroy(project.banner.public_id)
    }

    await project.deleteOne()

    // Socket emit
    if (req.io) {
      req.io.emit("projectDeleted", id)
    }

    res.status(200).json({ message: "Project deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
