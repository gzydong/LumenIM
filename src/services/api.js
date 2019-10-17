import {post} from '@/utils/request.js'

//登录请求接口
export const loginApi = (data) => {
    return post('/api/auth/login',data);
}

//注册请求接口
export const registerApi = (data) => {
    return post('/api/auth/register',data);
}