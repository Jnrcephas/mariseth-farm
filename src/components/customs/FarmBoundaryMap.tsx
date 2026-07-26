"use client"
import { MapContainer, TileLayer, Marker, Polygon, useMapEvents } from "react-leaflet"
import L from "leaflet"

function dotIcon(color: string, size = 14) {
  return L.divIcon({
    className: "",
    html: `<div style="width:${size}px;height:${size}px;border-radius:9999px;background:${color};border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35)"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

function ClickCapture({ onAddPoint }: { onAddPoint: (pt: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      onAddPoint([e.latlng.lat, e.latlng.lng])
    },
  })
  return null
}

export default function FarmBoundaryMap({
  center,
  points,
  onAddPoint,
}: {
  center: [number, number]
  points: [number, number][]
  onAddPoint: (pt: [number, number]) => void
}) {
  return (
    <MapContainer center={center} zoom={16} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ClickCapture onAddPoint={onAddPoint} />

      {points.length > 1 && (
        <Polygon
          positions={points}
          pathOptions={{ color: "#4A8D34", weight: 2, fillColor: "#4A8D34", fillOpacity: 0.15 }}
        />
      )}

      {points.map((pt, i) => (
        <Marker key={i} position={pt} icon={dotIcon("#4A8D34")} />
      ))}
    </MapContainer>
  )
}
