import 'dotenv/config'
import mongoose from "mongoose"
import Admin from "./models/Admin.js"
import connectDB from "./config/db.js"

const seedAdmin = async () => {
  try {
    await connectDB()

    const adminExists = await Admin.findOne({ email: "vikram517879@gmail.com" })

    if (adminExists) {
      console.log("Admin already exists")
      process.exit()
    }

    const admin = new Admin({
      email: "vikram517879@gmail.com",
      password: "vikram@admin"
    })

    await admin.save()
    console.log("Admin created successfully")
    process.exit()
  } catch (error) {
    console.error("Error seeding admin:", error)
    process.exit(1)
  }
}

seedAdmin()
