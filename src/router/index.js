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
        path: 'permission',
        name: '菜单管理',
        component: () => import('@/views/admin/permission'),
        meta: {
          title: '菜单管理',
          icon: 'tree'
        }
      }
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
      {
        path: 'bank',
        name: '银行卡',
        component: () => import('@/views/user/bank'),
        meta: {
          title: '银行卡',
          icon: 'tree'
        }
      },
      {
        path: 'bankPermission',
        name: '银行卡审核',
        component: () => import('@/views/user/bankPermission'),
        meta: {
          title: '银行卡审核',
          icon: 'tree'
        }
      }
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
        path: 'partner',
        name: '合伙人管理',
        component: () => import('@/views/branch/partner'),
        meta: {
          title: '合伙人管理',
          icon: 'tree'
        }
      },
      {
        path: 'shareholder',
        name: '股东管理',
        component: () => import('@/views/branch/shareholder'),
        meta: {
          title: '股东管理',
          icon: 'tree'
        }
      }
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
        name: '提现审核',
        component: () => import('@/views/finance/withdrawal'),
        meta: {
          title: '提现审核',
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
      }
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
      }
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
        name: '培训课程',
        component: () => import('@/views/organization/course'),
        meta: {
          title: '培训课程',
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
  // 产品管理  --
  {
    path: '/product',
    component: Layout,
    name: '产品管理',
    alwaysShow: true,
    meta: {
      title: '产品管理',
      icon: 'table'
    },
    children: [
      {
        path: 'integral',
        name: '积分产品',
        component: () => import('@/views/product/integral'),
        meta: {
          title: '积分产品',
          icon: 'tree'
        }
      },
      {
        path: 'general',
        name: '普通产品',
        component: () => import('@/views/product/general'),
        meta: {
          title: '普通产品',
          icon: 'tree'
        }
      }
    ]
  },
  // 反馈管理  --
  {
    path: '/feedback',
    component: Layout,
    name: '用户反馈',
    alwaysShow: true,
    meta: {
      title: '用户反馈',
      icon: 'table'
    },
    children: [{
        path: 'index',
        name: '用户反馈',
        component: () => import('@/views/feedback/index'),
        meta: {
          title: '用户反馈',
          icon: 'tree'
        }
      }
    ]
  },
  // 论坛管理  --
  {
    path: '/forum',
    component: Layout,
    name: '论坛管理',
    alwaysShow: true,
    meta: {
      title: '论坛管理',
      icon: 'table'
    },
    children: [{
        path: 'index',
        name: '论坛列表',
        component: () => import('@/views/forum/index'),
        meta: {
          title: '论坛列表',
          icon: 'tree'
        }
      }
    ]
  },
  {
    path: '/category',
    component: Layout,
    name: '分类管理',
    alwaysShow: true,
    meta: {
      title: '分类管理',
      tree: 'tree',
      icon: 'table'
    },
    children: [{
        path: 'index',
        name: '列表管理',
        component: () => import('@/views/category/index'),
        meta: {
          title: '列表管理',
          icon: 'tree'
        }
      }
    ]
  },

  {
    path: '/chat',
    component: Layout,
    name: '客服管理',
    alwaysShow: true,
    meta: {
      title: '客服管理',
      tree: 'tree',
      icon: 'table'
    },
    children: [{
        path: 'chat',
        name: '聊天管理',
        component: () => import('@/views/chat/chat'),
        meta: {
          title: '聊天管理',
          icon: 'tree'
        }
      }
    ]
  },
  {
    path: '/web',
    component: Layout,
    name: '官网管理',
    meta: {
      title: '官网管理',
      tree: 'tree',
      icon: 'user'
    },
    children: [{
      path: 'web_banner',
      name: '轮播图管理',
      component: () => import('@/views/web/banner'),
      meta: {
        title: '轮播图管理',
        icon: 'tree'
      }
    }, {
      path: 'web_about',
      name: '关于我们',
      component: () => import('@/views/web/about'),
      meta: {
        title: '关于我们',
        icon: 'tree'
      }
    }, {
      path: 'web_category',
      name: '产品分类',
      component: () => import('@/views/web/category'),
      meta: {
        title: '产品分类',
        icon: 'tree'
      }
    }, {
      path: 'web_goods',
      name: '产品管理',
      component: () => import('@/views/web/goods'),
      meta: {
        title: '产品管理',
        icon: 'tree'
      }
    }, {
      path: 'web_news',
      name: '新闻管理',
      component: () => import('@/views/web/news_type'),
      meta: {
        title: '新闻管理',
        icon: 'tree'
      },
      children: [{
        path: 'news_type',
        name: '新闻分类',
        component: () => import('@/views/web/news_type'),
        meta: {
          title: '新闻分类',
          icon: 'tree'
        }
      },{
        path: 'web_newslist',
        name: '新闻列表',
        component: () => import('@/views/web/news'),
        meta: {
          title: '新闻列表',
          icon: 'tree'
        }
      }]
    }]
  },
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
