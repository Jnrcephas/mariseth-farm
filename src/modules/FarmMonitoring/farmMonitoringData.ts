// PLACEHOLDER: shared illustrative dataset for Farm Monitoring screens.
// Swap for real farm records + live satellite/weather/soil-air data once
// those integrations exist (SRD Sections 4.1.1, 4.1.2, 4.2.1, 4.2.2).

export type HealthStatus = "healthy" | "watch" | "alert"

export interface MonitoredFarm {
  id: number
  name: string
  leadFarmer: string
  district: string
  health: HealthStatus
  ndvi: number
  lastImageDate: string
  // Illustrative placement on the placeholder CSS map canvas, as a
  // percentage of the container's width/height.
  mapPosition: { top: number; left: number }
  // Real coordinates (Northern Ghana, matching the district names above)
  // for use with an actual map provider (Leaflet/OpenStreetMap, Esri, etc).
  latLng: { lat: number; lng: number }
}

export const MONITORED_FARMS: MonitoredFarm[] = [
  { id: 1, name: "Zuwera Iddrisu Farm", leadFarmer: "Iddrisu Zuwera", district: "Kumbungu District", health: "healthy", ndvi: 0.78, lastImageDate: "08 Jul 2026", mapPosition: { top: 28, left: 62 }, latLng: { lat: 9.549, lng: -0.870 } },
  { id: 2, name: "Zorwee Yewaazun Farm", leadFarmer: "Yewaazun Zorwee", district: "Sawla-Tuna-Kalba District", health: "watch", ndvi: 0.52, lastImageDate: "07 Jul 2026", mapPosition: { top: 55, left: 30 }, latLng: { lat: 9.030, lng: -2.403 } },
  { id: 3, name: "Zien Gbolo Farm", leadFarmer: "Gbolo Zien", district: "Sawla-Tuna-Kalba District", health: "alert", ndvi: 0.31, lastImageDate: "06 Jul 2026", mapPosition: { top: 68, left: 55 }, latLng: { lat: 9.081, lng: -2.451 } },
  { id: 4, name: "Alhassan Mahama Farm", leadFarmer: "Mahama Alhassan", district: "Kumbungu District", health: "healthy", ndvi: 0.81, lastImageDate: "08 Jul 2026", mapPosition: { top: 22, left: 22 }, latLng: { lat: 9.578, lng: -0.831 } },
  { id: 5, name: "Fuseina Abu Farm", leadFarmer: "Abu Fuseina", district: "Kumbungu District", health: "watch", ndvi: 0.49, lastImageDate: "07 Jul 2026", mapPosition: { top: 78, left: 78 }, latLng: { lat: 9.512, lng: -0.912 } },
]

export const HEALTH_STYLES: Record<HealthStatus, { label: string; dot: string; bg: string; fg: string; badge: string }> = {
  healthy: { label: "Healthy", dot: "#22C55E", bg: "#DCFCE7", fg: "#16A34A", badge: "bg-[#DCFCE7] text-[#16A34A]" },
  watch: { label: "Watch", dot: "#EAB308", bg: "#FEF9C3", fg: "#CA8A04", badge: "bg-[#FEF9C3] text-[#CA8A04]" },
  alert: { label: "Alert", dot: "#EF4444", bg: "#FEE2E2", fg: "#DC2626", badge: "bg-[#FEE2E2] text-[#DC2626]" },
}