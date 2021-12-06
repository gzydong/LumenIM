import UserCardDetail from './UserCardDetail'

export default {
  install(Vue) {
    function user(user_id, options) {
      let _vm = this
      const el = new Vue({
        router: _vm.$router,
        store: _vm.$store,
        render(h) {
          return h(UserCardDetail, {
            on: {
              close: () => {
                el.$destroy()
                document.body.removeChild(el.$el)
              },
              changeRemark: data => {
                options.editRemarkCallbak && options.editRemarkCallbak(data)
              },
            },
            props: {
              user_id,
            },
          })
        },
      }).$mount()

      document.body.appendChild(el.$el)
    }

    Vue.prototype.$user = user
  },
}
