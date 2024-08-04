export interface CacheProvider {

  /**
   * 获取缓存的值，如果不存在，则调用 init
   */
  get<T>(key: string, init: () => T): T

  /**
   * 获取缓存的值，如果不存在，则调用 init
   */
  getWithPromise<T>(key: string, init: () => Promise<T>): Promise<T>
}

/**
 * 简单实现，不包括类型检查
 */
export class CacheProviderImpl implements CacheProvider{
  private holder: Record<string, any> = {}
  
  get<T>(key: string, init: () => T): T {
    const val = this.holder[key]
    if (val) {
      return val
    }
    const r = init()
    this.holder[key] = r
    return r
  }
  
  async getWithPromise<T>(key: string, init: () => Promise<T>): Promise<T> {
    const val = this.holder[key]
    if (val) {
      return Promise.resolve(val)
    }
    const result = await init()
    this.holder[key] = result
    return result
  }
  
}