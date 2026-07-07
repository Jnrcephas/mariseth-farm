import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ReactNode } from "react";


export default function DropdownButton({ open, setOpen, title, icon, menuItems, className="w-[233px] px-6 py-8" }:
    {   open: boolean; 
        setOpen: (open: boolean) => void;
        title: string; 
        icon?: ReactNode;
        menuItems: ReactNode[];
        className?: string

    }) {
    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="default"
              className={`${className} h-[38px] justify-between bg-[#4A8D34] hover:bg-[#3f5e2e] text-white rounded-md  text-sm font-normal`}
            >
              <div className="flex items-center gap-x-2">
                {icon}
                {title}
              </div>
              <div className="border-r-1 divide-y md:divide-y-0 md:divide-x divide-white/50 text-[#4d7339]">.</div>
              <ChevronDown className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[233px] rounded-md mt-1 p-0 border-0 shadow-lg">
            {menuItems.map((item) =>(item))}
          </DropdownMenuContent>
        </DropdownMenu>
    )
}