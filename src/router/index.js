import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import Layout from '@/layout'

export const constantRoutes = [
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
    mate: {
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
      meta: { title: '仪盘表', icon: 'dashboard' }
    }]
  },

  // 多个
  {
    path: '/admin',
    component: Layout,
    name: '用户权限',
    meta: { title: '用户权限', tree: 'tree', icon: 'user' },
    children: [
      { path: 'user', name: '用户管理', component: () => import('@/views/admin/index'), meta: { title: '用户列表', icon: 'tree' }},
      { path: 'index', name: '角色管理', component: () => import('@/views/admin/role'), meta: { title: '角色管理', icon: 'tree' }},
      { path: 'check', name: '资料审核', component: () => import('@/views/admin/audit'), meta: { title: '资料审核', icon: 'tree' }},
      // 不展示  一般
      { path: 'permission', name: '权限管理', component: () => import('@/views/admin/permission'), meta: { title: '权限管理', icon: 'tree' }}
    ]
  },

  {
    path: '/project',
    component: Layout,
    name: '项目管理',
    meta: { title: '项目管理', tree: 'tree', icon: 'component' },
    children: [
      { path: 'language', name: '开发语言', component: () => import('@/views/project/language'), meta: { title: '开语语言', icon: 'tree' }},
      { path: 'system', name: '开发终端', component: () => import('@/views/project/system'), meta: { title: '开发终端', icon: 'tree' }},
      { path: 'task-type', name: '项目类型', component: () => import('@/views/project/task-type'), meta: { title: '项目类型', icon: 'tree' }}
    ]
  },

  {
    path: '/service',
    component: Layout,
    name: '服务商管理',
    meta: { title: '服务商管理', tree: 'tree', icon: 'international' },
    children: [
      { path: 'index', name: '服务商列表', component: () => import('@/views/company/index'), meta: { title: '服务商列表', icon: 'tree' }},
      { path: 'complaint', name: '投诉列表', component: () => import('@/views/company/tousu'), meta: { title: '投诉列表', icon: 'tree' }}
    ]
  },

  {
    path: '/system',
    component: Layout,
    name: '系统管理',
    meta: { title: '系统管理', tree: 'tree', icon: 'component' },
    children: [
      { path: 'setting', name: '系统设置', component: () => import('@/views/admin/index'), meta: { title: '系统设置', icon: 'tree' }},
      { path: 'feedback', name: '意见反馈', component: () => import('@/views/system/feedback'), meta: { title: '意见反馈', icon: 'tree' }},
      { path: 'kefu', name: '在线客服', component: () => import('@/views/admin/index'), meta: { title: '在线客服', icon: 'tree' }}
    ]
  },
  {
    path: '/banner',
    component: Layout,
    name: '轮播图管理',
    alwaysShow: true,
    meta: { title: '轮播图管理', icon: 'component' },
    children: [
      { path: 'index', name: '轮播图列表', component: () => import('@/views/banner/index'), meta: { title: '轮播图列表', icon: 'tree' }}
    ]
  },

  {
    path: '/order',
    component: Layout,
    name: '订单管理',
    meta: { title: '订单管理', tree: 'tree', icon: 's-order' },
    children: [
      { path: 'index', name: '订单列表', component: () => import('@/views/admin/index'), meta: { title: '订单列表', icon: 'tree' }},
      { path: 'complaint', name: '投诉列表', component: () => import('@/views/admin/index'), meta: { title: '投诉列表', icon: 'tree' }},
      { path: 'back', name: '退款申请', component: () => import('@/views/admin/index'), meta: { title: '退款申请', icon: 'tree' }}
    ]
  },

  // {
  //   path: '/tender',
  //   component: Layout,
  //   name: '任务管理',
  //   meta: { title: '任务管理', tree: 'tree', icon: 's-order' },
  //   children: [
  //     { path: 'index', name: '招标任务列表', component: () => import('@/views/tender/index'), meta: { title: '招标任务列表', icon: 'tree' }},
  //     { path: 'back', name: '待审核任务', component: () => import('@/views/tender/index'), meta: { title: '待审核任务', icon: 'tree' }}
  //   ]
  // },

  {
    path: '/task',
    component: Layout,
    name: '需求管理',
    meta: { title: '需求管理', tree: 'tree', icon: 's-order' },
    children: [
      { path: 'bidding', name: 'bidding', component: () => import('@/views/task/bidding'), meta: { title: '竞标列表', icon: 'tree' }},
      { path: 'audit', name: 'audit', component: () => import('@/views/task/audit'), meta: { title: '待审核列表', icon: 'tree' }},
      { path: 'back', name: '退款申请', component: () => import('@/views/admin/index'), meta: { title: '退款申请', icon: 'tree' }}
    ]
  },
  {
    path: '/goods',
    component: Layout,
    name: '商品管理',
    meta: { title: '商品管理', tree: 'tree', icon: 's-order' },
    children: [
      { path: 'index', name: '商品列表', component: () => import('@/views/goods/index'), meta: { title: '商品列表', icon: 'tree' }}
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // 重置路由器
}

export default router
