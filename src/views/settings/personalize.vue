<template>
  <div>
    <div class="container">
      <h4>个性化设置</h4>
      <el-row type="flex" class="list-item">
        <el-col :span="20" class="left-col">
          <h4>主题模式</h4>
          <p>当前主题模式 ：{{ themeMode ? '全屏模式' : '窗口居中模式' }}</p>
        </el-col>
        <el-col :span="4" class="right-col">
          <div class="action">
            <el-switch
              v-model="themeMode"
              active-text="全屏"
              inactive-text="居中"
              @change="changeThemeMode"
            />
          </div>
        </el-col>
      </el-row>

      <el-row type="flex" class="list-item">
        <el-col :span="20" class="left-col">
          <h4>主题背景幕布</h4>
          <p>当前未设置背景图片</p>
        </el-col>
        <el-col :span="4" class="right-col">
          <span class="action" v-popover:popover>设置</span>
        </el-col>
      </el-row>

      <el-row type="flex" class="list-item">
        <el-col :span="20" class="left-col">
          <h4>我的名片</h4>
          <p>当前未设置名片背景</p>
        </el-col>
        <el-col :span="4" class="right-col">
          <span class="action">修改</span>
        </el-col>
      </el-row>

      <el-row type="flex" class="list-item">
        <el-col :span="20" class="left-col">
          <h4>聊天背景</h4>
          <p>当前未设置聊天背景图</p>
        </el-col>
        <el-col :span="4" class="right-col">
          <span class="action">修改</span>
        </el-col>
      </el-row>

      <el-popover
        ref="popover"
        placement="left"
        title="主题背景"
        width="173"
        trigger="click"
      >
        <div
          class="image-item"
          v-for="(item, index) in bagItems"
          :key="index"
          @click="changeThemeBag(item.name)"
        >
          <img :src="item.src" />
        </div>
      </el-popover>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PersonalizePage',
  data() {
    return {
      themeMode: false,
      bagItems: [
        {
          name: 'bag001',
          src: require('@/assets/image/background/001.jpg'),
        },
        {
          name: 'bag002',
          src: require('@/assets/image/background/002.jpg'),
        },
        {
          name: 'bag003',
          src: require('@/assets/image/background/003.jpg'),
        },
        {
          name: 'bag004',
          src: require('@/assets/image/background/005.png'),
        },
      ],
    }
  },
  created() {
    this.themeMode = this.$store.state.settings.themeMode
  },
  methods: {
    // 触发修改主题模式
    changeThemeMode(value) {
      this.$store.commit('SET_THEME_MODE', value)
    },

    // 修改主题背景
    changeThemeBag(value) {
      this.$store.commit('SET_THEME_BAGIMG', value)
    },
  },
}
</script>
<style lang="less" scoped>
.container h4 {
  color: rgba(0, 0, 0, 0.85);
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  margin-bottom: 12px;
}

.container .list-item {
  height: 70px;
  margin: 5px 25px 5px 0px;
  border-bottom: 1px solid #e8e8e8;

  .left-col {
    display: flex;
    flex-direction: column;
    justify-content: center;

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

.image-item {
  width: 80px;
  height: 60px;
  background-color: white;
  border-radius: 3px;
  margin: 3px;
  float: left;
  box-shadow: 0 0 4px #eee4e4;
  cursor: pointer;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
  }

  &:active img {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
    -webkit-filter: contrast(130%);
    filter: contrast(130%);
  }
}
</style>
