import {
  TextMessage,
  CodeMessage,
  LoginMessage,
  FileMessage,
  ForwardMessage,
  ImageMessage,
  VoteMessage,
  RevokeMessage,
  SystemTextMessage,
  AudioMessage,
  InviteMessage,
} from '@/components/talk/message'

export function setComponents(app) {
  app.component('text-message', TextMessage)
  app.component('code-message', CodeMessage)
  app.component('login-message', LoginMessage)
  app.component('file-message', FileMessage)
  app.component('forward-message', ForwardMessage)
  app.component('image-message', ImageMessage)
  app.component('vote-message', VoteMessage)
  app.component('revoke-message', RevokeMessage)
  app.component('system-text-message', SystemTextMessage)
  app.component('audio-message', AudioMessage)
  app.component('video-message', AudioMessage)
  app.component('invite-message', InviteMessage)
}
