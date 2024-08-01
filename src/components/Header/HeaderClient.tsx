'use client'
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import styles from './header.module.scss'
import { Icons } from '@/app/svg-symbols'

interface HeaderClientProps {
  /**
   * 当滑动到顶部时，自动透明. 默认 false
   */
  autoTransparentOnTop?: boolean
  /**
   * 博客标题
   */
  title: string
  /**
   * 显示关于页面
   */
  showAboutPage: boolean
  /**
   * 关于页面路由
   */
  aboutPageUrl: string
}

/**
 * 头部组件
 */
const HeaderClient:React.FC<HeaderClientProps> = props => {
  const [headerClass, setHeaderClass] = useState(styles.headerNormalVisible)
  const lastScrollTop = useRef(0)
  const [headerVisible, setHeaderVisible] = useState(true)

  useEffect(() => {
    const wheelListener = () => {
      const gap = Math.abs(lastScrollTop.current - document.documentElement.scrollTop)
      // FIX: 点击首页圆球滑动到底部文章后会显示 header.
      if (gap < 45 && document.documentElement.scrollTop < window.innerHeight + 100) {
        return
      }
      const isUp = lastScrollTop.current >= document.documentElement.scrollTop
      lastScrollTop.current = document.documentElement.scrollTop
      if (isUp) {
        if (document.documentElement.scrollTop <= window.innerHeight && props.autoTransparentOnTop) {
          setHeaderClass(styles.headerTransparentVisible)
        } else {
          setHeaderClass(styles.headerNormalVisible)
        }
        setHeaderVisible(true)
      } else {
        setHeaderVisible(false)
      }
    }
    addEventListener('scroll', wheelListener)
    return () => {
      removeEventListener('scroll', wheelListener)
    }
  }, [props.autoTransparentOnTop])

  useEffect(() => {
    if (props.autoTransparentOnTop) {
      setHeaderClass(document.documentElement.scrollTop <= window.innerHeight ? styles.headerTransparentVisible : styles.headerVisible)
    } else {
      setHeaderClass(styles.headerNormalVisible)
    }
  }, [props.autoTransparentOnTop])

  return (
    <div className={`font-bold text-sm pl-16 text-zinc-600 flex-row flex ${styles.header} ${headerClass}`} style={headerVisible ? undefined : { height: 0 }}>
      <Link href="/" className="pl-10">
        { props.title }
      </Link>
      <div className="flex">
        <Link href="/" className="flex pl-10 items-center">
          <svg viewBox="0 0 576 512" width={15} height={15}>
            <path
              fill="currentColor"
              d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"/>
          </svg>
          <span className="pl-2">Home</span>
        </Link>
        {
          props.showAboutPage ? (
            <Link href={props.aboutPageUrl} className="flex pl-10 items-center">
              <svg viewBox="0 0 576 512" width={15} height={15}>
                <path
                  fill="currentColor"
                  d="M0 96l576 0c0-35.3-28.7-64-64-64L64 32C28.7 32 0 60.7 0 96zm0 32L0 416c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-288L0 128zM64 405.3c0-29.5 23.9-53.3 53.3-53.3l117.3 0c29.5 0 53.3 23.9 53.3 53.3c0 5.9-4.8 10.7-10.7 10.7L74.7 416c-5.9 0-10.7-4.8-10.7-10.7zM176 192a64 64 0 1 1 0 128 64 64 0 1 1 0-128zm176 16c0-8.8 7.2-16 16-16l128 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-128 0c-8.8 0-16-7.2-16-16zm0 64c0-8.8 7.2-16 16-16l128 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-128 0c-8.8 0-16-7.2-16-16zm0 64c0-8.8 7.2-16 16-16l128 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-128 0c-8.8 0-16-7.2-16-16z"/>
              </svg>
              <span className="pl-2">About</span>
            </Link>
          ) : null
        }
        <Link href="/archives" className="flex pl-10 items-center">
          <svg width={14} height={14}>
            <use xlinkHref={Icons.BOX_ARCHIVE}/>
          </svg>
          <span className="pl-2">Archives</span>
        </Link>
        <Link href="/categories" className="flex pl-10 items-center">
          <svg width={14} height={14}>
            <use xlinkHref={Icons.BOOKMARK}/>
          </svg>
          <span className="pl-2">Categories</span>
        </Link>
        <Link href="/tags" className="flex pl-10 items-center">
          <svg width={16} height={15}>
            <use xlinkHref={Icons.TAG}/>
          </svg>
          <span className="pl-2">Tags</span>
        </Link>
      </div>
    </div>
  )
}

export default HeaderClient