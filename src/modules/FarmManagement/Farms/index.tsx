"use client"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import ExternalFarms from "./ExternalFarms"
import MarisethFarms from "./MarisethFarms"
import { useState } from "react"
import { CirclePlus } from "lucide-react"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import DropdownButton from "@/components/customs/ButtonDropdown"
import AddExternalFarmModal from "./Modals/AddExternalFarm"
import AddMerisethFarmModal from "./Modals/AddMerisethFarm"
import { AuthorizeAndRenderPage } from "@/components/Unauthorized"
import { useHasAccess } from "@/hooks/auth/useHasAccess"

export function Farms() {
  const {hasAccess: create_farm} = useHasAccess("farm|create_farm")

  const [open, setOpen] = useState(false)
  const [addExternalFarmModal, setAddExternalFarmModal] = useState(false)
  const [addMarisethFarmModal, setAddMarisethFarmModal] = useState(false)

  function handleAddExternalFarm(){
    setOpen(false)
    setAddExternalFarmModal(true)
  }
  function handleAddMarisethFarm(){
    setOpen(false)
    setAddMarisethFarmModal(true)
  }
  


  return (
    <AuthorizeAndRenderPage permission={"farm|list_farms"}>
      <div className="flex justify-between">
        <div className="font-semibold text-black mb-10">
            Farms
        </div>
        {create_farm &&
          <DropdownButton 
            open={open} 
            setOpen={setOpen} 
            title="Register New Farm" 
            icon={<CirclePlus/>}
            menuItems={[
              <DropdownMenuItem key="external-farm" onClick={handleAddExternalFarm} className="py-3 px-6 text-gray-700 text-sm font-normal hover:bg-gray-50 focus:bg-gray-50 cursor-pointer">
                External Farm
              </DropdownMenuItem>,
              <DropdownMenuItem key="mariseth-farm" onClick={handleAddMarisethFarm} className="py-3 px-6 text-gray-700 font-normal text-sm hover:bg-gray-50 focus:bg-gray-50 cursor-pointer">
                Mariseth Nucleus Farm
              </DropdownMenuItem>
            ]}
        />}
      </div>
      <Tabs defaultValue="1" className="w-full mx-auto">
        <TabsList className="grid w-[400px] grid-cols-2 mx-auto p- h-[36px] bg-[#F1F5F9] border ">
          <TabsTrigger className="h-[28px] cursor-pointer" value="1">External Farms</TabsTrigger>
          <TabsTrigger className="h-[28px] cursor-pointer" value="2">Mariseth Nucleus Farms</TabsTrigger>
        </TabsList>
        <TabsContent value="1">
          <ExternalFarms/>
        </TabsContent>
        <TabsContent value="2">
          <MarisethFarms/>
        </TabsContent>
      </Tabs>
      {addExternalFarmModal &&
          <AddExternalFarmModal
            open={addExternalFarmModal} 
            setOpen={setAddExternalFarmModal}
          />
      }
      {addMarisethFarmModal && 
        <AddMerisethFarmModal
          open={addMarisethFarmModal} 
          setOpen={setAddMarisethFarmModal}
        />
      }
    </AuthorizeAndRenderPage>
  )
}
