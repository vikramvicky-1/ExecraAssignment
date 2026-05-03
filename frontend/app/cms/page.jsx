"use client"

import { useEffect } from "react"
import Link from "next/link"
import CMSLayout from "@/components/admin/CMSLayout"
import useProjectStore from "@/store/useProjectStore"
import useContentStore from "@/store/useContentStore"

export default function CMSDashboard() {
  const { projects, fetchProjects } = useProjectStore()
  const { content, fetchContent, contacts, fetchContacts, unreadCount } = useContentStore()

  useEffect(() => {
    fetchProjects()
    fetchContent()
    fetchContacts()
  }, [fetchProjects, fetchContent, fetchContacts])

  const totalProjects = projects.length
  const activeSkillsCount = (content?.skills?.major?.length || 0) + 
                            (content?.skills?.minor?.length || 0) + 
                            (content?.skills?.exploring?.length || 0)
  const totalContacts = contacts.length

  return (
    <CMSLayout 
      title="Dashboard Overview" 
      subtitle="Welcome back, Vikram."
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard 
          label="Total Projects" 
          value={totalProjects} 
          change="+2 this month" 
          href="/cms/projects"
        />
        <StatCard 
          label="Active Skills" 
          value={activeSkillsCount} 
          change="Core tech stack" 
          href="/cms/skills"
        />
        <StatCard 
          label="Contact Requests" 
          value={totalContacts} 
          change={`${unreadCount} unread`} 
          href="/cms/contacts"
        />
      </div>
    </CMSLayout>
  )
}

function StatCard({ label, value, change, href }) {
  return (
    <Link href={href} className="block group">
      <div className="bg-white border border-black/[0.05] rounded-3xl p-8 shadow-sm hover:shadow-md transition-all hover:border-portfolio-accent/20 active:scale-[0.98]">
        <p className="font-dm-mono text-[11px] uppercase tracking-[0.2em] text-[#B8B3AC] font-bold mb-3 group-hover:text-portfolio-accent transition-colors">{label}</p>
        <div className="flex items-baseline gap-4">
          <h3 className="font-playfair text-4xl font-black text-[#1A1814]">{value}</h3>
          <span className="font-dm-sans text-xs font-medium text-portfolio-accent bg-portfolio-accent/5 px-2 py-0.5 rounded-full">{change}</span>
        </div>
      </div>
    </Link>
  )
}
