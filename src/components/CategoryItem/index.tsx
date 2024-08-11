import type React from 'react'
import type Post from '@/api/datasource/types/resource/Post'
import styles from './category.module.scss'
import { Icons } from '@/app/svg-symbols'
import Link from 'next/link'


interface CategoryItemProps {
  /**
   * tag or category name.
   */
  name: string
  /**
   * 类别对于的文章。不会主动排序，需要在外面排序好。
   */
  resources: Post[]
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
          共 { props.resources.length } 篇
        </div>
      </div>
      <div className="max-h-[50vh] overflow-y-auto">
        {
          props.resources.map(v => (
            <Link key={v.id} className={styles.categoryItem} href={v.source.join('/')}>
              <div className="flex flex-col">
                <span className="text-subtext2">{v.formattedTime}</span>
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