import request from '@/utils/request'
import qs from 'qs'

// 添加轮播图
export function advertisement_add(data) {
  return request({
    url: '/v1/banner/add',
    method: 'post',
    data
 })
}

// 查询轮播列表
export function advertisement_list(page, limit) {
  return request({
    url: '/v1/banner/list?' + qs.stringify(page, limit),
    method: 'get'
 })
}

// 编辑轮播
export function advertisement_edit(data) {
  return request({
    url: '/v1/banner/edit',
    method: 'post',
    data
  })
}

// 轮播图位置
export function advertisement_type(data) {
  return request({
    url: '/v1/banner/type',
    method: 'get',
    data
  })
}


// 轮播审核
export function advertisement_audit(id, type) {
  return request({
    url: '/Advertisement/audit?' + qs.stringify({ id, type }),
    method: 'get'
  })
}

// 删除轮播
export function advertisement_del(id) {
  return request({
    url: '/v1/banner/del?id=' + id,
    method: 'get'
  })
}

// 轮播订单
export function advertisement_order(page, limit, type) {
  return request({
    url: '/Advertisement/order?' + qs.stringify({ page, limit, type }),
    method: 'get'
  })
}

/**
 * 轮播图展示状态修改
 * @param {int} id
 * @param {int} status 是否展示
 */
export function banner_enable(id, status) {
  return request({
    url: 'Advertisement/show',
    params: { id, status }
  })
}
