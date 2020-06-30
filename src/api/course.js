import request from '@/utils/request'
import qs from 'qs'

const course = {
  getlist: function(page, limit, train_id, user_id) {
    return request({
      url: '/v1/course?' + qs.stringify({ page, limit, train_id, user_id }),
      method: 'get'
    })
  },
  edit: function(data) {
    return request({
      url: '/v1/course/edit',
      method: 'post',
      data
    })
  },
  add: function(data) {
    return request({
      url: '/v1/course',
      method: 'post',
      data
    })
  },
  del: function(id) {
    return request({
      url: '/v1/course/' + id,
      method: 'delete'
    })
  },
  upload_image: function(data) {
    return request({
      url: '/v1/course/upload_image',
      method: 'post',
      data
    })
  },
  del_image: function(data) {
    return request({
      url: '/v1/course/del_image',
      method: 'post',
      data
    })
  }
}

// 公开api
module.exports = {
  course: course
}
