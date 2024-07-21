import { Moment } from 'moment/moment'
import { Tag } from 'hexo/dist/models'


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

export type HexoConfig = {
  title: string
  subtitle: string
  description: string
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
  _id: string
  /**
   * 标题
   */
  title: string
  /**
   * 创建时间
   */
  date: Moment
  /**
   * html 编码后的内容
   */
  content: string
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
