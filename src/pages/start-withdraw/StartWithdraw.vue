<template>
  <div class="start">
    <div v-if="hasBank">
      <div>
        <BusinessTitle isShowBack title="提现"></BusinessTitle>
        <div>
          <div class="amount-content">
            <div class="lackBank">
              <span class="amount">银行账户 <span class="item visible0">

                </span></span>
              <div class="bank-icon">
                <img class="bank-img" :src="selectSrc" alt="银行图标">
                <span class="banckName">{{selectedBank.bankName}}</span>
              </div>
              <el-select @change="selectChange" v-model="selectedBankAccount" placeholder="请选择" disabled>
                <el-option v-for="item in bankList" :key="item.bankAccountCode" :label="item.bankAccountCodeHide"
                  :value="item.bankAccountCode">
                  <img style="float: left;height: 100%;" :src="selectSrc" alt="银行图标">
                  <span style="float: right; color: #8492a6;">{{ item.bankAccountCodeHide }}</span>
                </el-option>
              </el-select>
            </div>
            <span class="amount">提现金额
              <span class="item" style="opacity:0"></span>
            </span>
            <input maxlength="22" type="text" placeholder="请输入提现金额" class="amount-input" v-model="amount"
              @focus="CountersignAmount" @blur="dataLayout">
            <div class="trans-warning">
              <span class="transUpText">&nbsp;</span>
              {{amount.toString().replace('/,/g','') || 0 | amountToChinese}}
            </div>
            <!--  v-if="amount.toString().replace(/,/g, '')>0" -->
            <!-- <div class="trans-warning" v-else>
              <span class="transUpText">&nbsp;</span>
            </div> -->
            <div class="amount-error ml12" v-if="amountErr">{{amountErrInfo}}</div>
          <div v-if="!amountErr && role==='enterprise'" class="amount-error usebleItem">
            可提现的金额：<span class="withdraw-theme-color">{{withdrawDetail.withdrawAmount | toThousands}}</span>
            <br />
            不可提现金额：<span class="withdraw-theme-color">{{withdrawDetail.unavailableAmount | toThousands}}</span>
          </div>
          <div v-if="!amountErr && role!=='enterprise'" class="amount-error usebleItem">
            可提现的金额:
            <span class="withdraw-theme-color">{{withdrawDetail.withdrawAmount | toThousands}}</span>
            <br />
            <span v-if="role !== 'allocator' && role !== 'admin'">
              不可提现金额：
              <span class="withdraw-theme-color">
                {{withdrawDetail.unavailableAmount | toThousands}}
              </span>
            </span>
          </div>
          </div>
          <input type="text" class="is-hidden" />
          <button v-show="false"></button>
          <div class="amount-content">
            <div style="marginTop:15px;">
              <span class="amount">服务费<span class="item visible0">
                </span></span>
              <span style="paddingLeft:7px">{{feeDetail.serviceAmountbak || 0 | toThousands}} </span> 元
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
            </div>
            <!-- <div style="marginTop:20px;" v-if="feeDetail.discounrAmountbak > 0">
              <span class="amount">退还折让金额<span class="item visible0">
                </span></span>
              <span class="mainColor">{{feeDetail.discounrAmountbak || 0 | toThousands}} </span>
              <el-tooltip class="goldHelp" effect="light" placement="right">
                <div slot="content">
                  对充值所得的支付令在提现时，因在充值时获得了折让金额，
                  <br />
                  需要在提现时按比例退还。
                </div>
                <i class="el-icon-question"></i>
              </el-tooltip>
            </div> -->
            <div style="marginTop:15px;">
              <span class="amount">实际到账金额<span class="item visible0">
                </span></span>
              <span class="mainColor">{{feeDetail.withdrawAmountbak || 0 | toThousands}} </span> 元
              <br>
              <span style="color:rgba(87, 87, 87);position:relative;"><span
                  style="width:490px;position:absolute;left:133px;top:-12px;lineHeight:36px;fontSize:14px">{{feeDetail.withdrawAmountbak || 0 | amountToChinese}}</span>
              </span>
            </div>
            <div class="amount-content" style="marginTop:36px">
              <span class="amount">备注说明
                <span class="item" style="opacity:0"></span>
              </span>
              <input maxlength="20" type="text" placeholder="请输入备注信息(仅我方可见)" class="amount-input" v-model="remark">
              <div class="ml12 defaultColor">20个字</div>
            </div>
            <input type="text" class="is-hidden" />
            <div class="warning-box btn1" v-if="role!=='allocator' && role!=='admin'">
              <span class="el-icon-warning"></span>
              <span class="warning-text">
                <span>提示：预计下一个工作日到账，请注意查收。</span><br>
              </span>
            </div>
            <Button class="btn btn1" @handleClick="goNext"
              :disabled="disabled || loadingWithdrawShow" title="发起提现申请"></Button>
            <!-- <PayPwd></PayPwd> -->
          </div>
        </div>
      </div>
    </div>
    <!-- 添加银行账户 -->
    <div v-else>
      <BusinessTitle isShowBack title="提现"></BusinessTitle>
      <div class="amount-content">
        <div class="no-bank-tips">当前可提现余额: <span>{{withdrawDetail.withdrawAmount | toThousands}}</span></div>
        <div style="margin-bottom: 30px;" class="no-bank-tips">您可以将账户余额转入贵公司的银行账户.</div>
        <Button title="添加银行账户" class="btn" @handleClick="goAdd"></Button>
      </div>
    </div>
    <!-- 验证手机号或密码弹窗 -->
    <div>
      <el-dialog :visible.sync="dialogWithdraw" center width="568px" top="-134px" :before-close="beforeClose"
        :close-on-click-modal="false" :close-on-press-escape="false">
        <div v-if="role==='allocator' || role==='admin'" class="password">
          <p class="prompt">验证手机号</p>
          <div class="codeItem">
            <span class="pay-psd">联系人手机号</span>
            <input type="text" class="psd-input dis longW" :value="selectedBank.phone" disabled />
          </div>
          <div class="codeItem" style="marginBottom:1px">
            <span class="pay-psd">短信验证码</span>
            <input type="text" class="psd-input" v-model="smCode" placeholder="请输入短信验证码" autocomplete="new-password"
              autocapitalize="off" />
            <el-button class="verification-code" :disabled="!codeStatus" @click="getCode">
              {{codeStatus? '获取验证码' : `${codeTime}秒后获取`}}</el-button>
          </div>
        </div>
        <div class="password" v-else>
          <p class="prompt" style="marginBottom:31px">验证支付密码</p>
          <input type="text" class="is-hidden" />
          <span class="pay-psd payheight">支付密码</span>
          <input type="password" :value="pwdMask" class="is-hidden" />
          <span id="mypwd">
            <input type="password" name="pwd-name" id="pwd-name" class="is-hidden" value="pwd"/>
            <input type="password" class="psd-input-pwd" v-model="payPassword" placeholder="请输入支付密码"
              autocomplete="new-password" autocapitalize="off" />
          </span>
          <span class="forget-psd" @click="dialogVisible=true">忘记支付密码?</span>
        </div>
        <div style="margin: 30px 0 0 0;textAlign:center;color:#DB6363" v-if="errText">{{errText}}</div>
        <div slot="footer" class="dialog-footer">
          <Button class="confirm-btn" @handleClick="withdrawOrder" :title="isLoading && role === 'allocator'?'':'确定'"
            :disabled="payPsd" :isLoading="isLoading"></Button>
          <Button class="confirm-btn" @handleClick="dialogWithdraw = false" title="取消"></Button>
        </div>
      </el-dialog>
    </div>
    <!-- 确认提现弹窗 -->
    <div class="withdraw-info feeIntrduce">
      <el-dialog :visible.sync="dialogWithdrawInfo1" center width="568px" top="-280px" :close-on-click-modal="false"
        :close-on-press-escape="false">
        <div class="password">
          <p class="prompt" style="margin:16px 0">请确认提现信息</p>
          <div class="amount-content fs14" style="width:100%;">
            <table>
              <tr>
                <td>企业名称</td>
                <td>{{selectedBank.bankAccountName}}</td>
              </tr>
              <tr>
                <td>银行账户</td>
                <td
                  :style="(feeDetail.discounrAmountbak > 0 && role!=='allocator' && role!=='admin') ?'padding-top:3px':'padding-top:4px'">
                  {{selectedBank.bankAccountCode | hideString}}
                  <div class="bankImg"><img class="confirmBankImg" :src="selectSrc" alt="银行图标">
                    <span class="confirmBankImg nameConfirm">{{selectedBank.bankName}}</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td>提现金额</td>
                <td>{{amount.toString().replace(/,/g,'') | toThousands}}</td>
              </tr>
              <tr>
                <td>{{role==="enterprise"?'服务费':'服务费'}}</td>
                <td>{{feeDetail.serviceAmountbak | toThousands}} 元</td>
              </tr>
              <!-- <tr v-if="feeDetail.discounrAmountbak > 0 && role!=='allocator'">
                <td>退还折让金额</td>
                <td>{{feeDetail.discounrAmountbak || 0 | toThousands}}</td>
              </tr> -->
              <tr style="height:62px">
                <td>实际到账金额</td>
                <td><span class="toTalBalace">{{feeDetail.withdrawAmountbak | toThousands}} 元</span>
                <p class="cnfnot">{{feeDetail.withdrawAmountbak || 0 | amountToChinese}}</p>
                </td>
              </tr>
            </table>
            <div v-if="role==='allocator'|| role==='admin'" style="marginTop:11px;fontSize:14px"><span class="pay-psd">支付密码</span>
              <input type="password" :value="pwdMask" class="is-hidden" />
              <input type="password" class="psd-input smWidth" v-model="payPassword"
                placeholder="请输入支付密码" autocomplete="new-password" autocapitalize="off" />
              <span class="forget-psd" @click="dialogVisible=true">忘记支付密码?</span>
            </div>
          </div>
        </div>
        <!-- 解决弹窗抖动造成的模糊，设置高度为偶数 -->
        <div slot="footer" class="dialog-footer">
          <Button class="confirm-btn" @handleClick="confirmWithdraw" title="确定提现"
            :disabled="(role==='allocator' || role==='admin')&&!payPassword"></Button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="dateAmountLimit" center width="568px" top="0">
        <div class="password" style="width:450px">
          <p class="helpTitle1 mb30">系统提示</p>
          <p class="helpLine1">您此次提现金额过大，本平台提现限额最大为1亿元，</p>
          <p class="helpLine1">请重新选择提现方案或分多笔提现</p>
        </div>
        <div slot="footer" class="dialog-footer">
          <Button class="confirm-btn1" @handleClick="dateAmountLimit = false" title="确 定"></Button>
        </div>
      </el-dialog>
    </div>
    <loading :loadingShow="loadingWithdrawShow"></loading>
    <ForgetPasswordPop :dialogVisible="dialogVisible" @handleClose="dialogVisible=false"></ForgetPasswordPop>
    <NOPayPassword :setPsdVisible="!hasPassword" @handleClose="handleClose"></NOPayPassword>
  </div>
</template>

<script>
import BusinessTitle from '@/components/BusinessTitle'
import ForgetPasswordPop from '@/components/ForgetPasswordPop'
import NOPayPassword from '@/components/NOPayPassword'
// import PayPwd from '@/components/PayPwd'
import settings from '@/settings'
import BankTypes from '@/services/BankType'
// import BrowserMatch from '@/services/Browser.js'
export default {
  components: {
    BusinessTitle,
    ForgetPasswordPop,
    NOPayPassword
    // PayPwd
  },
  data () {
    return {
      formLabelAlign: {
        name: ''
      },
      errText: '',
      codeStatus: true,
      dateAmountLimit: false,
      codeTime: 120,
      remark: '',
      smCode: '',
      payPassword: '',
      amountErr: false, // 错误提示信息
      amount: '', // 提现金额
      loadingWithdrawShow: false, // 点击提现按钮等待
      withdrawUrl: settings.apiGateway.withdrawAudit,
      getBankListUrl: settings.apiGateway.getBankList,
      getWithdrawDetailUrl: settings.apiGateway.getWithdrawDetail,
      // 提现审核接口
      postWithdrawAudit: settings.apiGateway.withdrawAuditPost,
      // 获取最小提现金额接口
      systemConfigUrl: settings.apiGateway.sysParam,
      // 提现计算返回折扣
      withdrawFeeDetailUrl: settings.apiGateway.withdrawFeeDetail,
      // 短信验证码
      getSendCodeUrl: settings.apiGateway.adminSmsCode,
      // 垫资方提现
      allocatorWithdrawUrl: settings.apiGateway.allocatorWithdraw,
      // 提现短信发送
      withdrawMsgUrl: settings.apiGateway.withdrawMsg,
      // 重新获取验证码
      reSendwithdrawMsgUrl: settings.apiGateway.reSendwithdrawMsg,
      bankList: [],
      selectedBankAccount: '',
      selectedBank: {},
      dialogVisible: false,
      dialogWithdraw: false,
      dialogWithdrawInfo: false,
      dialogWithdrawInfo1: false,
      dialogWithdrawAlert: false,
      amountErrInfo: '',
      role: '',
      platformFee: 0,
      withdrawFee: null,
      limitAmount: 50,
      serviceWithdrawFeeRate: 0.05,
      feeDetail: {},
      details: [],
      // 提现信息
      withdrawDetail: {},
      freeFee: 0,
      autoFlag: false,
      checked: false,
      hasPassword: true,
      withdrawBtn: false,
      isLoading: false,
      selectSrc: '',
      time: null,
      withdrawId: '',
      orderCode: ''
    }
  },
  methods: {
    handleClose () {
      this.hasPassword = false
      this.$message.error('请先设置支付密码')
    },
    confirmWithdraw () {
      if ((this.role === 'allocator' || this.role === 'admin') && !this.withdrawId) {
        let amount = this.amount.toString().replace(/,/g, '')
        let data = {
          amount: amount - 0,
          bankAccountCode: this.selectedBank.bankAccountCode,
          password: this.payPassword,
          useGold: this.checked,
          remark: this.remark
        }
        this.fetch(`${this.allocatorWithdrawUrl}`, 'post', data).then(data => {
          this.withdrawId = data.data.withdrawId
          this.orderCode = data.data.txId
          this.dialogWithdrawInfo1 = false
          if (this.role === 'admin') {
            this.$router.push({
              path: `/${this.role}/withdraw-success`,
              query: {
                code: this.orderCode,
                amount: this.feeDetail.withdrawAmountbak
              }
            })
          } else {
            this.dialogWithdraw = true
            this.errText = ''
            clearTimeout(this.time)
            this.codeCountDown()
          }
        }).catch(data => {
          this.$message.error(data.data.msg)
        })
      } else {
        this.dialogWithdrawInfo1 = false
        this.dialogWithdraw = true
        this.errText = ''
      }
    },
    beforeClose () {
      if (this.role === 'allocator' || this.role === 'admin') {
        this.$message.error('请完成提现订单')
        return
      }
      this.payPassword = ''
      this.dialogWithdraw = false
    },
    CountersignAmount () {
      this.autoFlag = true
      this.amountErr = false
      if (this.amount) {
        this.amount = this.amount.toString().replace(/,/g, '')
      }
    },
    dataLayout () {
      this.autoFlag = false
      this.withdrawId = ''
      this.amount = this.toThousands(this.amount)
      let amount = this.amount.toString().replace(/,/g, '')
      this.amountErr = this.useNum < amount || amount < this.limitAmount || amount > this.useNum
      this.amountErr ? this.withdrawFee = 0 : this.withdrawFeeDetail()
      amount < this.limitAmount && (this.amountErrInfo = '单次提现金额不得小于50.00')
      amount > this.useNum && (this.amountErrInfo = '提现余额不足')
      this.useNum < amount && (this.amountErrInfo = '提现金额超限')
    },
    withdrawFeeDetail () {
      let amount = this.amount.toString().replace(/,/g, '') - 0
      if (this.role === 'allocator' || this.role === 'admin') {
        this.feeDetail.withdrawAmountbak = amount - this.withdrawDetail.withdrawFee
        this.feeDetail.serviceAmountbak = this.withdrawDetail.withdrawFee
        return
      }
      this.fetch(`${this.withdrawFeeDetailUrl}${amount}`).then(data => {
        this.feeDetail = data.data
        this.withdrawBtn = false
      }).catch(data => {
        if (data.data.code === 1) {
          this.dateAmountLimit = true
          this.withdrawBtn = true
        } else {
          this.$message.error(data.data.msg)
        }
      })
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
      this.fetch(`${this.reSendwithdrawMsgUrl}${this.withdrawId}`, 'post').then(data => {
        this.$message.success('发送成功,请注意查收!')
        this.codeCountDown()
      }).catch(data => {
        this.$message.error('发送失败，请稍后重试')
      })
    },
    goNext () {
      if (this.withdrawAmount < 0) {
        this.$message.error('实际到账金额不能小于等于0')
        return
      }
      this.isNotAdmin ? this.confirmAlert() : this.dialogWithdrawInfo1 = true
    },
    confirmAlert () {
      this.dialogWithdrawAlert = false
      this.dialogWithdrawInfo1 = true
    },
    withdrawOrder () {
      let amount = this.amount.toString().replace(/,/g, '')
      let data = {
        amount: amount - 0,
        bankAccountCode: this.selectedBank.bankAccountCode,
        password: this.payPassword,
        useGold: this.checked,
        remark: this.remark
      }
      if (this.role === 'allocator') {
        this.isLoading = true
        this.fetch(`${this.withdrawMsgUrl}${this.withdrawId}/${this.smCode}`, 'post').then(data => {
          this.isLoading = false
          this.$router.push({
            path: `/${this.role}/withdraw-success`,
            query: {
              code: this.orderCode,
              amount: this.feeDetail.withdrawAmountbak
            }
          })
        }).catch(data => {
          this.isLoading = false
          this.errText = data.data.data
          // this.$message.error(data.data.data)
        })
      } else {
        this.fetch(`${this.withdrawUrl}`, 'post', data).then(data => {
          this.dialogWithdraw = false
          this.$store.dispatch('updateCounters')
          this.popUpSuccess({
            text: '提现申请已提交至管理员',
            okBtn: '确定',
            ok: () => {
              this.goBack()
            }
          })
        }).catch(data => {
          this.errText = data.data.msg
          // this.$message.error(data.data.msg)
        })
      }
    },
    agentWithdraw () {
      let amount = this.amount.toString().replace(/,/g, '')
      let data = {
        amount: amount,
        bankAccountCode: this.selectedBank.bankAccountCode,
        password: this.payPassword
      }
      this.dialogWithdraw = false
      this.loadingWithdrawShow = true
      this.fetch(`${this.withdrawUrl}`, 'post', data).then(data => {
        let withdrawData = {
          txId: data.data,
          password: this.payPassword,
          status: 'Succeed'
        }
        this.fetch(`${this.postWithdrawAudit}`, 'post', withdrawData).then(data => {
          this.loadingWithdrawShow = false
          this.popUpSuccess({
            text: '提现成功',
            okBtn: '确定',
            ok: () => {
              this.$router.push({
                path: '/agent/withdraw-success',
                query: {
                  code: data.data,
                  amount: this.feeDetail.withdrawAmountbak
                }
              })
            }
          })
        }).catch(data => {
          this.loadingWithdrawShow = false
          this.$message.error(data.data.msg)
        })
      }).catch(data => {
        this.loadingWithdrawShow = false
        this.$message.error(data.data.msg)
      })
    },
    selectChange (value) {
      this.bankList.forEach(item => {
        if (item.bankAccountCode === value) {
          this.selectedBank = item
        }
      })
    },
    handleDialogClose () {
      this.dialogVisible = false
    },
    goAdd () {
      this.$router.push('/' + this.role + '/bank-list')
    },
    checkFeeDetail () {
      let amount = this.amount.toString().replace(/,/g, '')
      if (parseFloat(amount) >= this.limitAmount && this.useNum >= parseFloat(amount)) {
        this.dialogWithdrawInfo1 = true
      } else {
        this.dialogWithdrawInfo1 = false
      }
    },
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property].toString().replace(/,/g, '')))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] = this.toThousands(sums[index])
        } else {
          sums[index] = '-'
        }
      })
      return sums
    },
    getWithdrawDetail () {
      this.fetch(`${this.getWithdrawDetailUrl}`, 'post').then(data => {
        this.withdrawDetail = data.data
      }).catch(data => {
        this.$message.error(data.data.msg)
      })
    },
    getParaInfo () {
      // 获取参数信息
      this.fetch(this.systemConfigUrl, 'get').then(data => {
        this.limitAmount = data.data.withdrawLimit
        this.serviceWithdrawFeeRate = data.data.serviceWithdrawFeeRate * 100
      }).catch(res => {
        this.$message.error(res.data.msg)
      })
    }
  },
  computed: {
    disabled () {
      let amount = this.amount.toString().replace(/,/g, '')
      if (!this.amount || amount > this.useNum || (this.amount < this.limitAmount) || (JSON.stringify(this.selectedBank) === '{}') || this.withdrawBtn) {
        return true
      } else {
        return false
      }
    },
    payPsd () {
      if (!this.payPassword || (!this.smCode && (this.role === 'allocator' || this.role === 'admin'))) {
        return true
      } else {
        return false
      }
    },
    pwdMask () {
      return this.payPassword.replace(/\S/g, '*')
    },
    withdrawAmount () {
      let amount = this.amount.toString().replace(/,/g, '')
      if (amount < this.limitAmount || amount > this.useNum) {
        return 0
      }
      if (!this.autoFlag) {
        if (this.checked) {
          if (this.withdrawDetail.withdrawFee > this.withdrawDetail.goldAmount) {
            return amount - this.withdrawDetail.withdrawFee + this.withdrawDetail.goldAmount
          } else {
            return amount
          }
        } else {
          return amount - this.withdrawDetail.withdrawFee
        }
      } else {
        return 0
      }
    },
    useNum () {
      return this.withdrawDetail.withdrawAmount
    },
    hasBank () {
      if (this.$route.query.hasBank === 'false') {
        return false
      } else if (this.$route.query.hasBank === 'true') {
        return true
      }
      return this.$route.query.hasBank
    },
    isNotAdmin () {
      return this.role !== 'admin'
    },
    withdrawCashFeeText () {
      if (this.autoFlag) {
        return '10.00'
      }
      let amount = this.amount.toString().replace(/,/g, '')
      if (amount >= this.limitAmount && amount <= this.useNum) {
        return this.toThousands(this.platformFee)
      } else {
        return '10.00'
      }
    },
    tableData () {
      if (this.details.length < 1) {
        return []
      }
      let tableDataRes = this.details.slice(0)
      for (let i = 0; i < tableDataRes.length; i++) {
        const eleCon = tableDataRes[i]
        eleCon.amFee = this.toThousands(eleCon.amount * eleCon.rate) || '0.00'
        eleCon.counter = eleCon.counter + '次'
        eleCon.amount = this.toThousands(eleCon.amount) || '0.00'
        eleCon.rate = Math.round(eleCon.rate * 100) + '%'
        if (eleCon.counter === '10次') {
          eleCon.counter = '10次及以上'
        }
      }
      return tableDataRes
    }
  },
  created () {
    // this.getAccount()
    this.getParaInfo()
    this.getWithdrawDetail()
    this.role = this.getUserRole()
    if (!this.hasBank) return
    this.fetch(this.getBankListUrl).then(data => {
      if (data.data.length > 0) {
        this.bankList = data.data.map(item => {
          item.bankAccountCodeHide = item.bankAccountCode.replace(/(.{3})(.+)(.{4})/, (x, y, z, p) => {
            let i = ''
            while (i.length < z.length) {
              i += '*'
            }
            if (i.length > 8) i = ' **** **** '
            return y + i + p
          })
          if (item.use) {
            this.selectedBank = item
            this.selectSrc = '' + BankTypes[item.bankCode] || ''
          }
          return item
        })
        if (JSON.stringify(this.selectedBank) === '{}') {
          this.$message.error('请设置默认银行卡')
          return
        }
        this.selectedBankAccount = this.selectedBank.bankAccountCode
      }
    }).catch(res => {
      this.$message.error(res.data.msg)
    })
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (vm.$route.query.hasPassword === 'false' || !vm.$route.query.hasPassword) {
        vm.hasPassword = false
      } else {
        vm.hasPassword = true
      }
    })
  },
  beforeDestroy () {
    clearTimeout(this.time)
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/less/variables';
.trans-warning {
  font-size: 14px;
  color: rgba(87, 87, 87);
  margin-top: 12px;
}
.transUpText {
  display: inline-block;
  width: 108px;
  height: 17px;
  color: #333333;
  margin-right: 22px;
}
.mainColor {
  color: @theme-blue;
  color: var(--mainColor);
  font-weight: bold;
  margin-left: 8px;
  height: 42px;
  line-height: 42px;
}
.is-hidden {
  position: absolute;
  z-index: -999;
  opacity: 0;
}
.is-hidden1 {
  position: absolute;
  top: 100px;
  left: 100px;
}
.helpTitle1 {
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
.cnfnot {
  font-size: 13px;
  line-height: 13px;
  margin-bottom: 7px;
}
.confirm-btn1 {
  width: 211px;
  height: 50px;
  font-size: 18px;
  margin-top: 16px;
}
.amount-content {
  position: relative;
  width: 545px;
  margin: 22px auto 0;
  font-size: 16px;
  color: rgba(87, 87, 87, 1);
  .lackBank {
    margin: 22px 0;
    position: relative;
  }
  .visible0 {
    opacity: 0;
  }
  .checkDetail {
    position: absolute;
    top: 16px;
    left: 512px;
    width: 100px;
  }
  .amount {
    display: inline-block;
    width: 108px;
    margin-right: 13px;
    text-align: right;
  }
  .amount-input {
    width: 392px;
    height: 45px;
    background: #fcfcfc;
    border: 1px solid #e1e1e1;
    border-radius: 4px;
    // margin-left:17px;
    padding-left: 8px;
    color: #575757;
    ::-ms-clear {
      display: none;
    }
  }
  input::-ms-clear {
    display: none;
  }
  .unit {
    position: absolute;
    left: 450px;
    top: 15px;
  }
  .no-bank-tips {
    padding: 0 45px;
    height: 40px;
    line-height: 40px;
    span {
      font-weight: 500;
      color: @theme-blue;
      color: var(--mainColor);
    }
  }
  table {
    width: 600px;
    margin: 0 auto;
    border-collapse: collapse;
    tr {
      font-size: 14px;
      td {
        height: 40px;
        line-height: 40px;
        border: 1px solid #e6e6e6;
        position: relative;
        background-clip: padding-box;
      }
      td:first-child {
        text-align: center;
        padding: 0 15px;
        background-color: #FAFAFA;
      }
      td:last-child {
        text-align: left;
        padding-left: 20px;
        line-height: 30px;
      }
    }
    tr:last-child td {
      background-color: @theme-blue-light;
      background-color: var(--mainLightColor);
    }
    tr:nth-child(2n) {
      background-color: #ffffff !important;
    }
    tr td:first-child {
      width: 100px !important;
      text-align: center !important;
    }
  }
  .bankImg {
    position: absolute;
    right: 5px;
    top: 5px;
    opacity: 0.8;
  }
  .confirmBankImg {
    height: 25px;
  }
  .tableTitle {
    position: relative;
    margin: 45px auto;
    height: 1px;
    background-color: #d4d4d4;
    text-align: center;
    font-size: 16px;
    font-weight: 400;
    color: rgba(101, 101, 101, 1);
    .midText {
      position: absolute;
      left: 50%;
      background-color: #ffffff;
      padding: 0 15px;
      transform: translateX(-50%) translateY(-50%);
    }
  }
  .item {
    float: right;
    line-height: 30px;
    margin-right: 12px;
  }
  .goldHelp {
    line-height: 30px;
    margin-left: 10px;
  }
  .warning-box {
    color: @theme-blue;
    color: var(--mainColor);
    background-color: @theme-blue-light;
    background-color: var(--mainLightColor);
    width: 574px;
    border-radius: 4px;
    font-size: 12px;
    text-align: center;
    line-height: 36px;
    margin: 19px auto;
  }
  .btn {
    width: 409px;
    height: 50px;
    font-size: 18px;
    color: rgba(255, 255, 255, 1);
    margin: 33px 0 0 69px;
    box-shadow: 1px 6px 4px @btn-disabled;
    box-shadow: 1px 6px 4px var(--mainTableHover);
    border: none;
    box-shadow: 1px 6px 4px @btn-disabled;
    box-shadow: 1px 6px 4px var(--mainTableHover);
  }
  .btn1 {
    width: 402px;
    margin: 17px 0 0 125px;
  }
  .btn2 {
    margin-top: 0;
  }
  .el-select {
    height: 47px;
    width: 402px;
    box-sizing: border-box;
  }
  .bank-icon {
    position: absolute;
    top: 5px;
    left: 150px;
    height: 35px;
    z-index: 2;
    .bank-img {
      height: 35px;
    }
  }
  .banckName {
    vertical-align: middle;
    font-size: 16px;
    font-weight: bold;
    color: rgba(101, 101, 101, 1);
  }
  .nameConfirm {
    font-size: 14px;
    font-weight: bold;
    color: rgba(101, 101, 101, 1);
  }
  .password__input {
    margin: 40px 8px;
    a {
      color: @theme-blue;
      color: var(--mainColor);
      cursor: pointer;
      text-decoration: underline;
    }
    input {
      border: 1px solid #e6e6e6;
      background-color: #fcfcfc;
      padding-left: 8px;
      height: 34px;
      width: 290px;
      border-radius: 4px;
      margin: 0 15px;
    }
  }
  table {
    width: 100%;
    margin: 0 auto;
    border-collapse: collapse;
    tr {
      td {
        height: 40px;
        border: 1px solid #e6e6e6;
        background-clip: padding-box;
      }
      td:first-child {
        text-align: right;
        padding-right: 20px;
        width: 150px;
        background-color: #FAFAFA;
      }
      td:last-child {
        text-align: left;
        padding-left: 20px;
        line-height: 30px;
      }
    }
    tr:last-child td {
      background-color: @theme-blue-light;
      background-color: var(--mainLightColor);
    }
    .toTalBalace {
      font-size: 16px;
      font-weight: bold;
      color: @theme-blue;
      color: var(--mainColor);
    }
  }
  .withdraw-info {
    position: absolute;
    left: 92px;
    bottom: -20px;
    width: 190px;
    .text {
      text-decoration: underline;
    }
  }
  .el-icon-question {
    color: #ccc;
  }
}
.amount-error {
  width: 300px;
  position: absolute;
  left: 532px;
  color: red;
  top: 82px;
  font-size: 14px;
}
.ml12 {
  margin-left: 12px;
}
.defaultColor {
  width: 60px;
  position: absolute;
  top: 16px;
  right: -58px;
  font-size: 14px;
  color: rgba(87, 87, 87, 0.5);
}
.usebleItem {
  color: #ccc;
  margin-left: 12px;
  margin-top: -7px;
  line-height: 18px;
}
.start .whiteworld {
  visibility: hidden;
}
.start {
  position: relative;
}
// .warning-text {
//   display: block;
//   line-height: 78px;
//   color: gray;
//   float: left;
// }
.el-icon-warning {
  margin-right: 9px;
  color: @theme-blue;
  color: var(--mainColor);
  line-height: 36px;
  font-size: 16px;
}
.dialog-footer {
  margin-bottom: 21px;
  .confirm-btn {
    padding-left: 50px;
    padding-right: 50px;
  }
}
.min1 {
  margin-bottom: 20px;
}
.password {
  width: 469px;
  margin: 0 auto;
  .prompt {
    text-align: center;
    font-size: 16px;
    margin-bottom: 30px;
  }
  .codeItem {
    margin-bottom: 20px;
  }
  .pay-psd {
    display: inline-block;
    width: 102px;
    text-align: right;
  }
  .psd-input {
    padding-left: 10px;
    width: 180px;
    height: 43px;
    border: 1px solid #e1e1e1;
    border-radius: 4px;
    margin: 0 14px 0 19px;
    background: #fcfcfc;
  }
  #mypwd {
    position: relative;
    display: inline-block;
    width: 190px;
    height: 29px;
    margin: 0 14px 0 19px;
    .psd-input-pwd {
      padding-left: 10px;
      width: 180px;
      height: 43px;
      border: 1px solid #e1e1e1;
      border-radius: 4px;
      background: #fcfcfc;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  .smWidth {
    width: 210px;
  }
  .dis {
    cursor: not-allowed;
    background-color: #f5f7fa;
  }
  .longW {
    width: 296px;
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
  .forget-psd {
    cursor: pointer;
    color: @theme-blue;
    color: var(--mainColor);
    text-decoration: underline;
  }
}
.start /deep/.el-input__suffix {
  display: none;
}
.withdraw-text {
  line-height: 1.2;
  margin-bottom: 20px;
  font-size: 16px;
}
.withdraw-theme-color {
  color: @theme-blue;
  color: var(--mainColor);
}
.cursor-pointer {
  cursor: pointer;
}
</style>

<style lang="less">
@import '~@/assets/less/variables';
.amount-content {
  .el-select {
    .el-input__inner {
      padding-left: 190px;
      height: 45px;
      line-height: 14px;
      padding-top: 12px;
      padding-bottom: 12px;
      font-size: 16px;
    }
  }
}
.el-table--mini td,
.el-table--mini th {
  padding: 2px 0 !important;
}
.feeIntrduce .el-dialog--center .el-dialog__body {
  padding-bottom: 0 !important;
  padding-top: 0 !important;
}
.el-checkbox__input.is-checked + .el-checkbox__label {
  color: @theme-blue!important;
  color: var(--mainColor) !important;
}
.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: @theme-blue!important;
  background-color: var(--mainColor) !important;
  border-color: @theme-blue!important;
  border-color: var(--mainColor) !important;
}
.el-checkbox__inner:hover,
.el-checkbox__input.is-focus .el-checkbox__inner {
  border-color: @theme-blue!important;
  border-color: var(--mainColor) !important;
}
</style>
