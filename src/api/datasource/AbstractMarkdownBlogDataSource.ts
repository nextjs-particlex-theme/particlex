import type { BlogDataSource, Config } from '@/api/datasource/types'
import { StaticResource } from '@/api/datasource/types'
import { Post } from '@/api/datasource/types'
import path from 'node:path'
import { generateShallowToc, highlight, markdownToHtml, resourcesToMap } from '@/api/datasource/util'
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

  constructor(config: AbstractBlogDataSourceCons) {
    this.config = {
      homePostGlob: `${config.homePostDirectory}/**/*.md`,
      postGlob: `${config.postDirectory}/**/*.md`,
      resourceGlob: `${config.resourceDirectory}/**/*`
    }
  }

  /**
   * 获取配置
   */
  abstract getConfig(): Promise<Config>

  /**
   * 获取博客的 web 访问路径.
   * @param path 博客文件路径
   */
  abstract resolvePostWebPath(path: string): string

  /**
   * 获取静态文件的 web 访问路径
   * @param path 静态文件路径
   */
  abstract resolveStaticResourceWebPath(path: string): string

  pageHomePosts(page: number = 0, size: number = 5): Promise<Post[]> {
    const files = globSync(this.config.homePostGlob, { cwd: process.env.BLOG_PATH })
    return this.parseMarkdownFiles(files, page * size, size)
  }

  pagePostsSize(): Promise<number> {
    return Promise.resolve(globSync(this.config.homePostGlob, { cwd: process.env.BLOG_PATH }).length)
  }

  async getAllPost(): Promise<Map<string, Post>> {
    const files = globSync(this.config.postGlob, { cwd: process.env.BLOG_PATH })
    return resourcesToMap(await this.parseMarkdownFiles(files))
  }

  getAllStaticResource(): Promise<Map<string, StaticResource>> {
    const files = globSync(this.config.resourceGlob, { cwd: process.env.BLOG_PATH })

    return Promise.resolve(
      resourcesToMap(
        files.map(v =>
          new StaticResource(path.resolve(process.env.BLOG_PATH, v), this.resolveStaticResourceWebPath(v)))
      )
    )
  }

  private parseHexoPostContent(postPath: string): Promise<PostContent> {
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
          if (line.startsWith('---')) {
            metadataCollectStatus++
          } else {
            if (metadataCollectStatus === 1) {
              metadataStrArr.push(line)
            }
          }
        } else {
          content.push(line)
        }
      })

      rl.on('close', () => {
        resolve({
          metadata: yaml.parse(metadataStrArr.join('\n')),
          content: markdownToHtml(content.join('\n'))
        })
      })
    })
  }


  protected async parseMarkdownFiles(files: string[], begin = 0, take?: number): Promise<Post[]> {
    const r: Post[] = []

    const len = take === undefined ? files.length : Math.min(take + begin, files.length)

    for (let i = Math.max(0, begin); i < len; i++) {
      const file = files[i]
      const { metadata, content } = await this.parseHexoPostContent(path.resolve(process.env.BLOG_PATH, file))
      let source = this.resolvePostWebPath(file)

      r.push(new Post({
        title: metadata.title,
        date: metadata.date ? new Date(metadata.date).valueOf() : undefined,
        source,
        id: source,
        slug: '',
        toc: generateShallowToc(content, nodes => {
          const t = nodes.item(1) as any
          const a = nodes.item(0) as any
          return {
            title: t.data,
            anchor: a.getAttribute('href') ?? t.data
          }
        }),
        content: highlight(content),
        tags: [],
        categories: [],
      }))
    }
    return r
  }
}