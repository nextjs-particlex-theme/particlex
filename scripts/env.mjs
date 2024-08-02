import fs from "node:fs"
import readline from "node:readline"

const envFiles = ['.env', '.env.local']


/**
 * 解析 properties
 * @param filepath 文件路径
 * @return {Promise<Record<string, string>>}
 */
function parseProperties(filepath) {
  return new Promise(resolve => {
    const result = {}

    const readlineObj = readline.createInterface({
      input: fs.createReadStream(filepath)
    })

    readlineObj.on('line', (line) => {
      const tmp = line.toString(), index = tmp.indexOf('#')
      if (index !== 0) {
        let strIdx = tmp.indexOf('='),
          key = tmp.substring(0, strIdx)
        result[key] = tmp.substring(strIdx + 1)
      }
    })

    // 文件读取结束
    readlineObj.on('close', () => {
      resolve(result)
    })
  })
}

/**
 * 使用环境变量文件替换环境变量
 */
async function env() {
  for (let envFile of envFiles) {
    if (!fs.statSync(envFile).isFile()) {
      return
    }
    const content = await parseProperties(envFile)
    Object.entries(content).forEach(([key, value]) => {
      process.env[key] = value
    })
  }
}


export default env