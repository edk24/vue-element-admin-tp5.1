import request from '@/utils/request'
import qs from 'qs'

const manager = {
  getlist: function(page, limit, keyword, type, pid) {
    return request({
      url: '/v1/manager/list?' + qs.stringify({ page, limit, keyword, type, pid }),
      method: 'get'
    })
  },
  type: function() {
    return request({
      url: '/v1/manager/type',
      method: 'get'
    })
  },
  edit: function(data) {
    return request({
      url: '/v1/manager/edit',
      method: 'post',
      data
    })
  },
  add: function(data) {
    return request({
      url: '/v1/manager/add',
      method: 'post',
      data
    })
  },
  del: function(id) {
    return request({
      url: '/v1/manager/del?id=' + id,
      method: 'get'
    })
  }
}

// 公开api
module.exports = {
  manager: manager
}
