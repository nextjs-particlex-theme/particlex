import type { DataSourceConfig } from '@/api/datasource/types/definitions'

export type DatasourceItem = {
  /**
   * 唯一标识符, 通常是文件访问路径
   */
  id: string;
  /**
   * 访问路径
   */
  visitPath: WebVisitPath
  /**
   * 文件类型，可以是文件路径，或者文件类型拓展符
   */
  type: string
}

export type WebVisitPath = string[]

export type StaticResourceContent = {
  base64: string
  contentType: string
}

export interface Datasource {
  /**
   * 获取配置
   */
  getConfig(): Promise<Readonly<DataSourceConfig>>

  /**
   * 获取所有的文章
   * @return {string} 文章唯一标识符
   */
  getAllPages(): Promise<Array<DatasourceItem>>

  /**
   * 获取页面内容
   */
  getPage(id: DatasourceItem['id']): Promise<string>

  /**
   * 获取首页文章
   */
  getAllHomePosts(): Promise<Array<DatasourceItem>>

  /**
   * 获取所有静态资源
   */
  getAllStaticResource(): Promise<Array<DatasourceItem>>

  /**
   * 获取资源的内容
   * @return base64 字符串
   */
  getResource(id: DatasourceItem['id']): Promise<StaticResourceContent | undefined>
}