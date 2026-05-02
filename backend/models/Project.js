import mongoose from "mongoose"

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  banner: {
    url: String,
    public_id: String
  },
  techStack: [{
    type: String
  }],
  githubLink: {
    type: String,
    trim: true
  },
  liveLink: {
    type: String,
    trim: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  year: {
    type: String,
    default: new Date().getFullYear().toString()
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true })

// Pre-save hook to handle featured logic
projectSchema.pre('save', async function() {
  if (this.isModified('featured') && this.featured === true) {
    // Optional: Logic to handle multiple featured projects could go here
  }
})

const Project = mongoose.model("Project", projectSchema)
export default Project
