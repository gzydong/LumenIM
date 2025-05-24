import { createApi } from './request.ts'
import { getToken } from '@/utils/auth.ts'

// -------- 笔记相关 --------

// 查询用户文集分类服务接口
export const ServArticleList = createApi('/api/v1/article/list')

// 编辑笔记服务接口
export const ServArticleEdit = createApi('/api/v1/article/editor')

// 删除笔记服务接口
export const ServArticleDelete = createApi('/api/v1/article/delete')

// 永久删除笔记回收站的笔记
export const ServArticleForeverDelete = createApi('/api/v1/article/forever-delete')

export const ServArticleRecycleList = createApi('/api/v1/article/recycle-list')

// 恢复笔记服务接口
export const ServArticleRecoverDelete = createApi('/api/v1/article/recover-delete')

// 设置标记星号笔记服务接口
export const ServArticleCollect = createApi('/api/v1/article/collect')

// 查询用户文集分类服务接口
export const ServArticleDetail = createApi('/api/v1/article/detail')

// 移动笔记服务接口
export const ServArticleMoveClassify = createApi('/api/v1/article/move-classify')

// 更新笔记标签服务接口
export const ServArticleUpdateTag = createApi('/api/v1/article/update-tag')

// 合并笔记分类服务接口
export const ServArticleMerge = createApi('/api/v1/article/merge')

// -------- 笔记分类相关 --------

// 查询用户文集分类服务接口
export const ServArticleClassifyList = createApi('/api/v1/article/classify/list')

// 添加或编辑文集分类服务接口
export const ServArticleClassifyCreate = createApi('/api/v1/article/classify/create')

// 添加或编辑文集分类服务接口
export const ServArticleClassifyUpdate = createApi('/api/v1/article/classify/update')

// 删除笔记分类服务接口
export const ServArticleClassifyDelete = createApi('/api/v1/article/classify/delete')

// 笔记分类排序服务接口
export const ServArticleClassifySort = createApi('/api/v1/article/classify/sort')

// -------- 笔记标签相关 --------

// 获取笔记表标签服务接口
export const ServArticleTagList = createApi('/api/v1/article/tag/list')

// 添加或编辑笔记标签服务接口
export const ServArticleTagCreate = createApi('/api/v1/article/tag/create')

export const ServArticleTagUpdate = createApi('/api/v1/article/tag/update')

// 删除笔记标签服务接口
export const ServArticleTagDelete = createApi('/api/v1/article/tag/delete')

// -------- 笔记附件相关 --------

// 笔记附件上传服务接口
export const ServArticleAnnexUpload = createApi('/api/v1/article/annex/upload')

// 移除笔记附件服务接口
export const ServArticleAnnexDelete = createApi('/api/v1/article/annex/delete')

// 永久删除笔记附件回收站文件
export const ServArticleAnnexForeverDelete = createApi('/api/v1/article/annex/forever-delete')

// 恢复笔记附件服务接口
export const ServArticleAnnexRecover = createApi('/api/v1/article/annex/recover')

// 笔记附件回收站列表服务接口
export const ServArticleAnnexRecycleList = createApi('/api/v1/article/annex/recycle-list')

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
