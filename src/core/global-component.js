import Vue from 'vue'
import {
  AudioMessage,
  CodeMessage,
  ForwardMessage,
  ImageMessage,
  TextMessage,
  VideoMessage,
  VoiceMessage,
  SystemMessage,
  FileMessage,
  InviteMessage,
  RevokeMessage,
  VisitCardMessage,
  ReplyMessage,
  VoteMessage,
} from '@/components/chat/messaege'

Vue.component(AudioMessage.name, AudioMessage)
Vue.component(CodeMessage.name, CodeMessage)
Vue.component(ForwardMessage.name, ForwardMessage)
Vue.component(ImageMessage.name, ImageMessage)
Vue.component(TextMessage.name, TextMessage)
Vue.component(VideoMessage.name, VideoMessage)
Vue.component(VoiceMessage.name, VoiceMessage)
Vue.component(SystemMessage.name, SystemMessage)
Vue.component(FileMessage.name, FileMessage)
Vue.component(InviteMessage.name, InviteMessage)
Vue.component(RevokeMessage.name, RevokeMessage)
Vue.component(VisitCardMessage.name, VisitCardMessage)
Vue.component(ReplyMessage.name, ReplyMessage)
Vue.component(VoteMessage.name, VoteMessage)

import UserCard from '@/components/user/user-card/index'
Vue.use(UserCard)
