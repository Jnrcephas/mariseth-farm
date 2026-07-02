"use client"
import { ReactNode } from "react";
import * as React from "react"
import { ChevronRight } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupContent,
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
        {menusData?.navMain?.map((item) => (
            <Collapsible
              key={item.title}
              title={item.title}
              className="group/collapsible px-2"
            >
              {item?.hasAccess &&
              <SidebarGroup>
                <SidebarGroupLabel
                  asChild
                  className="!px-0 group/label text-sm text-slate-500 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <CollapsibleTrigger className={`${item?.hasAccess ? "cursor-pointer" : "!cursor-not-allowed !opacity-50 disabled"} `}>
                      
                      <SidebarMenuButton
                          className={`${item?.hasAccess ? "cursor-pointer" : "!cursor-not-allowed !opacity-50 disabled"} h-[38px] flex flex-row ${path.includes(item?.slug) && `font-bold !text-[#4A8D34] ${!item?.items && "!bg-[#D1FAE5]"}`}`}
                          asChild
                          isActive={path.includes(item?.slug)}
                      >
                          {item?.items ? 
                              <div className={`flex px-2 ${item?.hasAccess ? "cursor-pointer" : "!cursor-not-allowed !opacity-50 disabled"}`}>
                                  {item.icon && <item.icon />}
                                  <span className={`${path.includes(item?.slug) ? "font-semibold" : "font-medium"}`}>{item.title}</span>{" "}
                                  {item?.items && 
                                      <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                                  }
                              </div>
                          :
                              <Link
                                  className={`${item?.hasAccess ? "cursor-pointer" : "!cursor-not-allowed !opacity-50 disabled"}`}
                                  href={item?.hasAccess ? item.url : "#"}
                                  target={item?.blank ? "_blank" : "_self"}
                                  prefetch={true}
                              >
                                  {item.icon && <item.icon />}
                                  <span className={`${path.includes(item?.slug) ? "font-semibold" : "font-medium"}`}>{item.title}</span>
                              </Link>
                          }
                      </SidebarMenuButton>
                      
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                {item?.items && 
                  <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu className="px-5 mt-2">
                      {item?.items?.map((item: any, idx: number) => (
                        <SidebarMenuItem key={idx} className={`${item?.hasAccess ? "cursor-pointer" : "!cursor-not-allowed !opacity-50 disabled"}`}>
                          <SidebarMenuButton asChild isActive={pathName === item.url}
                            className={`${item?.hasAccess ? "cursor-pointer" : "!cursor-not-allowed !opacity-50 disabled"} h-[38px] ${pathName === item.url && "!font-semibold !bg-[#D1FAE5] !text-[#4A8D34]"}`}>
                            <Link className="px-3" href={item?.hasAccess ? item.url : "#"}>{item.title}</Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                  </CollapsibleContent>
                  }
              </SidebarGroup>}
            </Collapsible>
          ))}
        </SidebarGroup>
    )
}