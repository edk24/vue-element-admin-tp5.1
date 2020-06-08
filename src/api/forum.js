import request from '@/utils/request'
import qs from 'qs'

const forum = {
  getlist: function(page, limit, keyword) {
    return request({
      url: '/v1/forum/posts_list?' + qs.stringify({ page, limit, keyword }),
      method: 'get'
    })
  },
  detail: function(id) {
    return request({
      url: '/v1/forum/posts_detail?id=' + id,
      method: 'get'
    })
  }
}

module.exports = {
  forum: forum
}
