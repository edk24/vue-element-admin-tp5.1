import request from '@/utils/request'
import qs from 'qs'

// 查询列表
export function getList(page, limit) {
  return request({
    url: '/Feedback/list?' + qs.stringify(page, limit),
    method: 'get'
  })
}

// 标记已阅
export function submit_read(id) {
  return request({
    url: '/Feedback/read?id=' + id,
    method: 'get'
  })
}
