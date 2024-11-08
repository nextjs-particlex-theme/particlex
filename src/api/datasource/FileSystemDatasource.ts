import type { Datasource, DatasourceItem, StaticResourceContent } from '@/api/datasource/Datasource'
import type { DataSourceConfig } from './types/definitions'
import path from 'node:path'
import { globSync } from 'glob'
import fs from 'node:fs'
import yaml from 'yaml'
import cached from '@/lib/cached'
import mime from 'mime'

type FileSystemDatasourceConfig = {
  /**
   * 资源目录
   */
  resourceGlob: string
  /**
   * 首页文章目录.
   */
  homePostRoot: string
  /**
   * 所有文章的共同根目录
   */
  pageRoots: string[]
}

export default class FileSystemDatasource implements Datasource {

  protected readonly config: FileSystemDatasourceConfig

  private readonly postPaths: string[]

  private readonly homePaths: string[]
  
  public constructor() {
    if (!fs.existsSync(process.env.BLOG_PATH) || !fs.statSync(process.env.BLOG_PATH).isDirectory()) {
      throw new Error(`The path '${process.env.BLOG_PATH}' must be a directory. Please check you BLOG_PATH configuration.`)
    }
    const config = {
      homePostDirectory: process.env.BLOG_HOME_POST_DIRECTORY,
      resourceDirectory: process.env.BLOG_RESOURCE_DIRECTORY,
      postDirectory: FileSystemDatasource.isNested(process.env.BLOG_POST_DIRECTORY, process.env.BLOG_HOME_POST_DIRECTORY) ?
        [process.env.BLOG_POST_DIRECTORY] :
        [process.env.BLOG_POST_DIRECTORY, process.env.BLOG_HOME_POST_DIRECTORY],
    }
    this.config = {
      homePostRoot: `${config.homePostDirectory}`,
      pageRoots: config.postDirectory,
      resourceGlob: `${config.resourceDirectory}/**/*`
    }
    this.postPaths = path.normalize(process.env.BLOG_POST_DIRECTORY).split(path.sep)
    this.homePaths = path.normalize(process.env.BLOG_HOME_POST_DIRECTORY).split(path.sep)
  }

  listPages(pageRelativePath: string | string[], recursion?: boolean): Promise<DatasourceItem[]> {
    const searchGlobs: string[] = []
    pageRelativePath = Array.isArray(pageRelativePath) ? pageRelativePath : [pageRelativePath]

    const append = recursion ? './**/*.{md,mdx}' : './*.{md,mdx}'
    for (const root of pageRelativePath) {
      searchGlobs.push(path.join(root, append).replaceAll('\\', '/'))
    }
    return Promise.resolve(globSync(searchGlobs, { cwd: process.env.BLOG_PATH }).map(v => ({ id: v, visitPath: this.resolvePostWebPath(v), type: v })))
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

  public resolvePostWebPath(filepath: string): string[] {
    const sp = filepath.split(path.sep)
    if (sp[sp.length - 1].endsWith('.md')) {
      const t = sp[sp.length - 1]
      sp[sp.length - 1] = t.substring(0, t.length - 3)
    }
    if (sp[sp.length - 1].endsWith('.mdx')) {
      const t = sp[sp.length - 1]
      sp[sp.length - 1] = t.substring(0, t.length - 4)
    }
    let head = 0

    while (head < sp.length && sp[head] == this.homePaths[head]) {
      head++
    }

    if (head > 0) {
      return sp.slice(head)
    }

    while (head < sp.length && sp[head] == this.postPaths[head]) {
      head++
    }

    // allow use './' as postPaths
    return sp.slice(head)
  }

  private resolveStaticResourceWebPath(filepath: string): string[] {
    const sp = filepath.split(path.sep)
    return sp.slice(1)
  }
  
  getConfig(): Promise<Readonly<DataSourceConfig>> {
    let configFile
    if (!fs.existsSync((configFile = path.resolve(process.env.BLOG_PATH, '_config.yml'))) && !fs.existsSync((configFile = path.resolve(process.env.BLOG_PATH, '_config.yaml')))) {
      throw new Error('Could not find config file from both _config.yml and _config.yaml')
    }
    const parsed = yaml.parse(fs.readFileSync(configFile, { encoding: 'utf8' }))

    const theme = parsed.theme_config ?? {}

    return Promise.resolve({
      title: parsed.title,
      subtitle: parsed.subtitle,
      description: parsed.description,
      author: parsed.author,
      homePage: parsed.authorHome ?? '#',
      indexPageSize: theme.indexPageSize ?? 5,
      background: theme.background ?? [],
      avatar: theme.avatar ?? '',
      favicon: theme.favicon,
      metadata: parsed.metadata
    })
  }

  @cached()
  getPage(item: DatasourceItem['id']): Promise<string> {
    const filepath = path.resolve(process.env.BLOG_PATH, item)
    if (!fs.existsSync(filepath)) {
      throw new Error('Could not find page with item ' + filepath)
    }
    return Promise.resolve(fs.readFileSync(filepath, { encoding: 'utf-8' }))
  }

  @cached()
  getAllPages(): Promise<DatasourceItem[]> {
    return this.listPages(this.config.pageRoots, true)
  }

  @cached()
  getAllHomePosts(): Promise<Array<DatasourceItem>> {
    return this.listPages(this.config.homePostRoot, true)
  }

  @cached()
  getAllStaticResource(): Promise<Array<DatasourceItem>> {
    return Promise.resolve(globSync(this.config.resourceGlob, { cwd: process.env.BLOG_PATH }).map(v => ({ id: v, visitPath: this.resolveStaticResourceWebPath(v), type: v })))
  }

  getResource(id: DatasourceItem['id']): Promise<StaticResourceContent | undefined> {
    const filepath = path.resolve(process.env.BLOG_PATH, id)
    if (!fs.existsSync(filepath)) {
      return Promise.resolve(undefined)
    }
    return Promise.resolve({
      base64: fs.readFileSync(filepath, { encoding: 'base64' }),
      contentType: mime.getType(filepath) ?? 'plain/text'
    })
  }


}