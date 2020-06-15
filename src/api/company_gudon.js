import request from '@/utils/request'

// 创建
export function create(data) {
  return request({
    url: '/v1/companypartner',
    data: data,
    method: 'post',
    headers: {
      'Content-Type':'application/json'
    }
  })
}

// 查询列表
export function getList(company_id) {
  return request({
    url: '/v1/companypartner?company_id=' + company_id
  })
}

// 删除股东
export function del(id) {
  return request({
    url: '/v1/companyPartner/' + id,
    method: 'delete'
  })
}

// 修改股东信息
export function update(id, data) {
  return request({
    url: '/v1/companyPartner/' + id,
    method: 'put',
    data
  })
}
