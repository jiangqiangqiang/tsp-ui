<template>
  <div class="account-num">
    <Header></Header>
    <div class="accountnum-main">
      <InitializeHeader :stepInfo="stepInfo"></InitializeHeader>
      <div class="content">
       <div class="CA-certification">
          <img v-if="checkStatusAwait" class="await" src="@/assets/img/loadingIcon.gif" alt="">
          <img v-else class="finish" src="@/assets/img/succeedIcon.gif" alt="">
          <span class="accountnum-title">企业信息审核</span>
          <span v-if="checkStatusAwait" class="prompt-message">请等待系统审核,预计耗时<span class="color-red">1个工作日</span></span>
          <span v-else class="prompt-message">已完成</span>
        </div>
        <span class="line"></span>
        <div class="CA-certification">
          <img v-if="openCaAwait" class="await" src="@/assets/img/loadingIcon.gif" alt="">
          <img v-else class="finish" src="@/assets/img/succeedIcon.gif" alt="">
          <span class="accountnum-title">CA认证</span>
          <span v-if="openCaAwait" class="prompt-message">系统自动申请,操作预计耗时<span class="color-red">1分钟</span></span>
          <span v-else class="prompt-message">已完成</span>
        </div>
        <span class="line"></span>
        <div class="open-payment">
          <img v-if="true" class="await" src="@/assets/img/loadingIcon.gif" alt="">
          <img v-if="false" class="finish" src="@/assets/img/succeedIcon.gif" alt="">
          <span class="accountnum-title">开通三方支付</span>
          <div style="margin: 29px 0 0 62px;">
            <div><span class="payment-dot"></span><span class="payment-title">线下签订协议</span><span class="prompt-message">预计<span class="color-red">2工作日</span>内可申请完成</span></div>
            <div><span class="payment-dot"></span><span class="payment-title">三方开户</span><span class="prompt-message">系统自动申请,操作预计耗时<span class="color-red">1分钟</span></span></div>
            <div><span class="payment-dot"></span><span class="payment-title">设置支付密码</span><span class="prompt-message">系统自动申请,操作预计耗时<span class="color-red">1分钟</span></span></div>
          </div>
        </div>
        <!-- <span class="line"></span> -->
        <!-- <div class="open-chain">
          <img v-if="openChainAwait" class="await" src="@/assets/img/loadingIcon.gif" alt="">
          <img v-else class="finish" src="@/assets/img/succeedIcon.gif" alt="">
          <span class="accountnum-title">链账户建立</span>
          <span v-if="openChainAwait" class="prompt-message">系统自动申请,操作预计耗时<span class="color-red">1分钟</span></span>
          <span v-else class="prompt-message">已完成</span>
        </div> -->
      </div>
      <Button :disabled="openChainAwait" class="accountnum-button" @handleClick="goNext" title="下一步"></Button>
    </div>
    <el-dialog
      title="抱歉的通知您"
      :visible.sync="centerDialogVisible"
      width="500px"
      top="300px"
      :show-close='false'
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      center>
      <div>
        <p>您的企业信息审核已被<span class="color-red">拒绝</span>。</p>
        <p class="refuse-reason">拒绝原因: <span class="color-red">{{this.refusalReason}}</span></p>
        <p style="line-height:20px;">请再次核对企业信息,按照拒绝原因进行修改并再次提交。有任何疑问请详询官方客服电话101-89532114,给您造成的不便请谅解。</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <Button  title="确定" class="dialogBtn" @handleClick="goEnterpriseInfo"></Button>
      </span>
    </el-dialog>
    <div>
      <el-dialog
        :visible.sync="waitReview"
        width="500px"
        top="300px"
        :show-close='false'
        :close-on-click-modal='false'
        :close-on-press-escape='false'
        center>
        <div class="wait-review">
          <i class="el-icon-circle-check-outline"></i>
          <p style="font-size: 20px; font-weight:600">您的企业资料已提交成功</p>
          <p class="refuse-reason">后台正在审核中,我们会在第一时间短信通知您审核结果</p>
          <p style="line-height:15px;">现在您可以关闭页面, 感谢您的使用</p>
        </div>
        <span slot="footer" class="dialog-footer">
        <div style="margin-bottom: 20px">
          <el-button class="stay-account-num" @click="waitReview=false">留在本页面</el-button>
          <Button  title="关闭" class="dialogBtn" @handleClick="closeWin"></Button>
        </div>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import settings from '@/settings'
import Header from '@/components/Header'
import InitializeHeader from '@/components/InitializeHeader'
import { Removeitem, Setitem, Getitem } from '@/services/CommonService'
export default {
  name: 'accountnum',
  components: { Header, InitializeHeader },
  data () {
    return {
      // 步骤
      stepInfo: {
        list: ['管理员认证', '企业认证', '账号初始化', '初始化完成'],
        step: 3
      },
      // 企业审核状态
      checkStatusAwait: true,
      // 链账户状态
      openChainAwait: true,
      // ca状态
      openCaAwait: true,
      // 检测企业信息是否通过
      checkAuditSatus: settings.apiGateway.checkAuditSatus,
      // 开通链账户
      openChain: settings.apiGateway.openChain,
      // 开通ca
      openCa: settings.apiGateway.openCa,
      // 定时器id
      timer: null,
      // 拒绝原因
      refusalReason: '这里是拒绝原因,长度不超过30字',
      // 企业id
      userId: '5555',
      // 弹窗标志
      centerDialogVisible: false,
      waitReview: false
    }
  },
  beforeRouteEnter (to, from, next) {
    let perfectState = parseInt(Getitem('perfectState'))
    next(vm => {
      // 通过 `vm` 访问组件实例
      if (perfectState < 4) {
        let nextPath = vm.$store.state.initializationStepRoute[perfectState - 1]
        vm.$router.push(nextPath)
      } else {
        vm.$router.push(from.fullPath)
      }
    })
  },
  beforeRouteLeave (to, from, next) {
    if (to.path === '/initialize-finish') {
      next()
    } else if (to.path === '/enterprise-info') {
      next()
    } else if (to.path === '/login') {
      Removeitem('token')
      Removeitem('userData')
      Removeitem('perfectState')
      Removeitem('topName')
      Removeitem('enterpriseName')
      // 移除本地存储中是否显示浏览器版本的提示
      Removeitem('browserLowTip')
      Removeitem('store')
      sessionStorage.removeItem('browserLowTip')
      next()
    } else {
      let perfectState = parseInt(Getitem('perfectState'))
      if (perfectState > 3) {
        next()
      } else {
        next(false)
      }
    }
  },
  created () {
    // 按请求顺序 审核 > 开通ca > 开通链账户
    this.checkStatus()
  },
  methods: {
    closeWin () {
      window.location.href = 'about:blank'
      window.close()
    },
    goNext () {
      Setitem('perfectState', 4)
      this.$router.push('/initialize-finish')
    },
    checkStatus () {
      // clearInterval(this.timer)
      this.fetch(this.checkAuditSatus).then(data => {
        // 审核通过
        if (data.data.status === 'Succeed') {
          // clearInterval(this.timer)
          this.checkStatusAwait = false
          this.getopenCa()
        // 审核拒绝
        } else if (data.data.status === 'Rejected') {
          this.waitReview = false
          // 要弹窗
          this.refusalReason = data.data.refusalReason
          this.userId = data.data.userId
          // clearInterval(this.timer)
          this.centerDialogVisible = true
        // 审核等待 'Pending'
        } else {
          this.waitReview = true
          // this.timer = setInterval(this.checkStatus, 1000)
        }
      }).catch(res => {
        // this.timer = setInterval(this.checkStatus, 60000)
        this.$message.error(res.data.msg)
      })
    },
    getopenChain () {
      this.fetch(this.openChain, 'post').then(data => {
        this.openChainAwait = false
      }).catch(data => {
        // 重复请求用户已开通链账户的情况通过
        if (data.data.code === -1) {
          this.openChainAwait = false
        } else {
          this.$message.error(data.data.msg)
        }
      })
    },
    getopenCa () {
      this.fetch(this.openCa, 'post').then(data => {
        this.openCaAwait = false
        this.getopenChain()
      }).catch(data => {
        // 重复请求用户已开通ca的情况也通过
        if (data.data.code === 4001) {
          this.getopenChain()
          this.openCaAwait = false
        } else {
          this.$message.error(data.data.msg)
        }
      })
    },
    goEnterpriseInfo () {
      this.centerDialogVisible = false
      Setitem('perfectState', 2)
      this.$router.push({
        path: '/enterprise-info',
        query: {
          userId: this.userId
        }
      })
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/variables';
.accountnum-main {
  width: 700px;
  margin: 0 auto;
  .content {
    width: 444px;
    margin: 58px auto 0;
    .CA-certification {
      margin: 24px 0 20px 0;
    }
    .open-payment {
      margin: 24px 0 58px 0;
      div {
        margin-bottom: 26px;
        .payment-title {
          font-size: 16px;
        }
      }
      .payment-dot {
        display: inline-block;
        margin-right: 14px;
        width: 10px;
        height: 10px;
        // background: #0f8fea;
        background: #c1c1c1;
        border-radius: 50%
      }
    }
    .open-chain{
      .open-chain-finsh-butten {
        width: 131px;
        height: 38px;
        margin-left: 175px;
        background-color: @theme-blue;
        background-color: var(--mainColor);
        border: none;
      }
    }
    .accountnum-title {
      font-size: 16px;
      font-weight: 600;

    }
    .prompt-message {
      float: right;
      font-size: 14px;
      color: #a2a2a2;
      vertical-align: middle;
    }
    .line {
      display: inline-block;
      width: 442px;
      border-top: 1px dashed #6c6c6c;
      z-index: 9;
    }
    .color-red {
      color: #f85452;
    }
    .await {
      width: 22px;
      height: 22px;
      margin: -5px 24px 0 0;
    }
    .finish {
      width: 22px;
      height: 22px;
      margin: -5px 24px 0 0;
    }
  }
  .accountnum-button {
    width: 400px;
    height: 45px;
    font-size: 18px;
    margin: 56px 0 0 150px;
    box-shadow: 1px 6px 4px @btn-disabled;
    box-shadow: 1px 6px 4px var(--mainTableHover);
    border: none;
    box-shadow: 1px 6px 4px @btn-disabled;
    box-shadow: 1px 6px 4px var(--mainTableHover);
  }
}
.color-red {
  color: #db3c36;
}
.refuse-reason {
  margin-top: 15px;
  margin-bottom: 15px;
  line-height: 15px;
}
.dialog-footer {
  .dialogBtn{
    width: 210px;
    height: 45px;
    font-size: 18px;
    background-color: @theme-blue;
    background-color: var(--mainColor);
    border-color: @theme-blue;
    border-color: var(--mainColor);
  }
}
.wait-review {
  text-align: center;
  font-size: 16px;
}
.stay-account-num {
  // text-decoration: underline;
  // margin-right:10px;
  // color: @theme-blue;
  // cursor: pointer;
  color: @theme-blue;
  cursor: pointer;
  width: 210px;
  height:45px;
  border-color: @theme-blue;
}
.el-icon-circle-check-outline {
  color: #79be3d;
  font-size: 70px;
  margin-bottom: 20px;
}
</style>
<style lang="less">
.account-num{
  .el-dialog{
    position:absolute;
    top:50%;
    left:50%;
    margin-top:-150px!important;
    margin-left:-188px;
    // width:576px;
    // height:300px;
  }
}
</style>
