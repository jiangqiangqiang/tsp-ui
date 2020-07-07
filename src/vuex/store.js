import Vue from 'vue'
import Vuex from 'vuex'
import { Setitem, Getitem, Removeitem } from '@/services/CommonService.js'
import settings from '@/settings.js'

Vue.use(Vuex)
const state = {
  // 邀请次数
  lastInviteNumber: '',
  // 浏览器类型
  isIE: false,
  // 账户余额
  account: {},
  // 金币余额
  gold: {},
  // 代理商邀请角色所花费的费用
  invitationFee: '',
  // 消息中心的未读个数
  unreadMessage: '',
  // 代理商初始化数据
  common: '',
  // X/Y初始化数据
  Init: '',
  // 客服电话
  serviceTel: '010-86775643',
  // 提现最小值
  minWithdraw: 250,
  tradingEnp: '',
  userToken: '',
  searchCache: {
    adminCashAccount: {},
    enterpriseCashAccount: {},
    servicesCashAccount: {},
    agentCashAccount: {},
    allocatorCashAccount: {}
  },
  // 初始化步骤路由
  initializationStepRoute: [
    '/authentication/personal-certificate',
    '/authentication/enterprise-certificate',
    '/authentication/enterprise-certificate/step5',
    '/',
    '/authentication/initialization',
    '/authentication/initialization'
  ],
  // 获取管理员手机号
  adminMobile: '',
  // 全局Button组件fetch disabled控制
  btnFetchDisabled: false,
  // 消息的条数
  counters: {
    payment: 0,
    jointToken: 0,
    deposit: 0,
    enterpriseAudit: 0,
    agentLogoutAudit: 0,
    depositPowerAudit: 0,
    message: 0
  },
  // 待审核code值
  checkCodeStatus: 0
}

const mutations = {
  // X/Y邀请次数
  setLastInviteNumber (state, payLoad) {
    state.lastInviteNumber = payLoad
    Setitem('store', JSON.stringify(state))
  },
  // 代理商邀请角色所花费的费用
  setInvitationFee (state, payLoad) {
    state.invitationFee = payLoad
    Setitem('store', JSON.stringify(state))
  },
  setWebType (state, isIE) {
    state.isIE = isIE
  },
  setUserToken (state, userToken) {
    state.userToken = userToken
    Setitem('store', JSON.stringify(state))
  },
  setSearchCache (state, cacheData) {
    state.searchCache[cacheData.type] = cacheData.data
  },
  setStore (state, payLoad) {
    let token = Getitem('token')
    if (!token) {
      Removeitem('store')
      state.userToken = null
      return
    }
    let data = JSON.parse(payLoad)
    for (let key in data) {
      state[key] = data[key]
    }
  },
  setAccount (state, payLoad) {
    state.account = payLoad
  },
  setGold (state, payLoad) {
    state.gold = payLoad
  },
  // 消息中心的未读个数
  setUnreadMessage (state, payLoad) {
    state.unreadMessage = payLoad
    Setitem('store', JSON.stringify(state))
  },
  // 由于数据混用setCommon和setInit做了同样的事情
  // 代理商初始化数据
  setCommon (state, payLoad) {
    state.common = payLoad
    state.init = payLoad
    Setitem('store', JSON.stringify(state))
  },
  // X/Y初始化数据
  setInit (state, payLoad) {
    state.common = payLoad
    state.init = payLoad
    Setitem('store', JSON.stringify(state))
  },
  setAdminMobile (state, payLoad) {
    state.adminMobile = payLoad
    Setitem('store', JSON.stringify(state))
  },
  // 设置fetchdisabled标志
  setFetchDisabled (state, payLoad) {
    state.btnFetchDisabled = payLoad
  },
  setCounters (state, payLoad) {
    state.counters = Object.assign({}, payLoad)
    Setitem('store', JSON.stringify(state))
  },
  // 检查待审核code
  setCheckcodeStatus (state, payLoad) {
    state.checkCodeStatus = payLoad
    Setitem('store', JSON.stringify(state))
  },
  // 设置关联企业
  setTradingEnp (state, payLoad) {
    state.tradingEnp = payLoad
    Setitem('store', JSON.stringify(state))
  }
}
const actions = {
  updateCounters (context) {
    Vue.axios
      .get(`${settings.apiGateway.getNavReminderNumber}`)
      .then(({ data }) => {
        if (data.code === 0) {
          context.commit('setCounters', data.data)
        }
      })
  }
}

const getters = {}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
