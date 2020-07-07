<template>
  <div class="enterprise-message">
    <div class="accountnum-main">
      <p class="iconAlign"><i class="el-icon-time"></i></p>
      <p class="midText">证件资料信息 <span class="mainColor"> 审核中</span></p>
      <p class="remindText">审核结果将在 <span class="warnColor">48小时内</span> 通过短信或有邮件的方式通知到您</p>
      <div class="enInfo">
        <svg-icon iconClass='ht_sy_yhs_s' className='iconClass'></svg-icon>
        <span>管理员姓名：{{enterpeiseMessage.realName}}</span>
      </div>
      <div class="dotted"></div>
      <div class="enInfo"><i
          class="el-icon-mobile-phone iconClass"></i><span>管理员电话：{{enterpeiseMessage.userName}}</span>
      </div>
      <div class="dotted"></div>
      <Button class="next-btn" title="刷新" @handleClick="getAdminMessage"></Button>
    </div>
    <loading :loadingShow="loadingShow1"></loading>
  </div>
</template>

<script>
import settings from '@/settings'
import { Setitem } from '@/services/CommonService'
import { setTimeout } from 'timers'
export default {
  data () {
    return {
      enterpeiseMessage: {},
      icons: 'el-icon-warning',
      colorStyle: '',
      id: this.$route.query.id,
      getApplyInfoUrl: settings.apiGateway.getApplyInfo,
      getTokenUrl: settings.apiGateway.getToken,
      status: '',
      loadingShow1: false
    }
  },
  methods: {
    reselect () {
      this.$router.push('/authentication/enterprise-certificate/step1')
    },
    getToken () {
      this.fetch(this.getTokenUrl).then(data => {
        this.userData = data.data
        Setitem('userData', JSON.stringify(this.userData))
        Setitem('token', data.data.token)
        if (data.data.systemRole !== null) {
          this.userRole = data.data.systemRole.toLowerCase()
          Setitem('perfectState', 4)
          this.$router.replace('/' + this.userRole)
        }
      }).catch(data => {
        this.$message.error(data.data.msg)
      })
    },
    getAdminMessage () {
      this.loadingShow1 = true
      this.fetch(this.getApplyInfoUrl).then(data => {
        setTimeout(() => {
          this.loadingShow1 = false
          if (this.enterpeiseMessage.status !== 'Pending') {
            this.$router.push({
              path: '/authentication/finished',
              query: { status: this.enterpeiseMessage.status }
            })
          }
        }, 1000)
        this.enterpeiseMessage = data.data
        // switch (this.enterpeiseMessage.status) {
        //   case 'Pending':
        //     this.icons = 'el-icon-warning'
        //     this.colorStyle = 'color: #0f8eeb'
        //     this.status = '审核中'
        //     break
        //   case 'Rejected':
        //     this.icons = 'el-icon-error'
        //     this.colorStyle = 'color: #f66061'
        //     this.status = '拒绝'
        //     break
        //   case 'Succeed':
        //     this.icons = 'el-icon-success'
        //     this.colorStyle = 'color: #91c557'
        //     this.status = '通过'
        //     break
        // }
      }).catch(data => {
        setTimeout(() => {
          this.loadingShow1 = false
        }, 500)
        if (data.data.code === 2028) {
          this.reselect()
        } else {
          this.$message({
            type: 'error',
            message: data.data.msg
          })
        }
      })
    },
    handleClick () {
      this.getToken()
    }
  },
  created () {
    this.userRole = this.getUserRole()
    this.getAdminMessage()
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/less/variables';
.enterprise-message {
  width: 100%;
  margin: 40px 0;
  .reselect {
    cursor: pointer;
    text-decoration: underline;
    color: @theme-blue;
  }
  .next-btn {
    width: 100%;
    font-size: 18px;
    height: 45px;
    margin: 35px 0 0 0;
    box-shadow: 1px 6px 4px @btn-disabled;
    box-shadow: 1px 6px 4px var(--mainTableHover);
  }
}
.accountnum-main {
  width: 403px;
  margin: 0 auto;
}
.iconAlign {
  color: @theme-blue;
  font-size: 46px;
  text-align: center;
  margin: 33px 0 25px;
}
.midText {
  font-size: 18px;
  color: rgba(75, 75, 75, 1);
  text-align: center;
  margin-bottom: 24px;
}
.mainColor {
  color: @theme-blue;
}
.remindText {
  font-size: 14px;
  // font-family: SimSun;
  color: rgba(162, 162, 162, 1);
  text-align: center;
  margin-bottom: 54px;
}
.warnColor {
  color: #e57171;
  font-weight: bold;
}
.dotted {
  border-top: 1px dotted #000;
  width: 100%;
  height: 1px;
  margin: 21px 0;
}
.status_icon {
  width: 55px;
  height: 60px;
}
.enInfo {
  font-size: 16px;
}
.iconClass {
  margin-left: 50px;
  margin-right: 23px;
  font-size: 28px;
  color: @theme-blue;
  vertical-align: middle;
}
</style>
<style lang="less">
.enterprise-message .dialog-loading-component--loading {
  margin-left: 0 !important;
}
</style>
