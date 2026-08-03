"use client"
import { useEffect, useMemo, useState } from "react"
import dynamic from "next/dynamic"
import PageTitle from "@/components/layouts/PageTitle"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, MapPinPlus, Check, X, Eraser, Users2, Building2, Trash2, Loader2 } from "lucide-react"
import PlaceholderNotice from "./PlaceholderNotice"
import FullscreenMapPanel from "./FullscreenMapPanel"
import type { GeoFenceAsset } from "./GeoFenceLeafletMap"
import { useFarmManagementFarmList, useFarmManagementFarmUpdate } from "@/apis/adminApiComponents"
import type * as Schemas from "@/apis/adminApiSchemas"
import {
  type GeoJSONPolygon,
  type LatLngPoint,
  pointsToGeoJSONPolygon,
  geoJSONPolygonToPoints,
  centroidOfPoints,
  DEFAULT_MAP_CENTER,
} from "@/lib/geo/boundary"

// Leaflet touches `window`, which doesn't exist during Next.js server
// rendering, so the map must be loaded client-side only.
const GeoFenceLeafletMap = dynamic(() => import("./GeoFenceLeafletMap"), { ssr: false })

// The generated client types (Schemas.FullFarm) haven't been regenerated
// to include `boundary` yet, even though the backend now accepts/returns
// it (GeoJSON Polygon). Extend locally so the rest of this file is fully
// typed; delete this extension once you regenerate the API client and
// `boundary` shows up on Schemas.FullFarm natively.
type FarmWithBoundary = Schemas.FullFarm & { boundary?: GeoJSONPolygon | null }

// PLACEHOLDER: real farms have no tracked-asset/recipient data yet (no
// IoT/GPS feed, no notification-recipient config exists on the backend).
// This is unrelated to the boundary fix - it's illustrative only, seeded
// deterministically off farm.id so the UI doesn't look empty. Swap for a
// real feed once GEO-02 (asset tracking) exists.
function getPlaceholderAssetCount(farmId: number): number {
  return farmId % 4 === 0 ? 0 : (farmId % 3) + 1
}

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
  const [selectedFarmId, setSelectedFarmId] = useState<number | null>(null)
  const [isEntering, setIsEntering] = useState(false)
  const [draftPoints, setDraftPoints] = useState<LatLngPoint[]>([])
  const [latInput, setLatInput] = useState("")
  const [lngInput, setLngInput] = useState("")
  const [entryError, setEntryError] = useState<string | null>(null)
  const [closedMessage, setClosedMessage] = useState<string | null>(null)

  // NOTE: page_size: 100 mirrors what Weather Dashboard currently does, but
  // your farm list has 9,249 records across 93 pages - so this only shows
  // the first page of real farms, not all of them. That matches Weather
  // Dashboard's current behavior exactly (so the two pages stay in sync),
  // but if you want every farm searchable here, this needs to move to
  // server-side search/pagination via FilterPropsFarms + MarisethFarmSearch,
  // the same pattern MarisethFarms.tsx already uses. Happy to wire that
  // next if you want it - didn't want to assume that's in scope here.
  const { data, isLoading, isError, refetch } = useFarmManagementFarmList({
    queryParams: { page: 1, page_size: 100 },
  })

  const farms = (data?.results ?? []) as FarmWithBoundary[]

  const { mutate: updateFarm, isPending: isSavingBoundary } = useFarmManagementFarmUpdate()

  // Select the first farm once real data arrives (there's no hardcoded
  // MONITORED_FARMS[0] to default to anymore).
  useEffect(() => {
    if (selectedFarmId === null && farms.length > 0) {
      setSelectedFarmId(farms[0].id ?? null)
    }
  }, [farms, selectedFarmId])

  // Leaving a farm mid-entry discards the in-progress draft for that farm.
  useEffect(() => {
    setIsEntering(false)
    setDraftPoints([])
    setEntryError(null)
    setClosedMessage(null)
  }, [selectedFarmId])

  const filteredFarms = useMemo(
    () =>
      farms.filter((f) => (f.name ?? f.farm_id ?? "").toLowerCase().includes(search.toLowerCase())),
    [farms, search]
  )

  const selectedFarm = farms.find((f) => f.id === selectedFarmId) ?? null
  const selectedFarmName = selectedFarm?.name ?? selectedFarm?.farm_id ?? "Unnamed farm"
  const selectedBoundaryPoints = useMemo(
    () => geoJSONPolygonToPoints(selectedFarm?.boundary),
    [selectedFarm]
  )
  const selectedCenter = useMemo(
    () => centroidOfPoints(selectedBoundaryPoints) ?? DEFAULT_MAP_CENTER,
    [selectedBoundaryPoints]
  )

  const placeholderAssetCount = selectedFarm ? getPlaceholderAssetCount(selectedFarm.id ?? 0) : 0
  const assets = selectedFarm ? getAssetsForFarm(selectedFarm.id ?? 0, placeholderAssetCount, selectedCenter) : []

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

  function saveBoundary(points: LatLngPoint[]) {
    if (!selectedFarm?.id) return
    const polygon = pointsToGeoJSONPolygon(points)
    if (!polygon) return

    updateFarm(
      {
        pathParams: { id: selectedFarm.id },
        // `boundary` isn't in the generated RequestBodies.Farm type yet -
        // see the FarmWithBoundary note above. Remove the cast once the
        // client is regenerated from the updated schema.
        body: { boundary: polygon } as any,
      },
      {
        onSuccess: () => {
          // Weather Dashboard reads farm.boundary via its own
          // useFarmManagementFarmList call, so refetching this page's farm
          // list is enough to make Geofencing reflect the save immediately;
          // Weather Dashboard will pick it up on its own next
          // fetch/refetch/mount.
          refetch()
          setIsEntering(false)
          setDraftPoints([])
          setLatInput("")
          setLngInput("")
        },
        onError: () => {
          setEntryError("Couldn't save this boundary - please try again.")
        },
      }
    )
  }

  function handleAddPoint() {
    if (!selectedFarm) return
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
    // farm's current working area - most likely a typo, not a real 50km
    // walk. Only meaningful once we have prior points/center to compare
    // against; with zero real farm coordinates on unconfigured farms,
    // this just compares to the running centroid of points entered so far.
    const runningCenter = centroidOfPoints(draftPoints)
    if (runningCenter) {
      const distFromCenter = Math.hypot(lat - runningCenter.lat, lng - runningCenter.lng)
      if (distFromCenter > 0.2) {
        setEntryError(
          "That point is quite far from the others you've entered - double check the coordinates before continuing. You can still add it if it's correct."
        )
      }
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

  if (isLoading) {
    return (
      <div>
        <PageTitle title="Geo-Fencing Manager" />
        <div className="flex items-center justify-center h-64 text-[#64748B] gap-2 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading farms...
        </div>
      </div>
    )
  }

  if (isError || farms.length === 0) {
    return (
      <div>
        <PageTitle title="Geo-Fencing Manager" />
        <div className="flex items-center justify-center h-64 text-[#64748B] text-sm">
          {isError ? "Couldn't load farms. Please try again." : "No farms found."}
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageTitle title="Geo-Fencing Manager" />
      <PlaceholderNotice text="Boundaries you draw here are saved to the farm's real record and will show up on the Weather Dashboard. Asset tracking (the dots on the map) is still illustrative - no live GPS/IoT feed is connected yet." />

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
              const isSelected = farm.id === selectedFarmId
              const hasBoundary = !!farm.boundary
              const assetCount = getPlaceholderAssetCount(farm.id ?? 0)
              return (
                <Card
                  key={farm.id}
                  className={`p-4 shadow-none cursor-pointer transition-colors ${
                    isSelected ? "border-[#4A8D34] bg-[#F0FDF4]" : "border-[#E2E8F0] hover:border-[#CBD5E1]"
                  }`}
                  onClick={() => setSelectedFarmId(farm.id ?? null)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-4 w-4 text-[#4A8D34] shrink-0" />
                    <p className="text-sm font-semibold text-black truncate">{farm.name ?? farm.farm_id}</p>
                  </div>
                  <p className="text-xs text-[#64748B] mb-3">{farm.district?.name}</p>

                  <div className="flex items-end justify-between">
                    <div className="flex gap-4">
                      <div>
                        <p className="text-sm font-bold text-black">{assetCount}</p>
                        <p className="text-[10px] text-[#94A3B8]">Assets</p>
                      </div>
                    </div>
                    <Badge
                      className={`border-0 shrink-0 ${
                        hasBoundary ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#FEF9C3] text-[#CA8A04]"
                      }`}
                    >
                      {hasBoundary ? "Configured" : "Unconfigured"}
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
                <p className="text-sm font-semibold text-black">{selectedFarmName}</p>
                <p className="text-xs text-[#64748B]">
                  {selectedBoundaryPoints.length > 0
                    ? `Boundary configured with ${selectedBoundaryPoints.length} points.`
                    : "No boundary set for this farm yet."}
                </p>
              </div>
              <Button
                onClick={startEntering}
                className="bg-[#4A8D34] hover:bg-[#3f7a2c] text-white cursor-pointer rounded-sm px-5 py-2.5 text-sm font-bold"
              >
                <MapPinPlus className="h-4 w-4" />
                {selectedBoundaryPoints.length > 0 ? "Re-enter Boundary Coordinates" : "Enter Boundary Coordinates"}
              </Button>
            </div>
          ) : (
            <Card className="p-5 shadow-none border border-[#E2E8F0]">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold text-black">
                  Enter boundary points for {selectedFarmName}
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
                  disabled={isSavingBoundary}
                  className="bg-[#4A8D34] hover:bg-[#3f7a2c] text-white cursor-pointer rounded-sm px-5 py-2.5 text-sm font-bold"
                >
                  Add Point
                </Button>
              </div>

              {entryError && <p className="text-xs text-[#DC2626] mb-3">{entryError}</p>}
              {closedMessage && <p className="text-xs text-[#16A34A] mb-3">{closedMessage}</p>}
              {isSavingBoundary && <p className="text-xs text-[#64748B] mb-3">Saving boundary...</p>}

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
                  disabled={draftPoints.length < 3 || isSavingBoundary}
                  className="flex items-center gap-1.5 bg-[#4A8D34] rounded-sm px-3 py-2 text-xs font-medium text-white cursor-pointer hover:bg-[#3f7a2c] disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
                >
                  <Check className="h-3.5 w-3.5" />
                  Finish
                </button>
              </div>
            </Card>
          )}

          <FullscreenMapPanel title={`${selectedFarmName} - Boundary`}>
            {(isFullscreen) => (
              <div className={isFullscreen ? "relative w-screen h-screen" : "relative rounded-2xl overflow-hidden border border-[#E2E8F0] h-[520px]"}>
                <GeoFenceLeafletMap
                  farm={{ id: selectedFarm?.id ?? 0, name: selectedFarmName, latLng: selectedCenter }}
                  assets={assets}
                  boundary={selectedBoundaryPoints.length > 0 ? selectedBoundaryPoints : null}
                  draftPoints={draftPoints}
                />

                {!isEntering && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white rounded-full shadow px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium text-black z-[1000]">
                    <Users2 className="h-3.5 w-3.5 text-[#4A8D34]" />
                    {placeholderAssetCount} asset{placeholderAssetCount === 1 ? "" : "s"} tracked
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