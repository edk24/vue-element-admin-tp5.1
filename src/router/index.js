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
      path: 'index',
      name: '管理员管理',
      component: () => import('@/views/admin/index'),
      meta: {
        title: '管理员管理',
        icon: 'tree'
      }
    },
      {
        path: 'role',
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
  }

  // {
  //   path: '*',
  //   redirect: '/404',
  //   hidden: true
  // }
]

const defaultMap = [
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
      name: '用户列表',
      component: () => import('@/views/user/index'),
      meta: {
        title: '用户列表',
        icon: 'tree'
      }
    },
      {
        path: 'audit',
        name: '待审核用户',
        component: () => import('@/views/user/audit'),
        meta: {
          title: '待审核用户',
          icon: 'tree'
        }
      },
      // {
      //   path: 'bankPermission',
      //   name: '银行卡审核',
      //   component: () => import('@/views/user/bankPermission'),
      //   meta: {
      //     title: '银行卡审核',
      //     icon: 'tree'
      //   }
      // },
      {
        path: 'bank',
        name: '银行卡列表',
        component: () => import('@/views/user/bank'),
        meta: {
          title: '银行卡列表',
          icon: 'tree'
        }
      },
      {
        path: 'feedback',
        name: '意见反馈',
        component: () => import('@/views/user/feedback'),
        meta: {
          title: '意见反馈',
          icon: 'tree'
        }
      }
    ]
  },
  {
    path: '/school',
    component: Layout,
    name: '学校管理',
    meta: {
      title: '学校管理',
      tree: 'tree',
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
    children: [
      {
        path: 'partner',
        name: '合伙人管理',
        component: () => import('@/views/branch/partner'),
        meta: {
          title: '合伙人管理',
          icon: 'tree'
        }
      },
      {
        path: 'manager',
        name: '市场经理',
        component: () => import('@/views/branch/manager'),
        meta: {
          title: '市场经理',
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
      name: '积分订单',
      component: () => import('@/views/order/exchange'),
      meta: {
        title: '积分订单',
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
        name: '机构管理',
        component: () => import('@/views/organization/index'),
        meta: {
          title: '机构管理',
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
  // 学习课程
  {
    path: '/learn',
    component: Layout,
    name: '学习课程',
    alwaysShow: true,
    meta: {
      title: '学习课程',
      icon: 'table'
    },
    children: [{
      path: 'kid',
      name: '学生课程',
      component: () => import('@/views/learn/kid'),
      meta: {
        title: '学生课程',
        icon: 'tree'
      }
    },
      {
        path: 'parent',
        name: '家长课程',
        component: () => import('@/views/learn/parent'),
        meta: {
          title: '家长课程',
          icon: 'tree'
        }
      }
    ]
  },

  {
    path: '/configs',
    component: Layout,
    name: '系统设置',

    children: [{
      path: 'index',
      name: '系统设置',
      component: () => import('@/views/configs/index'),
      meta: {
        title: '系统设置',
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
  {
    path: '/coupon',
    component: Layout,
    name: '优惠券管理',
    alwaysShow: true,
    meta: {
      title: '优惠券管理',
      icon: 'table'
    },
    children: [
      {
        path: 'index',
        name: '培训机构优惠券',
        component: () => import('@/views/coupon/index'),
        meta: {
          title: '培训机构优惠券',
          icon: 'tree'
        }
      }
    ]
  },

  // 反馈管理  --
  // {
  //   path: '/feedback',
  //   component: Layout,
  //   name: '用户反馈',
  //   alwaysShow: true,
  //   meta: {
  //     title: '用户反馈',
  //     icon: 'table'
  //   },
  //   children: [{
  //       path: 'index',
  //       name: '意见反馈',
  //       component: () => import('@/views/feedback/index'),
  //       meta: {
  //         title: '意见反馈',
  //         icon: 'tree'
  //       }
  //     }
  //   ]
  // },
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
    path: '/message',
    component: Layout,
    name: '消息管理',
    alwaysShow: true,
    meta: {
      title: '消息管理',
      tree: 'tree',
      icon: 'table'
    },
    children: [{
      path: 'systemMessage',
      name: '系统消息',
      component: () => import('@/views/message/systemMessage'),
      meta: {
        title: '系统消息',
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
      name: '平台设置',
      component: () => import('@/views/web/about'),
      meta: {
        title: '平台设置',
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
      path: 'web_news_type',
      name: '新闻分类',
      component: () => import('@/views/web/news_type'),
      meta: {
        title: '新闻分类',
        icon: 'tree'
      }
    }, {
      path: 'web_news_list',
      name: '新闻列表',
      component: () => import('@/views/web/news'),
      meta: {
        title: '新闻列表',
        icon: 'tree'
      }
    }, {
      path: 'web_shop',
      name: '留言管理',
      component: () => import('@/views/web/shop'),
      meta: {
        title: '留言管理',
        icon: 'tree'
      }
    }, {
      path: 'web_case',
      name: '案例管理',
      component: () => import('@/views/web/case'),
      meta: {
        title: '案例管理',
        icon: 'tree'
      }
    }]
  }
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
