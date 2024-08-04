import path from 'node:path'
import {
  generateShallowToc,
  highlight,
  markdownToHtml, replacePrefixIndent,
  utilMarkdownGenerateCaster
} from '@/api/datasource/util'
import readline from 'node:readline'
import fs from 'node:fs'
import yaml, { YAMLParseError } from 'yaml'
import { globSync } from 'glob'
import type { Category, DataSourceConfig, Tag } from '@/api/datasource/types/definitions'
import { StaticResource } from '@/api/datasource/types/resource/StaticResource'
import type { SEO } from '@/api/datasource/types/resource/Post'
import Post from '@/api/datasource/types/resource/Post'
import type { BlogDataSource } from '@/api/datasource/types/BlogDataSource'
import cached from '@/lib/cached'

type AbstractBlogDataSourceCons = {
  /**
   * 首页文章目录.
   */
  homePostDirectory: string
  /**
   * 所有文章的共同根目录
   */
  postDirectory: string
  /**
   * 资源目录
   */
  resourceDirectory: string
}

type AbstractBlogDatasourceConfig = {
  /**
   * 首页文章目录.
   */
  homePostGlob: string
  /**
   * 所有文章的共同根目录
   */
  postGlob: string
  /**
   * 资源目录
   */
  resourceGlob: string
}

type PostContent = {
  metadata: any
  content: string
}

type PostConstructor = ConstructorParameters<typeof Post>[0]

export default abstract class AbstractMarkdownBlogDataSource implements BlogDataSource {

  protected readonly config: AbstractBlogDatasourceConfig


  protected constructor(config: AbstractBlogDataSourceCons) {
    this.config = {
      homePostGlob: `${config.homePostDirectory}/**/*.md`,
      postGlob: `${config.postDirectory}/**/*.md`,
      resourceGlob: `${config.resourceDirectory}/**/*`
    }
  }


  protected buildCacheKey(path: string[]): string {
    return path.join('/')
  }


  /**
   * 获取配置
   */
  abstract getConfig(): Promise<DataSourceConfig>

  /**
   * 获取博客的 web 访问路径.
   * @param path 博客文件路径.
   */
  abstract resolvePostWebPath(path: string): string[]

  /**
   * 获取静态文件的 web 访问路径
   * @param path 静态文件路径. 需要注意操作系统的分隔符.
   */
  abstract resolveStaticResourceWebPath(path: string): string[]

  @cached()
  async getTagMapping(): Promise<Map<Tag, Post>> {
    const posts = await this.getAllPost()
    const r = new Map<Category, Post>()
    for (let post of posts) {
      for (let tag of post.tags) {
        r.set(tag, post)
      }
    }
    return r
  }

  @cached()
  async getCategoriesMapping(): Promise<Map<Category, Post>> {
    const posts = await this.getAllPost()
    const r = new Map<Category, Post>()
    for (let post of posts) {
      for (let category of post.categories) {
        r.set(category, post)
      }
    }
    return r
  }

  async pageHomePosts(page: number = 0, size: number = 5): Promise<Post[]> {
    const files = globSync(this.config.homePostGlob, { cwd: process.env.BLOG_PATH })
    return (await this.parseMarkdownFiles(files, page * size, size)).sort((a, b) => {
      const v1 = a.date ?? 0
      const v2 = b.date ?? 0
      return v2 - v1
    })
  }

  @cached()
  pagePostsSize(): Promise<number> {
    return Promise.resolve(globSync(this.config.homePostGlob, { cwd: process.env.BLOG_PATH }).length)
  }

  @cached()
  async getAllPost(): Promise<Post[]> {
    const files = globSync(this.config.postGlob, { cwd: process.env.BLOG_PATH })
    return await this.parseMarkdownFiles(files)
  }

  @cached()
  getAllStaticResource(): Promise<StaticResource[]> {
    const files = globSync(this.config.resourceGlob, { cwd: process.env.BLOG_PATH })
    return Promise.resolve(
      files.map(v =>
        new StaticResource(path.resolve(process.env.BLOG_PATH, v), this.resolveStaticResourceWebPath(v)))
    )
  }

  private parsePostContent(postPath: string): Promise<PostContent> {
    return new Promise((resolve, reject) => {
      const rl = readline.createInterface({
        input: fs.createReadStream(postPath),
      })
      const metadataStrArr: string[] = []
      // 0: expect start.
      // 1: expect end.
      // 2: collected.
      let metadataCollectStatus = 0
      const content: string[] = []

      rl.on('line', (line) => {
        if (metadataCollectStatus < 2) {
          metadataStrArr.push(line)
          if (line.startsWith('---')) {
            metadataCollectStatus++
          }
        } else {
          content.push(line)
        }
      })

      rl.on('close', () => {
        let metadata: any
        let html: string
        if (metadataCollectStatus < 2) {
          metadata = {}
          html = markdownToHtml(metadataStrArr.join('\n'))
        } else {
          try {
            metadata = yaml.parse(metadataStrArr.slice(1, metadataStrArr.length - 1).join('\n'))
          } catch (e) {
            if (e instanceof YAMLParseError && e.code === 'TAB_AS_INDENT') {
              const str = metadataStrArr.map(replacePrefixIndent).slice(1, metadataStrArr.length - 1).join('\n')
              try {
                metadata = yaml.parse(str)
              } catch (e) {
                if (e instanceof YAMLParseError && e.code === 'TAB_AS_INDENT') {
                  reject(new Error(`Failed to parse markdown file ${postPath}, 
                  neither modify environment variable \`YAML_INDENT_SPACE_COUNT\` or remove \`\\t\` in your yaml config.`, { cause: e }))
                  return
                }
              }
            } else {
              // man! what else can I do?
              reject(e)
              return
            }
          }
          html = markdownToHtml(content.join('\n'))
        }
        resolve({
          metadata: metadata ?? {},
          content: html
        })
      })
    })
  }

  /**
   * 解析 markdown 文件，返回解析后的内容
   * @param files 需要解析的文件
   * @param begin 从哪里开始
   * @param take 解析几个
   * @protected
   */
  protected async parseMarkdownFiles(files: string[], begin = 0, take?: number): Promise<Post[]> {
    const r: Post[] = []

    const len = take === undefined ? files.length : Math.min(take + begin, files.length)

    for (let i = Math.max(0, begin); i < len; i++) {
      const file = files[i]
      const { metadata, content } = await this.parsePostContent(path.resolve(process.env.BLOG_PATH, file))
      let source = this.resolvePostWebPath(file)

      const postData: PostConstructor = {
        title: metadata.title,
        date: metadata.date ? new Date(metadata.date).valueOf() : undefined,
        source,
        id: source.join('-'),
        toc: generateShallowToc(content, utilMarkdownGenerateCaster),
        content: highlight(content),
        tags: this.parseTagAndCategories(metadata.tags),
        categories: this.parseTagAndCategories(metadata.categories),
        // will init later before return.
        seo: (null as any)
      }
      postData.seo = this.parseSeoConfig(postData, metadata.seo)

      r.push(new Post(postData))
    }
    return r
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
  protected parseSeoConfig(data: Omit<PostConstructor, 'seo'>, seo?: Record<string, undefined | string>): SEO {
    const fakeType = (seo ?? {}) as Partial<SEO>

    return {
      title: fakeType.title ?? data.title,
      description: fakeType.description,
      // TODO auto generate tags.
      keywords: fakeType.keywords ?? []
    }
  }

  @cached()
  private async postMap(): Promise<Map<string, Post>> {
    const r = await this.getAllPost()
    const result = new Map<string, Post>()
    for (let p of r) {
      result.set(this.buildCacheKey(p.source), p)
    }
    return result
  }
  
  async getPostByWebUrl(url: string[]): Promise<Post | undefined> {
    return (await this.postMap()).get(this.buildCacheKey(url))
  }

  @cached()
  private async staticResourceMap(): Promise<Map<string, StaticResource>> {
    const r = await this.getAllStaticResource()
    const resourceCache = new Map<string, StaticResource>()
    for (let staticResource of r) {
      resourceCache.set(this.buildCacheKey(staticResource.accessPath), staticResource)
    }
    return resourceCache
  }

  async getStaticResourceByWebUrl(url: string[]): Promise<StaticResource | undefined> {
    return (await this.staticResourceMap()).get(this.buildCacheKey(url))
  }
}