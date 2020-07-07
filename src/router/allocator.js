let allocatorRoutes = [
  {
    path: '/allocator',
    name: 'allocatorIndex',
    component: resolve => { require(['@/pages/ALLOCATOR/home/AllocatorIndex'], resolve) },
    redirect: '/allocator/home',
    meta: {
      user: 'allocator'
    },
    children: [
      {
        path: '/allocator/home',
        name: 'allocatorHome',
        component: resolve => { require(['@/pages/ALLOCATOR/home/Home'], resolve) },
        meta: {
          user: 'allocator'
        }
      },
      // 充值
      {
        path: '/allocator/top-up',
        name: 'allocatorTopUp',
        component: resolve => {
          require(['@/pages/ALLOCATOR/top-up/TopUp'], resolve)
        },
        meta: {
          user: 'allocator'
        }
      },
      // 发起充值
      {
        path: '/allocator/top-up/start-top-up',
        name: 'allocatorStartTopUp',
        component: resolve => {
          require(['@/pages/ALLOCATOR/top-up/StartTopUp'], resolve)
        },
        meta: {
          user: 'allocator'
        }
      },
      // 充值详情
      {
        path: '/allocator/top-up/top-up-deal',
        name: 'allocatorTopUpDeal',
        component: resolve => {
          require(['@/pages/ENTERPRISE/top-up/TopUpDeal'], resolve)
        },
        meta: {
          user: 'allocator'
        }
      },
      {
        path: '/allocator/top-up/top-up-detail',
        name: 'allocatorTopUpDetail',
        component: resolve => {
          require(['@/pages/ALLOCATOR/top-up/TopUpDetail'], resolve)
        },
        meta: {
          user: 'allocator'
        }
      },
      // 充值成功
      {
        path: '/allocator/top-up/top-up-success',
        name: 'allocatorTopUpSuccess',
        component: resolve => { require([`@/pages/ALLOCATOR/top-up/TopUpSuccess`], resolve) },
        meta: {
          user: 'allocator'
        }
      },
      // 提现列表页面
      {
        path: '/allocator/withdraw-list',
        name: 'allocatorWithdrawList',
        component: resolve => { require([`@/pages/start-withdraw/Withdraw`], resolve) },
        meta: {
          user: 'allocator'
        }
      },
      // 提现页面
      {
        path: '/allocator/withdraw',
        name: 'allocatorWithdraw',
        component: resolve => { require([`@/pages/start-withdraw/StartWithdraw`], resolve) },
        meta: {
          user: 'allocator'
        }
      },
      // 提现详情
      {
        path: '/allocator/withdraw-detail',
        name: 'allocatorWithdrawDetail',
        component: resolve => { require([`@/pages/start-withdraw/WithdrawDeal`], resolve) },
        meta: {
          user: 'allocator'
        }
      },
      // 提现成功页面
      {
        path: '/allocator/withdraw-success',
        name: 'allocatorWithdrawSuccess',
        component: resolve => { require([`@/pages/start-withdraw/WithdrawSuccess`], resolve) },
        meta: {
          user: 'allocator'
        }
      },
      // 支付令明细账
      {
        path: '/allocator/cash-detail-account',
        name: 'allocatorCashdetailAccount',
        component: resolve => { require([`@/pages/ALLOCATOR/itemized-account/CashDetailAccount`], resolve) },
        meta: {
          user: 'allocator'
        }
      },
      // 分润明细账
      {
        path: '/allocator/benefit-detail-account',
        name: 'allocatorBenefitdetailAccount',
        component: resolve => { require([`@/pages/ALLOCATOR/itemized-account/BenefitDetailAccount`], resolve) },
        meta: {
          user: 'allocator'
        }
      },
      // 奖励明细账
      {
        path: '/allocator/rewards-detail-account',
        name: 'allocatorRewardsdetailaccount',
        component: resolve => { require([`@/pages/ALLOCATOR/itemized-account/RewardsDetailAccount`], resolve) },
        meta: {
          user: 'allocator'
        }
      },
      // 提现详单
      {
        path: '/allocator/withdraw-schedule',
        name: 'allocatorWithdrawSchedule',
        component: resolve => { require([`@/pages/ALLOCATOR/deal-schedule/WithdrawSchedule`], resolve) },
        meta: {
          user: 'allocator'
        }
      },
      // 充值详单
      {
        path: '/allocator/top-up-schedule',
        name: 'allocatorTopupSchedule',
        component: resolve => { require([`@/pages/ALLOCATOR/deal-schedule/TopUpSchedule`], resolve) },
        meta: {
          user: 'allocator'
        }
      },
      // 提现服务费详单
      {
        path: '/allocator/withdraw-fee-schedule',
        name: 'allocatorWithdrawFeeSchedule',
        component: resolve => { require([`@/pages/ALLOCATOR/deal-schedule/WithdrawFeeSchedule`], resolve) },
        meta: {
          user: 'allocator'
        }
      },
      // 返还详单
      {
        path: '/allocator/rebate-schedule',
        name: 'allocatorRebateschedule',
        component: resolve => { require([`@/pages/ALLOCATOR/deal-schedule/RebateSchedule`], resolve) },
        meta: {
          user: 'allocator'
        }
      },
      // 补贴详单
      {
        path: '/allocator/subsidy-schedule',
        name: 'allocatorcirCulationRewardSchedule',
        component: resolve => { require([`@/pages/ALLOCATOR/deal-schedule/SubsidySchedule`], resolve) },
        meta: {
          user: 'allocator'
        }
      },
      // 垫资方分润详单
      {
        path: '/allocator/ration-reward-schedule',
        name: 'rationRewardSchedule',
        component: resolve => { require([`@/pages/ALLOCATOR/deal-schedule/RationSchedule`], resolve) },
        meta: {
          user: 'allocator'
        }
      },
      // 奖励金币详单
      {
        path: '/allocator/reward-schedule',
        name: 'allocatorRewardSchedule',
        component: resolve => { require([`@/pages/ALLOCATOR/deal-schedule/RewardSchedule`], resolve) },
        meta: {
          user: 'allocator'
        }
      },
      // *****************************来往业务管理路由*********************************
      {
        path: '/allocator/companies',
        name: 'allocatorCompanies',
        component: resolve => { require([`@/pages/ALLOCATOR/companies/Companies`], resolve) },
        meta: {
          user: 'allocator'
        }
      },
      // *****************************账户管理路由*********************************
      // 企业信息
      {
        path: '/allocator/basic-information',
        name: 'allocatorBasicinformation',
        component: resolve => { require([`@/pages/account-management/BasicInformation`], resolve) },
        meta: {
          user: 'allocator'
        }
      },
      // 权限管理列表
      {
        path: '/allocator/authority-management',
        name: 'allocatorAuthorityList',
        component: resolve => { require(['@/pages/account-management/authority-management/AuthorityList'], resolve) },
        meta: {
          user: 'allocator'
        }
      },
      // 审核申请列表
      {
        path: '/allocator/authority-apply',
        name: 'allocatorAuthorityApplyList',
        component: resolve => { require(['@/pages/account-management/authority-management/AuthorityApplyList'], resolve) },
        meta: {
          user: 'allocator'
        }
      },
      // 审核申请详情
      {
        path: '/allocator/authority-apply-detail',
        name: 'allocatorAuthorityApplyDetail',
        component: resolve => { require(['@/pages/account-management/authority-management/AuthorityApplyDetail'], resolve) },
        meta: {
          user: 'allocator'
        }
      },
      // 安全中心
      {
        path: '/allocator/change-password',
        name: 'allocatorChangepassword',
        component: resolve => { require([`@/pages/account-management/change-password/ChangePassword`], resolve) },
        meta: {
          user: 'allocator'
        }
      },
      // 银行列表
      {
        path: '/allocator/bank-list',
        name: 'allocatorBankList',
        component: resolve => { require([`@/pages/account-management/bank-management/BankList`], resolve) },
        meta: {
          user: 'allocator'
        }
      },
      // 增加银行
      {
        path: '/allocator/add-bank',
        name: 'allocatorAddBank',
        component: resolve => { require([`@/pages/account-management/bank-management/AddBank`], resolve) },
        meta: {
          user: 'allocator'
        }
      },
      // CA管理
      {
        path: '/allocator/ca-certificate-manage',
        name: 'allocatorCAcertificatemanage',
        component: resolve => { require([`@/pages/account-management/CACertificateManage`], resolve) },
        meta: {
          user: 'allocator'
        }
      },
      // 平台协议
      {
        path: '/allocator/platform-agreement',
        name: 'allocatorPlatformAgreement',
        component: resolve => { require([`@/pages/account-management/PlatformAgreement`], resolve) },
        meta: {
          user: 'allocator'
        }
      },
      // *****************************************消息中心*********************
      // 列表路由
      {
        path: '/allocator/message',
        name: 'allocatorMessage',
        component: resolve => { require([`@/pages/ALLOCATOR/message/Message`], resolve) },
        meta: {
          user: 'allocator'
        }
      },
      // 消息详情
      {
        path: '/allocator/message-info',
        name: 'allocatorMessageInfo',
        component: resolve => { require([`@/pages/ALLOCATOR/message/MessageInfo`], resolve) },
        meta: {
          user: 'allocator'
        }
      }
    ]
  },
  // 收银台
  {
    path: '/allocator/cashier-desk',
    name: 'cashierDesk1',
    component: resolve => {
      require(['@/pages/ALLOCATOR/top-up/CashierDesk'], resolve)
    },
    meta: {
      user: 'allocator'
    }
  }
]
export default allocatorRoutes
