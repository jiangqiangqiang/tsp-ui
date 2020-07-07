<template>
  <div class="proceed-apply-detail">
    <BusinessTitle title="收款申请审核" isShowBack></BusinessTitle>
    <div class="OPE_Name">操作员&nbsp;：{{proceed.operator}}</div>
    <table class="apply-detail--message">
      <tr style="height:63px">
        <td class="change-color">收款金额</td>
        <td class="change-color">
          <span class="mainColor">{{proceed.transactionAmount | toThousands}}</span>
          <p class="cnfnot">{{proceed.transactionAmount | amountToChinese}}</p>
        </td>
      </tr>
      <tr>
        <td class="change-color1">提现日期</td>
        <td>
          {{proceed.arrivalAccountTime || '2020-02-02'}}<span style="color:#D9D9D9">&nbsp;&nbsp;|&nbsp;&nbsp;</span>{{proceed.days || 0}}天
        </td>
      </tr>
      <tr>
        <td class="change-color1">付款企业名称</td>
        <td>
          {{proceed.payerName}}
        </td>
      </tr>
      <tr>
        <td class="change-color1">付款企业证件号</td>
        <td>
          {{proceed.payerCreditCode}}
        </td>
      </tr>
      <tr v-if="proceed.remark">
        <td class="change-color1">备注说明</td>
        <td>
          {{proceed.remark}}
        </td>
      </tr>
    </table>
    <!-- <div class="apply-detail--message">
      <ul>
        <li class="change-color">收款金额</li>
        <li class="change-color"><span class="mainColor">{{proceed.transactionAmount | toThousands}}</span><span style="color:#D9D9D9">&nbsp;&nbsp;|&nbsp;&nbsp;</span>大写：{{proceed.transactionAmount | amountToChinese}}</li>
        <li class="change-color1">提现日期</li>
        <li>{{proceed.arrivalAccountTime || '2020-02-02'}}<span style="color:#D9D9D9">&nbsp;&nbsp;|&nbsp;&nbsp;</span>{{proceed.days || 0}}天</li>
        <li class="change-color1">付款企业名称</li>
        <li>{{proceed.payerName}}</li>
        <li class="change-color1">付款企业证件号</li>
        <li>{{proceed.payerCreditCode}}</li>
        <li class="change-color1" v-if="proceed.remark">备注说明</li>
        <li v-if="proceed.remark">{{proceed.remark}}</li>
      </ul>
    </div> -->
    <!-- <div class="remarkItem" v-if="proceed.remark">备注说明：{{proceed.remark}}</div> -->
    <div class="btn">
      <Button class="proceed-btn" @handleClick="ProceedPass" title="同意收款"></Button>
      <Button class="proceed-btn whiteBtn" @handleClick="rejectDialog=true" title="拒绝收款"></Button>
    </div>
    <div class="dialog">
      <el-dialog :visible.sync="succeedDialog" center width="568px" top="0">
        <div class="password">
          <p class="prompt">验证支付密码</p>
          <span class="pay-psd">支付密码</span>
          <input type="password" class="psd-input" v-model="password" placeholder="请输入支付密码" autocomplete="new-password">
          <span class="forget-psd" @click="ForgetPsd">忘记支付密码?</span>
        </div>
        <div slot="footer" class="dialog-footer">
          <Button class="confirm-btn" @handleClick="proceedOrder('Succeed')" title="确定" :disabled="payPsd"></Button>
          <Button class="confirm-btn whiteBtn" @handleClick="succeedDialog = false" title="取消"></Button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="rejectDialog" center width="568px" top="373px">
        <p style="text-align:center;margin: 20px 0;font-size: 22px;">拒绝收款？</p>
        <p style="text-align:center;marginBottom:9px;font-size: 14px;lineHeight:26px">确定要拒绝由操作员【{{proceed.operator}}】发起向企业【{{proceed.payerName}}】的<br v-if="proceed.operator.length + proceed.payerName.length >= 14"/>收款吗？</p>
        <div slot="footer" class="dialog-footer">
          <Button class="confirm-btn" @handleClick="proceedOrder('Reject')" title="确定"></Button>
          <Button class="confirm-btn whiteBtn" @handleClick="rejectDialog = false" title="取消"></Button>
        </div>
      </el-dialog>
    </div>
    <el-dialog :visible.sync="dialogProceedHelp" center width="568px" top="0">
      <div class="password" style="width:91%">
        <p class="helpTitle">收款说明</p>
        <p class="helpLine">收到支付令，可立即消除坏账风险，获得流动性。</p>
        <p class="helpLine">您对收到的支付令有下列选择：</p>
        <p class="helpLine">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;提现：在持有{{proceed.days}}天后可提现，系统收取提现服务费。</p>
        <p class="helpLine">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;支付：在持有期内可用于支付，系统收取支付服务费。</p>
        <p class="helpLine">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;出售：出售后获得随时可提现的支付令，系统收取交易服务费。</p>
        <p class="helpLine">系统收费远远低于贷款费率，具体费用请查看：<span class="proStandard">收费标准</span></p>
      </div>
      <div slot="footer" class="dialog-footer">
        <p class="helpLine" style="margin-top:-25px;padding-bottom:14px;textAlign:center">
          <el-checkbox v-model="showHelpDialog">不再提示</el-checkbox>
        </p>
        <Button class="confirm-btn" @handleClick="toSubmitProceeds" title="确定"></Button>
        <Button class="confirm-btn whiteBtn" @handleClick="dialogProceedHelp = false" title="取消"></Button>
      </div>
    </el-dialog>
    <ForgetPasswordPop :dialogVisible="forgetPsdVisible" @handleClose="forgetPsdVisible=false"></ForgetPasswordPop>
    <NOPayPassword :setPsdVisible="!hasPassword" @handleClose="handleClose"></NOPayPassword>
  </div>
</template>

<script>
import settings from '@/settings'
import { Getitem, Setitem, Removeitem } from '@/services/CommonService'
import BusinessTitle from '@/components/BusinessTitle'
import NOPayPassword from '@/components/NOPayPassword'
import ForgetPasswordPop from '@/components/ForgetPasswordPop'
export default {
  components: {
    BusinessTitle,
    ForgetPasswordPop,
    NOPayPassword
  },
  data () {
    return {
      proceed: {
        transactionAmount: '',
        enpName: '',
        creditCode: '',
        operator: '',
        payerName: ''
      },
      hasPassword: true,
      dialogProceedHelp: false,
      showHelpDialog: false,
      password: '',
      // 忘记支付密码弹窗
      forgetPsdVisible: false,
      // 确认发送支付请求弹窗
      succeedDialog: false,
      // 拒绝发送支付请求弹窗
      rejectDialog: false,
      // 支付审核详情
      toPayDetailUrl: settings.apiGateway.toPayDetail,
      transactionNumber: this.$route.query.code,
      // 检测账户是否设置支付密码
      checkIsSetPayPasswordUrl: settings.apiGateway.checkIsSetPayPassword,
      // 收款提交接口
      submitProceedsUrl: settings.apiGateway.payConfirm
    }
  },
  methods: {
    handleClose () {
      this.hasPassword = true
      this.password = ''
    },
    ProceedPass () {
      if (this.showHelpDialog) {
        // this.succeedDialog = true
        this.proceedOrder('Succeed')
      } else {
        this.dialogProceedHelp = true
      }
    },
    toSubmitProceeds () {
      if (this.showHelpDialog) {
        Setitem('showHelpDialogAdmin', 'proceedsHelpShow')
      } else {
        Removeitem('showHelpDialogAdmin')
      }
      // this.succeedDialog = true
      this.proceedOrder('Succeed')
      this.dialogProceedHelp = false
    },
    getProceedDetail () {
      this.fetch(`${this.toPayDetailUrl}${this.transactionNumber}`).then(data => {
        this.proceed = data.data
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    ForgetPsd () {
      this.forgetPsdVisible = true
    },
    proceedOrder (isAgree) {
      let data = {
        // password: this.password,
        transactionNumber: this.transactionNumber,
        type: isAgree
      }
      this.fetch(this.submitProceedsUrl, 'post', data).then(data => {
        this.succeedDialog = false
        if (isAgree === 'Succeed') {
          this.popUpSuccess({
            text: '收款发起成功',
            text2: '请耐心等待付款企业支付反馈结果。',
            okBtn: '确定',
            ok: () => {
              this.$router.push('/enterprise/proceeds-apply-authority')
            }
          })
        } else {
          this.$router.push('/enterprise/proceeds-apply-authority')
        }
        this.$store.dispatch('updateCounters')
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err.data.msg
        })
      })
    }
  },
  computed: {
    payPsd () {
      if (!this.password) {
        return true
      } else {
        return false
      }
    }
  },
  created () {
    let showHelpDialog = Getitem('showHelpDialogAdmin')
    if (showHelpDialog) {
      this.showHelpDialog = true
    } else {
      this.showHelpDialog = false
    }
    this.getProceedDetail()
    this.fetch(this.checkIsSetPayPasswordUrl).then(data => {
      this.hasPassword = data.data.exist
    }).catch(data => {
      this.$message({
        type: 'error',
        message: data.data.msg
      })
    })
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
  width: 578px;
  margin: 0 auto;
  tr {
    overflow: hidden;
    td {
      width: 173px;
      line-height: 40px;
      border: 1px solid #e6e6e6;
      // height: 45px;
      text-align: center;
      // border-bottom: 1px solid #e6e6e6;
      &:nth-child(2n) {
        width: 375px;
        text-align: left;
        padding-left: 25px;
      }
      &:nth-child(2n + 1) {
        border-right: 0;
      }
    }
    .operator {
      line-height: 21px;
    }
    .change-color {
      line-height: 30px;
      background-color: @table-bg;
      background-color: var(--mainTableBg);
    }
    .change-color1 {
      background-color: #FAFAFA;
    }
  }
}
.mainColor {
  font-size: 16px;
  font-weight: bold;
  color: @theme-blue;
  color: var(--mainColor);
}
.remarkItem {
  width: 574px;
  margin: 20px auto;
}
.OPE_Name {
  width: 574px;
  margin: 24px auto;
  font-size: 16px;
  font-weight: 400;
  color: rgba(101, 101, 101, 1);
  line-height: 36px;
}
.helpTitle {
  font-size: 20px;
  font-weight: 400;
  color: rgba(87, 87, 87, 1);
  line-height: 42px;
  text-align: center;
}
.helpLine {
  font-size: 15px;
  font-weight: 400;
  color: rgba(87, 87, 87, 1);
  line-height: 34px;
  text-align: left;
}
.proStandard {
  color: @theme-blue;
  color: var(--mainColor);
  cursor: pointer;
}
.password {
  width: 426px;
  margin: 0 auto;
  .prompt {
    text-align: center;
    font-size: 16px;
    margin-bottom: 30px;
  }
  .psd-input {
    padding-left: 10px;
    width: 220px;
    height: 43px;
    border: 1px solid #e1e1e1;
    border-radius: 4px;
    margin: 0 14px 0 19px;
    background: #fcfcfc;
  }
  .forget-psd {
    cursor: pointer;
    color: @theme-blue;
    color: var(--mainColor);
    text-decoration: underline;
  }
}
.btn {
  width: 468px;
  margin: 33px auto;
  .proceed-btn {
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
  }
}
.dialog-footer .whiteBtn, .dialog-footer .whiteBtn:hover {
  color: @theme-blue;
  color: var(--mainColor);
  background-color: #fff;
  border-color: @theme-blue;
  border-color: var(--mainColor);
}
.payeeName {
  font-weight: 700;
  color: @theme-blue;
  color: var(--mainColor);
}
.dialog-footer {
  margin-bottom: 20px;
  .confirm-btn {
    width: 211px;
    height: 50px;
    font-size: 16px;
  }
}
.proceed-apply-detail/deep/.el-form-item {
  margin-bottom: 30px;
}
.proceed-apply-detail/deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
  color: @theme-blue;
  color: var(--mainColor);
}
.proceed-apply-detail/deep/.el-checkbox__input.is-checked .el-checkbox__inner {
  background: @theme-blue;
  background: var(--mainColor);
  border-color: @theme-blue;
  border-color: var(--mainColor);
}
.proceed-apply-detail/deep/.el-radio__inner {
  margin-top: 13px;
}
.proceed-apply-detail/deep/.el-dialog__body {
  padding: 30px 0;
}
</style>

<style lang="less">
.proceed-apply-detail .el-dialog {
  width: 768px;
  position: absolute;
  top: 50% !important;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  margin-top: 0 !important;
  margin-left: 108px;
}
.proceed-apply-detail .el-dialog--center .el-dialog__body {
  padding: 25px 20px 30px;
  margin-top: 0;
}
</style>
