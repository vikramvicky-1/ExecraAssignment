import express from "express"
import multer from "multer"
import { storage } from "../config/cloudinary.js"
import { 
  getProjects, 
  createProject, 
  updateProject, 
  deleteProject 
} from "../controllers/projectController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()
const upload = multer({ storage })

router.get("/", getProjects)
router.post("/", protect, upload.single("banner"), createProject)
router.put("/:id", protect, upload.single("banner"), updateProject)
router.delete("/:id", protect, deleteProject)

export default router
