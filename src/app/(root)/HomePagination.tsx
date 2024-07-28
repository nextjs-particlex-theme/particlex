import React from 'react'
import Link from 'next/link'
import style from './root-style.module.scss'
import { concatClassName } from '@/lib/DomUtils'

interface HomePaginationProps {
  totalPage: number
  /**
   * 当前页码数，从 1 开始
   */
  currentPage: number
}

const MAX_SPACE_SIZE = 2
const HomePagination: React.FC<HomePaginationProps> = props => {
  // 页数太多就分两段
  const items: number[] = []

  let i = Math.max(1, props.currentPage - MAX_SPACE_SIZE)
  for (; i < props.currentPage; ++i) {
    items.push(i)
  }
  for (const len = Math.min(props.totalPage, props.currentPage + MAX_SPACE_SIZE); i <= len; ++i) {
    items.push(i)
  }

  const showHeadDots = items[0] !== 1
  const showTailDots = items[items.length - 1] !== props.totalPage
  
  return (
    <div>
      {
        showHeadDots ? (
          <>
            <Link href="/page/1" className={concatClassName(style.paginationItem, style.paginationSelectable)}>1</Link>
            <div className={style.paginationItem}>...</div>
          </>
        ) : null
      }
      {
        items.map((page) => (
          <Link href={`/page/${page}`}
            key={page} 
            className={concatClassName(style.paginationItem, props.currentPage === page ? style.paginationSelected : style.paginationSelectable)}>
            { page }
          </Link>
        ))
      }
      {
        showTailDots ? (
          <>
            <div className={style.paginationItem}>...</div>
            <Link href={`/page/${props.totalPage}`} className={concatClassName(style.paginationItem, style.paginationSelectable)}>{ props.totalPage }</Link>
          </>
        ) : null
      }
    </div>
  )
}

export default HomePagination
