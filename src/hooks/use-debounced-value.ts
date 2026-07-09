import { useEffect, useState } from "react"

/**
 * Debounces a fast-changing value (e.g. search input) so that consumers
 * (typically a React Query `queryKey`) only update `delay` ms after the
 * user stops typing, instead of on every keystroke.
 */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timeout)
  }, [value, delay])

  return debounced
}
