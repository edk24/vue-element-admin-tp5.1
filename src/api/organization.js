import request from '@/utils/request'
import qs from 'qs'

// 培训机构列表
export function train_list(page, limit, keyword) {
  return request({
    url: '/v1/train?' + qs.stringify({ page, limit, keyword }),
    method: 'get'
  })
}

// 删除机构
export function train_del(id) {
  return request({
    url: '/v1/train/' + id,
    method: 'delete'
  })
}
// 编辑机构信息
export function train_edit(id, data) {
  console.log(typeof data)
  return request({
    url: '/v1/train/' + id,
    method: 'put',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    data
  })
}
// 设置机构优惠金额
// export function company_add(data) {
//   return request({
//     url: '/v1/company/add',
//     method: 'post',
//     data
//  })
// }

// // 查询合伙人
// export function company_list(page, limit, keyword) {
//   return request({
//     url: '/v1/company/list?' + qs.stringify({page, limit , keyword}), // page=1&limit=2
//     method: 'get'
//  })
// }

// // 编辑合伙人
// export function company_edit(data) {
//   return request({
//     url: '/v1/company/update',
//     method: 'post',
//     data
//   })
// }
