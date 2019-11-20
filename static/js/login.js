import auth from "@/utils/auth";
import {
  loginApi,
  registerApi
} from '@/services/api';
import validate from '@/utils/validate';

export default {
  name: "loginPage",
  data() {
    return {
      activate: 0,

      username: null,
      password: null,
      loginButton: '登录',

      mobile: '',
      regPassword: '',
      regPassword2: '',
      registerButton: '注册'
    };
  },

  created() {

  },
  methods: {
    //消息提示
    error(msg) {
      this.$notify({
        title: "温馨提示：",
        message: msg
      });
    },

    //切换导航
    changingOver: function(index) {
      this.activate = index;
      this.username = this.password = this.mobile = this.regPassword = this.regPassword2 = '';
    },

    //判断是否是IE浏览器
    isIE: function() {
      if (!!window.ActiveXObject || "ActiveXObject" in window) {
        return true;
      } else {
        return false;
      }
    },

    //账号注册方法
    register: function() {
      let that = this,
        params = {
          mobile: this.mobile,
          password: this.regPassword,
          password2: this.regPassword2,
          invite_code: ''
        };

      if (params.mobile == "") {
        this.error("手机号不能为空！");
        return false;
      } else if (validate.validatPhone(params.mobile) == false) {
        this.error("请输入正确的手机号！");
        return false;
      } else if (params.password == "") {
        this.error("密码不能为空！");
        return false;
      } else if (validate.validatPassword(params.password) == false) {
        this.error("请输入字母加数字格式的密码！");
        return false;
      } else if (params.password != params.password2) {
        this.error("两次密码输入不一致！");
        return false;
      }

      that.registerButton = '注册中...';
      registerApi(params).then(res => {
        if (res.code == 200) {
          that.$notify({
            title: "成功",
            message: "注册成功,快去登录吧",
            type: "success"
          });

          that.registerButton = '注册成功...';
          setTimeout(function() {
            that.activate = 0;
          }, 2000);
        } else {
          that.registerButton = '注册';
        }
      }).catch(function(reason) {
        that.$notify({
          title: "提示",
          message: reason,
          type: "warning"
        });
      });
    },

    // 登录方法
    login: function(e) {
      let that = this,
        params = {
          mobile: this.username,
          password: this.password
        };

      if (this.isIE()) {
        alert('对不起当前已禁止IE浏览器的使用，推荐使用Chrome浏览器、360浏览器、QQ浏览器');
        return;
      }

      if (params.mobile == "") {
        this.error("登录账号不能为空！");
        return false;
      } else if (validate.validatPhone(params.mobile) == false) {
        this.error("请输入正确的手机号！");
        return false;
      } else if (params.password == "") {
        this.error("密码不能为空！");
        return false;
      }


      this.loginButton = '登录中..';
      loginApi(params).then(res => {
        if (res.code == 200) {
          res.data.userInfo.sid = res.data.sid;
          that.loginButton = '登录成功...';

          that.$store.dispatch('login', {
            authInfo: {
              access_token: res.data.access_token,
              expires_in: res.data.expires_in
            },
            userInfo:res.data.userInfo
          });

          that.$router.push({
            path: "/"
          });
        } else {
          that.error(res.msg);
          that.loginButton = '登录';
        }
      });
    }
  }
};
