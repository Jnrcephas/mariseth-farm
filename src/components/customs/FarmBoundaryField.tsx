"use client"
import { useState } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Undo2, Trash2, MapPin, Plus, ClipboardPaste, X } from "lucide-react"
import { toast } from "sonner"

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

// Accepts lines like "5.651200, -0.149850" or "5.651200 -0.149850" (lat
// then lng, matching how we display/edit points here - NOT GeoJSON order).
// Silently skips lines that don't parse instead of failing the whole
// paste, since a survey export or GPS log occasionally has a stray blank
// line or header row.
function parseBulkCoordinates(text: string): [number, number][] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(/[,\s]+/).map((p) => parseFloat(p))
      if (parts.length < 2 || parts.some((n) => Number.isNaN(n))) return null
      const [lat, lng] = parts
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null
      return [lat, lng] as [number, number]
    })
    .filter((p): p is [number, number] => p !== null)
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
  const [pasteOpen, setPasteOpen] = useState(false)
  const [pasteText, setPasteText] = useState("")

  const handleAddPoint = (pt: [number, number]) => {
    onChange([...value, pt])
  }

  const handleAddManualPoint = () => {
    onChange([...value, center])
  }

  const handleUpdatePoint = (index: number, coordIndex: 0 | 1, raw: string) => {
    const num = parseFloat(raw)
    const next = value.map((pt, i) =>
      i === index ? ([coordIndex === 0 ? num : pt[0], coordIndex === 1 ? num : pt[1]] as [number, number]) : pt
    )
    onChange(next)
  }

  const handleRemovePoint = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const handleApplyPaste = () => {
    const parsed = parseBulkCoordinates(pasteText)
    if (parsed.length < 3) {
      toast.error("Couldn't find at least 3 valid coordinate pairs. Use one \"lat, lng\" pair per line.")
      return
    }
    onChange(parsed)
    setPasteText("")
    setPasteOpen(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2 gap-3">
        <p className="text-xs text-[#64748B]">
          Tap the map, or enter coordinates directly below, to mark each corner of the farm boundary (at least 3 points). Farms need a boundary set to receive weather data.
        </p>
        <div className="flex gap-2 shrink-0">
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

      {/* Editable coordinate list - stays in sync with the map. Useful when
          someone already has exact surveyed/GPS coordinates (e.g. captured
          via the mobile app's walk-the-boundary feature) rather than
          needing to eyeball a click on a small embedded map. */}
      <div className="mt-3 space-y-1.5">
        {value.map((pt, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-xs text-[#94A3B8] w-4 shrink-0">{index + 1}</span>
            <Input
              type="number"
              step="any"
              value={pt[0]}
              onChange={(e) => handleUpdatePoint(index, 0, e.target.value)}
              placeholder="Latitude"
              className="h-8 text-xs"
            />
            <Input
              type="number"
              step="any"
              value={pt[1]}
              onChange={(e) => handleUpdatePoint(index, 1, e.target.value)}
              placeholder="Longitude"
              className="h-8 text-xs"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 shrink-0"
              onClick={() => handleRemovePoint(index)}
            >
              <X className="h-3.5 w-3.5 text-[#94A3B8]" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-2">
        <Button type="button" variant="outline" size="sm" className="h-7 text-xs" onClick={handleAddManualPoint}>
          <Plus className="h-3 w-3 mr-1" /> Add point manually
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          onClick={() => setPasteOpen((v) => !v)}
        >
          <ClipboardPaste className="h-3 w-3 mr-1" /> Paste coordinate list
        </Button>
      </div>

      {pasteOpen && (
        <div className="mt-2 border border-[#E2E8F0] rounded-lg p-3">
          <p className="text-xs text-[#64748B] mb-2">
            One point per line, as &quot;latitude, longitude&quot; - e.g. from a survey export or the mobile app. This replaces the current points.
          </p>
          <Textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder={"5.651200, -0.149850\n5.651200, -0.149350\n5.650700, -0.149350\n5.650700, -0.149850"}
            className="text-xs h-24"
          />
          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setPasteOpen(false)}>
              Cancel
            </Button>
            <Button type="button" size="sm" onClick={handleApplyPaste}>
              Apply
            </Button>
          </div>
        </div>
      )}

      <p className="text-xs text-[#64748B] mt-2 flex items-center gap-1">
        <MapPin className="h-3 w-3" />
        {value.length} point{value.length !== 1 ? "s" : ""} marked
        {value.length > 0 && value.length < 3 ? " - add at least 3 to form a boundary" : ""}
      </p>
    </div>
  )
}
