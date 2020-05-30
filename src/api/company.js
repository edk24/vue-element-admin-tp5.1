import request from '@/utils/request'
import qs from 'qs'

// 查询服务商列表
export function getList(page, limit, type) {
  return request({
    url: '/company/list?' + qs.stringify({ page, limit, type }),
    method: 'get'
  })
}

// 服务商审核
export function company_audit(data) {
  data = qs.stringify(data)
  return request({
    url: '/company/audit',
    method: 'post',
    data
  })
}

// 服务商举报
export function company_report(data) {
  data = qs.stringify(data)
  return request({
    url: '/company/report',
    method: 'post',
    data
  })
}
