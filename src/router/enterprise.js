let enterpriseRoutes = [
  {
    path: '/enterprise',
    name: 'enterpriseIndex',
    component: resolve => { require(['@/pages/ENTERPRISE/home/EnterpriseIndex'], resolve) },
    redirect: '/enterprise/home',
    meta: {
      user: 'enterprise'
    },
    children: [
      {
        path: '/enterprise/home',
        name: 'enterpriseHome',
        component: resolve => { require(['@/pages/ENTERPRISE/home/Home'], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // 支付令结构
      {
        path: '/enterprise/balance-list',
        name: 'enterpriseBalanceList',
        component: resolve => { require(['@/pages/ENTERPRISE/home/BalanceList'], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // 充值
      {
        path: '/enterprise/top-up',
        name: 'enterpriseTopUp',
        component: resolve => {
          require(['@/pages/ENTERPRISE/top-up/TopUp'], resolve)
        },
        meta: {
          user: 'enterprise'
        }
      },
      // 发起充值
      {
        path: '/enterprise/top-up/start-top-up',
        name: 'enterpriseStartTopUp',
        component: resolve => {
          require(['@/pages/ENTERPRISE/top-up/StartTopUp'], resolve)
        },
        meta: {
          user: 'enterprise'
        }
      },
      // 充值详情
      {
        path: '/enterprise/top-up/top-up-deal',
        name: 'enterpriseTopUpDeal',
        component: resolve => {
          require(['@/pages/ENTERPRISE/top-up/TopUpDeal'], resolve)
        },
        meta: {
          user: 'enterprise'
        }
      },
      {
        path: '/enterprise/top-up/top-up-detail',
        name: 'enterpriseTopUpDetail',
        component: resolve => {
          require(['@/pages/ENTERPRISE/top-up/TopUpDetail'], resolve)
        },
        meta: {
          user: 'enterprise'
        }
      },
      // 充值成功
      {
        path: '/enterprise/top-up/top-up-success',
        name: 'enterpriseTopUpSuccess',
        component: resolve => { require([`@/pages/ENTERPRISE/top-up/TopUpSuccess`], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // 买令
      {
        path: '/enterprise/buy-list',
        name: 'buyList',
        component: resolve => {
          require(['@/pages/ENTERPRISE/buy/BuyList'], resolve)
        },
        meta: {
          user: 'enterprise'
        }
      },
      // 买令详情
      {
        path: '/enterprise/start-buy',
        name: 'startBuy',
        component: resolve => {
          require(['@/pages/ENTERPRISE/buy/BuyToDetail'], resolve)
        },
        meta: {
          user: 'enterprise'
        }
      },
      // 买令查看详情
      {
        path: '/enterprise/buy-detail',
        name: 'buyDetail',
        component: resolve => {
          require(['@/pages/ENTERPRISE/buy/BuyDeal'], resolve)
        },
        meta: {
          user: 'enterprise'
        }
      },
      // 买令成功提示页
      {
        path: '/enterprise/buy-success',
        name: 'buySuccess',
        component: resolve => {
          require(['@/pages/ENTERPRISE/buy/BuySuccess'], resolve)
        },
        meta: {
          user: 'enterprise'
        }
      },
      // 交易中心
      {
        path: '/enterprise/trading-center',
        name: 'tradingCenter',
        component: resolve => {
          require(['@/pages/ENTERPRISE/buy/TradingCenter'], resolve)
        },
        meta: {
          user: 'enterprise'
        }
      },
      // 卖令
      {
        path: '/enterprise/sale-list',
        name: 'saleList',
        component: resolve => {
          require(['@/pages/ENTERPRISE/sale/SaleList'], resolve)
        },
        meta: {
          user: 'enterprise'
        }
      },
      // 卖令
      {
        path: '/enterprise/sale-deal',
        name: 'saleDeal',
        component: resolve => {
          require(['@/pages/ENTERPRISE/sale/SaleDeal'], resolve)
        },
        meta: {
          user: 'enterprise'
        }
      },
      // 卖令操作页
      {
        path: '/enterprise/start-sale',
        name: 'startSale',
        component: resolve => {
          require(['@/pages/ENTERPRISE/sale/StartSale'], resolve)
        },
        meta: {
          user: 'enterprise'
        }
      },
      // 卖令详情页
      {
        path: '/enterprise/sale-detail',
        name: 'saleDetail',
        component: resolve => {
          require(['@/pages/ENTERPRISE/sale/SaleDetail'], resolve)
        },
        meta: {
          user: 'enterprise'
        }
      },
      // 支付
      {
        path: '/enterprise/payment',
        name: 'enterprisePayment',
        component: resolve => {
          require(['@/pages/ENTERPRISE/payment/Payment'], resolve)
        },
        meta: {
          user: 'enterprise'
        }
      },
      // 支付确认
      {
        path: '/enterprise/payment-confirm',
        name: 'enterprisePaymentConfirm',
        component: resolve => { require([`@/pages/ENTERPRISE/payment/PaymentConfirm`], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // 支付成功
      {
        path: '/enterprise/payment-success',
        name: 'enterprisePaymentSuccess',
        component: resolve => { require([`@/pages/ENTERPRISE/payment/PaymentSuccess`], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // 收款
      {
        path: '/enterprise/proceeds',
        name: 'enterpriseProcceeds',
        component: resolve => {
          require(['@/pages/ENTERPRISE/proceeds/Proceeds'], resolve)
        },
        meta: {
          user: 'enterprise'
        }
      },
      // 收款详情
      {
        path: '/enterprise/proceedsDetail',
        name: 'procceedsDetail',
        component: resolve => {
          require(['@/pages/ENTERPRISE/proceeds/ProceedsDeal'], resolve)
        },
        meta: {
          user: 'enterprise'
        }
      },
      // 发起收款
      {
        path: '/enterprise/proceeds/application',
        name: 'enterpriseApplication',
        component: resolve => { require([`@/pages/ENTERPRISE/proceeds/Application`], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // 提现列表页面
      {
        path: '/enterprise/withdraw-list',
        name: 'enterpriseWithdrawList',
        component: resolve => { require([`@/pages/start-withdraw/Withdraw`], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // 提现页面
      {
        path: '/enterprise/withdraw',
        name: 'enterpriseWithdraw',
        component: resolve => { require([`@/pages/start-withdraw/StartWithdraw`], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // 提现详情
      {
        path: '/enterprise/withdraw-detail',
        name: 'withdrawDetail',
        component: resolve => { require([`@/pages/start-withdraw/WithdrawDeal`], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // 提现成功页面
      {
        path: '/enterprise/withdraw-success',
        name: 'enterpriseWithdrawSuccess',
        component: resolve => { require([`@/pages/start-withdraw/WithdrawSuccess`], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // 交易记录
      {
        path: '/enterprise/trading-record',
        name: 'enterpriseTradingRecord',
        component: resolve => { require([`@/pages/ENTERPRISE/companies/CashDetailAccount`], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // 支付令明细账
      {
        path: '/enterprise/cash-detail-account',
        name: 'enterpriseCashdetailAccount',
        component: resolve => { require([`@/pages/ENTERPRISE/itemized-account/CashDetailAccount`], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // 提现详单
      {
        path: '/enterprise/withdraw-schedule',
        name: 'enterpriseWithdrawSchedule',
        component: resolve => { require([`@/pages/ENTERPRISE/deal-schedule/WithdrawSchedule`], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // 充值详单
      {
        path: '/enterprise/top-up-schedule',
        name: 'enterpriseTopupSchedule',
        component: resolve => { require([`@/pages/ENTERPRISE/deal-schedule/TopUpSchedule`], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // 收款详单
      {
        path: '/enterprise/proceeds-schedule',
        name: 'enterpriseProceedsschedule',
        component: resolve => { require([`@/pages/ENTERPRISE/deal-schedule/ProceedsSchedule`], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // 购买详单
      {
        path: '/enterprise/buy-schedule',
        name: 'enterpriseBuySchedule',
        component: resolve => { require([`@/pages/ENTERPRISE/deal-schedule/BuySchedule`], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // 出售转换
      {
        path: '/enterprise/convert-schedule',
        name: 'enterpriseConvertSchedule',
        component: resolve => { require([`@/pages/ENTERPRISE/deal-schedule/ConvertSchedule`], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // 出售详单
      {
        path: '/enterprise/sale-schedule',
        name: 'enterpriseSaleSchedule',
        component: resolve => { require([`@/pages/ENTERPRISE/deal-schedule/SaleSchedule`], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // 支付详单
      {
        path: '/enterprise/payment-schedule',
        name: 'enterprisePaymentschedule',
        component: resolve => { require([`@/pages/ENTERPRISE/deal-schedule/PaymentSchedule`], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // 支付详情
      {
        path: '/enterprise/payment-detail',
        name: 'enterprisePaymentdetail',
        component: resolve => { require([`@/pages/ENTERPRISE/payment/PaymentDeal`], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // 操作服务费详单
      {
        path: '/enterprise/operation-schedule',
        name: 'enterpriseOperationSchedule',
        component: resolve => { require([`@/pages/ENTERPRISE/deal-schedule/OperationSchedule`], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // 提现服务费详单
      {
        path: '/enterprise/fee-schedule',
        name: 'enterpriseWithdrawFeeSchedule',
        component: resolve => { require([`@/pages/ENTERPRISE/deal-schedule/WithdrawFeeSchedule`], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // 垫资详单
      {
        path: '/enterprise/advance-schedule',
        name: 'enterpriseAdvanceSchedule',
        component: resolve => { require([`@/pages/ENTERPRISE/deal-schedule/AdvanceSchedule`], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // 返利详单
      {
        path: '/enterprise/rebate-schedule',
        name: 'enterpriseRebateschedule',
        component: resolve => { require([`@/pages/ENTERPRISE/deal-schedule/RebateSchedule`], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // 邀请奖励详单
      {
        path: '/enterprise/invite-reward-schedule',
        name: 'enterpriseInviteRewardSchedule',
        component: resolve => { require([`@/pages/ENTERPRISE/deal-schedule/InviteRewardSchedule`], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // *****************************来往业务管理路由*********************************
      {
        path: '/enterprise/companies',
        name: 'enterpriseCompanies',
        component: resolve => { require([`@/pages/ENTERPRISE/companies/Companies`], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // 补贴详单
      {
        path: '/enterprise/subsidy-schedule',
        name: 'enterpriseCulationRewardSchedule',
        component: resolve => { require([`@/pages/ENTERPRISE/deal-schedule/SubsidySchedule`], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // *****************************账户管理路由*********************************
      // 企业信息
      {
        path: '/enterprise/basic-information',
        name: 'enterpriseBasicinformation',
        component: resolve => { require([`@/pages/account-management/BasicInformation`], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // 权限管理列表
      {
        path: '/enterprise/authority-management',
        name: 'enterpriseAuthorityList',
        component: resolve => { require(['@/pages/account-management/authority-management/AuthorityList'], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // 审核申请列表
      {
        path: '/enterprise/authority-apply',
        name: 'enterpriseAuthorityApplyList',
        component: resolve => { require(['@/pages/account-management/authority-management/AuthorityApplyList'], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // 审核申请详情
      {
        path: '/enterprise/authority-apply-detail',
        name: 'enterpriseAuthorityApplyDetail',
        component: resolve => { require(['@/pages/account-management/authority-management/AuthorityApplyDetail'], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // 安全中心
      {
        path: '/enterprise/change-password',
        name: 'enterpriseChangepassword',
        component: resolve => { require([`@/pages/account-management/change-password/ChangePassword`], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // 银行列表
      {
        path: '/enterprise/bank-list',
        name: 'enterpriseBankList',
        component: resolve => { require([`@/pages/account-management/bank-management/BankList`], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // 增加银行
      {
        path: '/enterprise/add-bank',
        name: 'enterpriseAddBank',
        component: resolve => { require([`@/pages/account-management/bank-management/AddBank`], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // CA管理
      {
        path: '/enterprise/ca-certificate-manage',
        name: 'enterpriseCAcertificatemanage',
        component: resolve => { require([`@/pages/account-management/CACertificateManage`], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // 平台协议
      {
        path: '/enterprise/platform-agreement',
        name: 'enterprisePlatformAgreement',
        component: resolve => { require([`@/pages/account-management/PlatformAgreement`], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // *****************************************消息中心*********************
      // 列表路由
      {
        path: '/enterprise/message',
        name: 'enterpriseMessage',
        component: resolve => { require([`@/pages/ENTERPRISE/message/Message`], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // 消息详情
      {
        path: '/enterprise/message-info',
        name: 'enterpriseMessageInfo',
        component: resolve => { require([`@/pages/ENTERPRISE/message/MessageInfo`], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // *****************************************管理员下的业务处理*********************
      // 支付审核
      {
        path: '/enterprise/pay-apply-authority',
        name: 'payApplyAuthority',
        component: resolve => { require([`@/pages/ENTERPRISE/admin-business-review/pay-apply-authority/PayApplyAuthority`], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // 支付审核详情页
      {
        path: '/enterprise/pay-apply-authority/detail',
        name: 'PayApplyDetail',
        component: resolve => { require([`@/pages/ENTERPRISE/admin-business-review/pay-apply-authority/PayApplyDetail`], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // 支付成功
      {
        path: '/enterprise/pay-apply-authority/paySuccess',
        name: 'paySuccess',
        component: resolve => { require([`@/pages/ENTERPRISE/admin-business-review/pay-apply-authority/PaySuccess`], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // 收款审核
      {
        path: '/enterprise/proceeds-apply-authority',
        name: 'proceedsApplyAuthority',
        component: resolve => { require([`@/pages/ENTERPRISE/admin-business-review/proceeds-apply-authority/ProceedsApplyAuthority`], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // 收款审核详情页
      {
        path: '/enterprise/proceeds-apply-authority/detail',
        name: 'ProceedApplyDetail',
        component: resolve => { require([`@/pages/ENTERPRISE/admin-business-review/proceeds-apply-authority/ProceedApplyDetail`], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // 提现审核
      {
        path: '/enterprise/withdraw-apply-authority',
        name: 'withdrawApplyAuthority',
        component: resolve => { require([`@/pages/start-withdraw/WithdrawApplyAuthority`], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // 提现审核详情页
      {
        path: '/enterprise/withdraw-apply-authority/detail',
        name: 'withdrawApplyDetail',
        component: resolve => { require([`@/pages/start-withdraw/WithdrawApplyDetail`], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // 提现成功
      {
        path: '/enterprise/withdraw-apply-authority/withdrawSuccess',
        name: 'withdrawSuccess',
        component: resolve => { require([`@/pages/start-withdraw/WithdrawSuccess`], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // 购买申请审核
      {
        path: '/enterprise/buy-apply-authority',
        name: 'buyApplyList',
        component: resolve => { require([`@/pages/ENTERPRISE/admin-business-review/buy-apply-authority/BuyApplyAuthority`], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // 购买申请审核详情
      {
        path: '/enterprise/buy-apply-authority/detail',
        name: 'buyApplyDetail',
        component: resolve => { require([`@/pages/ENTERPRISE/admin-business-review/buy-apply-authority/BuyApplyDetail`], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // 出售申请审核
      {
        path: '/enterprise/sale-apply-authority',
        name: 'saleApplyList',
        component: resolve => { require([`@/pages/ENTERPRISE/admin-business-review/sale-apply-authority/SaleApplyAuthority`], resolve) },
        meta: {
          user: 'enterprise'
        }
      },
      // 出售申请审核详情
      {
        path: '/enterprise/sale-apply-authority/detail',
        name: 'saleApplyDetail',
        component: resolve => { require([`@/pages/ENTERPRISE/admin-business-review/sale-apply-authority/SaleApplyDetail`], resolve) },
        meta: {
          user: 'enterprise'
        }
      }
    ]
  },
  // 收银台
  {
    path: '/enterprise/cashier-desk',
    name: 'cashierDesk',
    component: resolve => {
      require(['@/pages/ENTERPRISE/top-up/CashierDesk'], resolve)
    },
    meta: {
      user: 'enterprise'
    }
  }
]
export default enterpriseRoutes
