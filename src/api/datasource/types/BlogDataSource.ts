import type Post from '@/api/datasource/types/resource/Post'
import type { StaticResource } from '@/api/datasource/types/resource/StaticResource'
import type { DataSourceConfig } from '@/api/datasource/types/definitions'

export interface BlogDataSource {
  /**
   * 获取配置
   */
  getConfig(): Promise<DataSourceConfig>
  /**
   * 分页获取用于首页展示的博客文章.
   * @param page 从0开始的页码
   * @param size 每页大小
   */
  pageHomePosts(page?: number, size?: number): Promise<Post[]>
  /**
   * {@link BlogDataSource#pageHomePosts} 的总博客文章数量
   */
  pagePostsSize(): Promise<number>
  /**
   * 获取所有文章，包括首页的文章
   * <ul>
   *   <li>k: 访问路径</li>
   *   <li>v: 静态资源</li>
   * </ul>
   */
  getAllPost(): Promise<Post[]>
  /**
   * 获取所有静态资源.
   * @return {} 静态资源
   * <ul>
   *   <li>k: 访问路径, see: {@link StaticResource#accessPath}</li>
   *   <li>v: 静态资源</li>
   * </ul>
   */
  getAllStaticResource(): Promise<StaticResource[]>
  /**
   * 根据访问路径获取Post
   * @param url url
   */
  getPostByWebUrl(url: string[]): Promise<Post | undefined>

  /**
   * 根据访问路径获取静态资源
   * @param url url, 不需要 image 前缀
   */
  getStaticResourceByWebUrl(url: string[]): Promise<StaticResource | undefined>
}

