'use client'
import { useEffect, useRef } from 'react'

export function PreloadResources() {
  const loaded = useRef(false)

  useEffect(() => {
    if (loaded.current) {
      return
    }
    loaded.current = true
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = (process.env.NEXT_PUBLIC_CND_PUBLIC_PATH_BASE_URL ?? '') + '/fonts/fonts.min.css'
    document.head.appendChild(link)
  }, [])

  return null
}