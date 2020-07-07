<template>
    <div >
        <el-container class="container">
          <el-header style="height:80px">
            <Header :hidden="hidden"></Header>
          </el-header>
          <el-container style="width: 1354px;margin: 0 auto" class="contert">
               <el-aside width="217px" >
                  <Aside :menuList="menuList"></Aside>
              </el-aside>
              <el-main><router-view></router-view></el-main>
          </el-container>
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
  name: 'agentIndex',
  data () {
    return {
      hidden: false,
      Role: '',
      // 获取侧边栏导航上的提示数字
      getNavReminderNumberUrl: settings.apiGateway.getNavReminderNumber,
      menuList: [
        {
          firstMenu: '首页',
          path: '/fund/home',
          classNameI: 'x_sy',
          className: 'home icon'
        },
        {
          firstMenu: '业务处理',
          classNameI: 'x_ywcl',
          className: 'business icon',
          badge: '',
          secondMenuList: [{
            secondMenu: '联合发令',
            badge: '',
            path: '/fund/joint-token-list'
          },
          {
            secondMenu: '提现',
            path: '/fund/withdraw-list'
          }]
        },
        {
          firstMenu: '我的账簿',
          classNameI: 'x_wdzb',
          className: 'account-book icon',
          secondMenuList: [{
            secondMenu: '支付令明细账',
            path: '/fund/cash-detail-account'
          }]
        },
        {
          firstMenu: '往来企业管理',
          path: '/fund/companies',
          classNameI: 'x_lwqygl',
          className: 'Companies icon'
        },
        {
          firstMenu: '账号管理',
          classNameI: 'x_zhgl',
          className: 'account-management icon',
          secondMenuList: [{
            secondMenu: '账户认证',
            path: '/fund/basic-information'
          },
          {
            secondMenu: '权限管理',
            path: '/fund/authority-management'
          },
          {
            secondMenu: '安全中心',
            path: '/fund/change-password'
          },
          {
            secondMenu: '银行账户管理',
            path: '/fund/bank-list'
          },
          // {
          //   secondMenu: 'CA证书管理',
          //   path: '/fund/ca-certificate-manage'
          // },
          {
            secondMenu: '平台协议下载',
            path: '/fund/platform-agreement'
          }]
        },
        {
          firstMenu: '消息中心',
          path: '/fund/message',
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
      this.menuList[1].badge = data.jointToken
      this.menuList[4].badge = data.applyNum
      if (this.isAdmin === 'Operator') {
        this.menuList[1].badge = data.jointToken
        this.menuList[1].secondMenuList.map(item => {
          if (item.secondMenu === '联合发令') {
            item.badge = data.jointToken
          }
        })
      } else {
        this.menuList[1].secondMenuList.map(item => {
          this.menuList[1].badge = data.withdrawNum
          if (item.secondMenu === '提现申请审核') {
            item.badge = data.withdrawNum
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
    this.Role = this.getUserRole()
    this.getAccount()
    this.getNavReminderNumber()
    let userData = Getitem('userData')
    this.isAdmin = JSON.parse(userData).role
    if (this.isAdmin === 'Operator') {
      this.menuList[4].secondMenuList.splice(1, 1)
    } else if (this.isAdmin === 'Admin') {
      this.menuList[1].secondMenuList = [
        {
          secondMenu: '提现申请审核',
          path: '/fund/withdraw-apply-authority'
        }]
    }
  },
  // 增加页面重定向逻辑,防止在用户初始化时手动输入路径造成的错误
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
  .el-header, .el-footer {
    padding:0;
  }
  .container {
    display: flex ;
    flex-direction: column;
    position: absolute ;
    left: 0 ;
    right: 0;
    bottom: 0;
    top: 0;
  }
  .contert {
    flex: 1;
    overflow: hidden
  }
  .el-aside {
    background-color: @theme-blue;
    background-color: var(--mainColor);
    text-align: center;
    /* overflow: hidden; */
  }
  .el-main {
    overflow-x: hidden;
    padding: 0
  }
</style>
