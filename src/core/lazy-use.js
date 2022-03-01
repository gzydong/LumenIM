import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'

import {
  Notification,
  Popover,
  Switch,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Button,
  Image,
  Loading,
  Row,
  Col,
  MessageBox,
  Form,
  FormItem,
  Input,
  Divider,
  Link,
  Tooltip,
  Autocomplete,
  Scrollbar,
  Avatar,
  Radio,
  RadioGroup,
  Progress,
  Dialog,
  Checkbox
} from 'element-ui'

Vue.use(Popover)
Vue.use(Switch)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Button)
Vue.use(Image)
Vue.use(Row)
Vue.use(Col)
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Divider)
Vue.use(Link)
Vue.use(Tooltip)
Vue.use(Autocomplete)
Vue.use(Scrollbar)
Vue.use(Avatar)
Vue.use(Radio)
Vue.use(Checkbox)
Vue.use(RadioGroup)
Vue.use(Progress)
Vue.use(Dialog)
Vue.use(Loading.directive)

Vue.prototype.$notify = Notification
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$dialog = MessageBox.Dialog

import Contextmenu from 'vue-contextmenujs'
Vue.use(Contextmenu)


import BaiduMap from 'vue-baidu-map'

Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'Q47kDECgU9ROIGiWnyXldH0hL9IVhXxt'
})

process.env.NODE_ENV !== 'production' &&
  console.warn('[Lumen-IM] NOTICE: element-ui use lazy-load.')
