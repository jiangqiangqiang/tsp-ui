<template>
  <div class="AtopToUpDetail">
    <BusinessTitle title="交易详情" isShowBack></BusinessTitle>
    <div class="content">
      <p class="title">等待充值</p>
      <div style="font-size:18px;text-align:center">剩余&nbsp;：<span
          class="colorMain">&nbsp;{{minutes}}&nbsp;</span>分<span class="colorMain">&nbsp;{{seconds}}&nbsp;</span>秒自动关闭
      </div>
      <div class="trading-message">
        <table>
          <tr>
            <td>企业名称</td>
            <td>{{enpName}}</td>
          </tr>
          <tr>
            <td class="mainBgColor">支付令金额</td>
            <!-- <td>{{amount | toThousands}}&nbsp;&nbsp;<span
                style="color:#D9D9D9">|</span>&nbsp;&nbsp;{{amount | amountToChinese}}</td> -->
            <td class="mainBgColor"><span class="themeColor">{{amount | toThousands}} 元</span>
              <p class="cnfnot">{{amount | amountToChinese}}</p>
            </td>
          </tr>
          <!-- <tr>
            <td>金币奖励</td>
            <td>{{commission}}&nbsp;&nbsp;( 流通后到账 )</td>
          </tr> -->
        </table>
      </div>
      <div class="btn">
        <Button title="取消交易" class="payBtn" @handleClick="dialogCancel=true"></Button>
        <Button title="去充值" class="payBtn" @handleClick="toTopUp"></Button>
      </div>
    </div>
    <!-- <form method="POST" style="display:none;" ref="postRequest" target="_blank" :action="url">
      <input type="text" name="returnURL" :value="returnURL">
      <input type="text" name="tspOrderNo" :value="tspOrderNo">
      <input type="text" name="tspID" :value="tspID">
      <input type="text" name="amount" :value="orderAmount">
      <input type="text" name="accountID" :value="accountID">
      <input type="text" name="timestamp" :value="timestamp">
      <input type="text" name="subject" :value="subject">
      <input type="text" name="sign" :value="sign">
    </form> -->
    <div class="top-up">
      <el-dialog :visible.sync="dialogVisible" center width="576px">
        <p style="text-align:center; font-size: 20px;">请确认充值信息</p>
        <div class="password">
          <table style="width:471px;margin-top:20px">
            <tr>
              <td>充值方企业名称</td>
              <td>{{enpName}}</td>
            </tr>
            <tr style="height:63px">
              <td>支付令金额</td>
              <td>
                <span class="fs16">{{amount.toString().replace(/,/g,'') | toThousands}}</span>
                <p class="cnfnot">{{amount.toString().replace(/,/g,'') | amountToChinese}}</p>
              </td>
            </tr>
            <!-- <tr>
              <td>奖励金币</td>
              <td>{{commission | toThousands}}&nbsp;&nbsp;( 流通后到账
                )</td>
            </tr> -->
          </table>
        </div>
        <div slot="footer" class="dialog-footer">
          <Button title="去充值" class="confirm-btn" @handleClick="payOrder"></Button>
          <Button title="取消" class="close" @handleClick="dialogVisible = false"></Button>
        </div>
      </el-dialog>
    </div>
    <div class="cancel-top-up">
      <el-dialog :visible.sync="dialogCancel" center width="500px">
        <p style="text-align:center; font-size: 20px;margin-bottom:20px">是否确定取消此次充值</p>
        <div slot="footer" class="dialog-footer">
          <Button title="确定取消" class="confirm-btn" @handleClick="cancel"></Button>
          <Button title="再想想" class="close" @handleClick="ddialogCancel = false"></Button>
        </div>
      </el-dialog>
    </div>
    <div class="allend">
      <el-dialog :visible.sync="topUpDialog" width="576px" center>
        <div class="top-up-message" style="text-align: center">
          <div>充值完成之前请不要关闭此窗口。</div>
          <div>请在弹出的充值页面完成充值。</div>
          <div>点击后, 系统将自动跳转至业务相关页面。</div>
        </div>
        <div slot="footer" class="dialog-footer">
          <Button title="支付成功" class="confirm-btn" @handleClick="checkIsTopUpScueess"></Button>
          <Button title="支付失败" class="close" @handleClick="checkIsTopUpScueess"></Button>
        </div>
      </el-dialog>
    </div>
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
      amount: 0,
      commission: 0,
      depositNumber: '',
      code: this.$route.query.code,
      dialogVisible: false,
      dialogCancel: false,
      topUpDialog: false,
      minutes: '00',
      seconds: '00',
      url: '',
      returnURL: '',
      enpName: JSON.parse(Getitem('userData')).enpName,
      tspOrderNo: '',
      orderAmount: '',
      notifyURL: '',
      accountID: '',
      sign: '',
      subject: '',
      timestamp: '',
      tspID: '',
      form: '',
      orderId: '',
      // 获取充值订单信息
      getTopUpOrderMessageUrl: settings.apiGateway.getTopUpOrderMessage,
      // 取消交易
      cancelledUrl: settings.apiGateway.cancelled
    }
  },
  methods: {
    toTopUp () {
      this.dialogVisible = true
    },
    payOrder () {
      // this.form.submit()
      let newpage = this.$router.resolve({
        name: 'cashierDesk1',
        query: {
          orderId: this.orderId,
          amount: this.amount
        }
      })
      window.open(newpage.href, '_blank')
      this.dialogVisible = false
      this.topUpDialog = true
      // this.TopUpSuccess()
    },
    setTime () {
      let timer = setInterval(() => {
        if (this.cutdowns > 0) {
          // var h = msRes / 3600 < 10 ? ('0' + parseInt(msRes / 3600)) : parseInt(msRes / 3600)
          this.minutes = (this.cutdowns / 60) < 10 ? ('0' + parseInt(this.cutdowns / 60)) : parseInt(this.cutdowns / 60)
          this.seconds = (this.cutdowns % 60) < 10 ? ('0' + parseInt(this.cutdowns % 60)) : parseInt(this.cutdowns % 60)
          this.cutdowns--
        }
        if (this.cutdowns <= 0) {
          clearInterval(timer)
        }
      }, 1000)
    },
    cancel () {
      this.fetch(`${this.cancelledUrl}${this.code}`, 'put').then(data => {
        this.$router.push('/allocator/top-up')
        this.dialogCancel = false
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
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
    }
  },
  created () {
    this.fetch(`${this.getTopUpOrderMessageUrl}${this.code}`).then(data => {
      this.amount = data.data.depositAmount
      this.commission = data.data.gold
      this.depositNumber = data.data.depositNumber
      this.orderId = data.data.orderId
      this.cutdowns = Math.ceil(data.data.expirationTime / 1000)
      this.setTime()
    }).catch(data => {
      if (data.data.msg === '订单已过期') {
        this.cancel()
      }
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
  margin-bottom: 7px;
}
.fs16 {
  font-size: 16px;
  line-height: 30px;
  font-weight: bold;
  color: @theme-blue !important;
  color: var(--mainColor) !important;
}
.content {
  width: 60%;
  margin: 40px auto;
  .title {
    font-size: 18px;
    text-align: center;
    font-weight: 400;
    color: rgba(61, 61, 61, 1);
    margin-bottom: 15px;
  }
  .trading-message {
    width: 70%;
    margin: 50px auto;
  }
  .btn {
    width: 500px;
    margin: 80px auto;
    .payBtn {
      width: 150px;
      height: 40px;
      line-height: 40px;
      padding: 0;
      margin-left: 66px;
      border: none;
      background-color: @theme-blue;
      background-color: var(--mainColor);
      box-shadow: 1px 6px 4px @btn-disabled;
      box-shadow: 1px 6px 4px var(--mainTableHover);
    }
  }
}
.themeColor {
  font-size: 16px;
  font-weight: bold;
  color: @theme-blue !important;
  color: var(--mainColor) !important;
}
table {
  width: 100%;
  margin: 0 auto;
  tr {
    td {
      height: 40px;
      line-height: 40px;
      border: 1px solid #e6e6e6;
    }
    td:first-child {
      width: 120px !important;
      text-align: center;
      padding: 0 15px;
      background-color: #FAFAFA;
    }
    td:last-child {
      text-align: left;
      padding-left: 20px;
    }
    .mainBgColor {
      background-color: @theme-blue-light !important;
      background-color: var(--mainLightColor) !important;
    }
  }
  tr:last-child td {
    line-height: 30px;
    background-color: @theme-blue-light;
    background-color: var(--mainLightColor);
  }
}
.colorMain {
  color: @theme-blue;
  color: var(--mainColor);
  font-size: 35px;
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
}
.top-up-message {
  width: 526px;
  margin: 0px auto;
  margin-top: 21px;
  font-size: 16px;
  line-height: 30px;
  .message {
    margin-left: 20px;
  }
}
</style>

<style lang="less">
.top-up {
  .el-dialog {
    position: absolute;
    top: 50% !important;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    margin-top: 0 !important;
    margin-left: 108px;
  }
}
.cancel-top-up {
  .el-dialog {
    position: absolute;
    top: 50% !important;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    margin-top: 0 !important;
    margin-left: 108px;
  }
}
.AtopToUpDetail .allend {
  .el-dialog {
    position: absolute;
    top: 50% !important;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    margin-top: 0 !important;
    margin-left: 108px;
  }
}
</style>
