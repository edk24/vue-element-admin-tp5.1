import request from '@/utils/request'
import qs from 'qs'

const coupon = {
  getlist: function(page, limit, keyword, type, master_id, target_id) {
    return request({
      url: '/v1/coupon?' + qs.stringify({ page, limit, keyword, type, master_id, target_id }),
      method: 'get'
    })
  },
  edit: function(id, data) {
    return request({
      url: '/v1/coupon/' + id,
      method: 'put',
      data: qs.stringify(data)
    })
  },
  add: function(data) {
    return request({
      url: '/v1/coupon',
      method: 'post',
      data
    })
  },
  del: function(id) {
    return request({
      url: '/v1/coupon/' + id,
      method: 'delete'
    })
  }
}

// 公开api
module.exports = {
  coupon: coupon
}
