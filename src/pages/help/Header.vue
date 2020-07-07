
<template>
  <div class="header">
    <div class="top-bar">
      <div class="logo">
        <svg-icon iconClass='zjf_logo' className='image enterprise-logo'></svg-icon>
      </div>
      <span class="versions">企业版</span>
      <div class="logout" v-if="realName">
        <span class="drop-down"><span class="drop-down">{{roleClassify}}</span>{{realName || '用户'}}</span>
      </div>
      <span class="toLogin" @click="toLogin" v-else>请登录</span>
    </div>
  </div>
</template>

<script>
import { Getitem } from '@/services/CommonService.js'

export default {
  props: {
  },
  name: 'Header',
  components: {
  },
  data () {
    return {
      roleClassify: '',
      styleClass: 'image',
      realName: ''
    }
  },
  created () {
    let userData = Getitem('userData')
    this.realName = userData ? JSON.parse(userData).adminName : ''
    var classify = userData ? JSON.parse(userData).role : ''
    classify === 'Admin' ? this.roleClassify = '管理员: ' : classify === 'SuperAdmin' ? this.roleClassify = '管理员: ' : this.roleClassify = '操作员: '
  },
  updated () {
  },
  methods: {
    toLogin () {
      this.$router.push('/login')
    }
  },
  computed: {

  }
}
</script>

<style scoped lang="less">
.header {
  position: relative;
  background-color: #fcfcfc;
  border-bottom: 1px solid #f1f1f3;
}
.top-bar {
  width: 1340px;
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
  p {
    height: 32px;
    line-height: 32px;
    margin-bottom: 3px;
    color: #118eea;
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
  color: #118eea;
  background-size: cover;
}
.invite-logo {
  display: inline-block;
  width: 23px !important;
  height: 19px !important;
  color: #118eea;
  vertical-align: middle;
  background-repeat: no-repeat;
  background-size: cover;
  margin-right: 10px;
}
.toLogin {
  cursor: pointer;
  color: #118eea;
  text-decoration: underline;
  float: right;
  line-height: 80px;
}
</style>
