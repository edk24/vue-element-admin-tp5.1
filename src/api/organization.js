import request from '@/utils/request'
import qs from 'qs'
const organization = {
  train_list: function(page, limit, keyword, status) {
    return request({
      url: '/v1/train?' + qs.stringify({ page, limit, keyword, status }),
      method: 'get'
    })
  },
  status: function(id, status, reason) {
    return request({
      url: '/v1/train/hou_status?' + qs.stringify({ id, status, reason }),
      method: 'get'
    })
  },
  del: function(id) {
    return request({
      url: '/v1/train/del?id=' + id,
      method: 'get'
    })
  },
  train_info: function(id) {
    return request({
      url: '/v1/train/' + id,
      method: 'get'
    })
  },
  edit: function(data) {
    return request({
      url: '/v1/train/update',
      method: 'post',
      data
    })
  },
  upload_image: function(data) {
    return request({
      url: '/v1/train/upload_image',
      method: 'post',
      data
    })
  },
  del_image: function(id, url) {
    return request({
      url: '/v1/train/del_image?' + qs.stringify({ id, url }),
      method: 'get'
    })
  },
  train_detail: function(id) {
    return request({
      url: '/v1/train/detail?id=' + id,
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
