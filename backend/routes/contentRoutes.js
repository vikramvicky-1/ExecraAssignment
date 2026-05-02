import express from "express"
const router = express.Router()
import { getContent, updateContent } from "../controllers/contentController.js"
import { protect } from "../middleware/authMiddleware.js"

router.get("/", getContent)
router.put("/", protect, updateContent)

export default router
