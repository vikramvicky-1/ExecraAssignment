import Admin from "../models/Admin.js"
import jwt from "jsonwebtoken"

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "14d"
  })
}

export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const admin = await Admin.findOne({ email })
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    const token = generateToken(admin._id)

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 14 * 24 * 60 * 60 * 1000 // 14 days
    })

    res.status(200).json({
      _id: admin._id,
      email: admin.email,
      message: "Login successful"
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0)
  })
  res.status(200).json({ message: "Logged out successfully" })
}

export const getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select("-password")
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" })
    }
    res.status(200).json(admin)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
