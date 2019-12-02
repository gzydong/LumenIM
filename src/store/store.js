import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import dialogue from './modules/dialogue'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    dialogue
  },
  getters: {
    navModule:state => {
      return state.dialogue.activeModule;
    },

    //统计消息未读数
    unreadNum: state => {
      let num = 0;
      state.dialogue.chatModule.chatList.map(v => {
        num += parseInt(v.unread_num)
      });

      return num;
    },
    applyUnreadNum: state => {
      return state.dialogue.applyUnreadNum;
    },
  }
})

export default store
