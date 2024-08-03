import type { Resource } from '@/api/datasource/types/definitions'

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
