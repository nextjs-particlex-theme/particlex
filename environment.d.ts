declare namespace NodeJS {
  export interface ProcessEnv {
    /**
     * hexo 博客的绝对路径
     */
    readonly HEXO_ABSOLUTE_PATH: string
  }
}