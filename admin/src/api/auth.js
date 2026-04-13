import http from './request'

/** 管理员登录 */
export const login = (data) => http.post('/admin/login', data)

/** 获取当前管理员信息 */
export const getProfile = () => http.get('/admin/profile')
