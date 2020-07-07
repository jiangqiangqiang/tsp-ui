<template>
  <div class="start-top-up">
    <BusinessTitle title="发起充值" isShowBack></BusinessTitle>
    <div class="top-up--main">
      <div class="amount-content">
        <span class="amount">企业名称</span>
        <el-input maxlength="20" class="amount-input disInput" v-model="enpName" disabled></el-input>
        <div class="mt30"></div>
        <!-- 支付令金额 -->
        <div style="position:relative">
          <span class="amount ml">支付令金额</span>
          <el-input maxlength="20" placeholder="请输入支付令金额" class="amount-input" v-model="amount"
            @focus="CountersignAmount" @blur="dataLayout" :disabled="type == 2"></el-input>
          <!-- <div class="error-warning fs14" v-if="amount.toString().replace(/,/g, '')>0">
            {{amount.toString().replace('/,/g','') || 0 | amountToChinese}}
          </div> -->
          <div class="error-warning fs14 errColor" v-if="amountErr"><i class="el-icon-error"></i>&nbsp;&nbsp;单次充值不得少于{{limitAmount |  toThousands}}元</div>
        </div>
        <div style="position:relative">
          <div class="error-warning1 fs14">
            {{amount.toString().replace('/,/g','') || 0 | amountToChinese}}
          </div>
        </div>
        <!-- 服务费 -->
        <div class="commission">
          <span class="amount" style="marginLeft:-9px;">服务费
            <el-tooltip class="item" effect="light" placement="right">
              <div slot="content">
                充值服务费 = 支付令金额 * {{serviceFeeRate}}%<span v-if="type===2">（最少0.5元）</span>
              </div>
              <i class="el-icon-question goldHelp1"></i>
            </el-tooltip>
          </span>
          <span class="rightContent"><span class="commissionItem">{{commission.serviceAmount | toThousands}}
              元</span></span>
        </div>
        <!-- 实际支付金额 -->
        <div class="commission">
          <span class="amount" style="marginLeft:-32px">实际支付金额</span>
          <span class="rightContent"><span class="commissionItem themeColor">{{commission.total | toThousands}}
              元</span></span>
        </div>
        <div class="commission" style="marginTop:12px">
          <span class="rightContent rightC"><span class="chansferItem">{{commission.total || 0 | amountToChinese}}</span></span>
        </div>
        <Button title="充值" class="btn" :disabled="disabled" @handleClick="CountersignTopUp"></Button>
      </div>
    </div>
    <!-- loading加载 -->
    <loading :loadingShow="loadingShow"></loading>
    <div>
      <el-dialog :visible.sync="dialogVisible" width="576px" center :before-close="handleCloseTopUp" class="pay-table1">
        <p style="text-align:center; font-size: 20px;">请确认充值信息</p>
        <div class="password">
          <table style="width:471px;">
            <tr>
              <td>企业名称</td>
              <td>{{enpName}}</td>
            </tr>
            <tr>
              <td>支付令金额</td>
              <td>{{amount.toString().replace(/,/g,'') | toThousands}}</td>
            </tr>
            <tr>
              <td>服务费</td>
              <td>{{commission.serviceAmount | toThousands}} 元</td>
            </tr>
            <tr style="height:63px">
              <td class="mainBgColor">实际支付金额</td>
              <td class="mainBgColor"><span class="themeColor fs16">{{commission.total | toThousands}} 元</span>
              <p class="cnfnot">{{commission.total | amountToChinese}}</p>
              </td>
            </tr>
          </table>
        </div>
        <div slot="footer" class="dialog-footer">
          <Button title="确定充值" class="confirm-btn" @handleClick="payOrder"></Button>
        </div>
      </el-dialog>
      <!-- <el-dialog :visible.sync="toUpCancle" width="576px" center>
        <p style="text-align:center; font-size: 20px;">无法充值</p>
        <div class="password">
          <p class="reasonContent left">原因：垫资方余额不足，目前最多可充值 <span
              class="mainColor">{{allocatorBalance || 0 | toThousands}}</span>元。 </p>
          <p class="reasonContent left">非常抱歉给您带来的困扰，我们会尽快通知垫资方充值。 </p>
          <p class="reasonContent">您还可以通过二级市场买令获得支付令。 </p>
        </div>
        <div slot="footer" class="dialog-footer">
          <Button title="知道了" class="confirm-btn" @handleClick="toUpCancle = false"></Button>
        </div>
      </el-dialog> -->
    </div>
    <el-dialog :visible.sync="topUpDialog" width="576px" center :before-close="handleClose" class="pay-table1">
      <div class="top-up-message" style="text-align: center">
        <div>充值完成之前请不要关闭此窗口。</div>
        <div>请在弹出的充值页面完成充值。</div>
        <div style="marginBottom:1px;">点击后, 系统将自动跳转至业务相关页面。</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <Button title="支付成功" class="confirm-btn" @handleClick="checkIsTopUpScueess"></Button>
        <Button title="支付失败" class="close" @handleClick="checkIsTopUpScueess"></Button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BusinessTitle from '@/components/BusinessTitle'
import settings from '@/settings'
import { Getitem } from '@/services/CommonService.js'
export default {
  components: {
    BusinessTitle
  },
  data () {
    return {
      loadingShow: false,
      topUpDialog: false,
      formLabelAlign: {
        name: ''
      },
      dialogVisible: false,
      // toUpCancle: false,
      orderNum: '',
      amountErr: '',
      amount: '0.00',
      // 实付金额
      commission: {
        total: 0,
        serviceAmount: 0
      },
      // 充值类型
      type: 1,
      lack: 0,
      maxTopUp: 0,
      limitAmount: 1000,
      serviceFeeRate: 0.05,
      enpName: JSON.parse(Getitem('userData')).enpName,
      orderId: '',
      form: '',
      allocatorBalance: 0,
      // 提交充值
      submitTopUpUrl: settings.apiGateway.submitTopUp,
      // 根据充值获取金币
      getCalcuAmountUrl: settings.apiGateway.getCalcuAmount,
      // 充值成功/充值失败跳转到第三方
      TopUpScueessUrl: settings.apiGateway.TopUpScueess,
      // 获取三方充值信息
      getThirdpartyUrl: settings.apiGateway.getThirdparty,
      // 检查交易是否成功
      checkIsTopUpScueessUrl: settings.apiGateway.checkIsTopUpScueess,
      // 获取参数信息
      systemConfigUrl: settings.apiGateway.sysParam,
      // 删除订单
      deleteOrderUrl: settings.apiGateway.deleteOrder,
      // 检查垫资方资金是否充足
      getAllocatorBalaceUrl: settings.apiGateway.getAllocatorBalace,
      // 获取支付费用信息
      toPayFeesDetailUrl: settings.apiGateway.toPayFeesDetail
    }
  },
  methods: {
    CountersignAmount () {
      this.amountErr = false
      if (this.amount <= 0) {
        this.amount = ''
      } else if (this.amount) {
        this.amount = this.amount.toString().replace(/,/g, '')
        this.commission = {
          total: 0,
          serviceAmount: 0
        }
      }
    },
    // 金额格式化
    toThousands (val) {
      if (!val && (val !== 0 || val !== '0')) return ''
      let str = String(val).replace(/,/g, '')
      let num1 = str.split('.')[0]
      let num = parseFloat('0.' + str.split('.')[1]).toFixed(3) // 这里因为我需要两位小数所以做一个限制，你们看情况做小数位的限制
      str = num1 + '.' + String(num).split('.')[1]
      // num = parseFloat(num).toFixed(3)
      let s = str.substring(0, (str.length - 1)) // 只取小数位2位
      return s && s.toString().replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
        return $1 + ','
      })
    },
    dataLayout () {
      this.amount = parseFloat(this.amount.toString().replace(/,/g, '')) || ''
      if (!isNaN(this.amount)) {
        if (this.amount < this.limitAmount && this.type !== 2) {
          this.commission = {
            total: 0,
            serviceAmount: 0
          }
          // this.$message.error('单次充值不得少于1000.00元')
          this.amountErr = true
          return
        }
        const params = '?amount=' + this.amount
        this.getRate(params)
        this.amount = this.toThousands(this.amount)
      }
    },
    getRate (params) {
      this.fetch(this.getCalcuAmountUrl + params).then(data => {
        this.commission = JSON.parse(data.data)
      }).catch(data => {
        this.$message.error(data.data.msg)
      })
    },
    CountersignTopUp () {
      let amount = this.amount.toString().replace(/,/g, '')
      if (amount && amount < this.limitAmount && this.type !== 2) {
        this.amountErr = true
      } else {
        if (amount && this.type === 2 && amount < this.limitAmount) {
          this.amountErr = false
          this.dialogVisible = true
          this.getOrderId()
        } else {
          // this.fetch(this.getAllocatorBalaceUrl + amount).then(data => {
          //   if (data.data.isStatus === 2) {
          //     this.toUpCancle = true
          //     this.allocatorBalance = data.data.surplusMax
          //   } else {
          this.amountErr = false
          this.dialogVisible = true
          this.getOrderId()
          //   }
          // }).catch(data => {
          //   this.$message.error(data.data.msg)
          // })
        }
      }
    },
    getOrderId () {
      let data = {
        amount: parseFloat(this.amount.toString().replace(/,/g, '')),
        type: this.type
      }
      this.fetch(`${this.submitTopUpUrl}`, 'post', data).then(data => {
        this.orderId = data.data
      }).catch(data => {
        this.$message.error(data.data.msg)
      })
    },
    // 提交跳转收银台去选择银行
    payOrder () {
      let newpage = this.$router.resolve({
        name: 'cashierDesk',
        query: {
          orderId: this.orderId,
          amount: parseFloat(this.commission.total) || parseFloat(this.amount.toString().replace(/,/g, ''))
          // amount: parseFloat(this.amount.toString().replace(/,/g, ''))
        }
      })
      window.open(newpage.href, '_blank')
      this.dialogVisible = false
      this.TopUpSuccess()
    },
    handleClose () {
      this.topUpDialog = false
    },
    handleCloseTopUp () {
      this.dialogVisible = false
      this.fetch(`${this.deleteOrderUrl}${this.orderId}`, 'post').then(data => {
        this.dialogVisible = false
      }).catch(data => {
        this.$message.error(data.data.msg)
      })
    },
    TopUpSuccess () {
      this.topUpDialog = true
    },
    checkIsTopUpScueess () {
      let amount = this.amount.toString().replace(/,/g, '')
      this.$router.push({
        path: '/enterprise/top-up/top-up-success',
        query: {
          amount: String(amount),
          code: this.orderId + '',
          isTag: 'true'
        }
      })
      this.loadingShow = true
    },
    // 获取参数信息
    getParaInfo () {
      this.fetch(this.systemConfigUrl, 'get').then(data => {
        this.limitAmount = data.data.depositLowerLimit
        this.serviceFeeRate = data.data.serviceFeeRate * 100
        this.maxTopUp = data.data.depositMaxAmount
        if (this.lack && this.lack >= this.limitAmount) {
          const params = '?amount=' + this.lack
          this.getRate(params)
        }
      }).catch(res => {
        this.$message.error(res.data.msg)
      })
    },
    // 获取补充充值费用信息
    getLackFee () {
      this.fetch(`${this.toPayFeesDetailUrl}?transactionNumber=${this.$route.query.txNum}&scheme=${this.$route.query.scheme}`).then(res => {
        if (res.data.lack > 0) {
          this.amount = this.toThousands(res.data.lack)
          this.lack = res.data.lack
          this.type = 2
          this.dataLayout()
        }
      }).catch(res => {
        this.$message.error(res.data.msg)
      })
    }
  },
  computed: {
    disabled () {
      let amount = this.amount.toString().replace(/,/g, '')
      if (this.type === 2) {
        return false
      } else if (amount < this.limitAmount || amount > this.maxTopUp) {
        return true
      } else if (amount && this.amountErr === false) {
        return false
      } else {
        return true
      }
    }
  },
  created () {
    this.getParaInfo()
    // 补充充值
    if (this.$route.query.txNum) this.getLackFee()
  },
  beforeRouteEnter (to, from, next) {
    if (from.path === '/enterprise/top-up-schedule') {
      next(vm => {
        vm.$router.replace('/enterprise/top-up')
      })
    }
    next()
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
.fs16 {
  font-size: 16px;
}
.amount-content .disInput/deep/ .el-input__inner {
  // font-family: SimSun;
  font-size: 16px;
}
.error-warning {
  color: rgba(87, 87, 87);
  width: 310px;
  position: absolute;
  right: -303px;
  top: 15px;
}
.error-warning1 {
  margin-top: 12px;
  margin-left: 93px;
  color: rgba(87, 87, 87);
}
.fs14 {
  font-size: 14px;
}
.errColor {
  color: rgb(219,69,68);
}
.password {
  margin-top: 20px;
  .reasonContent {
    width: 100%;
    margin: 0 auto;
    font-size: 16px;
    text-align: center;
    color: rgba(87, 87, 87, 1);
    line-height: 42px;
    .mainColor {
      font-weight: bold;
      color: @theme-blue;
      color: var(--mainColor);
    }
  }
  .left {
    text-align: left;
    margin-left: 65px;
  }
}
table {
  width: 600px;
  margin: 0 auto;
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
    }
    td:first-child {
      width: 120px;
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
.mt30 {
  margin-top: 23px;
}
.ml {
  margin-left: -16px;
}
.amount-content {
  position: relative;
  width: 500px;
  margin: 30px auto 72px;
  font-size: 16px;
  // font-family: SimSun;
  color: rgba(87, 87, 87, 1);
  .unit {
    position: absolute;
    left: 450px;
    top: 15px;
  }
  .btn {
    width: 392px;
    height: 50px;
    margin: 24px 0 0 90px;
    box-shadow: 1px 6px 4px @btn-disabled;
    box-shadow: 1px 6px 4px var(--mainTableHover);
  }
  .commission {
    width: 100%;
    margin-top: 23px;
    .goldHelp {
      position: absolute;
      top: 10px;
      right: -10px;
      font-size: 22px;
      color: #ccc;
    }
    .goldHelp1 {
      font-size: 18px;
      color: #ccc;
      margin-left: 3px;
    }
    .rightContent {
      margin-left: 24px;
      width: 300px;
      position: relative;
      .commissionItem {
        font-size: 16px;
        font-family: Arial;
        color: #575757;
      }
      .splitItem {
        color: #cacaca;
        margin: 0 10px;
      }
      .chansferItem {
        position: absolute;
        top: 0;
        left: 0;
        width: 300px;
        color: rgba(87, 87, 87);
        font-size: 14px;
      }
    }
    .rightC {
      margin-left: 93px;
    }
  }
}
.themeColor {
  font-weight: bold;
  color: @theme-blue !important;
  color: var(--mainColor) !important;
}
.amount-error {
  width: 250px;
  position: relative;
  // right:164px;
  // top:248px;
  left: 830px;
  bottom: 199px;
  color: red;
}
.dialog-footer {
  margin-bottom: 20px;
  .el-button {
    border-radius: 5px;
    padding-left: 50px;
    padding-right: 50px;
  }
  .confirm-btn {
    background-color: @theme-blue;
    background-color: var(--mainColor);
    border: none;
  }
  // .close:hover {
  //   background-color: @table-hover;
  //   background-color: var(--mainTableHover);
  // }
}
.top-up-message {
  width: 526px;
  margin: 0px auto;
  margin-top: 20px;
  font-size: 16px;
  line-height: 30px;
  .message {
    margin-left: 20px;
  }
}
.pay-table1 {
  .password {
    width: 100%;
  }
}
</style>

<style lang="less">
.amount-content {
  .amount-input {
    width: 392px;
    .el-input__inner {
      width: 392px;
      height: 45px;
      line-height: 14px;
      padding-top: 12px;
      padding-bottom: 12px;
      background: #fcfcfc;
      border: 1px solid #e1e1e1;
      border-radius: 4px;
      margin-left: 17px;
      padding-left: 8px;
    }
  }
  .disInput {
    .el-input__inner {
      background: #e7e7e7;
    }
  }
  .commission-input {
    width: 392px;
    .el-input__inner {
      width: 392px;
      height: 45px;
      line-height: 14px;
      padding-top: 12px;
      padding-bottom: 12px;
      background: #fcfcfc;
      border: 1px solid #e1e1e1;
      border-radius: 4px;
      margin-left: 17px;
      padding-left: 8px;
      background: #e7e7e7;
    }
  }
}
.start-top-up .amount-input .el-input__inner:focus {
  border-color: #118eea !important;
  border-color: var(--mainColor) !important;
}
.start-top-up .amount-input input:focus {
  border-color: #118eea !important;
  border-color: var(--mainColor) !important;
}
</style>
