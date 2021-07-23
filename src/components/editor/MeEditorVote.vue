<template>
  <div class="lum-dialog-mask animated fadeIn">
    <el-container class="lum-dialog-box">
      <el-header class="header no-select" height="60px">
        <p>发起投票</p>
        <p class="tools">
          <i class="el-icon-close" @click="$emit('close')" />
        </p>
      </el-header>
      <el-main class="main no-padding vote-from">
        <div class="vote-title">投票方式</div>
        <div>
          <el-radio-group v-model="mode">
            <el-radio :label="0">单选</el-radio>
            <el-radio :label="1">多选</el-radio>
          </el-radio-group>
        </div>
        <div class="vote-title">投票主题</div>
        <div>
          <el-input
            size="medium"
            clear="vote-input"
            v-model.trim="title"
            placeholder="请输入投票主题，最多50字"
            :maxlength="50"
          />
        </div>

        <div class="vote-title">投票选项</div>
        <div>
          <div class="vote-options" v-for="(option, index) in options">
            <div class="lbox">
              <el-input
                size="medium"
                clear="vote-input"
                v-model.trim="option.value"
                placeholder="请输入选项内容"
                :maxlength="120"
              >
                <span
                  slot="prefix"
                  style="margin-left:7px;"
                  v-text="String.fromCharCode(65 + index)"
                />
              </el-input>
            </div>
            <div class="rbox">
              <i class="el-icon-close" @click="removeOption(index)"></i>
            </div>
          </div>

          <h6 class="pointer add-option" @click="addOption">
            <i class="el-icon-plus"></i> 添加选项
          </h6>
        </div>
      </el-main>
      <el-footer class="footer">
        <el-button plain size="small">取消</el-button>
        <el-button
          type="primary"
          size="small"
          :disabled="isCheck"
          :loading="loading"
          @click="submit"
          >发起投票</el-button
        >
      </el-footer>
    </el-container>
  </div>
</template>
<script>
import { ServeSendVote } from '@/api/chat'

export default {
  name: 'MeEditorVote',
  props: {
    group_id: {
      type: [String, Number],
      default: 0,
    },
  },
  data() {
    return {
      loading: false,
      mode: 0,
      title: '',
      options: [
        {
          value: '',
        },
        {
          value: '',
        },
        {
          value: '',
        },
      ],
    }
  },
  computed: {
    isCheck() {
      if (this.title == '') return true

      return this.options.some(option => option.value == '')
    },
  },
  methods: {
    submit() {
      let items = []
      const { receiver_id } = this.$store.state.dialogue
      this.options.forEach(option => {
        items.push(option.value)
      })

      this.loading = true

      ServeSendVote({
        receiver_id,
        mode: this.mode,
        title: this.title,
        options: items,
      })
        .then(res => {
          if (res.code == 200) {
            this.$emit('close')
            this.$notify({
              title: '友情提示',
              message: '发起投票成功!',
              type: 'success',
            })
          } else {
            this.$notify({
              title: '友情提示',
              message: res.message,
              type: 'warning',
            })
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    addOption() {
      if (this.options.length >= 6) {
        return false
      }

      this.options.push({
        value: '',
      })
    },
    removeOption(index) {
      if (this.options.length <= 2) {
        return false
      }

      this.$delete(this.options, index)
    },
  },
}
</script>
<style lang="less" scoped>
.lum-dialog-box {
  height: 600px;
  max-width: 450px;

  .vote-from {
    box-sizing: border-box;
    padding: 15px 25px;
    overflow: hidden;

    .vote-title {
      margin: 20px 0 10px;
      &:first-child {
        margin-top: 0;
      }
    }

    .vote-options {
      display: flex;
      min-height: 30px;
      margin: 10px 0;

      .lbox {
        width: 100%;

        /deep/.el-input__prefix {
          height: 36px;
          line-height: 36px;
        }
      }

      .rbox {
        flex-basis: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        i {
          font-size: 18px;
          cursor: pointer;
          &:hover {
            color: red;
          }
        }
      }
    }

    .add-option {
      margin-top: 5px;
      font-weight: 400;
      color: #3370ff;
    }
  }

  .footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 32px;
  }
}

/deep/.el-radio__input.is-checked + .el-radio__label {
  color: #606266;
}
</style>
