"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Lock, Mail, ArrowRight, Loader2, ShieldCheck, Eye, EyeOff } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import useAuthStore from "@/store/useAuthStore"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
})

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading, admin } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema)
  })

  useEffect(() => {
    if (admin) {
      router.push("/cms")
    }
  }, [admin, router])

  const onSubmit = async (data) => {
    const result = await login(data.email, data.password)
    if (result.success) {
      toast.success("Welcome back, Vikram!")
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-portfolio-accent/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-portfolio-accent/5 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="bg-white rounded-[32px] shadow-[0_32px_80px_rgba(26,24,20,0.08)] border border-black/[0.03] p-10 md:p-12">
          <div className="flex flex-col items-center mb-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 rounded-2xl bg-portfolio-accent flex items-center justify-center shadow-[0_12px_24px_rgba(45,90,61,0.25)] mb-6"
            >
              <span className="font-playfair text-white text-3xl font-bold italic tracking-tighter">V</span>
            </motion.div>
            
            <h1 className="font-playfair text-3xl font-bold text-[#1A1814] mb-2">Welcome Back</h1>
            <p className="font-dm-sans text-[#6B6560] text-sm font-light">Access the portfolio command center</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-dm-sans text-[11px] uppercase tracking-widest text-[#1A1814] font-semibold ml-1">Account Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#B8B3AC] group-focus-within:text-portfolio-accent transition-colors">
                    <Mail size={16} strokeWidth={1.5} />
                  </div>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="name@example.com"
                    className={`w-full bg-[#F9F9F8] border ${errors.email ? 'border-red-400' : 'border-black/[0.1]'} rounded-2xl py-4 pl-11 pr-4 font-dm-sans text-sm text-[#1A1814] focus:outline-none focus:bg-white focus:border-portfolio-accent/40 focus:ring-[4px] focus:ring-[#2D5A3D]/5 transition-all placeholder:text-[#B8B3AC]`}
                  />
                </div>
                {errors.email && <p className="text-[10px] text-red-500 font-dm-mono mt-1 ml-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="font-dm-sans text-[11px] uppercase tracking-widest text-[#1A1814] font-semibold ml-1">Secret Key</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#B8B3AC] group-focus-within:text-portfolio-accent transition-colors">
                    <Lock size={16} strokeWidth={1.5} />
                  </div>
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`w-full bg-[#F9F9F8] border ${errors.password ? 'border-red-400' : 'border-black/[0.1]'} rounded-2xl py-4 pl-11 pr-12 font-dm-sans text-sm text-[#1A1814] focus:outline-none focus:bg-white focus:border-portfolio-accent/40 focus:ring-[4px] focus:ring-[#2D5A3D]/5 transition-all placeholder:text-[#B8B3AC]`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#B8B3AC] hover:text-portfolio-accent transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-[10px] text-red-500 font-dm-mono mt-1 ml-1">{errors.password.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-portfolio-accent text-white rounded-2xl py-4 font-dm-sans font-bold text-base flex items-center justify-center gap-2 hover:bg-[#234730] shadow-[0_8px_20px_rgba(45,90,61,0.25)] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group mt-2"
            >
              {isLoading ? (
                <Loader2 className="animate-spin text-white" size={20} />
              ) : (
                <span className="flex items-center gap-2">
                  Enter Dashboard
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-10 flex items-center justify-center gap-2 text-ink-light">
            <ShieldCheck size={14} />
            <span className="font-dm-mono text-[9px] uppercase tracking-[0.2em]">End-to-End Secure Session</span>
          </div>
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 font-dm-sans text-[12px] text-ink-light"
        >
          Not an admin? <a href="/" className="text-portfolio-accent hover:underline">Return to Portfolio</a>
        </motion.p>
      </motion.div>
    </div>
  )
}
