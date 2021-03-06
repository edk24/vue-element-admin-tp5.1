import request from '@/utils/request'
import qs from 'qs'

// 用户登录
export function login(data) {
  return request({
    url: '/v1/user/login',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 获取用户信息
export function getInfo() {
  return request({
    url: '/v1/admin/info',
    method: 'get'
  })
}
// 注销
export function logout() {
  return request({
    url: '/v1/user/logout',
    method: 'get'
  })
}
// 用户删除
export function user_del(id) {
  return request({
    url: '/v1/user/' + id,
    method: 'delete'
  })
}

// 查询用户列表
export function user_list(page, limit, keyword, type, audit = -1) {
  return request({
    url: '/v1/user/list?' + qs.stringify({ page, limit, keyword, type, audit })
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

// 查询银行卡列表
export function bank_list(page, limit, keyword, status) {
  return request({
    url: '/v1/bank/list?' + qs.stringify({ limit, page, keyword, status }),
    method: 'get'
  })
}

export function bank_status(data) {
  return request({
    url: '/v1/bank/status',
    method: 'post',
    data
  })
}

// 银行卡删除
export function bank_del(id) {
  return request({
    url: '/v1/bank/del?id=' + id,
    method: 'get'
  })
}

// 用户搜索, 每次拉取25个
export function user_search(keyword, type) {
  return request({
    url: 'v1/user/list?' + qs.stringify({ keyword, type })
  })
}

// 实名认证提交
export function user_audit(user_id, audit) {
  const data = { user_id, audit }
  return request({
    url: '/v1/user/audit',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  })
}

// 孩子信息
export function user_kid(id) {
  return request({
    url: '/v1/user/getSonByUid?id=' + id,
    method: 'get'
  })
}

// 学校信息
export function user_school(id) {
  return request({
    url: '/v1/user/getSchool?id=' + id,
    method: 'get'
  })
}

// 设置贫困学生
export function set_poverty(id) {
  return request({
    url: '/v1/user/set_poverty?id=' + id,
    method: 'get'
  })
}

export function getAuthMenu() {
  return request({
    url:'/v1/menu/tree'
  })
}


export function getRouter(roule) {
  return request({
    url: '/v1/menu/getRouter1',
    method: 'post',
    data: {
      type: roule
    }
  })
}



