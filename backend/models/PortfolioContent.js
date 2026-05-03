import mongoose from "mongoose"

const portfolioContentSchema = new mongoose.Schema({
  hero: {
    stats: [
      {
        label: { type: String, default: "Projects" },
        value: { type: String, default: "40+" }
      },
      {
        label: { type: String, default: "Years" },
        value: { type: String, default: "3+" }
      },
      {
        label: { type: String, default: "Load" },
        value: { type: String, default: "10K+" }
      }
    ]
  },
  about: {
    manifesto: [{ type: String }],
    milestones: [
      {
        year: { type: String },
        title: { type: String },
        desc: { type: String }
      }
    ]
  },
  skills: {
    major: [
      {
        name: { type: String },
        pct: { type: Number }
      }
    ],
    minor: [{ type: String }],
    exploring: [{ type: String }]
  }
}, { timestamps: true })

const PortfolioContent = mongoose.model("PortfolioContent", portfolioContentSchema)
export default PortfolioContent
