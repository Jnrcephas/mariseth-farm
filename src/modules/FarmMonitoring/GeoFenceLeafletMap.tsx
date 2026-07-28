"use client"
import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline, useMap } from "react-leaflet"
import L from "leaflet"
import { MonitoredFarm } from "./farmMonitoringData"

function dotIcon(color: string, size = 26, label?: string) {
  return L.divIcon({
    className: "",
    html: `<div style="width:${size}px;height:${size}px;border-radius:9999px;background:${color};border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;color:white;font-size:${Math.round(
      size * 0.42
    )}px;font-weight:700;font-family:sans-serif;">${label ?? ""}</div>`,
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

// Pans to whichever coordinate was most recently entered in the form, so
// the admin can visually confirm each point lands where they expect.
function FlyToLatest({ point }: { point: [number, number] | null }) {
  const map = useMap()
  useEffect(() => {
    if (point) map.flyTo(point, Math.max(map.getZoom(), 16), { duration: 0.6 })
  }, [point, map])
  return null
}

export default function GeoFenceLeafletMap({
  farm,
  assets,
  boundary,
  draftPoints,
}: {
  farm: MonitoredFarm
  assets: GeoFenceAsset[]
  boundary: [number, number][] | null
  draftPoints: [number, number][]
}) {
  const center: [number, number] = [farm.latLng.lat, farm.latLng.lng]
  const latestDraftPoint = draftPoints.length > 0 ? draftPoints[draftPoints.length - 1] : null

  return (
    <MapContainer center={center} zoom={16} scrollWheelZoom style={{ height: "100%", width: "100%" }} key={farm.id}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FlyToLatest point={latestDraftPoint} />

      {/* saved boundary - hidden while re-entering a new one */}
      {draftPoints.length === 0 && boundary && (
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

      {/* live preview of coordinates entered so far */}
      {draftPoints.length >= 2 && (
        <Polyline
          positions={draftPoints}
          pathOptions={{ color: "#F59E0B", weight: 3, dashArray: "4 3" }}
        />
      )}
      {draftPoints.map((pt, i) => (
        <Marker key={i} position={pt} icon={dotIcon(i === 0 ? "#4A8D34" : "#F59E0B", 24, String(i + 1))}>
          <Popup>Point {i + 1}: {pt[0].toFixed(5)}, {pt[1].toFixed(5)}</Popup>
        </Marker>
      ))}

      <Marker position={center} icon={dotIcon("#EA580C", 34)}>
        <Popup>
          <div style={{ fontSize: 12 }}>
            <p style={{ fontWeight: 600 }}>{farm.name}</p>
            <p>Farm HQ</p>
          </div>
        </Popup>
      </Marker>

      {draftPoints.length === 0 &&
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