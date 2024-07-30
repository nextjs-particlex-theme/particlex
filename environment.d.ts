declare namespace NodeJS {
  export interface ProcessEnv {
    /**
     * 博客的路径, 建议使用绝对路径.
     */
    readonly BLOG_PATH: string
    /**
     * CDN 中公共路径的 url
     */
    readonly NEXT_PUBLIC_CND_PUBLIC_PATH_BASE_URL: string | undefined
    /**
     * 开启数据源缓存.
     */
    readonly DATASOURCE_CACHE_ENABLE: 'true' | 'false' | undefined
  }
}