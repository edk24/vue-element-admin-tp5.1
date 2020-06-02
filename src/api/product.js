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
export function exchange_list(page, limit, keyword) {
  return request({
    url: '/v1/exchange/list?' + qs.stringify({ page, limit, keyword }),
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

// 积分兑换产品设置默认
export function exchange_default(id) {
  return request({
    url: '/v1/exchange/default?id=' + id,
    method: 'get'
  })
}

// 添加  普通产品
export function goods_add(data) {
  return request({
    url: '/v1/goods/add',
    method: 'post',
    data
 })
}

// 查询 普通产品列表
export function goods_list(page, limit, keyword) {
  return request({
    url: '/v1/goods/list?' + qs.stringify({ page, limit, keyword }),
    method: 'get'
 })
}

// 编辑  普通产品
export function goods_edit(data) {
  return request({
    url: '/v1/goods/update',
    method: 'post',
    data
  })
}

// 删除  普通产品
export function goods_del(id) {
  return request({
    url: '/v1/goods/delete?id=' + id,
    method: 'get'
  })
}
