import type { DataSourceConfig, Tag, Category } from '@/api/datasource/types/definitions'
import type { SEO } from '@/api/datasource/types/resource/Post'
import Post from '@/api/datasource/types/resource/Post'
import type { BlogService } from '@/api/svc/BlogService'
import type { StaticResourceContent, WebVisitPath } from '@/api/datasource/Datasource'
import type { Markdown } from '@/api/markdown-parser'
import type { CommonMetadata, DatasourceItem } from 'blog-helper'
import { cached } from 'blog-helper'
import parseMarkdown from '@/api/markdown-parser'
import datasource from '@/api/datasource'

type PostConstructor = ConstructorParameters<typeof Post>[0]

/**
 * 由于历史遗留保留了这个类，实际有点多余。。。
 * @see {BlogServiceImpl#parsePost}
 */
export default class BlogServiceImpl implements BlogService {


  getConfig(): Promise<Readonly<DataSourceConfig>> {
    return datasource.getConfig()
  }

  async pageHomePosts(page: number = 0, size: number = 5): Promise<Readonly<Post[]>> {
    const posts = await datasource.pageHomePosts(page, size)
    const head = page * size
    const sliced = posts.slice(head, head + size)
    const result: Post[] = []
    for (const datasourceItem of sliced) {
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
    const md = await datasource.readContent(item.metadata.visitPath)
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

  async homePostSize(): Promise<number> {
    return await datasource.homePostSize()
  }

  getAllPagesUrl(): Promise<Readonly<Array<DatasourceItem>>> {
    return datasource.getAllPagesUrl()
  }

  getAllStaticResource(): Promise<Readonly<DatasourceItem[]>> {
    return datasource.getAllStaticResource()
  }

  async getPageByWebUrl(url: WebVisitPath): Promise<Readonly<Post> | undefined> {
    const item = datasource.getPageByWebVisitPath(url)
    if (!item) {
      throw Error('Markdown not exist, visit path: ' + url)
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


  async getStaticResourceByWebUrl(url: WebVisitPath): Promise<Readonly<StaticResourceContent> | undefined> {
    return await datasource.getStaticResourceByWebUrl(url)
  }

  async getTagMapping(): Promise<Map<Tag, DatasourceItem<CommonMetadata>[]>> {
    return datasource.getTagMapping()
  }

  async getCategoriesMapping(): Promise<Map<Category, DatasourceItem<CommonMetadata>[]>> {
    return datasource.getCategoriesMapping()
  }

}