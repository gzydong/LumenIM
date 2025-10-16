// 自动生成的 API 方法(注：请勿手动修改此文件)
// @ts-ignore
import { createApi } from './request.ts'
import type {
  ArticleAnnexDeleteRequest,
  ArticleAnnexDeleteResponse,
  ArticleAnnexForeverDeleteRequest,
  ArticleAnnexForeverDeleteResponse,
  ArticleAnnexRecoverRequest,
  ArticleAnnexRecoverResponse,
  ArticleAnnexRecoverListRequest,
  ArticleAnnexRecoverListResponse,
  ArticleAsteriskRequest,
  ArticleAsteriskResponse,
  ArticleClassDeleteRequest,
  ArticleClassDeleteResponse,
  ArticleClassEditRequest,
  ArticleClassEditResponse,
  ArticleClassListRequest,
  ArticleClassListResponse,
  ArticleClassSortRequest,
  ArticleClassSortResponse,
  ArticleDeleteRequest,
  ArticleDeleteResponse,
  ArticleDetailRequest,
  ArticleDetailResponse,
  ArticleEditRequest,
  ArticleEditResponse,
  ArticleForeverDeleteRequest,
  ArticleForeverDeleteResponse,
  ArticleListRequest,
  ArticleListResponse,
  ArticleMoveRequest,
  ArticleMoveResponse,
  ArticleRecoverRequest,
  ArticleRecoverResponse,
  ArticleRecoverListRequest,
  ArticleRecoverListResponse,
  ArticleTagsRequest,
  ArticleTagsResponse,
  AuthForgetRequest,
  AuthForgetResponse,
  AuthLoginRequest,
  AuthLoginResponse,
  AuthOauthRequest,
  AuthOauthResponse,
  AuthOAuthBindRequest,
  AuthOAuthBindResponse,
  AuthOauthLoginRequest,
  AuthOauthLoginResponse,
  AuthRegisterRequest,
  AuthRegisterResponse,
  CommonSendEmailRequest,
  CommonSendEmailResponse,
  CommonSendSmsRequest,
  CommonSendSmsResponse,
  CommonSendTestRequest,
  CommonSendTestResponse,
  ContactApplyAcceptRequest,
  ContactApplyAcceptResponse,
  ContactApplyCreateRequest,
  ContactApplyCreateResponse,
  ContactApplyDeclineRequest,
  ContactApplyDeclineResponse,
  ContactApplyListRequest,
  ContactApplyListResponse,
  ContactApplyUnreadNumRequest,
  ContactApplyUnreadNumResponse,
  ContactGroupListRequest,
  ContactGroupListResponse,
  ContactGroupSaveRequest,
  ContactGroupSaveResponse,
  ContactChangeGroupRequest,
  ContactChangeGroupResponse,
  ContactDeleteRequest,
  ContactDeleteResponse,
  ContactDetailRequest,
  ContactDetailResponse,
  ContactEditRemarkRequest,
  ContactEditRemarkResponse,
  ContactListRequest,
  ContactListResponse,
  ContactOnlineStatusRequest,
  ContactOnlineStatusResponse,
  ContactSearchRequest,
  ContactSearchResponse,
  EmoticonCreateRequest,
  EmoticonCreateResponse,
  EmoticonDeleteRequest,
  EmoticonDeleteResponse,
  EmoticonListRequest,
  EmoticonListResponse,
  GroupApplyAgreeRequest,
  GroupApplyAgreeResponse,
  GroupApplyAllRequest,
  GroupApplyAllResponse,
  GroupApplyCreateRequest,
  GroupApplyCreateResponse,
  GroupApplyDeclineRequest,
  GroupApplyDeclineResponse,
  GroupApplyDeleteRequest,
  GroupApplyDeleteResponse,
  GroupApplyListRequest,
  GroupApplyListResponse,
  GroupApplyUnreadNumRequest,
  GroupApplyUnreadNumResponse,
  GroupNoticeEditRequest,
  GroupNoticeEditResponse,
  GroupVoteCreateRequest,
  GroupVoteCreateResponse,
  GroupVoteDetailRequest,
  GroupVoteDetailResponse,
  GroupVoteSubmitRequest,
  GroupVoteSubmitResponse,
  GroupAssignAdminRequest,
  GroupAssignAdminResponse,
  GroupCreateRequest,
  GroupCreateResponse,
  GroupDetailRequest,
  GroupDetailResponse,
  GroupDismissRequest,
  GroupDismissResponse,
  GetInviteFriendsRequest,
  GetInviteFriendsResponse,
  GroupHandoverRequest,
  GroupHandoverResponse,
  GroupInviteRequest,
  GroupInviteResponse,
  GroupListRequest,
  GroupListResponse,
  GroupMemberListRequest,
  GroupMemberListResponse,
  GroupMuteRequest,
  GroupMuteResponse,
  GroupNoSpeakRequest,
  GroupNoSpeakResponse,
  GroupOvertRequest,
  GroupOvertResponse,
  GroupOvertListRequest,
  GroupOvertListResponse,
  GroupRemarkUpdateRequest,
  GroupRemarkUpdateResponse,
  GroupRemoveMemberRequest,
  GroupRemoveMemberResponse,
  GroupSecedeRequest,
  GroupSecedeResponse,
  GroupSettingRequest,
  GroupSettingResponse,
  MessageDeleteRequest,
  MessageDeleteResponse,
  MessageForwardRecordsRequest,
  MessageRecordsClearResponse,
  MessageHistoryRecordsRequest,
  MessageHistoryRecordsResponse,
  MessageRecordsRequest,
  MessageRecordsResponse,
  MessageRevokeRequest,
  MessageRevokeResponse,
  OrganizeDepartmentListRequest,
  OrganizeDepartmentListResponse,
  OrganizePersonnelListRequest,
  OrganizePersonnelListResponse,
  TalkSessionClearUnreadNumRequest,
  TalkSessionClearUnreadNumResponse,
  TalkSessionCreateRequest,
  TalkSessionCreateResponse,
  TalkSessionDeleteRequest,
  TalkSessionDeleteResponse,
  TalkSessionDisturbRequest,
  TalkSessionDisturbResponse,
  TalkSessionListRequest,
  TalkSessionListResponse,
  TalkSessionTopRequest,
  TalkSessionTopResponse,
  UserDetailRequest,
  UserDetailResponse,
  UserDetailUpdateRequest,
  UserDetailUpdateResponse,
  UserEmailUpdateRequest,
  UserEmailUpdateResponse,
  UserMobileUpdateRequest,
  UserMobileUpdateResponse,
  UserPasswordUpdateRequest,
  UserPasswordUpdateResponse,
  UserSettingRequest,
  UserSettingResponse
} from './types.d.ts'

/**
 * 文章附件删除接口
 */
export const fetchArticleAnnexDelete = createApi<
  ArticleAnnexDeleteRequest,
  ArticleAnnexDeleteResponse
>('/api/v1/article-annex/delete', 'POST')

/**
 * 文章附件永久删除接口
 */
export const fetchArticleAnnexForeverDelete = createApi<
  ArticleAnnexForeverDeleteRequest,
  ArticleAnnexForeverDeleteResponse
>('/api/v1/article-annex/forever-delete', 'POST')

/**
 * 文章附件恢复删除接口
 */
export const fetchArticleAnnexRecover = createApi<
  ArticleAnnexRecoverRequest,
  ArticleAnnexRecoverResponse
>('/api/v1/article-annex/recover', 'POST')

/**
 * 文章附件回收站列表接口
 */
export const fetchArticleAnnexRecoverList = createApi<
  ArticleAnnexRecoverListRequest,
  ArticleAnnexRecoverListResponse
>('/api/v1/article-annex/recover-list', 'POST')

/**
 * 收藏/取消收藏文章接口
 */
export const fetchArticleAsterisk = createApi<ArticleAsteriskRequest, ArticleAsteriskResponse>(
  '/api/v1/article/asterisk',
  'POST'
)

/**
 * 文章分类删除接口
 */
export const fetchArticleClassDelete = createApi<
  ArticleClassDeleteRequest,
  ArticleClassDeleteResponse
>('/api/v1/article/classify/delete', 'POST')

/**
 * 文章分类编辑接口
 */
export const fetchArticleClassEdit = createApi<ArticleClassEditRequest, ArticleClassEditResponse>(
  '/api/v1/article/classify/edit',
  'POST'
)

/**
 * 获取文章分类列表接口
 */
export const fetchArticleClassList = createApi<ArticleClassListRequest, ArticleClassListResponse>(
  '/api/v1/article/classify/list',
  'POST'
)

/**
 * 文章分类排序接口
 */
export const fetchArticleClassSort = createApi<ArticleClassSortRequest, ArticleClassSortResponse>(
  '/api/v1/article/classify/sort',
  'POST'
)

/**
 * 删除文章接口
 */
export const fetchArticleDelete = createApi<ArticleDeleteRequest, ArticleDeleteResponse>(
  '/api/v1/article/delete',
  'POST'
)

/**
 * 获取文章详情接口
 */
export const fetchArticleDetail = createApi<ArticleDetailRequest, ArticleDetailResponse>(
  '/api/v1/article/detail',
  'POST'
)

/**
 * 文章编辑接口
 */
export const fetchArticleEdit = createApi<ArticleEditRequest, ArticleEditResponse>(
  '/api/v1/article/editor',
  'POST'
)

/**
 * 永久删除文章接口
 */
export const fetchArticleForeverDelete = createApi<
  ArticleForeverDeleteRequest,
  ArticleForeverDeleteResponse
>('/api/v1/article/forever-delete', 'POST')

/**
 * 获取文章列表接口
 */
export const fetchArticleList = createApi<ArticleListRequest, ArticleListResponse>(
  '/api/v1/article/list',
  'POST'
)

/**
 * 移动文章分类接口
 */
export const fetchArticleMove = createApi<ArticleMoveRequest, ArticleMoveResponse>(
  '/api/v1/article/move',
  'POST'
)

/**
 * 恢复文章接口
 */
export const fetchArticleRecover = createApi<ArticleRecoverRequest, ArticleRecoverResponse>(
  '/api/v1/article/recover',
  'POST'
)

/**
 * 获取回收站文章列表接口
 */
export const fetchArticleRecoverList = createApi<
  ArticleRecoverListRequest,
  ArticleRecoverListResponse
>('/api/v1/article/recover-list', 'POST')

/**
 * 设置文章标签接口
 */
export const fetchArticleSetTags = createApi<ArticleTagsRequest, ArticleTagsResponse>(
  '/api/v1/article/tags',
  'POST'
)

/**
 * 找回密码接口
 */
export const fetchAuthForget = createApi<AuthForgetRequest, AuthForgetResponse>(
  '/api/v1/auth/forget',
  'POST'
)

/**
 * 登录接口
 */
export const fetchAuthLogin = createApi<AuthLoginRequest, AuthLoginResponse>(
  '/api/v1/auth/login',
  'POST'
)

/**
 * 获取 oauth2.0 跳转地址
 */
export const fetchAuthOauth = createApi<AuthOauthRequest, AuthOauthResponse>(
  '/api/v1/auth/oauth',
  'POST'
)

/**
 * 绑定第三方登录接口
 */
export const fetchAuthOauthBind = createApi<AuthOAuthBindRequest, AuthOAuthBindResponse>(
  '/api/v1/auth/oauth/bind',
  'POST'
)

/**
 * 第三方登录接口
 */
export const fetchAuthOauthLogin = createApi<AuthOauthLoginRequest, AuthOauthLoginResponse>(
  '/api/v1/auth/oauth/login',
  'POST'
)

/**
 * 注册接口
 */
export const fetchAuthRegister = createApi<AuthRegisterRequest, AuthRegisterResponse>(
  '/api/v1/auth/register',
  'POST'
)

/**
 * 发送邮件验证码接口
 */
export const fetchCommonSendEmail = createApi<CommonSendEmailRequest, CommonSendEmailResponse>(
  '/api/v1/common/send-email',
  'POST'
)

/**
 * 发送短信验证码接口
 * @Summary 发送短信验证码111222
 */
export const fetchCommonSendSms = createApi<CommonSendSmsRequest, CommonSendSmsResponse>(
  '/api/v1/common/send-sms',
  'POST'
)

/**
 * 俺们就开始的那
 */
export const fetchCommonTest = createApi<CommonSendTestRequest, CommonSendTestResponse>(
  '/api/v1/common/send-test',
  'POST'
)

/**
 * 同意联系人申请接口
 */
export const fetchContactApplyAccept = createApi<
  ContactApplyAcceptRequest,
  ContactApplyAcceptResponse
>('/api/v1/contact-apply/accept', 'POST')

/**
 * 添加联系人申请接口
 */
export const fetchContactApplyCreate = createApi<
  ContactApplyCreateRequest,
  ContactApplyCreateResponse
>('/api/v1/contact-apply/create', 'POST')

/**
 * 拒绝联系人申请接口
 */
export const fetchContactApplyDecline = createApi<
  ContactApplyDeclineRequest,
  ContactApplyDeclineResponse
>('/api/v1/contact-apply/decline', 'POST')

/**
 * 联系人申请列表接口
 */
export const fetchContactApplyList = createApi<ContactApplyListRequest, ContactApplyListResponse>(
  '/api/v1/contact-apply/list',
  'POST'
)

/**
 * 获取申请未读数
 */
export const fetchContactApplyUnreadNum = createApi<
  ContactApplyUnreadNumRequest,
  ContactApplyUnreadNumResponse
>('/api/v1/contact-apply/unread-num', 'POST')

/**
 * 联系人分组列表接口
 */
export const fetchContactGroupList = createApi<ContactGroupListRequest, ContactGroupListResponse>(
  '/api/v1/contact-group/list',
  'POST'
)

/**
 * 保存联系人分组接口
 */
export const fetchContactGroupSave = createApi<ContactGroupSaveRequest, ContactGroupSaveResponse>(
  '/api/v1/contact-group/save',
  'POST'
)

/**
 * 修改联系人分组接口
 */
export const fetchContactChangeGroup = createApi<
  ContactChangeGroupRequest,
  ContactChangeGroupResponse
>('/api/v1/contact/change-group', 'POST')

/**
 * 联系人删除接口
 */
export const fetchContactDelete = createApi<ContactDeleteRequest, ContactDeleteResponse>(
  '/api/v1/contact/delete',
  'POST'
)

/**
 * 联系人详情接口
 */
export const fetchContactDetail = createApi<ContactDetailRequest, ContactDetailResponse>(
  '/api/v1/contact/detail',
  'POST'
)

/**
 * 联系人备注修改接口
 */
export const fetchContactEditRemark = createApi<
  ContactEditRemarkRequest,
  ContactEditRemarkResponse
>('/api/v1/contact/edit-remark', 'POST')

/**
 * 联系人列表接口
 */
export const fetchContactList = createApi<ContactListRequest, ContactListResponse>(
  '/api/v1/contact/list',
  'POST'
)

/**
 * 获取联系人在线状态接口
 */
export const fetchContactOnlineStatus = createApi<
  ContactOnlineStatusRequest,
  ContactOnlineStatusResponse
>('/api/v1/contact/online-status', 'POST')

/**
 * 联系人搜索接口
 */
export const fetchContactSearch = createApi<ContactSearchRequest, ContactSearchResponse>(
  '/api/v1/contact/search',
  'POST'
)

/**
 * 创建表情包接口
 */
export const fetchEmoticonCreate = createApi<EmoticonCreateRequest, EmoticonCreateResponse>(
  '/api/v1/emoticon/customize/create',
  'POST'
)

/**
 * 删除表情包接口
 */
export const fetchEmoticonDelete = createApi<EmoticonDeleteRequest, EmoticonDeleteResponse>(
  '/api/v1/emoticon/customize/delete',
  'POST'
)

/**
 * 用户表情包列表接口
 */
export const fetchEmoticonList = createApi<EmoticonListRequest, EmoticonListResponse>(
  '/api/v1/emoticon/customize/list',
  'POST'
)

/**
 * 同意群组申请接口
 */
export const fetchGroupApplyAgree = createApi<GroupApplyAgreeRequest, GroupApplyAgreeResponse>(
  '/api/v1/group-apply/agree',
  'POST'
)

/**
 * 所有群组申请列表接口
 */
export const fetchGroupApplyAll = createApi<GroupApplyAllRequest, GroupApplyAllResponse>(
  '/api/v1/group-apply/all',
  'POST'
)

/**
 * 创建群组申请接口
 */
export const fetchGroupApplyCreate = createApi<GroupApplyCreateRequest, GroupApplyCreateResponse>(
  '/api/v1/group-apply/create',
  'POST'
)

/**
 * 拒绝群组申请接口
 */
export const fetchGroupApplyDecline = createApi<
  GroupApplyDeclineRequest,
  GroupApplyDeclineResponse
>('/api/v1/group-apply/decline', 'POST')

/**
 * 删除群组申请接口
 */
export const fetchGroupApplyDelete = createApi<GroupApplyDeleteRequest, GroupApplyDeleteResponse>(
  '/api/v1/group-apply/delete',
  'POST'
)

/**
 * 群组申请列表接口
 */
export const fetchGroupApplyList = createApi<GroupApplyListRequest, GroupApplyListResponse>(
  '/api/v1/group-apply/list',
  'POST'
)

/**
 * 获取群组申请未读数
 */
export const fetchGroupApplyUnreadNum = createApi<
  GroupApplyUnreadNumRequest,
  GroupApplyUnreadNumResponse
>('/api/v1/group-apply/unread-num', 'POST')

/**
 * 编辑群组公告接口
 */
export const fetchGroupNoticeEdit = createApi<GroupNoticeEditRequest, GroupNoticeEditResponse>(
  '/api/v1/group-notice/edit',
  'POST'
)

/**
 * 创建群组投票接口
 */
export const fetchGroupVoteCreate = createApi<GroupVoteCreateRequest, GroupVoteCreateResponse>(
  '/api/v1/group-vote/create',
  'POST'
)

/**
 * 获取群组投票详情接口
 */
export const fetchGroupVoteDetail = createApi<GroupVoteDetailRequest, GroupVoteDetailResponse>(
  '/api/v1/group-vote/detail',
  'POST'
)

/**
 * 提交群组投票接口
 */
export const fetchGroupVoteSubmit = createApi<GroupVoteSubmitRequest, GroupVoteSubmitResponse>(
  '/api/v1/group-vote/submit',
  'POST'
)

/**
 * 分配管理员接口
 */
export const fetchGroupAssignAdmin = createApi<GroupAssignAdminRequest, GroupAssignAdminResponse>(
  '/api/v1/group/assign-admin',
  'POST'
)

/**
 * 创建群聊接口
 */
export const fetchGroupCreate = createApi<GroupCreateRequest, GroupCreateResponse>(
  '/api/v1/group/create',
  'POST'
)

/**
 * 群聊详情接口
 */
export const fetchGroupDetail = createApi<GroupDetailRequest, GroupDetailResponse>(
  '/api/v1/group/detail',
  'POST'
)

/**
 * 解散群聊接口
 */
export const fetchGroupDismiss = createApi<GroupDismissRequest, GroupDismissResponse>(
  '/api/v1/group/dismiss',
  'POST'
)

/**
 * 获取可邀请好友列表接口
 */
export const fetchGroupGetInviteFriends = createApi<
  GetInviteFriendsRequest,
  GetInviteFriendsResponse
>('/api/v1/group/get-invite-friends', 'POST')

/**
 * 群主更换接口
 */
export const fetchGroupHandover = createApi<GroupHandoverRequest, GroupHandoverResponse>(
  '/api/v1/group/handover',
  'POST'
)

/**
 * 邀请加入群聊接口
 */
export const fetchGroupInvite = createApi<GroupInviteRequest, GroupInviteResponse>(
  '/api/v1/group/invite',
  'POST'
)

/**
 * 群列表接口
 */
export const fetchGroupList = createApi<GroupListRequest, GroupListResponse>(
  '/api/v1/group/list',
  'POST'
)

/**
 * 群成员列表接口
 */
export const fetchGroupMemberList = createApi<GroupMemberListRequest, GroupMemberListResponse>(
  '/api/v1/group/member-list',
  'POST'
)

/**
 * 群禁言接口
 */
export const fetchGroupMute = createApi<GroupMuteRequest, GroupMuteResponse>(
  '/api/v1/group/mute',
  'POST'
)

/**
 * 群成员禁言接口
 */
export const fetchGroupNoSpeak = createApi<GroupNoSpeakRequest, GroupNoSpeakResponse>(
  '/api/v1/group/no-speak',
  'POST'
)

/**
 * 群公开修改接口
 */
export const fetchGroupOvert = createApi<GroupOvertRequest, GroupOvertResponse>(
  '/api/v1/group/overt',
  'POST'
)

/**
 * 公开群聊列表接口
 */
export const fetchGroupOvertList = createApi<GroupOvertListRequest, GroupOvertListResponse>(
  '/api/v1/group/overt-list',
  'POST'
)

/**
 * 群聊名片更新接口
 */
export const fetchGroupRemarkUpdate = createApi<
  GroupRemarkUpdateRequest,
  GroupRemarkUpdateResponse
>('/api/v1/group/remark-update', 'POST')

/**
 * 移出群成员接口
 */
export const fetchGroupRemoveMember = createApi<
  GroupRemoveMemberRequest,
  GroupRemoveMemberResponse
>('/api/v1/group/remove-member', 'POST')

/**
 * 退出群聊接口
 */
export const fetchGroupSecede = createApi<GroupSecedeRequest, GroupSecedeResponse>(
  '/api/v1/group/secede',
  'POST'
)

/**
 * 设置群聊接口
 */
export const fetchGroupSetting = createApi<GroupSettingRequest, GroupSettingResponse>(
  '/api/v1/group/setting',
  'POST'
)

export const fetchMessageDelete = createApi<MessageDeleteRequest, MessageDeleteResponse>(
  '/api/v1/message/delete',
  'POST'
)

/**
 * 转发消息记录
 */
export const fetchMessageForwardRecords = createApi<
  MessageForwardRecordsRequest,
  MessageRecordsClearResponse
>('/api/v1/message/forward-records', 'POST')

/**
 * 获取会话历史消息记录
 */
export const fetchMessageHistoryRecords = createApi<
  MessageHistoryRecordsRequest,
  MessageHistoryRecordsResponse
>('/api/v1/message/history-records', 'POST')

/**
 * 获取会话消息记录
 */
export const fetchMessageRecords = createApi<MessageRecordsRequest, MessageRecordsResponse>(
  '/api/v1/message/records',
  'POST'
)

export const fetchMessageRevoke = createApi<MessageRevokeRequest, MessageRevokeResponse>(
  '/api/v1/message/revoke',
  'POST'
)

/**
 * 获取组织部门列表接口
 */
export const fetchOrganizeDepartmentList = createApi<
  OrganizeDepartmentListRequest,
  OrganizeDepartmentListResponse
>('/api/v1/organize/department-list', 'POST')

/**
 * 获取组织人员列表接口
 */
export const fetchOrganizePersonnelList = createApi<
  OrganizePersonnelListRequest,
  OrganizePersonnelListResponse
>('/api/v1/organize/personnel-list', 'POST')

/**
 * 会话未读数清除接口
 */
export const fetchTalkSessionClearUnreadNum = createApi<
  TalkSessionClearUnreadNumRequest,
  TalkSessionClearUnreadNumResponse
>('/api/v1/talk/session-clear-unread-num', 'POST')

/**
 * 会话创建接口
 */
export const fetchTalkSessionCreate = createApi<
  TalkSessionCreateRequest,
  TalkSessionCreateResponse
>('/api/v1/talk/session-create', 'POST')

/**
 * 会话删除接口
 */
export const fetchTalkSessionDelete = createApi<
  TalkSessionDeleteRequest,
  TalkSessionDeleteResponse
>('/api/v1/talk/session-delete', 'POST')

/**
 * 会话免打扰接口
 */
export const fetchTalkSessionDisturb = createApi<
  TalkSessionDisturbRequest,
  TalkSessionDisturbResponse
>('/api/v1/talk/session-disturb', 'POST')

/**
 * 会话列表接口
 */
export const fetchTalkSessionList = createApi<TalkSessionListRequest, TalkSessionListResponse>(
  '/api/v1/talk/session-list',
  'POST'
)

/**
 * 会话置顶接口
 */
export const fetchTalkSessionTop = createApi<TalkSessionTopRequest, TalkSessionTopResponse>(
  '/api/v1/talk/session-top',
  'POST'
)

/**
 * 获取登录用户详情接口
 */
export const fetchUserDetail = createApi<UserDetailRequest, UserDetailResponse>(
  '/api/v1/user/detail',
  'POST'
)

/**
 * 更新用户信息接口
 */
export const fetchUserDetailUpdate = createApi<UserDetailUpdateRequest, UserDetailUpdateResponse>(
  '/api/v1/user/detail-update',
  'POST'
)

/**
 * 更新用户邮箱接口
 */
export const fetchUserEmailUpdate = createApi<UserEmailUpdateRequest, UserEmailUpdateResponse>(
  '/api/v1/user/email-update',
  'POST'
)

/**
 * 更新用户手机号接口
 */
export const fetchUserMobileUpdate = createApi<UserMobileUpdateRequest, UserMobileUpdateResponse>(
  '/api/v1/user/mobile-update',
  'POST'
)

/**
 * 更新用户密码接口
 */
export const fetchUserPasswordUpdate = createApi<
  UserPasswordUpdateRequest,
  UserPasswordUpdateResponse
>('/api/v1/user/password-update', 'POST')

/**
 * 获取用户配置信息接口
 */
export const fetchUserSetting = createApi<UserSettingRequest, UserSettingResponse>(
  '/api/v1/user/setting',
  'POST'
)
