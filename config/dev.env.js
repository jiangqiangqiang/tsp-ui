'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const BUILD_ENV = process.argv[2]

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BUILD_ENV: '"development"'
})
