import request from '@/utils/request'
import qs from 'qs'

const dashboard = {
  user_register_num: function() {
    return request({
      url: '/v1/dashboard/user_register_num',
      method: 'get'
    })
  },
  orders_num: function() {
    return request({
      url: '/v1/dashboard/orders_num',
      method: 'get'
    })
  }
}

// 公开api
module.exports = {
  dashboard: dashboard
}
