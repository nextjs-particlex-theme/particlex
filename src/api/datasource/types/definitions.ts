export interface Resource {
  /**
   * 获取访问路径，以 '/' 开头
   */
  getAccessPath: () => string
}


export type TocItem = {
  title: string
  /**
   * 锚点，以 # 开头
   */
  anchor: string
  child: TocItem[]
}

export type Tag = string

export type Category = string


export type DataSourceConfig = {
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
  homePage: string
  /**
   * 图标链接
   */
  favicon?: string
}
