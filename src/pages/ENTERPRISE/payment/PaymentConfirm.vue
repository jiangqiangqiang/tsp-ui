<template>
  <div class="payc">
    <BusinessTitle isShowBack title="支付"></BusinessTitle>
    <div>
      <div>
        <div class="pay-table">
          <!-- 收款信息 -->
          <div class="buyTableTitle">收款信息</div>
          <div class="dotted"></div>
          <table>
            <tr>
              <td>收款企业</td>
              <td>{{payOrderDetail.payeeName}}</td>
            </tr>
            <tr>
              <td>企业证件号</td>
              <td>{{payOrderDetail.payeeCreditCode}}</td>
            </tr>
            <tr>
              <td>提现日期</td>
              <td>{{payOrderDetail.arrivalAccountTime}}<span style="color:#D9D9D9">&nbsp;&nbsp;|&nbsp;&nbsp;</span>{{payOrderDetail.days}}天</td>
            </tr>
            <tr style="height:63px">
              <td class="mainBgColor">发起收款金额</td>
              <td class="mainBgColor">
                <span>{{payOrderDetail.transactionAmount || 0 | toThousands}}</span>
                <p class="cnfnot">{{(payOrderDetail.transactionAmount>0?payOrderDetail.transactionAmount :'0.00') | amountToChinese}}</p>
              </td>
            </tr>
          </table>
          <!-- 支付信息 -->
          <div class="buyTableTitle">支付信息</div>
          <div class="dotted"></div>
          <table>
            <tr style="height:63px">
              <td>支付金额</td>
              <td><span>{{payOrderDetail.transactionAmount | toThousands}}</span>
              <p class="cnfnot">{{payOrderDetail.transactionAmount || 0 | amountToChinese}}</p>
              </td>
            </tr>
            <tr>
              <td>平台补贴</td>
              <td><span>{{payOrderDetailHelp.subsidy | toThousands}}</span></td>
            </tr>
            <tr>
              <td>服务费</td>
              <td>
                <span>{{payOrderDetailHelp.serviceFee || 0 | toThousands}}</span>
                <!-- <el-tooltip class="item" effect="light" placement="right">
                  <div slot="content">
                    服务费采用外扣的形式，由基础费用和持有费用两部分组成，<br />系统会根据您支付令的额度和组合进行自动计算。<br />计算公式<br />基础收费=支付额度*0.1%（最低3元），<br />持有费用=支付额度*支付令的持有天数*0.01%。
                    <br /><span style="color:#f56c6c;">注：企业自行充值所得的支付令，不收取任何服务费。</span>
                  </div>
                  <i class="el-icon-question goldHelp"></i>
                </el-tooltip> -->
              </td>
            </tr>
            <tr style="height:63px">
              <td class="mainBgColor">应付现金</td>
              <td class="mainBgColor"><span class="amountColor">{{payOrderDetailHelp.balance || 0 | toThousands}}</span>
              <p class="cnfnot">{{payOrderDetailHelp.balance || 0 | amountToChinese}}</p>
              </td>
            </tr>
          </table>
          <!-- 支付方案 -->
          <div class="buyTableTitle">支付方案
            <!-- <span class="error" v-if="lackNum>0">
              余额不足，请 <span class="toTopUp" @click="replenishPay">充值</span>
            </span> -->
          </div>
          <div class="dotted"></div>
          <div class="chooseType">
            <span class="typeText">选择支付令</span>
            <el-select v-model="scheme" placeholder="请选择方案" style="width:400px" @change="changeScheme">
              <el-option v-for="item in types" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </div>
          <table>
            <tr style="height:63px">
              <td>支付令</td>
              <td><span>{{payOrderDetailHelp.amount | toThousands}}</span>
                <span class="toTopUp flr" @click="checkDetail">查看明细</span>
                <p class="cnfnot">{{payOrderDetailHelp.amount || 0 | amountToChinese}}</p>
              </td>
            </tr>
            <tr style="height:63px">
              <td class="mainBgColor">折合现金</td>
              <td class="mainBgColor"><span class="amountColor">{{payOrderDetailHelp.currentAmount | toThousands}}</span>
              <p class="cnfnot">{{payOrderDetailHelp.currentAmount || 0 | amountToChinese}}</p>
              </td>
            </tr>
          </table>
        </div>
        <div class="payee-remark">
          <span class="pay-remark">备注说明</span>
          <input type="text" maxlength='20' class="remark-input" v-model="payerRemark" placeholder="请输入备注信息(仅我方可见)"
            autocomplete="username">
          <span style="color:rgba(87, 87, 87, 0.5);">20个字</span>
          <input type="text" style="width:0;height:0;">
        </div>
        <div class="error" v-if="lackNum>0">
          余额不足，请 <span class="toTopUp" @click="replenishPay">充值</span>
        </div>
        <div class="btn">
          <Button class="payBtn" @handleClick="setRequest" title="确认支付"
            :disabled="lackNum>0"></Button>
          <Button class="payBtn1" @handleClick="dialogVisible=true" title="拒绝支付"></Button>
        </div>
      </div>
      <div class="dialog">
        <el-dialog :visible.sync="dialogVisible" center width="576px" class="pay-table1">
          <p style="text-align:center;margin: 20px 0 ;font-size: 21px;">拒绝支付？</p>
          <p style="text-align:center;margin: 20px 0 9px;font-size: 16px;lineHeight:26px">确定要拒绝来自 <span
              class="payeeName">{{payOrderDetail.payeeName}} </span>的<br v-if="payOrderDetail.payeeName.length >= 18"/>收款请求吗？</p>
          <div slot="footer" class="dialog-footer">
            <Button class="confirm-btn" @handleClick="payOrder('Reject')" title="确定拒绝"></Button>
            <Button class="confirm-btn1" @handleClick="dialogVisible = false" title="取消"></Button>
          </div>
        </el-dialog>
        <el-dialog :visible.sync="dialogSucceed" center width="568px" class="pay-table1">
          <div class="password">
            <p class="prompt">验证支付密码</p>
            <span class="pay-psd" style="marginLeft:40px">支付密码</span>
            <input type="password" class="psd-input" v-model="password" placeholder="请输入支付密码"
              autocomplete="new-password">
            <span class="forget-psd" @click="forgetPsdVisible=true">忘记支付密码?</span>
          </div>
          <div style="margin: 10px 0 0 0;textAlign:center;color:#DB6363" v-if="errText">{{errText}}</div>
          <div slot="footer" class="dialog-footer">
            <Button class="confirm-btn" @handleClick="payOrder('Succeed')" title="确定" :disabled="payPsd"></Button>
            <Button class="confirm-btn1" @handleClick="dialogSucceed = false" title="取消"></Button>
          </div>
        </el-dialog>
        <el-dialog :visible.sync="dialogConfirm" center width="568px" class="pay-table2">
          <div class="password">
            <p class="prompt" style="marginBottom:14px">请确认支付信息</p>
            <table style="width:471px">
              <tr>
                <td>收款企业</td>
                <td>{{payOrderDetail.payeeName}}</td>
              </tr>
              <tr>
                <td>企业证件号</td>
                <td>{{payOrderDetail.payeeCreditCode}}</td>
              </tr>
              <tr>
                <td>发起收款金额</td>
                <td>
                  {{payOrderDetail.transactionAmount | toThousands}}
                </td>
              </tr>
              <tr>
                <td>支付金额</td>
                <td>
                  {{payOrderDetail.transactionAmount | toThousands}}
                </td>
              </tr>
              <tr>
                <td>平台补贴</td>
                <td>
                  {{payOrderDetailHelp.subsidy | toThousands}}
                </td>
              </tr>
              <tr>
                <td>服务费</td>
                <td>
                  {{payOrderDetailHelp.serviceFee | toThousands}}
                </td>
              </tr>
              <tr style="height:63px">
                <td class="mainBgColor">折合现金</td>
                <td class="mainBgColor"><span class="amountColor">{{payOrderDetailHelp.currentAmount | toThousands}}</span>
                  <p class="cnfnot">{{payOrderDetailHelp.currentAmount || 0 | amountToChinese}}</p>
                </td>
              </tr>
            </table>
          </div>
          <div slot="footer" class="dialog-footer">
            <Button class="confirm-btn" @handleClick="confirmPay" title="确定支付"></Button>
          </div>
        </el-dialog>
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
        <el-dialog :visible.sync="finalLimit" center width="568px"  class="pay-table1">
        <div class="password" style="width:457px">
          <p class="helpTitle1 mb30">系统提示</p>
          <p class="helpLine1">按照三方支付平台的限额要求，您此次支付订单服务费/返</p>
          <p class="helpLine1">还垫资金额过大，无法完成支付，请重新选择支付方案。</p>
        </div>
        <div slot="footer" class="dialog-footer">
          <Button class="confirm-btn bigW" @handleClick="finalLimit = false" title="确 定"></Button>
        </div>
      </el-dialog>
      </div>
    </div>
    <ForgetPasswordPop :dialogVisible="forgetPsdVisible" @handleClose="forgetPsdVisible=false"></ForgetPasswordPop>
    <NOPayPassword :setPsdVisible='!hasPassword' @handleClose="handleClose"></NOPayPassword>
    <!-- loading加载 -->
    <loading :loadingShow="loadingShow"></loading>
  </div>
</template>

<script>
import BusinessTitle from '@/components/BusinessTitle'
import ForgetPasswordPop from '@/components/ForgetPasswordPop'
import NOPayPassword from '@/components/NOPayPassword'
import settings from '@/settings'
export default {
  data () {
    return {
      payOrderDetail: {
        payeeName: ''
      },
      balanceDetail: [],
      errText: '',
      payOrderDetailHelp: {},
      errorAmount: false,
      finalLimit: false,
      payConfirmUrl: settings.apiGateway.payConfirm,
      payConfirmTimeOutUrl: settings.apiGateway.payConfirmTimeOut,
      toPayDetailUrl: settings.apiGateway.toPayDetail,
      toPayFeesDetailUrl: settings.apiGateway.toPayFeesDetail,
      // 检测账户是否设置支付密码
      checkIsSetPayPasswordUrl: settings.apiGateway.checkIsSetPayPassword,
      dialogVisible: false,
      loadingShow: false,
      forgetPsdVisible: false,
      dialogConfirm: false,
      dialogDetail: false,
      hasPassword: true,
      scheme: 'HOLD_SHORT_FIRST',
      types: [{ name: '方案一：服务费最少', value: 'HOLD_SHORT_FIRST' }, { name: '方案二：享受补贴最多', value: 'LAST_SHORT_FIRST' }, { name: '方案三：等候提现时间最短', value: 'LAST_LONG_FIRST' }],
      password: '',
      payerRemark: '',
      dialogSucceed: false,
      content: '此金额为预估数值，因精度原因在计算过程中可能出现一定误差，结算以实际入账金额为准。',
      checked: false
    }
  },
  methods: {
    handleClose () {
      this.hasPassword = true
      this.password = ''
    },
    ForgetPsd () {
      this.forgetPsdVisible = true
    },
    setPsd () {
      this.$router.push('/enterprise/change-password')
    },
    setRequest () {
      this.dialogConfirm = true
    },
    confirmPay () {
      this.dialogSucceed = true
      this.errText = ''
      this.password = ''
      this.dialogConfirm = false
    },
    payOrder (isAgree) {
      let data = {
        type: isAgree,
        scheme: this.scheme,
        transactionNumber: this.payOrderDetail.transactionNumber,
        password: this.password,
        remark: this.payerRemark,
        useGold: this.checked
      }
      this.fetch(`${this.payConfirmUrl}`, 'post', data).then(res => {
        this.dialogSucceed = false
        this.dialogVisible = false
        if (isAgree === 'Reject') {
          this.popUpSuccess({
            text: '操作成功',
            okBtn: '确定',
            ok: () => {
              this.goBack()
            }
          })
        } else {
          this.popUpSuccess({
            text: '支付申请已提交至管理员',
            okBtn: '确定',
            ok: () => {
              this.$router.push('/enterprise/payment')
            }
          })
        }
        this.$store.dispatch('updateCounters')
      }).catch(res => {
        this.dialogVisible = false
        if (isAgree === 'Succeed') {
          this.errText = res.data.msg
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    replenishPay () {
      if (this.payOrderDetailHelp.lack < 0) {
        this.$message.error('数据错误')
        return
      }
      this.$router.push({
        path: '/enterprise/top-up/start-top-up',
        query: {
          txNum: this.$route.query.txNum,
          scheme: this.scheme,
          status: this.$route.query.status
        }
      })
    },
    checkDetail () {
      this.balanceDetail = this.payOrderDetailHelp.balanceList
      this.dialogDetail = true
    },
    // 根据支付方案获取数据
    getFeeDetail () {
      this.fetch(`${this.toPayFeesDetailUrl}?transactionNumber=${this.$route.query.txNum}&scheme=${this.scheme}`).then(res => {
        this.payOrderDetailHelp = res.data
      }).catch(res => {
        this.$message({
          type: 'error',
          message: res.data.msg
        })
      })
    },
    // 切换支付方案
    changeScheme () {
      this.getFeeDetail()
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
    }
  },
  computed: {
    disabledPsd () {
      if (this.errorAmount) {
        return true
      } else {
        return false
      }
    },
    payPsd () {
      if (!this.password) {
        return true
      } else {
        return false
      }
    },
    // realBalance () {
    //   if (this.checked) {
    //     return this.payOrderDetailHelp.gold >= this.payOrderDetailHelp.serviceFee ? (this.payOrderDetailHelp.balance - this.payOrderDetailHelp.serviceFee).toFixed(2) : (this.payOrderDetailHelp.balance - this.payOrderDetailHelp.gold).toFixed(2)
    //   } else {
    //     return this.payOrderDetailHelp.balance || 0
    //   }
    // },
    lackNum () {
      if (this.checked) {
        return this.payOrderDetailHelp.gold >= this.payOrderDetailHelp.serviceFee ? this.payOrderDetailHelp.lack - this.payOrderDetailHelp.serviceFee : this.payOrderDetailHelp.lack - this.payOrderDetailHelp.gold
      } else {
        return this.payOrderDetailHelp.lack
      }
    }
  },
  created () {
    // this.getAccount()
    let txNum = this.$route.query.txNum
    this.fetch(this.checkIsSetPayPasswordUrl).then(data => {
      this.hasPassword = data.data.exist
      if (txNum) {
        this.fetch(`${this.toPayDetailUrl}${txNum}`).then(res => {
          this.payOrderDetail = res.data
        }).catch(res => {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        })
        this.getFeeDetail()
        // this.fetch(`${this.toPayFeesDetailUrl}?transactionNumber=${txNum}&scheme=${this.scheme}`).then(res => {
        //   this.payOrderDetailHelp = res.data
        // }).catch(res => {
        //   this.$message({
        //     type: 'error',
        //     message: res.data.msg
        //   })
        // })
      } else {
        this.$router.replace('/enterprise/payment')
      }
    }).catch(data => {
      this.$message({
        type: 'error',
        message: data.data.msg
      })
    })
  },
  components: {
    BusinessTitle,
    NOPayPassword,
    ForgetPasswordPop
  }
}
</script>
<style lang="less" scoped>
@import '~@/assets/less/variables';
.cnfnot {
  font-size: 13px;
  line-height: 13px;
  margin-bottom: 5px;
}
.pay-table, .pay-table2 {
  width: 100%;
  margin: 30px 0;
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
    // tr:nth-child(2n + 1) td {
    //   background-color: @theme-blue-light;
    //   background-color: var(--mainLightColor);
    // }
  }
  .tableTitle {
    position: relative;
    margin: 45px auto;
    width: 600px;
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
}
.goldHelp {
  float: right;
  margin-right: 15px;
  font-size: 20px;
  line-height: 30px;
  color: #ccc;
}
.error {
  font-weight: normal;
  // float: right;
  // position: relative;
  // bottom: -16px;
  // right: -469px;
  border: 1px solid rgba(230, 230, 230, 1);
  border-radius: 5px;
  width: 580px;
  margin: -17px auto 14px;
  height: 31px;
  line-height: 31px;
  text-align: center;
  background-color: @theme-blue-light;
  background-color: var(--mainLightColor);
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
.password {
  width: 471px;
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
    margin: 1px 14px 0 19px;
    background: #fcfcfc;
  }
  .forget-psd {
    cursor: pointer;
    color: @theme-blue;
    color: var(--mainColor);
    text-decoration: underline;
  }
  tr td:first-child {
    width: 130px !important;
    text-align: center;
    padding: 0 15px;
  }
}
.helpTitle1 {
  font-size: 22px;
  font-weight: 400;
  color: rgba(87, 87, 87, 1);
  line-height: 42px;
  text-align: center;
}
.helpLine1 {
  font-size: 18px;
  font-weight: 400;
  color: rgba(87, 87, 87, 1);
  line-height: 34px;
  text-align: left;
}
.mb30 {
  margin-bottom: 30px;
}
.btn {
  width: 580px;
  margin: 0 auto 50px;
  .payBtn, .payBtn1 {
    width: 200px;
    height: 40px;
    line-height: 40px;
    padding: 0;
    margin-left: 66px;
    box-shadow: 1px 6px 4px @btn-disabled;
    box-shadow: 1px 6px 4px var(--mainTableHover);
  }
  .payBtn1, .payBtn1:hover {
    border: 1px solid @theme-blue;
    border: 1px solid var(--mainColor);
    color: @theme-blue;
    color: var(--mainColor);
    background-color: #fff;
  }
}
.dialog-footer {
  margin-bottom: 21px;
  margin-top: -20px;
  .confirm-btn, .confirm-btn1 {
    padding-left: 50px;
    padding-right: 50px;
  }
  .bigW {
    padding: 0;
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
.hint {
  text-align: center;
  margin: 20px 0;
  font-size: 18px;
  line-height: 30px;
}
.el-icon-question {
  color: #ccc;
  margin-left: 15px;
}
.payeeName {
  font-weight: 700;
  color: @theme-blue;
  color: var(--mainColor);
}
.payee-remark {
  //width: 100%;
  width: 580px;
  margin: 0 auto;
  margin-bottom: 39px;
  .pay-remark {
    margin-left: 30px;
  }
  .remark-input {
    padding-left: 10px;
    width: 390px;
    height: 43px;
    border: 1px solid #e1e1e1;
    border-radius: 4px;
    margin: 0 14px 0 19px;
    background: #fcfcfc;
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
.chooseType {
  width: 580px;
  margin: 23px auto;
  .typeText {
    margin: 0 17px;
  }
}
.pay-table1, .pay-table2 {
  .password {
    width: 100%;
    margin-bottom: 15px;
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
<style lang="less">
@import '~@/assets/less/variables';
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
