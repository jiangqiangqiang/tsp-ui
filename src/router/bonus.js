/* 分红账户路由 */

let bonusRoutes = [
  {
    path: '/bonus',
    name: 'bonusIndex',
    component: resolve => { require(['@/pages/BONUS/home/BonusIndex'], resolve) },
    redirect: '/bonus/dashboard',
    meta: {
      user: 'bonus'
    },
    children: [
      // 首页
      {
        path: '/bonus/home',
        name: 'bonusHome',
        component: resolve => { require(['@/pages/BONUS/home/Home'], resolve) },
        meta: {
          user: 'bonus'
        }
      },
      // 仪表盘
      {
        path: '/bonus/dashboard',
        name: 'bonusDashboard',
        component: resolve => { require(['@/pages/BONUS/dashboard/DashBoard'], resolve) },
        meta: {
          user: 'bonus'
        }
      }
    ]
  }
]

export default bonusRoutes
