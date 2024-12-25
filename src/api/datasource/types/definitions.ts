export interface Resource {
  /**
   * 获取访问路径，以 '/' 开头
   */
  getAccessPath: () => string
}


export type Tag = string

export type Category = string

export type MyBlogConfig = {
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
  /**
   * 主页
   */
  authorHome: string
  /**
   * 图标链接
   */
  favicon?: string
  /**
   * head 的元数据
   */
  metadata?: Record<string, string>
}
