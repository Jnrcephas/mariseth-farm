"use client"
import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet"
import L from "leaflet"
import { MonitoredFarm } from "./farmMonitoringData"

function dotIcon(color: string, size = 28) {
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

export default function GeoFenceLeafletMap({
  farm,
  assets,
  configured,
}: {
  farm: MonitoredFarm
  assets: GeoFenceAsset[]
  configured: boolean
}) {
  const center: [number, number] = [farm.latLng.lat, farm.latLng.lng]
  // Illustrative boundary - a rough pentagon around the farm's center point.
  const d = 0.006
  const boundary: [number, number][] = [
    [center[0] + d, center[1] - d * 0.6],
    [center[0] + d * 0.5, center[1] + d],
    [center[0] - d * 0.6, center[1] + d * 0.8],
    [center[0] - d, center[1] - d * 0.3],
    [center[0] - d * 0.3, center[1] - d],
  ]

  return (
    <MapContainer center={center} zoom={16} scrollWheelZoom style={{ height: "100%", width: "100%" }} key={farm.id}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {configured && (
        <Polygon
          positions={boundary}
          pathOptions={{ color: "#4A8D34", weight: 2, fillColor: "#4A8D34", fillOpacity: 0.15, dashArray: "6 4" }}
        />
      )}
      <Marker position={center} icon={dotIcon("#F59E0B", 34)}>
        <Popup>
          <div style={{ fontSize: 12 }}>
            <p style={{ fontWeight: 600, marginBottom: 2 }}>{farm.name}</p>
            <p>Farm HQ</p>
          </div>
        </Popup>
      </Marker>
      {assets.map((a) => (
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