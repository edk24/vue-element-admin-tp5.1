import request from '@/utils/request'
import qs from 'qs'

// 获取角色列表
export function role_getlist(page, limit) {
  return request({
    url: '/role/list?' + qs.stringify({ page, limit })
  })
}

// 角色添加
export function role_add(data) {
  data = qs.stringify(data)
  return request({
    url: '/role/add',
    method: 'post',
    data
  })
}

// 角色修改
export function role_update(data) {
  data = qs.stringify(data)
  return request({
    url: '/role/update',
    method: 'post',
    data
  })
}

// 角色删除
export function role_del(id) {
  return request({
    url: '/role/del?id=' + id
  })
}

// 角色信息
export function role_info(id) {
  return request({
    url: '/role/info?id=' + id
  })
}
