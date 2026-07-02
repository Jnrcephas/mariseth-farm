"use client"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import LeadFarmers from "./LeadFarmers"
import SmallholderFarmers from "./SmallholderFarmers"
import { useState } from "react"
import { CirclePlus } from "lucide-react"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import DropdownButton from "@/components/customs/ButtonDropdown"
import { useRouter } from "next/navigation"
import { routeTo } from "@/lib/constants"
import { useHasAccess } from "@/hooks/auth/useHasAccess"
import { AuthorizeAndRenderPage } from "@/components/Unauthorized"

export function Farmers() {

  const {hasAccess: create_farmer} = useHasAccess("farmer|create_farmer")

  const router = useRouter()
  const [open, setOpen] = useState(false)

  return (
    <AuthorizeAndRenderPage permission={"farmer|list_farmers"}>
      <div className="flex justify-between">
        <div className="font-semibold text-black mb-10">
            Farmers
        </div>
        {create_farmer && 
          <DropdownButton 
            open={open} 
            setOpen={setOpen} 
            title="Register New Farmer" 
            icon={<CirclePlus/>}
            menuItems={[
              <DropdownMenuItem key="external-farm" onClick={() => router.push(routeTo.addLeadFarmer)} className="py-3 px-6 text-gray-700 text-sm font-normal hover:bg-gray-50 focus:bg-gray-50 cursor-pointer">
                Lead Farmers
              </DropdownMenuItem>,
              <DropdownMenuItem key="mariseth-farm" onClick={() => router.push(routeTo.addSmallholderFarmer)} className="py-3 px-6 text-gray-700 font-normal text-sm hover:bg-gray-50 focus:bg-gray-50 cursor-pointer">
                Smallholder Farmers
              </DropdownMenuItem>
            ]}
          />
        }
      </div>
      <Tabs defaultValue="1" className="w-full mx-auto">
        <TabsList className="grid w-[400px] grid-cols-2 mx-auto p- h-[36px] bg-[#F1F5F9] border ">
          <TabsTrigger className="h-[28px] cursor-pointer" value="1">Lead Farmers</TabsTrigger>
          <TabsTrigger className="h-[28px] cursor-pointer" value="2">Smallholder Farmers</TabsTrigger>
        </TabsList>
        <TabsContent value="1">
          <LeadFarmers/>
        </TabsContent>
        <TabsContent value="2">
          <SmallholderFarmers/>
        </TabsContent>
      </Tabs>
     
    </AuthorizeAndRenderPage>
  )
}
