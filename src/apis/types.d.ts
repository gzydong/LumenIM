// 自动生成的类型定义(注：请勿手动修改此文件)

export interface ArticleAnnexDeleteRequest {
  annex_id?: number
}

export interface ArticleAnnexDeleteResponse {}

export interface ArticleAnnexForeverDeleteRequest {
  annex_id?: number
}

export interface ArticleAnnexForeverDeleteResponse {}

export interface ArticleAnnexRecoverListRequest {
  page?: number
}

export interface ArticleAnnexRecoverListResponse {
  items?: ArticleAnnexRecoverListResponse_Item[]
  paginate?: Paginate
}

export interface ArticleAnnexRecoverListResponse_Item {
  annex_id?: number
  annex_name?: string
  article_id?: number
  article_title?: string
  created_at?: string
  deleted_at?: string
  day?: number
}

export interface ArticleAnnexRecoverRequest {
  annex_id?: number
}

export interface ArticleAnnexRecoverResponse {}

export interface ArticleAsteriskRequest {
  /** 文章ID */
  article_id?: number
  /** 操作方式 1:收藏 2:取消收藏 */
  action?: number
}

export interface ArticleAsteriskResponse {}

export interface ArticleClassDeleteRequest {
  classify_id: number
}

export interface ArticleClassDeleteResponse {}

export interface ArticleClassEditRequest {
  classify_id?: number
  name: string
}

export interface ArticleClassEditResponse {
  classify_id: number
}

export interface ArticleClassListRequest {}

export interface ArticleClassListResponse {
  items: ArticleClassListResponse_Item[]
}

export interface ArticleClassListResponse_Item {
  id: number
  class_name: string
  is_default: number
  count: number
}

export interface ArticleClassSortRequest {
  /** 排序后的分类ID列表 */
  classify_ids: number[]
}

export interface ArticleClassSortResponse {}

export interface ArticleDeleteRequest {
  article_id?: number
}

export interface ArticleDeleteResponse {}

export interface ArticleDetailRequest {
  article_id?: number
}

export interface ArticleDetailResponse {
  article_id: number
  classify_id: number
  title: string
  md_content: string
  is_asterisk: number
  created_at: string
  updated_at: string
  /** 标签列表 */
  tag_ids: ArticleDetailResponse_Tag[]
  /** 附件列表 */
  annex_list: ArticleDetailResponse_AnnexFile[]
}

export interface ArticleDetailResponse_AnnexFile {
  annex_id: number
  annex_name: string
  annex_size: number
  created_at: string
}

export interface ArticleDetailResponse_Tag {
  id: number
}

export interface ArticleEditRequest {
  /** 文章ID */
  article_id?: number
  /** 分类ID */
  classify_id?: number
  /** 标题 */
  title?: string
  /** 摘要 */
  abstract?: string
  /** 内容 */
  md_content?: string
}

export interface ArticleEditResponse {
  article_id: number
  title: string
  abstract: string
  image: string
}

export interface ArticleForeverDeleteRequest {
  article_id?: number
}

export interface ArticleForeverDeleteResponse {}

export interface ArticleListRequest {
  keyword?: string
  /** 查找类型 1:关键字查询 2:分类查询 3:标签查询 4:最近修改 */
  find_type?: number
  classify_id?: number
  tag_id?: number
}

export interface ArticleListResponse {
  items: ArticleListResponse_Item[]
}

export interface ArticleListResponse_Item {
  article_id: number
  classify_id: number
  tags_id: string
  title: string
  class_name: string
  image: string
  is_asterisk: number
  status: number
  created_at: string
  updated_at: string
  abstract: string
}

export interface ArticleMoveRequest {
  article_id?: number
  classify_id?: number
}

export interface ArticleMoveResponse {}

export interface ArticleRecoverListRequest {
  page?: number
}

export interface ArticleRecoverListResponse {
  items: ArticleRecoverListResponse_Item[]
}

export interface ArticleRecoverListResponse_Item {
  article_id: number
  classify_id: number
  classify_name: string
  title: string
  abstract: string
  image: string
  created_at: string
  deleted_at: string
  day: number
}

export interface ArticleRecoverRequest {
  article_id?: number
}

export interface ArticleRecoverResponse {}

export interface ArticleTagsRequest {
  article_id?: number
  tag_ids?: number[]
}

export interface ArticleTagsResponse {}

export interface AuthForgetRequest {
  /** 手机号 */
  mobile: string
  /** 登录密码 */
  password: string
  /** 短信验证码 */
  sms_code: string
}

export interface AuthForgetResponse {}

export interface AuthLoginRequest {
  /** 登录手机号 */
  mobile: string
  /** 登录密码 */
  password: string
  /** 登录平台 */
  platform: string
}

export interface AuthLoginResponse {
  /** Token 类型 */
  type: string
  /** token */
  access_token: string
  /** 过期时间 */
  expires_in: number
}

export interface AuthOAuthBindRequest {
  bind_token: string
  mobile: string
  sms_code: string
}

export interface AuthOAuthBindResponse {
  authorize: Authorize
}

export interface AuthOauthLoginRequest {
  oauth_type: string
  code: string
  state: string
}

export interface AuthOauthLoginResponse {
  is_authorize: string
  authorize: Authorize
  bind_token: string
}

export interface AuthOauthRequest {
  oauth_type: string
}

export interface AuthOauthResponse {
  uri: string
}

export interface AuthRegisterRequest {
  /** 登录手机号 */
  nickname?: string
  /** 登录手机号 */
  mobile?: string
  /** 登录密码 */
  password?: string
  /** 登录平台 */
  platform?: string
  /** 短信验证码 */
  sms_code?: string
}

export interface AuthRegisterResponse {
  /** Token 类型 */
  type: string
  /** token */
  access_token: string
  /** 过期时间 */
  expires_in: number
}

export interface Authorize {
  access_token: string
  expires_in: number
  type: string
}

export interface CommonSendEmailRequest {
  email?: string
}

export interface CommonSendEmailResponse {}

export interface CommonSendSmsRequest {
  mobile?: string
  channel?: string
}

export interface CommonSendSmsResponse {
  sms_code?: string
}

export interface CommonSendTestRequest {
  email?: string
}

export interface CommonSendTestResponse {}

export interface ContactApplyAcceptRequest {
  apply_id?: number
  remark?: string
}

export interface ContactApplyAcceptResponse {}

export interface ContactApplyCreateRequest {
  user_id?: number
  remark?: string
}

export interface ContactApplyCreateResponse {}

export interface ContactApplyDeclineRequest {
  apply_id?: number
  remark?: string
}

export interface ContactApplyDeclineResponse {}

export interface ContactApplyListRequest {}

export interface ContactApplyListResponse {
  items: ContactApplyListResponse_Item[]
}

export interface ContactApplyListResponse_Item {
  id: number
  user_id: number
  friend_id: number
  remark: string
  nickname: string
  avatar: string
  created_at: string
}

export interface ContactApplyUnreadNumRequest {}

export interface ContactApplyUnreadNumResponse {
  num: number
}

export interface ContactChangeGroupRequest {
  user_id: number
  group_id?: number
}

export interface ContactChangeGroupResponse {}

export interface ContactDeleteRequest {
  user_id: number
}

export interface ContactDeleteResponse {}

export interface ContactDetailRequest {
  user_id: number
}

export interface ContactDetailResponse {
  user_id: number
  mobile: string
  nickname: string
  avatar: string
  gender: number
  motto: string
  email: string
  relation: number
  contact_remark: string
  contact_group_id: number
  online_status: string
}

export interface ContactEditRemarkRequest {
  user_id: number
  remark?: string
}

export interface ContactEditRemarkResponse {}

export interface ContactGroupListRequest {}

export interface ContactGroupListResponse {
  /** 分组列表 */
  items: ContactGroupListResponse_Item[]
}

export interface ContactGroupListResponse_Item {
  /** 分组ID */
  id: number
  /** 分组名称 */
  name: string
  /** 联系人数 */
  count: number
  /** 分组排序 */
  sort: number
}

export interface ContactGroupSaveRequest {
  items?: ContactGroupSaveRequest_Item[]
}

export interface ContactGroupSaveRequest_Item {
  id?: number
  sort?: number
  name?: string
}

export interface ContactGroupSaveResponse {}

export interface ContactListRequest {}

export interface ContactListResponse {
  items: ContactListResponse_Item[]
}

export interface ContactListResponse_Item {
  /** 用户ID */
  user_id: number
  /** 昵称 */
  nickname: string
  /** 性别[0:未知;1:男;2:女;] */
  gender: number
  /** 座右铭 */
  motto: string
  /** 头像 */
  avatar: string
  /** 备注 */
  remark: string
  /** 联系人分组ID */
  group_id: number
}

export interface ContactOnlineStatusRequest {
  user_id: number
}

export interface ContactOnlineStatusResponse {
  /** 在线状态 [N:离线;Y:在线;] */
  online_status: string
}

export interface ContactSearchRequest {
  mobile: string
}

export interface ContactSearchResponse {
  user_id: number
  mobile: string
  nickname: string
  avatar: string
  gender: number
  motto: string
}

export interface EmoticonCreateRequest {
  url?: string
}

export interface EmoticonCreateResponse {
  emoticon_id?: number
  url?: string
}

export interface EmoticonDeleteRequest {
  emoticon_id?: number
}

export interface EmoticonDeleteResponse {}

export interface EmoticonItem {
  emoticon_id?: number
  url?: string
}

export interface EmoticonListRequest {}

export interface EmoticonListResponse {
  items?: EmoticonItem[]
}

export interface GetInviteFriendsRequest {
  group_id?: number
}

export interface GetInviteFriendsResponse {
  items: GetInviteFriendsResponse_Item[]
}

export interface GetInviteFriendsResponse_Item {
  user_id: number
  nickname: string
  avatar: string
  gender: number
  remark: string
}

export interface GoogleProtobufAny {
  /** The type of the serialized message. */
  '@type'?: string
}

export interface GroupApplyAgreeRequest {
  apply_id?: number
}

export interface GroupApplyAgreeResponse {}

export interface GroupApplyAllRequest {}

export interface GroupApplyAllResponse {
  items: GroupApplyAllResponse_Item[]
}

export interface GroupApplyAllResponse_Item {
  id: number
  user_id: number
  group_id: number
  group_name: string
  remark: string
  avatar: string
  nickname: string
  created_at: string
}

export interface GroupApplyCreateRequest {
  group_id?: number
  remark?: string
}

export interface GroupApplyCreateResponse {}

export interface GroupApplyDeclineRequest {
  apply_id?: number
  remark?: string
}

export interface GroupApplyDeclineResponse {}

export interface GroupApplyDeleteRequest {
  apply_id?: number
}

export interface GroupApplyDeleteResponse {}

export interface GroupApplyListRequest {
  group_id?: number
}

export interface GroupApplyListResponse {
  items?: GroupApplyListResponse_Item[]
}

export interface GroupApplyListResponse_Item {
  id: number
  user_id: number
  group_id: number
  remark: string
  avatar: string
  nickname: string
  created_at: string
}

export interface GroupApplyUnreadNumRequest {}

export interface GroupApplyUnreadNumResponse {
  num: number
}

export interface GroupAssignAdminRequest {
  group_id?: number
  user_id?: number
  action?: number
}

export interface GroupAssignAdminResponse {}

export interface GroupCreateRequest {
  name?: string
  user_ids?: number[]
}

export interface GroupCreateResponse {
  group_id: number
}

export interface GroupDetailRequest {
  group_id?: number
}

export interface GroupDetailResponse {
  group_id: number
  group_name: string
  profile: string
  avatar: string
  created_at: string
  is_manager: boolean
  is_disturb: number
  visit_card: string
  is_mute: number
  is_overt: number
  notice?: GroupDetailResponse_Notice
}

export interface GroupDetailResponse_Notice {
  content?: string
  created_at?: string
  updated_at?: string
  modify_user_name?: string
}

export interface GroupDismissRequest {
  group_id?: number
}

export interface GroupDismissResponse {}

export interface GroupHandoverRequest {
  group_id?: number
  user_id?: number
}

export interface GroupHandoverResponse {}

export interface GroupInviteRequest {
  group_id?: number
  user_ids?: number[]
}

export interface GroupInviteResponse {}

export interface GroupListRequest {}

export interface GroupListResponse {
  items: GroupListResponse_Item[]
}

export interface GroupListResponse_Item {
  group_id: number
  group_name: string
  avatar: string
  profile: string
  leader: number
  creator_id: number
}

export interface GroupMemberListRequest {
  group_id?: number
}

export interface GroupMemberListResponse {
  items: GroupMemberListResponse_Item[]
}

export interface GroupMemberListResponse_Item {
  user_id: number
  nickname: string
  avatar: string
  gender: number
  leader: number
  is_mute: number
  remark: string
  motto: string
}

export interface GroupMuteRequest {
  group_id?: number
  /** 操作方式  1:开启全员禁言  2:解除全员禁言 */
  action?: number
}

export interface GroupMuteResponse {}

export interface GroupNoSpeakRequest {
  group_id?: number
  user_id?: number
  action?: number
}

export interface GroupNoSpeakResponse {}

export interface GroupNoticeEditRequest {
  group_id?: number
  content?: string
}

export interface GroupNoticeEditResponse {}

export interface GroupOvertListRequest {
  page?: number
  name?: string
}

export interface GroupOvertListResponse {
  items: GroupOvertListResponse_Item[]
  next: boolean
}

export interface GroupOvertListResponse_Item {
  group_id: number
  type: number
  name: string
  avatar: string
  profile: string
  count: number
  max_num: number
  is_member: boolean
  created_at: string
}

export interface GroupOvertRequest {
  group_id?: number
  /** 操作方式 1:关闭  2:开启 */
  action?: number
}

export interface GroupOvertResponse {}

export interface GroupRemarkUpdateRequest {
  group_id?: number
  remark?: string
}

export interface GroupRemarkUpdateResponse {}

export interface GroupRemoveMemberRequest {
  group_id?: number
  user_ids?: number[]
}

export interface GroupRemoveMemberResponse {}

export interface GroupSecedeRequest {
  group_id?: number
}

export interface GroupSecedeResponse {}

export interface GroupSettingRequest {
  group_id?: number
  group_name?: string
  avatar?: string
  profile?: string
}

export interface GroupSettingResponse {}

export interface GroupVoteCreateRequest {
  group_id?: number
  title?: string
  mode?: number
  is_anonymous?: number
  options?: string[]
}

export interface GroupVoteCreateResponse {}

export interface GroupVoteDetailRequest {
  vote_id?: number
}

export interface GroupVoteDetailResponse {
  vote_id: number
  title: string
  answer_mode: number
  answer_options: GroupVoteDetailResponse_AnswerOption[]
  answer_num: number
  answered_num: number
  is_anonymous: number
  answered_users: GroupVoteDetailResponse_AnsweredUser[]
  is_submit: boolean
}

export interface GroupVoteDetailResponse_AnswerOption {
  key: string
  value: string
}

export interface GroupVoteDetailResponse_AnsweredUser {
  user_id: number
  nickname: string
  options: string[]
  answer_time: string
}

export interface GroupVoteSubmitRequest {
  vote_id?: number
  options?: string[]
}

export interface GroupVoteSubmitResponse {}

export interface MessageDeleteRequest {
  talk_mode: number
  to_from_id: number
  msg_ids: string[]
}

export interface MessageDeleteResponse {}

export interface MessageForwardRecordsRequest {
  talk_mode?: number
  msg_ids?: string[]
}

export interface MessageHistoryRecordsRequest {
  talk_mode: number
  to_from_id: number
  cursor: number
  limit: number
  msg_type: number
}

export interface MessageHistoryRecordsResponse {
  items: MessageRecord[]
  cursor: number
}

export interface MessageRecord {
  msg_id: string
  sequence: number
  msg_type: number
  from_id: number
  nickname: string
  avatar: string
  is_revoked: number
  send_time: string
  extra: string
  quote: string
}

export interface MessageRecordsClearResponse {
  items: MessageRecord[]
}

export interface MessageRecordsRequest {
  talk_mode: number
  to_from_id: number
  cursor: number
  limit: number
}

export interface MessageRecordsResponse {
  items: MessageRecord[]
  cursor: number
}

export interface MessageRevokeRequest {
  talk_mode: number
  to_from_id: number
  msg_id: string
}

export interface MessageRevokeResponse {}

export interface OrganizeDepartmentListRequest {}

export interface OrganizeDepartmentListResponse {
  items: OrganizeDepartmentListResponse_Item[]
}

export interface OrganizeDepartmentListResponse_Item {
  dept_id: number
  parent_id: number
  dept_name: string
  ancestors: string
  count: number
}

export interface OrganizePersonnelListRequest {}

export interface OrganizePersonnelListResponse {
  items: OrganizePersonnelListResponse_Item[]
}

export interface OrganizePersonnelListResponse_Dept {
  dept_id: number
  dept_name: string
  ancestors: string
}

export interface OrganizePersonnelListResponse_Item {
  user_id: number
  nickname: string
  gender: number
  position_items: OrganizePersonnelListResponse_Position[]
  dept_item: OrganizePersonnelListResponse_Dept
  avatar: string
}

export interface OrganizePersonnelListResponse_Position {
  code: string
  name: string
  sort: number
}

export interface Paginate {
  page?: number
  size?: number
  total?: number
}

export interface Status {
  /** The status code, which should be an enum value of [google.rpc.Code][google.rpc.Code]. */
  code?: number
  /** A developer-facing error message, which should be in English. Any user-facing error message should be localized and sent in the [google.rpc.Status.details][google.rpc.Status.details] field, or localized by the client. */
  message?: string
  /** A list of messages that carry the error details.  There is a common set of message types for APIs to use. */
  details?: GoogleProtobufAny[]
}

export interface TalkSessionClearUnreadNumRequest {
  talk_mode?: number
  to_from_id?: number
}

export interface TalkSessionClearUnreadNumResponse {}

export interface TalkSessionCreateRequest {
  /** 1:私聊 2:群聊 */
  talk_mode?: number
  /** 对方ID */
  to_from_id?: number
}

export interface TalkSessionCreateResponse {
  id: number
  talk_mode: number
  to_from_id: number
  is_top: number
  is_disturb: number
  is_online: number
  is_robot: number
  name: string
  avatar: string
  remark: string
  unread_num: number
  msg_text: string
  updated_at: string
}

export interface TalkSessionDeleteRequest {
  talk_mode?: number
  to_from_id?: number
}

export interface TalkSessionDeleteResponse {}

export interface TalkSessionDisturbRequest {
  talk_mode?: number
  to_from_id?: number
  action?: number
}

export interface TalkSessionDisturbResponse {}

export interface TalkSessionItem {
  id: number
  talk_mode: number
  to_from_id: number
  is_top: number
  is_disturb: number
  is_robot: number
  name: string
  avatar: string
  remark: string
  unread_num: number
  msg_text: string
  updated_at: string
}

export interface TalkSessionListRequest {}

export interface TalkSessionListResponse {
  items?: TalkSessionItem[]
}

export interface TalkSessionTopRequest {
  talk_mode?: number
  to_from_id?: number
  action?: number
}

export interface TalkSessionTopResponse {}

export interface UserDetailRequest {}

export interface UserDetailResponse {
  id: number
  mobile: string
  nickname: string
  avatar: string
  gender: number
  motto: string
  email: string
  birthday: string
}

export interface UserDetailUpdateRequest {
  avatar?: string
  nickname?: string
  gender?: number
  motto?: string
  birthday?: string
}

export interface UserDetailUpdateResponse {}

export interface UserEmailUpdateRequest {
  email?: string
  password?: string
  code?: string
}

export interface UserEmailUpdateResponse {}

export interface UserMobileUpdateRequest {
  mobile?: string
  password?: string
  sms_code?: string
}

export interface UserMobileUpdateResponse {}

export interface UserPasswordUpdateRequest {
  old_password?: string
  new_password?: string
}

export interface UserPasswordUpdateResponse {}

export interface UserSettingRequest {}

export interface UserSettingResponse {
  user_info: UserSettingResponse_UserInfo
  setting: UserSettingResponse_ConfigInfo
}

export interface UserSettingResponse_ConfigInfo {
  theme_mode: string
  theme_bag_img: string
  theme_color: string
  notify_cue_tone: string
  keyboard_event_notify: string
}

export interface UserSettingResponse_UserInfo {
  uid: number
  nickname: string
  avatar: string
  motto: string
  gender: number
  is_qiye: boolean
  mobile: string
  email: string
}
