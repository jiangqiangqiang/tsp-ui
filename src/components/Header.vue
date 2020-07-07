<!--
props: {
  // 除了图标其他均不显示
  showElse: {
    type: Boolean,
    default: true
  },
  // 显示message图标
  showMessage: {
    type: Boolean,
    default: true
  }
}
-->
<template>
  <div class="header">
    <div class="top-bar">
      <div class="logo">
        <svg-icon iconClass='zjf_logo' :className='styleClass'></svg-icon>
      </div>
      <span v-if="showElse && system !=='运营商'" class="versions">{{system}}: </span>
      <span v-else class="versions">&nbsp;</span>
      <span>{{companyName}}</span>
      <div v-if="showElse" class="logout">
        <!-- <svg-icon v-if="isShowInvite" :iconClass="Role === 'fund' ? 'zjf_yqjr' : Role === 'agent' ? 'dls_yqjr' : 'qyf_yqjr'" className="invite-logo" @click="handleInvite"></svg-icon> -->
        <svg-icon v-if="showMessage" :iconClass="$store.state.unreadMessage > 0 ? 'sy_yxx' : 'sy_wxx'"
          className="email-show" @click="handleClick"></svg-icon>
        <el-dropdown placement="bottom" :show-timeout="showTimeout" @command="handleCommand" size="medium">
          <span class="drop-down"><span class="drop-down">{{roleClassify}}</span>{{realName || '用户名'}}<i
              class="el-icon-arrow-down el-icon--right"></i></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>&nbsp;退出登录&nbsp; </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <invite-pop-up v-if="isShowInvite" :setPsdVisible="invitePopUpShow" @handleClose="invitePopUpShow = false">
    </invite-pop-up>
  </div>
</template>

<script>
import { Getitem } from '../services/CommonService.js'
import settings from '@/settings'
import InvitePopUp from '@/components/InvitePopUp.vue'

export default {
  props: {
    showElse: {
      type: Boolean,
      default: true
    },
    showMessage: {
      type: Boolean,
      default: true
    }
  },
  name: 'Header',
  components: {
    InvitePopUp
  },
  data () {
    return {
      system: '',
      pageSize: 10,
      companyName: JSON.parse(Getitem('userData')).enpName,
      pageSizes: settings.pageSizes,
      pageNo: 1,
      totalCnt: 0,
      init: '',
      // 展开下拉菜单的延时
      showTimeout: 10,
      roleClassify: '',
      // 用户名
      realName: '',
      styleClass: 'image',
      Role: '',
      perfectState: '',
      invitePopUpShow: false,
      getMessageListUrl: settings.apiGateway.getMessageList,
      getEnterpriseUrl: settings.apiGateway.getEnterprise,
      getInitUrl: settings.apiGateway.getInit
    }
  },
  created () {
    // this.getInfo()
    // this.getInit()
    // 这里获取用户名的字段有待确认
    let userData = Getitem('userData')
    this.realName = JSON.parse(userData).adminName
    var classify = JSON.parse(userData).role
    classify === 'Admin' ? this.roleClassify = '管理员: ' : classify === 'SuperAdmin' ? this.roleClassify = '管理员: ' : this.roleClassify = '操作员: '
    this.perfectState = JSON.parse(userData).perfectState
    this.Role = this.getUserRole()
    this.setSystem(this.Role)
    // 过滤如果显示收件图标就获取未读信息
    if (this.showMessage) {
      this.getMessageList()
    }
  },
  updated () {
  },
  watch: {
    $route () {
      // 这里获取用户名的字段有待确认
      let userData = Getitem('userData')
      var classify = JSON.parse(userData).role
      classify === 'Admin' ? this.roleClassify = '管理员: ' : classify === 'SuperAdmin' ? this.roleClassify = '管理员: ' : this.roleClassify = '操作员: '
      this.realName = JSON.parse(userData).adminName
      this.Role = this.getUserRole()
      this.perfectState = JSON.parse(userData).perfectState
      this.setSystem(this.Role)
      // this.iamge = this.getImages(this.Role)
      // 过滤如果显示收件图标就获取未读信息
      if (this.showMessage) {
        this.getMessageList()
      }
    }
  },
  methods: {
    // getInit () {
    //   this.fetch(this.getInitUrl).then(data => {
    //     this.init = data.data
    //     this.$store.commit('setInit', this.init)
    //   }).catch(data => {
    //     this.$message({
    //       type: 'error',
    //       message: data.data.msg
    //     })
    //   })
    // },
    // getInfo () {
    //   this.fetch(this.getEnterpriseUrl).then(data => {
    //     this.companyName = data.data.name
    //     this.$store.commit('setAdminMobile', data.data.adminMobile)
    //   }).catch(data => {
    //     this.$message({
    //       type: 'error',
    //       message: data.data.msg
    //     })
    //   })
    // },
    // 获取信息中心的提示消息
    getMessageList () {
      let userData = JSON.parse(Getitem('userData'))
      if (userData) {
        if (userData.perfectState < 4 || userData.perfectState === '5' || userData.perfectState === '6') {
          this.logOut()
          this.$router.push('/login')
          return
        }
      }
      let messageStatus = 'reading'
      this.fetch(`${this.getMessageListUrl}${messageStatus}/${this.pageNo - 1}/${this.pageSize}`).then(data => {
        this.totalCnt = data.data.totalElements
        this.$store.commit('setUnreadMessage', this.totalCnt)
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    // 点击退出按钮Getitem
    handleCommand (command) {
      this.logOut(command)
    },
    handleClick () {
      if (this.Role === 'admin') {
        this.$router.push('/admin/message')
      } else if (this.Role === 'agent') {
        this.$router.push('/agent/message')
      } else if (this.Role === 'fund') {
        this.$router.push('/fund/message')
      } else if (this.Role === 'enterprise') {
        this.$router.push('/enterprise/message')
      } else {
        return false
      }
    },
    setSystem (role) {
      switch (role) {
        case 'fund':
          this.system = '资金方'
          this.styleClass += ' fund-logo'
          break
        case 'enterprise':
          this.system = '企业方'
          this.styleClass += ' enterprise-logo'
          break
        case 'agent':
          this.system = '代理商'
          this.styleClass += ' agent-logo'
          break
        case 'admin':
          this.system = '运营商'
          this.styleClass += ' admin-logo'
          break
        case 'service':
          this.system = '服务商'
          this.styleClass += ' admin-logo'
          break
        case 'allocator':
          this.system = '垫资方'
          this.styleClass += ' admin-logo'
          break
        case 'bonus':
          this.system = '分红池'
          this.styleClass += ' admin-logo'
          break
        default:
          this.system = '好快通宝'
          break
      }
    },
    handleInvite () {
      this.invitePopUpShow = true
    }
  },
  computed: {
    isIE () {
      return this.$store.state.isIE
    },
    isShowInvite () {
      if (this.Role && this.perfectState === '4') {
        return this.Role === 'fund' || this.Role === 'enterprise' || this.Role === 'agent' || this.Role === 'admin' || this.Role === 'service'
      } else {
        return false
      }
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/less/variables';
.header {
  position: relative;
  background-color: #fcfcfc;
  border-bottom: 1px solid #f1f1f3;
}
.top-bar {
  width: 100%;
  min-width: 1340px;
  height: 80px;
  margin: 0 auto;
  padding: 0 15px;
  clear: both;
  overflow: hidden;
  box-sizing: border-box;
}
.logo {
  float: left;
  margin: 15px 0 0 30px;
  font-size: 30px;
  text-align: center;
  // line-height: 0;
  p {
    height: 32px;
    line-height: 32px;
    margin-bottom: 3px;
    color: @theme-blue;
    color: var(--mainColor);
  }
  span {
    color: #b8b8b8;
    font-size: 14px;
  }
}
.logout {
  margin-right: 50px;
  cursor: pointer;
  float: right;
  margin-top: 30px;
  display: flex;
  align-items: center;
  //line-height: 75px;
  .drop-down {
    cursor: pointer;
    font-size: 16px;
  }
}
.versions {
  display: inline-block;
  padding: 30px 0 0 30px;
}
.email-show,
.email-hidden {
  display: inline-block;
  width: 23px !important;
  height: 19px !important;
  vertical-align: middle;
  background-repeat: no-repeat;
  background-size: cover;
}
.email-show {
  margin-right: 10px;
}
.email-hidden {
  margin-right: 10px;
}
.image {
  width: 137px !important;
  height: 43px !important;
  vertical-align: middle;
  // margin: 20px 0 0 54px;
  // float: left;
}
.admin-logo,
.agent-logo,
.fund-logo,
.enterprise-logo {
  color: @theme-blue;
  color: var(--mainColor);
  background-size: cover;
}
.invite-logo {
  display: inline-block;
  width: 23px !important;
  height: 19px !important;
  color: @theme-blue;
  color: var(--mainColor);
  vertical-align: middle;
  background-repeat: no-repeat;
  background-size: cover;
  margin-right: 10px;
}
</style>
