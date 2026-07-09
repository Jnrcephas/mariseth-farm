"use client"

import RouteError from "@/components/RouteError"

// This is a level above the 15 per-hub error.tsx files (farm-management,
// dashboard, etc). It's a safety net for any route added later under
// /app/app/* that doesn't get its own error.tsx.
//
// NOTE: per Next.js's error.tsx model, an error.tsx never catches errors
// thrown by the layout.tsx in that *same* segment - only by what's nested
// inside it. So this file can catch a bug in a hub page component, but NOT
// a bug in src/app/app/layout.tsx (the sidebar/top-nav shell) - that needs
// a boundary one level up, see src/app/error.tsx.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <RouteError error={error} reset={reset} />
}
