import request from '@/utils/request'
import qs from 'qs'


// 查询论坛列表
export function forum_list(page, limit, keyword) {
  return request({
    url: '/v1/forum/posts_list?' + qs.stringify({page, limit, keyword}),
    method: 'get'
 })
}

// 删除论坛帖子
export function forum_del(id) {
  return request({
    url: '/v1/forum/posts_del?id=' + id,
    method: 'get'
  })
}

// // 添加轮播图
// export function advertisement_add(data) {
//   return request({
//     url: '/v1/banner/add',
//     method: 'post',
//     data
//  })
// }

// // 编辑轮播
// export function advertisement_edit(data) {
//   return request({
//     url: '/v1/banner/edit',
//     method: 'post',
//     data
//   })
// }

// // 轮播图位置
// export function advertisement_type(data) {
//   return request({
//     url: '/v1/banner/type',
//     method: 'get',
//     data
//   })
// }


// // 轮播审核
// export function advertisement_audit(id, type) {
//   return request({
//     url: '/Advertisement/audit?' + qs.stringify({ id, type }),
//     method: 'get'
//   })
// }

// // 删除轮播
// export function advertisement_del(id) {
//   return request({
//     url: '/v1/banner/del?id=' + id,
//     method: 'get'
//   })
// }
