<template>
    <div style="height:100%">
        <el-container class="container">
          <el-header style="height:80px">
          <Header></Header>
          </el-header>
          <el-container style="width: 100%;min-width:1354px;" class="contert">
               <el-aside width="217px" >
                  <Aside :menuList="menuList"></Aside>
              </el-aside>
              <el-main><router-view></router-view></el-main>
          </el-container>
          <Footer></Footer>
      </el-container>
    </div>
</template>

<script>
import settings from '@/settings'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Aside from '@/components/Aside.vue'
import { Getitem } from '@/services/CommonService'
export default {
  name: 'adminIndex',
  data () {
    return {
      Role: '',
      // 获取侧边栏导航上的提示数字
      getNavReminderNumberUrl: settings.apiGateway.getNavReminderNumber,
      // 按钮列表
      menuList: [
        {
          firstMenu: '首页',
          path: '/service/home',
          classNameI: 'x_sy',
          className: 'home icon'
        },
        // {
        //   firstMenu: '仪表盘',
        //   path: '/service/dashboard',
        //   classNameI: 'ht_ybp',
        //   className: 'dashboard icon'
        // },
        // {
        //   firstMenu: '企业信息审核',
        //   badge: '',
        //   path: '/service/enterprise-approve',
        //   classNameI: 'ht_qyxxsh',
        //   className: 'business icon'
        // },
        {
          firstMenu: '业务处理',
          badge: '',
          className: 'enterprise-approve icon',
          classNameI: 'x_ywcl',
          secondMenuList: [
            {
              secondMenu: '提现',
              path: '/service/withdraw-list'
            }
          ]
        },
        {
          firstMenu: '我的账簿',
          path: '/service/cash-detail-account',
          classNameI: 'x_wdzb',
          className: 'account-book icon'
        },
        {
          firstMenu: '客户管理',
          badge: '',
          className: 'service-agent-management icon',
          classNameI: 'y_dlsgl_khgl',
          secondMenuList: [
            {
              secondMenu: '代理商管理',
              path: '/service/agent-list'
            },
            // {
            //   secondMenu: '资金方管理',
            //   path: '/service/fund-client-management'
            // },
            {
              secondMenu: '企业方管理',
              path: '/service/enterprise-client-management'
            },
            {
              secondMenu: '邀请记录',
              path: '/service/invite-list'
            }
          ]
        },
        {
          firstMenu: '账户管理',
          classNameI: 'x_zhgl',
          className: 'account-management icon',
          secondMenuList: [{
            secondMenu: '账户认证',
            path: '/service/basic-information'
          },
          {
            secondMenu: '权限管理',
            path: '/service/authority-management'
          },
          {
            secondMenu: '安全中心',
            path: '/service/change-password'
          },
          {
            secondMenu: '银行账户管理',
            path: '/service/bank-list'
          }
          // {
          //   secondMenu: 'CA证书管理',
          //   path: '/service/ca-certificate-manage'
          // }
          ]
        },
        // {
        //   firstMenu: '平台管理',
        //   badge: '',
        //   classNameI: 'ht_ptgl',
        //   className: 'service-platform-management icon',
        //   secondMenuList: [
        //     {
        //       secondMenu: '参数设置',
        //       path: '/service/parameter-setting'
        //     },
        //     {
        //       secondMenu: 'CA服务监控',
        //       path: '/service/ca-service-monitoring'
        //     }
        //   ]
        // },
        {
          firstMenu: '消息中心',
          path: '/service/message',
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
      if (this.isAdmin === 'Operator') {
        this.menuList[1].badge = data.enpApplyNum
        this.menuList[5].badge = data.message
      }
      if (this.isAdmin === 'Admin') {
        this.menuList[1].badge = data.withdrawNum
        this.menuList[4].badge = data.applyNum
        this.menuList[5].badge = data.message
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
    let userData = Getitem('userData')
    this.isAdmin = JSON.parse(userData).role
    this.Role = this.getUserRole()
    if (this.isAdmin === 'Operator') {
      this.menuList[4].secondMenuList.splice(1, 1)
    }
    if (this.isAdmin === 'Admin') {
      this.menuList[1].secondMenuList = [
        {
          secondMenu: '提现申请审核',
          path: '/service/withdraw-apply-authority'
        }]
    }
    this.getNavReminderNumber()
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
    height: 100%;
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
    padding: 0;
    width: calc(100% - 217px);
  }
</style>
