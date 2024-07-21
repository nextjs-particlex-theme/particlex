'use client'
import { useEffect, useRef } from 'react'

export function PreloadResources() {
  const loaded = useRef(false)
  useEffect(() => {
    if (loaded.current) {
      return
    }
    let path = process.env.NEXT_PUBLIC_CND_PUBLIC_PATH_BASE_URL
    loaded.current = true
    if (path) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = path + '/fonts.min.css'
      document.head.appendChild(link)
    }
    path = process.env.NEXT_PUBLIC_HIGHLIGHT_JS_CSS_PATH
    if (path) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = path
      document.head.appendChild(link)
    }


  }, [])

  return null
}