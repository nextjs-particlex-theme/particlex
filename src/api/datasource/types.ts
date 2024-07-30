import type { ReactNode } from 'react'
import { deepCopy } from '@/lib/ObjectUtils'

export type Tag = {

}

export type Category = {
  name: string
  path: string
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
  /**
   * 主页
   */
  homePage: string
  /**
   * 图标链接
   */
  favicon?: string
}


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

/**
 * 构造器参数. 注意: <b>任何对象，都不应该直接使用数据源提供的对象，以免代入多余属性</b>
 * <p>
 * 考虑使用下面的方法来过滤数据源对象多余的属性：
 * <ul>
 *   <li>{@link purifyCategoryData}</li>
 *   <li>{@link purifyTagData}</li>
 * </ul>
 */
type PostConstructor = {
  id: string | number
  title: string
  date?: number
  content: ReactNode
  slug: string
  source: string[]
  categories: Category[]
  tags: Tag[]
  toc: TocItem[]
}

export class StaticResource implements Resource {

  /**
   * 文件路径
   * @private
   */
  filepath: string

  /**
   * 相对<b>静态资源根目录</b>的访问路径.
   * 例如资源在 url 中以 `/images/foo/bar.png` 访问，则这里的值为 `[foo, bar.png]`
   * @private
   */
  accessPath: string[]

  constructor(filepath: string, accessPath: string[]) {
    this.filepath = filepath
    this.accessPath = accessPath
  }

  getAccessPath() {
    return '/' + this.accessPath.join('/')
  }

}

/**
 * Client component available post object.
 */
export type ClientSafePost = {
  id: string | number
  title: string
  date?: number
  /**
   * 访问路径
   */
  source: string
  categories: Category[]
  tags: Tag[]
  formattedTime: string
}

export class Post implements Resource {
  public id: string | number
  /**
   * 标题
   */
  public title: string
  /**
   * 创建时间
   */
  public date?: number
  /**
   * html 编码后的内容. SSR yyds.
   */
  public content: ReactNode
  /**
   * 不带后缀的文件名
   */
  public slug: string
  /**
   * 相对于博客访问路径. 例如博客文件：`_posts/2024/02/xxx.md` 会被转换成 `/2024/02/xxx`
   */
  public source: string[]
  /**
   * categories
   */
  public categories: Category[]
  /**
   * tag
   */
  public tags: Tag[]
  /**
   * Toc
   */
  public toc: TocItem[]

  constructor(data: PostConstructor) {
    this.id = data.id
    this.title = data.title
    this.date = data.date
    this.content = data.content
    this.slug = data.slug
    this.source = data.source
    this.categories = data.categories
    this.tags = data.tags
    this.toc = data.toc
  }

  get formattedTime(): string {
    if (!this.date) {
      return ''
    }
    const date = new Date(this.date)
    let month: string | number = date.getMonth() + 1
    month = month < 10 ? '0' + month : month
    let day: string | number = date.getDate()
    day = day < 10 ? '0' + day : day
    return `${date.getFullYear()}/${month}/${day}`
  }

  getAccessPath() {
    return '/' + this.source.join('/')
  }

  /**
   * 转换成客户端组件可用的对象.
   */
  toClientSafePost(): ClientSafePost {
    return {
      title: this.title,
      date: this.date,
      categories: deepCopy(this.categories),
      tags: deepCopy(this.tags),
      source: this.getAccessPath(),
      id: this.id,
      formattedTime: this.formattedTime
    }
  }

}

export interface BlogDataSource {
  /**
   * 获取配置
   */
  getConfig(): Promise<Config>
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

