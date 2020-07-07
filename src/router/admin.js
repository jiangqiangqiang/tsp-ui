/* 后台相关路由 */

let adminRoutes = [
  {
    path: '/admin',
    name: 'adminIndex',
    component: resolve => { require(['@/pages/ADMIN/home/AdminIndex'], resolve) },
    redirect: '/admin/home',
    meta: {
      user: 'admin'
    },
    children: [
      // 首页
      {
        path: '/admin/home',
        name: 'adminHome',
        component: resolve => { require(['@/pages/ADMIN/home/Home'], resolve) },
        meta: {
          user: 'admin'
        }
      },
      // 仪表盘
      {
        path: '/admin/dashboard',
        name: 'adminDashboard',
        component: resolve => { require(['@/pages/ADMIN/dashboard/DashBoard'], resolve) },
        meta: {
          user: 'admin'
        }
      },
      // 明细账
      {
        path: '/admin/cash-detail-account',
        name: 'adminCashDetailAccount',
        component: resolve => { require(['@/pages/BONUS/home/Home'], resolve) },
        meta: {
          user: 'admin'
        }
      },
      // 平台流水账簿
      {
        path: '/admin/platform-account',
        name: 'adminPlatformAccount',
        component: resolve => { require(['@/pages/ADMIN/platformTool/PlatformAccount'], resolve) },
        meta: {
          user: 'admin'
        }
      },
      // 激励账簿
      {
        path: '/admin/excitation-account',
        name: 'adminExcitationAccount',
        component: resolve => { require(['@/pages/ADMIN/platformTool/ExcitationAccount'], resolve) },
        meta: {
          user: 'admin'
        }
      },
      // 激励账簿
      {
        path: '/admin/cash-account',
        name: 'adminCashAccount',
        component: resolve => { require(['@/pages/ADMIN/admin-management/CashAccount'], resolve) },
        meta: {
          user: 'admin'
        }
      },
      // 三方订单查询
      {
        path: '/admin/search-order',
        name: 'adminSearchOrder',
        component: resolve => { require(['@/pages/ADMIN/platformTool/SearchOrder'], resolve) },
        meta: {
          user: 'admin'
        }
      },
      // 企业信息审核列表
      {
        path: '/admin/enterprise-approve',
        name: 'enterpriseApprove',
        component: resolve => { require(['@/pages/ADMIN/enterprise-approve/EnterpriseApprove'], resolve) },
        meta: {
          user: 'admin'
        }
      },
      // 企业信息审核详情
      {
        path: '/admin/enterprise-approve-detail',
        name: 'enterpriseApproveDetail',
        component: resolve => { require(['@/pages/ADMIN/enterprise-approve/EnterpriseApproveDetail'], resolve) },
        meta: {
          user: 'admin'
        }
      },
      // 邀请记录
      {
        path: '/admin/invite-list',
        name: 'inviteList',
        component: resolve => { require(['@/pages/ADMIN/invite/InviteList'], resolve) },
        meta: {
          user: 'admin'
        }
      },
      // 用户列表
      {
        path: '/admin/user-list',
        name: 'userList',
        component: resolve => { require(['@/pages/ADMIN/user-list/UserList'], resolve) },
        meta: {
          user: 'admin'
        }
      },
      // 代理商列表
      {
        path: '/admin/agent-list',
        name: 'adminAgentList',
        component: resolve => { require(['@/pages/ADMIN/agent-management/AgentList'], resolve) },
        meta: {
          user: 'admin'
        }
      },
      // 代理商详情
      {
        path: '/admin/agent-detail',
        name: 'agentDetail',
        component: resolve => { require(['@/pages/ADMIN/agent-management/AgentDetail'], resolve) },
        meta: {
          user: 'admin'
        }
      },
      // 代理商交易情况分析
      {
        path: 'admin/agent-transaction',
        name: 'agentTransaction',
        component: resolve => { require(['@/pages/ADMIN/agent-management/AgentTransaction'], resolve) },
        meta: {
          user: 'admin'
        }
      },
      // 服务商管理
      {
        path: '/admin/service-client-management',
        name: 'serviceClientManagement',
        component: resolve => { require(['@/pages/ADMIN/service-management/ServiceClientManagement'], resolve) },
        meta: {
          user: 'admin'
        }
      },
      // 服务商详情
      {
        path: '/admin/service-client-detail',
        name: 'serviceDetail',
        component: resolve => { require(['@/pages/ADMIN/service-management/ServiceClientDetail'], resolve) },
        meta: {
          user: 'admin'
        }
      },
      // 服务商交易情况分析
      {
        path: 'admin/service-transaction',
        name: 'serviceTransaction',
        component: resolve => { require(['@/pages/ADMIN/service-management/ServiceTransaction'], resolve) },
        meta: {
          user: 'admin'
        }
      },
      // 企业客户管理
      {
        path: '/admin/enterprise-client-management',
        name: 'enterpriseClientManagement',
        component: resolve => { require(['@/pages/ADMIN/enterprise-management/EnterpriseClientManagement'], resolve) },
        meta: {
          user: 'admin'
        }
      },
      // 企业详情
      {
        path: '/admin/enterprise-client-detail',
        name: 'enterpriseDetail',
        component: resolve => { require(['@/pages/ADMIN/enterprise-management/EnterpriseClientDetail'], resolve) },
        meta: {
          user: 'admin'
        }
      },
      // 企业方交易情况分析
      {
        path: 'admin/enterprise-transaction',
        name: 'enterpriseTransaction',
        component: resolve => { require(['@/pages/ADMIN/enterprise-management/EnterpriseTransaction'], resolve) },
        meta: {
          user: 'admin'
        }
      },
      // 权限管理列表
      {
        path: '/admin/authority-management',
        name: 'adminAuthorityList',
        component: resolve => { require(['@/pages/account-management/authority-management/AuthorityList'], resolve) },
        meta: {
          user: 'admin'
        }
      },
      // 审核申请列表
      {
        path: '/admin/authority-apply',
        name: 'adminAuthorityApplyList',
        component: resolve => { require(['@/pages/account-management/authority-management/AuthorityApplyList'], resolve) },
        meta: {
          user: 'admin'
        }
      },
      // 审核申请详情
      {
        path: '/admin/authority-apply-detail',
        name: 'adminAuthorityApplyDetail',
        component: resolve => { require(['@/pages/account-management/authority-management/AuthorityApplyDetail'], resolve) },
        meta: {
          user: 'admin'
        }
      },
      // 安全中心
      {
        path: '/admin/change-password',
        name: 'adminChangepassword',
        component: resolve => { require([`@/pages/account-management/change-password/ChangePassword`], resolve) },
        meta: {
          user: 'admin'
        }
      },
      // 银行列表
      {
        path: '/admin/bank-list',
        name: 'adminBankList',
        component: resolve => { require([`@/pages/account-management/bank-management/BankList`], resolve) },
        meta: {
          user: 'admin'
        }
      },
      // 增加银行
      {
        path: '/admin/add-bank',
        name: 'adminAddBank',
        component: resolve => { require([`@/pages/account-management/bank-management/AddBank`], resolve) },
        meta: {
          user: 'admin'
        }
      },
      // 参数设置
      {
        path: '/admin/parameter-setting',
        name: 'parameterSetting',
        component: resolve => { require(['@/pages/ADMIN/parameter-setting/ParameterSetting'], resolve) },
        meta: {
          user: 'admin'
        }
      },
      // 参数记录
      {
        path: '/admin/parameter-record',
        name: 'parameterRecord',
        component: resolve => { require(['@/pages/ADMIN/parameter-setting/ParameterRecord'], resolve) },
        meta: {
          user: 'admin'
        }
      },
      // CA证书服务监控
      {
        path: '/admin/ca-service-monitoring',
        name: 'CAServiceMonitoringA',
        component: resolve => { require(['@/pages/ADMIN/ca-service-monitoring/CAServiceMonitoring'], resolve) },
        meta: {
          user: 'admin'
        }
      },
      // 查询验证码
      {
        path: '/admin/searchCode',
        name: 'SearchCode',
        component: resolve => { require(['@/pages/ADMIN/search-code/SearchCode'], resolve) },
        meta: {
          user: 'admin'
        }
      },
      // 消息中心
      {
        path: '/admin/message',
        name: 'message',
        component: resolve => { require(['@/pages/ADMIN/message/Message'], resolve) },
        meta: {
          user: 'admin'
        }
      },
      // 消息中心详情
      {
        path: '/admin/message-info',
        name: 'messageDetail',
        component: resolve => { require(['@/pages/ADMIN/message/MessageDetail'], resolve) },
        meta: {
          user: 'admin'
        }
      },
      // ************** 提现 ****************
      {
        path: '/admin/withdraw-list',
        name: 'adminWithdrawList',
        component: resolve => { require(['@/pages/start-withdraw/Withdraw'], resolve) },
        meta: {
          user: 'admin'
        }
      },
      {
        path: '/admin/withdraw',
        name: 'adminWithdraw',
        component: resolve => { require(['@/pages/start-withdraw/StartWithdraw'], resolve) },
        meta: {
          user: 'admin'
        }
      },
      // 提现详情
      {
        path: '/admin/withdraw-detail',
        name: 'adminWithdrawDetail',
        component: resolve => { require([`@/pages/start-withdraw/WithdrawDeal`], resolve) },
        meta: {
          user: 'admin'
        }
      },
      // 提现成功页面
      {
        path: '/admin/withdraw-success',
        name: 'adminWithdrawSuccess',
        component: resolve => { require([`@/pages/start-withdraw/WithdrawSuccess`], resolve) },
        meta: {
          user: 'admin'
        }
      },
      /* **************************账簿详单************************** */
      // 分润详单
      {
        path: '/admin/operation-schedule',
        name: 'adminOperationSchedule',
        component: resolve => { require([`@/pages/ADMIN/admin-management/RewardSchedule`], resolve) },
        meta: {
          user: 'admin'
        }
      },
      // 提现详单
      {
        path: '/admin/withdraw-schedule',
        name: 'adminWithdrawSchedule',
        component: resolve => { require([`@/pages/ADMIN/admin-management/FeeSchedule`], resolve) },
        meta: {
          user: 'admin'
        }
      },
      // 提现服务费详单
      {
        path: '/admin/fee-schedule',
        name: 'adminWithdrawFeeSchedule',
        component: resolve => { require([`@/pages/ADMIN/admin-management/FeeSchedule`], resolve) },
        meta: {
          user: 'admin'
        }
      },
      /* **************************管理员业务************************** */
      {
        path: '/admin/withdraw-apply-authority',
        name: 'adminWithdrawApplyAuthority',
        component: resolve => { require([`@/pages/start-withdraw/WithdrawApplyAuthority`], resolve) },
        meta: {
          user: 'admin'
        }
      },
      {
        path: '/admin/withdraw-apply-authority/detail',
        name: 'adminWithdrawApplyDetail',
        component: resolve => { require([`@/pages/start-withdraw/WithdrawApplyDetail`], resolve) },
        meta: {
          user: 'admin'
        }
      },
      {
        path: '/admin/withdraw-apply-authority/withdrawSuccess',
        name: 'adminwithdrawSuccess',
        component: resolve => { require([`@/pages/start-withdraw/WithdrawSuccess`], resolve) },
        meta: {
          user: 'admin'
        }
      }
    ]
  }
]

export default adminRoutes
