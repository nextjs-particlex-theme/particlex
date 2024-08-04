import { isPromise } from '@/lib/ObjectUtils'

/**
 * 缓存某个类中方法的返回值.
 * @param cacheKeyBuilder 如何构建缓存的键
 */
export default function cached(cacheKeyBuilder?: (...args: unknown[]) => string) {
  return function(_: any, __: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    const cache = new Map<string, any>()

    descriptor.value = function (...args: any[]) {
      const cacheKey = cacheKeyBuilder ? cacheKeyBuilder(args) : JSON.stringify(args)
      if (cache.has(cacheKey)) {
        return cache.get(cacheKey)
      }

      const result = originalMethod.apply(this, args)
      if (isPromise(result)) {
        return result.then(r => {
          cache.set(cacheKey, r)
          return r
        })
      } else {
        cache.set(cacheKey, result)
        return result
      }

    }
  }
}
