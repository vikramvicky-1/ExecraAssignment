"use client"

import * as AlertDialog from "@radix-ui/react-alert-dialog"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, Trash2 } from "lucide-react"

export default function ConfirmationDialog({ 
  isOpen, 
  onOpenChange, 
  onConfirm, 
  title = "Are you sure?", 
  description = "This action cannot be undone. This will permanently delete the item.",
  confirmText = "Delete",
  cancelText = "Cancel"
}) {
  return (
    <AlertDialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialog.Portal forceMount>
        <AnimatePresence>
          {isOpen && (
            <>
              <AlertDialog.Overlay forceMount>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-[#1A1814]/40 backdrop-blur-sm z-[300]"
                />
              </AlertDialog.Overlay>
              <AlertDialog.Content forceMount>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-md bg-white rounded-[32px] p-8 shadow-2xl z-[301] border border-black/[0.05] focus:outline-none"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 mb-6">
                      <AlertCircle size={32} />
                    </div>
                    
                    <AlertDialog.Title className="font-playfair text-2xl font-bold text-[#1A1814] mb-3">
                      {title}
                    </AlertDialog.Title>
                    
                    <AlertDialog.Description className="font-dm-sans text-[#6B6560] text-sm leading-relaxed mb-10">
                      {description}
                    </AlertDialog.Description>
                    
                    <div className="flex gap-4 w-full">
                      <AlertDialog.Cancel asChild>
                        <button className="flex-1 px-6 py-4 rounded-2xl font-dm-sans font-bold text-sm text-[#6B6560] hover:bg-[#FAF8F4] transition-all">
                          {cancelText}
                        </button>
                      </AlertDialog.Cancel>
                      <AlertDialog.Action asChild>
                        <button 
                          onClick={onConfirm}
                          className="flex-1 bg-red-500 text-white px-6 py-4 rounded-2xl font-dm-sans font-bold text-sm hover:bg-red-600 shadow-xl shadow-red-500/20 transition-all flex items-center justify-center gap-2"
                        >
                          <Trash2 size={18} />
                          {confirmText}
                        </button>
                      </AlertDialog.Action>
                    </div>
                  </div>
                </motion.div>
              </AlertDialog.Content>
            </>
          )}
        </AnimatePresence>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}
