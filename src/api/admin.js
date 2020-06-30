import request from '@/utils/request'
import qs from 'qs'

// 管理员列表
export function admin_list(page, limit, keyword) {
  return request({
    url: '/v1/admin/list?' + qs.stringify({ page, limit, keyword }),
    method: 'get'
  })
}

// 管理员密码修改
export function change_pwd(pwd) {
  const data = qs.stringify({ password: pwd })
  return request({
    url: '/v1/admin/password',
    method: 'post',
    data
  })
}

// 管理员角色修改
export function admin_role_update(data) {
  return request({
    url: '/v1/admin/update',
    method: 'post',
    data
  })
}

// 添加管理员
export function admin_add(user_id, role_id) {
  const data = qs.stringify({ admin_id: user_id, role_id })
  return request({
    url: '/v1/admin/add',
    method: 'post',
    data
  })
}

// 禁用管理员
export function admin_used(id) {
  return request({
    url: '/v1/admin/del?admin_id=' + id
  })
}

// 获取所有角色列表
export function role() {
  return request({
    url: '/v1/role/list?limit=1000'
  })
}

// 手机号查询用户
export function phoneUser(phone) {
  return request({
    url: '/v1/admin/phone_user?phone=' + phone
  })
}
