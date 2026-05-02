import 'dotenv/config'
import mongoose from "mongoose"
import { v2 as cloudinary } from "cloudinary"
import Project from "./models/Project.js"
import connectDB from "./config/db.js"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUDNAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const projects = [
  {
    title: "Aether AI — Content Intelligence",
    description: "An AI-powered SaaS platform that automates content strategy using LLMs. Features include real-time semantic analysis, automated SEO mapping, and dynamic workflow orchestration for multi-tenant organizations.",
    techStack: ["Next.js", "Node.js", "OpenAI API", "MongoDB", "TailwindCSS"],
    githubLink: "#",
    liveLink: "#",
    featured: true,
    year: "2024",
    imagePath: "C:\\Users\\vikra\\.gemini\\antigravity\\brain\\4311f902-c01a-407c-ba09-c861e37884bb\\aether_ai_banner_1777747465493.png"
  },
  {
    title: "Syncro — Real-Time Collaboration",
    description: "A robust project management engine supporting 10K+ concurrent users. Built with a custom Socket.io layer and Redis pub/sub for instant state synchronization across distributed teams.",
    techStack: ["MERN", "Socket.io", "Redis", "Framer Motion", "Zustand"],
    githubLink: "#",
    liveLink: "#",
    featured: false,
    year: "2024",
    imagePath: "C:\\Users\\vikra\\.gemini\\antigravity\\brain\\4311f902-c01a-407c-ba09-c861e37884bb\\syncro_banner_1777747491763.png"
  },
  {
    title: "Lumina — E-commerce Insights",
    description: "Next-generation analytics for modern e-commerce. It predictive-models customer churn and behavior patterns using custom ML pipelines, delivering actionable insights through interactive 3D visualizations.",
    techStack: ["React", "Express", "D3.js", "Three.js", "Python", "MongoDB"],
    githubLink: "#",
    liveLink: "#",
    featured: false,
    year: "2023",
    imagePath: "C:\\Users\\vikra\\.gemini\\antigravity\\brain\\4311f902-c01a-407c-ba09-c861e37884bb\\lumina_banner_1777747510627.png"
  },
  {
    title: "Nexus — API Automated Testing",
    description: "A developer-first tool for automated API documentation and load testing. Features an intuitive CLI and a web-based dashboard for monitoring high-throughput endpoints at scale.",
    techStack: ["Node.js", "TypeScript", "Docker", "PostgreSQL", "Redis"],
    githubLink: "#",
    liveLink: "#",
    featured: false,
    year: "2025",
    imagePath: "C:\\Users\\vikra\\.gemini\\antigravity\\brain\\4311f902-c01a-407c-ba09-c861e37884bb\\nexus_banner_1777747529660.png"
  },
  {
    title: "Velocity — High-Frequency Trading",
    description: "A professional-grade financial dashboard for real-time portfolio management. Integrates with multiple exchange APIs to deliver sub-second price updates and automated trade execution strategies.",
    techStack: ["Next.js", "FastAPI", "WebSockets", "Prisma", "PostgreSQL"],
    githubLink: "#",
    liveLink: "#",
    featured: false,
    year: "2024",
    imagePath: "C:\\Users\\vikra\\.gemini\\antigravity\\brain\\4311f902-c01a-407c-ba09-c861e37884bb\\velocity_banner_1777747545751.png"
  }
]

const seed = async () => {
  try {
    await connectDB()
    console.log("Connected to DB. Deleting existing projects...")
    await Project.deleteMany()

    for (const p of projects) {
      console.log(`Uploading banner for ${p.title}...`)
      const uploadRes = await cloudinary.uploader.upload(p.imagePath, {
        folder: "portfolio/projects"
      })

      const project = new Project({
        ...p,
        banner: {
          url: uploadRes.secure_url,
          public_id: uploadRes.public_id
        }
      })

      await project.save()
      console.log(`Saved ${p.title}`)
    }

    console.log("Seeding completed successfully")
    process.exit()
  } catch (error) {
    console.error("Seeding failed:", error)
    process.exit(1)
  }
}

seed()
