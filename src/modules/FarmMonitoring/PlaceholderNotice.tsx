import { Info } from "lucide-react"

/**
 * Farm Monitoring has no real backend integration yet (no weather API, no
 * IoT/sensor feed, no pest-detection service). Every page under this
 * section renders illustrative placeholder numbers so the UI/UX can be
 * reviewed now, with this banner making that explicit rather than letting
 * someone mistake dummy data for a live reading. Remove this banner (and
 * swap the dummy data for a real API call) once a real data source exists.
 */
export default function PlaceholderNotice({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 bg-[#FEF3C7] border border-[#FDE68A] rounded-lg px-4 py-3 mb-5 text-sm text-[#92400E]">
      <Info className="h-4 w-4 mt-0.5 shrink-0" />
      <span>{text}</span>
    </div>
  )
}
