<template>
  <div style="height:100%">
    <el-container class="container">
      <el-header style="height:80px">
        <Header>
          <div></div>
        </Header>
      </el-header>
      <el-container style="width: 100%;min-width:1354px;" class="contert">
        <el-aside width="217px">
          <Aside :menuList="menuList"></Aside>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
      <!-- <div style="height:42px;width:100%"></div> -->
      <Footer></Footer>
    </el-container>
  </div>
</template>

<script>
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Aside from '@/components/Aside.vue'
import settings from '@/settings'
import { Getitem } from '@/services/CommonService'
export default {
  name: 'sysIndex',
  data () {
    return {
      Role: '',
      init: {},
      // 获取侧边栏导航上的提示数字
      getNavReminderNumberUrl: settings.apiGateway.getNavReminderNumber,
      menuList: [
        {
          firstMenu: '首页',
          path: '/enterprise/home',
          classNameI: 'x_sy',
          className: 'home icon'
        },
        {
          firstMenu: '业务处理',
          badge: '',
          classNameI: 'x_ywcl',
          className: 'business icon',
          secondMenuList: [
            {
              secondMenu: '充值',
              badge: '',
              path: '/enterprise/top-up'
            },
            {
              secondMenu: '提现',
              path: '/enterprise/withdraw-list'
            },
            {
              secondMenu: '收款',
              badge: '',
              path: '/enterprise/proceeds'
            },
            {
              secondMenu: '支付',
              badge: '',
              path: '/enterprise/payment'
            },
            {
              secondMenu: '购买',
              badge: '',
              path: '/enterprise/buy-list'
            },
            {
              secondMenu: '出售',
              badge: '',
              path: '/enterprise/sale-list'
            }
          ]
        },
        {
          firstMenu: '我的账簿',
          classNameI: 'x_wdzb',
          className: 'account-book icon',
          secondMenuList: [{
            secondMenu: '支付令明细账',
            path: '/enterprise/cash-detail-account'
          }
            // {
            //   secondMenu: '费用明细账',
            //   path: '/enterprise/fee-detail-account'
            // },
            //  {
            //   secondMenu: '金币明细账',
            //   path: '/enterprise/rewards-detail-account'
            // }
          ]
        },
        {
          firstMenu: '往来企业管理',
          path: '/enterprise/companies',
          classNameI: 'x_lwqygl',
          className: 'Companies icon'
        },
        {
          firstMenu: '账号管理',
          classNameI: 'x_zhgl',
          className: 'account-management icon',
          secondMenuList: [{
            secondMenu: '账户认证',
            path: '/enterprise/basic-information'
          },
          {
            secondMenu: '权限管理',
            path: '/enterprise/authority-management'
          },
          {
            secondMenu: '安全中心',
            path: '/enterprise/change-password'
          },
          {
            secondMenu: '银行账户管理',
            path: '/enterprise/bank-list'
          },
          // {
          //   secondMenu: 'CA证书管理',
          //   path: '/enterprise/ca-certificate-manage'
          // },
          {
            secondMenu: '平台协议下载',
            path: '/enterprise/platform-agreement'
          }]
        },
        {
          firstMenu: '消息中心',
          path: '/enterprise/message',
          badge: '',
          classNameI: 'ht_xxzx',
          className: 'message icon'
        }
      ]
    }
  },
  components: {
    Header,
    Footer,
    Aside
  },
  methods: {
    getNavReminderNumber () {
      var data = this.$store.state.counters
      this.menuList[5].badge = data.message
      this.menuList[4].badge = data.applyNum
      // this.menuList[0].badge = ''
      if (this.isAdmin === 'Operator') {
        this.menuList[1].badge = data.deposit + data.buyNum + data.payment + data.receive
        this.menuList[1].secondMenuList.map(item => {
          switch (item.secondMenu) {
            case '充值':
              item.badge = data.deposit
              break
            case '购买':
              item.badge = data.buyNum
              break
            case '支付':
              item.badge = data.payment
              break
            case '收款':
              item.badge = data.receive
              break
            default:
              item.badge = ''
          }
        })
      } else if (this.isAdmin === 'Admin') {
        this.menuList[1].badge = data.payment + data.receive + data.withdrawNum + data.buyAuditNum + data.sellAuditNum
        this.menuList[1].secondMenuList.map(item => {
          switch (item.secondMenu) {
            case '收款申请审核':
              item.badge = data.receive
              break
            case '支付申请审核':
              item.badge = data.payment
              break
            case '购买申请审核':
              item.badge = data.buyAuditNum
              break
            case '出售申请审核':
              item.badge = data.sellAuditNum
              break
            case '提现申请审核':
              item.badge = data.withdrawNum
              break
            default:
              item.badge = ''
          }
        })
      }
      this.menuList[4].secondMenuList.map(item => {
        if (item.secondMenu === '权限管理') {
          item.badge = data.applyNum
        }
      })
    }
  },
  created () {
    this.getNavReminderNumber()
    this.userRole = this.getUserRole()
    let userData = Getitem('userData')
    this.isAdmin = JSON.parse(userData).role
    if (this.isAdmin === 'Operator') {
      this.menuList[4].secondMenuList.splice(1, 1)
    }
    if (this.isAdmin === 'Admin') {
      this.menuList[1].secondMenuList = [
        {
          secondMenu: '收款申请审核',
          path: '/enterprise/proceeds-apply-authority'
        }, {
          secondMenu: '支付申请审核',
          path: '/enterprise/pay-apply-authority'
        }, {
          secondMenu: '购买申请审核',
          path: '/enterprise/buy-apply-authority'
        }, {
          secondMenu: '出售申请审核',
          path: '/enterprise/sale-apply-authority'
        }, {
          secondMenu: '提现申请审核',
          path: '/enterprise/withdraw-apply-authority'
        }]
    }
  },
  // 增加页面重定向逻辑避免手动输入页面路径
  beforeRouteEnter (to, from, next) {
    let perfectState = parseInt(Getitem('perfectState'))
    next(vm => {
      // 通过 `vm` 访问组件实例
      if (perfectState < 4) {
        let nextPath = vm.$store.state.initializationStepRoute[perfectState - 1]
        vm.$router.push(nextPath)
      }
    })
  },
  watch: {
    '$store.state.counters' () {
      this.getNavReminderNumber()
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/less/variables';
.el-header,
.el-footer {
  padding: 0;
}
.container {
  height: 100%;
}
.contert {
  // flex: 1;
  overflow: hidden;
}
.el-aside {
  background-color: @theme-blue;
  background-color: var(--mainColor);
  text-align: center;
  // width: 217px!important;
  /* overflow: hidden; */
}
.el-main {
  overflow-x: hidden;
  padding: 0;
  width: calc(100% - 217px);
}
</style>
