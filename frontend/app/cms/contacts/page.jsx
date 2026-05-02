"use client"

import { useState, useEffect, useRef } from "react"
import CMSLayout from "@/components/admin/CMSLayout"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Mail, 
  Trash2, 
  CheckCircle2, 
  Search, 
  Clock, 
  User, 
  ChevronRight, 
  RotateCcw,
  MoreVertical,
  X,
  AlertCircle,
  Download
} from "lucide-react"
import useContentStore from "@/store/useContentStore"
import { format } from "date-fns"
import { toast } from "react-hot-toast"
import ConfirmationDialog from "@/components/admin/ConfirmationDialog"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export default function ContactsCMS() {
  const { contacts, fetchContacts, markAsRead, deleteContact, unreadCount, playSoundTrigger } = useContentStore()
  const [selectedId, setSelectedId] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null })
  const audioRef = useRef(null)

  useEffect(() => {
    fetchContacts()
  }, [fetchContacts])

  // Play notification sound when trigger changes
  useEffect(() => {
    if (playSoundTrigger > 0) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        const playPromise = audioRef.current.play()
        if (playPromise !== undefined) {
          playPromise.catch(e => {
            console.error("Audio playback failed:", e)
            toast.error("Audio blocked! Click anywhere on the page to enable sounds.")
          })
        }
      }
    }
  }, [playSoundTrigger])

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.message.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedContact = contacts.find(c => c._id === selectedId)

  const handleSelect = (id) => {
    setSelectedId(id)
    const contact = contacts.find(c => c._id === id)
    if (contact && !contact.isRead) {
      markAsRead(id)
    }
  }

  const confirmDelete = async () => {
    if (deleteDialog.id) {
      await deleteContact(deleteDialog.id)
      if (selectedId === deleteDialog.id) setSelectedId(null)
      toast.success("Message deleted")
      setDeleteDialog({ isOpen: false, id: null })
    }
  }

  const handleDelete = (e, id) => {
    e.stopPropagation()
    setDeleteDialog({ isOpen: true, id })
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    
    // Add Header
    doc.setFontSize(20)
    doc.text("Portfolio Contact Requests", 14, 22)
    doc.setFontSize(11)
    doc.setTextColor(100)
    doc.text(`Generated on: ${format(new Date(), 'PPpp')}`, 14, 30)
    
    // Prepare Data
    const tableData = contacts.map((c, index) => [
      index + 1,
      c.name,
      c.email,
      c.message,
      format(new Date(c.createdAt), 'MMM dd, yyyy')
    ])

    // Generate Table
    autoTable(doc, {
      startY: 40,
      head: [['#', 'Name', 'Email', 'Message', 'Date']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillStyle: 'fill', fillColor: [45, 90, 61], textColor: [255, 255, 255] },
      columnStyles: {
        3: { cellWidth: 80 }, // Message column width
      }
    })

    doc.save(`contacts-export-${format(new Date(), 'yyyy-MM-dd')}.pdf`)
    toast.success("PDF Exported Successfully")
  }

  return (
    <CMSLayout 
      title={
        <span className="flex items-center gap-2">
          Inbox
          {unreadCount > 0 && (
            <span className="md:hidden text-[#2D5A3D] text-lg font-dm-sans font-medium">({unreadCount})</span>
          )}
        </span>
      }
      subtitle={`You have ${unreadCount} unread messages.`}
      fullHeight={true}
      actions={
        <button 
          onClick={exportToPDF}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-black/[0.05] text-[#2D5A3D] hover:bg-[#2D5A3D] hover:text-white hover:border-[#2D5A3D] shadow-sm transition-all font-dm-sans text-xs font-bold group"
        >
          <Download size={14} className="group-hover:scale-110 transition-transform" />
          Export PDF
        </button>
      }
    >
      {/* Notification Sound - User Provided Local WAV */}
      <audio 
        ref={audioRef} 
        src="/sounds/notification.wav" 
        preload="auto" 
      />

      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-170px)]">
        
        {/* Left: Message List (Gmail Style) */}
        <div className={`lg:w-[400px] flex flex-col bg-white rounded-[32px] border border-black/[0.05] shadow-sm overflow-hidden ${selectedId ? 'hidden lg:flex' : 'flex'}`}>
          {/* List Header/Search */}
          <div className="p-4 border-b border-black/[0.05] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-dm-sans font-bold text-sm text-[#1A1814]">Messages</h3>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8B3AC]" size={16} />
              <input 
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FAF8F4] border-none rounded-2xl pl-10 pr-4 py-3 font-dm-sans text-sm focus:ring-2 focus:ring-[#2D5A3D]/10 outline-none transition-all"
              />
            </div>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredContacts.map((contact) => (
              <div 
                key={contact._id}
                onClick={() => handleSelect(contact._id)}
                className={`flex items-start gap-4 p-5 cursor-pointer transition-all border-b border-black/[0.02] relative hover:bg-[#FAF8F4] ${selectedId === contact._id ? 'bg-[#FAF8F4] shadow-inner' : ''} ${!contact.isRead ? 'font-bold' : ''}`}
              >
                {!contact.isRead && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#2D5A3D] rounded-r-full" />
                )}
                
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${!contact.isRead ? 'bg-[#2D5A3D] text-white' : 'bg-[#FAF8F4] text-[#6B6560]'}`}>
                  {contact.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-dm-sans text-sm text-[#1A1814] truncate">{contact.name}</span>
                    <span className="font-dm-mono text-[9px] text-[#B8B3AC] uppercase tracking-tighter">
                      {format(new Date(contact.createdAt), 'MMM dd')}
                    </span>
                  </div>
                  <p className="font-dm-sans text-xs text-[#6B6560] truncate pr-4">
                    {contact.message}
                  </p>
                </div>
              </div>
            ))}

            {filteredContacts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 px-10 text-center opacity-40">
                <Mail size={40} className="mb-4 text-[#B8B3AC]" />
                <p className="font-dm-sans text-sm">No messages found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Message Detail */}
        <div className={`flex-1 bg-white rounded-[32px] border border-black/[0.05] shadow-sm flex flex-col overflow-hidden relative ${selectedId ? 'flex' : 'hidden lg:flex'}`}>
          <AnimatePresence mode="wait">
            {selectedContact ? (
              <motion.div 
                key={selectedContact._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col h-full"
              >
                {/* Detail Header */}
                <div className="p-4 lg:p-6 border-b border-black/[0.05] flex justify-between items-center">
                  <div className="flex items-center gap-2 lg:gap-4">
                    {/* Back Button for Mobile */}
                    <button 
                      onClick={() => setSelectedId(null)}
                      className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-[#FAF8F4] text-[#B8B3AC]"
                    >
                      <ChevronRight className="rotate-180" size={24} />
                    </button>
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-[#FAF8F4] flex items-center justify-center text-[#2D5A3D]">
                      <User size={20} className="lg:hidden" />
                      <User size={24} className="hidden lg:block" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-playfair text-lg lg:text-xl font-bold text-[#1A1814] truncate">{selectedContact.name}</h3>
                      <p className="font-dm-mono text-[10px] lg:text-xs text-[#2D5A3D] truncate">{selectedContact.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 lg:gap-3">
                    <button 
                      onClick={(e) => handleDelete(e, selectedContact._id)}
                      className="p-2 lg:p-3 rounded-2xl hover:bg-red-50 text-red-400 transition-all"
                      title="Delete message"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Detail Content */}
                <div className="flex-1 p-6 lg:p-8 overflow-y-auto custom-scrollbar">
                  <div className="flex items-center gap-2 mb-6 lg:mb-8 text-[#B8B3AC]">
                    <Clock size={14} />
                    <span className="font-dm-sans text-[10px] lg:text-xs">
                      Received on {format(new Date(selectedContact.createdAt), 'MMM dd, yyyy p')}
                    </span>
                  </div>
                  
                  <div className="prose prose-sm max-w-none">
                    <div className="font-dm-sans text-sm lg:text-base text-[#1A1814] leading-relaxed whitespace-pre-wrap bg-[#FAF8F4] p-6 lg:p-8 rounded-3xl border border-black/[0.02]">
                      {selectedContact.message}
                    </div>
                  </div>
                </div>

                {/* Quick Reply (Dummy for UX) */}
                <div className="p-4 lg:p-6 border-t border-black/[0.05] bg-[#FAF8F4]/50">
                  <div className="flex gap-4">
                    <a 
                      href={`mailto:${selectedContact.email}`}
                      className="flex-1 lg:flex-none justify-center bg-[#2D5A3D] text-white px-8 py-4 rounded-2xl font-dm-sans font-bold text-sm hover:bg-[#1A1814] transition-all flex items-center gap-3"
                    >
                      <RotateCcw size={18} />
                      Reply
                    </a>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-30">
                <div className="w-24 h-24 rounded-[40px] bg-[#FAF8F4] flex items-center justify-center text-[#2D5A3D] mb-6">
                  <Mail size={48} />
                </div>
                <h3 className="font-playfair text-2xl font-bold mb-2">Select a message</h3>
                <p className="font-dm-sans text-base">Choose an item from the list to view its contents.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

      <ConfirmationDialog 
        isOpen={deleteDialog.isOpen}
        onOpenChange={(open) => setDeleteDialog(prev => ({ ...prev, isOpen: open }))}
        onConfirm={confirmDelete}
        title="Delete Message?"
        description="This will permanently remove this message from your inbox. This action cannot be undone."
      />

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0,0,0,0.1);
        }
      `}</style>
    </CMSLayout>
  )
}
