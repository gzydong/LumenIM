<template>
  <!-- 用户密码修改组件 -->
  <div id="pwd-mask" >
    <div class="pwd-from-panel">
      <div class="panel-header">
        <p>密码修改</p>
        <i class="iconfont icon-guanbi11" v-on:click="$emit('close',0)"></i>
      </div>

      <div class="panel-body">
        <ul>
          <li>
            <label>旧密码:</label>
            <input type="password" placeholder="请填写旧密码" v-model="oldPassword" autofocus="autofocus" @keyup.enter="submit">
          </li>
          <li>
            <label>新密码:</label>
            <input type="password" placeholder="请设置新的登录密码" v-model="newPassword" @keyup.enter="submit">
            <span class="pwd-tips"><i class="el-icon-info"></i> 密码格式必须为8~16位字母+数字</span>
          </li>
          <li>
            <label>重复密码:</label>
            <input type="password" placeholder="请输入重复密码" v-model="repeatPassword" @keyup.enter="submit">
          </li>
        </ul>
        <span class="error-tips" v-if="error">提示:{{error}}</span>
      </div>

      <div class="panel-footer">
        <button  :class="(oldPassword != '' && newPassword !='' && repeatPassword !='') ? 'pwd-from-submit btn-bag' : 'pwd-from-submit' "   @click="submit">立即修改</button>
      </div>
    </div>
  </div>
</template>

<script>
  import validate from '@/utils/validate'
  import {changePwdApi} from '@/services/api.js'
  export default {
    data() {
      return {
        oldPassword: '',
        newPassword: '',
        repeatPassword: '',
        error: ''
      }
    },
    created() {

    },
    methods: {
      submit() {
        let that = this,
          paramObj = {
            old_password: this.oldPassword,
            new_password: this.newPassword
          };

        if (paramObj.old_password == '') {
          this.error = '旧密码不能为空';
          setTimeout(function() {
            that.error = ''
          }, 1500);
          return;
        } else if (paramObj.new_password == '') {
          this.error = '新密码不能为空';
          setTimeout(function() {
            that.error = ''
          }, 1500);
          return;
        } else if (!validate.validatPassword(paramObj.new_password)) {
          this.error = '新密码格式错误';
          setTimeout(function() {
            that.error = ''
          }, 1500);
          return;
        } else if (paramObj.new_password !== this.repeatPassword) {
          this.error = '两次密码不一致';
          setTimeout(function() {
            that.error = ''
          }, 1500);
          return;
        }

        changePwdApi(paramObj).then(res => {
          if (res.code == 200) {
            that.oldPassword = '';
            that.newPassword = '';
            that.repeatPassword = '';
            that.$emit('close', 1);
          } else {
            that.error = res.msg;
            setTimeout(function() {
              that.error = ''
            }, 1500);
          }
        })
      }
    }
  }
</script>

<style scoped>
  #pwd-mask {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99999;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }


  .pwd-from-panel {
    width: 450px;
    height: 365px;
    background: #FFFFFF;
    margin: auto auto;
    margin-top: calc(50vh - 182px);
  }


  .pwd-from-panel .panel-header {
    height: 45px;
    width: 100%;
    position: relative;
    box-shadow: 0 0 4px #ccc;
    color: #3d3c3c;
  }

  .pwd-from-panel .panel-header i {
    position: absolute;
    right: 15px;
    top: 13px;
    font-size: 20px;
    cursor: pointer;
  }

  .pwd-from-panel .panel-header p {
    height: 45px;
    line-height: 45px;
    text-align: center;

  }

  .pwd-from-panel .panel-body {
    height: calc(100% - 90px);
    width: 100%;
  }

  .panel-body ul {
    padding: 20px 20px 5px 20px;
  }

  .panel-body ul li {
    height: 50px;
    width: 100%;
    margin-bottom: 15px;
  }


  .pwd-tips {
    padding-left: 115px;
    font-size: 12px;
    color: #ccc9c9;
  }

  .panel-body ul li:nth-child(3) {
    margin-top: 25px;
  }

  .panel-body ul li label {
    height: 45px;
    line-height: 47px;
    width: 100px;
    display: inline-block;
    text-align: right;
    color: #7b7b7b;
    padding-right: 10px;
  }

  .panel-body ul li input {
    height: 35px;
    width: 240px;
    border: 1px solid #f1e9e9;
    text-indent: 10px;
  }


  input::-webkit-input-placeholder {
    color: #a9a4a4;
  }


  .error-tips {
    padding-left: 135px;
    color: #ff8383;
  }

  .pwd-from-panel .panel-footer {
    height: 45px;
    width: 100%;
    border-top: 1px solid #f2f2f2;
    text-align: center;
  }

  .pwd-from-submit {
    width: 180px;
    height: 35px;
    background: #e3e3e3;
    margin: 4px auto;
    cursor: pointer;
    color: #fff;
  }

  .btn-bag{
    background:#31c9fe !important;
  }
</style>
