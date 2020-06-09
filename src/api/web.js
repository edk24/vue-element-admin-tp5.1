import request from '@/utils/request'
import qs from 'qs'

// 轮播列表
export function banner_list(page, limit, type = 0) {
  return request({
    url: '/v1/Web/Banner?' + qs.stringify({ page, limit, type })
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
