'use client'
import { useEffect, useRef } from 'react'
import { activeCurrentTheme } from '@/lib/useTheme'


export function PreloadResources() {
  const loaded = useRef(false)

  useEffect(() => {
    if (loaded.current) {
      return
    }
    loaded.current = true
    activeCurrentTheme()
  }, [])

  return null
}