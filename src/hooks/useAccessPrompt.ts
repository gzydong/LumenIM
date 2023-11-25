export const useAccessPrompt = () => {
  // 3秒后获取用户浏览器权限
  setTimeout(() => {
    window['$notification'].create({
      title: '友情提示',
      content: '此站点仅供演示、学习所用，请勿进行非法操作、上传或发布违法资讯。',
      duration: 30000
    })
  }, 3000)
}
