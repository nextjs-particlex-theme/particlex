import type { MyBlogConfig, Tag, Category } from '@/api/datasource/types/definitions'
import type { SEO } from '@/api/datasource/types/Post'
import Post from '@/api/datasource/types/Post'
import type { BlogService } from '@/api/svc/BlogService'
import type { Markdown } from '@/api/markdown-parser'
import type { CommonMetadata, DatasourceItem, WebVisitPath, StaticResource } from 'blog-helper'
import { cached } from 'blog-helper'
import parseMarkdown from '@/api/markdown-parser'
import datasource from '@/api/datasource'

type PostConstructor = ConstructorParameters<typeof Post>[0]

/**
 * 由于历史遗留保留了这个类，实际有点多余。。。
 * @see {BlogServiceImpl#parsePost}
 */
export default class BlogServiceImpl implements BlogService {

  getConfig(): Readonly<MyBlogConfig> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parsed = (datasource.getConfig()) as Record<string, any>
    const theme = parsed.theme_config ?? {}

    return {
      title: parsed.title,
      subtitle: parsed.subtitle,
      description: parsed.description,
      author: parsed.author,
      authorHome: parsed.authorHome ?? '#',
      indexPageSize: theme.indexPageSize ?? 5,
      background: theme.background ?? [],
      avatar: theme.avatar ?? '',
      favicon: theme.favicon,
      metadata: parsed.metadata
    }
    
  }

  async pageHomePosts(page: number = 0, size: number = 5): Promise<Readonly<Post[]>> {
    const posts = datasource.pageHomePosts(page, size)
    const result: Post[] = []
    for (const datasourceItem of posts) {
      const p = await this.getPageByWebUrl(datasourceItem.metadata.visitPath)
      if (!p) {
        continue
      }
      result.push(p)
    }
    return result
  }

  @cached()
  private async parsePost(item: DatasourceItem): Promise<Post> {
    const md = datasource.readContent(item.metadata.visitPath)
    if (!md) {
      throw Error('Markdown not exist, visit path: ' + item.metadata.visitPath)
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const metadata = md.metadata as any
    const content = md.content
    const parsedMarkdown = await parseMarkdown(content, item.type)

    const postData: PostConstructor = {
      title: metadata.title ?? 'Untitled',
      date: metadata.date ? new Date(metadata.date).valueOf() : undefined,
      source: item.metadata.visitPath,
      id: item.id,
      content: parsedMarkdown,
      tags: this.parseTagAndCategories(metadata.tags),
      categories: this.parseTagAndCategories(metadata.categories),
      wordCount: content.length,
      // will init later before return.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      seo: (null as any)
    }

    postData.seo = this.parseSeoConfig(postData, metadata.seo)
    return new Post(postData)
  }

  homePostSize(): number {
    return datasource.homePostSize()
  }

  getAllPagesUrl(): Readonly<Array<DatasourceItem<CommonMetadata>>> {
    return datasource.getAllPages()
  }

  getAllStaticResource(): Readonly<DatasourceItem[]> {
    return datasource.getAllStaticResource()
  }

  async getPageByWebUrl(url: WebVisitPath): Promise<Readonly<Post> | undefined> {
    const item = datasource.getPageByWebVisitPath(url)
    if (!item) {
      return undefined
    }
    return this.parsePost(item)
  }

  private parseTagAndCategories(val?: unknown): string[] {
    if (!val) {
      return []
    }
    if (Array.isArray(val)) {
      return val
    }
    if (typeof val === 'string') {
      return [val]
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const any = val as any
    // 兼容历史遗留写法. 这个写法是之前 hexo particlex 主题特有的
    //  categories:
    //    data:
    //      - { name: "Hello", path: "/hello/" }
    if (!any.data || !Array.isArray(any.data)) {
      return []
    }
    const r: string[] = []
    for (const datum of any.data) {
      if (typeof datum.name === 'string') {
        r.push(datum.name)
      }
    }
    return r
  }

  /**
   * 解析 SEO 配置
   * @param data 已有的构造器参数
   * @param seo seo 配置
   * @protected
   */
  protected parseSeoConfig(data: Omit<PostConstructor, 'seo'>, seo: Markdown['metadata']['seo']): SEO {
    const fakeType = (seo ?? {}) as Partial<SEO>

    return {
      title: fakeType.title ?? data.title,
      description: fakeType.description,
      // TODO auto generate tags.
      keywords: fakeType.keywords ?? []
    }
  }


  getStaticResourceByWebUrl(url: WebVisitPath): StaticResource | undefined {
    return datasource.readStaticResourceByWebUrl(url)
  }

  getTagMapping(): Map<Tag, DatasourceItem<CommonMetadata>[]> {
    return datasource.getTagMapping()
  }

  getCategoriesMapping(): Map<Category, DatasourceItem<CommonMetadata>[]> {
    return datasource.getCategoriesMapping()
  }

  listPageByWebUrlPrefix(prefix: WebVisitPath, matchNested = true): DatasourceItem<CommonMetadata>[] {
    const all = this.getAllPagesUrl()
    const result: DatasourceItem<CommonMetadata>[] = []
    for (const e of all) {
      const len = e.metadata.visitPath.length
      if (len < prefix.length || (!matchNested && prefix.length != len - 1)) {
        continue
      }
      let i = 0
      for (; i < prefix.length; i++) {
        if (prefix[i] != e.metadata.visitPath[i]) {
          break
        }
      }
      if (i == prefix.length) {
        result.push(e)
      }
    }
    return result
  }
}