import type { Category, MyBlogConfig, Tag } from '@/api/datasource/types/definitions'
import type Post from '@/api/datasource/types/Post'
import type { CommonMetadata, DatasourceItem, StaticResource, WebVisitPath } from 'blog-helper'



export interface BlogService {
  /**
   * 获取配置
   */
  getConfig(): Readonly<MyBlogConfig>
  /**
   * 分页获取用于首页展示的博客文章.
   * @param page 从0开始的页码
   * @param size 每页大小
   */
  pageHomePosts(page?: number, size?: number): Promise<Readonly<Post[]>>

  /**
   * 总博客文章数量
   */
  homePostSize(): number

  /**
   * 获取所有文章，包括首页的文章
   * <ul>
   *   <li>k: 访问路径</li>
   *   <li>v: 静态资源</li>
   * </ul>
   */
  getAllPagesUrl(): Readonly<Array<DatasourceItem>>

  /**
   * 获取所有静态资源.
   * @return {} 静态资源
   * <ul>
   *   <li>k: 访问路径, see: {@link StaticResource#accessPath}</li>
   *   <li>v: 静态资源</li>
   * </ul>
   */
  getAllStaticResource(): Readonly<DatasourceItem[]>
  /**
   * 根据访问路径获取Post
   * @param url url
   */
  getPageByWebUrl(url: WebVisitPath): Promise<Readonly<Post> | undefined>
  /**
   * 根据访问路径获取静态资源
   * @return base64 文件内容
   */
  getStaticResourceByWebUrl(url: WebVisitPath): StaticResource | undefined
  /**
   * 获取标签下对应的所有 Post
   */
  getTagMapping(): Map<Tag, DatasourceItem<CommonMetadata>[]>

  /**
   * 获取某个分类下对应的所有 Post
   */
  getCategoriesMapping(): Map<Category, DatasourceItem<CommonMetadata>[]>
  /**
   * 根据访问路径前缀列出符合条件的页面
   */
  listPageByWebUrlPrefix(prefix: WebVisitPath, matchNested?: boolean): DatasourceItem<CommonMetadata>[]
}