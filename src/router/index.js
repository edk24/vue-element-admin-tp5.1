import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import Layout from '@/layout'

export const constantRoutes = [{
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
  {
    path: '/admin',
    component: Layout,
    name: '权限管理',
    meta: {
      title: '权限管理',
      tree: 'tree',
      icon: 'user'
    },
    children: [{
        path: 'user',
        name: '管理员管理',
        component: () => import('@/views/admin/index'),
        meta: {
          title: '管理员管理',
          icon: 'tree'
        }
      },
      {
        path: 'index',
        name: '角色管理',
        component: () => import('@/views/admin/role'),
        meta: {
          title: '角色管理',
          icon: 'tree'
        }
      },
      {
        path: 'check',
        name: '菜单管理',
        component: () => import('@/views/admin/audit'),
        meta: {
          title: '菜单管理',
          icon: 'tree'
        }
      },
      // 不展示  一般
      // { path: 'permission', name: '权限管理', component: () => import('@/views/admin/permission'), meta: { title: '权限管理', icon: 'tree' }}
    ]
  },


  // 用户管理  --家长管理--学生管理
  {
    path: '/user',
    component: Layout,
    name: '用户管理',
    meta: {
      title: '用户管理',
      tree: 'tree',
      icon: 'user'
    },
    children: [{
        path: 'parent',
        name: '家长管理',
        component: () => import('@/views/user/parent'),
        meta: {
          title: '家长管理',
          icon: 'tree'
        }
      },
      {
        path: 'child',
        name: '学生管理',
        component: () => import('@/views/user/child'),
        meta: {
          title: '学生管理',
          icon: 'tree'
        }
      },
    ]
  },

  // 分部管理  --合伙人管理--股东管理
  {
    path: '/branch',
    component: Layout,
    name: '分部管理',
    meta: {
      title: '分部管理',
      tree: 'tree',
      icon: 'example'
    },
    children: [{
        path: 'shareholder',
        name: '合伙人管理',
        component: () => import('@/views/branch/shareholder'),
        meta: {
          title: '合伙人管理',
          icon: 'tree'
        }
      },
      {
        path: 'partner',
        name: '股东管理',
        component: () => import('@/views/branch/partner'),
        meta: {
          title: '股东管理',
          icon: 'tree'
        }
      },
    ]
  },

  // 财务管理  --提现--交易记录
  {
    path: '/finance',
    component: Layout,
    name: '财务管理',
    meta: {
      title: '财务管理',
      tree: 'tree',
      icon: 'nested'
    },
    children: [{
        path: 'withdrawal',
        name: '提现管理',
        component: () => import('@/views/finance/withdrawal'),
        meta: {
          title: '提现管理',
          icon: 'tree'
        }
      },
      {
        path: 'record',
        name: '交易记录',
        component: () => import('@/views/finance/record'),
        meta: {
          title: '交易记录',
          icon: 'tree'
        }
      },
    ]
  },

  // 订单管理  --礼品兑换订单--产品订单
  {
    path: '/order',
    component: Layout,
    name: '订单管理',
    meta: {
      title: '订单管理',
      tree: 'tree',
      icon: 'form'
    },
    children: [{
        path: 'exchange',
        name: '礼品兑换订单',
        component: () => import('@/views/order/exchange'),
        meta: {
          title: '礼品兑换订单',
          icon: 'tree'
        }
      },
      {
        path: 'product',
        name: '产品订单',
        component: () => import('@/views/order/product'),
        meta: {
          title: '产品订单',
          icon: 'tree'
        }
      },
    ]
  },

  // 广告管理  --轮播图管理--宣传视频管理--宣传文章管理
  {
    path: '/banner',
    component: Layout,
    name: '广告管理',
    alwaysShow: true,
    meta: {
      title: '广告管理',
      icon: 'table'
    },
    children: [{
        path: 'index',
        name: '轮播图管理',
        component: () => import('@/views/banner/index'),
        meta: {
          title: '轮播图管理',
          icon: 'tree'
        }
      },
      {
        path: 'video',
        name: '宣传视频管理',
        component: () => import('@/views/banner/video'),
        meta: {
          title: '宣传视频管理',
          icon: 'tree'
        }
      },
      {
        path: 'article',
        name: '宣传文章管理',
        component: () => import('@/views/banner/article'),
        meta: {
          title: '宣传文章管理',
          icon: 'tree'
        }
      }
    ]
  },

  // 培训机构管理  --入驻审核--列表--培训课程
  {
    path: '/organization',
    component: Layout,
    name: '培训机构管理',
    alwaysShow: true,
    meta: {
      title: '培训机构管理',
      icon: 'table'
    },
    children: [{
        path: 'permission',
        name: '入驻审核',
        component: () => import('@/views/organization/permission'),
        meta: {
          title: '入驻审核',
          icon: 'tree'
        }
      },
      {
        path: 'index',
        name: '列表',
        component: () => import('@/views/organization/index'),
        meta: {
          title: '列表',
          icon: 'tree'
        }
      },
      {
        path: 'course',
        name: '宣传文章管理',
        component: () => import('@/views/organization/course'),
        meta: {
          title: '宣传文章管理',
          icon: 'tree'
        }
      }
    ]
  },
  // 平台设置  --看视频时间和积分设置--新用户注册赠送积分设置--每日最高积分设置--消费最低积分设置
  {
    path: '/platform',
    component: Layout,
    name: '平台设置',
    alwaysShow: true,
    meta: {
      title: '平台设置',
      icon: 'table'
    },
    children: [{
        path: 'timeAndIntegral',
        name: '看视频时间和积分设置',
        component: () => import('@/views/platform/timeAndIntegral'),
        meta: {
          title: '看视频时间和积分设置',
          icon: 'tree'
        }
      },
      {
        path: 'integral',
        name: '新用户注册送积分',
        component: () => import('@/views/platform/integral'),
        meta: {
          title: '新用户注册送积分',
          icon: 'tree'
        }
      },
      {
        path: 'height',
        name: '每日最高积分设置',
        component: () => import('@/views/platform/height'),
        meta: {
          title: '每日最高积分设置',
          icon: 'tree'
        }
      },
      {
        path: 'lower',
        name: '消费最低积分设置',
        component: () => import('@/views/platform/lower'),
        meta: {
          title: '消费最低积分设置',
          icon: 'tree'
        }
      }
    ]
  },

  {
    path: '/project',
    component: Layout,
    name: '项目管理',
    meta: {
      title: '项目管理',
      tree: 'tree',
      icon: 'component'
    },
    children: [{
        path: 'language',
        name: '开发语言',
        component: () => import('@/views/project/language'),
        meta: {
          title: '开语语言',
          icon: 'tree'
        }
      },
      {
        path: 'system',
        name: '开发终端',
        component: () => import('@/views/project/system'),
        meta: {
          title: '开发终端',
          icon: 'tree'
        }
      },
      {
        path: 'task-type',
        name: '项目类型',
        component: () => import('@/views/project/task-type'),
        meta: {
          title: '项目类型',
          icon: 'tree'
        }
      }
    ]
  },

  {
    path: '/service',
    component: Layout,
    name: '服务商管理',
    meta: {
      title: '服务商管理',
      tree: 'tree',
      icon: 'international'
    },
    children: [{
        path: 'index',
        name: '服务商列表',
        component: () => import('@/views/company/index'),
        meta: {
          title: '服务商列表',
          icon: 'tree'
        }
      },
      {
        path: 'complaint',
        name: '投诉列表',
        component: () => import('@/views/company/tousu'),
        meta: {
          title: '投诉列表',
          icon: 'tree'
        }
      }
    ]
  },

  {
    path: '/system',
    component: Layout,
    name: '系统管理',
    meta: {
      title: '系统管理',
      tree: 'tree',
      icon: 'component'
    },
    children: [{
        path: 'setting',
        name: '系统设置',
        component: () => import('@/views/admin/index'),
        meta: {
          title: '系统设置',
          icon: 'tree'
        }
      },
      {
        path: 'feedback',
        name: '意见反馈',
        component: () => import('@/views/system/feedback'),
        meta: {
          title: '意见反馈',
          icon: 'tree'
        }
      },
      {
        path: 'kefu',
        name: '在线客服',
        component: () => import('@/views/admin/index'),
        meta: {
          title: '在线客服',
          icon: 'tree'
        }
      }
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
    meta: {
      title: '需求管理',
      tree: 'tree',
      icon: 's-order'
    },
    children: [{
        path: 'bidding',
        name: 'bidding',
        component: () => import('@/views/task/bidding'),
        meta: {
          title: '竞标列表',
          icon: 'tree'
        }
      },
      {
        path: 'audit',
        name: 'audit',
        component: () => import('@/views/task/audit'),
        meta: {
          title: '待审核列表',
          icon: 'tree'
        }
      },
      {
        path: 'back',
        name: '退款申请',
        component: () => import('@/views/admin/index'),
        meta: {
          title: '退款申请',
          icon: 'tree'
        }
      }
    ]
  },
  {
    path: '/goods',
    component: Layout,
    name: '商品管理',
    meta: {
      title: '商品管理',
      tree: 'tree',
      icon: 's-order'
    },
    children: [{
      path: 'index',
      name: '商品列表',
      component: () => import('@/views/goods/index'),
      meta: {
        title: '商品列表',
        icon: 'tree'
      }
    }, ]
  },
  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // 重置路由器
}

export default router
