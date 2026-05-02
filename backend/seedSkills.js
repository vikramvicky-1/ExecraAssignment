import mongoose from "mongoose"
import "dotenv/config"
import PortfolioContent from "./models/PortfolioContent.js"

const MONGODB_URI = process.env.MONGODB_URI

const skillsData = {
  major: [
    { name: "React", pct: 92, color: "#61DAFB", symbol: "Re" },
    { name: "Next.js", pct: 88, color: "#000000", symbol: "N." },
    { name: "Node.js", pct: 85, color: "#339933", symbol: "No" },
    { name: "MongoDB", pct: 80, color: "#47A248", symbol: "Mg" },
    { name: "TypeScript", pct: 78, color: "#3178C6", symbol: "TS" },
    { name: "Express", pct: 87, color: "#404040", symbol: "Ex" },
  ],
  minor: [
    "REST APIs", "GraphQL", "Redis", "Docker", "Git", "Vercel", "AWS",
    "Socket.io", "Prisma", "PostgreSQL", "TailwindCSS", "Framer Motion",
    "Jest", "Linux", "Webpack", "Supabase", "GitHub Actions",
  ],
  exploring: [
    "Rust", "WebGL Shaders", "Edge Computing", "LLM Fine-Tuning", 
    "System Design at Scale", "tRPC", "Bun Runtime"
  ]
}

async function seedSkills() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log("Connected to MongoDB for skills seeding")

    let content = await PortfolioContent.findOne()
    if (!content) {
      content = new PortfolioContent({ skills: skillsData })
    } else {
      content.skills = skillsData
    }
    await content.save()

    console.log("Skills seeded successfully into PortfolioContent")
    process.exit(0)
  } catch (error) {
    console.error("Seeding error:", error)
    process.exit(1)
  }
}

seedSkills()
