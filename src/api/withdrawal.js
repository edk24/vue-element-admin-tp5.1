import request from '@/utils/request'
import qs from 'qs'

// 查询  提现列表
export function withdrawal_list(data) {
  return request({
    url: '/v1/withdraw?' + qs.stringify(data),
    method: 'get'
  })
}

// 更新  提现审核
export function withdrawal_permission(id, data) {
    return request({
      url: '/v1/withdraw/' + id,
      method: 'put',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      data
    })
  }

