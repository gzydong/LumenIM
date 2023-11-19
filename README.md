# Lumen IM 即时聊天
<img alt="GitHub stars badge" src="https://img.shields.io/github/stars/gzydong/LumenIM"> <img alt="GitHub forks badge" src="https://img.shields.io/github/forks/gzydong/LumenIM"> <img alt="GitHub license badge" src="https://img.shields.io/github/license/gzydong/LumenIM">

###  项目介绍
Lumen IM 是一个网页版在线聊天项目，前端使用 Naive UI + Vue3，后端采用 GO 开发。

### 功能模块
- 支持私聊及群聊
- 支持多种聊天消息类型 例如:文本消息、代码块、群投票、图片及其它类型文件，并支持文件下载
- 支持聊天消息撤回、删除(批量删除)、转发消息(逐条转发、合并转发)
- 支持编写笔记

### 项目预览
- 地址： [http://im.gzydong.com](http://im.gzydong.com)

### 项目安装(部署)

###### 下载安装
```bash
## 克隆项目源码包
git clone https://gitee.com/gzydong/LumenIM.git
或
git clone https://github.com/gzydong/LumenIM.git

## 安装项目依赖扩展组件
yarn install

# 启动本地开发环境
yarn dev
# 启动本地开发环境桌面客户端
yarn electron:dev

## 生产环境构建项目
yarn build

## 生产环境桌面客户端打包
yarn electron:build
```

###### 修改 .env 配置信息

```env
VITE_BASE_API=http://127.0.0.1:9503
VITE_SOCKET_API=ws://127.0.0.1:9504
```

###### 关于 Nginx 的一些配置
```nginx
server {
    listen       80;
    server_name  www.yourdomain.com;

    root /project-path/dist;
    index  index.html;

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

### 项目源码
|代码仓库|前端源码|后端源码|
|-|-|-|
|Github|https://github.com/gzydong/LumenIM|https://github.com/gzydong/go-chat|
|码云|https://gitee.com/gzydong/LumenIM|https://gitee.com/gzydong/go-chat|


#### 联系方式
QQ作者 : 837215079

### 如果你觉得还不错，请 Star , Fork 给作者鼓励一下。