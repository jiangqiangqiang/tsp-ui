<template>
  <div class="withdraw-apply-detail">
    <BusinessTitle title="提现申请审核" isShowBack></BusinessTitle>
    <div class="waitApply">等待审核</div>
    <div class="waitApplyTime">剩余 ：<span class="timeColor">&nbsp;{{cutTime | setTimeHour}}&nbsp;</span>时<span
        class="timeColor">&nbsp;{{cutTime | setTimeMinutes}}&nbsp;</span>分<span
        class="timeColor">&nbsp;{{cutTime | setSecond}}&nbsp;</span>秒</div>
    <div class="OPE_Name">操作员&nbsp;：{{withdraw.operator}}</div>
    <div class="apply-detail--message">
      <ul :style="{height: (withdraw.remark ? '275px' : '234px')}">
        <li>企业名称</li>
        <li>{{withdraw.enterpriseName}}</li>
        <li>银行账户</li>
        <li>{{withdraw.bankCard}}
          <span class="bankImg">
            <img class="bank-icon" :src="selectSrc" alt="银行图标">
            <span class="bankName">{{withdraw.bankName}}</span>
          </span>
        </li>
        <li>提现金额</li>
        <li>{{withdraw.amount | toThousands}}</li>
        <li>服务费
          <el-tooltip class="goldHelp" effect="light" placement="right">
            <div slot="content">
              <span v-if="role === 'enterprise'">
                服务费金额为每笔提现金额的{{serviceWithdrawFeeRate}}%，不足5元按5元计算。<br />通过内扣的形式，采用T+1的赎回方式。
              </span>
              <span v-else>
                每笔提现固定收取2元服务费。
              </span>
            </div>
            <i class="el-icon-question"></i>
          </el-tooltip>
        </li>
        <li>{{withdraw.withdrawFee | toThousands}}</li>
        <li class="change-color" style="height:63px;lineHeight:63px">实际到账金额</li>
        <li class="change-color" style="height:63px;lineHeight:30px"><span class="themeColor">{{withdraw.realAmount | toThousands}}</span>
          <p class="cnfnot">{{withdraw.realAmount || 0 | amountToChinese}}</p>
        </li>
        <li v-if="withdraw.remark">备注</li>
        <li v-if="withdraw.remark">{{withdraw.remark}}</li>
      </ul>
    </div>
    <!-- <div class="remarkItem" v-if="withdraw.remark">备注说明：{{withdraw.remark}}</div> -->
    <div class="warning-text">
      <span>提示：预计下一个工作日到账，请注意查收。</span><br>
    </div>
    <div class="dotted"></div>
    <!-- 支付密码 -->
    <div class="payPwd">
      <span class="pay-psd1">支付密码</span>
      <input type="text" class="is-hidden" />
      <input type="password" class="is-hidden" name="txtPassword" />
      <input type="password" class="psd-input widthPwd" name="txtPassword" v-model="password" placeholder="请输入支付密码"
        autocomplete="new-password" autocapitalize="off" />
      <span class="forget-psd" @click="forgetPsdVisible=true">忘记支付密码？</span>
    </div>
    <div class="btn">
      <Button class="withdraw-btn" @handleClick="agreeWithdraw('Succeed')" title="通过" :disabled="!password"></Button>
      <Button class="withdraw-btn whiteBtn" @handleClick="rejectDialog=true" title="拒绝提现"></Button>
    </div>
    <div class="dialog">
      <el-dialog :visible.sync="rejectDialog" center width="568px" top="350px">
        <p style="text-align:center;margin: 20px 0 ;font-size: 20px;">拒绝提现？</p>
        <p style="text-align:center;margin: 20px 0 9px;font-size: 16px;">确定要拒绝由操作员 <span
              class="payeeName">{{withdraw.operator}} </span>的提现请求吗？</p>
        <div slot="footer" class="dialog-footer">
          <Button class="confirm-btn" @handleClick="agreeWithdraw('Reject')" title="确定"></Button>
          <Button class="confirm-btn" @handleClick="rejectDialog = false" title="取消"></Button>
        </div>
      </el-dialog>
    </div>
    <!-- 验证手机弹窗 -->
    <div>
      <el-dialog :visible.sync="succeedDialog" center width="568px" top="-134px" :close-on-click-modal="false"
        :close-on-press-escape="false">
        <div class="password">
          <p class="prompt">验证手机号</p>
          <div class="codeItem">
            <span class="pay-psd">联系人手机号</span>
            <input type="text" class="psd-input dis longW" :value="withdraw.phonrNum" disabled />
          </div>
          <div class="codeItem" style="marginBottom:19px;">
            <span class="pay-psd">短信验证码</span>
            <input type="text" class="psd-input" v-model="smCode" placeholder="请输入短信验证码" autocomplete="new-password"
              autocapitalize="off" />
            <el-button class="verification-code" :disabled="!codeStatus" @click="getCode" :loading="codeLoading">
              {{codeStatus? (codeLoading ? '':'获取验证码') : `${codeTime}秒后获取`}}</el-button>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <Button class="confirm-btn" @handleClick="withdrawOrder('Succeed')" :title="isLoading?'正在验证':'确定'"
            :disabled="!smCode" :isLoading="isLoading"></Button>
          <Button class="confirm-btn" @handleClick="succeedDialog = false" title="取消"></Button>
        </div>
      </el-dialog>
    </div>
    <ForgetPasswordPop :dialogVisible="forgetPsdVisible" @handleClose="forgetPsdVisible=false"></ForgetPasswordPop>
    <NOPayPassword :setPsdVisible="!hasPassword" @handleClose="handleClose"></NOPayPassword>
    <loading :loadingShow="loadingShow"></loading>
  </div>
</template>

<script>
import BusinessTitle from '@/components/BusinessTitle'
import NOPayPassword from '@/components/NOPayPassword'
import ForgetPasswordPop from '@/components/ForgetPasswordPop'
import settings from '@/settings'
import BankTypes from '@/services/BankType'
export default {
  components: {
    BusinessTitle,
    ForgetPasswordPop,
    NOPayPassword
  },
  data () {
    return {
      loadingShow: false,
      isLoading: false,
      codeLoading: false,
      withdraw: {
        code: '',
        bankName: '',
        enterpriseName: '',
        bankCard: '',
        amount: '',
        withdrawFee: '',
        realAmount: '',
        timeStr: '',
        operator: '',
        remainTime: 0
      },
      codeStatus: true,
      codeTime: 120,
      smCode: '',
      time: null,
      hasPassword: true,
      // 短信验证码
      getSendCodeUrl: settings.apiGateway.adminSmsCode,
      password: '',
      role: '',
      cutTime: '0',
      selectSrc: '',
      // 忘记支付密码弹窗
      forgetPsdVisible: false,
      // 确认发送支付请求弹窗
      succeedDialog: false,
      // 拒绝发送支付请求弹窗
      rejectDialog: false,
      getWithdrawUrl: settings.apiGateway.withdrawInfo,
      // 检测账户是否设置支付密码
      checkIsSetPayPasswordUrl: settings.apiGateway.checkIsSetPayPassword,
      // 提现审核接口
      postWithdrawAudit: settings.apiGateway.withdrawAuditPost,
      // 提现短信发送
      withdrawMsgUrl: settings.apiGateway.withdrawMsg,
      // 重新获取验证码
      reSendwithdrawMsgUrl: settings.apiGateway.reSendwithdrawMsg
    }
  },
  methods: {
    handleClose () {
      this.hasPassword = true
      this.password = ''
    },
    closePayPassword () {
      this.succeedDialog = false
      this.password = ''
    },
    ForgetPsd () {
      this.forgetPsdVisible = true
    },
    getPassword (password) {
      this.password = password
    },
    // 验证码倒计时
    codeCountDown () {
      this.codeStatus = false
      this.time = setTimeout(() => {
        this.codeTime--
        if (this.codeTime < 1) {
          this.codeStatus = true
          this.codeTime = 120
          clearTimeout(this.time)
        } else {
          this.codeCountDown()
        }
      }, 1000)
    },
    // 请求验证码接口
    getCode () {
      this.codeLoading = true
      this.fetch(`${this.reSendwithdrawMsgUrl}${this.withdraw.withdrawId}`, 'post').then(data => {
        this.codeLoading = false
        this.$message.success('发送成功,请注意查收!')
        this.codeCountDown()
      }).catch(data => {
        this.codeLoading = false
        this.$message.error(data.data.data)
      })
    },
    agreeWithdraw (status) {
      if (this.withdraw.status === 'Sending') {
        this.succeedDialog = true
        this.isLoading = false
        clearTimeout(this.time)
        this.codeCountDown()
        return
      }
      let withdrawData = {
        txId: this.$route.query.code,
        password: this.password,
        status: status
      }
      this.fetch(`${this.postWithdrawAudit}`, 'post', withdrawData).then(data => {
        if (status === 'Succeed') {
          this.codeCountDown()
          this.isLoading = false
          this.succeedDialog = true
        } else {
          this.$router.push(`/${this.role}/withdraw-apply-authority`)
          this.$store.dispatch('updateCounters')
        }
      }).catch(data => {
        this.$message.error(data.data.msg)
      })
    },
    withdrawOrder (status) {
      this.isLoading = true
      this.fetch(`${this.withdrawMsgUrl}${this.withdraw.withdrawId}/${this.smCode}`, 'post').then(data => {
        this.isLoading = false
        this.$router.push({
          path: `/${this.role}/withdraw-apply-authority/withdrawSuccess`,
          query: {
            code: this.$route.query.code,
            amount: this.withdraw.realAmount
          }
        })
      }).catch(data => {
        this.isLoading = false
        this.$message.error(data.data.data)
      })
    },
    getWithdrawOrder () {
      this.fetch(`${this.getWithdrawUrl}/${this.$route.query.code}`).then(data => {
        this.withdraw = data.data
        this.withdraw.status === 'Sending' && (this.succeedDialog = true)
        this.withdraw.status === 'Sending' && this.codeCountDown()
        if (this.withdraw.status === 'Failed' || this.withdraw.status === 'Expired' || this.withdraw.status === 'BankRebut') {
          this.$router.push('/enterprise/withdraw-apply-authority')
          return
        }
        this.selectSrc = '' + BankTypes[this.withdraw.bankCode] || ''
        this.cutTime = Math.ceil(this.withdraw.remainTime / 1000)
        this.setTime()
      }).catch(data => {
        this.$message.error('数据获取失败')
      })
    },
    setTime () {
      const that = this
      let timer = setInterval(() => {
        if (that.cutTime > 0) {
          that.cutTime--
        }
        if (that.cutTime <= 0) {
          clearInterval(timer)
        }
      }, 1000)
    }
  },
  computed: {
    isNotAdmin () {
      return this.role !== 'admin'
    }
  },
  created () {
    this.role = this.getUserRole()
    this.withdraw.code = this.$route.query.code
    this.getWithdrawOrder()
    this.fetch(this.checkIsSetPayPasswordUrl).then(data => {
      this.hasPassword = data.data.exist
    }).catch(data => {
      this.$message({
        type: 'error',
        message: data.data.msg
      })
    })
  },
  beforeDestroy () {
    clearTimeout(this.time)
  },
  watch: {
    cutTime (val) {
      if (val === 0) {
        this.$message.error('申请已超时，已无法审核')
        this.$router.push('/enterprise/withdraw-apply-authority')
      }
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/less/variables';
.cnfnot {
  font-size: 13px;
  line-height: 13px;
  margin-bottom: 8px;
}
.apply-detail--message {
  margin-top: 8px;
  ul {
    width: 574px;
    margin: 0 auto;
    height: 275px;
    // border: 1px solid #e6e6e6;
    li {
      float: left;
      width: 171px;
      line-height: 40px;
      height: 40px;
      text-align: center;
      border-bottom: 1px solid #e6e6e6;
      border-left: 1px solid #e6e6e6;
      &:nth-child(1),
      &:nth-child(2) {
        border-top: 1px solid #e6e6e6;
      }
      &:nth-child(2n) {
        width: 375px;
        text-align: left;
        padding-left: 25px;
        border-right: 1px solid #e6e6e6;
      }
      &:nth-child(2n+1) {
        background-color: #FAFAFA;
      }
    }
    .operator {
      line-height: 21px;
    }
    .change-color {
      background-color: @table-bg !important;
      background-color: var(--mainTableBg) !important;
    }
  }
}
.themeColor {
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
  margin-top: 5px;
  color: @theme-blue !important;
  color: var(--mainColor) !important;
}
.is-hidden {
  position: absolute;
  z-index: -999;
  opacity: 0;
}
.waitApply,
.waitApplyTime {
  font-size: 18px;
  font-weight: 400;
  color: rgba(61, 61, 61, 1);
  line-height: 36px;
  text-align: center;
  margin: 20px 0 0;
}
.OPE_Name {
  width: 574px;
  margin: 0 auto;
  font-size: 16px;
  font-weight: 400;
  color: rgba(101, 101, 101, 1);
  line-height: 36px;
}
.dotted {
  margin: 0 auto 19px;
  border-top: 1px dotted #000;
  width: 574px;
  height: 1px;
}
.payPwd {
  width: 574px;
  margin: 0 auto 19px;
}
.waitApplyTime {
  font-size: 16px;
  margin-top: 4px;
}
.waitApplyTime .timeColor {
  font-size: 20px;
  font-weight: bold;
  color: @theme-blue;
  color: var(--mainColor);
}
.bankName {
  font-size: 14px;
  font-weight: bold;
  color: rgba(101, 101, 101, 1);
}
.remarkItem {
  width: 574px;
  margin: 20px auto;
  color: gray;
}
.el-icon-question {
  color: #ccc;
}
.pay-psd {
  display: inline-block;
  width: 112px;
  text-align: right;
  font-size: 16px;
  // font-family: SimSun;
  color: rgba(87, 87, 87, 1);
}
.pay-psd1 {
  font-size: 16px;
  // font-family: SimSun;
  color: rgba(87, 87, 87, 1);
}
.psd-input {
  padding-left: 10px;
  width: 210px;
  height: 43px;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  margin: 0 5px 0 15px;
  background: #fcfcfc;
}
.widthPwd {
  width: 364px;
}
.forget-psd {
  cursor: pointer;
  font-size: 14px;
  // font-family: SimSun;
  text-decoration: underline;
  color: rgba(87, 87, 87, 1);
}
.password {
  width: 465px;
  margin: 0 auto;
  .prompt {
    text-align: center;
    font-size: 20px;
    color: rgba(87, 87, 87, 1);
    margin-bottom: 30px;
  }
  .codeItem {
    margin-bottom: 20px;
  }
  .dis {
    cursor: not-allowed;
    background-color: rgba(225, 225, 225, 1);
  }
  .longW {
    width: 316px;
    margin-right: 0;
  }
  .psd-phone {
    display: inline-block;
    padding-left: 19px;
    height: 43px;
    line-height: 43px;
  }
  .verification-code {
    width: 98px;
    height: 45px;
    text-align: center;
    padding-left: 12px;
    background-color: @theme-blue-light;
    background-color: var(--mainLightColor);
    color: @theme-blue;
    color: var(--mainColor);
    border-radius: 4px;
    border: 1px solid @theme-blue;
    border: 1px solid var(--mainColor);
  }
  .verification-code:focus {
    border-color: @theme-blue;
    border-color: var(--mainColor);
  }
}
.btn {
  width: 468px;
  margin: 0 auto 33px;
  .withdraw-btn {
    width: 189px;
    height: 48px;
    line-height: 48px;
    padding: 0;
    margin-left: 21px;
    box-shadow: 1px 6px 4px @btn-disabled;
    box-shadow: 1px 6px 4px var(--mainTableHover);
  }
  .whiteBtn, .whiteBtn:hover {
    color: @theme-blue;
    color: var(--mainColor);
    background-color: #fff;
    border-color: @theme-blue;
    border-color: var(--mainColor);
    box-shadow: 0 0 0;
  }
}
.payeeName {
  font-weight: 700;
  color: @theme-blue;
  color: var(--mainColor);
}
.bankImg {
  float: right;
  margin-right: 10px;
  img {
    height: 25px;
    vertical-align: middle;
  }
}
.dialog-footer {
  margin-bottom: 20px;
  .confirm-btn {
    width: 211px;
    height: 50px;
    font-size: 16px;
  }
}
.warning-text {
  color: @theme-blue;
  color: var(--mainColor);
  background-color: @theme-blue-light;
  background-color: var(--mainLightColor);
  width: 574px;
  border-radius: 4px;
  text-align: center;
  line-height: 36px;
  margin: 19px auto;
}
</style>

<style lang="less">
.withdraw-apply-detail .el-dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  margin-top: 0 !important;
  margin-left: 108px;
}
</style>
