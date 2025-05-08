"use client"

import { useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"

// This component prefetches common routes in the background
export default function PrefetchLinks() {
  const router = useRouter()

  const prefetchRoutes = useCallback(() => {
    // Prefetch common instructor dashboard routes
    router.prefetch("/dashboard/instructor")
    router.prefetch("/dashboard/instructor/courses")
    router.prefetch("/dashboard/instructor/enrollments")
    router.prefetch("/dashboard")
    router.prefetch("/courses")
    router.prefetch("/")

    // You can add more routes to prefetch here
  }, [router])

  useEffect(() => {
    // Wait until the page is fully loaded and idle
    if (typeof window !== "undefined") {
      if ("requestIdleCallback" in window) {
        // Use requestIdleCallback if available
        window.requestIdleCallback(prefetchRoutes)
      } else {
        // Fallback to setTimeout
        setTimeout(prefetchRoutes, 2000)
      }
    }
  }, [prefetchRoutes])

  return null
}
