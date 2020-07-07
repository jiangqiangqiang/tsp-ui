<template>
  <div class="buy_to_detail">
    <BusinessTitle title="购买申请审核" isShowBack></BusinessTitle>
    <div class="content">
      <!-- <div v-if="$route.query.status !== '已完成' && $route.query.status !== '已取消'">
        <p class="title">交易倒计时</p>
        <div style="font-size:18px;text-align:center">剩余&nbsp;：<span class="colorMain">&nbsp;{{22}}&nbsp;</span>时<span
            class="colorMain">&nbsp;{{22}}&nbsp;</span>分<span class="colorMain">&nbsp;{{22}}&nbsp;</span>秒
        </div>
      </div> -->
      <div class="trading-message">
        <!-- <div class="detailText">
          <span class="leftCodeText">交易编号：{{detailList.txCode}}</span>
          <span class="midTime" v-if="detailList.createdOn">发布时间：{{detailList.createdOn}}</span>
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
              <span>{{detailList.tokenNum || 0 | toThousands}}</span>
            </td>
          </tr>
          <tr>
            <td>折扣率</td>
            <td class="dealCount">{{detailList.rate*100 | toFix2}}%</td>
          </tr>
          <tr>
            <td>报价</td>
            <td class="dealCount"><span>{{detailList.amount || 0 | toThousands}}</span></td>
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
            <td class="dealCount"><span>{{detailList.fee || 0 | toThousands}}</span></td>
          </tr>
          <tr style="height:63px">
            <td>实际支付金额</td>
            <td class="dealCount"><span class="mainColor">{{detailList.realAmount || 0 | toThousands}}</span>
              <p class="cnfnot">{{detailList.realAmount || 0 | amountToChinese}}</p>
            </td>
          </tr>
          <tr v-if="detailList.remark">
            <td>备注信息</td>
            <td class="dealCount">{{detailList.remark}}</td>
          </tr>
        </table>
        <!-- <div class="detailText">
          <span class="leftCodeText">操作员：{{detailList.operatorName}}</span>
          <span class="rightStatus"
            v-if="$route.query.status !== 'Pending' && detailList.adminName">管理员：{{detailList.adminName}}</span>
        </div> -->
      </div>
      <!-- <div class="remarkItem" v-if="detailList.remark">备注说明：{{detailList.remark}}</div> -->
      <div class="btnConfirm" v-if="$route.query.status === 'Pending'">
        <Button title="通   过" class="buyConfirm" @handleClick="toTopUp('Paying')"></Button>
        <Button title="拒   绝" class="buyCancel" @handleClick="isBuy = true"></Button>
      </div>
    </div>
    <el-dialog :visible.sync="isBuy" width="576px" center>
      <div class="top-up-message" style="text-align: center">
        <div>是否拒绝此次购买申请?</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <Button title="确认" class="confirm-btn" @handleClick="toTopUp('Cancel')"></Button>
        <Button title="取消" class="close" @handleClick="isBuy = false"></Button>
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
      isBuy: false,
      detailList: {},
      form: '',
      // 获取充值订单信息
      getTopUpOrderMessageUrl: settings.apiGateway.getTopUpOrderMessage,
      // 取消交易
      cancelledUrl: settings.apiGateway.cancelled,
      // 订单未到期时跳到三方
      getThirdpartyUrl: settings.apiGateway.getThirdparty,
      // 获取详情
      getBuyerDetailUrl: settings.apiGateway.getBuyerDetail,
      // 提交审核
      orderDetailUrl: settings.apiGateway.buyerOrderDetail
    }
  },
  methods: {
    toTopUp (status) {
      let text = ''
      status === 'Paying' ? text = '购买申请已通过' : text = '购买申请已拒绝'
      this.fetch(`${this.orderDetailUrl}${this.$route.query.id}/${status}`, 'post').then(data => {
        this.popUpSuccess({
          text: text,
          okBtn: '确定',
          ok: () => {
            this.$store.dispatch('updateCounters')
            this.$router.push('/enterprise/buy-apply-authority')
          }
        })
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err.data.msg
        })
      })
    },
    cancelBuy () {
      this.isBuy = true
    },
    confirmToAdmin () {
    },
    getBuyerDetail () {
      this.fetch(`${this.getBuyerDetailUrl}${this.$route.query.id}`).then(data => {
        this.detailList = data.data
      }).catch(data => {
        this.$message.error(data.data.msg)
      })
    }
  },
  created () {
    this.getBuyerDetail()
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
    margin: 20px auto;
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
        background-color: @theme-blue;
        background-color: var(--mainColor);
        box-shadow: 1px 6px 4px @btn-disabled;
        box-shadow: 1px 6px 4px var(--mainTableHover);
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
.buy_to_detail /deep/.el-dialog {
  position: absolute;
  top: 50% !important;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  margin-top: 0 !important;
  margin-left: 108px;
}
</style>
