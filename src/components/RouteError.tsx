"use client"

import { useEffect } from "react"
import { AlertTriangle, RotateCcw, Home } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { routeTo } from "@/lib/constants"

interface RouteErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Used as the content of every `error.tsx` under src/app/app/*.
 *
 * Next.js wraps each route segment's `page.tsx` (and everything nested
 * under it) in a React error boundary automatically when an `error.tsx`
 * file is present in that segment - if a render throws (a bad API
 * response shape, a null field the component didn't guard against, etc.)
 * this shows instead of a blank white screen / fully broken app shell.
 * `reset()` re-renders the segment from scratch (useful when the error was
 * caused by a transient bad response and a retry would succeed);
 * "Go to Dashboard" is the escape hatch for when it isn't.
 *
 * Like RouteLoading, this intentionally stays scoped to the content area
 * rather than covering the whole viewport, so the sidebar/top nav (owned by
 * the parent layout, outside this boundary) stay usable even when a page
 * errors out - the person can still navigate elsewhere.
 */
export default function RouteError({ error, reset }: RouteErrorProps) {
  useEffect(() => {
    // Swap this for a real error-reporting call (Sentry, etc.) once one is
    // wired up - for now this at least keeps the failure visible in the
    // console/server logs instead of silently vanishing.
    console.error(error)
  }, [error])

  return (
    <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-4 text-center px-4">
      <div className="rounded-full bg-red-50 p-4">
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-black">Something went wrong</h2>
        <p className="text-sm text-[#64748B] mt-1 max-w-md">
          This page ran into a problem while loading. You can try again, or head back to the dashboard.
        </p>
      </div>
      <div className="flex items-center gap-3 mt-2">
        <Button
          onClick={reset}
          variant="outline"
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Try again
        </Button>
        <Link href={routeTo.dashboard}>
          <Button className="gap-2 bg-[#4A8D34] hover:bg-[#4A8D34]">
            <Home className="h-4 w-4" />
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}
