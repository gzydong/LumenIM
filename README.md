# LumenIM Web 网页版即时聊天项目

>项目前端采用Vue + Element Ui 模式进行开发,项目模仿了目前流行的一些网页版聊天项目，功能包含了添加好友、好友私信、创建群聊、邀请群聊、发送聊天消息(文字消息、图片消息、表情包及文件传输)等相关功能。


>项目展示 [查看预览](http://47.105.180.123:83/)


<div align="center" style="text-align:center">
    <img src="https://t1.picb.cc/uploads/2019/11/11/kVrXBv.png"  width="500" >
    <img src="https://t1.picb.cc/uploads/2019/11/11/kVrFJi.png"  width="500" >
    <img src="https://t1.picb.cc/uploads/2019/11/11/kVrP1L.png"  width="500" >
    <img src="https://t1.picb.cc/uploads/2019/11/11/kV8Syi.png"  width="500" >
    <img src="https://t1.picb.cc/uploads/2019/11/11/kVMZMg.png"  width="500" >
</div>

###项目安装及部署
``` bash
# 安装项目依赖扩展组件
npm install

# 启动本地开发环境
npm run dev

# 生产环境构建项目
npm run build

# 生产环境构建项目并查看构建报告
npm run build --report
```

有关后端的相关源码信息请移步至 https://github.com/gzydong/lumenim


关于Nginx的一些配置
```
    server {
        listen       80;
        server_name  www.your-domain.coom;

        root /project-path/dist;
        index  index.html

        # 根请求会指向的页面
        location / {
          # 此处的 @router 实际上是引用下面的转发，否则在 Vue 路由刷新时可能会抛出 404
          try_files $uri $uri/ @router;
          # 请求指向的首页
          index index.html;
        }

        # 由于路由的资源不一定是真实的路径，无法找到具体文件
        # 所以需要将请求重写到 index.html 中，然后交给真正的 Vue 路由处理请求资源
        location @router {
          rewrite ^.*$ /index.html last;
        }

        location ~ .*\.(gif|jpg|jpeg|png|bmp|swf|flv|ico)$ {
            expires 30d;
            access_log off;
        }

        location ~ .*\.(js|css)?$ {
            expires 7d;
            access_log off;
        }

        location = /favicon.ico {
          root  /project-path;
        }
    }
```

```
npm install chromedriver --chromedriver_cdnurl=http://cdn.npm.taobao.org/dist/chromedriver
npm install --ignore-scripts
```