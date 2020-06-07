import request from '@/utils/request'
import qs from 'qs'

// 获取用户信息
export function getUserInfo(id) {
  return request({
    url: '/v1/user/get/' + id,
    method: 'get'
  })
}
