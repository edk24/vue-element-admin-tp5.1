import { asyncRoutes, constantRoutes } from '@/router'
import { getAuthMenu } from '@/api/user'
import { getToken } from '@/utils/auth'

import Layout from '@/layout'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 后台查询的菜单数据拼装成路由格式的数据
 * @param routes
 */
export function generaMenu(routes, data) {
  data.forEach(item => {
    // var i = JSON.stringify(item)
    // console.log('item:' + i)

    // alert(JSON.stringify(item))
    const menu = {
      path: item.url === '#' ? item.id + '_key' : item.id + item.url,
      component: item.url === '#' ? Layout : () => import(`@/views${item.url}`),
      // component: import(`@/views${item.component}`),
      // hidden: item.hidden,
      redirect: item.id,
      children: [],
      name: 'menu_' + item.id,
      // meta: item.name
      meta: { title: item.name, id: item.id, roles: item.roles }
    }

    if (item.son) {
      generaMenu(menu.children, item.son)
    }
    routes.push(menu)
  })
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}

const state = {
  routes: [],
  addRoutes: [],
  token: getToken()
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      // let accessedRoutes
      // if (roles.includes('admin')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }
      // commit('SET_ROUTES', accessedRoutes)
      // resolve(accessedRoutes)

      const loadMenuData = []
      // 先查询后台并返回左侧菜单数据并把数据添加到路由
      getAuthMenu().then(response => {
        let data = response
        if (response.code !== 0) {
          alert(JSON.stringify('菜单数据加载异常'))
          // throw new Error('菜单数据加载异常')
        } else {
          data = response.data
          Object.assign(loadMenuData, data)
          const tempAsyncRoutes = Object.assign([], asyncRoutes)
          // tempAsyncRoutes = asyncRoutes
          generaMenu(tempAsyncRoutes, loadMenuData)
          let accessedRoutes
          if (roles.includes('admin')) {
            // alert(JSON.stringify(asyncRoutes))
            accessedRoutes = tempAsyncRoutes || []
          } else {
            accessedRoutes = filterAsyncRoutes(tempAsyncRoutes, roles)
          }
          commit('SET_ROUTES', accessedRoutes)
          resolve(accessedRoutes)
        }
        // generaMenu(asyncRoutes, data)
      }).catch(error => {
        console.log(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
