<template>
  <!-- 验证手机弹窗 -->
  <div class="smsCode">
    <el-dialog :visible.sync="succeedDialog" center width="568px" top="-134px" :close-on-click-modal="false"
      :close-on-press-escape="false" :before-close="cancle">
      <div class="password">
        <p class="prompt">验证手机号</p>
        <div class="codeItem">
          <span class="pay-psd">联系人手机号</span>
          <input type="text" class="psd-input dis longW" :value="selectInfo.phone" disabled />
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
        <Button class="confirm-btn" @handleClick="cancle" title="取消"></Button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import settings from '@/settings'
export default {
  props: {
    succeedDialog: {
      type: Boolean,
      default: false
    },
    selectInfo: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      role: '',
      smCode: '',
      isLoading: false,
      codeLoading: false,
      codeStatus: true,
      codeTime: 120,
      time: null,
      // 提现短信发送
      withdrawMsgUrl: settings.apiGateway.withdrawMsg,
      // 重新获取验证码
      reSendwithdrawMsgUrl: settings.apiGateway.reSendwithdrawMsg
    }
  },
  created () {
    this.role = this.getUserRole()
  },
  methods: {
    cancle () {
      this.$emit('update:succeedDialog', false)
      this.smCode = ''
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
      this.fetch(`${this.reSendwithdrawMsgUrl}${this.selectInfo.withdrawId}`, 'post').then(data => {
        this.codeLoading = false
        this.$message.success('发送成功,请注意查收!')
        this.codeCountDown()
      }).catch(data => {
        this.codeLoading = false
        this.$message.error(data.data.data)
      })
    },
    withdrawOrder (status) {
      this.isLoading = true
      this.fetch(`${this.withdrawMsgUrl}${this.selectInfo.withdrawId}/${this.smCode}`, 'post').then(data => {
        this.isLoading = false
        this.$router.push({
          path: `/${this.role}/withdraw-apply-authority/withdrawSuccess`,
          query: {
            code: this.selectInfo.transactionCode,
            amount: this.selectInfo.amount
          }
        })
      }).catch(data => {
        this.isLoading = false
        this.$message.error(data.data.data)
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/variables';
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
.dialog-footer {
  margin-bottom: 20px;
  .confirm-btn {
    width: 211px;
    height: 50px;
    font-size: 16px;
  }
}
.smsCode .el-dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  margin-top: 0 !important;
  margin-left: 108px;
}
</style>
