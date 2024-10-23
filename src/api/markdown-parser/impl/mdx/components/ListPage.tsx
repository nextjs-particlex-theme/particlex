import type React from 'react'
import ServiceBeans from '@/api/svc/ServiceBeans'
import datasource from '@/api/datasource'
import type Post from '@/api/datasource/types/resource/Post'

interface ListPageProps {
  /**
   * 要搜索的目录
   */
  root: string
  /**
   * 递归搜索
   */
  recursion?: boolean
  /**
   * 使用分类分组
   */
  groupByCategories?: boolean
}


/**
 * 列出某个目录下的所有页面
 */
const ListPage: React.FC<ListPageProps> = async props => {
  const pages = await datasource.listPages(props.root, props.recursion)
  const result: Post[] = []
  for (const page of pages) {
    const entity = await ServiceBeans.blogService.getPageByWebUrl(page.visitPath)
    if (entity) {
      result.push(entity)
    }
  }

  return (
    <>
      {
        result.map(v => (
          <p key={v.id}><a href={v.getAccessPath()}>{v.title}</a></p>
        ))
      }
    </>
  )
}

export default ListPage
