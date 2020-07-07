'use strict'

const BUILD_ENV = process.argv[2]
module.exports = {
  NODE_ENV: '"production"',
  BUILD_ENV: JSON.stringify(BUILD_ENV)
}
