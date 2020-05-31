import request from '@/utils/request'
import qs from 'qs'

// 添加  积分兑换产品的添加
export function exchange_add(data) {
  return request({
    url: '/v1/exchange/add',
    method: 'post',
    data
 })
}

// 查询积分兑换产品列表
export function exchange_list(page, limit) {
  return request({
    url: '/v1/exchange/list?' + qs.stringify(page, limit),
    method: 'get'
 })
}

// 编辑积分兑换产品
export function exchange_edit(data) {
  return request({
    url: '/v1/exchange/update',
    method: 'post',
    data
  })
}


// 删除积分兑换产品
export function exchange_del(id) {
  return request({
    url: '/v1/exchange/delete?id=' + id,
    method: 'get'
  })
}
