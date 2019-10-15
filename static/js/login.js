import auth from "@/request/auth";
export default {
  name: "wxFixed",
  data() {
    return {
      arr: [
        {
          id: 0,
          name: "我要登录"
        },
        {
          id: 1,
          name: "用户注册"
        }
      ],
      headType: 0,
      logphone: null,
      logpwd: null
    };
  },
  methods: {
    // 注册
    change(val) {
        this.logphone = val.replace(/[^0-9]+/g,'');
    },
    error(msg){
      this.$notify({
          title: "温馨提示：",
          message: msg
      });
    },
    register: function() {
      let that = this;
      let mobile = this.$refs.mobile.value;
      let pwd = this.$refs.pwd.value;
      let pwd1 = this.$refs.pwd1.value;
      if (mobile == "") {
        this.error("手机号不能为空！");
        return false;
      } else if (that.isPoneAvailable(mobile) == false) {
        this.error("请输入正确的手机号！");
        return false;
      } else if (pwd == "") {
        this.error("密码不能为空！");
        return false;
      } else if (that.ispwdAvailable(pwd) == false) {
        this.error("请输入字母加数字格式的密码！");
        return false;
      } else if (pwd1 == "") {
        this.error("请重复你的密码！");
        return false;
      } else if (pwd1 != pwd) {
        this.error("两次密码输入不一致！");
        return false;
      }

      let paramObj = {
        mobile: mobile,
        password: pwd,
        invite_code: 123456
      };

      that.$server.register(paramObj).then(res => {
        if (res.code == 200) {
          this.$notify({
            title: "成功",
            message: "注册成功,快去登录吧",
            type: "success"
          });
          that.$refs.mobile.value = "";
          that.$refs.pwd.value = "";
          that.$refs.pwd1.value = "";
          that.headType = 0;
        }
      });
    },

    // 登录
    login: function(e) {
      let that = this;

      this.logphone = this.$refs.logphone.value;
      this.logpwd = this.$refs.logpwd.value;
      let mobile = this.$refs.logphone.value;
      let pwd = this.$refs.logpwd.value;

      if (mobile == "") {
        this.error("手机号不能为空！");
        return false;
      } else if (that.isPoneAvailable(mobile) == false) {
        this.error("请输入正确的手机号！");
        return false;
      } else if (pwd == "") {
        this.error("密码不能为空！");
        return false;
      }

      let paramObj = {
        mobile: mobile,
        password: pwd
      };

      that.$server.login(paramObj).then(res => {
        if (res.code == 200) {
          auth.setToken(res.data.access_token);
          this.$notify({
            title: "成功",
            message: "登录成功，即将跳转！",
            type: "success"
          });

          that.$refs.logphone.value = "";
          that.$refs.logpwd.value = "";

          that.$router.push({
            path: "/dialogue"
          });
        } else {
          this.error(res.msg);
        }
      });
    },

    isPoneAvailable: function(mobile) {
      var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!myreg.test(mobile)) {
        return false;
      } else {
        return true;
      }
    },

    ispwdAvailable: function(pwd) {
      let myreg = /^(?![^a-zA-Z]+$)(?!\D+$)/;
      if (!myreg.test(pwd)) {
        return false;
      } else {
        return true;
      }
    },
    clickHead: function(e) {
      let that = this;
      this.headType = e;
    }
  }
};