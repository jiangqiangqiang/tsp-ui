<template>
  <div class="pay-apply-detail">
    <BusinessTitle title="支付申请审核" isShowBack></BusinessTitle>
    <div class="waitApply">等待审核</div>
    <div class="waitApplyTime">剩余时间 ：<span class="timeColor">&nbsp;{{cutTime | setTimeHour}}&nbsp;</span>时<span
        class="timeColor">&nbsp;{{cutTime | setTimeMinutes}}&nbsp;</span>分<span
        class="timeColor">&nbsp;{{cutTime | setSecond}}&nbsp;</span>秒</div>
    <div class="OPE_Name">操作员&nbsp;：{{pay.operator  }}</div>
    <!-- 收款信息 -->
          <div class="buyTableTitle">收款信息</div>
          <div class="dotted"></div>
          <table>
            <tr>
              <td>收款企业</td>
              <td>{{pay.payeeName}}</td>
            </tr>
            <tr>
              <td>企业证件号</td>
              <td>{{pay.payeeCreditCode}}</td>
            </tr>
            <tr>
              <td>提现日期</td>
              <td>{{pay.arrivalAccountTime}}<span style="color:#D9D9D9">&nbsp;&nbsp;|&nbsp;&nbsp;</span>{{pay.days}}天</td>
            </tr>
            <tr style="height:63px">
              <td class="mainBgColor">发起收款金额</td>
              <td class="mainBgColor">
                <span>{{pay.transactionAmount || 0 | toThousands}}</span>
                <p class="cnfnot">{{(pay.transactionAmount>0?pay.transactionAmount :'0.00') | amountToChinese}}</p>
              </td>
            </tr>
          </table>
          <!-- 支付信息 -->
          <div class="buyTableTitle">支付信息</div>
          <div class="dotted"></div>
          <table>
            <tr style="height:63px">
              <td>支付金额</td>
              <td><span>{{pay.transactionAmount | toThousands}}</span>
                <p class="cnfnot">{{pay.transactionAmount || 0 | amountToChinese}}</p>
              </td>
            </tr>
            <tr>
              <td>平台补贴</td>
              <td><span>{{pay.subsidy | toThousands}}</span></td>
            </tr>
            <tr>
              <td>服务费</td>
              <td>
                <span>{{pay.transactionCost || 0 | toThousands}}</span>
              </td>
            </tr>
            <tr style="height:63px">
              <td class="mainBgColor">应付现金</td>
              <td class="mainBgColor"><span class="amountColor">{{pay.currentAmount || 0 | toThousands}}</span>
              <p class="cnfnot">{{pay.currentAmount || 0 | amountToChinese}}</p>
              </td>
            </tr>
          </table>
          <!-- 支付方案 -->
          <div class="buyTableTitle">支付方案</div>
          <div class="dotted"></div>
          <table>
            <tr>
              <td>选择支付令</td>
              <td>{{pay.scheme | calcScheme}}</td>
            </tr>
            <tr style="height:63px">
              <td>支付令</td>
              <td><span>{{pay.amount | toThousands}}</span>
                <span class="toTopUp flr" @click="checkDetail">查看明细</span>
                <p class="cnfnot">{{pay.amount || 0 | amountToChinese}}</p>
              </td>
            </tr>
            <tr style="height:63px">
              <td class="mainBgColor">折合现金</td>
              <td class="mainBgColor"><span class="amountColor">{{pay.currentAmount | toThousands}}</span>
                <p class="cnfnot">{{pay.currentAmount || 0 | amountToChinese}}</p>
              </td>
            </tr>
            <tr v-if="pay.remark">
              <td class="mainBgColor">备注</td>
              <td class="mainBgColor">{{pay.remark}}</td>
            </tr>
          </table>
    <!-- 支付密码 -->
    <div class="payPwd">
      <span class="pay-psd1">支付密码</span>
      <input type="password" class="psd-input widthPwd" name="txtPassword" v-model="password" placeholder="请输入支付密码"
        autocomplete="new-password" autocapitalize="off" />
    </div>
    <div class="btn">
      <Button class="pay-btn" @handleClick="passPay" title="同意支付" :disabled="!password"></Button>
      <Button class="pay-btn whiteBtn" @handleClick="rejectDialog1=true" title="驳回到操作员"></Button>
      <Button class="pay-btn whiteBtn" @handleClick="rejectDialog=true" title="拒绝支付"></Button>
    </div>
    <div class="dialog">
      <!-- 密码验证弹窗 -->
      <!-- <el-dialog :visible.sync="succeedDialog" center width="568px" class="pay-table1">
        <div class="password">
          <p class="prompt">验证支付密码</p>
          <span class="pay-psd" style="marginLeft:40px">支付密码</span>
          <input type="password" class="psd-input" v-model="password" placeholder="请输入支付密码" autocomplete="new-password">
          <span class="forget-psd" @click="ForgetPsd">忘记支付密码?</span>
        </div>
        <div style="margin: 30px 0 0 0;textAlign:center;color:#DB6363" v-if="errText">{{errText}}</div>
        <div slot="footer" class="dialog-footer">
          <Button class="confirm-btn" @handleClick="payOrder('Succeed')" title="确定"
            :disabled="payPsd || loadingShow"></Button>
          <Button class="confirm-btn" @handleClick="succeedDialog = false" title="取消"></Button>
        </div>
      </el-dialog> -->
      <el-dialog :visible.sync="succeedDialog" center width="568px" class="pay-table1" :close-on-click-modal="false"
        :close-on-press-escape="false" :before-close="msgClose">
        <div class="password">
          <p class="prompt fs20">验证手机号码</p>
          <div class="codeItem">
            <span class="pay-psd">联系人手机号</span>
            <input type="text" class="psd-input dis longW" :value="contractPhone" disabled />
          </div>
          <div class="codeItem" style="marginBottom:0;">
            <span class="pay-psd">短信验证码</span>
            <input type="text" class="psd-input smallW" v-model="smCode" placeholder="请输入短信验证码" autocomplete="new-password"
              autocapitalize="off" />
            <el-button class="verification-code" :disabled="!codeStatus" @click="getCode" :loading="codeLoading">
              {{codeStatus? (codeLoading ? '':'获取验证码') : `${codeTime}秒后获取`}}</el-button>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <Button class="confirm-btn" @handleClick="withdrawOrder('Succeed')" :title="isLoading?'正在验证':'确定'"
            :disabled="!smCode" :isLoading="isLoading"></Button>
          <Button class="confirm-btn1" @handleClick="succeedDialog = false" title="取消"></Button>
        </div>
      </el-dialog>
      <!-- 拒绝支付弹窗 -->
      <el-dialog :visible.sync="rejectDialog" center width="568px" class="pay-table1">
        <p style="text-align:center;margin: 20px 0 ;font-size: 20px;">拒绝支付？</p>
        <p style="text-align:center;margin: 20px 0 9px;font-size: 16px;lineHeight:26px">确定要拒绝来自 <span
              class="payeeName">{{pay.payeeName}} </span>的<br v-if="pay.payeeName.length >= 18"/>收款请求吗？</p>
        <div slot="footer" class="dialog-footer">
          <Button class="confirm-btn" @handleClick="payOrder('Reject')" :disabled="loadingShow" title="确定拒绝"></Button>
          <Button class="confirm-btn1" @handleClick="rejectDialog = false" title="取消"></Button>
        </div>
      </el-dialog>
      <!-- 驳回操作员弹窗 -->
      <el-dialog :visible.sync="rejectDialog1" center width="568px" class="pay-table1">
        <p style="text-align:center;margin: 20px 0 ;font-size: 20px;">拒绝支付？</p>
        <p style="text-align:center;margin: 20px 0 9px;font-size: 16px;lineHeight:26px">确定要驳回操作员 <span
              class="payeeName">{{pay.operator}}</span> 的 <br v-if="pay.payeeName.length >= 18"/>支付请求吗？</p>
        <div slot="footer" class="dialog-footer">
          <Button class="confirm-btn" @handleClick="payOrder('PAYER_ADM_CANCEL')" :disabled="loadingShow" title="确 定"></Button>
          <Button class="confirm-btn1" @handleClick="rejectDialog1 = false" title="取 消"></Button>
        </div>
      </el-dialog>
      <!-- 支付明细弹窗 -->
      <el-dialog :visible.sync="dialogDetail" center width="771px" class="pay-table1">
          <div class="password">
            <p class="prompt" style="marginBottom:14px">支付令明细</p>
            <el-table :data="balanceDetail" stripe border style="width: 100%" header-align='center' show-summary
              class="credit-table-color-blue sy-global-has-gutter__th--text-center sy-global-el-table-fit--border" :summary-method="getSummaries">
              <el-table-column type="index" label="序号" width="52">
              </el-table-column>
              <el-table-column prop="balance" label="支付令">
                <template slot-scope="scope">
                  {{scope.row.balance | toThousands}}
                </template>
              </el-table-column>
              <el-table-column  label="支付令时间">
                <el-table-column prop="arrivalTime" label="提现日期">
                  <template slot-scope="scope">
                    {{scope.row.arrivalTime || '--'}}
                  </template>
                </el-table-column>
                <el-table-column prop="days" label="已持有天数">
                </el-table-column>
                <el-table-column prop="lastDays" label="剩余天数">
                </el-table-column>
              </el-table-column>
              <el-table-column prop="rate" label="折现利率">
                <template slot-scope="scope">
                  {{scope.row.rate/10000 || '--'}}{{scope.row.rate ? '%' : ''}}
                </template>
              </el-table-column>
              <el-table-column prop="current" label="折合现金（￥）">
                <template slot-scope="scope">
                  {{scope.row.current | toThousands}}
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注">
                <template slot-scope="scope">
                  {{scope.row.remark | remarkType}}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-dialog>
    </div>
    <ForgetPasswordPop :dialogVisible="forgetPsdVisible" @handleClose="forgetPsdVisible=false"></ForgetPasswordPop>
    <NOPayPassword :setPsdVisible="!hasPassword" @handleClose="handleClose"></NOPayPassword>
    <loading :loadingShow="loadingShow"></loading>
  </div>
</template>

<script>
import settings from '@/settings'
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
      pay: {
        transactionAmount: '',
        // rebate: '',
        enpName: '',
        creditCode: '',
        remark: '',
        operator: '',
        payeeName: ''
      },
      errText: '',
      time: null,
      isLoading: false,
      smCode: '',
      codeStatus: true,
      codeTime: 120,
      codeLoading: false,
      balanceDetail: [],
      dialogDetail: false,
      code: this.$route.query.code,
      password: '',
      contractPhone: '',
      role: '',
      cutTime: '0',
      loadingShow: false,
      // 忘记支付密码弹窗
      forgetPsdVisible: false,
      // 确认发送支付请求弹窗
      succeedDialog: false,
      // 拒绝发送支付请求弹窗
      rejectDialog: false,
      rejectDialog1: false,
      hasPassword: true,
      // 支付审核详情
      getPayDetailUrl: settings.apiGateway.toPayDetail,
      // 获取费用信息
      toPayFeesDetailUrl: settings.apiGateway.toPayFeesDetail,
      // 检测账户是否设置支付密码
      checkIsSetPayPasswordUrl: settings.apiGateway.checkIsSetPayPassword,
      transactionNumber: this.$route.query.code,
      // 支付提交接口
      submitProceedsUrl: settings.apiGateway.payConfirm,
      // 支付短信发送
      payMsgUrl: settings.apiGateway.payMsg,
      // 重新获取验证码
      reSendPayMsgUrl: settings.apiGateway.reSendPayMsg,
      // 获取联系人手机号
      getContractUrl: settings.apiGateway.getContractP
    }
  },
  methods: {
    handleClose () {
      this.hasPassword = true
      this.password = ''
    },
    passPay () {
      this.payOrder('Succeed')
    },
    checkDetail () {
      this.balanceDetail = this.pay.balanceList
      this.dialogDetail = true
    },
    withdrawOrder (status) {
      this.isLoading = true
      this.fetch(`${this.payMsgUrl}${this.transactionNumber}/${this.smCode}`, 'post').then(data => {
        this.isLoading = false
        this.$router.push({
          path: `/enterprise/pay-apply-authority/paySuccess`,
          query: {
            code: this.$route.query.code,
            amount: this.pay.transactionAmount
          }
        })
      }).catch(data => {
        this.isLoading = false
        this.$message.error(data.data.data)
      })
    },
    // 请求验证码接口
    getCode () {
      this.codeLoading = true
      this.fetch(`${this.reSendPayMsgUrl}${this.transactionNumber}`, 'post').then(data => {
        this.codeLoading = false
        this.$message.success('发送成功,请注意查收!')
        this.codeCountDown()
      }).catch(data => {
        this.codeLoading = false
        this.$message.error(data.data.data)
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
    msgClose () {
      this.succeedDialog = false
    },
    getPayDetail () {
      this.fetch(`${this.getPayDetailUrl}${this.transactionNumber}`).then(data => {
        if (data.data.status === 'SUCCEED') {
          this.$router.push('/enterprise/pay-apply-authority')
          return
        } else if (data.data.status === 'FAIL') {
          this.$message.error('支付失败，已无法审核')
          this.$router.push('/enterprise/pay-apply-authority')
        }
        this.pay = data.data
        this.cutTime = Math.ceil(this.pay.remainTime / 1000)
        if (this.pay.statusDesc === '支付中') {
          this.succeedDialog = true
          this.isLoading = false
          clearTimeout(this.time)
          this.codeCountDown()
          this.setTime()
          return
        }
        // if (this.cutTime === 0) this.$router.push('/enterprise/pay-apply-authority')
        this.setTime()
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
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
    },
    ForgetPsd () {
      this.forgetPsdVisible = true
    },
    payOrder (isAgree) {
      this.succeedDialog = false
      if (this.pay.statusDesc === '支付中') {
        this.succeedDialog = true
        this.isLoading = false
        clearTimeout(this.time)
        this.codeCountDown()
        return
      }
      // this.loadingShow = true
      let data = {
        type: isAgree,
        transactionNumber: this.transactionNumber,
        password: this.password,
        payerRemark: this.pay.remark
      }
      this.fetch(`${this.submitProceedsUrl}`, 'post', data).then(res => {
        this.succeedDialog = false
        this.dialogVisible = false
        if (isAgree === 'Succeed') {
          this.isLoading = false
          this.codeCountDown()
          this.succeedDialog = true
          // this.$router.push({
          //   path: '/enterprise/pay-apply-authority/paySuccess',
          //   query: {
          //     code: this.code,
          //     amount: this.pay.transactionAmount
          //   }
          // })
        } else {
          this.isLoading = false
          this.$router.push('/enterprise/pay-apply-authority')
        }
        this.$store.dispatch('updateCounters')
      }).catch(res => {
        this.isLoading = false
        this.dialogVisible = false
        if (isAgree === 'Succeed') {
          this.errText = res.data.msg
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          if (index === 1 || index === 6) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
          } else {
            sums[index] = ''
          }
        } else {
          sums[index] = ''
        }
      })
      sums.forEach((item, index) => {
        if (index !== 0) {
          sums[index] = this.toThousands(sums[index])
        }
      })
      return sums
    },
    getContranct () {
      this.fetch(this.getContractUrl).then(data => {
        this.contractPhone = data.data
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
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
    },
    amountFontSize () {
      if (this.amountToChinese(this.pay.transactionAmount + this.pay.transactionCost).length > 20) {
        return 'miinFs'
      } else if (this.amountToChinese(this.pay.transactionAmount + this.pay.transactionCost).length > 13) {
        return 'minFs'
      } else {

      }
    }
  },
  created () {
    this.getPayDetail()
    this.getContranct()
    this.fetch(this.checkIsSetPayPasswordUrl).then(data => {
      this.hasPassword = data.data.exist
    }).catch(data => {
      this.$message({
        type: 'error',
        message: data.data.msg
      })
    })
  },
  watch: {
    cutTime (val) {
      if (val === 0) {
        this.$message.error('申请已超时，已无法审核')
        this.$router.push('/enterprise/pay-apply-authority')
      }
    },
    'pay.status': function (val) {
      if (val === 'PAYER_TIME_OUT') {
        this.$message.error('申请已超时，已无法审核')
        this.$router.push('/enterprise/pay-apply-authority')
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
  margin-top: 24px;
}
.toTopUp {
  text-decoration: underline;
  cursor: pointer;
  color: @theme-blue;
  color: var(--mainColor);
}
.flr {
  float: right;
  margin-right: 10px;
}
.remarkItem {
  width: 574px;
  margin: 20px auto;
  color: rgba(61, 61, 61, 1);
}
.colorMain {
  color: @theme-blue;
  color: var(--mainColor);
  font-size: 16px;
  font-family: ArialMT;
  font-weight: bold;
}
.minFs {
  font-size: 14px;
}
.miinFs {
  font-size: 12px;
}
.OPE_Name {
  width: 574px;
  margin: 0 auto;
  font-size: 16px;
  font-weight: 400;
  color: rgba(101, 101, 101, 1);
  line-height: 36px;
}
.waitApply,
.waitApplyTime {
  font-size: 18px;
  font-weight: 400;
  color: rgba(61, 61, 61, 1);
  line-height: 36px;
  text-align: center;
  margin: 20px 0;
}
.waitApplyTime .timeColor {
  font-size: 37px;
  color: @theme-blue;
  color: var(--mainColor);
}
.psd-input {
  padding-left: 10px;
  width: 220px;
  height: 43px;
  font-size: 16px;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  margin: 0 14px 0 19px;
  background: #fcfcfc;
}
.pay-psd {
  display: inline-block;
  width: 112px;
  text-align: right;
  font-size: 16px;
  color: rgba(87, 87, 87, 1);
}
.verification-code {
  width: 111px;
  height: 45px;
  text-align: center;
  padding: 0;
  background-color: @theme-blue-light !important;
  background-color: var(--mainLightColor) !important;
  color: @theme-blue !important;
  color: var(--mainColor) !important;
  border-radius: 4px;
  border: 1px solid @theme-blue !important;
  border: 1px solid var(--mainColor) !important;
}
.verification-code:focus, .verification-code:hover {
  border-color: @theme-blue !important;
  border-color: var(--mainColor) !important;
  color: @theme-blue !important;
  color: var(--mainColor) !important;
  background-color: @theme-blue-light !important;
  background-color: var(--mainLightColor) !important;
}
.password {
  width: 426px;
  margin: 0 auto;
  .prompt {
    text-align: center;
    font-size: 16px;
    margin-bottom: 30px;
  }
  .fs20 {
    font-size: 20px;
  }
  .codeItem {
    width: 420px;
    margin: 0 auto 20px;
    font-size: 0;
  }
  .dis {
    cursor: not-allowed;
    background-color: rgba(225, 225, 225, 1);
  }
  .longW {
    width: 267px;
    margin-right: 0;
  }
  .smallW {
    width: 143px;
  }
  .forget-psd {
    cursor: pointer;
    color: @theme-blue;
    color: var(--mainColor);
    text-decoration: underline;
  }
}
.goldHelp {
  float: right;
  margin-right: 15px;
  font-size: 20px;
  line-height: 45px;
  color: #ccc;
}
.btn {
  width: 622px;
  margin: 33px auto;
  .pay-btn {
    width: 177px;
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
.payeeName {
  font-weight: 700;
  color: @theme-blue;
  color: var(--mainColor);
}
.dialog-footer {
  margin-bottom: 20px;
  .confirm-btn, .confirm-btn1 {
    width: 211px;
    height: 50px;
    font-size: 18px;
  }
  .confirm-btn1, .confirm-btn1:hover {
    border: 1px solid @theme-blue;
    border: 1px solid var(--mainColor);
    color: @theme-blue;
    color: var(--mainColor);
    background-color: #fff;
  }
}
.buyTableTitle {
  width: 580px;
  height: 16px;
  font-size: 16px;
  font-weight: bold;
  color: rgba(101, 101, 101, 1);
  margin: 38px auto 15px;
  padding-left: 9px;
  border-left: 4px solid @theme-blue;
  border-left: 4px solid var(--mainColor);
}
.dotted {
  border-top: 1px solid #d9d9d9;
  width: 580px;
  margin: 0 auto;
  height: 1px;
}
.payPwd {
  width: 483px;
  margin: 28px auto;
  transform: translateX(18px);
}
.pay-psd1 {
  font-size: 16px;
  color: rgba(87, 87, 87, 1);
}
.widthPwd {
  width: 364px;
}
table {
    width: 580px;
    margin: 18px auto 0;
    .amountColor {
      font-size: 16px;
      font-weight: bold;
      color: @theme-blue;
      color: var(--mainColor);
    }
    tr {
      td {
        height: 40px;
        line-height: 40px;
        border: 1px solid #e6e6e6;
        background-clip: padding-box;
      }
      td:first-child {
        width: 170px;
        text-align: center;
        padding: 0 15px;
        background-color: #FAFAFA;
      }
      td:last-child {
        text-align: left;
        padding-left: 20px;
        line-height: 30px;
      }
      .mainBgColor {
        background-color: @theme-blue-light !important;
        background-color: var(--mainLightColor) !important;
      }
    }
  }
.pay-table1, .pay-table2 {
  .password {
    width: 100%;
    // margin-bottom: 15px;
  }
}
.pay-table1/deep/.credit-table-color-blue tr {
  cursor: default;
  text-align: center;
  background-color: @table-bg;
  background-color: var(--mainTableBg) !important;
}
.pay-table1/deep/.credit-table-color-blue .el-table__body tr {
  &:nth-of-type(2n + 1):hover > td {
    background-color: @table-hover;
    background-color: var(--mainTableHover) !important;
  }
}
</style>
