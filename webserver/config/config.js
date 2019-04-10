/**
 * @method 配置文件
 * Create by Cris on 03/31/2019
 */

module.exports = {
  root: process.cwd(),
  hostname: '30.16.104.12',
  port: 8888,
  compress: /\.(html|js|css|md)/,
  srcdir: 'public', // 静态资源文件目录
  defaultpage: 'index.html', // 默认页面
  pagematch: /index.html/,
  cache: {
    maxAge: 600,
    expires: true,
    cacheControl: true,
    lastModified: true,
    etag: true
  }
}