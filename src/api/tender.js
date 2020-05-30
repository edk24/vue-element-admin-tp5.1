import qs from 'qs'
import request from '@/utils/request'

/**
 * 招标接口  任务接口
 */

 /**
  * 竞标列表
  * @param int page 页码
  * @param int limit 每页显示数量
  * @param int type 类型(0结束竞标, 1竞标中)
  */
export function getList(page, limit, type) {
  return request({
    url: 'task/bidding?' + qs.stringify({ page, limit, type }),
    method: 'get'
  })
}

/**
 * 待审核列表
 * @param int page 页码
 * @param int limit 每页显示数量
 * @param int type 类型(0待审核 1审核成功 2审核失败)
 */
export function getListWaitAudit(page, limit, type) {
  return request({
    url: 'task/audit?' + qs.stringify({ page, limit, type }),
    method: 'get'
  })
}

/**
 * 审核
 * @param int id ID
 * @param int 状态 (1审核成功 2审核失败)
 * @param string error_content 失败原因
 */
export function audit(id, type, error_content = '') {
  const data = qs.stringify({ id, type, error_content })
  return request({
    url: 'task/audit_do',
    method: 'post',
    data
  })
}

/**
 * 发起招嫖
 * @param object data
 */
export function publish(data) {
  data = qs.stringify(data)
  return request({
    url: 'task/add',
    method: 'post',
    data: data
  })
}
