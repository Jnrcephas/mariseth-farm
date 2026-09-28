"use client"
import { useEffect, useRef } from "react"
import { MapContainer, TileLayer, Marker, Polygon, useMap, useMapEvents } from "react-leaflet"
import L from "leaflet"

// Rough bounding box around Ghana ([south, west], [north, east]). The map
// can't be panned outside this box. It's a rectangle, not the exact
// national border, so slivers of neighbouring countries show near the edges.
const GHANA_BOUNDS: L.LatLngBoundsExpression = [
  [4.5, -3.6],
  [11.3, 1.4],
]

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

// Zooms to the saved boundary when the map first opens (and again whenever
// `trigger` changes, e.g. after pasting a coordinate list). It deliberately
// does NOT re-fit on every added point, otherwise the map would jump around
// while you're clicking out a shape.
function FitToPoints({ points, trigger }: { points: [number, number][]; trigger: number }) {
  const map = useMap()
  const pointsRef = useRef(points)
  pointsRef.current = points

  useEffect(() => {
    // The map usually mounts inside an animating dialog, so its container
    // size is wrong for the first moments - recalc before fitting.
    const t = setTimeout(() => {
      map.invalidateSize()
      const pts = pointsRef.current
      if (pts.length > 0) {
        map.fitBounds(L.latLngBounds(pts), { padding: [30, 30], maxZoom: 18 })
      }
    }, 250)
    return () => clearTimeout(t)
  }, [map, trigger])

  return null
}

export default function FarmBoundaryMap({
  center,
  points,
  onAddPoint,
  fitTrigger = 0,
}: {
  center: [number, number]
  points: [number, number][]
  onAddPoint: (pt: [number, number]) => void
  fitTrigger?: number
}) {
  return (
    <MapContainer
      center={center}
      zoom={7}
      minZoom={6}
      maxZoom={19}
      maxBounds={GHANA_BOUNDS}
      maxBoundsViscosity={1.0}
      scrollWheelZoom
      style={{ height: "100%", width: "100%" }}
    >
      {/* Satellite imagery (Esri World Imagery) - free, no API key */}
      <TileLayer
        attribution="Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics"
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        maxNativeZoom={18}
        maxZoom={19}
      />
      {/* Place names and borders over the imagery, to help find your area */}
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
        maxNativeZoom={18}
        maxZoom={19}
      />

      <ClickCapture onAddPoint={onAddPoint} />
      <FitToPoints points={points} trigger={fitTrigger} />

      {points.length > 1 && (
        <Polygon
          positions={points}
          pathOptions={{ color: "#4A8D34", weight: 3, fillColor: "#4A8D34", fillOpacity: 0.25 }}
        />
      )}

      {points.map((pt, i) => (
        <Marker key={i} position={pt} icon={dotIcon("#4A8D34")} />
      ))}
    </MapContainer>
  )
}