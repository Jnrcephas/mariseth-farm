// Leaflet/the map draws points as [lat, lng].
// GeoJSON Polygon requires [lng, lat], and the ring must be closed
// (first point repeated as the last point).

export type LatLngPoint = [number, number] // [lat, lng]

export interface GeoJSONPolygon {
  type: "Polygon"
  coordinates: number[][][] // [ [ [lng, lat], [lng, lat], ... ] ]
}

export function pointsToGeoJSONPolygon(points: LatLngPoint[]): GeoJSONPolygon | null {
  if (!points || points.length < 3) return null

  const ring = points.map(([lat, lng]) => [lng, lat])

  // Close the ring if not already closed
  const first = ring[0]
  const last = ring[ring.length - 1]
  if (first[0] !== last[0] || first[1] !== last[1]) {
    ring.push([...first])
  }

  return { type: "Polygon", coordinates: [ring] }
}

export function geoJSONPolygonToPoints(polygon: GeoJSONPolygon | null | undefined): LatLngPoint[] {
  if (!polygon || polygon.type !== "Polygon" || !polygon.coordinates?.[0]) return []

  const ring = polygon.coordinates[0]
  // Drop the closing point (duplicate of first) when feeding back into the map editor
  const isClosed =
    ring.length > 1 &&
    ring[0][0] === ring[ring.length - 1][0] &&
    ring[0][1] === ring[ring.length - 1][1]
  const openRing = isClosed ? ring.slice(0, -1) : ring

  return openRing.map(([lng, lat]) => [lat, lng] as LatLngPoint)
}

// Simple centroid (average of vertices) - fine for the small, roughly-convex
// farm plots this app deals with. Not a true geographic/area centroid, but
// doesn't need to be for "where do I center the map" purposes.
export function centroidOfPoints(points: LatLngPoint[]): { lat: number; lng: number } | null {
  if (!points || points.length === 0) return null
  const sum = points.reduce(
    (acc, [lat, lng]) => ({ lat: acc.lat + lat, lng: acc.lng + lng }),
    { lat: 0, lng: 0 }
  )
  return { lat: sum.lat / points.length, lng: sum.lng / points.length }
}

// Used only when a farm has no boundary yet and therefore no coordinates
// at all in the current schema. Centered roughly on Ghana so the map isn't
// blank/at (0,0) - replace once farms carry a real lat/lng or centroid field.
export const DEFAULT_MAP_CENTER = { lat: 7.9465, lng: -1.0232 }