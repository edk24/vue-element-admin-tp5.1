import request from '@/utils/request'
import qs from 'qs'

const prop = {
  video_list: function(page, limit, keyword) {
    return request({
      url: '/v1/prop_video/getlist?' + qs.stringify({ page, limit, keyword }),
      method: 'get'
    })
  }
}

// 公开api
module.exports = {
  prop: prop
}
