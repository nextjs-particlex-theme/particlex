'use client'
import { useEffect, useRef } from 'react'

function importStaticCss(url: string) {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = (process.env.NEXT_PUBLIC_CND_PUBLIC_PATH_BASE_URL ?? '') + url
  document.head.appendChild(link)
}

export function PreloadResources() {
  const loaded = useRef(false)

  useEffect(() => {
    if (loaded.current) {
      return
    }
    loaded.current = true
    importStaticCss('/fonts/fonts.min.css')
    importStaticCss('/css/github.min.css')

    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  return null
}