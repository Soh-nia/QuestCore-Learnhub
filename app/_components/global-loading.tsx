"use client"

import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

export function GlobalLoading() {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleStart = () => setIsLoading(true)
    const handleComplete = () => setIsLoading(false)

    // Add event listeners for route changes
    window.addEventListener("beforeunload", handleStart)
    window.addEventListener("routeChangeStart", handleStart)
    window.addEventListener("routeChangeComplete", handleComplete)
    window.addEventListener("routeChangeError", handleComplete)

    return () => {
      window.removeEventListener("beforeunload", handleStart)
      window.removeEventListener("routeChangeStart", handleStart)
      window.removeEventListener("routeChangeComplete", handleComplete)
      window.removeEventListener("routeChangeError", handleComplete)
    }
  }, [])

  // Reset loading state when the route changes
  useEffect(() => {
    setIsLoading(false)
  }, [pathname, searchParams])

  if (!isLoading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-cyan-500 via-lime-500 to-cyan-500 animate-gradient-x">
      <div className="fixed top-2 right-2 bg-white dark:bg-neutral-800 rounded-full p-2 shadow-md">
        <Loader2 className="h-5 w-5 animate-spin text-cyan-600" />
      </div>
    </div>
  )
}
