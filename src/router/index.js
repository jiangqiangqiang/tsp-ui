import Vue from 'vue'
import Router from 'vue-router'
import { Getitem, clearStorage } from '../services/CommonService'
// xy角色路由(v1.3.0版本不存在)
// import xyRoutes from './xy.js'
// 公共部分路由
import publicRoutes from './public.js'
// 代理商部分路由
import agentRoutes from './agent.js'
// 后台部分路由
import adminRoutes from './admin.js'
// 分红奖池部分路由
import bonusRoutes from './bonus.js'
// 资金方部分路由
import fundRoutes from './fund.js'
// 企业方路由
import enterpriseRoutes from './enterprise.js'
// 运营商路由
import operatorsRoutes from './service.js'
// 账户未认证路由
import authenticationRoutes from './authentication.js'
// 垫资方路由
import allocatorRoutes from './allocator.js'

Vue.use(Router)

let routes = []
routes = routes.concat(publicRoutes)
routes = routes.concat(agentRoutes)
routes = routes.concat(adminRoutes)
routes = routes.concat(bonusRoutes)
routes = routes.concat(fundRoutes)
routes = routes.concat(enterpriseRoutes)
routes = routes.concat(operatorsRoutes)
routes = routes.concat(authenticationRoutes)
routes = routes.concat(allocatorRoutes)

let router = new Router({
  routes
})

router.beforeEach((to, from, next) => {
  let token = Getitem('token')
  let userData = JSON.parse(Getitem('userData'))
  if (token) {
    // 登录后没有userData跳回到登录页
    if (!userData) {
      clearStorage()
      next('/login')
      return
    }
    // 登录后没有userRole或者userRole不是正常角色名跳回到登录页
    let userRole = userData.systemRole
    // if (!userRole || ['admin', 'agent', 'bonus', 'fund', 'enterprise'].indexOf(userRole.toLowerCase()) === -1) {
    //   // clearStorage()
    //   next('/authentication')
    //   return
    // }
    if (userRole && userRole !== null) {
      userRole = userRole.toLowerCase()
    }
    // 如果是x或者y用户则合并为xy用户以对应上xy路由meta信息
    // userRole = userRole === 'x' || userRole === 'y' ? 'xy' : userRole
    let perfectState = userData.perfectState
    let indexRouter = '/'
    if (perfectState < 4 && userRole === null) {
      indexRouter = '/authentication'
    } else if (perfectState === '5') {
      // 等待认证
      indexRouter = '/authentication/initialization'
    } else if (perfectState === '6') {
      // 等待认证
      if (to.path === '/') {
        next('/authentication/enterprise-certificate/step3')
      } else {
        next()
      }
      return
    } else {
      switch (userRole) {
        case 'admin':
          indexRouter = '/admin'
          break
        case 'agent':
          indexRouter = '/agent'
          break
        case 'bonus':
          indexRouter = '/bonus'
          break
        case 'fund':
          indexRouter = '/fund'
          break
        case 'enterprise':
          indexRouter = '/enterprise'
          break
        case 'service':
          indexRouter = '/service'
          break
        case 'allocator':
          indexRouter = '/allocator'
          break
        case null:
          break
        default:
          // 如果未找到对应角色则重新登录
          clearStorage()
          next('/login')
          break
      }
    }
    // 登录后输入非登录页面或者'/'的导航到对应用户首页
    if (to.path === '/login' || to.path === '/forgetpass' || to.path === '/') {
      next(indexRouter)
    } else {
      if (to.path === '/register') {
        clearStorage()
        next()
        return
      }
      if (
        userRole !== null &&
        to.meta.user !== 'public' &&
        to.meta.user !== userRole &&
        perfectState > 3 &&
        to.meta.user !== 'authentication'
      ) {
        next({
          path: '/path-lost',
          query: {
            path: indexRouter
          }
        })
      } else {
        next()
      }
      // 判断如果访问的不是该用户的路由则跳转到该用户的首页(以后可能专门有一个提示页面然后再跳转对应首页)
    }
  } else {
    if (
      to.path === '/forgetpass' ||
      to.path === '/login' ||
      to.path === '/register' ||
      to.path === '/out-of-work' ||
      to.path === '/helper'
    ) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
