# Lumen IM 即时聊天
<img alt="GitHub stars badge" src="https://img.shields.io/github/stars/gzydong/LumenIM"> <img alt="GitHub forks badge" src="https://img.shields.io/github/forks/gzydong/LumenIM"> <img alt="GitHub license badge" src="https://img.shields.io/github/license/gzydong/LumenIM">

###  项目介绍
Lumen IM 是一个网页版即时聊天系统，界面简约美观

### 功能模块
- 支持私聊及群聊
- 支持多种聊天消息类型 例如:文本消息、代码块、群投票、图片及其它类型文件，并支持文件下载
- 支持聊天消息撤回、删除(批量删除)、转发消息(逐条转发、合并转发)
- 支持编写笔记

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
git clone https://gitee.com/gzydong/LumenIM.git
或
git clone https://github.com/gzydong/LumenIM.git

## 安装项目依赖扩展组件
npm install

# 启动本地开发环境
npm run dev
# 启动本地开发环境桌面客户端
npm run electron:dev

## 生产环境构建项目
npm run build

## 生产环境桌面客户端打包
npm run electron:build
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