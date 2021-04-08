<template>
  <div>
    <div class="container">
      <h4>帐户绑定</h4>
      <el-row type="flex" class="list-item">
        <el-col :span="20" class="left-col">
          <div class="avatar">
            <img
              src="~@/assets/image/github-avatar.jpg"
              width="50"
              height="50"
            />
          </div>
          <div class="conent">
            <h4>绑定 github</h4>
            <p>当前未绑定github账号</p>
          </div>
        </el-col>
        <el-col :span="4" class="right-col">
          <span class="action">立即绑定</span>
        </el-col>
      </el-row>

      <el-row type="flex" class="list-item">
        <el-col :span="20" class="left-col">
          <div class="avatar">
            <img
              src="~@/assets/image/gitee-avatar.jpg"
              width="50"
              height="50"
            />
          </div>
          <div class="conent">
            <h4>绑定 gitee</h4>
            <p>当前未绑定gitee账号</p>
          </div>
        </el-col>
        <el-col :span="4" class="right-col">
          <span class="action">立即绑定</span>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  name: 'BindingPage',
}
</script>
<style lang="less" scoped>
.container h4 {
  color: rgba(0, 0, 0, 0.85);
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  margin-bottom: 12px;
  margin-bottom: 30px;
}

.container .list-item {
  height: 70px;
  margin: 5px 25px 5px 0px;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 20px;

  .left-col {
    display: flex;
    flex-direction: row;

    .avatar {
      flex-basis: 50px;
      flex-shrink: 0;
    }

    .conent {
      flex: 1 1;
      margin-left: 30px;
    }

    h4 {
      margin-bottom: 4px;
      color: rgba(0, 0, 0, 0.65);
      font-size: 14px;
      line-height: 1.5715;
    }

    p {
      margin-top: 5px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 14px;
      line-height: 1.5715;
    }
  }

  .right-col {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;

    .action {
      color: rgb(24, 144, 255);
      font-size: 14px;
      font-weight: 300;
      cursor: pointer;
      user-select: none;
    }
  }
}
</style>
