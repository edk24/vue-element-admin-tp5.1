import request from '@/utils/request'
import qs from 'qs'

const learn = {
  list: function(page, limit, keyword, type) {
    return request({
      url: '/v1/learn/getlist?' + qs.stringify({ page, limit, keyword, type }),
      method: 'get'
    })
  },
  edit: function(data) {
    return request({
      url: '/v1/learn/edit',
      method: 'post',
      data
    })
  },
  add: function(data) {
    return request({
      url: '/v1/learn/add',
      method: 'post',
      data
    })
  },
  del: function(id) {
    return request({
      url: '/v1/learn/del?id=' + id,
      method: 'get'
    })
  },
  cate: function() {
    return request({
      url: '/v1/learn/learn_cate',
      method: 'get'
    })
  }
}

// 公开api
module.exports = {
  learn: learn
}
