import request from '@/utils/request'
import qs from 'qs'

// 添加合伙人
export function company_add(data) {
  return request({
    url: '/v1/company/add',
    method: 'post',
    data
 })
}

// 查询合伙人
export function company_list(page, limit) {
  return request({
    url: '/v1/company/list?' + qs.stringify(page, limit),
    method: 'get'
 })
}

// 编辑合伙人
export function company_edit(data) {
  return request({
    url: '/v1/company/update',
    method: 'post',
    data
  })
}


// 删除合伙人
export function company_del(id) {
  return request({
    url: '/v1/company/delete?id=' + id,
    method: 'get'
  })
}

/* ====================== 股东管理 ============================= */


// 添加股东
export function shareholder_add(data) {
  return request({
    url: '/v1/shareholder/add',
    method: 'post',
    data
 })
}

// 查询股东
export function shareholder_list(page, limit) {
  return request({
    url: '/v1/shareholder/list?' + qs.stringify(page, limit),
    method: 'get'
 })
}

// 编辑股东
export function shareholder_edit(data) {
  return request({
    url: '/v1/shareholder/update',
    method: 'post',
    data
  })
}


// 删除股东
export function shareholder_del(id) {
  return request({
    url: '/v1/shareholder/delete?id=' + id,
    method: 'get'
  })
}
