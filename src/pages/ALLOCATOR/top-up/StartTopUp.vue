<template>
  <div class="start-top-up1">
    <BusinessTitle title="发起充值" isShowBack></BusinessTitle>
    <div class="top-up--main">
      <div class="amount-content">
        <span class="amount">企业名称</span>
        <el-input maxlength="20" class="amount-input disInput" v-model="companyName" disabled></el-input>
        <div class="mt30"></div>
        <span class="amount ml">支付令金额</span>
        <el-input maxlength="20" placeholder="请输入支付令金额" class="amount-input" v-model="amount" @focus="CountersignAmount"
          @blur="dataLayout" :disabled="type == 2"></el-input>
        <el-tooltip class="item" effect="light" placement="right">
          <div slot="content">
            A，充值奖励：充值成功后，系统会奖励等额的金币。<br />B，金币到账：当企业方交易中包含垫资的金额时，系统会发放<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;等额的金币到垫资方账户。
            <br />C，金币提现：从充值日开始计算，一年后可以提现，获得利益。
          </div>
          <i class="el-icon-question goldHelp"></i>
        </el-tooltip>
        <!-- <span class="unit">元</span> -->
        <div class="trans-warning fs14" v-if="amount.toString().replace(/,/g, '')>0">
          <span class="transUpText">&nbsp;</span>
          {{amount.toString().replace('/,/g','') || 0 | amountToChinese}}
        </div>
        <!-- <div class="commission" v-if='type===1 || $route.query.lack >= limitAmount'>
          <span class="amount">金币奖励</span>
          <el-input type="text" class="commission-input" disabled v-model="commission"></el-input>
          <el-tooltip class="item" effect="light" placement="right">
            <div slot="content">
              金币是好快通宝用户在支付令金额时给予的奖励，金币奖励<br />会在金额流通之后奖励给充值方，企业可以使用金币<br />用于抵扣平台中的服务费（支付服务费和提现服务费），<br />也可以在一年后提现，起始时间以充值日期为准。
            </div>
            <i class="el-icon-question goldHelp"></i>
          </el-tooltip>
        </div> -->
        <Button title="充值" class="btn" :disabled="disabled" @handleClick="CountersignTopUp"></Button>
      </div>
      <div class="amount-error" v-if="amountErr">单次支付令金额不能少于{{limitAmount |  toThousands}}元</div>
    </div>
    <!-- loading加载 -->
    <loading :loadingShow="loadingShow"></loading>
    <div>
      <el-dialog :visible.sync="dialogVisible" width="576px" center :before-close="handleCloseTopUp">
        <p style="text-align:center; font-size: 20px;">请确认充值信息</p>
        <div class="password">
          <table style="width:471px">
            <tr>
              <td>充值方企业名称</td>
              <td>{{enpName}}</td>
            </tr>
            <tr>
              <td>支付令金额</td>
              <td><span class="fs16">{{amount.toString().replace(/,/g,'') | toThousands}}</span>
                <p class="cnfnot">{{amount.toString().replace(/,/g,'') | amountToChinese}}</p>
              </td>
            </tr>
            <!-- <tr v-if='type===1 || $route.query.lack >= limitAmount'>
              <td>奖励金币</td>
              <td>{{commission.toString().replace(/,/g,'') | toThousands}}&nbsp;&nbsp;( 流通后到账
                )</td>
            </tr> -->
          </table>
        </div>
        <div slot="footer" class="dialog-footer">
          <Button title="确定充值" class="confirm-btn" @handleClick="payOrder"></Button>
        </div>
      </el-dialog>
    </div>
    <el-dialog :visible.sync="topUpDialog" width="576px" center :before-close="handleClose">
      <div class="top-up-message" style="text-align: center">
        <div>充值完成之前请不要关闭此窗口。</div>
        <div>请在弹出的充值页面完成充值。</div>
        <div style="marginBottom:1px">点击后, 系统将自动跳转至业务相关页面。</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <Button title="支付成功" class="confirm-btn" @handleClick="checkIsTopUpScueess"></Button>
        <Button title="支付失败" class="close" @handleClick="checkIsTopUpScueess"></Button>
      </div>
    </el-dialog>
    <form method="POST" style="display:none;" ref="postRequest" target="_blank" :action="url">
      <input type="text" name="returnURL" :value="returnURL">
      <!-- <input type="text" name="notifyURL" :value="notifyURL"> -->
      <input type="text" name="tspOrderNo" :value="tspOrderNo">
      <input type="text" name="tspID" :value="tspID">
      <input type="text" name="amount" :value="orderAmount">
      <input type="text" name="accountID" :value="accountID">
      <input type="text" name="timestamp" :value="timestamp">
      <input type="text" name="subject" :value="subject">
      <input type="text" name="sign" :value="sign">
    </form>
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
      orderNum: '',
      amountErr: '',
      amount: this.$route.query.lack || '0.00',
      // 金币
      commission: '0.00',
      companyName: '企业名',
      // 充值类型
      type: Number.parseInt(this.$route.query.type) || 1,
      limitAmount: 1000,
      enpName: JSON.parse(Getitem('userData')).enpName,
      url: '',
      returnURL: '',
      tspOrderNo: '',
      orderAmount: '',
      notifyURL: '',
      accountID: '',
      sign: '',
      subject: '',
      timestamp: '',
      tspID: '',
      orderId: '',
      form: '',
      // 提交充值
      submitTopUpUrl: settings.apiGateway.submitTopUp,
      // 根据充值获取金币
      getGoldNum: settings.apiGateway.getGoldNum,
      // 充值成功/充值失败跳转到第三方
      TopUpScueessUrl: settings.apiGateway.TopUpScueess,
      // 获取三方充值信息
      getThirdpartyUrl: settings.apiGateway.getThirdparty,
      // 检查交易是否成功
      checkIsTopUpScueessUrl: settings.apiGateway.checkIsTopUpScueess,
      // 获取参数信息
      systemConfigUrl: settings.apiGateway.sysParam,
      // 删除订单
      deleteOrderUrl: settings.apiGateway.deleteOrder
    }
  },
  methods: {
    CountersignAmount () {
      this.amountErr = false
      if (this.amount <= 0) {
        this.amount = ''
      } else if (this.amount) {
        this.amount = this.amount.toString().replace(/,/g, '')
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
          this.commission = '0.00'
          this.$message.error('单次充值不得少于1000.00元')
          return
        }
        // const params = '?amount=' + this.amount
        // this.getGolds(params)
        this.amount = this.toThousands(this.amount)
      }
    },
    getGolds (params) {
      this.fetch(this.getGoldNum + params, 'get').then(data => {
        this.commission = this.toThousands(data.data)
      }).catch(data => {
        this.$message.error(data.data.msg)
      })
    },
    CountersignTopUp () {
      let amount = this.amount.toString().replace(/,/g, '')
      if (amount && amount < this.limitAmount && this.type !== 2) {
        this.amountErr = true
      } else {
        this.amountErr = false
        this.dialogVisible = true
        this.getOrderId()
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
    toTopUp () {
      // this.fetch(`${this.getThirdpartyUrl}${this.orderId}`).then(data => {
      //   this.orderNum = data.data.depositNumber
      //   this.url = data.data.payRequestUrl
      //   this.tspOrderNo = data.data.payReqDto.tspOrderNo
      //   this.returnURL = data.data.payReqDto.returnURL
      //   this.orderAmount = data.data.payReqDto.amount
      //   this.accountID = data.data.payReqDto.accountID
      //   this.notifyURL = data.data.payReqDto.notifyURL
      //   this.subject = data.data.payReqDto.subject
      //   this.sign = data.data.payReqDto.sign
      //   this.timestamp = data.data.payReqDto.timestamp
      //   this.tspID = data.data.payReqDto.tspID
      //   this.form = this.$refs.postRequest
      // }).catch(data => {
      //   this.$message.error(data.data.msg)
      // })
    },
    payOrder () {
      // 跳转收银台选择银行
      let newpage = this.$router.resolve({
        name: 'cashierDesk1',
        query: {
          orderId: this.orderId,
          amount: parseFloat(this.amount.toString().replace(/,/g, ''))
        }
      })
      window.open(newpage.href, '_blank')
      // this.toTopUp()
      // this.form.submit()
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
        path: '/allocator/top-up/top-up-success',
        query: {
          amount: String(amount),
          code: this.orderId + '',
          isTag: 'true'
        }
      })
    },
    getParaInfo () {
      // 获取参数信息
      this.fetch(this.systemConfigUrl, 'get').then(data => {
        this.limitAmount = data.data.depositLowerLimit
        if (this.$route.query.lack && this.$route.query.lack > this.limitAmount) {
          const params = '?amount=' + this.$route.query.lack
          this.getGolds(params)
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
      } else if (amount < this.limitAmount || amount > 100000000) {
        return true
      } else if (amount && this.amountErr === false) {
        return false
      } else {
        return true
      }
    }
  },
  created () {
    this.companyName = JSON.parse(Getitem('userData')).enpName
    this.getParaInfo()
    if (this.$route.query.lack) this.amount = this.toThousands(this.$route.query.lack)
  },
  beforeRouteEnter (to, from, next) {
    if (from.path === '/allocator/top-up-schedule') {
      next(vm => {
        vm.$router.replace('/allocator/top-up')
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
  font-weight: bold;
  color: @theme-blue !important;
  color: var(--mainColor) !important;
}
.error-warning {
  color: rgba(87, 87, 87);
  width: 310px;
  position: absolute;
  right: -303px;
  top: 14px;
}
.fs14 {
  font-size: 14px;
}
.trans-warning {
  color: rgba(87, 87, 87, 0.7);
  width: 310px;
  margin-top: 10px;
}
.transUpText {
  margin-left: 73px;
  margin-right: 20px;
  color: #333333;
}
.password {
  margin-top: 20px;
}
table {
  width: 600px;
  margin: 0 auto;
  .amountColor {
    font-size: 16px;
    font-family: ArialMT;
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
    }
  }
  tr:last-child td {
    line-height: 30px;
    background-color: @theme-blue-light;
    background-color: var(--mainLightColor);
  }
}
.amount-content {
  position: relative;
  width: 500px;
  margin: 72px auto;
  .amount {
    margin-left: 14px;
  }
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
    position: relative;
    .goldHelp {
      position: absolute;
      top: 10px;
      right: -10px;
      font-size: 22px;
      color: #ccc;
    }
  }
}
.goldHelp {
  position: absolute;
  top: 80px;
  right: -10px;
  font-size: 22px;
  color: #ccc;
}
.mt30 {
  margin-top: 25px;
}
.ml {
  margin-left: 0 !important;
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
</style>

<style lang="less">
.start-top-up1 {
  .el-dialog {
    position: absolute;
    top: 50% !important;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    margin-top: 0 !important;
    margin-left: 108px;
  }
}
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
.start-top-up1 .amount-input .el-input__inner:focus {
  border-color: #118eea !important;
  border-color: var(--mainColor) !important;
}
.start-top-up1 .amount-input input:focus {
  border-color: #118eea !important;
  border-color: var(--mainColor) !important;
}
</style>
