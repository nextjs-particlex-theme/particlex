import React from 'react'
import Link from 'next/link'
import styles from './header.module.scss'
import { Icons } from '@/app/svg-symbols'
import { concatClassName } from '@/lib/DomUtils'

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
  /**
   * 头部的样式
   */
  headerClass: string
  /**
   * 头部是否可见
   */
  headerVisible: boolean
}

/**
 * 头部组件
 */
const HeaderClient:React.FC<HeaderClientProps> = props => {
  return (
    <div className="hidden md:block">
      <div className={concatClassName('font-bold text-sm pl-16 text-zinc-600 flex-row flex', styles.header, props.headerClass)} style={props.headerVisible ? undefined : { height: 0 }}>
        <Link href="/" className="pl-10">
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
    </div>
  )
}

export default HeaderClient