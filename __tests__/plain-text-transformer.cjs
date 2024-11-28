const fs = require('fs')

module.exports = {
  process(_, filename) {
    const content = fs.readFileSync(filename, 'utf-8')
    return {
      code: `module.exports = ${JSON.stringify(content)}`
    }
  },
}
