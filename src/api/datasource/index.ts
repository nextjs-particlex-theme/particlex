import hexo from './hexo/index'
import type { BlogDataSource } from '@/api/datasource/types/BlogDataSource'

let datasource: BlogDataSource

if (process.env.DATASOURCE_CACHE_ENABLE === 'true') {
  const cacheHolder: Record<string, any> = {}

  // eslint-disable-next-line no-undef
  datasource = new Proxy(hexo, {
    get(target: BlogDataSource, p: string | symbol): any {
      // @ts-ignore
      const orig = target[p]
      if (typeof orig === 'function') {
        return function (...args: unknown[]) {
          const key = orig.name + ':' + args.join('_')
          if (cacheHolder[key]) {
            return cacheHolder[key]
          } else {
            const r = orig.apply(target, args)
            if (r.then && r.catch) {
              return r.then((result: unknown) => {
                cacheHolder[key] = result
                return result
              })
            }
            return cacheHolder[key] = orig.apply(target, args)
          }
        }
      } else {
        return orig
      }
    }
  })
} else {
  datasource = hexo
}


export default datasource
