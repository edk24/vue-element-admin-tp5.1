
import request from '@/utils/request'
import qs from 'qs'

// 图片上传
export function uploadImage(data) {
  return request({
    url: 'v1/uploads/all',
    method: 'post',
    data
    })
}
