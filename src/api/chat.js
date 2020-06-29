import request from '@/utils/request'
import qs from 'qs'

// 获取用户信息
export function getUserInfo(id) {
  return request({
    url: '/v1/user/get/' + id,
    method: 'get'
  })
}

// 上传聊天文件
export function fileUpload(data) {
  return request({
    url: '/v1/chat/index/',
    method: 'post',
    data
  })
}
