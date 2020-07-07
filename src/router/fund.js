let fundRoutes = [
  {
    path: '/fund',
    name: 'fundIndex',
    component: resolve => { require(['@/pages/FUND/home/FundIndex'], resolve) },
    redirect: '/fund/home',
    meta: {
      user: 'fund'
    },
    children: [
      {
        path: '/fund/home',
        name: 'fundHome',
        component: resolve => { require(['@/pages/FUND/home/Home'], resolve) },
        meta: {
          user: 'fund'
        }
      },
      // 联合发令列表
      {
        path: '/fund/joint-token-list',
        name: 'fundJointTokenList',
        component: resolve => { require([`@/pages/joint-token/JointTokenList`], resolve) },
        meta: {
          user: 'fund'
        }
      },
      // 申请联合发令
      {
        path: '/fund/apply-joint-token',
        name: 'fundApplyJointToken',
        component: resolve => { require([`@/pages/FUND/joint-token/ApplyJointToken`], resolve) },
        meta: {
          user: 'fund'
        }
      },
      // 发令成功
      {
        path: '/fund/joint-token-success',
        name: 'fundJointTokenSuccess',
        component: resolve => { require([`@/pages/FUND/joint-token/jointTokenSuccess`], resolve) },
        meta: {
          user: 'fund'
        }
      },
      // 资金方付款成功
      {
        path: '/fund/fund-payment-success',
        name: 'fundFundPaymentSuccess',
        component: resolve => { require([`@/pages/FUND/joint-token/FundPaymentSuccess`], resolve) },
        meta: {
          user: 'fund'
        }
      },
      // 联合发令详情
      {
        path: '/fund/joint-token-info',
        name: 'fundJointTokenInfo',
        component: resolve => {
          require(['@/pages/joint-token/JointTokenInfo'], resolve)
        },
        meta: {
          user: 'fund'
        }
      },
      // 提现列表页面
      {
        path: '/fund/withdraw-list',
        name: 'fundWithdrawList',
        component: resolve => { require([`@/pages/start-withdraw/Withdraw`], resolve) },
        meta: {
          user: 'fund'
        }
      },
      // 提现页面
      {
        path: '/fund/withdraw',
        name: 'fundWithdraw',
        component: resolve => { require([`@/pages/start-withdraw/StartWithdraw`], resolve) },
        meta: {
          user: 'fund'
        }
      },
      // 提现成功页面
      {
        path: '/fund/withdraw-success',
        name: 'fundWithdrawSuccess',
        component: resolve => { require([`@/pages/start-withdraw/WithdrawSuccess`], resolve) },
        meta: {
          user: 'fund'
        }
      },
      // 支付令明细账
      {
        path: '/fund/cash-detail-account',
        name: 'fundCashdetailAccount',
        component: resolve => { require([`@/pages/FUND/itemized-account/CashDetailAccount`], resolve) },
        meta: {
          user: 'fund'
        }
      },
      // 提现详单
      {
        path: '/fund/withdraw-schedule',
        name: 'fundWithdrawSchedule',
        component: resolve => { require([`@/pages/FUND/deal-schedule/WithdrawSchedule`], resolve) },
        meta: {
          user: 'fund'
        }
      },
      // 提现服务费详单
      {
        path: '/fund/withdraw-fee-schedule',
        name: 'fundWithdrawFeeSchedule',
        component: resolve => { require([`@/pages/FUND/deal-schedule/WithdrawFeeSchedule`], resolve) },
        meta: {
          user: 'fund'
        }
      },
      // 操作服务费详单
      {
        path: '/fund/operation-schedule',
        name: 'fundOperationSchedule',
        component: resolve => { require([`@/pages/FUND/deal-schedule/OperationSchedule`], resolve) },
        meta: {
          user: 'fund'
        }
      },
      // 邀请奖励详单
      {
        path: '/fund/invite-reward-schedule',
        name: 'fundInviteRewardSchedule',
        component: resolve => { require([`@/pages/FUND/deal-schedule/InviteRewardSchedule`], resolve) },
        meta: {
          user: 'fund'
        }
      },
      // 流通奖励详单
      {
        path: '/fund/circulation-reward-schedule',
        name: 'fundcirCulationRewardSchedule',
        component: resolve => { require([`@/pages/FUND/deal-schedule/CirculationRewardSchedule`], resolve) },
        meta: {
          user: 'fund'
        }
      },
      // 资金方付款
      {
        path: '/fund/fund-payment-schedule',
        name: 'fundFundPaymentSchedule',
        component: resolve => { require([`@/pages/FUND/deal-schedule/FundPaymentSchedule`], resolve) },
        meta: {
          user: 'fund'
        }
      },
      // 联合发令
      {
        path: '/fund/joint-token-schedule',
        name: 'fundJointTokenSchedule',
        component: resolve => { require([`@/pages/FUND/deal-schedule/JointTokenSchedule`], resolve) },
        meta: {
          user: 'fund'
        }
      },
      // *****************************来往业务管理路由*********************************
      {
        path: '/fund/companies',
        name: 'fundCompanies',
        component: resolve => { require([`@/pages/FUND/companies/Companies`], resolve) },
        meta: {
          user: 'fund'
        }
      },
      // *****************************账户管理路由*********************************
      // 企业信息
      {
        path: '/fund/basic-information',
        name: 'fundBasicinformation',
        component: resolve => { require([`@/pages/account-management/BasicInformation`], resolve) },
        meta: {
          user: 'fund'
        }
      },
      // 权限管理列表
      {
        path: '/fund/authority-management',
        name: 'fundAuthorityList',
        component: resolve => { require(['@/pages/account-management/authority-management/AuthorityList'], resolve) },
        meta: {
          user: 'fund'
        }
      },
      // 审核申请列表
      {
        path: '/fund/authority-apply',
        name: 'fundAuthorityApplyList',
        component: resolve => { require(['@/pages/account-management/authority-management/AuthorityApplyList'], resolve) },
        meta: {
          user: 'fund'
        }
      },
      // 审核申请详情
      {
        path: '/fund/authority-apply-detail',
        name: 'fundAuthorityApplyDetail',
        component: resolve => { require(['@/pages/account-management/authority-management/AuthorityApplyDetail'], resolve) },
        meta: {
          user: 'fund'
        }
      },
      // 安全中心
      {
        path: '/fund/change-password',
        name: 'fundChangepassword',
        component: resolve => { require([`@/pages/account-management/change-password/ChangePassword`], resolve) },
        meta: {
          user: 'fund'
        }
      },
      // 银行列表
      {
        path: '/fund/bank-list',
        name: 'fundBankList',
        component: resolve => { require([`@/pages/account-management/bank-management/BankList`], resolve) },
        meta: {
          user: 'fund'
        }
      },
      // 增加银行
      {
        path: '/fund/add-bank',
        name: 'fundAddBank',
        component: resolve => { require([`@/pages/account-management/bank-management/AddBank`], resolve) },
        meta: {
          user: 'fund'
        }
      },
      // CA管理
      {
        path: '/fund/ca-certificate-manage',
        name: 'fundCAcertificatemanage',
        component: resolve => { require([`@/pages/account-management/CACertificateManage`], resolve) },
        meta: {
          user: 'fund'
        }
      },
      // 平台协议
      {
        path: '/fund/platform-agreement',
        name: 'fundPlatformAgreement',
        component: resolve => { require([`@/pages/account-management/PlatformAgreement`], resolve) },
        meta: {
          user: 'fund'
        }
      },
      // *****************************************消息中心*********************
      // 列表路由
      {
        path: '/fund/message',
        name: 'fundMessage',
        component: resolve => { require([`@/pages/FUND/message/Message`], resolve) },
        meta: {
          user: 'fund'
        }
      },
      // 消息详情
      {
        path: '/fund/message-info',
        name: 'fundMessageInfo',
        component: resolve => { require([`@/pages/FUND/message/MessageInfo`], resolve) },
        meta: {
          user: 'fund'
        }
      },
      // *****************************************管理员业务*********************
      {
        path: '/fund/withdraw-apply-authority',
        name: 'fundWithdrawApplyAuthority',
        component: resolve => { require([`@/pages/start-withdraw/WithdrawApplyAuthority`], resolve) },
        meta: {
          user: 'fund'
        }
      },
      {
        path: '/fund/withdraw-apply-authority/detail',
        name: 'fundWithdrawApplyDetail',
        component: resolve => { require([`@/pages/start-withdraw/WithdrawApplyDetail`], resolve) },
        meta: {
          user: 'fund'
        }
      },
      {
        path: '/fund/withdraw-apply-authority/withdrawSuccess',
        name: 'fundwithdrawSuccess',
        component: resolve => { require([`@/pages/start-withdraw/WithdrawSuccess`], resolve) },
        meta: {
          user: 'fund'
        }
      }
    ]
  }
]
export default fundRoutes
