"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/lib/utils"
import { Loader } from "lucide-react"

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "text-[#334155] flex items-center gap-2 text-sm leading-none font-normal select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

function TextLabel({title, subTitle, variant="primary"}:{title: string, subTitle: React.ReactNode | string | null | undefined; variant?: "dark" | "primary"}) {
  return (
      <div className="flex flex-col">
          <Label className={`${variant === "primary" ? "text-[#4A8D34]" : "text-[#677788]"} text-xs font-normal`}>{title}</Label>
          <Label className={`text-[#64748B] text-sm font-medium mt-1 ${["email", "Material Url"].includes(title?.toLowerCase()) && "capitalize"}`}>{subTitle || "-"}</Label>
      </div>
  )

}

function LoadingLabel({isLoading, children}:{isLoading:boolean, children: React.ReactNode}){
  return(
    <div className="flex justify-center">
      {isLoading ?
        <div className="flex items-center justify-center">
          Loading
          <Loader className="animate-spin"/>
        </div>:
        <span className="flex items-center justify-center">{children}</span>
      }
    </div>
  )
}

export { Label, TextLabel, LoadingLabel }
