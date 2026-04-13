import http from './request'

/** 管理员列表 */
export const getAdminUsers = () => http.get('/admin/admin-users')

/** 创建管理员 */
export const createAdminUser = (data) => http.post('/admin/admin-users', data)

/** 修改管理员 */
export const updateAdminUser = (id, data) => http.put(`/admin/admin-users/${id}`, data)

/** 删除管理员 */
export const deleteAdminUser = (id) => http.delete(`/admin/admin-users/${id}`)
