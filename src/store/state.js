// 根级别的 state
const states = {
  socketStatus: false,
  website_name: process.env.WEBSITE_NAME,
  copyright: `©2020 ${process.env.WEBSITE_NAME} 在线聊天 <a href="https://github.com/gzydong/LumenIM" style="color: #777272;font-weight: 400;" target="_blank">Github源码</a>`,

  //头像加载失败后的默认头像
  detaultAvatar: "this.src='/static/image/detault-avatar.jpg'",
}

export default states;
