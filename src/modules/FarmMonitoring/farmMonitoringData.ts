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
}

export const MONITORED_FARMS: MonitoredFarm[] = [
  { id: 1, name: "Zuwera Iddrisu Farm", leadFarmer: "Iddrisu Zuwera", district: "Kumbungu District", health: "healthy", ndvi: 0.78, lastImageDate: "08 Jul 2026" },
  { id: 2, name: "Zorwee Yewaazun Farm", leadFarmer: "Yewaazun Zorwee", district: "Sawla-Tuna-Kalba District", health: "watch", ndvi: 0.52, lastImageDate: "07 Jul 2026" },
  { id: 3, name: "Zien Gbolo Farm", leadFarmer: "Gbolo Zien", district: "Sawla-Tuna-Kalba District", health: "alert", ndvi: 0.31, lastImageDate: "06 Jul 2026" },
  { id: 4, name: "Alhassan Mahama Farm", leadFarmer: "Mahama Alhassan", district: "Kumbungu District", health: "healthy", ndvi: 0.81, lastImageDate: "08 Jul 2026" },
  { id: 5, name: "Fuseina Abu Farm", leadFarmer: "Abu Fuseina", district: "Kumbungu District", health: "watch", ndvi: 0.49, lastImageDate: "07 Jul 2026" },
]

export const HEALTH_STYLES: Record<HealthStatus, { label: string; dot: string; bg: string; fg: string; badge: string }> = {
  healthy: { label: "Healthy", dot: "#22C55E", bg: "#DCFCE7", fg: "#16A34A", badge: "bg-[#DCFCE7] text-[#16A34A]" },
  watch: { label: "Watch", dot: "#EAB308", bg: "#FEF9C3", fg: "#CA8A04", badge: "bg-[#FEF9C3] text-[#CA8A04]" },
  alert: { label: "Alert", dot: "#EF4444", bg: "#FEE2E2", fg: "#DC2626", badge: "bg-[#FEE2E2] text-[#DC2626]" },
}