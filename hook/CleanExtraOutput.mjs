/**
 * 如果配置了 CDN，则删除多余的静态资源.
 * 由于 next.js 限制，在 webpack hook 的 done 阶段删除不了 out 目录中的内容，所以只能在这里删除...
 */
import fs from "node:fs"

if (process.env.NEXT_PUBLIC_CND_PUBLIC_PATH_BASE_URL && fs.statSync('out').isDirectory()) {
  fs.rmSync('out', { recursive: true, force: true })
}

