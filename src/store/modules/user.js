import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { get_menu_tree } from '@/api/menu'
import Layout from '@/layout'
import { StaticRouterMap } from '@/router/index'

import { resetRouter } from '@/router'
import md5 from 'js-md5'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    init: false, // 是否完成初始化 // 默认未完成
    RouterList: [], // 动态路由
    id: 0
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_TYPE: (state, type) => {
    state.type = type
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  set_router: (state, RouterList) => {
    state.RouterList = RouterList
  },
  set_init: (state, status) => {
    state.init = status
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { phone, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ phone: phone.trim(), password: md5(password) }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data)
        setToken(data)

        // 加载动态菜单
        get_menu_tree().then(response => {
          const { code, data, msg, count } = response
          if (code === 0) {
            const route = []
            route.push({
              path: '/school1',
              component: Layout,
              name: '学校管理1',
              meta: {
                title: '学校管理1',
                tree: 'tre1e',
                icon: 'example'
              },
              children: [{
                path: 'index',
                name: '学校管理',
                component: () => import('@/views/school/index'),
                meta: {
                  title: '学校管理',
                  icon: 'tree'
                }
              }
              ]
            })

            // this.router.
          }
        }).catch(err => { console.log(err) })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          reject('验证失败，请重新登录。')
        }
        const { name, avatar, type, id } = data
        commit('SET_NAME', name)
        commit('SET_TYPE', type)
        commit('SET_ID', id)
        commit('SET_AVATAR', avatar)
        this.commit('chat/wsLogin', id)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 动态设置路由 此为设置设置途径
  setRouterList({ commit }, routerList) {
    commit('set_router', StaticRouterMap.concat(routerList)) // 进行路由拼接并存储
  },
  // 存储颗粒话权限
  setroles({ commit }, roleList) {
    commit('SET_ROLES', roleList)
  },
  // 登出
  LogOut({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('set_router', [])
          removeToken()
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

