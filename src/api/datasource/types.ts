import { Moment } from 'moment/moment'
import { Tag } from 'hexo/dist/models'
import type { ReactNode } from 'react'


export type Category = {
  _id: string
  name: string
}


export type Config = {
  title: string
  subtitle?: string
  description?: string
  author: string
  /**
   * 首页页码大小
   */
  indexPageSize: number
  /**
   * 背景图片
   */
  background: string[]
  /**
   * 头像
   */
  avatar?: string
}

//
// export type Tag = {
//
// }

export type Post = {
  _id: string | number
  /**
   * 标题
   */
  title: string
  /**
   * 创建时间
   * TODO 替换为时间戳
   */
  date: Moment
  /**
   * html 编码后的内容. SSR yyds.
   */
  content: ReactNode
  /**
   * 不带后缀的文件名
   */
  slug: string
  /**
   * 相对于博客访问路径. 例如博客文件：`_posts/2024/02/xxx.md` 会被转换成 `/2024/02/xxx`
   */
  source: string
  /**
   * categories
   */
  categories: Category[]
  /**
   * tag
   */
  tags: (typeof Tag)[]
}

export interface BlogDataSource {
  /**
   * 获取配置
   */
  getConfig: () => Promise<Config>
  /**
   * 分页获取用于首页展示的博客文章.
   * @param page 从0开始的页码
   * @param size 每页大小
   */
  // wdf, why happen this error?
  // eslint-disable-next-line no-unused-vars
  pagePosts(page?: number, size?: number): Promise<Post[]>
  /**
   * {@link BlogDataSource#pagePosts} 的总博客文章数量
   */
  pagePostsSize: () => Promise<number>
}
