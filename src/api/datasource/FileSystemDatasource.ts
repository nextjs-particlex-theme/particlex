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
   * 首页文章目录.
   */
  homePostGlob: string
  /**
   * 所有文章的共同根目录
   */
  pageGlob: string[]
  /**
   * 资源目录
   */
  resourceGlob: string
}

export default class FileSystemDatasource implements Datasource {

  protected readonly config: FileSystemDatasourceConfig

  private readonly postPaths: string[]

  private readonly homePaths: string[]
  
  public constructor() {
    const config = {
      homePostDirectory: process.env.BLOG_HOME_POST_DIRECTORY,
      resourceDirectory: process.env.BLOG_RESOURCE_DIRECTORY,
      postDirectory: FileSystemDatasource.isNested(process.env.BLOG_POST_DIRECTORY, process.env.BLOG_HOME_POST_DIRECTORY) ?
        [process.env.BLOG_POST_DIRECTORY] :
        [process.env.BLOG_POST_DIRECTORY, process.env.BLOG_HOME_POST_DIRECTORY],
    }
    this.config = {
      homePostGlob: `${config.homePostDirectory}/**/*.{md,mdx}`,
      pageGlob: config.postDirectory.map(v => `${v}/**/*.{md,mdx}`),
      resourceGlob: `${config.resourceDirectory}/**/*`
    }
    this.postPaths = path.normalize(process.env.BLOG_POST_DIRECTORY).split(path.sep)
    this.homePaths = path.normalize(process.env.BLOG_HOME_POST_DIRECTORY).split(path.sep)
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

  private resolvePostWebPath(filepath: string): string[] {
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
      favicon: theme.favicon
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
    return Promise.resolve(globSync(this.config.pageGlob, { cwd: process.env.BLOG_PATH }).map(v => ({ id: v, visitPath: this.resolvePostWebPath(v), type: v })))
  }

  @cached()
  getAllHomePosts(): Promise<Array<DatasourceItem>> {
    return Promise.resolve(globSync(this.config.homePostGlob, { cwd: process.env.BLOG_PATH }).map(v => ({ id: v, visitPath: this.resolvePostWebPath(v), type: v })))
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