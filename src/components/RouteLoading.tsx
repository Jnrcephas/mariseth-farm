import { Loader2 } from "lucide-react"

/**
 * Used as the content of every `loading.tsx` under src/app/app/*.
 *
 * This is intentionally NOT the full-screen `SuspenseLoader` used at the
 * root of the app (that one is `fixed inset-0 z-50` and covers the entire
 * viewport, sidebar and all - fine for the very first app load, but jarring
 * if it flashed over the sidebar/top nav on every single in-app
 * navigation). This one just fills the content area inside
 * `MainBaseLayout`, so the sidebar and top nav stay put and only the page
 * content area shows a loading state while Next.js fetches the next
 * route's segment.
 */
export default function RouteLoading() {
  return (
    <div className="flex h-[60vh] w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-[#4A8D34]" />
    </div>
  )
}
