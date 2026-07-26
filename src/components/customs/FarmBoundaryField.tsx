"use client"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Undo2, Trash2, MapPin } from "lucide-react"

const FarmBoundaryMap = dynamic(() => import("./FarmBoundaryMap"), { ssr: false })

export interface FarmBoundaryGeoJSON {
  type: "Polygon"
  coordinates: [number, number][][]
}

// GeoJSON coordinates are [lng, lat] - the OPPOSITE order from
// Leaflet's [lat, lng], which is what the map/draw UI below works in
// internally. This is the one place that conversion happens.
export function pointsToGeoJSON(points: [number, number][]): FarmBoundaryGeoJSON | null {
  if (points.length < 3) return null
  const ring = points.map(([lat, lng]) => [lng, lat] as [number, number])
  // A GeoJSON polygon ring must start and end with the same point.
  ring.push(ring[0])
  return { type: "Polygon", coordinates: [ring] }
}

export function geoJSONToPoints(boundary?: FarmBoundaryGeoJSON | null): [number, number][] {
  if (!boundary?.coordinates?.[0]) return []
  // Drop the closing duplicate point when loading back into the editor.
  const ring = boundary.coordinates[0]
  const openRing = ring.length > 1 && ring[0][0] === ring[ring.length - 1][0] && ring[0][1] === ring[ring.length - 1][1]
    ? ring.slice(0, -1)
    : ring
  return openRing.map(([lng, lat]) => [lat, lng] as [number, number])
}

export default function FarmBoundaryField({
  center,
  value,
  onChange,
}: {
  center: [number, number]
  value: [number, number][]
  onChange: (points: [number, number][]) => void
}) {
  const handleAddPoint = (pt: [number, number]) => {
    onChange([...value, pt])
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-[#64748B]">
          Tap the map to mark each corner of the farm boundary (at least 3 points). Farms need a boundary set to receive weather data.
        </p>
        <div className="flex gap-2 shrink-0 ml-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 px-2"
            disabled={value.length === 0}
            onClick={() => onChange(value.slice(0, -1))}
          >
            <Undo2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 px-2"
            disabled={value.length === 0}
            onClick={() => onChange([])}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      <div className="h-[260px] rounded-lg overflow-hidden border border-[#E2E8F0]">
        <FarmBoundaryMap center={center} points={value} onAddPoint={handleAddPoint} />
      </div>
      <p className="text-xs text-[#64748B] mt-1.5 flex items-center gap-1">
        <MapPin className="h-3 w-3" />
        {value.length} point{value.length !== 1 ? "s" : ""} marked
        {value.length > 0 && value.length < 3 ? " - add at least 3 to form a boundary" : ""}
      </p>
    </div>
  )
}
