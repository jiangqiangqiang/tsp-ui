<template>
  <div class="buy_to_detail">
    <BusinessTitle title="交易详情" isShowBack></BusinessTitle>
    <div class="content">
      <div v-if="$route.query.status === 'Pending' || $route.query.status === 'Paying'">
        <p class="title">交易倒计时</p>
        <div style="font-size:18px;text-align:center">剩余&nbsp;：<span
            class="colorMain">&nbsp;{{cutTime | setTimeHour}}&nbsp;</span>时<span
            class="colorMain">&nbsp;{{cutTime | setTimeMinutes}}&nbsp;</span>分<span
            class="colorMain">&nbsp;{{cutTime | setSecond}}&nbsp;</span>秒
        </div>
      </div>
      <!-- <div v-else class="buyTitleText">支付令交易订单</div> -->
      <div class="trading-message">
        <!-- <div class="detailText">
          <span class="leftCodeText">交易编号：{{detailList.txCode}}</span>
          <span class="midTime">发布时间：{{detailList.createdOn || detailList.applyTime}}</span>
          <span class="rightStatus"
            v-if="$route.query.status !== 'confirm'">状态：{{$route.query.status | saleStatus}}</span>
        </div> -->
      <!-- 金额明细 -->
      <div class="buyTableTitle">金额明细</div>
      <div class="dotted"></div>
        <table>
          <tr>
            <td>购买支付令</td>
            <td class="dealCount">
              <span>
                {{detailList.tokenNum || 0 | toThousands}}
              </span>
            </td>
          </tr>
          <tr>
            <td>折扣率</td>
            <td class="dealCount">{{detailList.rate*100 | toFix2}}%</td>
          </tr>
          <tr>
            <td>报价</td>
            <td class="dealCount">
              <span>
                {{detailList.amount || 0 | toThousands}}
              </span>
            </td>
          </tr>
          <tr>
            <td>服务费
              <!-- <el-tooltip class="item" effect="light" placement="right">
                <div slot="content" style="lineHeight:20px">
                  交易服务费 = 购买令额 * {{detailList.feeRate * 100}}%（最少0.5元）
                </div>
                <i class="el-icon-question goldHelp"></i>
              </el-tooltip> -->
            </td>
            <td class="dealCount">
              <span>
                {{detailList.fee || 0 | toThousands}}
              </span>
            </td>
          </tr>
          <tr style="height:63px">
            <td>实际支付金额</td>
            <td class="dealCount">
              <span class="mainColor">
                {{detailList.realAmount || 0 | toThousands}}
              </span>
              <p class="cnfnot">{{detailList.realAmount || 0 | amountToChinese}}</p>
            </td>
          </tr>
          <tr v-if="detailList.remark">
            <td>备注说明</td>
            <td class="dealCount">
              {{detailList.remark}}
            </td>
          </tr>
        </table>
        <!-- <div class="detailText" v-if="$route.query.status !== 'confirm'">
          <span class="leftCodeText">
            操作员：{{detailList.operatorName}}
          </span>
          <span class="rightStatus" v-if="$route.query.status !== 'Pending' && detailList.adminName">
            管理员：{{detailList.adminName}}
          </span>
        </div> -->
        <div class="payee-remark" v-if="$route.query.status === 'confirm'">
          <span class="pay-remark">备注说明</span>
          <input type="text" maxlength='20' class="remark-input" v-model="remark" placeholder="请输入备注信息(仅我方可见)"
            autocomplete="username">
          <span style="color:rgba(87, 87, 87, 0.5);">20个字</span>
          <input type="text" style="width:0;height:0;">
        </div>
        <!-- <div class="remarkItem" v-if="detailList.remark">备注说明：{{detailList.remark}}</div> -->
      </div>
      <div class="btn" v-if="$route.query.status === 'Paying' || $route.query.status === 'Pending'">
        <Button :title="$route.query.status === 'Paying'?'立即支付':$route.query.status === 'Pending'?'审核中...':'确认购买'"
          :class="$route.query.status === 'Paying'?'payBtn payBtn1':'payBtn'" @handleClick="toTopUp"
          :disabled="$route.query.status === 'Pending'"></Button>
        <Button title="取消支付" class="payBtn payBtn1 cancle" @handleClick="cancelDialogShow1 = true"
          v-if="$route.query.status === 'Paying'"></Button>
      </div>
      <div class="btnConfirm" v-if="$route.query.status === 'confirm'">
        <Button title="确认购买" class="buyConfirm" @handleClick="toTopUp"></Button>
        <Button title="取   消" class="buyCancel" @handleClick="cancelBuy"></Button>
      </div>
    </div>
    <el-dialog :visible.sync="topUpDialog" width="576px" center class="pay-table1">
      <div class="top-up-message" style="text-align: center;marginBottom:-1px">
        <div>支付完成之前请不要关闭此窗口。</div>
        <div>请在弹出的支付页面完成支付。</div>
        <div>点击后, 系统将自动跳转至业务相关页面。</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <Button title="支付成功" class="confirm-btn" @handleClick="checkIsTopUpScueess"></Button>
        <Button title="支付失败" class="close" @handleClick="checkIsTopUpScueess"></Button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="cancelDialogShow" width="568px" center class="pay-table1">
      <p class="hint">
        <span>这笔交易已被其他人抢先下单，请继续浏览其他交易！</span>
      </p>
      <div slot="footer" class="dialog-footer">
        <Button class="dialogBtn" @handleClick="cancelSuccess" title="返回交易中心"></Button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="isBuy" width="576px" center class="pay-table1">
      <div class="top-up-message" style="text-align: center;marginBottom:-1px;">
        <div>您确认要购买支付令吗</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <Button title="确认" class="confirm-btn" @handleClick="confirmToAdmin"></Button>
        <Button title="取消" class="close" @handleClick="isBuy = false"></Button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="isConfirm" width="568px" center class="pay-table1">
      <p style="text-align:center; font-size: 20px;margin-bottom:14px">请确认支付信息</p>
      <div class="password">
        <table>
          <tr>
            <td style="width:90px;">购买支付令</td>
            <td>{{detailList.tokenNum || 0 | toThousands}}</td>
          </tr>
          <tr>
            <td>折扣率</td>
            <td>{{detailList.rate*100 | toFix2}}%</td>
          </tr>
          <tr>
            <td>报价</td>
            <td>{{detailList.amount || 0 | toThousands}}</td>
          </tr>
          <tr>
            <td>服务费</td>
            <td>{{detailList.fee || 0 | toThousands}}</td>
          </tr>
          <tr style="height:63px">
            <td>实际支付金额</td>
            <td><span class="mainColor1">{{detailList.realAmount || 0 | toThousands}}</span>
            <p class="cnfnot">{{detailList.realAmount || 0 | amountToChinese}}</p>
            </td>
          </tr>
        </table>
      </div>
      <div slot="footer" class="dialog-footer">
        <Button title="确定支付" class="confirm-btn" @handleClick="payOrder"></Button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="cancelDialogShow1" width="568px" center class="pay-table1">
      <p class="hint" style="marginTop:-1px;">
        <span>您确认要取消这比交易吗？</span>
      </p>
      <div slot="footer" class="dialog-footer">
        <Button class="dialogBtn" @handleClick="cancelSuccess1" title="确定"></Button>
        <Button class="dialogBtn" @handleClick="cancelDialogShow1 = false" title="返回"></Button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BusinessTitle from '@/components/BusinessTitle'
import settings from '@/settings'
export default {
  components: {
    BusinessTitle
  },
  data () {
    return {
      topUpDialog: false,
      cancelDialogShow: false,
      cancelDialogShow1: false,
      isBuy: false,
      hasPassword: true,
      isConfirm: false,
      detailList: {},
      notifyURL: '',
      form: '',
      cutTime: '0',
      remark: '',
      orderId: '',
      // 获取充值订单信息
      getTopUpOrderMessageUrl: settings.apiGateway.getTopUpOrderMessage,
      // 取消交易
      cancelledUrl: settings.apiGateway.cancelled,
      // 生成订单信息
      preBuyUrl: settings.apiGateway.preBuy,
      // 订单未到期时跳到三方
      buyerTopUpUrl: settings.apiGateway.buyerTopUp,
      // 检查交易是否成功
      // checkSuccessUrl: settings.apiGateway.checkSuccess,
      // 获取卖令订单详情
      getOderDetailUrl: settings.apiGateway.getSellDetail,
      // 获取买令订单详情
      getBuyerDetailUrl: settings.apiGateway.getBuyerDetail,
      // 取消交易
      orderDetailUrl: settings.apiGateway.buyerOrderDetail,
      // 购买令
      buyerBuyUrl: settings.apiGateway.buyerBuy
    }
  },
  methods: {
    toTopUp () {
      if (this.$route.query.status === 'Paying') {
        this.fetch(`${this.preBuyUrl}${this.$route.query.id}`, 'post').then(data => {
          this.orderId = data.data
          this.isConfirm = true
        }).catch(data => {
          this.$message.error(data.data.msg)
        })
      } else {
        // 检查状态提交审核
        this.getBuyDetail('checkStatus')
      }
    },
    // 取消支付
    cancelSuccess1 () {
      this.fetch(`${this.orderDetailUrl}${this.$route.query.id}/Cancel`, 'post').then(data => {
        this.popUpSuccess({
          text: '交易已取消',
          okBtn: '确定',
          ok: () => {
            this.cancelDialogShow1 = false
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
    payOrder () {
      // 跳转收银台选择银行
      let newpage = this.$router.resolve({
        name: 'cashierDesk',
        query: {
          orderId: this.orderId + '',
          amount: this.detailList.realAmount
        }
      })
      window.open(newpage.href, '_blank')
      this.topUpDialog = true
      this.isConfirm = false
    },
    cancelSuccess () {
      this.$router.push('/enterprise/trading-center')
    },
    handleClose () {
      this.hasPassword = false
      this.$message.error('请先设置支付密码')
    },
    cancelBuy () {
      this.$router.back()
    },
    BuyOrder () {
      this.fetch(`${this.buyerBuyUrl}`, 'post', {
        txCode: this.detailList.txCode,
        remark: this.remark
      }).then(data => {
        this.popUpSuccess({
          text: '购买申请已提交至管理员',
          okBtn: '确定',
          ok: () => {
            this.goBack()
          }
        })
      }).catch(data => {
        this.$message.error(data.data.msg)
      })
    },
    checkIsTopUpScueess () {
      let amount = this.detailList.tokenNum.toString().replace(/,/g, '')
      this.$router.push({
        path: '/enterprise/buy-success',
        query: {
          amount: String(amount),
          id: this.orderId + '',
          isTag: 'true'
        }
      })
    },
    confirmToAdmin () {
      this.BuyOrder()
      this.isBuy = false
    },
    getBuyDetail (status) {
      this.fetch(`${this.getOderDetailUrl}?id=${this.$route.query.id}`).then(data => {
        this.detailList = data.data
        // this.detailList.createdOn = this.toNormalDate(this.detailList.createdOn)
        if (status && this.detailList.status === 'Saling') {
          this.isBuy = true
        } else if (status) {
          this.cancelDialogShow = true
        }
      }).catch(data => {
        this.$message.error(data.data.msg)
      })
    },
    getBuyerDetail () {
      this.fetch(`${this.getBuyerDetailUrl}${this.$route.query.id}`).then(data => {
        this.detailList = data.data
        this.cutTime = Math.ceil(this.detailList.expirationTime / 1000)
        this.setTime()
      }).catch(data => {
        this.$message.error(data.data.msg)
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
  created () {
    if (this.$route.query.status === 'confirm') {
      this.getBuyDetail()
    } else {
      this.getBuyerDetail()
    }
  },
  watch: {
    cutTime (val) {
      if (val === 0 && this.$route.query.status === 'Paying') {
        this.$router.push('/enterprise/buy-list')
      }
    },
    'detailList.status' (val) {
      if (val === '支付成功' && this.$route.query.status === 'Paying') {
        this.$router.push('/enterprise/buy-list')
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/variables';
.cnfnot {
  font-size: 13px;
  line-height: 13px;
  margin-bottom: 8px;
}
.buy_to_detail {
  .remarkItem {
    width: 984px;
    margin: 20px auto 20px;
    color: #575757;
  }
  .content {
    width: 100%;
    margin: 30px auto 40px;
    .title {
      font-size: 18px;
      text-align: center;
      font-weight: 400;
      color: rgba(61, 61, 61, 1);
      margin-bottom: 24px;
    }
    .buyTitleText {
      font-size: 18px;
      font-weight: bold;
      color: @theme-blue;
      color: var(--mainColor);
      text-align: center;
      margin-bottom: -25px;
    }
    .trading-message {
      width: 525px;
      margin: 30px auto 50px;
      .detailText {
        width: 100%;
        height: 28px;
        line-height: 28px;
        font-size: 12px;
        color: rgba(87, 87, 87, 1);
        position: relative;
        .leftCodeText {
          margin-left: 10px;
        }
        .rightStatus {
          margin-right: 10px;
          float: right;
        }
        .midTime {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translateX(-50%) translateY(-50%);
        }
      }
    }
    .btn {
      width: 403px;
      margin: 0 auto;
      .payBtn {
        width: 100%;
        height: 50px;
        line-height: 50px;
        padding: 0;
        border: none;
        font-size: 16px;
        background-color: @theme-blue;
        background-color: var(--mainColor);
        box-shadow: 1px 6px 4px @btn-disabled;
        box-shadow: 1px 6px 4px var(--mainTableHover);
      }
      .payBtn1 {
        width: 180px;
      }
      .cancle, .cancle:hover {
        border: 1px solid @theme-blue;
        border: 1px solid var(--mainColor);
        color: @theme-blue;
        color: var(--mainColor);
        background-color: #fff;
      }
    }
    .btnConfirm {
      width: 525px;
      height: 50px;
      margin: 0 auto;
      .buyConfirm,
      .buyCancel {
        width: 250px;
        height: 100%;
        float: left;
      }
      .buyCancel {
        float: right;
        background-color: #ffffff;
        color: @theme-blue;
        color: var(--mainColor);
      }
    }
  }
  .payee-remark {
    width: 550px;
    margin: 20px auto;
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
  .goldHelp {
    font-size: 16px;
    color: #ccc;
    margin-left: 10px;
  }
  table {
    width: 100%;
    margin: 0 auto;
    tr {
      td {
        height: 40px;
        line-height: 40px;
        border: 1px solid #e6e6e6;
        background-clip: padding-box;
        text-align: center;
        background-color: #ffffff;
      }
      td:first-child {
        width: 123px;
        padding: 0 15px;
        background-color: #FAFAFA;
      }
      td:last-child {
        padding-left: 20px;
        line-height: 30px;
      }
    }
    tr:nth-child(5) td {
      background-color: @theme-blue-light;
      background-color: var(--mainLightColor);
    }
    tr {
      .dealCount {
        text-align: left;
        padding-left: 82px;
        .mainColor {
          color: @theme-blue;
          color: var(--mainColor);
          font-size: 16px;
          font-weight: bold;
        }
      }
    }
  }
  .mainColor1 {
    font-size: 16px;
    line-height: 30px;
    color: @theme-blue !important;
    color: var(--mainColor) !important;
    font-weight: bold;
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
    margin-top: 20px;
    font-size: 18px;
    line-height: 30px;
    .message {
      margin-left: 20px;
    }
  }
  .dialogBtn {
    width: 211px;
    height: 50px;
    font-size: 18px;
  }
  .hint {
    height: 60px;
    line-height: 60px;
    text-align: center;
    width: 100%;
    font-size: 18px;
  }
}
.password {
  width: 422px;
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
  table {
    tr {
      td:nth-child(2n) {
        // width: 350px;
        text-align: left;
      }
    }
  }
}
.buyTableTitle {
  text-align: left;
  height: 16px;
  font-size: 16px;
  color: rgba(101, 101, 101, 1);
  margin: 38px 0 15px;
  padding-left: 9px;
  border-left: 4px solid @theme-blue;
  border-left: 4px solid var(--mainColor);
}
.dotted {
  border-top: 1px solid rgba(0, 0, 0, .21);
  width: 100%;
  height: 1px;
  margin-bottom: 25px;
}
.pay-table1 {
  .password {
    width: 100%;
    margin-bottom: 15px;
  }
}
</style>
