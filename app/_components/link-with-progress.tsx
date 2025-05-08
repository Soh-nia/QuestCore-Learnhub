"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

interface LinkWithProgressProps {
  href: string
  children: React.ReactNode
  className?: string
  prefetch?: boolean
}

export default function LinkWithProgress({ href, children, className, prefetch = true }: LinkWithProgressProps) {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Reset loading state when the route changes
  useEffect(() => {
    setIsLoading(false)
  }, [pathname, searchParams])

  const handleClick = () => {
    // Only set loading if we're navigating to a different page
    if (pathname !== href) {
      setIsLoading(true)
    }
  }

  return (
    <Link href={href} className={className} onClick={handleClick} prefetch={prefetch}>
      {children}
      {isLoading && (
        <span className="ml-2 inline-block">
          <Loader2 className="h-4 w-4 animate-spin" />
        </span>
      )}
    </Link>
  )
}
