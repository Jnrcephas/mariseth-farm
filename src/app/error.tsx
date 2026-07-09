"use client"

import RouteError from "@/components/RouteError"

// This sits one level above src/app/app/layout.tsx and src/app/(auth)/layout.tsx.
// It's the boundary that actually catches an error thrown by
// src/app/app/layout.tsx itself (the sidebar/top-nav shell) - per Next.js's
// error.tsx model, a segment's own layout.tsx errors are only caught by an
// error.tsx one level up, never by an error.tsx in that same segment. The
// per-hub error.tsx files (farm-management/error.tsx, etc.) only catch
// errors from the page content *inside* that shell, not the shell itself.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <RouteError error={error} reset={reset} />
}
