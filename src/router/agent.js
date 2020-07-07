/* 代理商部分路由 */

let agentRoutes = [
  {
    path: '/agent',
    name: 'agentIndex',
    component: resolve => { require(['@/pages/AGENT/home/AgentIndex'], resolve) },
    redirect: '/agent/home',
    meta: {
      user: 'agent'
    },
    children: [
      {
        path: '/agent/home',
        name: 'agentHome',
        component: resolve => { require(['@/pages/AGENT/home/Home'], resolve) },
        meta: {
          user: 'agent'
        }
      },
      // ************** 提现 ****************
      {
        path: '/agent/withdraw-list',
        name: 'agentWithdrawList',
        component: resolve => { require(['@/pages/start-withdraw/Withdraw'], resolve) },
        meta: {
          user: 'agent'
        }
      },
      {
        path: '/agent/withdraw',
        name: 'agentWithdraw',
        component: resolve => { require(['@/pages/start-withdraw/StartWithdraw'], resolve) },
        meta: {
          user: 'agent'
        }
      },
      // 提现详情
      {
        path: '/agent/withdraw-detail',
        name: 'agentWithdrawDetail',
        component: resolve => { require([`@/pages/start-withdraw/WithdrawDeal`], resolve) },
        meta: {
          user: 'agent'
        }
      },
      {
        path: '/agent/withdraw-success',
        name: 'agentWithdrawSuccess',
        component: resolve => { require(['@/pages/start-withdraw/WithdrawSuccess'], resolve) },
        meta: {
          user: 'agent'
        }
      },
      // ************* 我的账簿 ********************
      {
        path: '/agent/cash-detail-account',
        name: 'agentCashDetailAccount',
        component: resolve => { require(['@/pages/AGENT/AccountBooks/CashDetailAccount'], resolve) },
        meta: {
          user: 'agent'
        }
      },
      // 提现详单
      {
        path: '/agent/withdraw-schedule',
        name: 'agentWithdrawSchedule',
        component: resolve => { require([`@/pages/AGENT/AccountBooks/children/WithdrawSchedule`], resolve) },
        meta: {
          user: 'agent'
        }
      },
      // 提现服务费详单
      {
        path: '/agent/withdraw-fee-schedule',
        name: 'agentWithdrawFeeSchedule',
        component: resolve => { require([`@/pages/AGENT/AccountBooks/children/WithdrawFeeSchedule`], resolve) },
        meta: {
          user: 'agent'
        }
      },
      // 金币奖励详单
      {
        path: '/agent/gold-reward-schedule',
        name: 'agentGoldRewardSchedule',
        component: resolve => { require([`@/pages/AGENT/AccountBooks/children/AgentGoldRewardSchedule`], resolve) },
        meta: {
          user: 'agent'
        }
      },
      // 邀请奖励详单
      {
        path: '/agent/invite-reward-schedule',
        name: 'agentInviteRewardSchedule',
        component: resolve => { require([`@/pages/AGENT/AccountBooks/children/InviteRewardSchedule`], resolve) },
        meta: {
          user: 'agent'
        }
      },
      // 操作服务费详单
      {
        path: '/agent/operation-schedule',
        name: 'agentOperationSchedule',
        component: resolve => { require([`@/pages/AGENT/AccountBooks/children/OperationSchedule`], resolve) },
        meta: {
          user: 'agent'
        }
      },
      // 代理商奖励
      {
        path: '/agent/agent-reward-schedule',
        name: 'agentAgentRewardSchedule',
        component: resolve => { require([`@/pages/AGENT/AccountBooks/children/AgentRewardSchedule`], resolve) },
        meta: {
          user: 'agent'
        }
      },
      // *****************邀请企业管理 *************
      // 代理企业列表
      {
        path: '/agent/agency-enterpeise-list',
        name: 'agencyEnterpriseList',
        component: resolve => { require([`@/pages/AGENT/invite-business/agency-enterpeise-manage/AgencyEnterpriseList`], resolve) },
        meta: {
          user: 'agent'
        }
      },
      // 代理企业详情
      {
        path: '/agent/agency-enterpeise-detail',
        name: 'agentClientDetail',
        component: resolve => { require([`@/pages/AGENT/invite-business/agency-enterpeise-manage/AgentClientDetail`], resolve) },
        meta: {
          user: 'agent'
        }
      },
      // 资金方代理企业交易详情
      {
        path: '/agent/agency-enterpeise/fund-transaction',
        name: 'agentFundTransaction',
        component: resolve => { require([`@/pages/AGENT/invite-business/agency-enterpeise-manage/AgentFundTransaction`], resolve) },
        meta: {
          user: 'agent'
        }
      },
      // 企业方代理企业交易详情
      {
        path: '/agent/agency-enterpeise/enterprise-transaction',
        name: 'agentEnterpriseTransaction',
        component: resolve => { require([`@/pages/AGENT/invite-business/agency-enterpeise-manage/AgentEnterpriseTransaction`], resolve) },
        meta: {
          user: 'agent'
        }
      },
      // 邀请记录
      {
        path: '/agent/invite-list',
        name: 'agentInviteList',
        component: resolve => { require(['@/pages/AGENT/invite/InviteList'], resolve) },
        meta: {
          user: 'agent'
        }
      },
      // *********************账号管理*************
      // 基本信息
      {
        path: '/agent/basic-information',
        name: 'agentbasicinformation',
        component: resolve => { require([`@/pages/account-management/BasicInformation`], resolve) },
        meta: {
          user: 'agent'
        }
      },
      // 权限管理
      {
        path: '/agent/authority-management',
        name: 'agentAuthorityList',
        component: resolve => { require(['@/pages/account-management/authority-management/AuthorityList'], resolve) },
        meta: {
          user: 'agent'
        }
      },
      // 审核申请列表
      {
        path: '/agent/authority-apply',
        name: 'agentAuthorityApplyList',
        component: resolve => { require(['@/pages/account-management/authority-management/AuthorityApplyList'], resolve) },
        meta: {
          user: 'agent'
        }
      },
      // 审核申请详情
      {
        path: '/agent/authority-apply-detail',
        name: 'agentAuthorityApplyDetail',
        component: resolve => { require(['@/pages/account-management/authority-management/AuthorityApplyDetail'], resolve) },
        meta: {
          user: 'agent'
        }
      },
      // 银行列表
      {
        path: '/agent/bank-list',
        name: 'agentBankList',
        component: resolve => { require([`@/pages/account-management/bank-management/BankList`], resolve) },
        meta: {
          user: 'agent'
        }
      },
      // 增加银行
      {
        path: '/agent/add-bank',
        name: 'agentAddBank',
        component: resolve => { require([`@/pages/account-management/bank-management/AddBank`], resolve) },
        meta: {
          user: 'agent'
        }
      },
      // CA证书
      {
        path: '/agent/ca-certificate-manage',
        name: 'agentCAcertificatemanage',
        component: resolve => { require([`@/pages/account-management/CACertificateManage`], resolve) },
        meta: {
          user: 'agent'
        }
      },
      // 平台协议
      {
        path: '/agent/platform-agreement',
        name: 'agentPlatformAgreement',
        component: resolve => { require([`@/pages/account-management/PlatformAgreement`], resolve) },
        meta: {
          user: 'agent'
        }
      },
      // 安全中心
      {
        path: '/agent/change-password',
        name: 'agentChangepassword',
        component: resolve => { require([`@/pages/account-management/change-password/ChangePassword`], resolve) },
        meta: {
          user: 'agent'
        }
      },
      // *****************************************消息中心*********************
      // 列表路由
      {
        path: '/agent/message',
        name: 'agentMessage',
        component: resolve => { require([`@/pages/AGENT/message/Message`], resolve) },
        meta: {
          user: 'agent'
        }
      },
      // 消息详情
      {
        path: '/agent/message-info',
        name: 'agentMessageInfo',
        component: resolve => { require([`@/pages/AGENT/message/MessageInfo`], resolve) },
        meta: {
          user: 'agent'
        }
      },
      /* **************************管理员业务************************** */
      {
        path: '/agent/withdraw-apply-authority',
        name: 'agentWithdrawApplyAuthority',
        component: resolve => { require([`@/pages/start-withdraw/WithdrawApplyAuthority`], resolve) },
        meta: {
          user: 'agent'
        }
      },
      {
        path: '/agent/withdraw-apply-authority/detail',
        name: 'agentWithdrawApplyDetail',
        component: resolve => { require([`@/pages/start-withdraw/WithdrawApplyDetail`], resolve) },
        meta: {
          user: 'agent'
        }
      },
      {
        path: '/agent/withdraw-apply-authority/withdrawSuccess',
        name: 'agentwithdrawSuccess',
        component: resolve => { require([`@/pages/start-withdraw/WithdrawSuccess`], resolve) },
        meta: {
          user: 'agent'
        }
      }
    ]
  }
]

export default agentRoutes
