declare namespace NodeJS {
  export interface ProcessEnv {
    /**
     * hexo 博客的路径
     */
    readonly HEXO_ABSOLUTE_PATH: string
    /**
     * CDN 中公共路径的 url
     */
    readonly NEXT_PUBLIC_CND_PUBLIC_PATH_BASE_URL: string | undefined
    /**
     * highlight.js 来源，不填则使用内部的包
     */
    readonly NEXT_PUBLIC_HIGHLIGHT_JS_PATH: string | undefined
    /**
     * highlight.js css 样式来源
     */
    readonly NEXT_PUBLIC_HIGHLIGHT_JS_CSS_PATH: string
  }
}