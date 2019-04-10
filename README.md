# NodeJSExampleDemo
NodeJS Example Demo

Node js example demo

此为NodeJS服务器访问静态资源示例，使用方法：

1. 进入到目录webserver下，使用命行安装node_modules：`npm i`
1. 编辑webserver/config/config.js的`hostname`和`port`
1. 开启node服务：`node app.js`
1. 把你的文档放入public中即可，比如在public下建目录yourDocs并在里面放入index.html, 则访问地址为：`xxx/yourDocs/index.html`

**[注：]** 也可以使用pm2管理进程：`pm2 start app.js`
