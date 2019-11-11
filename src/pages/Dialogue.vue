<template id='dialogue-panel'>
  <div id='cus-template'>
    <div class="dialogue-panel-body" v-loading="fullscreenLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0,0,0, 0.8)">

      <!-- 左菜单 -->
      <div id="layout-left-box">
        <div class="layout-nav-menu">
          <ul >
            <li>
              <img :src="$store.state.user.avatar" alt class="img pointer"  :onerror="$store.state.user.detaultAvatar" @click="subgroup.userSetup.isOpen = true" />
            </li>

            <li @click="activeNavMenu(0)" v-bind:class="{ activeModuleClass: activeModule == 0?true:false }">
              <i class="iconfont icon-duanxin"><span class="i-hotspot" v-show="unreadNum > 0" ></span></i>
            </li>

            <li @click="activeNavMenu(1)" v-bind:class="{ activeModuleClass: activeModule == 1?true:false }">
              <i class="iconfont icon-tongxunlu"><span class="i-hotspot" v-show="applyHandle.applyNum > 0" ></span></i>
            </li>

            <li @click="activeNavMenu(2)" v-bind:class="{ activeModuleClass: activeModule == 2?true:false }">
              <i class="iconfont icon-qunzu"></i>
            </li>
          </ul>

          <i class="iconfont icon-caidan1 closeLogin" @click="setupToolbar = !setupToolbar"></i>
        </div>

        <!-- 工具栏 -->
        <ul class="setUp" v-show="setupToolbar">
          <li @click="subgroup.userSetup.isOpen = true;setupToolbar = false">个人信息</li>
          <li @click="subgroup.password.isOpen = true;setupToolbar = false">密码修改</li>
          <li @click="subgroup.seekFriend.isOpen = true;setupToolbar = false">添加好友</li>
          <li @click="subgroup.launchGroupChat.isOpen = true;setupToolbar = false">创建群聊</li>
          <li @click="closeLogin">退出登录</li>
        </ul>
      </div>

      <!-- 右侧主体- 消息通知子模块  -->
      <div class="layout-right-box" v-if="activeModule == 0">
        <div class="wx-right">
          <header class="search">
            <i class="iconfont icon-sousuo sousuo"></i>
            <input type="text" placeholder="搜索" v-model="chatModuleInfo.keyWords"  />
            <i class="iconfont icon-jia jiahao" @click="subgroup.launchGroupChat.isOpen = true;"></i>
          </header>

          <main class="nav-left listWebkit msg-notify-items" ref="msgNotifyItems">
            <div  v-bind:class="{'msg-notify-item':true ,'addNotify': chatModuleInfo.itemIndex == index?true:false }"  v-for="(notify,index) in chatModuleInfo.notifyList"
              @click="catChatRecord(index)" @contextmenu.prevent="">
              <img v-if="notify.type == 1" :src="notify.avatar" :onerror="$store.state.user.detaultAvatar" class="img" />
              <img v-else :src="notify.avatar" :onerror="$store.state.user.detaultGroupAvatar" class="img" />

              <span v-show="notify.unread_num" class="notify-unread-num" >{{notify.unread_num >99?'99':notify.unread_num}}</span>
              <div class="list-right">
                <div class="name"><span class="firname"> {{notify.name}}</span><span class="time">{{ notify.created_at }}</span>
                </div>
                <div class="chat">{{notify.msg_text}}</div>
              </div>
            </div>
          </main>
        </div>

        <div class="nav-right" v-if="chatModuleInfo.itemIndex == null">
          <div class="weixinLogo">Lumen IM</div>
        </div>
        <div class="nav-right chat-dialogue-box" v-else>
          <header class="friendName">
            <span>{{ chatModuleInfo.title }}</span>
          </header>

          <main ref="chatPanel" class="rightWebkit chat-dialogue">
            <div class="toolbar-load-chat-msg" v-if="chatModuleInfo.minChatRecordId > 0" @click="clickLoadChatRecords">
              <span v-show="chatModuleInfo.loadStatus == 0">
                查看更多消息...
              </span>
              <span v-show="chatModuleInfo.loadStatus == 1">
                <i class="el-icon-loading"></i> 正在加载数据...
              </span>
            </div>
            <div class="toolbar-load-chat-msg" v-else>
              <span class="not-have-msg" v-if="chatModuleInfo.minChatRecordId == null">
                没有更多消息了...
              </span>
            </div>

            <div :class="recordInfo.float == 'left' ?'left':'right'" v-for="recordInfo in chatModuleInfo.cahtRecords">
              <img :src="recordInfo.avatar" @click="catFirendDetail(recordInfo.user_id,2)"  class="img" :onerror="$store.state.user.detaultAvatar"  />
              <div class="box-group" v-if="recordInfo.float == 'left'">

                <span v-if="recordInfo.float == 'left' && recordInfo.source == 2" class="groupChat ">
                  {{recordInfo.nickname_remark || recordInfo.nickname }}
                </span>

                <div class="leftSend send"><span v-text="recordInfo.text_msg" ></span><div class="leftArrow arrow"></div>
                </div>
              </div>

              <div class="rightSend send" v-else>
                <span v-text="recordInfo.text_msg"></span>
                <div class="rightArrow arrow"></div>
              </div>
              <div class="clear"></div>
            </div>
          </main>

          <footer id="message-edit">
            <ul id="edit-toolbar">
              <li><i class="iconfont icon-biaoqing"></i></li>
              <li><i class="iconfont icon-file"></i></li>
              <li><i class="iconfont icon-xinxi1"></i></li>
            </ul>
            <textarea  ref='chatMessage' rows="6" v-model.trim="chatModuleInfo.message"  @keydown="sendMsgCheck($event)"  @keyup.enter="submitSendMesage($event)"  placeholder="你想要的聊点什么呢..."></textarea>
          </footer>
        </div>
      </div>

      <!-- 用户列表子模块 -->
      <div class="layout-right-box" v-if="activeModule == 1">
        <div class="wx-right nav-friends-menu">
          <header class="search">
            <i class="iconfont icon-sousuo sousuo"></i>
            <input type="text" placeholder="搜索" />
            <i class="iconfont icon-jia jiahao" @click="subgroup.seekFriend.isOpen = true"></i>
          </header>

          <div class="friends-notify" @click="clickNewFriend">
            <div class="cus-tubiao">
              <i class="iconfont icon-jurassic_add-users"></i>
              <span v-show="applyHandle.applyNum > 0" class="appyle-hotspot"></span>
            </div>
            <span>新的朋友</span>
          </div>

          <main class="nav-left listWebkit users-list-items">
            <div :class="friendModuleInfo.itemIndex == index?'users-list-item users-list-item-active':'users-list-item'"
              v-for='(item2,index) in friendModuleInfo.friendList'  @click="catFriendInfo(index,item2)">
              <img :src="item2.avatarurl" :onerror="$store.state.user.detaultAvatar">
              <span class="user-online" v-if="item2.online == 1">✔</span>
              <span>{{ item2.friend_remark?item2.friend_remark:item2.nickname }}</span>
            </div>
          </main>
        </div>

        <div class="nav-right" v-if="friendModuleInfo.isCatNewFriends == true">
          <header><span>好友申请</span></header>
          <div v-if="applyHandle.applyRecordList.length > 0" class="applyList ">
            <div class="applyList_content clear" v-for="(applyRecord,ridx) in applyHandle.applyRecordList">
              <img :src="applyRecord.avatarurl" :onerror="$store.state.user.detaultAvatar" @click="catFirendDetail(applyRecord.mobile,1)"  >
              <div class="name">
                <p>{{ applyRecord.nickname }}</p>
                <p>{{ applyRecord.remarks }}</p>
              </div>

              <div class="message success" v-if="applyRecord.status == 0">
                <span @click="selectHandleFriend(ridx,1,applyRecord)">接受</span>
                <span @click="selectHandleFriend(ridx,2,applyRecord)">拒绝</span>
              </div>

              <div class="message " v-else-if="applyRecord.status == 1">
                <span>已同意</span>
              </div>
              <div class="message " v-else>
                <span>已拒绝</span>
              </div>
              <div class="clear"></div>
            </div>

            <div v-show="applyHandle.isShow" class="apply-handle-from" v-bind:style="{top: applyHandle.top + 'px' }" >
                <div>
                  <span>{{applyHandle.type == 1?'好友备注':'拒绝原因'}}</span>：<input type="text"  v-model="applyHandle.remark"  @keyup.enter="confirmHandleApply(1)">
                </div>
                <div class="handle-from-btn" >
                  <span @click="confirmHandleApply(1)">确定</span>
                  <span @click="confirmHandleApply(2)">取消</span>
                </div>
            </div>
          </div>

          <div class="apply-list-empty" v-else >暂无好友申请</div>
        </div>
        <div class="nav-right" v-else-if="friendModuleInfo.itemIndex == null">
          <div class="weixinLogo">Lumen IM</div>
        </div>
        <div class="nav-right" v-else>
          <div class="nav-user-message">
            <header>
              <i class="iconfont icon-guanbi11" @click="friendModuleInfo.itemIndex = null"></i>
              <img :src="friendModuleInfo.friendInfo.avatar" :onerror="$store.state.user.detaultAvatar" ><span>{{friendModuleInfo.friendInfo.nickname_remark || friendModuleInfo.friendInfo.nickname }}</span>
            </header>

            <main>
              <h5>个人信息</h5>
              <div class="userName"><span class="name">昵称</span> {{friendModuleInfo.friendInfo.nickname}} </div>
              <div class="userName"><span class="name">备注</span>
                <span v-if="friendModuleInfo.friendInfo.nickname_remark != '' && friendModuleInfo.editing == false">{{ friendModuleInfo.friendInfo.nickname_remark }}</span>
                <i class="iconfont icon-beizhu remarks pointer" @click="startEditFriendRemark()" v-if="friendModuleInfo.editing == false"></i>
                <div class="reviseName" v-else>
                  <input type="text" ref="refEditFriendRemark" v-model="friendModuleInfo.editFriendRemark"
                    @keyup.enter="changeFriendRemark">
                  <span @click="changeFriendRemark">确认</span>
                </div>
              </div>
              <div class="userName"><span class="name">手机号</span> <span class='user-motto'>+86 ~
                  {{friendModuleInfo.friendInfo.mobile}}</span> </div>
              <div class="userName"><span class="name">座右铭</span> <span class='user-motto'>{{friendModuleInfo.friendInfo.motto}}</span>
              </div>
            </main>

            <div class="sendNews" @click="crateChatList(friendModuleInfo.friendId,1)">发消息</div>
          </div>
        </div>
      </div>

      <!-- 群聊列表子模块 -->
      <div class="layout-right-box" v-if="activeModule == 2">
        <div class="wx-right nav-friends-menu nav-group-menu">
          <header class="search">
            <i class="iconfont icon-sousuo sousuo"></i>
            <input type="text" placeholder="搜索" />
            <i class="iconfont icon-jia jiahao" @click="subgroup.launchGroupChat.isOpen = true;"></i>
          </header>
          <main class="nav-left listWebkit users-list-items">
            <div :class="groupModuleInfo.itemIndex == index?'users-list-item users-list-item-active':'users-list-item'"
              v-for='(item2,index) in groupModuleInfo.groupList' @click="catGroupInfo(index,item2)">
              <img :src="item2.avatarurl" :onerror="$store.state.user.detaultGroupAvatar">
              <span>{{ item2.group_name }}</span>
            </div>
          </main>
        </div>

        <div class="nav-right" v-if="groupModuleInfo.itemIndex == null">
          <div class="weixinLogo">Lumen IM</div>
        </div>
        <div class="nav-right" v-else>
          <user-group-chat v-bind:groupId="groupModuleInfo.groupId" v-on:close="groupModuleInfo.itemIndex = null" ref='ugcChild' ></user-group-chat>
        </div>
      </div>
    </div>

    <!-- 修改密码组件 -->
    <change-password v-if="subgroup.password.isOpen" v-on:close="closePasswordBox"></change-password>

    <!-- 用户信息设置组件 -->
    <user-setup v-if="subgroup.userSetup.isOpen" v-on:close="subgroup.userSetup.isOpen = false"></user-setup>

    <!-- 创建群聊组件 -->
    <launch-group-chat v-if="subgroup.launchGroupChat.isOpen" v-on:close="closeLaunchGroupChatBox"></launch-group-chat>

    <!-- 添加、查找好友组件 -->
    <seek-friend v-if="subgroup.seekFriend.isOpen" v-on:close="closeSeekFriendBox"></seek-friend>

    <audio ref='mp3' src="../../static/image/59y888piCn92.mp3" type="audio/mpeg"  controls="controls"  hidden="true" >    </audio>
  </div>
</template>

<style>
  body {
    background: url('//res.wx.qq.com/a/wx_fed/webwx/res/static/img/2zrdI1g.jpg') no-repeat;
    background-size: 100% 100%;
  }
</style>
<style scoped src="../../static/css/dialogue.css"></style>
<script src="../../static/js/dialogue.js"></script>
