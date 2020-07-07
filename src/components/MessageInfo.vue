<!--
消息详情组件：
    props:
        messageType: {
            type: string,
            default: 'Payment'
        }
        transactionCode: ''
-->
<template>
  <!-- 注销消息 -->
  <div class="top-up">
      <BusinessTitle title="消息详情" isShowBack></BusinessTitle>
      <div class="h20"></div>
      <div class="tc fs-18">{{subject}}</div>
      <div class="h20"></div>
      <div class="tc" style="color:#c4c4c4;">{{time}}</div>
      <div class="h10"></div>
      <hr/>
      <div class="h20"></div>
      <div class="tc" v-html="messageBody"></div>
      <div class="h20"></div>
      <div class="h20"></div>
      <div class="h20"></div>
      <div class="btn" v-if="messageType === 'Logout'">
        <Button @handleClick="auditLogout" class="payBtn" title="去 处 理"></Button>
      </div>
      <div class="btn" v-else-if="messageType === 'Payment'">
        <Button @handleClick="payment" class="payBtn" title="去 处 理"></Button>
      </div>
      <div class="btn" v-else-if="messageType === 'AuditApplication'">
        <Button @handleClick="auditApplication" class="payBtn" title="去 处 理"></Button>
      </div>
      <div class="btn" v-else-if="messageType === 'UserAuditApplication'">
        <Button @handleClick="userAuditApplication" class="payBtn" title="去 处 理"></Button>
      </div>
      <div class="btn" v-else-if="messageType === 'BuyOrderPaying'">
        <Button @handleClick="BuyOrderPaying" class="payBtn" title="去 处 理"></Button>
      </div>
      <!--
         messageType enum
        /**
         * 申请取消
         */
        CancelApplication("申请取消"),

        /**
         * 联合发令交易方案待确认
         */
        WaitConfirmSchema("联合发令交易方案待确认),

        /**
         * 联合发令交易待付款
         */
        WaitPayment("联合发令交易待付款"),

        /**
         * 联合发令交易待背书
         */
        WaitEndorse("联合发令交易待背书"),

        /**
         * 联合发令交易待确认签收
         */
        WaitConfirmEndorse("联合发令交易待确认签收"),

        /**
         * 联合发令方案被企业方拒绝
         */
        RejectByEnterprise("联合发令方案被企业方拒绝),

        /**
         * 联合发令申请取消被拒绝
         */
        RejectCancelApplication("联合发令申请取消被拒绝"),

        /**
         * 平台介入申请
         */
        PlatformApplication("平台介入申请),

        /**
         * 开通充值权限申请
         */
        OpenDepositPower("开通充值权限申请),

        /**
         * 操作已超时
         */
        OperationExpired("操作已超时");
        /**
         * 充值成功
         */
        DepositSucceed("充值成功"),

        /**
         * 支付成功
         */
        PaymentSucceed("支付成功"),

        /**
         * 收款成功
         */
        ReceiveSucceed("收款成功")
        /**
         * 提现成功
         */
        WithdrawSucceed("提现成功")
        /**
         * 企业审核
         */
        UserAuditApplication("企业审核")
      -->
      <div class="btn" v-else-if="jointTokenStatusList.indexOf(messageType) !== -1">
        <Button @handleClick="goTokenInfo" class="payBtn" title="去 处 理"></Button>
      </div>
      <div class="btn" v-else-if="messageType === 'OpenDepositPower'">
        <Button @handleClick="goApproveTopUp" class="payBtn" title="去 处 理"></Button>
      </div>
      <!-- <div class="btn" v-else-if="messageType === 'Upgrade'">
         <Button @handleClick="$router.push('/agent/account-upgrade/recode')" class="payBtn" title="去处理"></Button>
      </div>
      <div class="btn" v-else-if="messageType === 'UpgradeSucceed'">
        <Button @handleClick="logOut" class="payBtn" title="重新登录"></Button>
      </div> -->
      <div class="btn" v-else-if="messageType === 'WithdrawAudit'">
        <Button @handleClick="goWithdrawAplly" class="payBtn" title="去 处 理"></Button>
      </div>
      <div class="btn" v-else-if="messageType === 'ReceiveAudit'">
        <Button @handleClick="goReceiveAudit" class="payBtn" title="去 处 理"></Button>
      </div>
      <div class="btn" v-else-if="messageType === 'PaymentAudit'">
        <Button @handleClick="goPaymentAudit" class="payBtn" title="去 处 理"></Button>
      </div>
      <div class="btn" v-else-if="messageType === 'SellOrder'">
        <Button @handleClick="goSellAudit" class="payBtn" title="去 处 理"></Button>
      </div>
      <div class="btn" v-else-if="messageType === 'BuyAuditApply'">
        <Button @handleClick="goBuyAudit" class="payBtn" title="去 处 理"></Button>
      </div>
  </div>
</template>

<script>
import BusinessTitle from '@/components/BusinessTitle'
import BusinessFiltrate from '@/components/BusinessFiltrate'
import settings from '@/settings'
export default {
  data () {
    return {
      time: '',
      subject: '',
      messageBody: '',
      eventId: '',
      status: '',
      power: false,
      getMessageInfoUrl: settings.apiGateway.getMessage + 'info/',
      role: '',
      handled: '',
      sysRoles: '',
      jointTokenStatusList: [
        'OperationExpired',
        'RejectCancelApplication',
        'RejectByEnterprise',
        'WaitConfirmEndorse',
        'WaitEndorse',
        'CancelApplication',
        'WaitConfirmSchema',
        'WaitPayment'
      ]
    }
  },
  props: {
    messageType: {
      type: String,
      default: 'Payment'
    },
    transactionCode: ''
  },
  components: {
    BusinessTitle,
    BusinessFiltrate
  },
  methods: {
    goApproveTopUp () {
      if (this.handled) {
        this.popUpSuccess({
          text: '已被处理完成',
          okBtn: '确定',
          ok: () => {
            this.$store.dispatch('updateCounters')
            this.$router.push('/agent/top-up-permission/approve-list')
          }
        })
      } else {
        this.$store.dispatch('updateCounters')
        this.$router.push({
          name: 'agentTopUpApproveDetail',
          query: {
            code: this.eventId
          }
        })
      }
    },
    goTokenInfo () {
      if (this.handled) {
        this.popUpSuccess({
          text: '已被处理完成',
          okBtn: '确定',
          ok: () => {
            this.$store.dispatch('updateCounters')
            this.$router.push('/' + this.role + '/joint-token-info?code=' + this.eventId)
          }
        })
      } else {
        this.$store.dispatch('updateCounters')
        this.$router.push('/' + this.role + '/joint-token-info?code=' + this.eventId)
      }
    },
    getMessageInfo (transactionCode, type) {
      this.fetch(`${this.getMessageInfoUrl}${transactionCode}`, 'get').then(res => {
        let data = res.data
        this.time = data.createdOn
        this.eventId = data.eventId
        this.subject = data.subject
        this.messageBody = data.messageBody
        this.handled = data.handled
        this.power = data.power
        this.sysRoles = data.sysRoles
      }).catch(data => {
        this.$message.error('数据获取失败')
      })
    },
    // 去处理审批企业信息
    auditApplication () {
      if (this.handled) {
        this.popUpSuccess({
          text: '已被处理完成',
          okBtn: '确定',
          ok: () => {
            this.$router.push('/admin/enterprise-approve')
          }
        })
      } else {
        let roles = ''
        switch (this.sysRoles) {
          case 'Enterprise':
            roles = '企业方'
            break
          case 'Agent':
            roles = '代理商'
            break
          case 'Fund':
            roles = '资金方'
            break
        }
        this.$router.push({
          path: '/admin/enterprise-approve-detail',
          query: {
            id: this.eventId,
            tag: roles
          }
        })
      }
    },
    userAuditApplication () {
      if (this.power) {
        if (this.handled) {
          this.popUpSuccess({
            text: '已被处理完成',
            okBtn: '确定',
            ok: () => {
              this.$router.push(`/${this.role}/authority-apply`)
            }
          })
        } else {
          this.$router.push({
            path: `/${this.role}/authority-apply-detail`,
            query: {
              id: this.eventId
            }
          })
        }
      } else {
        this.$message.error('无权限进行此操作')
      }
    },
    BuyOrderPaying () {
      if (this.handled) {
        this.popUpSuccess({
          text: '已被处理完成',
          okBtn: '确定',
          ok: () => {
            this.$router.push('/enterprise/buy-list')
          }
        })
      } else {
        this.$router.push({
          path: '/enterprise/buy-list',
          query: {
            code: this.eventId
          }
        })
      }
    },
    // 去处理代理商注销
    auditLogout () {
      if (this.handled) {
        this.popUpSuccess({
          text: '已被处理完成',
          okBtn: '确定',
          ok: () => {
            this.$router.push('/admin/agent-approval')
          }
        })
      } else {
        this.$router.push({
          path: '/admin/agent-approval-detail',
          query: {
            code: this.eventId
          }
        })
      }
    },
    // 去处理支付
    payment () {
      if (this.handled) {
        this.popUpSuccess({
          text: '已被处理完成',
          okBtn: '确定',
          ok: () => {
            this.$router.push('/enterprise/payment')
          }
        })
      } else {
        this.$router.push({
          path: '/enterprise/payment-confirm',
          query: {
            txNum: this.eventId
          }
        })
      }
    },
    // 去提现审核
    goWithdrawAplly () {
      if (this.handled) {
        this.popUpSuccess({
          text: '已被处理完成',
          okBtn: '确定',
          ok: () => {
            this.$router.push(`/${this.role}/withdraw-apply-authority`)
          }
        })
      } else {
        this.$router.push({
          path: `/${this.role}/withdraw-apply-authority/detail`,
          query: { code: this.eventId }
        })
      }
    },
    goReceiveAudit () {
      if (this.handled) {
        this.popUpSuccess({
          text: '已被处理完成',
          okBtn: '确定',
          ok: () => {
            this.$router.push(`/${this.role}/proceeds-apply-authority`)
          }
        })
      } else {
        this.$router.push({
          path: `/${this.role}/proceeds-apply-authority/detail`,
          query: { code: this.eventId }
        })
      }
    },
    goPaymentAudit () {
      if (this.handled) {
        this.popUpSuccess({
          text: '已被处理完成',
          okBtn: '确定',
          ok: () => {
            this.$router.push(`/${this.role}/pay-apply-authority`)
          }
        })
      } else {
        this.$router.push({
          path: `/${this.role}/pay-apply-authority/detail`,
          query: { code: this.eventId }
        })
      }
    },
    goSellAudit () {
      if (this.handled) {
        this.popUpSuccess({
          text: '已被处理完成',
          okBtn: '确定',
          ok: () => {
            this.$router.push(`/${this.role}/sale-apply-authority`)
          }
        })
      } else {
        this.$router.push({
          path: `/${this.role}/sale-apply-authority`,
          query: { code: this.eventId }
        })
      }
    },
    goBuyAudit () {
      if (this.handled) {
        this.popUpSuccess({
          text: '已被处理完成',
          okBtn: '确定',
          ok: () => {
            this.$router.push(`/${this.role}/buy-apply-authority`)
          }
        })
      } else {
        this.$router.push({
          path: `/${this.role}/buy-apply-authority`,
          query: { code: this.eventId }
        })
      }
    }
  },
  created () {
    this.role = this.getUserRole()
    this.status = this.getRole()
    this.getMessageInfo(this.transactionCode, this.messageType)
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/less/variables.less';
.top-title {
  width: 100%;
  height:76px;
  line-height:76px;
  text-align: center;
  color:#333333;
  font-size: 22px;
  background-color: #f2f9ff;
  letter-spacing:15px;
  padding-left:15px
}
.tc {
  text-align: center
}
.fs-18 {
  font-size: 18px
}
.fs-20 {
  font-size: 20px
}
.h10 {
  height: 10px;
}
.h20 {
  height: 20px
}
.handle {
  cursor: pointer;
  color: @theme-blue;
  color: var(--mainColor);
  text-decoration: underline
}
.btn {
  width: 211px;
  margin: 0 auto;
  .payBtn {
    width: 211px;
    height: 50px;
    line-height: 50px;
    padding: 0;
    font-size: 18px;
    // margin: 0 auto;
    border: none;
    box-shadow: 1px 6px 4px @btn-disabled;
    box-shadow: 1px 6px 4px var(--mainTableHover);
    // background-color: @theme-blue;
    // background-color: var(--mainColor);
  }
}
</style>
<style lang="less">
@import '~@/assets/less/variables.less';
.font-bold {
  font-weight: bold;
  color: @theme-blue;
  color: var(--mainColor);
}
</style>
