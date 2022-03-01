# Lumen IM 即时聊天系统(前端)

###  项目介绍
Lumen IM 是一个网页版在线即时聊天项目，前端使用 Element-ui + Vue，后端采用了基于 Swoole 开发的 Hyperf 协程框架进行接口开发，并使用 WebSocket 服务进行消息实时推送。

目前前端已兼容golang后端

### 功能模块
- 基于 Swoole WebSocket 服务做消息即时推送
- 支持私聊及群聊
- 支持多种聊天消息类型 例如:文本消息、代码块、群投票、图片及其它类型文件，并支持文件下载
- 支持聊天消息撤回、删除(批量删除)、转发消息(逐条转发、合并转发)
- 支持编写个人笔记

### 项目预览
- 地址： [http://im.gzydong.club](http://im.gzydong.club)
- 账号： 18798272054 或 18798272055
- 密码： admin123

### 项目安装(部署)
###### 设置 npm 镜像源
```language
npm config set registry https://registry.npm.taobao.org
```

###### 下载安装
```bash
## 克隆项目源码包
git clone git@gitee.com:gzydong/LumenIM.git
或
git clone git@github.com:gzydong/LumenIM.git

## 安装项目依赖扩展组件
npm install

# 启动本地开发环境
npm run serve

## 生产环境构建项目
npm run build

## 生产环境构建项目并查看构建报告
npm run build --report
```

###### 修改 .env 配置信息

```env
VUE_APP_API_BASE_URL=http://xxx.yourdomain.com
VUE_APP_WEB_SOCKET_URL=ws://xxx.yourdomain.com/socket.io
VUE_APP_WEBSITE_NAME="Lumen IM"
```

###### 关于 Nginx 的一些配置
```nginx
server {
    listen       80;
    server_name  www.yourdomain.com;

    root /project-path/dist;
    index  index.html;

    ## 解决 VueRouter History 模式下 页面刷新404问题
    location / {
      try_files $uri $uri/ /index.html;
    }

    location ~ .*\.(gif|jpg|jpeg|png|bmp|swf|flv|ico)$ {
        expires 7d;
    }

    location ~ .*\.(js|css)?$ {
        expires 7d;
    }
}
```

注意：项目需要与后端一起使用，[点击获取源码](https://github.com/gzydong/hyperf-chat)。

### 项目源码
|代码仓库|前端源码|后端源码|
|-|-|-|
|Github|https://github.com/gzydong/LumenIM|https://github.com/gzydong/hyperf-chat|
|码云|https://gitee.com/gzydong/LumenIM|https://gitee.com/gzydong/hyperf-chat|


#### 联系方式
QQ作者 : 837215079
QQ技术交流群 : 513037553

### 如果你觉得还不错，请 Star , Fork 给作者鼓励一下。