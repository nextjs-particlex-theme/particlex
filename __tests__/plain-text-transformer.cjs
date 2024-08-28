const fs = require('fs');
const path = require('path');

module.exports = {
  process(src, filename) {
    const content = fs.readFileSync(filename, 'utf-8');
    return {
      code: `module.exports = ${JSON.stringify(content)}`
    }
  },
};
