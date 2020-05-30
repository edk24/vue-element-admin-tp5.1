import request from '@/utils/request'
import upload from '@/utils/upload'
import qs from 'qs'

// 操作系统api
const goods = {
  // 查询列表
  getList: function(page, limit) {
    return request({
      url: '/goods/list?' + qs.stringify({ page, limit }),
      method: 'get'
    })
  },
  // 添加
  add: function(data) {
    return upload({
      url: '/terminal/add',
      data
    })
  },
  // 修改
  save: function(data) {
    return upload({
      url: '/terminal/edit',
      data
    })
  },
  // 删除
  delete: function(id) {
    const data = qs.stringify({ id: id })
    return request({
      url: '/terminal/del?' + data
    })
  },
  // 开发语言列表
  language_list: function(page, limit) {
    return request({
      url: '/language/list',
      method: 'get',
      params: { page, limit }
    })
  },
  // 开发语言编辑
  language_edit: function(d) {
    const data = qs.stringify(d)
    return request({
      url: '/language/edit',
      method: 'post',
      data
    })
  },
  // 开发语言添加
  language_add: function(d) {
    const data = qs.stringify(d)
    return request({
      url: '/language/add',
      method: 'post',
      data: data
    })
  },
  // 开发语言删除
  language_del: function(d) {
    return request({
      url: '/language/del',
      method: 'get',
      params: d
    })
  },
  // 项目类型列表
  Task_type_list: function(page, limit) {
    return request({
      url: '/type/list',
      method: 'get',
      params: { page, limit }
    })
  },
  // 项目类型编辑
  Task_type_edit: function(data) {
    // const data = qs.stringify(d)
    return upload({
      url: '/type/edit',
      // method: 'post',
      data
    })
  },
  // 项目类型添加
  Task_type_add: function(data) {
    return upload({
      url: '/type/add',
      data
    })
  },
  // 项目类型删除
  Task_type_del: function(data) {
    return request({
      url: '/type/del',
      method: 'get',
      params: data
    })
  }
}

// 公开api
module.exports = {
  goods: goods
}
