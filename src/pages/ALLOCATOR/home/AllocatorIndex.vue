<template>
  <div>
    <el-container class="container">
      <el-header style="height:80px">
        <Header>
          <div></div>
        </Header>
      </el-header>
      <el-container style="width: 1354px;margin: 0 auto" class="contert">
        <el-aside width="217px">
          <Aside :menuList="menuList"></Aside>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
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
          path: '/allocator/home',
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
              path: '/allocator/top-up'
            },
            {
              secondMenu: '提现',
              path: '/allocator/withdraw-list'
            }
          ]
        },
        {
          firstMenu: '我的账簿',
          classNameI: 'x_wdzb',
          className: 'account-book icon',
          secondMenuList: [{
            secondMenu: '支付令明细账',
            path: '/allocator/cash-detail-account'
          }]
        },
        {
          firstMenu: '账号管理',
          classNameI: 'x_zhgl',
          className: 'account-management icon',
          secondMenuList: [{
            secondMenu: '账户认证',
            path: '/allocator/basic-information'
          },
          // {
          //   secondMenu: '权限管理',
          //   path: '/allocator/authority-management'
          // },
          {
            secondMenu: '安全中心',
            path: '/allocator/change-password'
          },
          {
            secondMenu: '银行账户管理',
            path: '/allocator/bank-list'
          },
          // {
          //   secondMenu: 'CA证书管理',
          //   path: '/allocator/ca-certificate-manage'
          // },
          {
            secondMenu: '平台协议下载',
            path: '/allocator/platform-agreement'
          }]
        },
        {
          firstMenu: '消息中心',
          path: '/allocator/message',
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
      this.menuList[4].badge = data.message
      if (this.isAdmin === 'Admin') {
        this.menuList[1].badge = data.deposit + data.buyNum + data.payment
        this.menuList[1].secondMenuList.map(item => {
          switch (item.secondMenu) {
            case '充值':
              item.badge = data.deposit
              break
            default:
              item.badge = ''
          }
        })
      }
    }
  },
  created () {
    this.getNavReminderNumber()
    this.userRole = this.getUserRole()
    let userData = Getitem('userData')
    this.isAdmin = JSON.parse(userData).role
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
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
}
.contert {
  flex: 1;
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
}
</style>
