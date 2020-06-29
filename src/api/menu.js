import request from '@/utils/request'
import qs from 'qs'

// 查询菜单树新结构
export function get_menu_tree() {
  return request({
    url: '/v1/menu/tree',
    method:'get'
  })
}

// 获取我的右侧菜单 TODO
export function get_my_menu() {
  return request({
    url: '/v1/menu/tree',
    method:'get'
  })
}

// 查询菜单列表
export function get_menu_list() {
  return request({
    url: '/v1/menu'
  })
}

// 创建菜单
export function create_menu(data) {
  return request({
    url: '/v1/menu',
    method: 'post',
    headers: {
      'Content-Type':'application/json'
    },
    data
  })
}

// 修改菜单
export function update_menu(id,data) {
  return request({
    url: '/v1/menu/'+id,
    method: 'put',
    headers: {
      'Content-Type':'application/json'
    },
    data
  })
}

// 删除菜单
export function del_menu(id) {
  return request({
    url:'/v1/menu/'+id,
    method:'delete'
  })
}
