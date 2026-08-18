"use client"
import { useMemo, useState } from "react"
import dynamic from "next/dynamic"
import PageTitle from "@/components/layouts/PageTitle"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Loader2, MapPin, ChevronLeft, ChevronRight, Cloud, CalendarDays, Satellite, LayoutGrid, AlertTriangle } from "lucide-react"
import { useFarmManagementFarmList } from "@/apis/adminApiComponents"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { cleanJsonData, formatDateReadable } from "@/lib/helpers"
import { FarmSatelliteImage, SatelliteImageIndex, useFarmSatelliteImages } from "@/apis/useFarmSateliteImages"
import { geoJSONPolygonToPoints, centroidOfPoints, DEFAULT_MAP_CENTER, type GeoJSONPolygon } from "@/lib/geo/boundary"
import FullscreenMapPanel from "./FullscreenMapPanel"

// Leaflet touches `window`, so it must be loaded client-side only - same
// pattern GeoFencingManager uses for GeoFenceLeafletMap.
const SatelliteLiveMap = dynamic(() => import("./SatelliteLiveMap"), { ssr: false })

// The generated client types haven't been regenerated to include `boundary`
// on the farm-list response yet, even though the backend now returns it
// (see the identical note in GeoFencingManager.tsx). Extend locally.
type FarmWithBoundary = { id: number; name?: string | null; boundary?: GeoJSONPolygon | null; district?: any }


const FARMS_PAGE_SIZE = 12

// Above this, a provider capture is treated as "too clouded to be useful"
// and a banner nudges the user toward the Live Map tab instead.
const HIGH_CLOUD_COVERAGE_THRESHOLD = 80


const INDEX_OPTIONS: { key: SatelliteImageIndex; label: string }[] = [
  { key: "truecolor", label: "True Color" },
  { key: "ndvi", label: "NDVI" },
  { key: "falsecolor", label: "False Color" },
  { key: "evi", label: "EVI" },
  { key: "evi2", label: "EVI2" },
  { key: "nri", label: "NRI" },
  { key: "dswi", label: "DSWI" },
  { key: "ndwi", label: "NDWI" },
]

function FarmSatelliteImagery({
  farmId,
  onSwitchToLiveMap,
}: {
  farmId: number
  onSwitchToLiveMap: () => void
}) {
  const { data: images, isLoading, error } = useFarmSatelliteImages({ pathParams: { farm_id: farmId } })
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<SatelliteImageIndex>("truecolor")

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <Loader2 className="h-5 w-5 animate-spin text-[#94A3B8]" />
      </div>
    )
  }

  if (error) {
    const needsBoundary = error?.status === 400 && /polygon/i.test(error?.payload?.message || "")
    return (
      <div className="flex flex-col items-center justify-center h-[500px] text-center px-8">
        <MapPin className="h-8 w-8 text-[#D97706] mb-3" />
        <p className="text-sm font-semibold text-black mb-1">
          {needsBoundary ? "This farm needs a boundary set" : "Couldn't load satellite imagery"}
        </p>
        <p className="text-xs text-[#64748B] max-w-sm">
          {needsBoundary
            ? "Satellite imagery is pulled from the farm's registered boundary polygon. Mark this farm's boundary in the Geofencing tab, then check back here."
            : "Something went wrong loading imagery for this farm. Please try again."}
        </p>
      </div>
    )
  }

  if (!images || images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] text-center px-8">
        <CalendarDays className="h-8 w-8 text-[#94A3B8] mb-3" />
        <p className="text-sm font-semibold text-black mb-1">No imagery yet</p>
        <p className="text-xs text-[#64748B] max-w-sm">
          No satellite imagery was found for this farm in the last 30 days. Satellite revisit time is
          3-16 days depending on the source, so check back soon.
        </p>
      </div>
    )
  }

  const selectedImage: FarmSatelliteImage = images.find((img) => img.id === selectedImageId) ?? images[0]
  const availableIndexes = INDEX_OPTIONS.filter((opt) => !!selectedImage.image_urls?.[opt.key])
  const activeIndex = availableIndexes.some((opt) => opt.key === selectedIndex) ? selectedIndex : "truecolor"
  const imageUrl = selectedImage.image_urls?.[activeIndex]
  const isHeavilyClouded = selectedImage.cloud_coverage >= HIGH_CLOUD_COVERAGE_THRESHOLD

  return (
    <div className="flex flex-col gap-4">
      {isHeavilyClouded && (
        <div className="flex items-center justify-between gap-3 flex-wrap rounded-xl border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 text-[#D97706] mt-0.5 shrink-0" />
            <p className="text-xs text-[#92400E]">
              This capture is {Math.round(selectedImage.cloud_coverage)}% cloud cover, so it may not show
              much useful detail. Try the Live Map view instead for a clear, always-available image of
              this farm.
            </p>
          </div>
          <button
            type="button"
            onClick={onSwitchToLiveMap}
            className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-white bg-[#D97706] hover:bg-[#B45309] rounded-full px-3 py-1.5 cursor-pointer transition-colors"
          >
            <Satellite className="h-3.5 w-3.5" />
            Switch to Live Map
          </button>
        </div>
      )}

      <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] bg-black h-[420px] flex items-center justify-center">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={`${activeIndex} satellite image`} className="w-full h-full object-contain" />
        ) : (
          <p className="text-sm text-white">No image available for this index</p>
        )}

        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="bg-white/90 rounded-full px-3 py-1 text-xs font-medium text-black flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-[#4A8D34]" />
            {formatDateReadable(selectedImage.dt)}
          </span>
          <span className="bg-white/90 rounded-full px-3 py-1 text-xs font-medium text-black flex items-center gap-1.5">
            <Cloud className="h-3.5 w-3.5 text-[#2563EB]" />
            {Math.round(selectedImage.cloud_coverage)}% cloud cover
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {availableIndexes.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => setSelectedIndex(opt.key)}
            className={`text-xs font-medium rounded-full px-3.5 py-1.5 border transition-colors cursor-pointer ${
              activeIndex === opt.key
                ? "bg-[#4A8D34] border-[#4A8D34] text-white"
                : "bg-white border-[#E2E8F0] text-[#475569] hover:border-[#CBD5E1]"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {images.length > 1 && (
        <div>
          <p className="text-xs font-semibold text-[#64748B] mb-2">Other captures</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((img) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setSelectedImageId(img.id)}
                className={`shrink-0 rounded-lg overflow-hidden border-2 h-16 w-16 ${
                  img.id === selectedImage.id ? "border-[#4A8D34]" : "border-transparent"
                }`}
              >
                {img.image_urls?.truecolor ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img.image_urls.truecolor} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#E2E8F0]" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

type ViewMode = "provider" | "live_map"

export default function SatelliteFarmView() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [selectedFarmId, setSelectedFarmId] = useState<number | null>(null)
  // Defaults to the Live Map: the provider imagery backend is currently
  // unreliable (missing boundaries -> 400s, and even successful captures
  // are frequently 100% cloud-covered), so the always-available live map
  // is the safer first view. Users can still switch to Provider Imagery.
  const [viewMode, setViewMode] = useState<ViewMode>("live_map")
  const debouncedSearch = useDebouncedValue(search, 300)

  const { data: farmsData, isLoading } = useFarmManagementFarmList({
    queryParams: cleanJsonData({ page, page_size: FARMS_PAGE_SIZE, query: debouncedSearch }) as any,
    placeholderData: (prev: any) => prev,
  } as any)

  const farms = (farmsData?.results || []) as FarmWithBoundary[]
  const pagination = farmsData?.pagination
  const selectedFarm = farms.find((f) => f.id === selectedFarmId)

  const selectedBoundaryPoints = useMemo(
    () => geoJSONPolygonToPoints(selectedFarm?.boundary),
    [selectedFarm]
  )
  const selectedCenter = useMemo(
    () => centroidOfPoints(selectedBoundaryPoints) ?? DEFAULT_MAP_CENTER,
    [selectedBoundaryPoints]
  )

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  return (
    <div>
      <PageTitle title="Satellite Imagery" />

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Left: farm list */}
        <div className="lg:w-[340px] shrink-0 flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search farms..."
              className="w-full text-sm border border-[#E2E8F0] rounded-sm pl-9 pr-3 py-2.5 outline-none focus:border-[#4A8D34]"
            />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-5 w-5 animate-spin text-[#94A3B8]" />
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
                {farms.map((farm) => {
                  const isSelected = farm.id === selectedFarmId
                  return (
                    <Card
                      key={farm.id}
                      className={`p-4 shadow-none cursor-pointer transition-colors ${
                        isSelected ? "border-[#4A8D34] bg-[#F0FDF4]" : "border-[#E2E8F0] hover:border-[#CBD5E1]"
                      }`}
                      onClick={() => setSelectedFarmId(farm.id)}
                    >
                      <p className="text-sm font-semibold text-black truncate">{farm.name}</p>
                      <p className="text-xs text-[#64748B]">{farm?.district?.name || farm?.district}</p>
                    </Card>
                  )
                })}
                {farms.length === 0 && (
                  <p className="text-sm text-[#64748B] text-center py-8">No farms found.</p>
                )}
              </div>

              {farms.length > 0 && (
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#64748B]">
                    Page {pagination?.page || page} of {pagination?.pages || 1}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="ghost"
                      className="border h-8 px-2"
                      disabled={!pagination?.has_previous}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      className="border h-8 px-2"
                      disabled={!pagination?.has_next}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right: selected farm's satellite imagery */}
        <div className="flex-1 min-w-0">
          {!selectedFarm ? (
            <div className="flex flex-col items-center justify-center h-[500px] border border-dashed border-[#E2E8F0] rounded-2xl text-center px-8">
              <MapPin className="h-8 w-8 text-[#94A3B8] mb-3" />
              <p className="text-sm font-semibold text-black">Select a farm</p>
              <p className="text-xs text-[#64748B] mt-1">Choose a farm from the list to view its satellite imagery.</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                <p className="text-sm font-semibold text-black">{selectedFarm.name}</p>

                {/* Temporary: provider imagery backend is unreliable, so a
                    free, always-available live satellite map (Esri World
                    Imagery, no API key) is offered as an alternate view for
                    stakeholder demos. Provider imagery view is left in place
                    unchanged. */}
                <div className="flex items-center gap-1 bg-[#F1F5F9] rounded-full p-1">
                  <button
                    type="button"
                    onClick={() => setViewMode("provider")}
                    className={`flex items-center gap-1.5 text-xs font-medium rounded-full px-3 py-1.5 transition-colors cursor-pointer ${
                      viewMode === "provider" ? "bg-white text-black shadow-sm" : "text-[#64748B]"
                    }`}
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                    Provider Imagery
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("live_map")}
                    className={`flex items-center gap-1.5 text-xs font-medium rounded-full px-3 py-1.5 transition-colors cursor-pointer ${
                      viewMode === "live_map" ? "bg-white text-black shadow-sm" : "text-[#64748B]"
                    }`}
                  >
                    <Satellite className="h-3.5 w-3.5" />
                    Live Map
                  </button>
                </div>
              </div>

              {viewMode === "provider" ? (
                <FarmSatelliteImagery
                  farmId={selectedFarm.id}
                  onSwitchToLiveMap={() => setViewMode("live_map")}
                />
              ) : (
                <FullscreenMapPanel title={`${selectedFarm.name} - Live Satellite Map`}>
                  {(isFullscreen) => (
                    <div
                      className={
                        isFullscreen
                          ? "relative w-screen h-screen"
                          : "relative rounded-2xl overflow-hidden border border-[#E2E8F0] h-[500px]"
                      }
                    >
                      <SatelliteLiveMap
                        farmName={selectedFarm.name ?? "Farm"}
                        center={selectedCenter}
                        boundary={selectedBoundaryPoints.length > 0 ? selectedBoundaryPoints : null}
                      />
                      {selectedBoundaryPoints.length === 0 && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/95 rounded-full shadow px-3 py-1.5 text-xs font-medium text-[#CA8A04] z-[1000]">
                          No boundary set - showing an approximate location
                        </div>
                      )}
                    </div>
                  )}
                </FullscreenMapPanel>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}