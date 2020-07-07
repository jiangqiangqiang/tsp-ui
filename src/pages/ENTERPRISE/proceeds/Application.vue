<template>
  <div class="apply-application">
    <BusinessTitle title="发起收款" isShowBack></BusinessTitle>
    <div class="application">
      <el-form label-position="right" label-width="150px" :model="formLabelAlign">
        <el-form-item label="收款金额">
          <div style="position:relative;">
            <el-input maxlength="20" v-model="formLabelAlign.transactionAmount" placeholder="请输入收款金额"
              style="width:400px" class="payInput" @blur="dataLayout" name="cash" @focus="CountersignAmount"></el-input>
            <div class="error-warning" v-if="error">
              <i class="el-icon-error error-icon-warning"></i>
              <span class="login-error">收款金额输入有误</span>
            </div>
            <div class="toUpperAmount" v-if="!error && formLabelAlign.transactionAmount">
              {{formLabelAlign.transactionAmount | amountToChinese}}
            </div>
          </div>
        </el-form-item>
        <el-form-item label="提现日期">
          <div style="position:relative;">
            <el-date-picker v-model="formLabelAlign.arrivalAccountTime" type="date" :editable="false" @change="changeStart" placeholder="请选择到期日期"
            style="width:400px" value-format="yyyy-MM-dd" class="payInput" :picker-options="pickerBeginDateBefore">
            </el-date-picker>
            <div class="toUpperAmount">
              账期：{{termDays || 0}}天
            </div>
          </div>
        </el-form-item>
        <span class="amount-error" v-if="amountErr">单笔支付金额不得低于100</span>
        <el-form-item label="付款企业名称">
          <el-input v-model="formLabelAlign.payerName" placeholder="请输入付款企业名称" style="width:400px"
            @blur="verifyCompanyName" class="payInput"></el-input>
          <svg-icon iconClass='ht_sy_dls' className='img' @click="getMessage"></svg-icon>
          <div class="error-warning" v-if="nameError">
            <i class="el-icon-error error-icon-warning"></i>
            <span class="login-error">企业名称由汉字与括号组成</span>
          </div>
          <div class="no-company" v-if="noCompany">企业不存在<span class="invitation"
              @click="$router.push('/enterprise/companies/register')">去邀请</span></div>
        </el-form-item>
        <el-form-item label="付款企业证件号">
          <el-input v-model="formLabelAlign.payerCreditCode" placeholder="请输入付款企业的统一社会信用代码或营业执照号" style="width:400px"
            class="payInput" @focus="focus" @blur="verifyRegin"></el-input>
          <div class="error-warning" v-if="region">
            <i class="el-icon-error error-icon-warning"></i>
            <span class="login-error">统一社会信用代码由18位数字或大写字母组成</span>
          </div>
        </el-form-item>
        <!-- <el-form-item label="支付密码">
            <el-input v-model="formLabelAlign.payPsd" placeholder="请输入支付密码" style="width:400px" class="payInput" maxlength='30' type="password"></el-input>
            <a @click="dialogVisible=true" class="forget-password">忘记支付密码?</a>
          </el-form-item> -->
        <el-form-item label="备注说明">
          <el-input v-model="formLabelAlign.remark" placeholder="请输入备注信息(仅我方可见)" style="width:400px" class="payInput"
            maxlength='20'></el-input>
          <span style="color:rgba(87, 87, 87, 0.5);">20个字</span>
        </el-form-item>
        <!-- <el-form-item label="验证码">
            <el-input class="code-input" v-model="formLabelAlign.smsCode" placeholder="请输入短信验证码"></el-input>
            <el-button class="verification-code" :disabled="!codeStatus" @click="getCode">{{codeStatus? '获取验证码' : `${codeTime}秒后获取`}}</el-button>
              <div v-if="smsCodeError" class="error-warning">
                <i class="el-icon-error error-icon-warning"></i>
                <span class="login-error">验证码有误</span>
              </div>
          </el-form-item> -->
      </el-form>
      <div class="btn">
        <Button class="payBtn" @handleClick="submitProceeds" :disabled="disableSubmit" title="提交收款申请"></Button>
      </div>
      <div class="apply-payment">
        <el-dialog title="常用付款企业查询" :visible.sync="paymentSuccess" :before-close="cleanInput" width="768px" center>
          <div class="select-box">
            <input placeholder="输入公司名称" suffix-icon="el-icon-search" v-model="search" class="select-input"><i
              class="el-icon-search icon-search"></i>
          </div>
          <div class="select">
            <div v-for="item of detailList" :key="item.eid" class="select-message">
              <div class="pay-radio">
                <el-radio v-model="radio" label="1" @change="handleSelect(item)" class="select-radio">
                  <div class="select-radio-message">
                    <span class="select-name">{{item.enterpriseName}}</span>
                    <span>{{item.enterpriseCreditCode}}</span>
                  </div>
                </el-radio>
              </div>
            </div>
          </div>
          <div v-if="noSearch" class="no-search">未找到对应的公司</div>
        </el-dialog>
      </div>
      <!-- <el-dialog
        :visible.sync="dialogSucceed"
        center
        width="576px"
        top="350px"
        >
          <p style="text-align:center;margin: 30px 0;font-size: 16px;">此笔收款需要管理员审核</p>
          <p style="text-align:center;margin: 30px 0;font-size: 16px;">点击确定将发送收款申请至管理员</p>
          <div slot="footer" class="dialog-footer">
            <Button class="confirm-btn" @handleClick="setRequest" title="确定"></Button>
            <Button class="confirm-btn" @handleClick="dialogSucceed = false" title="取消"></Button>
          </div>
        </el-dialog> -->
      <el-dialog :visible.sync="dialogProceedHelp" center width="568px" top="0">
        <div class="password" style="width:80%">
          <p class="helpTitle">收款说明</p>
          <p class="helpLine">收到支付令，可立即消除坏账风险，获得流动性。</p>
          <p class="helpLine">您对收到的支付令有下列选择：</p>
          <p class="helpLine">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;提现：在持有<span class="mainColor">{{termDays}}天</span>后可提现，系统收取提现服务费。</p>
          <p class="helpLine">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;支付：在持有期内可用于支付，系统收取支付服务费。</p>
          <p class="helpLine">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;出售：出售后获得随时可提现的支付令，系统收取交易服务费。</p>
          <p class="helpLine">系统收费远远低于贷款费率，具体费用请查看：<span class="proStandard">收费标准</span></p>
        </div>
        <div slot="footer" class="dialog-footer">
          <p class="helpLine" style="margin-top:-24px;padding-bottom:14px;textAlign:center">
            <el-checkbox v-model="showHelpDialog">不再提示</el-checkbox>
          </p>
          <Button class="confirm-btn" @handleClick="toSubmitProceeds" title="确定"></Button>
          <Button class="confirm-btn" @handleClick="dialogProceedHelp = false" title="取消"></Button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="dialogSucceed" center width="568px" top="0">
        <div class="password">
          <p class="prompt">验证支付密码</p>
          <span class="pay-psd">支付密码</span>
          <input type="password" class="psd-input" v-model="formLabelAlign.payPsd" placeholder="请输入支付密码"
            autocomplete="new-password">
          <span class="forget-psd" @click="dialogVisible=true">忘记支付密码?</span>
        </div>
        <div slot="footer" class="dialog-footer">
          <Button class="confirm-btn" @handleClick="setRequest" title="确定" :disabled="payPsd"></Button>
          <Button class="confirm-btn" @handleClick="dialogSucceed = false" title="取消"></Button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="showAmountLimit" center width="568px" top="0">
        <div class="password" style="width:450px">
          <p class="helpTitle1 mb30">系统提示</p>
          <p class="helpLine1">由于三方支付平台限额要求，您此次收款金额过多，超出</p>
          <p class="helpLine1">平台提现日期请修改收款金额，或分为多笔订单收款。</p>
        </div>
        <div slot="footer" class="dialog-footer">
          <Button class="confirm-btn1" @handleClick="showAmountLimit = false" title="确 定"></Button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="dateAmountLimit" center width="568px" top="0">
        <div class="password" style="width:450px">
          <p class="helpTitle1 mb30">系统提示</p>
          <p class="helpLine1">您选择的提现日期为 <span class="mainColor fwb">{{formLabelAlign.arrivalAccountTime}}</span> ，由于三方限额要求，</p>
          <p class="helpLine1">此次收款金额最多为 <span class="mainColor fwb">{{dateLimit | toThousands}}</span> 元</p>
        </div>
        <div slot="footer" class="dialog-footer">
          <Button class="confirm-btn1" @handleClick="dateAmountLimit = false" title="确 定"></Button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="finalLimit" center width="568px" top="0">
        <div class="password" style="width:450px">
          <p class="helpTitle1 mb30">系统提示</p>
          <p class="helpLine1">您此次收款金额过大，本平台收款限额最大为<span class="mainColor fwb"> {{limitData.maxAmount / 10000}} </span> 万，</p>
          <p class="helpLine1">请重新选择收款方案。</p>
        </div>
        <div slot="footer" class="dialog-footer">
          <Button class="confirm-btn1" @handleClick="finalLimit = false" title="确 定"></Button>
        </div>
      </el-dialog>
    </div>
    <loading :loadingShow="loadingShow"></loading>
    <ForgetPasswordPop :dialogVisible="dialogVisible" @handleClose="dialogVisible=false"></ForgetPasswordPop>
    <NOPayPassword :setPsdVisible="!hasPassword" @handleClose="handleClose"></NOPayPassword>
  </div>
</template>

<script>
import settings from '@/settings.js'
import { Getitem, Setitem, Removeitem } from '@/services/CommonService'
import BusinessTitle from '@/components/BusinessTitle'
import ForgetPasswordPop from '@/components/ForgetPasswordPop'
import NOPayPassword from '@/components/NOPayPassword'
export default {
  name: 'amount-pay-top',
  components: {
    BusinessTitle,
    ForgetPasswordPop,
    NOPayPassword
  },
  data () {
    return {
      error: false,
      showAmountLimit: false,
      dateAmountLimit: false,
      finalLimit: false,
      nameError: false,
      region: false,
      loadingShow: false,
      smsCodeError: false,
      dialogSucceed: false,
      dialogProceedHelp: false,
      content: '此金额为预估数值，因精度原因在计算过程中可能出现一定误差，结算以实际入账金额为准。',
      promptMessageShow: false,
      rejectDetailData: {},
      showHelpDialog: false,
      formLabelAlign: {
        payerName: '',
        payerCreditCode: '',
        type: '',
        transactionAmount: '',
        transactionNumber: '',
        arrivalAccountTime: '',
        rebate: 0,
        smsCode: '',
        remark: '',
        payPsd: ''
      },
      termDays: 0,
      pickerBeginDateBefore: {
        disabledDate: (time) => {
          return time.getTime() < (new Date()).getTime() - 1 * 24 * 60 * 60 * 1000
        }
      },
      // companyList: [],
      noSearch: false,
      search: '',
      amountErr: '',
      noCompany: false,
      paymentSuccess: false,
      hasPassword: true,
      list: [],
      radio: 'true',
      dialogVisible: false,
      // 验证码状态
      codeStatus: true,
      // 验证码获取间隔
      codeTime: 60,
      // 限额状态
      limitStatus: '',
      dateLimit: 0,
      limitData: {},
      // 获取公司列表
      getCompanyUrl: settings.apiGateway.getCompany,
      // 收款提交接口
      submitProceedsUrl: settings.apiGateway.submitProceeds,
      // 保存付款企业信息接口
      savePayerMessageUrl: settings.apiGateway.savePayerMessage,
      // 获取详单
      getReceiveUrl: settings.apiGateway.getReceiveInfo,
      pageNo: 1,
      pageSize: 10,
      pageSizes: settings.pageSizes,
      totalCnt: 1,
      // 邀请注册时校验邀请企业是否存在
      verifyNameUrl: settings.apiGateway.verifyName,
      // 判断企业名称和信用代码是否为同一公司
      judgeUnifyUrl: settings.apiGateway.judgeUnify,
      // 短信验证码
      getSmsCodeUrl: settings.apiGateway.getSmsCode,
      // 判断公司是否为企业方公司
      judgeIsEnterpriseUrl: settings.apiGateway.judgeIsEnterprise,
      // 根据面值获取提现日期
      getWithdrawTimeUrl: settings.apiGateway.getWithdrawTime,
      // 根据提现日期获取最大收款金额
      getMaxAmountUrl: settings.apiGateway.getMaxAmount,
      // 获取最大提现日期和最大收款金额
      getLimitUrl: settings.apiGateway.getLimit,
      // disableSubmit: true
      checkIsSetPayPasswordUrl: settings.apiGateway.checkIsSetPayPassword
    }
  },
  methods: {
    handleClose () {
      this.hasPassword = true
    },
    setRequest () {
      let amount = this.formLabelAlign.transactionAmount.replace(/,/g, '')
      let data = {
        payerName: this.formLabelAlign.payerName,
        payerCreditCode: this.formLabelAlign.payerCreditCode,
        transactionAmount: amount,
        remark: this.formLabelAlign.remark,
        arrivalAccountTime: this.formLabelAlign.arrivalAccountTime
        // payPassword: this.formLabelAlign.payPsd
      }
      this.fetch(this.submitProceedsUrl, 'post', data).then(data => {
        this.dialogSucceed = false
        this.dialogProceedHelp = false
        this.savePayerMessage()
        this.popUpSuccess({
          text: '收款申请已提交至管理员',
          okBtn: '确定',
          ok: () => {
            this.goBack()
          }
        })
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err.data.msg
        })
      })
    },
    // 账期日期选择
    changeStart (timeStr) {
      if (timeStr) {
        this.getMaxAmount(timeStr)
        let now = new Date()
        now.setHours(7, 59, 59)
        this.termDays = parseInt((new Date(timeStr).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      } else {
        this.dateLimit = 0
        this.termDays = 0
      }
    },
    // 根据日期获取最大金额
    getMaxAmount (timeStr) {
      // if (this.formLabelAlign.transactionAmount && !this.dateLimit) {
      //   return
      // }
      this.fetch(`${this.getMaxAmountUrl}?date=${timeStr}`).then(data => {
        this.dateLimit = data.data
        if (this.formLabelAlign.transactionAmount.replace(/,/g, '') > this.limitData.maxAmount) {
          this.limitStatus = 'finalLimit'
        } else if (this.formLabelAlign.transactionAmount.replace(/,/g, '') > this.dateLimit) {
          this.limitStatus = 'dateLimit'
        }
      }).catch(data => {
        this.$message.error(data.data.msg)
      })
    },
    // 保存付款企业信息
    savePayerMessage () {
      let message = {
        name: this.formLabelAlign.payerName,
        creditCode: this.formLabelAlign.payerCreditCode
      }
      this.fetch(this.savePayerMessageUrl, 'post', message).then(data => {
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    // 输入数字失焦之后
    dataLayout () {
      this.formLabelAlign.transactionAmount = this.formLabelAlign.transactionAmount.replace(/,/g, '')
      if (!isNaN(this.formLabelAlign.transactionAmount)) {
        this.error = false
        if (this.formLabelAlign.transactionAmount > this.limitData.maxAmount) {
          this.limitStatus = 'finalLimit'
        } else if (this.dateLimit && this.formLabelAlign.transactionAmount > this.dateLimit) {
          this.limitStatus = 'dateLimit'
        } else if (this.dateLimit && this.formLabelAlign.transactionAmount <= this.dateLimit) {
          this.limitStatus = ''
        } else if (!this.formLabelAlign.arrivalAccountTime) {
          this.limitStatus = ''
          this.checkWithdrawTime()
        }
        this.formLabelAlign.transactionAmount = this.toThousands(this.formLabelAlign.transactionAmount)
      } else {
        this.error = true
      }
    },
    checkWithdrawTime () {
      if (!this.formLabelAlign.transactionAmount) return
      this.fetch(`${this.getWithdrawTimeUrl}?transactionNumber=${this.formLabelAlign.transactionAmount}`).then(data => {
        this.pickerBeginDateBefore = {
          disabledDate: (time) => {
            return time.getTime() < (new Date()).getTime() - 1 * 24 * 60 * 60 * 1000 || time.getTime() > (new Date(data.data)).getTime()
          }
        }
      }).catch(data => {
        this.$message.error(data.data.msg)
      })
    },
    getLimit () {
      this.fetch(`${this.getLimitUrl}`).then(data => {
        this.limitData = data.data
        this.pickerBeginDateBefore = {
          disabledDate: (time) => {
            return time.getTime() < (new Date()).getTime() - 1 * 24 * 60 * 60 * 1000 || time.getTime() > (new Date(this.limitData.maxDate)).getTime()
          }
        }
      }).catch(data => {
        this.$message.error(data.data.msg)
      })
    },
    CountersignAmount () {
      this.amountErr = false
      if (this.formLabelAlign.transactionAmount) {
        this.formLabelAlign.transactionAmount = this.formLabelAlign.transactionAmount.replace(/,/g, '')
      }
    },
    handleRebate () {
      this.formLabelAlign.transactionAmount = this.formLabelAlign.transactionAmount.replace(/,/g, '')
      let rate = this.$store.state.init.conversionCostRate
      this.formLabelAlign.transferCost = this.formLabelAlign.transactionAmount * rate
      this.formLabelAlign.transferCost = this.toThousands(this.formLabelAlign.transferCost)
    },
    iconShow () {
      this.promptMessageShow = !this.promptMessageShow
    },
    // 获取公司列表
    getMessage () {
      this.paymentSuccess = true
      this.fetch(`${this.getCompanyUrl}${this.pageNo - 1}/${this.pageSize}`, 'post', {}).then(data => {
        this.list = data.data.detailList
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    // 关闭公司弹窗
    cleanInput () {
      this.search = ''
      this.paymentSuccess = false
    },
    getCode () {
      this.codeCountDown()
      var data = {
        type: 'Receivable'
      }
      this.fetch(`${this.getSmsCodeUrl}`, 'post', data).then(data => {
        this.$message({
          type: 'success',
          message: '发送成功，请注意查收！'
        })
      }).catch(data => {
        this.$message.error(data.data.msg)
      })
    },
    // 验证码倒计时
    codeCountDown () {
      let time = setTimeout(() => {
        this.codeTime--
        this.codeStatus = false
        if (this.codeTime < 1) {
          this.codeStatus = true
          this.codeTime = 60
          clearTimeout(time)
        } else {
          this.codeCountDown()
        }
      }, 1000)
    },
    // 点选收款公司
    handleSelect (item) {
      this.eid = item.eid
      this.formLabelAlign.payerName = item.enterpriseName
      this.formLabelAlign.payerCreditCode = item.enterpriseCreditCode
      this.nameError = false
      this.region = false
      this.radio = false
      this.paymentSuccess = false
    },
    handleSizeChange (val) {
      this.pageNo = val
    },
    pageChange (val) {
      this.pageNo = val
    },
    // 校验公司格式
    verifyCompanyName () {
      this.noCompany = false
      this.dataLayout()
      let name = /(^[\u4E00-\u9FFF()（）]+$)/
      if (!name.test(this.formLabelAlign.payerName)) {
        this.nameError = true
        return true
      } else {
        this.nameError = false
      }
    },
    // 校验社会统一信息
    verifyRegin () {
      let region = /(^[A-Z0-9]{18}$)/
      if (!region.test(this.formLabelAlign.payerCreditCode)) {
        this.region = true
        return true
      } else {
        this.region = false
      }
    },
    focus () {
      this.verifyCompanyName()
    },
    // 收款提交
    submitProceeds () {
      if (this.limitStatus === 'finalLimit') {
        this.finalLimit = true
        return
      } else if (this.limitStatus === 'dateLimit') {
        this.dateAmountLimit = true
        return
      }
      if (this.showHelpDialog) {
        this.toSubmitProceeds()
      } else {
        this.dialogProceedHelp = true
      }
      // if (this.verifyCompanyName()) return
      // if (this.verifyRegin()) return
      // var data = {
      //   payerCreditCode: this.formLabelAlign.payerCreditCode,
      //   payerName: this.formLabelAlign.payerName
      // }
      // this.fetch(this.judgeIsEnterpriseUrl, 'post', data).then(data => {
      //   this.dialogSucceed = true
      // }).catch(data => {
      //   if (data.data.code === 2004) {
      //     this.noCompany = true
      //   }
      //   this.$message.error(data.data.msg)
      // })
    },
    toSubmitProceeds () {
      if (this.verifyCompanyName()) return
      if (this.verifyRegin()) return
      var data = {
        payerCreditCode: this.formLabelAlign.payerCreditCode,
        payerName: this.formLabelAlign.payerName
      }
      this.fetch(this.judgeIsEnterpriseUrl, 'post', data).then(data => {
        if (this.showHelpDialog) {
          Setitem('showHelpDialog', 'proceedsHelpShow')
        } else {
          Removeitem('showHelpDialog')
        }
        this.setRequest()
      }).catch(data => {
        if (data.data.code === 2004) {
          this.noCompany = true
        }
        this.$message.error(data.data.msg)
      })
    }
  },
  computed: {
    disableSubmit () {
      if (this.formLabelAlign.payerName &&
        this.formLabelAlign.payerCreditCode &&
        this.formLabelAlign.transactionAmount &&
        this.error === false &&
        this.nameError === false &&
        this.formLabelAlign.arrivalAccountTime) {
        return false
      } else {
        return true
      }
    },
    payPsd () {
      if (!this.formLabelAlign.payPsd) {
        return true
      } else {
        return false
      }
    },
    detailList () {
      var search = this.search
      if (search) {
        return this.list.filter(function (product) {
          return Object.keys(product).some(function (key) {
            return String(product[key]).toLowerCase().indexOf(search) > -1
          })
        })
      }
      return this.list
    }
  },
  watch: {
    search (newVal) {
      if (this.detailList.length === 0) {
        this.noSearch = true
      } else {
        this.noSearch = false
      }
    }
  },
  created () {
    let showHelpDialog = Getitem('showHelpDialog')
    this.getLimit()
    if (showHelpDialog) {
      this.showHelpDialog = true
    } else {
      this.showHelpDialog = false
    }
    if (this.modifyId) {
      this.getRejectMessage()
    }
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
.error-warning {
  width: 300px;
  color:rgb(219,69,68);
  right: -258px;
  top: 0;
  position: absolute;
}
.code-input {
  width: 287px;
}
.verification-code {
  width: 108px;
  height: 42px;
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
.mainColor {
  color: @theme-blue;
  color: var(--mainColor);
}
.application {
  width: 602px;
  height: 450px;
  margin: 30px auto 70px;
  .toUpperAmount {
    position: absolute;
    width: 300px;
    height: 100px;
    left: 410px;
    line-height: 20px;
    top: 12px;
  }
}
.checked {
  width: 50px;
  height: 30px;
  margin: 0 auto;
  margin-bottom: 20px;
}
.helpTitle, .helpTitle1 {
  font-size: 20px;
  font-weight: 400;
  color: rgba(87, 87, 87, 1);
  line-height: 42px;
  text-align: center;
}
.helpTitle1 {
  font-size: 22px;
}
.helpLine, .helpLine1 {
  font-size: 15px;
  font-weight: 400;
  color: rgba(87, 87, 87, 1);
  line-height: 34px;
  text-align: left;
}
.helpLine1 {
  font-size: 18px;
}
.mb30 {
  margin-bottom: 30px;
}
.fwb {
  font-weight: bold;
}
.proStandard {
  color: @theme-blue;
  color: var(--mainColor);
  cursor: pointer;
}
.btn {
  .payBtn {
    font-size: 16px;
    width: 400px;
    height: 50px;
    line-height: 50px;
    margin-left: 150px;
    padding: 0;
    color: #ffffff;
    box-shadow: 1px 6px 4px @btn-disabled;
    box-shadow: 1px 6px 4px var(--mainTableHover);
  }
}
.icon {
  font-size: 18px !important;
  position: relative;
}
.img {
  display: inline-block;
  width: 22px !important;
  height: 21px !important;
  vertical-align: middle;
  color: #ccc;
  position: absolute;
  cursor: pointer;
  top: 12px;
  left: 370px;
  // background-image:url('~@/assets/img/pay05.png');
}
.el-dialog__body {
  .select-box {
    width: 300px;
    margin: 1px auto 50px;
    .select-input {
      width: 250px;
      border: 1px solid #ccc;
      border-right: 0;
      height: 37px;
      padding-left: 10px;
    }
    .icon-search {
      width: 38px;
      border: 1px solid #ccc;
      height: 37px;
      line-height: 37px;
      border-left: 0;
      float: right;
    }
  }
  .select {
    max-height: 200px;
    margin-bottom: 100px;
    overflow-y: auto;
    .select-message {
      border-top: 1px solid #e6e6e6;
      border-bottom: 1px solid transparent;
      width: 100%;
      height: 40px;
      .pay-radio {
        margin: 0 auto;
        line-height: 40px;
        width: 100%;
        .select-radio {
          width: 100%;
          line-height: 40px;
          &/deep/ .el-radio__input {
            float: left;
            margin-left: 160px;
          }
          &/deep/ .el-radio__label {
            float: left;
          }
          .select-radio-message {
            width: 400px;
            display: table;
            span {
              display: table-cell;
              text-align: justify;
              vertical-align: middle;
              &:nth-child(2) {
                text-align: right;
              }
            }
          }
        }
      }
      .select-name {
        // width:24px;
        font-size: 16px;
      }
      &:nth-of-type(2n + 1) {
        background: @table-bg;
        background: var(--mainTableBg);
      }
    }
  }
}
.el-icon-question {
  color: #ccc;
  margin-left: 15px;
}
.transferCostInput {
  border: 0;
  height: 41px;
  // line-height: 41px;
  line-height: 14px;
  background-color: #fff;
  padding-left: 15px;
  color: #606266;
}
.apply-application/deep/.el-input.is-disabled .el-input__inner {
  color: #333;
  background-color: #fff;
}
.apply-application/deep/ .el-input__inner {
  height: 45px;
  // line-height: 41px;
  line-height: 14px;
  padding-top: 12px;
  padding-bottom: 12px;
}
.amount-error {
  width: 200px;
  position: relative;
  // right:164px;
  // top:248px;
  left: 573px;
  bottom: 59px;
  color: red;
}
.el-button--primary:active {
  background: @theme-blue;
  background: var(--mainColor);
}
.apply-application/deep/.el-form-item {
  margin-bottom: 30px;
}
.apply-application/deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
  color: @theme-blue;
  color: var(--mainColor);
}
.apply-application/deep/.el-checkbox__input.is-checked .el-checkbox__inner {
  background: @theme-blue;
  background: var(--mainColor);
  border-color: @theme-blue;
  border-color: var(--mainColor);
}
.apply-application/deep/.el-radio__inner {
  margin-top: 13px;
}
.apply-application/deep/.el-dialog__body {
  padding: 16px 0 30px;
}
.apply-application/deep/.el-form-item__label, .apply-application/deep/.el-input__inner {
  font-size: 16px;
}
.no-search {
  width: 200px;
  position: relative;
  bottom: 100px;
  left: 290px;
  font-size: 18px;
}
.no-company {
  position: absolute;
  margin: 0;
  color: red;
  .invitation {
    cursor: pointer;
    text-decoration: underline;
    color: @theme-blue;
    color: var(--mainColor);
    margin-left: 10px;
  }
}
.forget-password {
  display: inline-block;
  width: 91px;
  height: 30px;
  position: absolute;
  left: 411px;
  top: 5px;
  cursor: pointer;
}
.dialog-footer {
  margin-bottom: 20px;
  .confirm-btn {
    padding-left: 50px;
    padding-right: 50px;
  }
  .confirm-btn1 {
    width: 211px;
    height: 50px;
    font-size: 18px;
  }
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
.apply-application /deep/.el-input__prefix {
  left: 370px !important;
}
.apply-application /deep/.el-input__suffix {
  right: 20px !important;
}
.apply-application /deep/.el-input--prefix .el-input__inner {
  padding-left: 15px;
}
</style>

<style lang="less">
.apply-application .el-dialog {
  top: 50%;
  left: 50%;
  // margin-top: -250px !important;
  margin-left: -188px;
}
.apply-application {
  .el-dialog {
    width: 768px;
    position: absolute;
    top: 50% !important;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    margin-top: 0 !important;
    margin-left: 108px !important;
  }
}
</style>
