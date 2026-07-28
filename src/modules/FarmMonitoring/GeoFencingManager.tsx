"use client"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import PageTitle from "@/components/layouts/PageTitle"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, MapPinPlus, Check, X, Eraser, Users2, Building2, Trash2 } from "lucide-react"
import PlaceholderNotice from "./PlaceholderNotice"
import FullscreenMapPanel from "./FullscreenMapPanel"
import { MONITORED_FARMS } from "./farmMonitoringData"
import type { GeoFenceAsset } from "./GeoFenceLeafletMap"

// Leaflet touches `window`, which doesn't exist during Next.js server
// rendering, so the map must be loaded client-side only.
const GeoFenceLeafletMap = dynamic(() => import("./GeoFenceLeafletMap"), { ssr: false })

// PLACEHOLDER: illustrative fence configuration - swap for real GeoFence /
// GeoFenceEvent records (GEO-01..GEO-06) once persistence exists. Each
// farm below has its OWN hand-set boundary shape.
interface FenceConfig {
  farmId: number
  assets: number
  recipients: string[]
  boundary: [number, number][] | null
}

const INITIAL_FENCES: FenceConfig[] = [
  {
    farmId: 1,
    assets: 3,
    recipients: ["Field Officer - Kumbungu"],
    boundary: [
      [9.5525, -0.8735], [9.5522, -0.8665], [9.5495, -0.8645],
      [9.5468, -0.8672], [9.5470, -0.8722], [9.5498, -0.8748],
    ],
  },
  {
    farmId: 2,
    assets: 1,
    recipients: ["Field Officer - Sawla-Tuna-Kalba"],
    boundary: [
      [9.0325, -2.4065], [9.0318, -2.3995], [9.0275, -2.4000], [9.0282, -2.4070],
    ],
  },
  { farmId: 3, assets: 0, recipients: [], boundary: null },
  {
    farmId: 4,
    assets: 2,
    recipients: ["Field Officer - Kumbungu", "Farm Manager"],
    boundary: [
      [9.5805, -0.8345], [9.5798, -0.8280], [9.5760, -0.8265],
      [9.5748, -0.8320], [9.5775, -0.8360],
    ],
  },
  { farmId: 5, assets: 0, recipients: [], boundary: null },
]

// PLACEHOLDER: illustrative tracked-asset positions - swap for real GPS
// device coordinates once GEO-02 exists.
function getAssetsForFarm(farmId: number, assetCount: number, center: { lat: number; lng: number }): GeoFenceAsset[] {
  const offsets = [
    { dLat: 0.0025, dLng: -0.002 }, { dLat: -0.002, dLng: 0.003 }, { dLat: 0.0015, dLng: 0.0032 },
    { dLat: -0.003, dLng: -0.0025 }, { dLat: 0.0035, dLng: 0.001 },
  ]
  const statuses = ["Onsite", "En route", "Offsite"]
  return Array.from({ length: assetCount }).map((_, i) => ({
    id: `${farmId}-${i}`,
    label: i === 0 ? "Field Officer" : `Asset ${i + 1}`,
    lat: center.lat + offsets[i % offsets.length].dLat,
    lng: center.lng + offsets[i % offsets.length].dLng,
    status: statuses[i % statuses.length],
    lastSeen: `${(i + 1) * 4} mins ago`,
  }))
}

// How close a newly entered point needs to be to Point 1 to count as
// "closing the loop" (in degrees - roughly 5 metres at this latitude).
const CLOSE_LOOP_TOLERANCE = 0.00005

export default function GeoFencingManager() {
  const [search, setSearch] = useState("")
  const [selectedFarmId, setSelectedFarmId] = useState(MONITORED_FARMS[0].id)
  const [fences, setFences] = useState<FenceConfig[]>(INITIAL_FENCES)
  const [isEntering, setIsEntering] = useState(false)
  const [draftPoints, setDraftPoints] = useState<[number, number][]>([])
  const [latInput, setLatInput] = useState("")
  const [lngInput, setLngInput] = useState("")
  const [entryError, setEntryError] = useState<string | null>(null)
  const [closedMessage, setClosedMessage] = useState<string | null>(null)

  // Leaving a farm mid-entry discards the in-progress draft for that farm.
  useEffect(() => {
    setIsEntering(false)
    setDraftPoints([])
    setEntryError(null)
    setClosedMessage(null)
  }, [selectedFarmId])

  const filteredFarms = MONITORED_FARMS.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  )

  const selectedFarm = MONITORED_FARMS.find((f) => f.id === selectedFarmId) ?? MONITORED_FARMS[0]
  const selectedFence = fences.find((f) => f.farmId === selectedFarmId)!
  const assets = getAssetsForFarm(selectedFarm.id, selectedFence.assets, selectedFarm.latLng)

  function startEntering() {
    setIsEntering(true)
    setDraftPoints([])
    setEntryError(null)
    setClosedMessage(null)
  }

  function cancelEntering() {
    setIsEntering(false)
    setDraftPoints([])
    setEntryError(null)
    setClosedMessage(null)
  }

  function clearPoints() {
    setDraftPoints([])
    setEntryError(null)
    setClosedMessage(null)
  }

  function removePoint(index: number) {
    setDraftPoints((prev) => prev.filter((_, i) => i !== index))
    setClosedMessage(null)
  }

  function saveBoundary(points: [number, number][]) {
    setFences((prev) =>
      prev.map((f) => (f.farmId === selectedFarmId ? { ...f, boundary: points } : f))
    )
    setIsEntering(false)
    setDraftPoints([])
    setLatInput("")
    setLngInput("")
  }

  function handleAddPoint() {
    setEntryError(null)
    const lat = Number(latInput)
    const lng = Number(lngInput)

    if (latInput.trim() === "" || lngInput.trim() === "" || Number.isNaN(lat) || Number.isNaN(lng)) {
      setEntryError("Enter both a latitude and longitude.")
      return
    }
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setEntryError("Latitude must be between -90 and 90, longitude between -180 and 180.")
      return
    }

    // Flag (but don't block) a point that's suspiciously far from the
    // farm's known location - most likely a typo, not a real 50km walk.
    const distFromFarm = Math.hypot(lat - selectedFarm.latLng.lat, lng - selectedFarm.latLng.lng)
    if (distFromFarm > 0.2) {
      setEntryError(
        "That point is quite far from this farm's location - double check the coordinates before continuing. You can still add it if it's correct."
      )
    }

    // Closing the loop: if this point matches Point 1 and we already have
    // at least 3 points, finish and save instead of adding a duplicate.
    if (draftPoints.length >= 3) {
      const [firstLat, firstLng] = draftPoints[0]
      const isCloseMatch =
        Math.abs(lat - firstLat) <= CLOSE_LOOP_TOLERANCE && Math.abs(lng - firstLng) <= CLOSE_LOOP_TOLERANCE
      if (isCloseMatch) {
        saveBoundary(draftPoints)
        setClosedMessage(`Boundary closed and saved with ${draftPoints.length} points.`)
        setLatInput("")
        setLngInput("")
        return
      }
    }

    setDraftPoints((prev) => [...prev, [lat, lng]])
    setLatInput("")
    setLngInput("")
  }

  function finishWithoutClosing() {
    if (draftPoints.length < 3) return
    saveBoundary(draftPoints)
    setClosedMessage(`Boundary saved with ${draftPoints.length} points.`)
  }

  return (
    <div>
      <PageTitle title="Geo-Fencing Manager" />
      <PlaceholderNotice text="Boundary shapes and asset tracking are illustrative and stored only for this session - no live persistence layer is connected yet. The map and coordinate entry are fully functional (free OpenStreetMap tiles) so you can preview the real interaction." />

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Left: farm / fence list */}
        <div className="lg:w-[320px] shrink-0 flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search farms..."
              className="w-full text-sm border border-[#E2E8F0] rounded-sm pl-9 pr-3 py-2.5 outline-none focus:border-[#4A8D34]"
            />
          </div>

          <div className="flex flex-col gap-3 max-h-[640px] overflow-y-auto pr-1">
            {filteredFarms.map((farm) => {
              const fence = fences.find((f) => f.farmId === farm.id)!
              const isSelected = farm.id === selectedFarmId
              return (
                <Card
                  key={farm.id}
                  className={`p-4 shadow-none cursor-pointer transition-colors ${
                    isSelected ? "border-[#4A8D34] bg-[#F0FDF4]" : "border-[#E2E8F0] hover:border-[#CBD5E1]"
                  }`}
                  onClick={() => setSelectedFarmId(farm.id)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-4 w-4 text-[#4A8D34] shrink-0" />
                    <p className="text-sm font-semibold text-black truncate">{farm.name}</p>
                  </div>
                  <p className="text-xs text-[#64748B] mb-3">{farm.district}</p>

                  <div className="flex items-end justify-between">
                    <div className="flex gap-4">
                      <div>
                        <p className="text-sm font-bold text-black">{fence.assets}</p>
                        <p className="text-[10px] text-[#94A3B8]">Assets</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-black">{fence.recipients.length}</p>
                        <p className="text-[10px] text-[#94A3B8]">Recipients</p>
                      </div>
                    </div>
                    <Badge
                      className={`border-0 shrink-0 ${
                        fence.boundary ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#FEF9C3] text-[#CA8A04]"
                      }`}
                    >
                      {fence.boundary ? "Configured" : "Unconfigured"}
                    </Badge>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Middle/right: coordinate entry + map */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          {!isEntering ? (
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-sm font-semibold text-black">{selectedFarm.name}</p>
                <p className="text-xs text-[#64748B]">
                  {selectedFence.boundary
                    ? `Boundary configured with ${selectedFence.boundary.length} points.`
                    : "No boundary set for this farm yet."}
                </p>
              </div>
              <Button
                onClick={startEntering}
                className="bg-[#4A8D34] hover:bg-[#3f7a2c] text-white cursor-pointer rounded-sm px-5 py-2.5 text-sm font-bold"
              >
                <MapPinPlus className="h-4 w-4" />
                {selectedFence.boundary ? "Re-enter Boundary Coordinates" : "Enter Boundary Coordinates"}
              </Button>
            </div>
          ) : (
            <Card className="p-5 shadow-none border border-[#E2E8F0]">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold text-black">
                  Enter boundary points for {selectedFarm.name}
                </p>
                <Badge className="bg-[#FEF9C3] text-[#CA8A04] border-0">{draftPoints.length} points added</Badge>
              </div>
              <p className="text-xs text-[#64748B] mb-4">
                Stand at a corner of the farm, note the GPS coordinates, and enter them below. Move to the
                next corner and repeat, in order. Enter the same coordinates as Point 1 again to close the
                shape automatically - or use &quot;Finish&quot; once you have at least 3 points.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end mb-3">
                <div>
                  <label className="text-xs font-medium text-[#475569] block mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={latInput}
                    onChange={(e) => setLatInput(e.target.value)}
                    placeholder="e.g. 9.5525"
                    className="w-full text-sm border border-[#E2E8F0] rounded-sm px-3 py-2.5 outline-none focus:border-[#4A8D34]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#475569] block mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={lngInput}
                    onChange={(e) => setLngInput(e.target.value)}
                    placeholder="e.g. -0.8735"
                    className="w-full text-sm border border-[#E2E8F0] rounded-sm px-3 py-2.5 outline-none focus:border-[#4A8D34]"
                  />
                </div>
                <Button
                  onClick={handleAddPoint}
                  className="bg-[#4A8D34] hover:bg-[#3f7a2c] text-white cursor-pointer rounded-sm px-5 py-2.5 text-sm font-bold"
                >
                  Add Point
                </Button>
              </div>

              {entryError && <p className="text-xs text-[#DC2626] mb-3">{entryError}</p>}
              {closedMessage && <p className="text-xs text-[#16A34A] mb-3">{closedMessage}</p>}

              {draftPoints.length > 0 && (
                <div className="flex flex-col gap-1.5 mb-4 max-h-40 overflow-y-auto pr-1">
                  {draftPoints.map((pt, i) => (
                    <div key={i} className="flex items-center justify-between bg-[#F8FAFC] rounded-md px-3 py-2">
                      <span className="text-xs text-black">
                        <span className="font-semibold">Point {i + 1}:</span> {pt[0].toFixed(5)}, {pt[1].toFixed(5)}
                      </span>
                      <button type="button" onClick={() => removePoint(i)} className="cursor-pointer">
                        <Trash2 className="h-3.5 w-3.5 text-[#94A3B8] hover:text-[#DC2626]" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={clearPoints}
                  disabled={draftPoints.length === 0}
                  className="flex items-center gap-1.5 border border-[#E2E8F0] rounded-sm px-3 py-2 text-xs font-medium text-black cursor-pointer hover:bg-[#F8FAFC] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Eraser className="h-3.5 w-3.5" />
                  Clear
                </button>
                <button
                  type="button"
                  onClick={cancelEntering}
                  className="flex items-center gap-1.5 border border-[#FCA5A5] rounded-sm px-3 py-2 text-xs font-medium text-[#DC2626] cursor-pointer hover:bg-[#FEF2F2]"
                >
                  <X className="h-3.5 w-3.5" />
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={finishWithoutClosing}
                  disabled={draftPoints.length < 3}
                  className="flex items-center gap-1.5 bg-[#4A8D34] rounded-sm px-3 py-2 text-xs font-medium text-white cursor-pointer hover:bg-[#3f7a2c] disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
                >
                  <Check className="h-3.5 w-3.5" />
                  Finish
                </button>
              </div>
            </Card>
          )}

          <FullscreenMapPanel title={`${selectedFarm.name} - Boundary`}>
            {(isFullscreen) => (
              <div className={isFullscreen ? "relative w-screen h-screen" : "relative rounded-2xl overflow-hidden border border-[#E2E8F0] h-[520px]"}>
                <GeoFenceLeafletMap
                  farm={selectedFarm}
                  assets={assets}
                  boundary={selectedFence.boundary}
                  draftPoints={draftPoints}
                />

                {!isEntering && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white rounded-full shadow px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium text-black z-[1000]">
                    <Users2 className="h-3.5 w-3.5 text-[#4A8D34]" />
                    {selectedFence.assets} asset{selectedFence.assets === 1 ? "" : "s"} tracked
                  </div>
                )}
              </div>
            )}
          </FullscreenMapPanel>
        </div>
      </div>
    </div>
  )
}