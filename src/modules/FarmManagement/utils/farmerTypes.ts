import { routeTo } from "@/lib/constants"

/**
 * Single source of truth for the farmer classifications.
 * Adding another classification? Add it here first, then follow the compiler.
 */
export type FarmerType = "lead" | "smallholder" | "commercial"

export const FARMER_TYPE_LABEL: Record<FarmerType, string> = {
  lead: "Lead Farmer",
  smallholder: "Smallholder Farmer",
  commercial: "Commercial Farmer",
}

export const FARMER_TYPE_ROUTES: Record<
  FarmerType,
  { add: string; edit: string; view: string }
> = {
  lead: {
    add: routeTo.addLeadFarmer,
    edit: routeTo.editLeadFarmer,
    view: routeTo.viewLeadFarmer,
  },
  smallholder: {
    add: routeTo.addSmallholderFarmer,
    edit: routeTo.editSmallholderFarmer,
    view: routeTo.viewSmallholderFarmer,
  },
  commercial: {
    add: routeTo.addCommercialFarmer,
    edit: routeTo.editCommercialFarmer,
    view: routeTo.viewCommercialFarmer,
  },
}

/** Safe lookups for API data whose `type` might be missing/unknown. */
export const farmerTypeLabel = (type?: string | null) =>
  FARMER_TYPE_LABEL[type as FarmerType] ?? "Smallholder Farmer"

export const farmerViewRoute = (type?: string | null) =>
  (FARMER_TYPE_ROUTES[type as FarmerType] ?? FARMER_TYPE_ROUTES.smallholder).view
