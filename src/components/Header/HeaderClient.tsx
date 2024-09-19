import React from 'react'
import Link from 'next/link'
import styles from './header.module.scss'
import { Icons } from '@/app/svg-symbols'
import { concatClassName } from '@/lib/DomUtils'
import { HeaderStatus } from '@/components/Header/header-types'
import ThemeToggleButton from '@/components/Header/ThemeToggleButton'

interface HeaderClientProps {
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

/**
 * 头部组件
 */
const HeaderClient:React.FC<HeaderClientProps> = props => {


  let headerClass: string | undefined
  if (props.status === HeaderStatus.VISIBLE) {
    headerClass = styles.headerNormalVisible
  } else if (props.status === HeaderStatus.VISIBLE_TRANSPARENT) {
    headerClass = styles.headerTransparentVisible
  }
  
  return (
    <div className="hidden md:block">
      <div className={concatClassName('font-bold text-sm flex-row flex transition-all duration-300 fixed w-full px-14 overflow-hidden items-center z-top justify-between', headerClass)}
        style={props.status !== HeaderStatus.HIDDEN ? undefined : { height: 0 }}>
        <div className="flex items-center">
          <Link href="/" >
            { props.title }
          </Link>
          <div className="flex">
            <Link href="/" className="flex pl-10 items-center">
              <svg width={15} height={15}>
                <use xlinkHref={Icons.HOME}/>
              </svg>
              <span className="pl-2">Home</span>
            </Link>
            {
              props.showAboutPage ? (
                <Link href={props.aboutPageUrl} className="flex pl-10 items-center">
                  <svg width={15} height={15}>
                    <use xlinkHref={Icons.ABOUT}/>
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
        <ThemeToggleButton/>
      </div>
    </div>
  )
}

export default HeaderClient