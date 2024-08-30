'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { concatClassName } from '@/lib/DomUtils'
import styles from './header.module.scss'
import { Icons } from '@/app/svg-symbols'
import Drawer from '@/components/Drawer'
import Image from 'next/image'
import { HeaderStatus } from '@/components/Header/header-types'
import ThemeToggleButton from '@/components/Header/ThemeToggleButton'

interface HeaderClientMobileProps {
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
  /**
   * 头部状态
   */
  status: HeaderStatus
}


const NavButton:React.FC<React.PropsWithChildren<{href: string}>> = props => {
  return (
    <Link href={props.href} className="box-border p-3 w-full">
      <div className="bg-white w-full flex py-3 rounded-3xl px-6">
        {props.children}
      </div>
    </Link>
  )
}

/**
 * 移动端的头部组件.
 * @param props
 * @constructor
 */
const HeaderClientMobile: React.FC<HeaderClientMobileProps> = props => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  
  const onMenuClick = () => {
    setDrawerOpen(true)
  }

  const onClose = () => {
    setDrawerOpen(false)
  }

  let headerClass: string | undefined
  if (props.status === HeaderStatus.VISIBLE) {
    headerClass = styles.headerNormalVisible
  } else if (props.status === HeaderStatus.VISIBLE_TRANSPARENT) {
    headerClass = styles.headerTransparentVisible
  }
  
  return (
    <>
      <div
        className={concatClassName('md:hidden fixed w-screen flex items-center justify-between', styles.headerMobile, headerClass)}
        style={props.status !== HeaderStatus.HIDDEN ? undefined : { height: 0 }}>
        <svg xmlns="http://www.w3.org/2000/svg" onClick={onMenuClick}
          width={18} height={18}
          viewBox="0 0 448 512">
          <path
            fill="currentColor"
            d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"/>
        </svg>
        <Link href="/">
          {props.title}
        </Link>
        <div>
          <ThemeToggleButton/>
        </div>
      </div>
      <Drawer open={drawerOpen} onClose={onClose}>
        <div className="flex flex-col items-center py-8 box-border">
          <Image src="/favicon.ico" alt="Favicon" width={40} height={40}/>
          <div className="text-primary text-lg">
            { props.title }
          </div>
          <div className="w-2/3 border"/>
          <NavButton href="/">
            <svg width={15} height={15}>
              <use xlinkHref={Icons.HOME}/>
            </svg>
            <span className="pl-3">Home</span>
          </NavButton>
          {
            props.showAboutPage ? (
              <NavButton href={props.aboutPageUrl}>
                <svg width={15} height={15}>
                  <use xlinkHref={Icons.ABOUT}/>
                </svg>
                <span className="pl-3">About</span>
              </NavButton>
            ) : null
          }
          <NavButton href="/archives">
            <svg width={14} height={14}>
              <use xlinkHref={Icons.BOX_ARCHIVE}/>
            </svg>
            <span className="pl-3">Archives</span>
          </NavButton>
          <NavButton href="/categories">
            <svg width={14} height={14}>
              <use xlinkHref={Icons.BOOKMARK}/>
            </svg>
            <span className="pl-3">Categories</span>
          </NavButton>
          <NavButton href="/tags">
            <svg width={16} height={15}>
              <use xlinkHref={Icons.TAG}/>
            </svg>
            <span className="pl-3">Tags</span>
          </NavButton>
        </div>
      </Drawer>
    </>
  )
}

export default HeaderClientMobile
