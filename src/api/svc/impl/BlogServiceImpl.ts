import type { DataSourceConfig, Tag, Category } from '@/api/datasource/types/definitions'
import type { SEO } from '@/api/datasource/types/resource/Post'
import Post from '@/api/datasource/types/resource/Post'
import type { BlogService } from '@/api/svc/BlogService'
import type { Datasource, DatasourceItem, StaticResourceContent, WebVisitPath } from '@/api/datasource/Datasource'
import FileSystemDatasource from '@/api/datasource/FileSystemDatasource'
import path from 'node:path'
import type { Markdown } from '@/api/markdown-parser'
import parseMarkdown, { splitMarkdownContent } from '@/api/markdown-parser'
import cached from '@/lib/cached'

type PostConstructor = ConstructorParameters<typeof Post>[0]

export default class BlogServiceImpl implements BlogService {


  private readonly datasource: Datasource = new FileSystemDatasource()

  private static visitPathToString(visitPath: WebVisitPath): string {
    return visitPath.join('/')
  }

  private _resourceMap: Map<string, DatasourceItem> | undefined
  private get resourceMap(): Promise<Map<string, DatasourceItem>> {
    if (this._resourceMap) {
      return Promise.resolve(this._resourceMap)
    }

    return this.getAllStaticResource().then(resources => {
      const map = new Map<string, DatasourceItem>()
      for (let resource of resources) {
        map.set(BlogServiceImpl.visitPathToString(resource.visitPath), resource)
      }
      this._resourceMap = map
      return Promise.resolve(map)
    })
  }

  private _pageMap: Map<string, DatasourceItem> | undefined
  private get pageMap(): Promise<Map<string, DatasourceItem>> {
    if (this._pageMap) {
      return Promise.resolve(this._pageMap)
    }
    const r = this.getAllPagesUrl()
    return r.then(resources => {
      const map = new Map<string, DatasourceItem>()
      for (let resource of resources) {
        map.set(BlogServiceImpl.visitPathToString(resource.visitPath), resource)
      }
      this._pageMap = map
      return Promise.resolve(map)
    })
  }

  /**
   * 判断某个目录是否在另外一个目录内部
   * @param outer 外部的目录
   * @param inner 内部的目录
   * @return {boolean} `inner` 是否在 `outer` 内部
   * @private
   */
  private static isNested(outer: string, inner: string): boolean {
    return path.normalize(inner).startsWith(path.normalize(outer))
  }

  getConfig(): Promise<Readonly<DataSourceConfig>> {
    return this.datasource.getConfig()
  }

  async pageHomePosts(page: number = 0, size: number = 5): Promise<Readonly<Post[]>> {
    const posts = await this.datasource.getAllHomePosts()
    const head = page * size
    const sliced = posts.slice(head, head + size)
    const result: Post[] = []
    for (let datasourceItem of sliced) {
      const p = await this.getPageByWebUrl(datasourceItem.visitPath)
      if (!p) {
        continue
      }
      result.push(p)
    }
    return result
  }

  async homePostSize(): Promise<number> {
    return (await this.datasource.getAllPages()).length
  }

  getAllPagesUrl(): Promise<Readonly<Array<DatasourceItem>>> {
    return this.datasource.getAllPages()
  }

  getAllStaticResource(): Promise<Readonly<DatasourceItem[]>> {
    return this.datasource.getAllStaticResource()
  }

  @cached()
  async getPageByWebUrl(url: WebVisitPath): Promise<Readonly<Post> | undefined> {
    const map = await this.pageMap
    const item = map.get(BlogServiceImpl.visitPathToString(url))
    if (!item) {
      return
    }
    const pageContent = await this.datasource.getPage(item.id)
    const { metadata, content } = splitMarkdownContent(pageContent, item.id)
    const parsedMarkdown = await parseMarkdown(content, item.type)

    const postData: PostConstructor = {
      title: metadata.title ?? 'Untitled',
      date: metadata.date ? new Date(metadata.date).valueOf() : undefined,
      source: item.visitPath,
      id: item.id,
      toc: parsedMarkdown.toc,
      content: parsedMarkdown.page,
      tags: this.parseTagAndCategories(metadata.tags),
      categories: this.parseTagAndCategories(metadata.categories),
      wordCount: content.length,
      // will init later before return.
      seo: (null as any)
    }

    postData.seo = this.parseSeoConfig(postData, metadata.seo)
    return new Post(postData)
  }

  private parseTagAndCategories(val?: any): string[] {
    if (!val) {
      return []
    }
    if (Array.isArray(val)) {
      return val
    }
    if (typeof val === 'string') {
      return [val]
    }
    // 兼容历史遗留写法. 这个写法是之前 hexo particlex 主题特有的
    //  categories:
    //    data:
    //      - { name: "Hello", path: "/hello/" }
    if (!val.data || !Array.isArray(val.data)) {
      return []
    }
    const r: string[] = []
    for (let datum of val.data) {
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
    const map = await this.resourceMap
    const r = map.get(BlogServiceImpl.visitPathToString(url))
    if (!r) {
      return undefined
    }
    return this.datasource.getResource(r.id)
  }

  async getTagMapping(): Promise<Map<Tag, Readonly<Post[]>>> {
    const pages = await this.datasource.getAllPages()
    const r = new Map<Tag, Post[]>()
    for (let page of pages) {
      const p = await this.getPageByWebUrl(page.visitPath)
      if (!p) {
        continue
      }
      for (let category of p.tags) {
        let o = r.get(category)
        if (!o) {
          o = []
          r.set(category, o)
        }
        o.push(p)
      }
    }
    return r
  }

  async getCategoriesMapping(): Promise<Map<Category, Readonly<Post[]>>> {
    const pages = await this.datasource.getAllPages()
    const r = new Map<Category, Post[]>()
    for (let page of pages) {
      const p = await this.getPageByWebUrl(page.visitPath)
      if (!p) {
        continue
      }
      for (let category of p.categories) {
        let o = r.get(category)
        if (!o) {
          o = []
          r.set(category, o)
        }
        o.push(p)
      }
    }
    return r
  }
  
}