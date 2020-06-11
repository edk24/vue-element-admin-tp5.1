import request from '@/utils/request'
import qs from 'qs'

const prop = {
  video_list: function(page, limit, keyword) {
    return request({
      url: '/v1/prop_video/getlist?' + qs.stringify({ page, limit, keyword }),
      method: 'get'
    })
  },
  video_edit: function(data) {
    return request({
      url: '/v1/prop_video/edit',
      method: 'post',
      data
    })
  },
  video_add: function(data) {
    return request({
      url: '/v1/prop_video/upload_prop_video',
      method: 'post',
      data
    })
  },
  video_del: function(id) {
    return request({
      url: '/v1/prop_video/del?id=' + id,
      method: 'get'
    })
  }
}

// 公开api
module.exports = {
  prop: prop
}
