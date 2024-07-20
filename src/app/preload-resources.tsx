'use client'
import { useEffect, useRef } from 'react'

export function PreloadResources() {
  const loaded = useRef(false)
  useEffect(() => {
    const CND_PUBLIC_PATH_BASE_URL = process.env.NEXT_PUBLIC_CND_PUBLIC_PATH_BASE_URL
    if (CND_PUBLIC_PATH_BASE_URL && !loaded.current) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = CND_PUBLIC_PATH_BASE_URL + '/fonts.min.css'
      document.head.appendChild(link)
      loaded.current = true
    }
  }, [])

  return null
}