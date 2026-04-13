import http from './request'

/** 客户端用户列表（分页 + 搜索） */
export const getUsers = (params) => http.get('/admin/users', { params })

/** 用户详情 */
export const getUserById = (id) => http.get(`/admin/users/${id}`)

/** 修改用户状态 */
export const updateUserStatus = (id, status) => http.put(`/admin/users/${id}/status`, { status })
