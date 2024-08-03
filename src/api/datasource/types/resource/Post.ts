import type { ReactNode } from 'react'
import { deepCopy } from '@/lib/ObjectUtils'
import type { Category, Resource, Tag, TocItem } from '@/api/datasource/types/definitions'

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
  seo: SEO
}

/**
 * SEO 配置.
 */
export type SEO = {
  /**
   * 关键词. 看心情给吧... 不给默认使用 tags 的内容.<p>
   * [关键词堆砌](https://developers.google.cn/search/docs/essentials/spam-policies?hl=zh-cn#keyword-stuffing)<p>
   * [Google 不会将关键字元标记用于网页排名](https://developers.google.cn/search/blog/2009/09/google-does-not-use-keywords-meta-tag?hl=zh-cn)
   */
  keywords: string[]
  /**
   * 覆盖网页标题.<p>
   * [影响标题链接的最佳实践](https://developers.google.cn/search/docs/appearance/title-link?hl=zh-cn#page-titles)
   */
  title: string
  /**
   * 页面描述.<p>
   * [使用高质量的描述](https://developers.google.cn/search/docs/appearance/snippet?hl=zh-cn#use-quality-descriptions)
   */
  description?: string
}

/**
 * Client component available post object.
 */
export type ClientSafePost = {
  id: string | number
  title?: string
  date?: number
  /**
   * 访问路径
   */
  source: string
  categories: Category[]
  tags: Tag[]
  formattedTime: string
}

export default class Post implements Resource {
  public id: string | number
  /**
   * 标题
   */
  public title?: string
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

  /**
   * seo
   */
  public seo: SEO


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
    this.seo = data.seo
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
