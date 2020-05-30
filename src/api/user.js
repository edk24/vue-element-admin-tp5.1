import request from '@/utils/request'
import qs from 'qs'

// 用户登录
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 获取用户信息
export function getInfo() {
  return request({
    url: '/v1/user/info',
    method: 'get'
  })
}
// 注销
export function logout() {
  return request({
    url: '/admin/out',
    method: 'post'
  })
}

// 查询用户列表
export function user_list(page, limit, keyword) {
  return request({
    url: '/user/list?' + qs.stringify({ limit, page, phone: keyword })
  })
}

// 查询用户资料审核列表
export function user_audit_list(page, limit) {
  return request({
    url: '/user/audit?' + qs.stringify(page, limit)
  })
}

// 用户封禁
export function user_ban(user_id, error_content) {
  const data = qs.stringify({ user_id, error_content })
  return request({
    url: '/user/ban',
    method: 'post',
    data
  })
}

// 用户解禁
export function user_use(user_id) {
  return request({
    url: '/user/use?' + qs.stringify({ user_id })
  })
}

// 用户审核 (拒绝理由[type==2,必填])
export function user_do_audit(user_id, type, real_content) {
  const data = qs.stringify({ user_id, type, real_content })
  return request({
    url: '/user/do_audit',
    method: 'post',
    data
  })
}
