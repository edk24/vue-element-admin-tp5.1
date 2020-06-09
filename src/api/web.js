import request from '@/utils/request'
import qs from 'qs'
const api = '/v1/Web/'
// 轮播列表
export function banner_list(page, limit, type = 0) {
  return request({
    url: api + '/Banner?' + qs.stringify({ page, limit, type })
  })
}

// 添加轮播
export function banner_add(data) {
  return request({
    url: '/v1/Web/BannerAdd',
    method: 'post',
    data
  })
}

// 修改轮播
export function banner_update(data) {
  return request({
    url: '/v1/Web/BannerUpdate',
    method: 'post',
    data
  })
}

// 删除轮播
export function banner_delete(id) {
  return request({
    url: '/v1/Web/BannerDelete?id=' + id
  })
}

// 关于我们数据列表
export function about() {
  return request({
    url: '/v1/web/about'
  })
}

// 修改官网配置信息
export function update_config(data) {
  return request({
    url: '/v1/Web/ConfigUpdate',
    method: 'post',
    data
  })
}

// 获取产品分类列表
export function category_list(page, limit) {
  return request({
    url: '/v1/Web/TypeList?page=' + page + '&limit=' + limit
  })
}

// 产品分类添加
export function category_add(data) {
  return request({
    url: '/v1/Web/TypeAdd',
    method: 'post',
    data
  })
}

// 修改产品分类
export function category_update(data) {
  return request({
    url: '/v1/Web/TypeUpdate',
    method: 'post',
    data
  })
}

// 获取产品列表
export function goods_add(data) {
  return request({
    url: api + 'GoodsAdd',
    method: 'post',
    data
  })
}
