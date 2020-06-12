import request from '@/utils/request'
import qs from 'qs'

const feedback = {
  getlist: function(page, limit, keyword, type) {
    return request({
      url: '/v1/feedback/getlist?' + qs.stringify({ page, limit, keyword, type }),
      method: 'get'
    })
  },
  read: function(id) {
    return request({
      url: '/v1/feedback/read?id=' + id,
      method: 'get'
    })
  },
  del: function(id) {
    return request({
      url: '/v1/feedback/del?id=' + id,
      method: 'get'
    })
  }
}

// 公开api
module.exports = {
  feedback: feedback
}
