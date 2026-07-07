"use client"
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
import { cn } from "@/lib/utils"

type FarmTab = "external" | "mariseth"

const FARM_TABS: { key: FarmTab; label: string }[] = [
  { key: "external", label: "External Farms" },
  { key: "mariseth", label: "Mariseth Nucleus Farms" },
]

export function Farms() {
  const { hasAccess: create_farm } = useHasAccess("farm|create_farm")

  const [open, setOpen] = useState(false)
  const [addExternalFarmModal, setAddExternalFarmModal] = useState(false)
  const [addMarisethFarmModal, setAddMarisethFarmModal] = useState(false)
  const [activeTab, setActiveTab] = useState<FarmTab>("external")

  function handleAddExternalFarm() {
    setOpen(false)
    setAddExternalFarmModal(true)
  }
  function handleAddMarisethFarm() {
    setOpen(false)
    setAddMarisethFarmModal(true)
  }

  return (
    <AuthorizeAndRenderPage permission={"farm|list_farms"}>
      <div className="font-bold text-xl text-black mb-4">Farms</div>

      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-3">
          {FARM_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "rounded-sm px-6 py-4 text-base font-bold transition-colors cursor-pointer",
                activeTab === tab.key
                  ? "bg-[#4A8D34] text-white"
                  : "bg-[#E2E8F0] text-[#64748B] hover:bg-[#CBD5E1]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {create_farm && (
          <DropdownButton
            open={open}
            setOpen={setOpen}
            title="Register New Farm"
            icon={<CirclePlus />}
            menuItems={[
              <DropdownMenuItem
                key="external-farm"
                onClick={handleAddExternalFarm}
                className="py-3 px-6 text-gray-700 text-sm font-normal hover:bg-gray-50 focus:bg-gray-50 cursor-pointer"
              >
                External Farm
              </DropdownMenuItem>,
              <DropdownMenuItem
                key="mariseth-farm"
                onClick={handleAddMarisethFarm}
                className="py-3 px-6 text-gray-700 font-normal text-sm hover:bg-gray-50 focus:bg-gray-50 cursor-pointer"
              >
                Mariseth Nucleus Farm
              </DropdownMenuItem>,
            ]}
          />
        )}
      </div>

      {activeTab === "external" ? <ExternalFarms /> : <MarisethFarms />}

      {addExternalFarmModal && (
        <AddExternalFarmModal open={addExternalFarmModal} setOpen={setAddExternalFarmModal} />
      )}
      {addMarisethFarmModal && (
        <AddMerisethFarmModal open={addMarisethFarmModal} setOpen={setAddMarisethFarmModal} />
      )}
    </AuthorizeAndRenderPage>
  )
}