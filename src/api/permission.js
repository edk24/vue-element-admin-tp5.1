import request from '@/utils/request'
import qs from 'qs'
// 查询权限列表
export function get_permission_list() {
  return request({
    url: 'v1/permission/list',
    method: 'get'
  })
}

// 查询权限列表 (树结构)
export function get_permission_tree() {
  return request({
    url: 'v1/permission/all',
    method: 'get'
  })
}

// 删除权限
export function permission_del(id) {
  return request({
    url: 'v1/permission/del?id=' + id,
    method: 'get'
  })
}

// 修改权限
export function permission_update(data) {
  data = qs.stringify(data)
  return request({
    url: 'v1/permission/update',
    method: 'post',
    data
  })
}

// 修改权限
export function permission_add(data) {
  data = qs.stringify(data)
  return request({
    url: 'v1/permission/add',
    method: 'post',
    data
  })
}
