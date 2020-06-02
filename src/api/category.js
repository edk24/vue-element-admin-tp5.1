import request from '@/utils/request'
import qs from 'qs'

// 查询分类
export function category_list(page, limit, keyword) {
  return request({
    url: '/v1/category/list?' + qs.stringify({ page, limit, keyword }),
    method: 'get'
 })
}

// 添加分类
export function category_add(data) {
  return request({
    url: '/v1/category/add',
    method: 'post',
    data
 })
}

// 编辑分类
export function category_edit(data) {
  return request({
    url: '/v1/category/edit',
    method: 'post',
    data
  })
}

// 删除分类
export function category_del(id) {
  return request({
    url: '/v1/category/del?id=' + id,
    method: 'get'
  })
}
