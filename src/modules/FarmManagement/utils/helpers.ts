import {
  formatPhoneNumberWithOutPlus,
  formatPhoneNumberWithPlus,
} from "@/modules/UserManagement/utils/helpers"

/**
 * Backend key for "number of farms". NOTE: this is spelled exactly as it
 * appears in the API sample (`number_of_falls`). If the backend renames it
 * to `number_of_farms`, change it here and nothing else needs to move.
 */
export const NUMBER_OF_FARMS_API_KEY = "number_of_falls"

const toStr = (v: any) => (v === undefined || v === null ? "" : String(v))
const idOf = (v: any) => v?.id ?? v ?? ""

const toNumber = (v: any): number | undefined => {
  if (v === undefined || v === null || v === "") return undefined
  const n = Number(v)
  return Number.isNaN(n) ? undefined : n
}

/** Form default values for the new profile / project fields (create + edit). */
export const getFarmerProfileDefaultValues = (d: any) => ({
  project: toStr(idOf(d?.project)),
  nationality: d?.nationality || "",
  marital_status: d?.marital_status || "",
  alternative_phone_number: formatPhoneNumberWithPlus(d?.alternative_phone_number),
  education_level: d?.education_level || "",
  average_income: toStr(d?.average_income),
  number_of_households: toStr(d?.number_of_households),
  number_of_dependents: toStr(d?.number_of_dependents),
  years_of_experience: toStr(d?.years_of_experience),
  number_of_farms: toStr(d?.[NUMBER_OF_FARMS_API_KEY] ?? d?.number_of_farms),
  consent: Boolean(d?.consent),
})

/** API payload fragment for the new fields. Empty values are omitted. */
export const buildFarmerProfilePayload = (v: any) => ({
  project: toNumber(v?.project),
  nationality: v?.nationality,
  marital_status: v?.marital_status,
  alternative_phone_number: v?.alternative_phone_number
    ? formatPhoneNumberWithOutPlus(v.alternative_phone_number)
    : undefined,
  education_level: v?.education_level,
  average_income: toNumber(v?.average_income),
  number_of_households: toNumber(v?.number_of_households),
  number_of_dependents: toNumber(v?.number_of_dependents),
  years_of_experience: toNumber(v?.years_of_experience),
  [NUMBER_OF_FARMS_API_KEY]: toNumber(v?.number_of_farms),
  consent: Boolean(v?.consent),
})
