/**
 * @method 创建服务器
 * Create by Cris on 03/31/2019
 */

// 引入express
const express = require('express')
const app = express()
const path = require('path')
// 引入配置文件项
const conf = require('./config/config')
// 引入路由配置项
const route = require('./config/route.js')
// 路由
app.use(express.static('public'))
app.use((req, res, next) => {
  // 请求链接文件目录
  const filePath = path.join(__dirname, conf.srcdir, req.originalUrl)
  route(req, res, filePath, conf)
})

app.listen(conf.port, conf.hostname, () => {
  // 输出访问链接
  console.log(`Server listen at http://${conf.hostname}:${conf.port}`)
})
