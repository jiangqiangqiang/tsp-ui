<template>
  <div style="height:100%">
    <el-container class="container">
      <el-header style="height:80px">
        <Header :hidden="hidden"></Header>
      </el-header>
      <el-container style="width: 100%;min-width:1354px;" class="contert">
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
  name: 'agentIndex',
  data () {
    return {
      hidden: false,
      Role: '',
      // 获取电话号码
      getEnterpriseUrl: settings.apiGateway.getEnterprise,
      // 获取侧边栏导航上的提示数字
      getNavReminderNumberUrl: settings.apiGateway.getNavReminderNumber,
      menuList: [
        {
          firstMenu: '首页',
          path: '/agent/home',
          classNameI: 'x_sy',
          className: 'home icon'
        },
        {
          firstMenu: '业务处理',
          classNameI: 'x_ywcl',
          className: 'business icon',
          secondMenuList: [{
            secondMenu: '提现',
            path: '/agent/withdraw-list'
          }]
        },
        {
          firstMenu: '我的账簿',
          classNameI: 'x_wdzb',
          className: 'account-book icon',
          secondMenuList: [{
            secondMenu: '支付令明细账',
            path: '/agent/cash-detail-account'
          }]
        },
        // {
        //   firstMenu: '代理企业管理',
        //   classNameI: 'x_lwqygl',
        //   className: 'Companies icon',
        //   path: '/agent/agency-enterpeise-list',
        //   badge: ''
        //   // secondMenuList: [
        //   //   {
        //   //     secondMenu: '代理企业列表',
        //   //     badge: '',
        //   //     path: '/agent/agency-enterpeise-list'
        //   //   }]
        // },
        {
          firstMenu: '客户管理',
          badge: '',
          className: 'admin-agent-management icon',
          classNameI: 'y_dlsgl_khgl',
          secondMenuList: [
            {
              secondMenu: '企业管理',
              path: '/agent/agency-enterpeise-list'
            },
            {
              secondMenu: '邀请记录',
              path: '/agent/invite-list'
            }
          ]
        },
        {
          firstMenu: '账号管理',
          classNameI: 'x_zhgl',
          className: 'account-management icon',
          secondMenuList: [{
            secondMenu: '账户认证',
            path: '/agent/basic-information'
          },
          {
            secondMenu: '权限管理',
            path: '/agent/authority-management'
          },
          {
            secondMenu: '安全中心',
            path: '/agent/change-password'
          },
          {
            secondMenu: '银行账户管理',
            path: '/agent/bank-list'
          },
          // {
          //   secondMenu: 'CA证书管理',
          //   path: '/agent/ca-certificate-manage'
          // },
          {
            secondMenu: '平台协议下载',
            path: '/agent/platform-agreement'
          }
          ]
        },
        {
          firstMenu: '消息中心',
          path: '/agent/message',
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
    // 获取电话号
    getAdminMobileInfo () {
      // this.fetch(this.getEnterpriseUrl).then(data => {
      //   this.adminMobile = data.data.adminMobile
      //   this.$store.commit('setAdminMobile', this.adminMobile)
      // }).catch(data => {
      //   this.$message({
      //     type: 'error',
      //     message: data.data.msg
      //   })
      // })
    },
    getNavReminderNumber () {
      var data = this.$store.state.counters
      this.menuList[5].badge = data.message
      if (this.isAdmin === 'Admin') {
        this.menuList[1].badge = data.withdrawNum
        this.menuList[4].badge = data.applyNum
        this.menuList[4].secondMenuList.map(item => {
          if (item.secondMenu === '权限管理') {
            item.badge = data.applyNum
          }
        })
        this.menuList[1].secondMenuList.map(item => {
          if (item.secondMenu === '提现申请审核') {
            item.badge = data.withdrawNum
          }
        })
      }
    }
  },
  created () {
    this.Role = this.getUserRole()
    this.getAdminMobileInfo()
    let userData = Getitem('userData')
    this.isAdmin = JSON.parse(userData).role
    if (this.isAdmin === 'Operator') {
      this.menuList[4].secondMenuList.splice(1, 1)
    }
    if (this.isAdmin === 'Admin') {
      this.menuList[1].secondMenuList = [
        {
          secondMenu: '提现申请审核',
          path: '/agent/withdraw-apply-authority'
        }]
    }
    this.getNavReminderNumber()
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
.el-header,
.el-footer {
  padding: 0;
}
.container {
  height: 100%;
}
.contert {
  flex: 1;
  overflow: hidden;
}
.el-aside {
  background-color: @theme-blue;
  background-color: var(--mainColor);
  text-align: center;
  /* overflow: hidden; */
}
.el-main {
  overflow-x: hidden;
  padding: 0;
  width: calc(100% - 217px);
}
</style>
