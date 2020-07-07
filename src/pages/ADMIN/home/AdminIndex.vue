<template>
  <div style="height:100%">
    <el-container class="container">
      <el-header style="height:80px">
        <Header></Header>
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
          path: '/admin/home',
          classNameI: 'x_sy',
          className: 'home icon'
        },
        {
          firstMenu: '运营工具',
          path: '/admin/dashboard',
          classNameI: 'ht_ybp',
          className: 'dashboard icon',
          secondMenuList: [
            {
              secondMenu: '仪表盘',
              path: '/admin/dashboard',
              badge: ''
            },
            {
              secondMenu: '平台记录',
              badge: '',
              path: '',
              thirdMenuList: [
                {
                  thirdMenu: '平台流水账簿',
                  path: '/admin/platform-account'
                },
                {
                  thirdMenu: '激励账户账簿',
                  path: '/admin/cash-detail-account'
                },
                {
                  thirdMenu: '企业账簿',
                  path: '/admin/excitation-account'
                }
              ]
            },
            {
              secondMenu: '三方记录',
              badge: '',
              path: '',
              thirdMenuList: [
                {
                  thirdMenu: '订单查询',
                  path: '/admin/search-order'
                }
              ]
            }
          ]
        },
        // {
        //   firstMenu: '支付令明细账',
        //   path: '/admin/cash-detail-account',
        //   classNameI: 'x_wdzb',
        //   className: 'home icon'
        // },
        // {
        //   firstMenu: '企业信息审核',
        //   badge: '',
        //   path: '/admin/enterprise-approve',
        //   classNameI: 'ht_qyxxsh',
        //   className: 'business icon'
        // },
        {
          firstMenu: '客户管理',
          badge: '',
          className: 'admin-agent-management icon',
          classNameI: 'y_dlsgl_khgl',
          secondMenuList: [
            {
              secondMenu: '企业信息审核',
              path: '/admin/enterprise-approve'
            },
            {
              secondMenu: '服务商管理',
              path: '/admin/service-client-management'
            },
            {
              secondMenu: '代理商管理',
              path: '/admin/agent-list'
            },
            {
              secondMenu: '企业方管理',
              path: '/admin/enterprise-client-management'
            },
            {
              secondMenu: '邀请记录',
              path: '/admin/invite-list'
            },
            {
              secondMenu: '用户列表',
              path: '/admin/user-list'
            }
          ]
        },
        {
          firstMenu: '平台管理',
          badge: '',
          classNameI: 'ht_ptgl',
          className: 'admin-platform-management icon',
          secondMenuList: [
            {
              secondMenu: '参数设置',
              path: '/admin/parameter-setting'
            },
            {
              secondMenu: 'CA服务监控',
              path: '/admin/ca-service-monitoring'
            },
            {
              secondMenu: '查询验证码',
              path: '/admin/searchCode'
            }
          ]
        },
        {
          firstMenu: '运营商管理',
          classNameI: 'x_zhgl',
          className: 'account-management icon',
          secondMenuList: [
            // {
            //   secondMenu: '权限管理',
            //   path: '/admin/authority-management'
            // },
            {
              secondMenu: '运营商账簿',
              path: '/admin/cash-account'
            },
            {
              secondMenu: '银行账户管理',
              path: '/admin/bank-list'
            },
            {
              secondMenu: '安全中心',
              path: '/admin/change-password'
            }]
        },
        {
          firstMenu: '消息中心',
          path: '/admin/message',
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
        this.menuList[2].badge = data.enpApplyNum
        this.menuList[7].badge = data.message
      } else if (this.isAdmin === 'Admin') {
        this.menuList[2].badge = data.withdrawNum
        this.menuList[5].badge = data.applyNum
        this.menuList[7].badge = data.message
        this.menuList[5].secondMenuList.map(item => {
          if (item.secondMenu === '权限管理') {
            item.badge = data.applyNum
          }
        })
        this.menuList[2].secondMenuList.map(item => {
          if (item.secondMenu === '提现申请审核') {
            item.badge = data.withdrawNum
          }
        })
      } else if (this.isAdmin === 'SuperAdmin') {
        this.menuList[2].badge = data.enpApplyNum
        this.menuList[2].secondMenuList.map(item => {
          if (item.secondMenu === '企业信息审核') item.badge = data.enpApplyNum
        })
        this.menuList[5].badge = data.message
        this.menuList[4].badge = data.applyNum
        this.menuList[4].secondMenuList.map(item => {
          if (item.secondMenu === '权限管理') item.badge = data.applyNum
        })
      }
    }
  },
  created () {
    let userData = Getitem('userData')
    this.isAdmin = JSON.parse(userData).role
    this.Role = this.getUserRole()
    if (this.isAdmin === 'Operator') {
      this.menuList[6].secondMenuList.splice(1, 1)
      this.menuList.splice(7, 1)
    }
    if (this.isAdmin === 'Admin') {
      this.menuList.splice(2, 1)
      this.menuList[2].secondMenuList = [
        {
          secondMenu: '提现申请审核',
          path: '/admin/withdraw-apply-authority'
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
