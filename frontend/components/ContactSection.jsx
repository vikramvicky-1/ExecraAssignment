"use client"

import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Mail, MapPin, Clock, Github, Linkedin, Twitter } from "lucide-react"
import api from "@/lib/axios"

export default function ContactSection() {
  const prefersReduced = useReducedMotion()
  const [formState, setFormState] = useState("idle")
  const [btnHover, setBtnHover] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", message: "" })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    
    setFormState("sending")
    try {
      const response = await api.post("/contacts", form)
      
      if (response.status === 201 || response.status === 200) {
        setFormState("sent")
        setForm({ name: "", email: "", message: "" })
        setTimeout(() => setFormState("idle"), 3000)
      } else {
        throw new Error("Failed to send")
      }
    } catch (error) {
      setFormState("idle")
      alert("Something went wrong. Please try again.")
    }
  }

  const inputStyle = {
    width: "100%",
    background: "white",
    borderRadius: "12px",
    border: "1px solid rgba(26,24,20,0.1)",
    padding: "16px 20px",
    fontSize: "15px",
    fontFamily: "var(--font-dm-sans)",
    fontWeight: 300,
    color: "#1A1814",
    outline: "none",
    transition: "border-color 200ms ease, box-shadow 200ms ease",
  }

  const labelStyle = {
    display: "block",
    fontFamily: "var(--font-dm-mono)",
    fontSize: "10px",
    color: "#B8B3AC",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    marginBottom: "8px",
  }

  return (
    <section
      id="contact"
      style={{
        background: "var(--section-contact)",
        padding: "120px clamp(24px, 5vw, 64px) 0",
      }}
    >
      {/* Heading */}
      <div className="mb-10">
        <motion.p
          className="font-dm-mono text-[#2D5A3D] uppercase mb-6"
          style={{ fontSize: "11px", letterSpacing: "0.2em", fontWeight: 700 }}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          05 — Get In Touch
        </motion.p>
        <div className="flex flex-col">
          {["Got a project", "in mind?"].map((line, i) => (
            <motion.h2
              key={i}
              className="font-playfair"
              style={{
                fontSize: "clamp(56px, 8vw, 110px)",
                fontWeight: 900,
                lineHeight: 1,
                color: i === 0 ? "#1A1814" : "#2D5A3D",
                display: "block"
              }}
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.215, 0.61, 0.355, 1] }}
            >
              {line}
            </motion.h2>
          ))}
        </div>
        <motion.p
          className="font-dm-sans text-[#6B6560] mt-8"
          style={{ fontSize: "18px", fontWeight: 300, maxWidth: "560px", lineHeight: 1.7 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          I&apos;m currently available for freelance projects and full-time roles. If you&apos;re building something that needs to scale, let&apos;s talk.
        </motion.p>
      </div>

      {/* Content row */}
      <div className="flex flex-col lg:flex-row gap-16 pb-20">
        {/* Left: info cards */}
        <div style={{ flex: "0 0 35%", display: "flex", flexDirection: "column", gap: "16px" }}>
          {[
            { icon: <Mail size={20} color="#2D5A3D" />, label: "Email", value: "vikram@email.com" },
            { icon: <MapPin size={20} color="#2D5A3D" />, label: "Location", value: "India — Remote Global" },
            { icon: <Clock size={20} color="#2D5A3D" />, label: "Response", value: "Within 24 hours" },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "20px 24px",
                border: "1px solid rgba(26,24,20,0.06)",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: prefersReduced ? 0 : i * 0.1 }}
            >
              {card.icon}
              <div>
                <p className="font-dm-mono text-[#B8B3AC] uppercase" style={{ fontSize: "10px", letterSpacing: "0.15em" }}>{card.label}</p>
                <p className="font-dm-sans text-[#1A1814] mt-1" style={{ fontSize: "14px", fontWeight: 500 }}>{card.value}</p>
              </div>
            </motion.div>
          ))}

          {/* Social links */}
          <div className="flex flex-col gap-3 mt-4">
            {[
              { icon: <Github size={16} />, handle: "@vikram-dev", label: "GitHub" },
              { icon: <Linkedin size={16} />, handle: "Vikram", label: "LinkedIn" },
              { icon: <Twitter size={16} />, handle: "@vikram_builds", label: "Twitter" },
            ].map((social) => (
              <motion.a
                key={social.label}
                href="#"
                aria-label={social.label}
                className="font-dm-mono text-[#6B6560] hover:text-[#2D5A3D] flex items-center gap-3 transition-colors"
                style={{ fontSize: "12px", textDecoration: "none" }}
                whileHover={{ x: 6 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-[#B8B3AC]">{social.icon}</span>
                {social.handle}
              </motion.a>
            ))}
          </div>
        </div>

        {/* Right: form */}
        <motion.form
          onSubmit={handleSubmit}
          style={{ flex: 1 }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          noValidate
        >
          <div className="flex flex-col gap-6">
            <div>
              <label htmlFor="contact-name" style={labelStyle}>Name</label>
              <input
                id="contact-name"
                type="text"
                placeholder="Your full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(45,90,61,0.4)"
                  e.target.style.boxShadow = "0 0 0 4px rgba(45,90,61,0.08)"
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(26,24,20,0.1)"
                  e.target.style.boxShadow = "none"
                }}
                required
              />
            </div>

            <div>
              <label htmlFor="contact-email" style={labelStyle}>Email</label>
              <input
                id="contact-email"
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(45,90,61,0.4)"
                  e.target.style.boxShadow = "0 0 0 4px rgba(45,90,61,0.08)"
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(26,24,20,0.1)"
                  e.target.style.boxShadow = "none"
                }}
                required
              />
            </div>

            <div>
              <label htmlFor="contact-message" style={labelStyle}>Message</label>
              <textarea
                id="contact-message"
                placeholder="Tell me about your project..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                style={{ ...inputStyle, height: "140px", resize: "none" }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(45,90,61,0.4)"
                  e.target.style.boxShadow = "0 0 0 4px rgba(45,90,61,0.08)"
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(26,24,20,0.1)"
                  e.target.style.boxShadow = "none"
                }}
                required
              />
            </div>

            {/* Submit button */}
            <motion.button
              type="submit"
              onMouseEnter={() => setBtnHover(true)}
              onMouseLeave={() => setBtnHover(false)}
              style={{
                width: "100%",
                height: "60px",
                borderRadius: "12px",
                background: formState === "sent" ? "#2D5A3D" : "#2D5A3D",
                border: "none",
                cursor: formState === "sending" ? "not-allowed" : "pointer",
                overflow: "hidden",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              whileHover={formState === "idle" ? { y: -2, boxShadow: "0 8px 32px rgba(45,90,61,0.25)", background: "#234A32" } : {}}
              animate={formState === "sent" ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 0.3 }}
              disabled={formState !== "idle"}
            >
              <AnimatePresence mode="wait">
                {formState === "idle" && (
                  <motion.div
                    key="idle"
                    style={{ position: "absolute", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60px" }}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.span
                      className="font-dm-sans text-[#FAF8F4]"
                      style={{ fontSize: "15px", fontWeight: 500, letterSpacing: "0.05em", display: "block" }}
                      animate={btnHover ? { y: "-130%" } : { y: "0%" }}
                      transition={{ duration: 0.26, ease: [0.76, 0, 0.24, 1] }}
                    >
                      Send Message →
                    </motion.span>
                    <motion.span
                      className="font-dm-sans text-[#FAF8F4]"
                      style={{ fontSize: "15px", fontWeight: 500, letterSpacing: "0.05em", position: "absolute" }}
                      initial={{ y: "130%" }}
                      animate={btnHover ? { y: "0%" } : { y: "130%" }}
                      transition={{ duration: 0.26, ease: [0.76, 0, 0.24, 1] }}
                    >
                      Let&apos;s Work Together
                    </motion.span>
                  </motion.div>
                )}
                {formState === "sending" && (
                  <motion.div
                    key="sending"
                    className="flex items-center gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <span className="font-dm-sans text-[#FAF8F4]" style={{ fontSize: "15px", fontWeight: 300 }}>Sending</span>
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="text-[#FAF8F4]"
                        style={{ fontSize: "15px" }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      >
                        .
                      </motion.span>
                    ))}
                  </motion.div>
                )}
                {formState === "sent" && (
                  <motion.span
                    key="sent"
                    className="font-dm-sans text-[#FAF8F4]"
                    style={{ fontSize: "15px", fontWeight: 500, letterSpacing: "0.05em" }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    Message Sent ✓
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.form>
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid rgba(26,24,20,0.08)", padding: "32px 0" }}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-dm-mono text-[#B8B3AC]" style={{ fontSize: "11px" }}>
            &copy; 2025 Vikram — Designed and Built from scratch
          </span>
          <div className="flex items-center gap-5">
            {[
              { icon: <Github size={18} />, label: "GitHub" },
              { icon: <Linkedin size={18} />, label: "LinkedIn" },
              { icon: <Twitter size={18} />, label: "Twitter" },
            ].map((s) => (
              <motion.a
                key={s.label}
                href="#"
                aria-label={s.label}
                className="text-[#B8B3AC] hover:text-[#2D5A3D] transition-colors"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                {s.icon}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
