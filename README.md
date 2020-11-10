# Lumen IM 即时聊天系统(前端)

Lumen IM 是一个网页版在线即时聊天项目，前端使用 Element-ui + Vue ，后端使用 PHP+Swoole 进行开发。项目后端采用 Lumen 框架，并结合了 Composer laravel-swoole 组件、让 Luemn 框架支持Swoole运行环境。

- 基于Swoole WebSocket服务做消息即时推送
- 支持私聊及群聊
- 支持聊天消息类型有文本、代码块、图片及其它类型文件，并支持文件下载
- 支持聊天消息撤回、删除或批量删除、转发消息（逐条转发、合并转发）
- 支持编写个人笔记、支持笔记分享(好友或群)

>项目展示 ([在线体验: http://im.gzydong.club](http://im.gzydong.club)

### 前端项目安装及部署
#### 注意:项目需要与后端一起使用，有关后端部署及相关源码信息请移步至 [https://github.com/gzydong/LumenIM-Serve](https://github.com/gzydong/LumenIM-Serve)
```bash
# 克隆项目源码包
git clone git@github.com:gzydong/LumenIM.git

# 安装项目依赖扩展组件
npm install

# 启动本地开发环境
npm run dev

# 生产环境构建项目
npm run build

# 生产环境构建项目并查看构建报告
npm run build --report
```

##### 修改配置信息
```
  API_URL:'"http://xxx.yourdomain.com"',
  WEB_SOCKET_URL:'"ws://xxx.yourdomain.com/socket.io"'
```

##### 关于Nginx的一些配置
```nginx
server {
    listen       80;
    server_name  www.yourdomain.coom;

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
        access_log on;
    }

    location ~ .*\.(js|css)?$ {
        expires 7d;
        access_log on;
    }
}
```

## Donate
如果你觉得项目对你有帮助，可以请作者喝杯咖啡☕️！鼓励下

![loading.png](https://cdn.learnku.com/uploads/images/202011/10/46424/RaJik9TWDi.png!large)

<img src="https://cdn.learnku.com/uploads/images/202011/10/46424/RaJik9TWDi.png!large">