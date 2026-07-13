"use client"
import { useState } from "react"
import { Maximize2, Minimize2 } from "lucide-react"

export default function FullscreenMapPanel({
  title,
  children,
}: {
  title: string
  children: (isFullscreen: boolean) => React.ReactNode
}) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        {children(true)}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-30">
          <span className="text-sm font-semibold text-white bg-black/50 rounded-sm px-3 py-1.5">{title}</span>
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            className="flex items-center gap-1.5 text-sm font-medium text-white bg-black/50 rounded-sm px-3 py-1.5 cursor-pointer hover:bg-black/70 transition-colors"
          >
            <Minimize2 className="h-4 w-4" />
            Exit Full Screen
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-black">{title}</span>
        <button
          type="button"
          onClick={() => setIsFullscreen(true)}
          className="flex items-center gap-1.5 text-sm font-medium text-[#4A8D34] border border-[#4A8D34] rounded-sm px-3 py-1.5 cursor-pointer hover:bg-[#F0FDF4] transition-colors"
        >
          <Maximize2 className="h-4 w-4" />
          Full Screen
        </button>
      </div>
      {children(false)}
    </div>
  )
}