"use client"

import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { ChevronDown, CirclePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useHasAccess } from "@/hooks/auth/useHasAccess"
import type { FullFarm } from "@/apis/adminApiSchemas"
import AddExternalFarmModal from "../Farms/Modals/AddExternalFarm"
import AddMerisethFarmModal from "../Farms/Modals/AddMerisethFarm"

type Props = {
  /** Called with the farm that was just created, so the parent form can
   * select it (set the `farm` field and show its name). */
  onFarmCreated: (farm: FullFarm) => void
}

/**
 * "Create Farm" shortcut shown under the farm picker on the farmer forms.
 *
 * Opens the normal farm registration modal on top of the farmer form (the form
 * state is untouched because nothing navigates away). When the farm is saved,
 * the modal closes, the farm lists are refreshed and `onFarmCreated` lets the
 * parent auto-select the new farm so the user can carry on registering the
 * farmer.
 *
 * Farms come in two kinds (external / Mariseth nucleus) so the button offers
 * the same two choices as the Farms page.
 */
export function CreateFarmInline({ onFarmCreated }: Props) {
  const { hasAccess: canCreateFarm } = useHasAccess("farm|create_farm")
  const queryClient = useQueryClient()

  const [menuOpen, setMenuOpen] = useState(false)
  const [externalOpen, setExternalOpen] = useState(false)
  const [marisethOpen, setMarisethOpen] = useState(false)

  if (!canCreateFarm) return null

  // Refresh every farm list/search so the new farm is also in the dropdown.
  // Query keys look like ["farm-management", "farm", {...params}] so this
  // partial match covers all of them.
  const refreshFarms = () =>
    queryClient.invalidateQueries({ queryKey: ["farm-management", "farm"] })

  return (
    // The farm modals contain their own <form>. React synthetic events bubble
    // through portals to the *React* parent, so without this a submit inside
    // the modal would also submit the farmer form that wraps this component.
    <div onSubmit={(e) => e.stopPropagation()}>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-auto px-0 py-1 text-[#16A34A] hover:text-[#15803D] hover:bg-transparent cursor-pointer"
          >
            <CirclePlus className="size-4" />
            Can&apos;t find the farm? Create Farm
            <ChevronDown className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="rounded-md p-0 shadow-lg">
          <DropdownMenuItem
            className="py-3 px-6 text-sm cursor-pointer"
            onClick={() => setExternalOpen(true)}
          >
            External Farm
          </DropdownMenuItem>
          <DropdownMenuItem
            className="py-3 px-6 text-sm cursor-pointer"
            onClick={() => setMarisethOpen(true)}
          >
            Mariseth Nucleus Farm
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {externalOpen && (
        <AddExternalFarmModal
          open={externalOpen}
          setOpen={setExternalOpen}
          refetch={refreshFarms}
          onCreated={onFarmCreated}
        />
      )}
      {marisethOpen && (
        <AddMerisethFarmModal
          open={marisethOpen}
          setOpen={setMarisethOpen}
          refetch={refreshFarms}
          onCreated={onFarmCreated}
        />
      )}
    </div>
  )
}
