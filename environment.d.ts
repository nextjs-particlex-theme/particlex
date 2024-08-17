declare namespace NodeJS {
  export interface ProcessEnv {
    /**
     * 博客的根路径, 建议使用绝对路径.
     */
    readonly BLOG_PATH: string
    /**
     * 首页博客路径
     */
    readonly BLOG_HOME_POST_DIRECTORY: string
    /**
     * 博客资源目录
     */
    readonly BLOG_RESOURCE_DIRECTORY: string
    /**
     * 博客所有博客的文件
     */
    readonly BLOG_POST_DIRECTORY: string
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
    /**
     * 为博客注入评论脚本
     */
    readonly NEXT_PUBLIC_COMMENT_SCRIPT_INJECT: string | undefined
    /**
     * 评论容器需要注入的表示. <p>
     * 如果需要使用 id 作为标识，则提供以 `#` 开头的字符串即可，例如 `#comment-container`. <p>
     * 如果需要使用 class 作为表示，则提供以 `.` 开头的字符串即可，例如 `.giscus`. <p>
     * 其余字符开头的值将会被忽略
     */
    readonly NEXT_PUBLIC_COMMENT_CONTAINER_IDENTIFIER: string | undefined
  }
}