import { createApiCall } from './request.ts'
import { getToken } from '@/utils/auth.ts'

// -------- 笔记相关 --------

// 查询用户文集分类服务接口
export const ServArticleList = createApiCall('/api/v1/article/list')

// 编辑笔记服务接口
export const ServArticleEdit = createApiCall('/api/v1/article/editor')

// 删除笔记服务接口
export const ServArticleDelete = createApiCall('/api/v1/article/delete')

// 永久删除笔记回收站的笔记
export const ServArticleForeverDelete = createApiCall('/api/v1/article/forever-delete')

export const ServArticleRecycleList = createApiCall('/api/v1/article/recycle-list')

// 恢复笔记服务接口
export const ServArticleRecoverDelete = createApiCall('/api/v1/article/recover-delete')

// 设置标记星号笔记服务接口
export const ServArticleCollect = createApiCall('/api/v1/article/collect')

// 查询用户文集分类服务接口
export const ServArticleDetail = createApiCall('/api/v1/article/detail')

// 移动笔记服务接口
export const ServArticleMoveClassify = createApiCall('/api/v1/article/move-classify')

// 更新笔记标签服务接口
export const ServArticleUpdateTag = createApiCall('/api/v1/article/update-tag')

// 合并笔记分类服务接口
export const ServArticleMerge = createApiCall('/api/v1/article/merge')

// -------- 笔记分类相关 --------

// 查询用户文集分类服务接口
export const ServArticleClassifyList = createApiCall('/api/v1/article/classify/list')

// 添加或编辑文集分类服务接口
export const ServArticleClassifyCreate = createApiCall('/api/v1/article/classify/create')

// 添加或编辑文集分类服务接口
export const ServArticleClassifyUpdate = createApiCall('/api/v1/article/classify/update')

// 删除笔记分类服务接口
export const ServArticleClassifyDelete = createApiCall('/api/v1/article/classify/delete')

// 笔记分类排序服务接口
export const ServArticleClassifySort = createApiCall('/api/v1/article/classify/sort')

// -------- 笔记标签相关 --------

// 获取笔记表标签服务接口
export const ServArticleTagList = createApiCall('/api/v1/article/tag/list')

// 添加或编辑笔记标签服务接口
export const ServArticleTagCreate = createApiCall('/api/v1/article/tag/create')

export const ServArticleTagUpdate = createApiCall('/api/v1/article/tag/update')

// 删除笔记标签服务接口
export const ServArticleTagDelete = createApiCall('/api/v1/article/tag/delete')

// -------- 笔记附件相关 --------

// 笔记附件上传服务接口
export const ServArticleAnnexUpload = createApiCall('/api/v1/article/annex/upload')

// 移除笔记附件服务接口
export const ServArticleAnnexDelete = createApiCall('/api/v1/article/annex/delete')

// 永久删除笔记附件回收站文件
export const ServArticleAnnexForeverDelete = createApiCall('/api/v1/article/annex/forever-delete')

// 恢复笔记附件服务接口
export const ServArticleAnnexRecover = createApiCall('/api/v1/article/annex/recover')

// 笔记附件回收站列表服务接口
export const ServArticleAnnexRecycleList = createApiCall('/api/v1/article/annex/recycle-list')

// 下载笔记附件服务接口
export const ServeDownloadAnnex = (annex_id) => {
  const api = import.meta.env.VITE_BASE_API
  try {
    const link = document.createElement('a')
    // link.target = '_blank'
    link.href = `${api}/api/v1/article/annex/download?annex_id=${annex_id}&token=${getToken()}`
    link.click()
  } catch (e) {
    console.error(e)
  }
}
