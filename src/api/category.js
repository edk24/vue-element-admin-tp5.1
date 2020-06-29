import request from '@/utils/request'
import qs from 'qs'

const category = {
  getlist: function(page, limit, keyword, type, pid) {
    return request({
      url: '/v1/category/list?' + qs.stringify({ page, limit, keyword, type, pid }),
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
  category: category
}
