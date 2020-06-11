import request from '@/utils/request'
import qs from 'qs'

const feedback = {
  getlist: function(page, limit, keyword ) {
    return request({
      url: '/v1/feedback/getlist?' + qs.stringify({ page, limit, keyword }),
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
      url: '/v1/category/add',
      method: 'post',
      data
    })
  },
  del: function(id) {
    return request({
      url: '/v1/category/del?id=' + id,
      method: 'get'
    })
  }
}

// 公开api
module.exports = {
  feedback: feedback
}
