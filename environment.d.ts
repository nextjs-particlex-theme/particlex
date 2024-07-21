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
    /**
     * highlight.js 引入方式，支持外部链接引入，同时也支持直接打包进博客的静态文件进行分发
     */
    readonly HIGHLIGHT_JS_RESOLVE_TYPE: undefined | 'external' | 'bundled'
    /**
     * 如果 `HIGHLIGHT_JS_RESOLVE_TYPE` 为 `external`，则此处必须填入一个外部链接地址.
     * 如果 `HIGHLIGHT_JS_RESOLVE_TYPE` 为 `bundled`，则此参数不会起任何作用，此时将导入所有语言
     *
     */
    readonly HIGHLIGHT_JS_RESOLVE_DATA: undefined | string
    /**
     * highlight.js 样式来源
     */
    readonly NEXT_PUBLIC_HIGHLIGHT_JS_STYLE_PATH: string
  }
}