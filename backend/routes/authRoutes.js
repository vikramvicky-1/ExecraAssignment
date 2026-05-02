import express from "express"
const router = express.Router()
import { login, logout, getProfile } from "../controllers/authController.js"
import { protect } from "../middleware/authMiddleware.js"

router.post("/login", login)
router.post("/logout", logout)
router.get("/profile", protect, getProfile)

export default router
