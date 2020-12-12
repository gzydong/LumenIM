// 根级别的 state
const states = {
  socketStatus: false,
  website_name: process.env.VUE_APP_WEBSITE_NAME,
  copyright: `©2020 ${process.env.VUE_APP_WEBSITE_NAME} 在线聊天 <a href="https://github.com/gzydong/LumenIM" style="color: #777272;font-weight: 400;" target="_blank">Github源码</a>`,

  //头像加载失败后的默认头像
  detaultAvatar: "this.src='"+require("@/assets/image/detault-avatar.jpg")+"'",
}

export default states;
