import request from '@/utils/request'
import qs from 'qs'

// 创建企业
export function create(data) {
  return request.request({
    url: 'v1/company/add',
    method: 'POST',
    data: data
  })
}

// 查询企业
export function getList(page, limit, keyword) {
  return request.get('v1/company?' + qs.stringify({ page, limit, keyword }))
}

// 删除企业
export function del(id) {
  return request.delete('v1/company/' + id)
}

// 修改企业信息
export function update(id, data) {
  return request.post('/v1/company/' + id, data)
}


//  根据用户uid查询公司信息
export function get_company_info_by_uid(uid) {
  return request.get('/v1/company/' + uid);
}
