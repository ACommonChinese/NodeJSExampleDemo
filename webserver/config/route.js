/**
 * @method 请求路由处理
 * Create by Cris on 03/31/2019
 */
const fs = require('fs')
const promisify = require('util').promisify
// 同步读路由为文件或者为文件夹
const stat = promisify(fs.stat)
// 同步读文件夹
const readdir = promisify(fs.readdir)
// 利用express读静态资源文件
const express = require('express')
const app = express()
const path = require('path')
const compress = require('./compress')
const range = require('./range')
// 是否需要刷新缓存内容
const isRefresh = require('./cache')
// 日志输出
const log4js = require("log4js")
const log4js_config = require("./logconf.json")
log4js.configure(log4js_config)
const LogFile = log4js.getLogger('errorFile')
// 所读文件流
let rs

module.exports = async function (req, res, filePath, config) {
  app.use(express.static(config.srcdir))
  try {
    // 读路由状态
    const stats = await stat(filePath)
    // 如果是文件
    if (stats.isFile()) {
      // 判断缓存是否过期，过期刷新缓存
      if (isRefresh(stats, req, res)) {
        res.statusCode = 304
        res.end()
        return
      }
      // 判断是否为range请求
      const {code, start, end} = range(stats.size, req, res)
      if (code === 200) {
        res.statusCode = 200
        rs = fs.createReadStream(filePath)
      } else {
        res.statusCode = 206
        rs = fs.createReadStream(filePath, {start, end})
      }
      // 读文件，根据浏览器支持的压缩方式压缩传输的文件
      if (filePath.match(config.compress)) {
        rs = compress(rs, req, res)
      }
      rs.pipe(res)
    } else if (stats.isDirectory()) {
      // 如果是文件夹读文件夹内容
      const files = await readdir(filePath)
      if (JSON.stringify(files.join('')).match(config.pagematch)) {
        const currentfile = path.join(filePath, config.defaultpage)
        rs = fs.createReadStream(currentfile)
        rs = compress(rs, req, res)
        rs.pipe(res)
      } else {
        // 未匹配到项目文件夹存在index.html文件
        res.statusCode = 200
        const failpage = path.join(config.root, config.srcdir, '404.html')
        res.sendfile(failpage)
      }
    }
  } catch (err) {
    // 将报错写入日志
    LogFile.error(err)
    res.statusCode = 200
    const failpage = path.join(config.root, config.srcdir, '404.html')
    res.sendFile(failpage)
  }
}
