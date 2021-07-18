<template>
  <div>
    <div class="vote-message">
      <div class="vote-from">
        <div class="vheader">
          <p>
            {{ answer_mode == 1 ? '[多选投票]' : '[单选投票]' }}
          </p>
          <p>{{ title }}</p>
        </div>

        <div class="vbody">
          <p v-for="(option, index) in options">
            <el-checkbox
              v-model="option.is_checked"
              @change="toSelect2(option)"
            />
            <span @click="toSelect(option, index)" style="margin-left: 10px;">
              {{ option.value }} 、{{ option.text }}
            </span>
          </p>
        </div>
        <div class="vfooter">
          <el-button plain round @click="toVote">
            {{ isUserVote ? '立即投票' : '请选择进行投票' }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ServeConfirmVoteHandle } from '@/api/chat'

export default {
  name: 'VoteMessage',
  props: {
    vote: {
      type: Object,
      required: true,
    },
    record_id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      answer_mode: 0,
      title: '啊谁叫你打开你卡沙发那,那就是看、卡收纳是你',
      radio_value: '',
      options: [],
      is_vote: false,
    }
  },
  computed: {
    isUserVote() {
      return this.options.some(iten => {
        return iten.is_checked
      })
    },
  },
  created() {
    this.answer_mode = this.vote.detail.answer_mode
    this.vote.detail.answer_option.forEach(item => {
      this.options.push({
        value: item.key,
        text: item.value,
        is_checked: false,
      })
    })

    let user_id = this.$store.state.user.uid

    console.log(user_id)
    this.is_vote = this.vote.vote_users.some(value => {
      return value == user_id
    })
  },
  methods: {
    toSelect(option, index) {
      if (this.answer_mode == 0) {
        this.options.forEach(option => {
          option.is_checked = false
        })
      }

      this.options[index].is_checked = !option.is_checked
    },
    toSelect2(option) {
      if (this.answer_mode == 0) {
        this.options.forEach(item => {
          if (option.value == item.value) {
            item.is_checked = option.is_checked
          } else {
            item.is_checked = false
          }
        })
      }
    },
    toVote() {
      if (this.isUserVote == false) {
        return false
      }

      let items = []
      this.options.forEach(item => {
        if (item.is_checked) {
          items.push(item.value)
        }
      })

      ServeConfirmVoteHandle({
        record_id: this.record_id,
        options: items.join(','),
      }).then(res => {
        if (res.code == 200) {
          alert(res.message)
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
.vote-message {
  width: 300px;
  min-height: 150px;
  border: 1px solid #dee0e3;
  box-sizing: border-box;
  border-radius: 5px;
  overflow: hidden;

  .vote-from {
    height: 100%;
    width: 100%;

    .vheader {
      min-height: 50px;
      background: #4e83fd;
      padding: 8px;
      position: relative;
      p {
        margin: 3px 0;
        &:first-child {
          color: rgb(245, 237, 237);
          font-size: 13px;
          margin-bottom: 8px;
        }

        &:last-child {
          color: white;
        }
      }

      &::before {
        content: '投票';
        position: absolute;
        font-size: 60px;
        color: white;
        opacity: 0.1;
        top: -5px;
        right: 10px;
      }
    }

    .vbody {
      min-height: 80px;
      width: 100%;
      padding: 5px 15px;
      box-sizing: border-box;
      p {
        margin: 14px 0px;
        font-size: 13px;
        span {
          cursor: pointer;
          user-select: none;
          line-height: 22px;
        }

        .el-radio {
          margin-right: 0;
          .el-radio__label {
            padding-left: 5px;
          }
        }
      }
      margin-bottom: 10px;
    }

    .vfooter {
      height: 55px;
      text-align: center;

      .el-button {
        width: 80%;
        font-weight: 400;
      }
    }
  }
}
</style>
