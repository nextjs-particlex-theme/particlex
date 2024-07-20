'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faIdCard, faBoxArchive, faBookmark, faTags  } from '@fortawesome/free-solid-svg-icons'
import styles from './header.module.scss'

interface HeaderProps {
  /**
   * 当滑动到顶部时，自动透明. 默认 false
   */
  autoTransparentOnTop?: boolean
  /**
   * 博客标题
   */
  title: string
}

type HeaderStyle = {
  height: string
  backgroundColorClass: string
}

const Header:React.FC<HeaderProps> = props => {
  const [headerStyle, setHeaderStyle] = useState<HeaderStyle>({
    height: '3.3rem',
    backgroundColorClass: props.autoTransparentOnTop ? 'bg-transparent' : 'bg-blue-300'
  })
  useEffect(() => {
    const wheelListener = (ev: WheelEvent) => {
      if (ev.deltaY < 0) {
        setHeaderStyle({
          height: '3.3rem',
          backgroundColorClass: props.autoTransparentOnTop && document.documentElement.scrollTop <= window.innerHeight ? 'bg-transparent' : 'bg-blue-300'
        })
        console.log(document.documentElement.scrollTop, window.innerHeight)
      } else {
        setHeaderStyle({
          backgroundColorClass: 'bg-blue-300',
          height: '0'
        })
      }
    }
    addEventListener('wheel', wheelListener)
    return () => {
      removeEventListener('wheel', wheelListener)
    }
  }, [props.autoTransparentOnTop])

  return (
    <div className={`font-bold text-sm pl-16 text-zinc-600 flex-row flex ${styles.header} ${headerStyle.backgroundColorClass}`} style={{ height: headerStyle.height }}>
      <Link href="/" className="pl-10">
        { props.title }
      </Link>
      <div className="flex">
        <Link href="/" className="flex pl-10">
          <FontAwesomeIcon icon={faHouse} size="lg" width="1rem" />
          <span className="pl-2">Home</span>
        </Link>
        <Link href="/about" className="flex pl-10">
          <FontAwesomeIcon icon={faIdCard} size="lg" width="1rem" />
          <span className="pl-2">About</span>
        </Link>
        <Link href="/archives" className="flex pl-10">
          <FontAwesomeIcon icon={faBoxArchive} size="lg" width="1rem" />
          <span className="pl-2">Archives</span>
        </Link>
        <Link href="/categories" className="flex pl-10">
          <FontAwesomeIcon icon={faBookmark} size="lg" width="0.7rem" />
          <span className="pl-2">Categories</span>
        </Link>
        <Link href="/categories" className="flex pl-10">
          <FontAwesomeIcon icon={faTags} size="lg" width="1rem" />
          <span className="pl-2">Tags</span>
        </Link>
      </div>
    </div>
  )
}

export default Header