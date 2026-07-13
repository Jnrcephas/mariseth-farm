"use client"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import { MONITORED_FARMS, HEALTH_STYLES } from "./farmMonitoringData"

function dotIcon(color: string, size = 26) {
  return L.divIcon({
    className: "",
    html: `<div style="width:${size}px;height:${size}px;border-radius:9999px;background:${color};border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35)"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

export default function SatelliteLeafletMap({
  onSelectFarm,
}: {
  onSelectFarm: (id: number) => void
}) {
  const center: [number, number] = [MONITORED_FARMS[0].latLng.lat, MONITORED_FARMS[0].latLng.lng]

  return (
    <MapContainer center={center} zoom={9} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
      {/* Esri World Imagery - free, no API key, real satellite photography */}
      <TileLayer
        attribution="Tiles &copy; Esri"
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />
      {MONITORED_FARMS.map((farm) => (
        <Marker
          key={farm.id}
          position={[farm.latLng.lat, farm.latLng.lng]}
          icon={dotIcon(HEALTH_STYLES[farm.health].dot)}
          eventHandlers={{ click: () => onSelectFarm(farm.id) }}
        >
          <Popup>
            <div style={{ fontSize: 12 }}>
              <p style={{ fontWeight: 600, marginBottom: 4 }}>{farm.name}</p>
              <p>Status: {HEALTH_STYLES[farm.health].label}</p>
              <p>NDVI Score: {farm.ndvi.toFixed(2)}</p>
              <p>Lead Farmer: {farm.leadFarmer}</p>
              <p>Last image: {farm.lastImageDate}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}