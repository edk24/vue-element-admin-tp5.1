import request from '@/utils/request'
import upload from '@/utils/upload'
import qs from 'qs'

// const task = {
//
// }

// module.exports = {
//   task: task
// }
// 竞标列表
export function task_bidding(data) {
  const dd = qs.stringify(data)
  return request({
    url: 'api/task/bidding?' + dd,
    method: 'get'
    // params: { dd }
  })
}

// 待审核列表
export function task_audit(data) {
  const dd = qs.stringify(data)
  return request({
    url: 'task/audit_do',
    method: 'post',
    data: dd
  })
}

// 待审核列表
export function task_audit_do(data) {
  return request({
    url: 'task/task_audit_do',
    method: 'post',
    data: data
  })
}

