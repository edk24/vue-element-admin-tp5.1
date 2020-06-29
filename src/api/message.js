import request from '@/utils/request'
import qs from 'qs'

const message = {
  getlist: function(page, limit, keyword, type) {
    return request({
      url: '/v1/message/lst?' + qs.stringify({ page, limit, keyword, type }),
      method: 'get'
    })
  },
  type: function() {
    return request({
      url: '/v1/category/type',
      method: 'get'
    })
  },
  edit: function(data) {
    return request({
      url: '/v1/category/edit',
      method: 'post',
      data
    })
  },
  add: function(data) {
    return request({
      url: '/v1/message/add',
      method: 'post',
      data
    })
  },
  del: function(id) {
    return request({
      url: '/v1/message/del?id=' + id,
      method: 'get'
    })
  },
  channel: function() {
    return request({
      url: '/v1/message/channel',
      method: 'get'
    })
  }
}

// 公开api
module.exports = {
  message: message
}
