import request from '@/utils/request'
import qs from 'qs'
const organization = {
  getlist: function(page, limit, keyword, type) {
    return request({
      url: '/v1/category/list?' + qs.stringify({ page, limit, keyword, type }),
      method: 'get'
    })
  },
  train_list: function(page, limit, keyword, status) {
    return request({
      url: '/v1/train?' + qs.stringify({ page, limit, keyword, status }),
      method: 'get'
    })
  },
  status: function(id, status, reason) {
    return request({
      url: '/v1/train/status?' + qs.stringify({ id, status, reason }),
      method: 'get'
    })
  },
  del: function(id) {
    return request({
      url: '/v1/train/del?id=' + id,
      method: 'get'
    })
  }
}
// 培训机构列表
export function train_list(page, limit, keyword) {
  return request({
    url: '/v1/train?' + qs.stringify({ page, limit, keyword }),
    method: 'get'
  })
}

// 删除机构
export function train_del(id) {
  return request({
    url: '/v1/train/' + id,
    method: 'delete'
  })
}
// 编辑机构信息
export function train_edit(id, data) {
  console.log(typeof data)
  return request({
    url: '/v1/train/' + id,
    method: 'put',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    data
  })
}

// 公开api
module.exports = {
  organization: organization
}
