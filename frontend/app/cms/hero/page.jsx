"use client"

import { useEffect } from "react"
import CMSLayout from "@/components/admin/CMSLayout"
import { useForm, useFieldArray } from "react-hook-form"
import { Save, Loader2, Sparkles } from "lucide-react"
import useContentStore from "@/store/useContentStore"
import { toast } from "react-hot-toast"

export default function HeroManagementPage() {
  const { content, fetchContent, updateContent, isLoading } = useContentStore()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isDirty }
  } = useForm({
    defaultValues: {
      hero: {
        stats: [
          { label: "Projects", value: "40+" },
          { label: "Years", value: "3+" },
          { label: "Load", value: "10K+" }
        ]
      }
    }
  })

  const { fields } = useFieldArray({
    control,
    name: "hero.stats"
  })

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  useEffect(() => {
    if (content) {
      reset(content)
    }
  }, [content, reset])

  const onSubmit = async (data) => {
    // We only send the stats now
    const result = await updateContent(data)
    if (result.success) {
      toast.success("Hero statistics updated successfully")
    } else {
      toast.error(result.message)
    }
  }

  return (
    <CMSLayout 
      title="Hero Impact Statistics" 
      subtitle="Manage the counter values and labels shown on your home page."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-8">
        {/* Stats Section */}
        <div className="bg-white border border-black/[0.05] rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="text-portfolio-accent" size={20} />
            <h2 className="font-dm-sans font-semibold text-[#1A1814] text-lg">Impact Statistics</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {fields.map((field, index) => (
              <div key={field.id} className="p-6 rounded-2xl bg-[#FAF8F4] border border-black/[0.03] space-y-4">
                <div className="space-y-1.5">
                  <label className="font-dm-sans text-[10px] uppercase tracking-[0.1em] text-[#B8B3AC] font-bold">Value</label>
                  <input
                    {...register(`hero.stats.${index}.value`)}
                    className="w-full bg-white border border-black/[0.05] rounded-xl px-4 py-2.5 font-playfair text-xl font-bold text-[#1A1814] focus:outline-none focus:border-portfolio-accent/40 transition-all"
                    placeholder="40+"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-dm-sans text-[10px] uppercase tracking-[0.1em] text-[#B8B3AC] font-bold">Label</label>
                  <input
                    {...register(`hero.stats.${index}.label`)}
                    className="w-full bg-white border border-black/[0.05] rounded-xl px-4 py-2.5 font-dm-sans text-sm text-[#1A1814] focus:outline-none focus:border-portfolio-accent/40 transition-all"
                    placeholder="Projects"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-end items-center gap-4 pt-8">
          {isDirty && (
            <button
              type="button"
              onClick={() => reset(content)}
              className="px-6 py-4 rounded-2xl font-dm-sans font-bold text-sm text-[#6B6560] hover:text-[#1A1814] hover:bg-black/[0.03] transition-all"
            >
              Discard Changes
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading || !isDirty}
            className="bg-portfolio-accent text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-dm-sans font-bold text-sm shadow-[0_12px_24px_rgba(45,90,61,0.25)] hover:bg-[#234730] disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98]"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Save size={20} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </CMSLayout>
  )
}
