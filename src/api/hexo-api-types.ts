import { Moment } from 'moment/moment'
import { Tag } from 'hexo/dist/models'
import Query from 'warehouse/dist/query'


export type Category = {
  _id: string
  name: string
}

export type HexoConfig = {
  title: string
  subtitle: string
  description: string
  author: string
  language: string
  timezone: string

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
   * 相对于博客根目录的路径
   */
  source: string
  /**
   * categories
   */
  categories: Query<Category>
  /**
   * tag
   */
  tags: Query<typeof Tag>
}
