import { post, get, upload } from './request'
import { getAccessToken } from '@/utils/auth'

// -------- 笔记相关 --------

// 查询用户文集分类服务接口
export const ServeGetArticleList = (data) => {
  return get('/api/v1/note/article/list', data)
}

// 编辑笔记服务接口
export const ServeEditArticle = (data) => {
  return post('/api/v1/note/article/editor', data)
}

// 删除笔记服务接口
export const ServeDeleteArticle = (data) => {
  return post('/api/v1/note/article/delete', data)
}

// 永久删除笔记回收站的笔记
export const ServeForeverDeleteArticle = (data) => {
  return post('/api/v1/note/article/forever-delete', data)
}

export const ServeArticleRecycleList = (data) => {
  return post('/api/v1/note/article/recycle-list', data)
}

// 恢复笔记服务接口
export const ServeRecoverArticle = (data) => {
  return post('/api/v1/note/article/recover-delete', data)
}

// 设置标记星号笔记服务接口
export const ServeSetAsteriskArticle = (data) => {
  return post('/api/v1/note/article/collect', data)
}

// 查询用户文集分类服务接口
export const ServeGetArticleDetail = (data) => {
  return get('/api/v1/note/article/detail', data)
}

// 移动笔记服务接口
export const ServeMoveArticle = (data) => {
  return post('/api/v1/note/article/move', data)
}

// 更新笔记标签服务接口
export const ServeUpdateArticleTag = (data) => {
  return post('/api/v1/note/article/update-tag', data)
}

// -------- 笔记分类相关 --------

// 查询用户文集分类服务接口
export const ServeGetArticleClass = (data) => {
  return get('/api/v1/note/classify/list', data)
}

// 添加或编辑文集分类服务接口
export const ServeCreateArticleClass = (data) => {
  return post('/api/v1/note/classify/create', data)
}

// 添加或编辑文集分类服务接口
export const ServeUpdateArticleClass = (data) => {
  return post('/api/v1/note/classify/update', data)
}

// 删除笔记分类服务接口
export const ServeDeleteArticleClass = (data) => {
  return post('/api/v1/note/classify/delete', data)
}

// 笔记分类排序服务接口
export const ServeArticleClassSort = (data) => {
  return post('/api/v1/note/classify/sort', data)
}

// 合并笔记分类服务接口
export const ServeMergeArticleClass = (data) => {
  return post('/api/v1/note/article/merge', data)
}

// -------- 笔记标签相关 --------

// 获取笔记表标签服务接口
export const ServeGetArticleTag = (data) => {
  return get('/api/v1/note/tag/list', data)
}

// 添加或编辑笔记标签服务接口
export const ServeCreateNoteTag = (data) => {
  return post('/api/v1/note/tag/create', data)
}

export const ServeUpdateNoteTag = (data) => {
  return post('/api/v1/note/tag/update', data)
}

// 删除笔记标签服务接口
export const ServeDeleteArticleTag = (data) => {
  return post('/api/v1/note/tag/delete', data)
}

// -------- 笔记附件相关 --------

// 笔记附件上传服务接口
export const ServeUploadArticleAnnex = (data) => {
  return upload('/api/v1/note/annex/upload', data)
}

// 移除笔记附件服务接口
export const ServeDeleteArticleAnnex = (data) => {
  return post('/api/v1/note/annex/delete', data)
}

// 永久删除笔记附件回收站文件
export const ServeForeverDeleteAnnex = (data) => {
  return post('/api/v1/note/annex/forever-delete', data)
}

// 恢复笔记附件服务接口
export const ServeRecoverArticleAnnex = (data) => {
  return post('/api/v1/note/annex/recover', data)
}

// 笔记附件回收站列表服务接口
export const ServeGetRecoverAnnexList = () => {
  return get('/api/v1/note/annex/recycle-list')
}

// 下载笔记附件服务接口
export const ServeDownloadAnnex = (annex_id) => {
  let api = import.meta.env.VITE_BASE_API
  try {
    let link = document.createElement('a')
    // link.target = '_blank'
    link.href = `${api}/api/v1/note/annex/download?annex_id=${annex_id}&token=${getAccessToken()}`
    link.click()
  } catch (e) {
    console.error(e)
  }
}
