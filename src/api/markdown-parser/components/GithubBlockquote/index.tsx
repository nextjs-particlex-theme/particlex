import { Icons } from '@/app/svg-symbols'
import styles from '@/api/markdown-parser/components/GithubBlockquote/blockquote.module.scss'
import type React from 'react'
import { concatClassName } from '@/lib/DomUtils'

type BlockquoteAvailableTypes = 'NOTE' | 'TIP' | 'IMPORTANT' | 'WARNING' | 'CAUTION'

export interface GithubCodeBlockProps {
  icon: string
  colors: string
  tip: string
  width?: number
  height?: number
}

function initConstant(): Record<string, GithubCodeBlockProps | undefined> {
  let map0: Record<BlockquoteAvailableTypes, GithubCodeBlockProps>
  map0 = {
    NOTE: {
      icon: Icons.INFO,
      colors: styles.note,
      tip: 'Note'
    },
    CAUTION: {
      icon: Icons.INFO,
      colors: styles.caution,
      tip: 'Caution'
    },
    TIP: {
      icon: Icons.LIGHTBULB,
      colors: styles.tip,
      tip: 'Tip'
    },
    IMPORTANT: {
      icon: Icons.STAR,
      colors: styles.important,
      tip: 'Important'
    },
    WARNING: {
      icon: Icons.WARNING,
      colors: styles.warning,
      tip: 'Warning',
      width: 17,
      height: 17
    }
  }
  return map0
}

export const SUPPORTED_TYPE = initConstant()


const GithubBlockquote: React.FC<React.PropsWithChildren<GithubCodeBlockProps>> = ({
  children,
  colors,
  icon,
  tip,
  height = 15,
  width = 15
}) => {
  return (
    <blockquote className={concatClassName(styles.githubBlockquote, colors)}>
      <div className="flex items-center mt-4">
        <svg width={width} height={height} >
          <use xlinkHref={icon}/>
        </svg>
        <span className="ml-2">{ tip }</span>
      </div>
      {children}
    </blockquote>
  )
}
export default GithubBlockquote