import {
  post,
  get,
  upload
} from '@/utils/request';


import {
  getToken
} from '@/utils/auth';

//查询用户文集分类服务接口
export const findArticleClassServ = (data) => {
  return get('/api/article/article-class', data);
}

export const findArticleTagsServ = (data) => {
  return get('/api/article/article-tags', data);
}

//查询用户文集分类服务接口
export const findArticleServ = (data) => {
  return get('/api/article/article-list', data);
}

//查询用户文集分类服务接口
export const findArticleDetailServ = (data) => {
  return get('/api/article/article-detail', data);
}

//添加或编辑文集分类服务接口
export const editArticleClassServ = (data) => {
  return post('/api/article/edit-article-class', data);
}

//添加或编辑笔记标签服务接口
export const editArticleTagServ = (data) => {
  return post('/api/article/edit-article-tag', data);
}

//删除笔记分类服务接口
export const delArticleClassServ = (data) => {
  return post('/api/article/del-article-class', data);
}

//删除笔记标签服务接口
export const delArticleTagServ = (data) => {
  return post('/api/article/del-article-tag', data);
}

//笔记分类排序服务接口
export const articleClassSortServ = (data) => {
  return post('/api/article/article-class-sort', data);
}

//合并笔记分类服务接口
export const mergeArticleClassServ = (data) => {
  return post('/api/article/merge-article-class', data);
}

//移动笔记服务接口
export const moveArticleServ = (data) => {
  return post('/api/article/move-article', data);
}

//设置标记星号笔记服务接口
export const setAsteriskArticleServ = (data) => {
  return post('/api/article/set-asterisk-article', data);
}

//编辑笔记服务接口
export const editArticleServ = (data) => {
  return post('/api/article/edit-article', data);
}

//删除笔记服务接口
export const deleteArticleServ = (data) => {
  return post('/api/article/delete-article', data);
}

//恢复笔记服务接口
export const recoverArticleServ = (data) => {
  return post('/api/article/recover-article', data);
}

//笔记图片上传服务接口
export const uploadArticleImgServ = (data) => {
  return upload('/api/article/upload-article-image', data);
}

//笔记附件上传服务接口
export const uploadArticleAnnexServ = (data) => {
  return upload('/api/article/upload-article-annex', data);
}

//移除笔记附件服务接口
export const deleteArticleAnnexServ = (data) => {
  return post('/api/article/delete-article-annex', data);
}

//恢复笔记附件服务接口
export const recoverArticleAnnexServ = (data) => {
  return post('/api/article/recover-article-annex', data);
}

//永久删除笔记附件回收站文件
export const foreverDeleteAnnexServ = (data) => {
  return post('/api/article/forever-delete-annex', data);
}

//永久删除笔记回收站的笔记
export const foreverDeleteArticleServ = (data) => {
  return post('/api/article/forever-delete-article', data);
}

//笔记附件回收站列表服务接口
export const recoverAnnexListServ = () => {
  return get('/api/article/recover-annex-list');
}

//下载笔记附件服务接口
export const downloadAnnexServ = (annex_id) => {
  let api = process.env.API_URL;
  try {
    let link = document.createElement('a');
    link.href = `${api}/api/download/article-annex?annex_id=${annex_id}&token=${getToken()}`
    link.click();
  } catch (e) {}
}

//更新笔记标签服务接口
export const updateArticleTagServ = (data) => {
  return post('/api/article/update-article-tag', data);
}
