"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  LayoutDashboard, 
  LogOut, 
  Briefcase, 
  User, 
  Layers,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Loader2,
  Sparkles,
  Mail
} from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import useAuthStore from "@/store/useAuthStore"
import useContentStore from "@/store/useContentStore"
import { toast } from "react-hot-toast"

export default function CMSLayout({ children, title, subtitle, actions, fullHeight = false }) {
  const router = useRouter()
  const pathname = usePathname()
  const { admin, logout, checkAuth, isLoading } = useAuthStore()
  const { fetchContacts, unreadCount } = useContentStore()
  
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    checkAuth()
    fetchContacts()
  }, [checkAuth, fetchContacts])

  useEffect(() => {
    if (!isLoading && !admin) {
      router.push("/cms/login")
    }
  }, [admin, isLoading, router])

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  const handleLogout = async () => {
    await logout()
    toast.success("Logged out successfully")
    router.push("/cms/login")
  }

  if (isLoading || !admin) {
    return (
      <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#2D5A3D]" size={40} />
      </div>
    )
  }

  const sidebarVariants = {
    expanded: { width: "260px" },
    collapsed: { width: "80px" }
  }

  const mobileSidebarVariants = {
    open: { x: 0 },
    closed: { x: "-100%" }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex overflow-hidden">
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[90] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop */}
      <motion.aside
        initial={false}
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        className="hidden lg:flex border-r border-black/[0.05] bg-white/80 backdrop-blur-xl flex-col p-4 sticky top-0 h-screen z-[100] transition-colors"
      >
        <div className="flex items-center justify-between mb-10 px-2 h-10 overflow-hidden">
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="flex items-center gap-3 whitespace-nowrap"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#2D5A3D]" />
              <span className="font-dm-mono text-xs tracking-widest uppercase text-[#1A1814] font-bold">CMS Admin</span>
            </motion.div>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-2 rounded-xl hover:bg-black/[0.03] text-[#B8B3AC] hover:text-[#1A1814] transition-all ${isCollapsed ? 'mx-auto' : ''}`}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarLink icon={<LayoutDashboard size={18} />} label="Overview" href="/cms" active={pathname === "/cms"} collapsed={isCollapsed} />
          <SidebarLink icon={<Mail size={18} />} label="Inbox" href="/cms/contacts" active={pathname === "/cms/contacts"} collapsed={isCollapsed} badge={unreadCount > 0} />
          <SidebarLink icon={<Sparkles size={18} />} label="Hero Section" href="/cms/hero" active={pathname === "/cms/hero"} collapsed={isCollapsed} />
          <SidebarLink icon={<Briefcase size={18} />} label="Projects" href="/cms/projects" active={pathname === "/cms/projects"} collapsed={isCollapsed} />
          <SidebarLink icon={<Layers size={18} />} label="Skills" href="/cms/skills" active={pathname === "/cms/skills"} collapsed={isCollapsed} />
          <SidebarLink icon={<User size={18} />} label="About" href="/cms/about" active={pathname === "/cms/about"} collapsed={isCollapsed} />
        </nav>

        <button 
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-3 text-[#6B6560] hover:text-red-500 transition-colors font-dm-sans text-sm w-full rounded-xl hover:bg-red-50/50 ${isCollapsed ? 'justify-center' : ''}`}
          title={isCollapsed ? "Sign Out" : ""}
        >
          <LogOut size={18} />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </motion.aside>

      {/* Sidebar - Mobile */}
      <motion.aside
        initial="closed"
        animate={isMobileOpen ? "open" : "closed"}
        variants={mobileSidebarVariants}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed inset-y-0 left-0 w-[280px] bg-white z-[100] p-6 shadow-2xl lg:hidden flex flex-col"
      >
        <div className="flex items-center justify-between mb-10 px-2">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#2D5A3D]" />
            <span className="font-dm-mono text-xs tracking-widest uppercase text-[#1A1814] font-bold">CMS Admin</span>
          </div>
          <button onClick={() => setIsMobileOpen(false)} className="p-2 -mr-2 text-[#B8B3AC]"><X size={20} /></button>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarLink icon={<LayoutDashboard size={18} />} label="Overview" href="/cms" active={pathname === "/cms"} />
          <SidebarLink icon={<Mail size={18} />} label="Inbox" href="/cms/contacts" active={pathname === "/cms/contacts"} badge={unreadCount > 0} />
          <SidebarLink icon={<Sparkles size={18} />} label="Hero Section" href="/cms/hero" active={pathname === "/cms/hero"} />
          <SidebarLink icon={<Briefcase size={18} />} label="Projects" href="/cms/projects" active={pathname === "/cms/projects"} />
          <SidebarLink icon={<Layers size={18} />} label="Skills" href="/cms/skills" active={pathname === "/cms/skills"} />
          <SidebarLink icon={<User size={18} />} label="About" href="/cms/about" active={pathname === "/cms/about"} />
        </nav>

        <button 
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-3 py-3 text-[#6B6560] hover:text-red-500 transition-colors font-dm-sans text-sm w-full"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </motion.aside>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 border-b border-black/[0.05] bg-white/50 backdrop-blur-xl lg:hidden flex items-center justify-between px-6 shrink-0 z-50">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#2D5A3D]" />
            <span className="font-dm-mono text-[10px] tracking-widest uppercase text-[#1A1814] font-bold">CMS</span>
          </div>
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="p-2 -mr-2 text-[#1A1814]"
          >
            <Menu size={20} />
          </button>
        </header>

        {/* Scrollable Content */}
        <main className={`flex-1 ${fullHeight ? 'overflow-hidden' : 'overflow-y-auto'} p-5 md:p-8 lg:p-10 scroll-smooth`}>
          <div className="w-full">
            {(title || subtitle) && (
              <header className="mb-6 lg:mb-8 flex items-start justify-between gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex-1 min-w-0"
                >
                  {title && <h1 className="font-playfair text-2xl md:text-3xl lg:text-4xl font-bold text-[#1A1814] leading-tight truncate">{title}</h1>}
                  {subtitle && <p className="hidden md:block font-dm-sans text-[#6B6560] font-light mt-1 text-sm md:text-base">{subtitle}</p>}
                </motion.div>
                {actions && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="shrink-0"
                  >
                    {actions}
                  </motion.div>
                )}
              </header>
            )}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}

function SidebarLink({ icon, label, href, active = false, collapsed = false, badge = false }) {
  return (
    <Link
      href={href}
      className={`relative flex items-center gap-3 px-3 py-3 rounded-xl font-dm-sans text-sm transition-all group ${
        active 
          ? "bg-[#2D5A3D] text-white shadow-lg shadow-[#2D5A3D]/20 font-semibold" 
          : "text-[#6B6560] hover:bg-black/[0.03] hover:text-[#1A1814]"
      } ${collapsed ? 'justify-center' : ''}`}
      title={collapsed ? label : ""}
    >
      <div className="shrink-0 relative">
        {icon}
        {badge && (
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
        )}
      </div>
      {!collapsed && (
        <span className="whitespace-nowrap overflow-hidden flex-1 flex justify-between items-center">
          {label}
          {badge && <div className="w-1.5 h-1.5 bg-red-500 rounded-full lg:hidden" />}
        </span>
      )}
      
      {collapsed && active && (
        <motion.div 
          layoutId="active-dot"
          className="absolute -right-1 w-1.5 h-1.5 rounded-full bg-[#2D5A3D]"
        />
      )}
    </Link>
  )
}
