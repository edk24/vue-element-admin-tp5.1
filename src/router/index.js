import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

export const StaticRouterMap = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
    meta: {
      title: '登录系统'
    }
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true,
    meta: {
      title: '找不到页面'
    }
  },

  {
    path: '/',
    component: Layout,
    children: [{
      path: 'dashboard',
      name: '仪盘表',
      component: () => import('@/views/dashboard/index'),
      meta: {
        title: '仪盘表',
        icon: 'dashboard'
      }
    }]
  },

  // 多个
  // {
  //   path: '/admin',
  //   component: Layout,
  //   name: '权限管理',

  //   meta: {
  //     title: '权限管理',
  //     tree: 'tree',
  //     icon: 'user'
  //   },
  //   children: [{
  //     path: 'user',
  //     name: '管理员管理',
  //     component: () => import('@/views/admin/index'),
  //     meta: {
  //       title: '管理员管理',
  //       icon: 'tree'
  //     }
  //   },
  //     {
  //       path: 'index',
  //       name: '角色管理',
  //       component: () => import('@/views/admin/role'),
  //       meta: {
  //         title: '角色管理',
  //         icon: 'tree'
  //       }
  //     },
  //     {
  //       path: 'permission',
  //       name: '菜单管理',
  //       component: () => import('@/views/admin/permission'),
  //       meta: {
  //         title: '菜单管理',
  //         icon: 'tree'
  //       }
  //     }
  //     // 不展示  一般
  //     // { path: 'permission', name: '权限管理', component: () => import('@/views/admin/permission'), meta: { title: '权限管理', icon: 'tree' }}
  //   ]
  // }

  // {
  //   path: '*',
  //   redirect: '/404',
  //   hidden: true
  // }
]


// 合并固定路由
// StaticRouterMap.concat(defaultMap)

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: StaticRouterMap
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // 重置路由器
}

export default router
