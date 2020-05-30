import request from '@/utils/request'
import qs from 'qs'

// 管理员列表
export function admin_list(page, limit) {
  return request({
    url: '/admin/list?' + qs.stringify({ page, limit }),
    method: 'get'
  })
}
// 管理员密码修改
export function change_pwd(pwd) {
  const data = qs.stringify({ password: pwd })
  return request({
    url: '/admin/password',
    method: 'post',
    data
  })
}

// 管理员角色修改
export function admin_role_update(user_id, role_id) {
  const data = qs.stringify({ admin_id: user_id, role_id })
  return request({
    url: '/admin/update',
    method: 'post',
    data
  })
}

// 添加管理员
export function admin_add(user_id, role_id) {
  const data = qs.stringify({ admin_id: user_id, role_id })
  return request({
    url: '/admin/add',
    method: 'post',
    data
  })
}

// 解除管理员
export function admin_unadd(user_id) {
  return request({
    url: '/admin/del?admin_id=' + user_id
  })
}

//

