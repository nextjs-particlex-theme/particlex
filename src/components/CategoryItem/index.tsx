import type React from 'react'
import styles from './category.module.scss'
import { Icons } from '@/app/svg-symbols'
import Link from 'next/link'
import type { Tag } from '@/api/datasource/types/definitions'
import type { Category, CommonMetadata, DatasourceItem } from 'blog-helper'
import ServiceBeans from '@/api/svc/ServiceBeans'


export interface CategoryItemProps {
  /**
   * tag or category name.
   */
  name: string
  entities: CategoryEntity[]
}

export type CategoryEntity = {
  title?: string
  wordCount?: number
  date?: string
  href?: string
  timestamp?: number
}

export const parseMapData = async (data: Map<Tag | Category, DatasourceItem<CommonMetadata>[]>): Promise<CategoryItemProps[]> => {
  const blogService = ServiceBeans.blogService
  const entities: CategoryItemProps[] = []

  for (const [key, items] of data) {
    const root: CategoryItemProps = {
      entities: [],
      name: key
    }
    for (const item of items) {
      const page = await blogService.getPageByWebUrl(item.metadata.visitPath)
      root.entities.push({
        date: page?.formattedTime,
        href: page?.getAccessPath(),
        title: page?.title,
        wordCount: page?.wordCount,
        timestamp: page?.date
      })
    }
    root.entities.sort((a, b) => {
      const val1 = a.timestamp ?? Number.MIN_VALUE
      const val2 = b.timestamp ?? Number.MIN_VALUE
      return val2 - val1
    })
    entities.push(root)
  }
  return entities
}

/**
 * 一个分类组件，可用于 Categories 和 Tags 的展示
 * @constructor
 */
const CategoryItem:React.FC<CategoryItemProps> = props => {
  return (
    <div className="mt-5">
      <div >
        <h2 className="text-xl mb-2 text-primary" id={props.name}>
          {props.name}
        </h2>
        <div>
          共 { props.entities.length } 篇
        </div>
      </div>
      <div className="max-h-[50vh] overflow-y-auto">
        {
          props.entities.map(v => (
            <Link key={v.href} className={styles.categoryItem} href={v.href ?? '/404'}>
              <div className="flex flex-col">
                <span className="text-subtext2">{v.date}</span>
                <span>{v.title}</span>
              </div>
              <div className="flex items-center" title="字数">
                <svg width={14} height={14}>
                  <use xlinkHref={Icons.FONT}/>
                </svg>
                <span className="min-w-12 text-right text-subtext">{v.wordCount}</span>
              </div>
            </Link>
          ))
        }
      </div>
    </div>
  )
}


export default CategoryItem