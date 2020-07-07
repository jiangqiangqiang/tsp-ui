<template>
  <div class="authentication">
    <el-container class="container">
      <el-header style="height:80px;background:#fcfcfc;border-bottom: 1px solid #f1f1f3">
        <div style="width: 1340px;margin:0 auto;">
          <div class="logo">
            <svg-icon iconClass='zjf_logo' className='fund-logo'></svg-icon>
            <span class="registerTitle">用户注册</span>
          </div>
          <div style="float:right" class="logout">
            <span>已有账户，</span>
            <span class="toLogin" @click="toLogin">请登录</span>
          </div>
        </div>
      </el-header>
      <el-container style="width: 1370px;margin: 0 auto" class="contert">
        <el-main>
          <div class="topIcon">
            <svg-icon :iconClass="type==='outInvite'?'yys_lj':'gg_bc'" className='icon'></svg-icon>
          </div>
          <p class="mindTitle">{{type==='outInvite'?'链接已失效！':'您的账号不属于任何企业！'}}</p>
          <div :class="type==='outInvite'?'mindContent':'mindContent wmin'">
            {{type==='outInvite'?'由于未在链接有效期内注册，或此链接已被其他用注册，链接已失效！请联系您的邀请人，重新发送链接！':'由于您的链接没有与任何企业产生关联，所以无法进行其他操作！请联系您的企业管理员，邀请您加入企业。'}}
          </div>
          <div class="closeBtn"><Button class="close-button" @handleClick="toLogin" title="关闭页面"></Button></div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Aside from '@/components/Aside.vue'
// import { Removeitem } from '@/services/CommonService'
// import settings from '@/settings'
export default {
  name: 'sysIndex',
  data () {
    return {
      type: ''
    }
  },
  components: {
    Header,
    Footer,
    Aside
  },
  methods: {
    toLogin () {
      this.logOut()
    }
  },
  created () {
    this.type = this.$route.query.type
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/less/variables';
.topIcon {
  width: 66px;
  height: 66px;
  margin: 0 auto;
  margin-top: 54px;
  margin-bottom: 18px;
  .icon {
    width: 66px !important;
    height: 66px !important;
  }
}
.mindTitle {
  font-size: 18px;
  font-weight: bold;
  color: rgba(75, 75, 75, 1);
  margin-bottom: 37px;
  text-align: center;
}
.mindContent {
  width: 498px;
  height: 116px;
  margin: 0 auto;
  font-size: 16px;
  color: rgba(75, 75, 75, 1);
  line-height: 36px;
  text-align: center;
}
.wmin {
  width: 478px;
}
.closeBtn {
  width: 403px;
  height: 50px;
  margin: 0 auto;
  .close-button {
    width: 100%;
    height: 100%;
    background: #ffffff;
    border: 1px solid @theme-blue;
    border: 1px solid var(--mainColor);
    color: @theme-blue;
    color: var(--mainColor);
    font-size: 18px;
  }
  .close-button:hover {
    background: #ffffff;
    color: @theme-blue;
    color: var(--mainColor);
  }
}
.el-header,
.el-footer {
  padding: 0;
}
.container {
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
  color: var(--mainColor);
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
  color: var(--mainColor);
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
    color: var(--mainColor);
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
