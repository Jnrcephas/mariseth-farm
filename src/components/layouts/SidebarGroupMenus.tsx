"use client"
import { ReactNode } from "react";
import * as React from "react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function SidebarGroupMenus({children, menusData}:
    {
        children?: ReactNode; 
        menusData: {
            navMain: any[]
        }
    }
){
    const pathName = usePathname();
    const path = pathName?.split("/")

    return(
        <SidebarGroup>
            {children && 
            <SidebarGroupLabel className="text-muted-foreground mb- font-bold !text-[#4A8D34] ">
                {children}
            </SidebarGroupLabel>
        }
        <SidebarMenu className="px-2">
            {menusData?.navMain?.filter((item) => item?.hasAccess).map((item) => {
                // slug can be a single string (most items) or an array
                // (e.g. "HR Management" now covers the employee-management,
                // leave-management, AND training route folders, since those
                // 3 previously-separate sidebar items got merged into one).
                const slugs: string[] = Array.isArray(item?.slug) ? item.slug : [item?.slug]
                const isActive = slugs.some((slug) => path.includes(slug))
                return (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            className={`h-[38px] ${isActive && "font-bold !text-[#4A8D34] !bg-[#D1FAE5]"}`}
                            asChild
                            isActive={isActive}
                        >
                            <Link
                                href={item.url}
                                target={item?.blank ? "_blank" : "_self"}
                                prefetch={true}
                            >
                                {item.icon && <item.icon />}
                                <span className={`${isActive ? "font-semibold" : "font-medium"}`}>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                )
            })}
        </SidebarMenu>
        </SidebarGroup>
    )
}