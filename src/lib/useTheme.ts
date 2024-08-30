import { useEffect, useState } from 'react'

export const UseTheme = {
  SYSTEM: 'system',
  DARK: 'dark',
  LIGHT: 'light'
}

type AvailableThemes = keyof typeof UseTheme
const THEME_VALUES = Object.keys(UseTheme) as AvailableThemes[]

function toggleThemeClassname(theme: AvailableThemes) {
  const i = THEME_VALUES.findIndex(v => v === theme)
  console.log(THEME_VALUES)
  if (i == -1) {
    return
  }
  const toBeRemovedClasses: string[] = []
  for (let j = 0; j < i; j++) {
    toBeRemovedClasses.push(UseTheme[THEME_VALUES[j]])
  }
  for (let j = i + 1; j < THEME_VALUES.length; ++j) {
    toBeRemovedClasses.push(UseTheme[THEME_VALUES[j]])
  }
  document.documentElement.classList.remove(...toBeRemovedClasses)
  document.documentElement.classList.add(UseTheme[THEME_VALUES[i]])
  localStorage.setItem('theme', THEME_VALUES[i])
}

export const activeCurrentTheme = (theme?: AvailableThemes) => {
  if (!theme) {
    theme = guessCurrentTheme()
  }
  toggleThemeClassname(theme)
  if (theme === 'SYSTEM') {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add(UseTheme.DARK)
    }
  }
}

function guessCurrentTheme(): AvailableThemes {
  let theme: AvailableThemes
  const t = localStorage.getItem('theme') as AvailableThemes | null
  if (t) {
    theme = (UseTheme as Record<string, string>)[t] ? t : 'SYSTEM'
  } else {
    // use system prefer
    theme = 'SYSTEM'
  }
  return theme
}

type CurrentTheme = {
  theme: AvailableThemes
  pos: number
}

/**
 * 切换到下个主题
 */
type NextTheme = () => void

type UseThemeReturnValue = [AvailableThemes, NextTheme]

const useTheme = (): UseThemeReturnValue => {
  const [theme, setTheme] = useState<CurrentTheme>({ pos: 0, theme: 'SYSTEM' })
  
  useEffect(() => {
    const theme = guessCurrentTheme()
    activeCurrentTheme(theme)
    const pos = THEME_VALUES.findIndex(v => theme === v)
    setTheme({
      pos,
      theme
    })
  }, [])

  const nextTheme = () => {
    const nextPos = (theme.pos + 1) % THEME_VALUES.length
    setTheme({
      pos: nextPos,
      theme: THEME_VALUES[nextPos]
    })
    activeCurrentTheme(THEME_VALUES[nextPos])
  }

  return [theme.theme, nextTheme]
}

export default useTheme