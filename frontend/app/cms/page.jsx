"use client"

import CMSLayout from "@/components/admin/CMSLayout"
import { ChevronRight, PlusCircle } from "lucide-react"

export default function CMSDashboard() {
  return (
    <CMSLayout 
      title="Dashboard Overview" 
      subtitle="Welcome back, Vikram."
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard label="Total Projects" value="12" change="+2 this month" />
        <StatCard label="Active Skills" value="28" change="Core tech stack" />
        <StatCard label="Contact Requests" value="4" change="2 pending review" />
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-black/[0.05] rounded-3xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-dm-sans font-semibold text-[#1A1814] text-lg">Recent Projects</h2>
          <button className="text-[#2D5A3D] text-[11px] font-dm-mono uppercase tracking-[0.2em] font-bold hover:underline">View All</button>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-5 rounded-2xl hover:bg-[#FAF8F4] transition-all border border-transparent hover:border-black/[0.03] group cursor-pointer">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-black/[0.03] flex items-center justify-center font-playfair font-black text-xl text-[#1A1814] group-hover:bg-white group-hover:shadow-md transition-all">P{i}</div>
                <div>
                  <h3 className="font-dm-sans text-base font-semibold text-[#1A1814]">Project Title {i}</h3>
                  <p className="font-dm-mono text-[11px] text-[#B8B3AC] uppercase tracking-wider mt-0.5">Last updated 2 days ago</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full border border-black/[0.05] flex items-center justify-center group-hover:bg-[#2D5A3D] group-hover:border-[#2D5A3D] transition-all">
                <ChevronRight size={18} className="text-[#B8B3AC] group-hover:text-white transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </CMSLayout>
  )
}

function StatCard({ label, value, change }) {
  return (
    <div className="bg-white border border-black/[0.05] rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
      <p className="font-dm-mono text-[11px] uppercase tracking-[0.2em] text-[#B8B3AC] font-bold mb-3">{label}</p>
      <div className="flex items-baseline gap-4">
        <h3 className="font-playfair text-4xl font-black text-[#1A1814]">{value}</h3>
        <span className="font-dm-sans text-xs font-medium text-[#2D5A3D] bg-[#2D5A3D]/5 px-2 py-0.5 rounded-full">{change}</span>
      </div>
    </div>
  )
}
