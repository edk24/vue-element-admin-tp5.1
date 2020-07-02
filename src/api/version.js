import request from '@/utils/request'
import qs from 'qs'

const version = {
  getlist: function(page, limit, keyword) {
    return request({
      url: '/v1/version/list?' + qs.stringify({ page, limit, keyword }),
      method: 'get'
    })
  },
  type: function() {
    return request({
      url: '/v1/version/type',
      method: 'get'
    })
  },
  edit: function(data) {
    return request({
      url: '/v1/version/edit',
      method: 'post',
      data
    })
  },
  add: function(data) {
    return request({
      url: '/v1/version/add',
      method: 'post',
      data
    })
  },
  del: function(id) {
    return request({
      url: '/v1/version/del?id=' + id,
      method: 'get'
    })
  }
}

// 公开api
module.exports = {
  version: version
}
