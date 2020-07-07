/* 后台相关路由 */

let serviceRoutes = [
  {
    path: '/service',
    name: 'serviceIndex',
    component: resolve => { require(['@/pages/SERVICE/home/OPERATORSIndex'], resolve) },
    redirect: '/service/home',
    meta: {
      user: 'service'
    },
    children: [
      // 首页
      {
        path: '/service/home',
        name: 'serviceHome',
        component: resolve => { require(['@/pages/SERVICE/home/Home'], resolve) },
        meta: {
          user: 'service'
        }
      },
      // 仪表盘
      {
        path: '/service/dashboard',
        name: 'serviceDashboard',
        component: resolve => { require(['@/pages/SERVICE/dashboard/DashBoard'], resolve) },
        meta: {
          user: 'service'
        }
      },
      // 支付令明细账
      {
        path: '/service/cash-detail-account',
        name: 'serviceCashdetailAccount',
        component: resolve => { require([`@/pages/SERVICE/itemized-account/CashDetailAccount`], resolve) },
        meta: {
          user: 'service'
        }
      },
      // 提现详情
      {
        path: '/service/withdraw-detail',
        name: 'serviceWithdrawDetail',
        component: resolve => { require([`@/pages/start-withdraw/WithdrawDeal`], resolve) },
        meta: {
          user: 'service'
        }
      },
      // 提现详单
      {
        path: '/service/withdraw-schedule',
        name: 'serviceWithdrawSchedule',
        component: resolve => { require([`@/pages/SERVICE/itemized-account/WithdrawSchedule`], resolve) },
        meta: {
          user: 'service'
        }
      },
      // 提现服务费详单
      {
        path: '/service/withdraw-fee-schedule',
        name: 'serviceWithdrawFeeSchedule',
        component: resolve => { require([`@/pages/SERVICE/itemized-account/WithdrawFeeSchedule`], resolve) },
        meta: {
          user: 'service'
        }
      },
      // 服务商分润
      {
        path: '/service/service-reward',
        name: 'serviceRewardSchedule',
        component: resolve => { require([`@/pages/SERVICE/itemized-account/ServiceRewarSchedule`], resolve) },
        meta: {
          user: 'service'
        }
      },
      // 代理商分润
      {
        path: '/service/agent-reward',
        name: 'serviceARewardSchedule',
        component: resolve => { require([`@/pages/SERVICE/itemized-account/AgentRewarSchedule`], resolve) },
        meta: {
          user: 'service'
        }
      },
      // 企业信息审核列表
      {
        path: '/service/enterprise-approve',
        name: 'enterpriseApproveO',
        component: resolve => { require(['@/pages/SERVICE/enterprise-approve/EnterpriseApprove'], resolve) },
        meta: {
          user: 'service'
        }
      },
      // 企业信息审核详情
      {
        path: '/service/enterprise-approve-detail',
        name: 'enterpriseApproveDetailO',
        component: resolve => { require(['@/pages/SERVICE/enterprise-approve/EnterpriseApproveDetail'], resolve) },
        meta: {
          user: 'service'
        }
      },
      // 代理商列表
      {
        path: '/service/agent-list',
        name: 'agentListO',
        component: resolve => { require(['@/pages/SERVICE/agent-management/AgentList'], resolve) },
        meta: {
          user: 'service'
        }
      },
      // 代理商列表
      {
        path: '/service/agent-enp-list',
        name: 'agentEnpList',
        component: resolve => { require(['@/pages/SERVICE/agent-management/AgentEnpList'], resolve) },
        meta: {
          user: 'service'
        }
      },
      // 代理商详情
      {
        path: '/service/agent-detail',
        name: 'agentDetailO',
        component: resolve => { require(['@/pages/SERVICE/agent-management/AgentDetail'], resolve) },
        meta: {
          user: 'service'
        }
      },
      // 代理商交易情况分析
      {
        path: 'service/agent-transaction',
        name: 'agentTransactionO',
        component: resolve => { require(['@/pages/SERVICE/agent-management/AgentTransaction'], resolve) },
        meta: {
          user: 'service'
        }
      },
      // 资金方管理
      {
        path: '/service/fund-client-management',
        name: 'fundClientManagementO',
        component: resolve => { require(['@/pages/SERVICE/fund-management/FundClientManagement'], resolve) },
        meta: {
          user: 'service'
        }
      },
      // 资金方详情
      {
        path: '/service/fund-client-detail',
        name: 'fundDetailO',
        component: resolve => { require(['@/pages/SERVICE/fund-management/FundClientDetail'], resolve) },
        meta: {
          user: 'service'
        }
      },
      // 资金方交易情况分析
      {
        path: 'service/fund-transaction',
        name: 'fundTransactionO',
        component: resolve => { require(['@/pages/SERVICE/fund-management/FundTransaction'], resolve) },
        meta: {
          user: 'service'
        }
      },
      // 企业客户管理
      {
        path: '/service/enterprise-client-management',
        name: 'enterpriseClientManagementO',
        component: resolve => { require(['@/pages/SERVICE/enterprise-management/EnterpriseClientManagement'], resolve) },
        meta: {
          user: 'service'
        }
      },
      // 企业详情
      {
        path: '/service/enterprise-client-detail',
        name: 'enterpriseDetailO',
        component: resolve => { require(['@/pages/SERVICE/enterprise-management/EnterpriseClientDetail'], resolve) },
        meta: {
          user: 'service'
        }
      },
      // 邀请记录
      {
        path: '/service/invite-list',
        name: 'serviceInviteList',
        component: resolve => { require(['@/pages/SERVICE/invite/InviteList'], resolve) },
        meta: {
          user: 'service'
        }
      },
      // 企业方交易情况分析
      {
        path: 'service/enterprise-transaction',
        name: 'enterpriseTransactionO',
        component: resolve => { require(['@/pages/SERVICE/enterprise-management/EnterpriseTransaction'], resolve) },
        meta: {
          user: 'service'
        }
      },
      // 账户认证
      {
        path: '/service/basic-information',
        name: 'serviceBasicinformation',
        component: resolve => { require([`@/pages/account-management/BasicInformation`], resolve) },
        meta: {
          user: 'service'
        }
      },
      // 权限管理列表
      {
        path: '/service/authority-management',
        name: 'serviceAuthorityList',
        component: resolve => { require(['@/pages/account-management/authority-management/AuthorityList'], resolve) },
        meta: {
          user: 'service'
        }
      },
      // 审核申请列表
      {
        path: '/service/authority-apply',
        name: 'serviceAuthorityApplyList',
        component: resolve => { require(['@/pages/account-management/authority-management/AuthorityApplyList'], resolve) },
        meta: {
          user: 'service'
        }
      },
      // 审核申请详情
      {
        path: '/service/authority-apply-detail',
        name: 'serviceAuthorityApplyDetail',
        component: resolve => { require(['@/pages/account-management/authority-management/AuthorityApplyDetail'], resolve) },
        meta: {
          user: 'service'
        }
      },
      // 安全中心
      {
        path: '/service/change-password',
        name: 'serviceChangepassword',
        component: resolve => { require([`@/pages/account-management/change-password/ChangePassword`], resolve) },
        meta: {
          user: 'service'
        }
      },
      // 银行列表
      {
        path: '/service/bank-list',
        name: 'serviceBankList',
        component: resolve => { require([`@/pages/account-management/bank-management/BankList`], resolve) },
        meta: {
          user: 'service'
        }
      },
      // 增加银行
      {
        path: '/service/add-bank',
        name: 'serviceAddBank',
        component: resolve => { require([`@/pages/account-management/bank-management/AddBank`], resolve) },
        meta: {
          user: 'service'
        }
      },
      // CA管理
      {
        path: '/service/ca-certificate-manage',
        name: 'serviceCAcertificatemanage',
        component: resolve => { require([`@/pages/account-management/CACertificateManage`], resolve) },
        meta: {
          user: 'service'
        }
      },
      // 参数设置
      {
        path: '/service/parameter-setting',
        name: 'parameterSettingO',
        component: resolve => { require(['@/pages/SERVICE/parameter-setting/ParameterSetting'], resolve) },
        meta: {
          user: 'service'
        }
      },
      // CA证书管理
      {
        path: '/service/ca-certificate-management',
        name: 'CACertificateManagementO',
        component: resolve => { require(['@/pages/SERVICE/ca-certificate-management/CACertificateManagement'], resolve) },
        meta: {
          user: 'service'
        }
      },
      // CA证书服务监控
      {
        path: '/service/ca-service-monitoring',
        name: 'CAServiceMonitoringO',
        component: resolve => { require(['@/pages/SERVICE/ca-service-monitoring/CAServiceMonitoring'], resolve) },
        meta: {
          user: 'service'
        }
      },
      // 消息中心
      {
        path: '/service/message',
        name: 'messageO',
        component: resolve => { require(['@/pages/SERVICE/message/Message'], resolve) },
        meta: {
          user: 'service'
        }
      },
      // 消息中心详情
      {
        path: '/service/message-info',
        name: 'messageDetailO',
        component: resolve => { require(['@/pages/SERVICE/message/MessageDetail'], resolve) },
        meta: {
          user: 'service'
        }
      },
      // ************** 提现 ****************
      {
        path: '/service/withdraw-list',
        name: 'serviceWithdrawList',
        component: resolve => { require(['@/pages/start-withdraw/Withdraw'], resolve) },
        meta: {
          user: 'service'
        }
      },
      {
        path: '/service/withdraw',
        name: 'serviceWithdraw',
        component: resolve => { require(['@/pages/start-withdraw/StartWithdraw'], resolve) },
        meta: {
          user: 'service'
        }
      },
      /* **************************管理员业务************************** */
      {
        path: '/service/withdraw-apply-authority',
        name: 'serviceWithdrawApplyAuthority',
        component: resolve => { require([`@/pages/start-withdraw/WithdrawApplyAuthority`], resolve) },
        meta: {
          user: 'service'
        }
      },
      {
        path: '/service/withdraw-apply-authority/detail',
        name: 'serviceWithdrawApplyDetail',
        component: resolve => { require([`@/pages/start-withdraw/WithdrawApplyDetail`], resolve) },
        meta: {
          user: 'service'
        }
      },
      {
        path: '/service/withdraw-apply-authority/withdrawSuccess',
        name: 'servicewithdrawSuccess',
        component: resolve => { require([`@/pages/start-withdraw/WithdrawSuccess`], resolve) },
        meta: {
          user: 'service'
        }
      }
    ]
  }
]

export default serviceRoutes
