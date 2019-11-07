import WsSocket from '@/utils/WsSocket'
import auth from '@/utils/auth'
import ChangePassword from '@/components/ChangePassword'
import UserSetup from '@/components/UserSetup'
import UserGroupChat from '@/components/UserGroupChat'
import LaunchGroupChat from '@/components/LaunchGroupChat'
import SeekFriend from '@/components/SeekFriend'



import {
  logoutApi,
  friendsApi,
  chatListsApi,
  searchUserApi,
  friendRemarkApi,
  chatRecordsApi,
  crateChatListApi,
  refreshToken,
  userGroups,
  friendApplyRecords,
  handleFriendApplyApi
} from '@/services/api.js'

import {
  getNowTime,
  getUnixTime,
  formateTime,
  trim,
  checkClient
} from '@/utils/functions.js'


export default {
  name: "dialogue-panel",
  components: {
    ChangePassword,
    UserSetup,
    UserGroupChat,
    LaunchGroupChat,
    SeekFriend
  },
  data() {
    return {
      subgroup: {
        password: {
          isOpen: false,
        }, //密码组件显示隐藏

        userSetup: {
          isOpen: false,
        }, //密码组件显示隐藏

        userGroup: {
          group_id: 0,
          isOpen: false,
        }, //群聊

        launchGroupChat: {
          isOpen: false,
        },

        seekFriend: {
          isOpen: false,
        },
      },
      //用户信息
      userInfo: {
        user_id: 0,
        avatar: '/static/image/detault-avatar.jpg',
        nickname: '未定义...',
      },

      //当前选中模块
      activeModule: 0,

      //当前选中的聊天信息
      chatModuleInfo: {
        tpmRecordId: null,
        notifyList: [], //消息通知列表
        title: '未定义',
        itemIndex: null, //判断是否选择聊天记录
        minChatRecordId: 0, //这里用户拉取以前的聊天记录 null 为已加载全部
        cahtRecords: [],
        message: '',

        loadStatus: 0, //历史消息加载状态 0:未加载|已加载完成  1:正在加载..
        scrollHeight: 0, //加载历史记录前滚动条的高度

        keyWords:'',//搜索关键词
      },

      //当前查看的用户信息
      friendModuleInfo: {
        isCatNewFriends: false,
        friendList: [], //好友列表
        friendId: null, //用户ID
        itemIndex: null, //判断是否选择用户

        //朋友信息
        friendInfo: {
          avatar: '',
          nickname: '',
          nickname_remark: '',
          mobile: '',
          motto: '生活需要梦想、需要坚持。只有不断提高自我，才会得到想要的生活...'
        },

        editing: false,
        editFriendRemark: '',

        keyWords:'',//搜索关键词
      },

      //群聊模块
      groupModuleInfo:{
        groupId: 0, //当前查看的群聊ID
        itemIndex: null, //当前查看的群聊索引
        groupList: [], //用户加入的群聊列表

        keyWords:'',//搜索关键词
      },

      // 工具栏是否显示
      setupToolbar: false,

      // 全局加载中变量
      fullscreenLoading: true,

      //WsSocket
      wsSocketObj: null,

      detaultAvatar: "this.src='/static/image/detault-avatar.jpg'",//用户默认头像
      detaultGroupAvatar: "this.src='/static/image/detault-group-avatar.jpg'",//群默认头像

      //好友申请处理模块
      applyHandle: {
        applyRecordList:[],
        isShow: false,
        top: 0,
        apply_id: 0,
        type: 1,
        remark: '',
      }
    }
  },
  created() {
    this.loadUserInfo();

    this.loadWebsocket();

    this.chatLists();
  },
  methods: {
    error(msg) {
      this.$notify({
        title: "温馨提示：",
        message: msg
      });
    },

    //加载用户信息
    loadUserInfo() {
      let userInfo = auth.getUserInfo();
      this.userInfo.avatar = userInfo.avatar;
      this.userInfo.user_id = userInfo.uid;
      this.userInfo.nickname = userInfo.nickname;
    },

    //左菜单点击事件
    activeNavMenu(even) {
      let that = this
      this.activeModule = even;
      if (even == 0) {
        that.fullscreenLoading = true;
        that.friendModuleInfo.indexGroup = null;
        that.chatLists();
      } else if (even == 1) {
        this.friendModuleInfo.itemIndex = null;
        that.friendModuleInfo.indexGroup = null;
        this.friendModuleInfo.isCatNewFriends = false;
        this.fullscreenLoading = true;

        that.friendsApi();
      } else {
        that.fullscreenLoading = true;
        that.userGroupsList();
      }
    },

    // 查看好友通讯录
    friendsApi() {
      let that = this
      friendsApi().then(res => {
        if (res.code == 200) {
          that.friendModuleInfo.friendList = res.data;
          that.fullscreenLoading = false;
        } else {
          that.$notify.error({
            title: '错误',
            message: res.msg
          });
        }
      })
    },

    //查看聊天详情
    catChatRecord(index) {
      this.chatModuleInfo.itemIndex = index;
      this.chatModuleInfo.title = this.chatModuleInfo.notifyList[index].name;
      this.chatModuleInfo.minChatRecordId = 0;
      this.chatModuleInfo.cahtRecords = [];

      //这里需要加载用户聊天记录
      this.getChatRecordsApi();
    },

    //获取聊天详情信息
    getChatRecordsApi() {
      let that = this;
      let info = this.chatModuleInfo;
      let notify = this.chatModuleInfo.notifyList[info.itemIndex];
      let params = {
        record_id: info.minChatRecordId,
        receive_id: notify.type == 1 ? notify.friend_id : notify.group_id,
        type: notify.type,
      };

      that.chatModuleInfo.loadStatus = 1;
      chatRecordsApi(params).then(res => {
        that.chatModuleInfo.minChatRecordId = res.data.record_id;
        that.chatModuleInfo.loadStatus = 0;

        //防止点击过快，导致数据返回出错
        if (info.itemIndex != that.chatModuleInfo.itemIndex) {
          return;
        }

        if (params.record_id == 0 && res.data.rows.length == 0) {
          that.chatModuleInfo.cahtRecords = [];
          return;
        }

        for (const record of res.data.rows) {
          that.chatModuleInfo.cahtRecords.unshift(record)
        }

        if (res.data.rows.length < res.data.page_size) {
          that.chatModuleInfo.minChatRecordId = null;
        }

        let chatPanel = that.$refs.chatPanel;
        if (params.record_id == 0) { //首页加载数据滚动条置底
          setTimeout(function() {
            chatPanel.scrollTop = chatPanel.scrollHeight;
          }, 0);
        } else { //加载数据完成之后将滚动条重置到加载之前的位置
          setTimeout(function() {
            chatPanel.scrollTop = chatPanel.scrollHeight - that.chatModuleInfo.scrollHeight;
          }, 0);
        }
      }).catch(e => {
        that.chatModuleInfo.loadStatus = 0;
      })
    },

    //点击加载更多聊天记录
    clickLoadChatRecords() {
      this.chatModuleInfo.scrollHeight = this.$refs.chatPanel.scrollHeight;
      this.getChatRecordsApi();
    },

    //查看朋友信息
    catFriendInfo(index, data) {
      let that = this;
      this.friendModuleInfo.itemIndex = index;
      this.friendModuleInfo.friendId = data.id;
      this.friendModuleInfo.isCatNewFriends = false;
      this.friendModuleInfo.editing = false;
      this.friendModuleInfo.editFriendRemark = '';

      //这里去加载朋友信息
      searchUserApi({
        user_id: that.friendModuleInfo.friendId
      }).then(res => {
        that.friendModuleInfo.friendInfo = {
          avatar: res.data.avatarurl,
          nickname: res.data.nickname,
          nickname_remark: res.data.nickname_remark,
          mobile: res.data.mobile,
          motto: res.data.motto || '未设置'
        }
      });
    },

    // 退出登录
    closeLogin() {
      let that = this
      logoutApi().then(res => {
        auth.removeUserInfo();
        that.$store.dispatch('logout');
        that.wsSocketObj.wsConnect.close(4031, '用户退出登录');
        that.$router.push({path: '/login'});
      });
    },

    // 获取用户聊天记录列表
    chatLists() {
      let that = this;
      chatListsApi().then(res => {
        if (res.code == 200) {
          let list = res.data;
          for (let i in list) {
            list[i].created_at = formateTime(list[i].created_at);
          }

          that.chatModuleInfo.notifyList = list;
          that.fullscreenLoading = false;

          if (that.chatModuleInfo.tpmRecordId !== null) {
            for (const index in list) {
              if (list[index].id == that.chatModuleInfo.tpmRecordId) {
                that.catChatRecord(index);
                let itemHeight = 70;
                setTimeout(function() {
                  that.$refs.msgNotifyItems.scrollTop = index * itemHeight;
                }, 0);
                break;
              }
            }

            that.chatModuleInfo.tpmRecordId = null;
          }
        } else {
          that.$notify.error({
            title: '错误',
            message: res.msg
          });
          that.fullscreenLoading = false;
        }
      })
    },

    // 控制修改备注图标是否显示
    startEditFriendRemark(even) {
      let that = this;

      this.friendModuleInfo.editing = true;
      setTimeout(function() {
        that.$refs.refEditFriendRemark.focus();
      }, 0);

      this.friendModuleInfo.editFriendRemark = this.friendModuleInfo.friendInfo.nickname_remark;
    },

    //修改好友备注提交接口
    changeFriendRemark() {
      let that = this,
        index = this.friendModuleInfo.itemIndex;
      let paramObj = {
        friend_id: that.friendModuleInfo.friendId,
        remarks: this.friendModuleInfo.editFriendRemark
      };

      friendRemarkApi(paramObj).then(res => {
        if (res.code == 200) {
          that.friendModuleInfo.editing = false;
          that.friendModuleInfo.friendInfo.nickname_remark = that.friendModuleInfo.friendList[index].friend_remark =
            paramObj.remarks;
        } else {
          that.$notify.error({
            title: '错误',
            message: res.msg
          });
        }
      })
    },

    //创建用户聊天记录列表
    crateChatList(id, type) {
      let that = this;
      let paramObj = {
        receive_id: id,
        type: type
      }

      crateChatListApi(paramObj).then(res => {
        if (res.code == 200) {
          that.chatModuleInfo.tpmRecordId = res.data.list_id;
          that.activeNavMenu(0);
        } else {
          that.$notify.error({
            title: '错误',
            message: res.msg
          });
        }
      })
    },

    //加载 Websocket
    loadWebsocket() {
      let that = this;
      this.wsSocketObj = new WsSocket(auth.getSid(), {
        onError: that.onError,
        onOpen: that.onOpen,
        onMessage: that.onMessage,
        onClose: that.onClose
      });

      this.wsSocketObj.initWebSocket();
    },

    //Websocket 连接失败回调方法
    onError(evt) {},

    //Websocket 连接成功回调方法
    onOpen(evt) {},

    //Websocket 接收消息回调方法
    onMessage(evt) {
      let [evtName, message] = JSON.parse(evt.data.substr(2));
      switch (evtName) {
        case 'chat_message':
          this.receiveChatMssage(message);
          break;
        case 'join_group':
          this.$notify({
            title: '群提示',
            message: `您已成功加入[${message.group_name}]聊天群...`,
            position: 'top-right'
          });
          break;
        case 'friend_apply':
          this.$notify.info({
            title: '好友申请',
            message: `您有新的好友申请，请尽快处理...`,
            position: 'top-right'
          });
          break;
      }
    },

    //Websocket 断开连接回调方法
    onClose(evt) {
      let that = this;
      if (evt.code == 4030) {
        auth.removeUserInfo();
        that.$router.push({
          path: '/login'
        });
      }
    },


    //提交发送聊天消息
    submitSendMesage() {
      let info = this.chatModuleInfo;
      let receiveInfo = info.notifyList[info.itemIndex];
      let receive_id = receiveInfo.type == 1 ? receiveInfo.friend_id : receiveInfo.group_id;

      if (trim(info.message) == '') {
        this.chatModuleInfo.message = '';
        return;
      }

      this.wsSocketObj.sendMsg(receiveInfo.type, this.userInfo.user_id, receive_id, info.message);
      this.chatModuleInfo.message = '';
    },

    //接收聊天消息
    receiveChatMssage(message) {
      let that = this,
        user = that.userInfo,
        chatPanel = this.$refs.chatPanel;

      //更新聊天栏用户发送的消息记录
      if (true) {
        let user_id = this.userInfo.user_id,
          friends = that.chatModuleInfo.notifyList;
        let receive_id = (message.sendUser == user_id) ? message.receiveUser : message.sendUser;
        let receiveInfo = friends[that.chatModuleInfo.itemIndex];

        //先判断消息是否是当前正在聊天的用户（防止过度循环）
        if (receiveInfo && receiveInfo.type == message.sourceType && (message.sourceType == 1 && receive_id ==
            receiveInfo.friend_id) || (message.sourceType == 2 && receive_id == receiveInfo.group_id)) {
          that.chatModuleInfo.notifyList[that.chatModuleInfo.itemIndex].msg_text = message.textMessage;
        } else {
          //循环判断赋值
          for (const idx1 in friends) {
            if (friends[idx1].type != message.sourceType) {
              continue;
            }

            if ((message.sourceType == 1 && receive_id == friends[idx1].friend_id) || (message.sourceType == 2 &&
                receive_id == friends[idx1].group_id)) {
              that.chatModuleInfo.notifyList[idx1].msg_text = message.textMessage;
              break;
            }
          }
        }
      }


      //判断当前是否打开聊天窗
      if (this.activeModule == 0 || this.chatModuleInfo.itemIndex !== null) {

        //获取当前选中的聊天好友
        let receiveInfo = this.chatModuleInfo.notifyList[this.chatModuleInfo.itemIndex];
        // receiveInfo {"type":1,"friend_id":2055,"group_id":0,"created_at":"14:22","name":"2055凡凡","unread_num":0,"msg_text":"......","avatar":"http://192.168.6.60:92/static/image/sys-head/2019030508031890594.jpg"}
        // message {"sourceType":1,"receiveUser":2055,"sendUser":2054,"msgType":1,"textMessage":"阿萨打算\n","send_time":"2019-10-24 07:13:21"}
        if (receiveInfo && receiveInfo.type == message.sourceType && (message.receiveUser == receiveInfo.friend_id ||
            message.receiveUser == receiveInfo.group_id || message.sendUser == receiveInfo.friend_id || message.sendUser ==
            receiveInfo.group_id)) {
          let data = {
            avatar: message.sendUser == user.user_id ? user.avatar : receiveInfo.avatar,
            float: message.sendUser == user.user_id ? 'right' : 'left',
            id: null,
            msg_type: message.msgType,
            nickname: "",
            nickname_remarks: "",
            receive_id: message.receiveUser,
            send_time: message.send_time,
            source: message.sourceType,
            text_msg: message.textMessage,
            user_id: message.sendUser
          };

          this.chatModuleInfo.cahtRecords.push(data);
          setTimeout(function() {
            chatPanel.scrollTop = chatPanel.scrollHeight;
          }, 0);
          return;
        }
      }



      //... 这里处理其它情况的数据
    },

    //修改密码回调方法
    closePasswordBox(type) {
      this.subgroup.password.isOpen = false;
      if (type == 1) {
        this.$notify.info({
          title: '消息',
          message: '密码修改成功...'
        });
      }
    },

    //修改密码回调方法
    closeUserSetupBox() {
      this.subgroup.userSetup.isOpen = false;
    },


    clickNewFriend() {
      let that = this;
      this.friendModuleInfo.isCatNewFriends = true;
      friendApplyRecords().then(res => {
        if (res.code == 200) {
          that.applyHandle.applyRecordList = res.data.rows
        } else {
          that.$notify.error({
            title: '错误',
            message: res.msg
          });
        }
      });
    },

    // 获取群聊列表接口
    userGroupsList() {
      let that = this;
      userGroups().then(res => {
        if (res.code == 200) {
          that.groupModuleInfo.groupList = res.data;
          that.fullscreenLoading = false;
        } else {
          that.$notify.error({
            title: '错误',
            message: res.msg
          });
        }
      });
    },
    catGroupInfo(index, data) {
      this.groupModuleInfo.itemIndex = index;
      this.groupModuleInfo.groupId = data.id;
    },

    closeLaunchGroupChatBox(type) {
      this.subgroup.launchGroupChat.isOpen = false;
      if (type == 1) {
        this.$notify.info({
          title: '提示',
          message: '聊天群创建成功...',
          position: 'bottom-right'
        });
      }else if(type == 2){
        this.$refs.ugcChild.groupDetailList();
      }
    },


    closeSeekFriendBox(id) {
      this.subgroup.seekFriend.isOpen = false;
      if (id > 0) {
        this.crateChatList(id, 1);
      }
    },
    closeUserGroup: function(data) {
      this.groupModuleInfo.itemIndex = data;
    },

    // 选择需要处理的好友申请，接受或者拒绝
    selectHandleFriend(ridx, type, data) {
      this.applyHandle.isShow = true;
      this.applyHandle.top = ridx * 65;
      this.applyHandle.type = type;
      this.applyHandle.apply_id = data.id;
      if (type == 1) {
        this.applyHandle.remark = data.nickname;
      } else {
        this.applyHandle.remark = '';
      }
    },

    confirmHandleApply(type) {
      let that = this,fuc = ()=>{
        that.applyHandle.isShow = false;
        that.applyHandle.top = 0;
        that.applyHandle.type = 0;
        that.applyHandle.apply_id = 0
        that.applyHandle.remark = '';
      }

      if (type == 2) {
        fuc();return;
      }

      handleFriendApplyApi({
        type: that.applyHandle.type,
        apply_id: this.applyHandle.apply_id,
        remarks:this.applyHandle.remark
      }).then(res => {
        if (res.code == 200) {
          that.clickNewFriend();
          that.friendsApi();
          fuc();
        } else {
          that.$notify.error({
            title: '错误',
            message: res.msg
          });
        }
      });
    },

    //查看好友信息
    catApplyFriendInfo(mobile){
      sessionStorage.setItem("query_mobile",mobile);
      this.subgroup.seekFriend.isOpen = true;
    },
  }
};
