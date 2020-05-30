import request from '@/utils/request'
import qs from 'qs'

/**
 * 查询举报列表
 * @param {int} page
 * @param {int} limit
 * @param {int} type 0公司 1需求项目
 * @param {int} status -1所有 0未审查 1有效 2无效
 */
export function getList(page, limit, type, status) {
  return request({
    url: 'report/list',
    method: 'get',
    params: { page, limit, type, status }
  })
}

/**
 * 审核举报
 * @param {int} id
 * @param {int} type 1有效 2无效
 */
export function audit(id, type) {
  return request({
    url: 'Report/audit',
    method: 'get',
    params: { id, type }
  })
}
