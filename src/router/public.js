/* 公共部分路由 */
import Login from '@/pages/login/Login'
let publicRoutes = [
  /* ****************************************登录路由**************************************** */
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  // 忘记密码
  {
    path: '/forgetpass',
    name: 'forgetpass',
    component: resolve => { require([`@/pages/login/ForgetPass`], resolve) }
  },
  // 注册
  {
    path: '/register',
    name: 'register',
    component: resolve => { require([`@/pages/login/Register`], resolve) }
  },
  // 帮助中心
  {
    path: '/helper',
    name: 'helper',
    component: resolve => { require([`@/pages/help/Home`], resolve) },
    meta: {
      user: 'public'
    }
  },
  // 管理员初始化
  {
    path: '/admin-info',
    name: 'admininfo',
    component: resolve => { require([`@/pages/initialize/AdminInfo`], resolve) },
    meta: {
      user: 'public'
    }
  },
  // 企业信息初始化
  {
    path: '/enterprise-info',
    name: 'enterpriseinfo',
    component: resolve => { require([`@/pages/initialize/EnterpriseInfo`], resolve) },
    meta: {
      user: 'public'
    }
  },
  // 账号初始化
  {
    path: '/account-num',
    name: 'accountnum',
    component: resolve => { require([`@/pages/initialize/AccountNum`], resolve) },
    meta: {
      user: 'public'
    }
  },
  // 初始化完成
  {
    path: '/initialize-finish',
    name: 'initializefinish',
    component: resolve => { require([`@/pages/initialize/InitializeFinish`], resolve) },
    meta: {
      user: 'public'
    }
  },
  // 404页面
  {
    path: '/path-lost',
    name: 'pathLost',
    component: resolve => { require([`@/pages/path-lost/PathLost`], resolve) },
    meta: {
      user: 'public'
    }
  },
  // 链接失效页面
  {
    path: '/out-of-work',
    name: 'outOfWork',
    component: resolve => { require([`@/pages/path-lost/OutOfWork`], resolve) },
    meta: {
      user: 'public'
    }
  }
]

export default publicRoutes
