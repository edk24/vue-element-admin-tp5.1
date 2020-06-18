import request from '@/utils/request'
import qs from 'qs'

// 查询订单列表
export function getOrderList(page, limit, keyword, type, status) {
  return request({
    url: '/v1/order?' + qs.stringify({ page: page, limit: limit, keyword: keyword, type: JSON.stringify(type), status: status, admin: 1 })
  })
}

// 取订单信息
export function getOrderInfo(id) {
  return request({
    url: '/v1/order/' + id
  })
}

// 删除订单
export function delOrder(id) {
  return request({
    url: '/v1/order/' + id,
    method: 'delete'
  })
}

// 发货
export function shipOrder(id, data) {
  return request({
    method: 'post',
    url: '/v1/order/ship/' + id,
    data
  })
}
