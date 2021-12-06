import UserContacts from './UserContacts'

export default {
  install(Vue) {
    function Contacts(options) {
      let _vm = this

      let close = () => {
        el.$destroy()
        document.body.removeChild(el.$el)
      }

      const el = new Vue({
        router: _vm.$router,
        store: _vm.$store,
        render(h) {
          return h(UserContacts, {
            on: {
              close,
              confirm: data => {
                options.confirm(data)
                close()
              },
            },
            props: {},
          })
        },
      }).$mount()

      document.body.appendChild(el.$el)
    }

    Vue.prototype.$contacts = Contacts
  },
}
