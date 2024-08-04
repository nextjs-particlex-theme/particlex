import type Post from '@/api/datasource/types/resource/Post'
import type { StaticResource } from '@/api/datasource/types/resource/StaticResource'
import type { Category, DataSourceConfig, Tag } from '@/api/datasource/types/definitions'

export interface BlogDataSource {
  /**
   * 获取配置
   */
  getConfig(): Promise<Readonly<DataSourceConfig>>
  /**
   * 分页获取用于首页展示的博客文章.
   * @param page 从0开始的页码
   * @param size 每页大小
   */
  pageHomePosts(page?: number, size?: number): Promise<Readonly<Post[]>>
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
  getAllPost(): Promise<Readonly<Post[]>>
  /**
   * 获取所有静态资源.
   * @return {} 静态资源
   * <ul>
   *   <li>k: 访问路径, see: {@link StaticResource#accessPath}</li>
   *   <li>v: 静态资源</li>
   * </ul>
   */
  getAllStaticResource(): Promise<Readonly<StaticResource[]>>
  /**
   * 根据访问路径获取Post
   * @param url url
   */
  getPostByWebUrl(url: string[]): Promise<Readonly<Post> | undefined>

  /**
   * 根据访问路径获取静态资源
   * @param url url, 不需要 image 前缀
   */
  getStaticResourceByWebUrl(url: string[]): Promise<Readonly<StaticResource> | undefined>
  /**
   * 获取标签下对应的所有 Post
   */
  getTagMapping(): Promise<Readonly<Map<Tag, Post>>>

  /**
   * 获取某个分类下对应的所有 Post
   */
  getCategoriesMapping(): Promise<Readonly<Map<Category, Post>>>
}

