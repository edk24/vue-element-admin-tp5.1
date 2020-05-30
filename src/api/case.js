import request from '@/utils/request'
import upload from '@/utils/upload'
import qs from 'qs'

// 查询案例列表
export function getList(page, limit) {
  return request({
    url: '/goods/list?' + qs.stringify({ page, limit }),
    method: 'get'

  })
}

// 案例删除
export function caseDel(id) {
  return request({
    url: '/goods/del?id=' + id
  })
}

// 案例添加
export function caseAdd(data) {
  data = qs.stringify(data)
  return upload({
    url: '/goods/add',
    method: 'post',
    data
  })
}

// 案例修改
export function caseUpdate(data) {
  data = qs.stringify(data)
  return upload({
    url: '/goods/update',
    method: 'post',
    data
  })
}
