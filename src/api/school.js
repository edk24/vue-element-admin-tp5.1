import request from '@/utils/request'
import qs from 'qs'

const school = {
  getlist: function(page, limit, keyword) {
    return request({
      url: '/v1/school?' + qs.stringify({ page, limit, keyword }),
      method: 'get'
    })
  },
  type: function() {
    return request({
      url: '/v1/category/type',
      method: 'get'
    })
  },
  edit: function(id, data) {
    return request({
      url: '/v1/school/' + id,
      method: 'put',
      data: qs.stringify(data)
    })
  },
  add: function(data) {
    return request({
      url: '/v1/school',
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
  school: school
}
