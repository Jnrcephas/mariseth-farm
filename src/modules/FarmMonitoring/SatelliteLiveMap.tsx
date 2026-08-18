"use client"
// Frontend-only fallback for the Satellite tab, while the
// /agro-monitoring/{farm_id}/satellite-images backend endpoint is unreliable.
//
// This does NOT call that endpoint at all - it renders real satellite
// basemap imagery (Esri World Imagery, free tier, no API key) directly in
// the browser via Leaflet, and overlays the farm's own registered boundary
// (same `boundary` GeoJSON field GeoFencingManager reads/writes) on top of
// it. So stakeholders get an always-available, real satellite picture of
// the farm's location today, independent of the provider-imagery backend.
//
// Not a replacement for FarmSatelliteImagery (that one gives dated,
// per-band imagery + NDVI/EVI/etc indices that only the backend/provider
// can supply) - this is a live "where is this farm, what does the ground
// look like right now" view, offered as an alternative tab.
import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet"
import L from "leaflet"
import type { LatLngPoint } from "@/lib/geo/boundary"

function farmMarkerIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="width:26px;height:26px;border-radius:9999px;background:#EA580C;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35)"></div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  })
}

export default function SatelliteLiveMap({
  farmName,
  center,
  boundary,
}: {
  farmName: string
  center: { lat: number; lng: number }
  boundary: LatLngPoint[] | null
}) {
  const zoom = boundary && boundary.length > 0 ? 16 : 13

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      scrollWheelZoom
      style={{ height: "100%", width: "100%" }}
      key={`${farmName}-${center.lat}-${center.lng}`}
    >
      <TileLayer
        attribution="Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics"
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        maxZoom={19}
      />

      {boundary && boundary.length > 0 && (
        <Polygon
          positions={boundary}
          pathOptions={{ color: "#4ADE80", weight: 2, fillColor: "#4ADE80", fillOpacity: 0.12 }}
        >
          <Popup>
            <div style={{ fontSize: 12 }}>
              <p style={{ fontWeight: 600 }}>{farmName}</p>
              <p>Registered boundary</p>
            </div>
          </Popup>
        </Polygon>
      )}

      <Marker position={[center.lat, center.lng]} icon={farmMarkerIcon()}>
        <Popup>
          <div style={{ fontSize: 12 }}>
            <p style={{ fontWeight: 600 }}>{farmName}</p>
            <p>{boundary && boundary.length > 0 ? "Boundary centroid" : "Approximate location (no boundary set)"}</p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  )
}