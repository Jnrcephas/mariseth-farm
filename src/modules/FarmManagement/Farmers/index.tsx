"use client"
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
import { cn } from "@/lib/utils"

type FarmerTab = "lead" | "smallholder"

const FARMER_TABS: { key: FarmerTab; label: string }[] = [
  { key: "lead", label: "Lead Farmers" },
  { key: "smallholder", label: "Smallholder Farmers" },
]

export function Farmers() {
  const { hasAccess: create_farmer } = useHasAccess("farmer|create_farmer")

  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<FarmerTab>("lead")

  return (
    <AuthorizeAndRenderPage permission={"farmer|list_farmers"}>
      <div className="font-bold text-xl text-black mb-4">Farmers</div>

      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-3">
          {FARMER_TABS.map((tab) => (
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

        {create_farmer && (
          <DropdownButton
            open={open}
            setOpen={setOpen}
            title="Register New Farmer"
            icon={<CirclePlus />}
            menuItems={[
              <DropdownMenuItem
                key="external-farm"
                onClick={() => router.push(routeTo.addLeadFarmer)}
                className="py-3 px-6 text-gray-700 text-sm font-normal hover:bg-gray-50 focus:bg-gray-50 cursor-pointer"
              >
                Lead Farmers
              </DropdownMenuItem>,
              <DropdownMenuItem
                key="mariseth-farm"
                onClick={() => router.push(routeTo.addSmallholderFarmer)}
                className="py-3 px-6 text-gray-700 font-normal text-sm hover:bg-gray-50 focus:bg-gray-50 cursor-pointer"
              >
                Smallholder Farmers
              </DropdownMenuItem>,
            ]}
          />
        )}
      </div>

      {activeTab === "lead" ? <LeadFarmers /> : <SmallholderFarmers />}
    </AuthorizeAndRenderPage>
  )
}