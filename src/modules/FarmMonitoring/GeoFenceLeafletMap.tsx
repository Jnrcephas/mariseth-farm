"use client"
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMapEvents } from "react-leaflet"
import L from "leaflet"
import { MonitoredFarm } from "./farmMonitoringData"

function dotIcon(color: string, size = 26) {
  return L.divIcon({
    className: "",
    html: `<div style="width:${size}px;height:${size}px;border-radius:9999px;background:${color};border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35)"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

export interface GeoFenceAsset {
  id: string
  label: string
  lat: number
  lng: number
  status: string
  lastSeen: string
}

// Captures map clicks while in drawing mode and reports each point back up
// to the parent - this is what actually makes the "Draw Boundary" button
// work (GEO-01), with no extra drawing-plugin dependency required.
function DrawClickCapture({ onAddDraftPoint }: { onAddDraftPoint: (pt: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      onAddDraftPoint([e.latlng.lat, e.latlng.lng])
    },
  })
  return null
}

export default function GeoFenceLeafletMap({
  farm,
  assets,
  boundary,
  isDrawing,
  draftPoints,
  onAddDraftPoint,
}: {
  farm: MonitoredFarm
  assets: GeoFenceAsset[]
  boundary: [number, number][] | null
  isDrawing: boolean
  draftPoints: [number, number][]
  onAddDraftPoint: (pt: [number, number]) => void
}) {
  const center: [number, number] = [farm.latLng.lat, farm.latLng.lng]

  return (
    <MapContainer center={center} zoom={16} scrollWheelZoom style={{ height: "100%", width: "100%" }} key={farm.id}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {isDrawing && <DrawClickCapture onAddDraftPoint={onAddDraftPoint} />}

      {/* saved boundary - this farm's own shape, hidden while re-drawing */}
      {!isDrawing && boundary && (
        <Polygon
          positions={boundary}
          pathOptions={{ color: "#4A8D34", weight: 2, fillColor: "#4A8D34", fillOpacity: 0.15, dashArray: "6 4" }}
        >
          <Popup>
            <div style={{ fontSize: 12 }}>
              <p style={{ fontWeight: 600 }}>{farm.name}</p>
              <p>Geofence Zone</p>
            </div>
          </Popup>
        </Polygon>
      )}

      {/* in-progress draft shape while drawing */}
      {isDrawing && draftPoints.length > 0 && (
        <Polygon
          positions={draftPoints}
          pathOptions={{ color: "#F59E0B", weight: 2, fillColor: "#F59E0B", fillOpacity: 0.15, dashArray: "4 3" }}
        />
      )}
      {isDrawing &&
        draftPoints.map((pt, i) => <Marker key={i} position={pt} icon={dotIcon("#F59E0B", 12)} />)}

      <Marker position={center} icon={dotIcon("#EA580C", 34)}>
        <Popup>
          <div style={{ fontSize: 12 }}>
            <p style={{ fontWeight: 600 }}>{farm.name}</p>
            <p>Farm HQ</p>
          </div>
        </Popup>
      </Marker>

      {!isDrawing &&
        assets.map((a) => (
          <Marker key={a.id} position={[a.lat, a.lng]} icon={dotIcon("#64748B")}>
            <Popup>
              <div style={{ fontSize: 12 }}>
                <p style={{ fontWeight: 600, marginBottom: 4 }}>{a.label}</p>
                <p>Geofence Zone: {farm.name}</p>
                <p>Status: {a.status}</p>
                <p>Last seen: {a.lastSeen}</p>
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  )
}