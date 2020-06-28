import request from '@/utils/request'
import qs from 'qs'

// 查询菜单树新结构
export function get_menu_tree() {
  return request({
    url: '/v1/menu/tree',
    method:'get'
  })
}
