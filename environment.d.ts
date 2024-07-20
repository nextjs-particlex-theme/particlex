declare namespace NodeJS {
  export interface ProcessEnv {
    /**
     * hexo 博客的绝对路径
     */
    readonly HEXO_ABSOLUTE_PATH: string
    /**
     * CDN 中公共路径的 url
     */
    readonly NEXT_PUBLIC_CND_PUBLIC_PATH_BASE_URL: string | undefined
  }
}