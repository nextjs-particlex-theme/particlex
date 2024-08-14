'use client'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import styles from '@/components/Header/header.module.scss'
import HeaderClient from '@/components/Header/HeaderClient'
import HeaderClientMobile from '@/components/Header/HeaderClientMobile'

interface HeaderClientAdapterProps {
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
 * 头部适配器. 用于尽量减少重复代码
 * @param props
 * @constructor
 */
const HeaderClientAdapter:React.FC<HeaderClientAdapterProps> = props => {
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
    <div id="header">
      <HeaderClient {...props} headerClass={headerClass} headerVisible={headerVisible}/>
      <HeaderClientMobile {...props} headerClass={headerClass} headerVisible={headerVisible}/>
    </div>
  )
}

export default HeaderClientAdapter
