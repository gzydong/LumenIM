import router from '@/router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import config from '@/config/config'
import { getToken } from '@/utils/auth'

NProgress.configure({
  showSpinner: false,
})

const WEBSITE_NAME = config.WEBSITE_NAME

// 登录用户强制重定向页面
const redirect = ['/auth/login', '/auth/register', '/auth/forget']

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
    ? `${WEBSITE_NAME} | ${to.meta.title}`
    : WEBSITE_NAME

  // 如果有token说明该用户已登陆
  if (getToken()) {
    if (redirect.indexOf(to.path) >= 0) {
      next('/')
    }
  } else if (to.meta.needLogin) {
    next('/auth/login')
  }

  NProgress.start()
  next()
})

router.afterEach(() => {
  NProgress.done()
})
