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
    /**
     * yaml 缩进占几个空格，用于快速修复博客中使用 `\t` 进行缩进的问题. <p>
     * 默认为 2.
     */
    readonly YAML_INDENT_SPACE_COUNT: string
  }
}