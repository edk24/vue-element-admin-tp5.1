import request from '@/utils/request'

// 查询
export function get_info_by_uid(uid) {
  return request.get('/v1/train/get/' + uid)
}
// getByUid
