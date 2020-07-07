/* 账户未认证的路由 */

let authenticationRoutes = [
  {
    path: '/authentication',
    name: 'authenticationIndex',
    component: resolve => { require(['@/pages/account-authentication/home/AuthenticationIndex'], resolve) },
    redirect: '/authentication/home',
    meta: {
      user: 'authentication'
    },
    children: [
      // 首页
      {
        path: '/authentication/home',
        name: 'authenticationHome',
        component: resolve => { require(['@/pages/account-authentication/home/Home'], resolve) },
        meta: {
          user: 'authentication'
        }
      },
      // 个人认证
      {
        path: '/authentication/personal-certificate',
        name: 'PersonalCertificate',
        component: resolve => { require(['@/pages/account-authentication/authentication/PersonalCertificate'], resolve) },
        meta: {
          user: 'authentication'
        }
      },
      // 企业认证
      {
        path: '/authentication/enterprise-certificate',
        name: 'EnterpriseAuthentication',
        component: resolve => {
          require(['@/pages/account-authentication/authentication/enterprise-certification/EnterpriseAuthentication'], resolve)
        },
        meta: {
          user: 'authentication'
        },
        redirect: '/authentication/enterprise-certificate/step3',
        children: [
          {
            path: '/authentication/enterprise-certificate/step1',
            name: 'EnterpriseAuthenticationStep1',
            component: resolve => {
              require(['@/pages/account-authentication/authentication/enterprise-certification/Step1'], resolve)
            },
            meta: {
              user: 'authentication'
            },
            redirect: '/authentication/enterprise-certificate/step3'
          },
          {
            path: '/authentication/enterprise-certificate/step2',
            name: 'EnterpriseAuthenticationStep2',
            component: resolve => {
              require(['@/pages/account-authentication/authentication/enterprise-certification/Step2'], resolve)
            },
            meta: {
              user: 'authentication'
            }
          },
          {
            path: '/authentication/enterprise-certificate/step3',
            name: 'EnterpriseAuthenticationStep3',
            component: resolve => {
              require(['@/pages/account-authentication/authentication/enterprise-certification/Step3'], resolve)
            },
            meta: {
              user: 'authentication'
            }
          },
          {
            path: '/authentication/enterprise-certificate/step4',
            name: 'EnterpriseAuthenticationStep4',
            component: resolve => {
              require(['@/pages/account-authentication/authentication/enterprise-certification/Step4'], resolve)
            },
            meta: {
              user: 'authentication'
            },
            redirect: '/authentication/enterprise-certificate/step3'
          },
          {
            path: '/authentication/enterprise-certificate/step5',
            name: 'EnterpriseAuthenticationStep5',
            component: resolve => {
              require(['@/pages/account-authentication/authentication/enterprise-certification/Step5'], resolve)
            },
            meta: {
              user: 'authentication'
            }
          }
        ]
      },
      // 账号初始化
      {
        path: '/authentication/initialization',
        name: 'Initialization',
        component: resolve => { require(['@/pages/account-authentication/authentication/Initlization'], resolve) },
        meta: {
          user: 'authentication'
        }
      },
      {
        path: '/authentication/finished',
        name: 'Finished',
        component: resolve => { require(['@/pages/account-authentication/authentication/AuditFinished'], resolve) },
        meta: {
          user: 'authentication'
        }
      },
      // 权限管理列表
      {
        path: '/authentication/authority-management',
        name: 'authenticationAuthorityList',
        component: resolve => { require(['@/pages/account-management/authority-management/AuthorityList'], resolve) },
        meta: {
          user: 'authentication'
        }
      },
      // 审核申请列表
      {
        path: '/authentication/authority-apply',
        name: 'authenticationAuthorityApplyList',
        component: resolve => { require(['@/pages/account-management/authority-management/AuthorityApplyList'], resolve) },
        meta: {
          user: 'authentication'
        }
      },
      // 审核申请详情
      {
        path: '/authentication/authority-apply-detail',
        name: 'authenticationAuthorityApplyDetail',
        component: resolve => { require(['@/pages/account-management/authority-management/AuthorityApplyDetail'], resolve) },
        meta: {
          user: 'authentication'
        }
      },
      // 安全中心
      {
        path: '/authentication/change-password',
        name: 'authenticationChangepassword',
        component: resolve => { require([`@/pages/account-management/change-password/ChangePassword`], resolve) },
        meta: {
          user: 'authentication'
        }
      }
    ]
  }
]

export default authenticationRoutes
