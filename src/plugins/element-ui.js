// 按需全局引入 Element Ui组件
import Vue from 'vue';
import 'element-ui/lib/theme-chalk/index.css';

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
  Tooltip
} from 'element-ui';

Vue.use(Popover);
Vue.use(Switch);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Footer);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Button);
Vue.use(Image);
Vue.use(Row);
Vue.use(Col);
Vue.use(Input);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Divider);
Vue.use(Link);
Vue.use(Tooltip);

Vue.use(Loading.directive);

Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;