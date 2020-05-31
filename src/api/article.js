import request from '@/utils/request'
import qs from 'qs'

// 添加文章
export function article_add(data) {
  return request({
    url: '/v1/prop_article/add',
    method: 'post',
    data
 })
}

// 查询文章
export function article_list(page, limit) {
  return request({
    url: '/v1/prop_article/list?' + qs.stringify(page, limit),
    method: 'get'
 })
}

// 编辑文章
export function article_edit(data) {
  return request({
    url: '/v1/prop_article/edit',
    method: 'post',
    data
  })
}



// 删除文章
export function article_del(id) {
  return request({
    url: '/v1/prop_article/del?id=' + id,
    method: 'get'
  })
}
