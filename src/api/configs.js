import request from '@/utils/request'
import qs from 'qs'

// 查询所有设置
export function getAllConfig() {
  return request({
    url: '/v1/config'
  })
}

// 批量更新设置
export function updateAll(data) {
  return request({
    url: '/v1/config',
    method: 'put',
    data
  })
}
