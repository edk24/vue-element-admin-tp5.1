import request from '@/utils/request'
import qs from 'qs'

// 获取角色列表
export function role_getlist(page, limit) {
  return request({
    url: '/v1/role/list?' + qs.stringify({ page, limit })
  })
}

// 角色添加
export function role_add(data) {
  data = qs.stringify(data)
  return request({
    url: '/v1/role/add',
    method: 'post',
    data
  })
}

// 角色修改
export function role_update(data) {
  data = qs.stringify(data)
  return request({
    url: '/v1/role/update',
    method: 'post',
    data
  })
}

// 角色删除
export function role_del(id) {
  return request({
    url: '/v1/role/del?id=' + id
  })
}

// 角色信息
export function role_info(id) {
  return request({
    url: '/v1/role/info?id=' + id
  })
}
