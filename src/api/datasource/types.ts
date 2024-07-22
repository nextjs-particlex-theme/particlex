import { Moment } from 'moment/moment'
import { Tag } from 'hexo/dist/models'
import type { ReactNode } from 'react'


export type Category = {
  _id: string
  name: string
}

type ThemeConfig = {
  /**
   * 背景图片
   */
  background?: string[]
  /**
   * 头像
   */
  avatar?: string
  /**
   * 右侧卡片
   */
  card?: {
    /**
     * 是否开启
     */
    enable?: boolean
    /**
     * 简介
     */
    description?: string
  }
}

export type Config = {
  title: string
  subtitle?: string
  description?: string
  author: string
  language: string
  timezone: string
  theme_config: ThemeConfig
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
  pagePosts: (page?: number, size?: number) => Promise<Post[]>
}
