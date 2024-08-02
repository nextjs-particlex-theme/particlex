import * as child_process from 'child_process'
import env from "./env.mjs"
import fs from "node:fs"
import path from "node:path"


function rmDir(target) {
  if (fs.statSync(target).isDirectory()) {
    fs.rmSync(target, { recursive: true, force: true })
  }
}

env().then(() => {
  child_process.execSync('next build', {
    stdio: 'inherit',
  })
  if (process.env.NEXT_PUBLIC_CND_PUBLIC_PATH_BASE_URL) {
    rmDir('out/fonts')
    rmDir('out/css')
  }
  const favicon = path.resolve(process.env.BLOG_PATH, 'source', 'favicon.ico')
  if (fs.statSync(favicon).isFile()) {
    fs.cpSync(favicon, 'out/favicon.ico', { force: true })
  }
})