import { post, get, upload } from '@/utils/request'
import { getToken } from '@/utils/auth'
import config from '@/config/config'

// -------- 笔记相关 --------

// 查询用户文集分类服务接口
export const ServeGetArticleList = data => {
  return get('/api/v1/article/search', data)
}

// 编辑笔记服务接口
export const ServeEditArticle = data => {
  return post('/api/v1/article/editor', data)
}

// 删除笔记服务接口
export const ServeDeleteArticle = data => {
  return post('/api/v1/article/delete', data)
}

// 永久删除笔记回收站的笔记
export const ServeForeverDeleteArticle = data => {
  return post('/api/v1/article/forever-delete', data)
}

// 恢复笔记服务接口
export const ServeRecoverArticle = data => {
  return post('/api/v1/article/recover', data)
}

// 设置标记星号笔记服务接口
export const ServeSetAsteriskArticle = data => {
  return post('/api/v1/article/asterisk', data)
}

// 查询用户文集分类服务接口
export const ServeGetArticleDetail = data => {
  return get('/api/v1/article/detail', data)
}

// 移动笔记服务接口
export const ServeMoveArticle = data => {
  return post('/api/v1/article/move', data)
}

// 笔记图片上传服务接口
export const ServeUploadArticleImg = data => {
  return upload('/api/v1/article/upload-image', data)
}

// 更新笔记标签服务接口
export const ServeUpdateArticleTag = data => {
  return post('/api/v1/article/update-tag', data)
}

// -------- 笔记分类相关 --------

// 查询用户文集分类服务接口
export const ServeGetArticleClass = data => {
  return get('/api/v1/article/classifys', data)
}

// 添加或编辑文集分类服务接口
export const ServeEditArticleClass = data => {
  return post('/api/v1/article/classify/editor', data)
}

// 删除笔记分类服务接口
export const ServeDeleteArticleClass = data => {
  return post('/api/v1/article/classify/delete', data)
}

// 笔记分类排序服务接口
export const ServeArticleClassSort = data => {
  return post('/api/v1/article/classify/sort', data)
}

// 合并笔记分类服务接口
export const ServeMergeArticleClass = data => {
  return post('/api/v1/article/classify/merge', data)
}

// -------- 笔记标签相关 --------

// 获取笔记表标签服务接口
export const ServeGetArticleTag = data => {
  return get('/api/v1/article/tags', data)
}

// 添加或编辑笔记标签服务接口
export const ServeEditArticleTag = data => {
  return post('/api/v1/article/tag/editor', data)
}

// 删除笔记标签服务接口
export const ServeDeleteArticleTag = data => {
  return post('/api/v1/article/tag/delete', data)
}

// -------- 笔记附件相关 --------

// 笔记附件上传服务接口
export const ServeUploadArticleAnnex = data => {
  return upload('/api/v1/article/annex/upload', data)
}

// 移除笔记附件服务接口
export const ServeDeleteArticleAnnex = data => {
  return post('/api/v1/article/annex/delete', data)
}

// 永久删除笔记附件回收站文件
export const ServeForeverDeleteAnnex = data => {
  return post('/api/v1/article/annex/forever-delete', data)
}

// 恢复笔记附件服务接口
export const ServeRecoverArticleAnnex = data => {
  return post('/api/v1/article/annex/recover', data)
}

// 笔记附件回收站列表服务接口
export const ServeGetRecoverAnnexList = () => {
  return get('/api/v1/article/annex/recover-list')
}

// 下载笔记附件服务接口
export const ServeDownloadAnnex = annex_id => {
  let api = config.BASE_API_URL
  try {
    let link = document.createElement('a')
    link.href = `${api}/api/v1/download/article-annex?annex_id=${annex_id}&token=${getToken()}`
    link.click()
  } catch (e) {
    console.error(e)
  }
}

