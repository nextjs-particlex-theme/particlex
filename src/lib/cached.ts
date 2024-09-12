import { isPromise } from '@/lib/ObjectUtils'
import { LRUCache } from 'lru-cache'

type CachedValue = {
  isPromise: boolean
  data: any
}

/**
 * 缓存某个类中方法的返回值.
 * @param maxSize 缓存最大数量
 * @param cacheKeyBuilder 如何构建缓存的键
 */
export default function cached(cacheKeyBuilder?: (...args: unknown[]) => string, maxSize: number = 1000) {
  return function(_: any, __: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    if (process.env.NODE_ENV === 'development') {
      // no cache in development.
      return
    }
    const cache = new LRUCache<string, CachedValue>({
      max: maxSize,
    })

    descriptor.value = function (...args: any[]) {
      const cacheKey = cacheKeyBuilder ? cacheKeyBuilder(args) : JSON.stringify(args)
      const cachedValue = cache.get(cacheKey)
      if (cachedValue) {
        return cachedValue.isPromise ? Promise.resolve(cachedValue.data) : cachedValue.data
      }

      const result = originalMethod.apply(this, args)
      if (isPromise(result)) {
        return result.then(r => {
          cache.set(cacheKey, {
            isPromise: true,
            data: r
          })
          return r
        }).catch(e => {
          return Promise.reject(e)
        })
      } else {
        cache.set(cacheKey, {
          isPromise: false,
          data: result
        })
        return result
      }

    }
  }
}
