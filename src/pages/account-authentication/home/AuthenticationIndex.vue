<template>
  <div class="authentication">
    <el-container class="container">
      <el-header style="height:80px;background:#fcfcfc;border-bottom: 1px solid #f1f1f3">
        <div style="width: 1340px;margin:0 auto;">
          <div class="logo">
            <svg-icon iconClass='zjf_logo' className='fund-logo'></svg-icon>
            <span class="registerTitle">用户注册</span>
          </div>
          <div style="float:right" class="logout" v-if="perfectState<=1">
            <span>已有账户，</span>
            <span class="toLogin" @click="toLogin">请登录</span>
          </div>
          <div style="float:right" class="logout" v-else>
            <span style="fontSize:15px;color:#4b4b4b;">{{topName || realName}}</span>
            <span class="toLogin" @click="toLogin">退出</span>
          </div>
        </div>
      </el-header>
      <el-container style="width: 1370px;margin: 0 auto;" class="contert">
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
      <div style="height:42px;width:100%"></div>
      <Footer style="position:fixed;bottom:0;left:0"></Footer>
    </el-container>
    <NOAuthentication :showDialog="showDialog" @ToAttestation="ToAttestation"></NOAuthentication>
  </div>
</template>

<script>
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Aside from '@/components/Aside.vue'
import { Getitem, Removeitem } from '@/services/CommonService'
import NOAuthentication from '@/components/NOAuthentication'
import settings from '@/settings'
export default {
  name: 'sysIndex',
  data () {
    return {
      Role: '',
      init: {},
      showDialog: false,
      // 展开下拉菜单的延时
      showTimeout: 10,
      perfectState: JSON.parse(Getitem('userData')).perfectState,
      // 用户名
      realName: '',
      getApplyInfoUrl: settings.apiGateway.getApplyInfo,
      topName: '',
      menuList: [
        {
          firstMenu: '首页',
          path: '',
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
              // badge: this.badge.payment,
              badge: '',
              path: ''
            },
            {
              secondMenu: '联合发令',
              badge: '',
              path: ''
            },
            {
              secondMenu: '支付',
              badge: '',
              path: ''
            },
            {
              secondMenu: '收款',
              badge: '',
              path: ''
            },
            {
              secondMenu: '提现',
              path: ''
            }
          ]
        },
        {
          firstMenu: '我的账簿',
          classNameI: 'x_wdzb',
          className: 'account-book icon',
          secondMenuList: [{
            secondMenu: '支付令明细账',
            path: ''
          },
          {
            secondMenu: '费用明细账',
            path: ''
          },
          {
            secondMenu: '奖励明细账',
            path: ''
          }]
        },
        {
          firstMenu: '往来企业管理',
          classNameI: 'x_lwqygl',
          className: 'Companies icon',
          secondMenuList: [{
            secondMenu: '往来企业列表',
            path: ''
          }]
        },
        {
          firstMenu: '消息中心',
          path: '',
          badge: '',
          classNameI: 'ht_xxzx',
          className: 'message icon'
        },
        {
          firstMenu: '账号管理',
          classNameI: 'x_zhgl',
          className: 'account-management icon',
          secondMenuList: [{
            secondMenu: '账户认证',
            path: ''
          },
          {
            secondMenu: '权限管理',
            path: ''
          },
          {
            secondMenu: '安全中心',
            path: ''
          },
          {
            secondMenu: '银行账户管理',
            path: ''
          },
          // {
          //   secondMenu: 'CA证书管理',
          //   path: ''
          // },
          {
            secondMenu: '平台协议下载',
            path: ''
          }]
        }
      ]
    }
  },
  components: {
    Header,
    Footer,
    Aside,
    NOAuthentication
  },
  methods: {
    ToAttestation () {
      let userData = Getitem('userData')
      this.perfectState = JSON.parse(userData).perfectState
      if (this.perfectState === '1') {
        // 用户个人信息
        this.$router.push('/authentication/personal-certificate')
      } else if (this.perfectState === '2') {
        // 创建或加入企业
        this.$router.push('/authentication/enterprise-certificate/step3')
      } else if (this.perfectState === '3') {
        // 银行信息
        this.$router.push({
          path: '/authentication/enterprise-certificate/step5',
          query: {
            enterpriseName: JSON.parse(userData).enpName
          }
        })
      } else if (this.perfectState === '5' || this.perfectState === '6') {
        // 等待认证
        this.$router.push('/authentication/initialization')
      }
      this.showDialog = false
    },
    handleSelect (path) {
      this.showDialog = true
    },
    handleOpen () {
      // let aside = document.getElementsByTagName('body')
      // if (aside.length > 0) {
      //   aside[0].style.marginBottom = '2px'
      //   setTimeout(() => {
      //     aside[0].style.marginBottom = '0px'
      //   }, 380)
      // }
    },
    handleClose () { },
    // 点击退出按钮Getitem
    handleCommand (command) {
      this.logOut(command)
    },
    toLogin () {
      Removeitem('token')
      Removeitem('userData')
      Removeitem('perfectState')
      Removeitem('topName')
      Removeitem('enterpriseName')
      // 移除本地存储中是否显示浏览器版本的提示
      Removeitem('browserLowTip')
      Removeitem('store')
      sessionStorage.removeItem('browserLowTip')
      this.$router.push({
        path: '/login',
        query: {
          sign: this.$route.query.sign,
          data: this.$route.query.data
        }
      })
    }
  },
  created () {
    // 这里获取用户名的字段有待确认
    let userData = Getitem('userData')
    this.perfectState = JSON.parse(userData).perfectState
    this.realName = JSON.parse(userData).adminName
    this.topName = Getitem('topName')
    this.Role = this.getUserRole()
    this.isAdmin = JSON.parse(userData).role
    if (this.isAdmin !== null) {
      this.menuList[5].secondMenuList.splice(1, 1)
    }
  },
  activated () {
    this.topName = Getitem('topName')
  },
  watch: {
    $route (to, form) {
      let userData = Getitem('userData')
      this.topName = Getitem('topName')
      this.perfectState = JSON.parse(userData).perfectState
    }
  }
  // 增加页面重定向逻辑避免手动输入页面路径
  // beforeRouteEnter (to, from, next) {
  //   next(vm => {
  //     let userData = Getitem('userData')
  //     vm.perfectState = JSON.parse(userData).perfectState
  //   })
  // }
}
</script>

<style scoped lang="less">
@import '~@/assets/less/variables';
.el-header,
.el-footer {
  padding: 0;
}
.authentication {
  height: 100%;
}
.container {
  height: 100%;
  overflow: hidden;
}
.contert {
  height: calc(~'100% - 81px');
  flex: 1;
  overflow: hidden;
}
.el-aside {
  background-color: @theme-blue;
}
.el-main {
  overflow-x: hidden;
  padding: 0;
}
.el-menu {
  border-right: 0;
}
.anywey {
  height: 0;
  width: 0;
}
.title-size {
  font-size: 16px;
}
.el-home {
  text-align: left;
}
.icon {
  display: inline-block;
  width: 17px !important;
  height: 17px !important;
  color: @theme-blue;
  // color: var(--mainColor);
  vertical-align: middle;
  background-repeat: no-repeat;
  background-size: cover;
}
.logo {
  float: left;
  margin: 15px 0 0 56px;
  font-size: 30px;
  text-align: center;
  font-size: 15px;
  font-weight: 400;
  color: rgba(75, 75, 75, 1);
}
.registerTitle {
  margin-left: 31px;
}
.fund-logo {
  width: 137px !important;
  height: 43px !important;
  color: @theme-blue;
  // color: var(--mainColor);
  vertical-align: middle;
}
.logout {
  margin-right: 50px;
  float: right;
  font-size: 16px;
  margin-top: 30px;
  .drop-down {
    cursor: pointer;
    font-size: 16px;
  }
  .toLogin {
    cursor: pointer;
    color: @theme-blue;
    // color: var(--mainColor);
    text-decoration: underline;
  }
}
</style>

<style lang="less">
.authentication.el-submenu__title i {
  color: #fff;
}
.authentication .el-menu-item.is-active {
  color: #fff;
}
.authentication .el-menu-item-group {
  height: 50px !important;
}
.authentication .el-menu-item-group__title {
  padding: 0;
}
.authentication .el-submenu.is-active {
  .el-submenu__title {
    color: #fff;
    background-color: rgba(14, 114, 187, 0.5) !important;
  }
  // 设置当前菜单背景
  .el-menu-item {
    color: #fff;
    background-color: #0d7fd8 !important;
  }
  .el-menu-item.is-active {
    color: #fff;
    background-color: #0a6ac1 !important;
  }
}
</style>
