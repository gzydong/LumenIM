'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

//注：开发环境修改变量后重启服务才会生效
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_URL:'"http://47.105.180.123:9501"',
  WEB_SOCTET_URL:'"ws://47.105.180.123:9501/socket.io"'
  // API_URL:'"http://127.0.0.1:1215"',
  // WEB_SOCTET_URL:'"ws://127.0.0.1:1215/socket.io"'
})
