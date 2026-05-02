import express from "express";
import Contact from "../models/Contact.js";

const router = express.Router();

// Submit contact form (Public)
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const contact = await Contact.create({ name, email, message });
    
    // Emit real-time notification to admin
    req.io.emit("new_contact", contact);

    res.status(201).json({ success: true, contact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch all contacts (Admin)
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark as read (Admin)
router.patch("/:id/read", async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.id || req.params.id, { isRead: true }, { new: true });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete contact (Admin)
router.delete("/:id", async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Contact deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
