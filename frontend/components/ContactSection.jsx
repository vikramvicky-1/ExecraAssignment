"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Github, Linkedin, Instagram } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/lib/axios";

// High-Fidelity Staggered Link with Icon support
const FooterLink = ({ title, onClick, href, icon: Icon }) => {
  const letters = title.split("");
  
  return (
    <motion.a
      href={href || "#"}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      target={href && href !== "#" ? "_blank" : undefined}
      rel={href && href !== "#" ? "noopener noreferrer" : undefined}
      whileHover="hover"
      initial="initial"
      className="relative inline-flex items-center gap-3 cursor-pointer h-5 md:h-7 overflow-hidden group"
    >
      {/* Social Icon */}
      {Icon && (
        <motion.div 
          className="text-white opacity-50 group-hover:opacity-100 transition-opacity"
          variants={{
            initial: { scale: 0.9 },
            hover: { scale: 1.1 }
          }}
        >
          <Icon size={18} />
        </motion.div>
      )}

      <div className="relative flex h-full items-center overflow-hidden">
        <div className="flex">
          {letters.map((l, i) => (
            <motion.span
              key={i}
              variants={{
                initial: { y: 0 },
                hover: { y: "-110%" }
              }}
              transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1], delay: i * 0.02 }}
              className="inline-block font-manrope text-[18px] md:text-[24px] font-black uppercase tracking-tight text-white leading-none whitespace-pre"
            >
              {l}
            </motion.span>
          ))}
        </div>
        
        <div className="absolute inset-0 flex items-center">
          {letters.map((l, i) => (
            <motion.span
              key={i}
              variants={{
                initial: { y: "110%" },
                hover: { y: 0 }
              }}
              transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1], delay: i * 0.02 }}
              className="inline-block font-manrope text-[18px] md:text-[24px] font-black uppercase tracking-tight text-white/40 leading-none whitespace-pre"
            >
              {l}
            </motion.span>
          ))}
        </div>
      </div>

      <motion.div
        variants={{
          initial: { rotate: 0, x: 0, y: 0, scale: 1 },
          hover: { rotate: 45, x: 2, y: -2, scale: 1.1 }
        }}
        transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
        className="text-white pt-0.5"
      >
        <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" strokeWidth={3} />
      </motion.div>
    </motion.a>
  );
};

export default function ContactSection() {
  const prefersReduced = useReducedMotion();
  const [formState, setFormState] = useState("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [btnHover, setBtnHover] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all fields before sending.", {
        style: {
          background: "#1A1814",
          color: "#FFFFFF",
          fontFamily: "var(--font-manrope)",
          fontSize: "12px",
          fontWeight: 700,
          borderRadius: "0px",
          border: "1px solid rgba(246,61,24,0.3)"
        }
      });
      return;
    }
    
    setFormState("sending");
    try {
      const response = await api.post("/contacts", form);
      if (response.status === 201 || response.status === 200) {
        setFormState("sent");
        toast.success("Dialogue Initiated! I'll get back to you soon.", {
          style: {
            background: "#F63D18",
            color: "#FFFFFF",
            fontFamily: "var(--font-manrope)",
            fontSize: "12px",
            fontWeight: 700,
            borderRadius: "0px"
          }
        });
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => setFormState("idle"), 4000);
      } else {
        throw new Error("Failed to send");
      }
    } catch (error) {
      setFormState("idle");
      toast.error("System failure. Please try again or email directly.");
    }
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id.toLowerCase());
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const inputStyle = {
    width: "100%",
    background: "transparent",
    borderBottom: "2px solid rgba(26,24,20,0.15)",
    padding: "16px 0",
    fontSize: "18px",
    fontFamily: "var(--font-manrope)",
    fontWeight: 500,
    color: "#1A1814",
    outline: "none",
    transition: "border-color 0.4s ease",
  };

  const ctaText = "SEND MESSAGE";
  const hoverText = "LETS CONNECT";

  return (
    <section id="contact" className="bg-white flex flex-col pt-32">
      {/* Contact Header */}
      <div className="px-6 md:px-16 mb-24">
        {/* Accent Label */}
        <motion.p
          className="font-dm-mono text-portfolio-accent uppercase mb-6"
          style={{ fontSize: "11px", letterSpacing: "0.2em", fontWeight: 700 }}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          HAVE AN IDEA?? — LET&apos;S TALK
        </motion.p>

        <motion.h2 
          className="font-manrope font-black text-[12vw] leading-none tracking-[-0.05em] text-[#1A1814] uppercase"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          CONTACT
        </motion.h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mt-20">
          <div className="lg:col-span-5">
            <p className="font-manrope text-xl text-[#6B6560] leading-relaxed font-light max-w-md">
              I&apos;m currently available for freelance projects and full-time roles. If you&apos;re building something that needs to scale, let&apos;s talk.
            </p>
          </div>
          
          <div className="lg:col-span-7">
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex flex-col gap-12">
                <div className="group">
                  <label className="block font-manrope text-[10px] font-bold uppercase tracking-[0.2em] text-[#B8B3AC] transition-colors group-focus-within:text-portfolio-accent">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    style={inputStyle}
                    placeholder="Your name"
                    className="focus:border-portfolio-accent transition-colors"
                  />
                </div>
                <div className="group">
                  <label className="block font-manrope text-[10px] font-bold uppercase tracking-[0.2em] text-[#B8B3AC] transition-colors group-focus-within:text-portfolio-accent">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    style={inputStyle}
                    placeholder="your@email.com"
                    className="focus:border-portfolio-accent transition-colors"
                  />
                </div>
                <div className="group">
                  <label className="block font-manrope text-[10px] font-bold uppercase tracking-[0.2em] text-[#B8B3AC] transition-colors group-focus-within:text-portfolio-accent">Message</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    style={{ ...inputStyle, height: "100px", resize: "none" }}
                    placeholder="Tell me about your project..."
                    className="focus:border-portfolio-accent transition-colors"
                  />
                </div>

                {/* Hero-Style Staggered CTA - FIXED POSITIONING */}
                <motion.button
                  type="submit"
                  onMouseEnter={() => setBtnHover(true)}
                  onMouseLeave={() => setBtnHover(false)}
                  disabled={formState !== "idle"}
                  className="w-full h-16 bg-portfolio-accent relative overflow-hidden group border-none cursor-pointer"
                  style={{ willChange: "transform" }}
                >
                  <motion.div
                    className="absolute inset-0 bg-[#1A1814]"
                    initial={{ x: "-100%" }}
                    animate={btnHover ? { x: 0 } : { x: "-100%" }}
                    transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                  />

                  <AnimatePresence mode="wait">
                    {formState === "idle" ? (
                      <div className="relative flex items-center justify-center gap-4 w-full h-full z-10">
                        {/* Text Container */}
                        <div className="relative h-5 overflow-hidden">
                          {/* Layer 1: SEND MESSAGE */}
                          <div className="flex">
                            {ctaText.split("").map((char, i) => (
                              <motion.span
                                key={i}
                                className="font-manrope text-[14px] font-black uppercase tracking-widest text-white inline-block"
                                animate={btnHover ? { y: "-150%" } : { y: "0%" }}
                                transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1], delay: i * 0.02 }}
                              >
                                {char === " " ? "\u00A0" : char}
                              </motion.span>
                            ))}
                          </div>
                          
                          {/* Layer 2: LETS CONNECT TOGETHER (Now perfectly centered relative to text container) */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            {hoverText.split("").map((char, i) => (
                              <motion.span
                                key={i}
                                className="font-manrope text-[14px] font-black uppercase tracking-widest text-portfolio-accent inline-block"
                                initial={{ y: "150%" }}
                                animate={btnHover ? { y: "0%" } : { y: "150%" }}
                                transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1], delay: i * 0.02 }}
                              >
                                {char === " " ? "\u00A0" : char}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                        
                        {/* Staggered Arrow Animation - Always to the right of text */}
                        <div className="h-5 overflow-hidden relative w-5 flex-shrink-0">
                          <motion.div
                            animate={btnHover ? { y: "-150%", rotate: 45 } : { y: "0%", rotate: 0 }}
                            transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
                            className="text-white"
                          >
                            <ArrowUpRight size={18} strokeWidth={3} />
                          </motion.div>
                          <motion.div
                            className="absolute inset-0 text-portfolio-accent"
                            initial={{ y: "150%", rotate: 45 }}
                            animate={btnHover ? { y: "0%", rotate: 45 } : { y: "150%", rotate: 45 }}
                            transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
                          >
                            <ArrowUpRight size={18} strokeWidth={3} />
                          </motion.div>
                        </div>
                      </div>
                    ) : (
                      <motion.div
                        key={formState}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="relative z-10 flex items-center justify-center gap-3 text-white font-manrope font-black tracking-widest"
                      >
                        {formState === "sending" ? "INITIATING..." : "DIALOGUE OPENED ✓"}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </motion.form>
          </div>
        </div>
      </div>

      {/* NEW STUDIO FOOTER */}
      <footer className="bg-portfolio-accent text-white py-24 px-6 md:px-16 mt-20 relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start relative z-10">
          
          <div className="flex flex-col gap-16">
            <div className="space-y-4">
              <span className="block font-manrope text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Drop me a line</span>
              <a href="mailto:vikram517879@gmail.com" className="font-manrope text-[6vw] md:text-[3.5vw] font-black tracking-tighter hover:opacity-70 transition-opacity">
                vikram517879@gmail.com
              </a>
            </div>
            
            <div className="flex flex-col gap-6">
              <span className="block font-manrope text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Socials</span>
              <div className="flex flex-col items-start gap-4">
                <FooterLink title="LINKEDIN" href="https://www.linkedin.com/in/vsvikram18/" icon={Linkedin} />
                <FooterLink title="GITHUB" href="https://github.com/vikramvicky-1" icon={Github} />
                <FooterLink title="INSTAGRAM" href="https://www.instagram.com/__vikram.vicky__" icon={Instagram} />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:items-end gap-16">
            <div className="flex flex-col gap-6 md:items-end">
              <span className="block font-manrope text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Navigation</span>
              <div className="flex flex-col md:items-end gap-4">
                <FooterLink title="WORK" onClick={() => scrollTo("work")} />
                <FooterLink title="SKILLS" onClick={() => scrollTo("skills")} />
                <FooterLink title="ABOUT" onClick={() => scrollTo("about")} />
                <FooterLink title="CONTACT" onClick={() => scrollTo("contact")} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-40 pt-10 border-t border-white/10 flex items-end justify-between relative z-10">
          <motion.h2 
            className="font-manrope font-black text-[20vw] leading-[0.7] tracking-[-0.08em] opacity-10 pointer-events-none select-none absolute -bottom-[5vw] -left-[2vw]"
          >
            VIKRAM
          </motion.h2>
          
          <div className="ml-auto flex flex-col items-end gap-2">
             <span className="font-manrope text-[10px] font-black tracking-widest opacity-60 uppercase">© 2025 ALL RIGHTS RESERVED</span>
             <span className="font-manrope text-sm md:text-base font-black tracking-tighter">Vikram — Portfolio Edition 2.0</span>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-white opacity-[0.03] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      </footer>
    </section>
  );
}
