import type { BlogDataSource, Config } from '@/api/datasource/types'
import { Post, StaticResource } from '@/api/datasource/types'
import path from 'node:path'
import {
  generateShallowToc,
  highlight,
  markdownToHtml,
  utilMarkdownGenerateCaster
} from '@/api/datasource/util'
import readline from 'node:readline'
import fs from 'node:fs'
import yaml from 'yaml'
import { globSync } from 'glob'

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

export default abstract class AbstractMarkdownBlogDataSource implements BlogDataSource {

  protected readonly config: AbstractBlogDatasourceConfig

  private postCache: Map<string, Post> | undefined
  
  private resourceCache: Map<string, StaticResource> | undefined
  
  protected constructor(config: AbstractBlogDataSourceCons) {
    this.config = {
      homePostGlob: `${config.homePostDirectory}/**/*.md`,
      postGlob: `${config.postDirectory}/**/*.md`,
      resourceGlob: `${config.resourceDirectory}/**/*`
    }
    this.getAllPost().then(r => {
      const postCache = new Map<string, Post>()
      for (let post of r) {
        postCache.set(this.buildCacheKey(post.source), post)
      }
      this.postCache = postCache
    })

  }
  
  protected buildCacheKey(path: string[]): string {
    return path.join('-')
  }
  

  /**
   * 获取配置
   */
  abstract getConfig(): Promise<Config>

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

  async pageHomePosts(page: number = 0, size: number = 5): Promise<Post[]> {
    const files = globSync(this.config.homePostGlob, { cwd: process.env.BLOG_PATH })
    return (await this.parseMarkdownFiles(files, page * size, size)).sort((a, b) => {
      const v1 = a.date ?? 0
      const v2 = b.date ?? 0
      return v2 - v1
    })
  }

  pagePostsSize(): Promise<number> {
    return Promise.resolve(globSync(this.config.homePostGlob, { cwd: process.env.BLOG_PATH }).length)
  }

  async getAllPost(): Promise<Post[]> {
    const files = globSync(this.config.postGlob, { cwd: process.env.BLOG_PATH })
    return await this.parseMarkdownFiles(files)
  }

  getAllStaticResource(): Promise<StaticResource[]> {
    const files = globSync(this.config.resourceGlob, { cwd: process.env.BLOG_PATH })
    return Promise.resolve(
      files.map(v =>
        new StaticResource(path.resolve(process.env.BLOG_PATH, v), this.resolveStaticResourceWebPath(v)))
    )
  }

  private parsePostContent(postPath: string): Promise<PostContent> {
    return new Promise((resolve) => {
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
          metadata = yaml.parse(metadataStrArr.slice(1, metadataStrArr.length - 1).join('\n'))
          html = markdownToHtml(content.join('\n'))
        }
        resolve({
          metadata: metadata ?? {},
          content: html
        })
      })
    })
  }


  protected async parseMarkdownFiles(files: string[], begin = 0, take?: number): Promise<Post[]> {
    const r: Post[] = []

    const len = take === undefined ? files.length : Math.min(take + begin, files.length)

    for (let i = Math.max(0, begin); i < len; i++) {
      const file = files[i]
      const { metadata, content } = await this.parsePostContent(path.resolve(process.env.BLOG_PATH, file))
      let source = this.resolvePostWebPath(file)

      r.push(new Post({
        title: metadata.title,
        date: metadata.date ? new Date(metadata.date).valueOf() : undefined,
        source,
        id: source.join('-'),
        slug: '',
        toc: generateShallowToc(content, utilMarkdownGenerateCaster),
        content: highlight(content),
        tags: [],
        categories: [],
      }))
    }
    return r
  }

  async getPostByWebUrl(url: string[]): Promise<Post | undefined> {
    if (!this.postCache) {
      const r = await this.getAllPost()
      const resourceCache = new Map<string, Post>()
      for (let p of r) {
        resourceCache.set(this.buildCacheKey(p.source), p)
      }
      this.postCache = resourceCache
    }
    return this.postCache.get(this.buildCacheKey(url))
  }

  async getStaticResourceByWebUrl(url: string[]): Promise<StaticResource | undefined> {
    if (!this.resourceCache) {
      const r = await this.getAllStaticResource()
      const resourceCache = new Map<string, StaticResource>()
      for (let staticResource of r) {
        resourceCache.set(this.buildCacheKey(staticResource.accessPath), staticResource)
      }
      this.resourceCache = resourceCache
    }
    return this.resourceCache.get(this.buildCacheKey(url))
  }
}