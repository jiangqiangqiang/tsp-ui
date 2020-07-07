<template>
  <div class="sale_to_detail">
    <BusinessTitle title="交易详情" isShowBack></BusinessTitle>
    <div class="content">
      <div class="buyTableTitle">出售信息</div>
      <div class="dotted"></div>
      <table border>
        <tr>
          <td>出售支付令</td>
          <td colspan="3">{{detailList.totalAmount || 0 | toThousands}}<span
            style="color:#D9D9D9;margin:0 10px;">|</span>{{detailList.totalAmount | amountToChinese}}<span class="mainTextColor" @click="dialogDetail = true">查看明细</span></td>
        </tr>
        <tr>
          <td>折合现金</td>
          <td colspan="3">{{detailList.cashAmount || 0 | toThousands}}<span
            style="color:#D9D9D9;margin:0 10px;">|</span>{{detailList.cashAmount | amountToChinese}}</td>
        </tr>
        <tr>
          <td>报价</td>
          <td colspan="3">折扣率 {{detailList.rate*100 | toFix2}}%<span
            style="color:#D9D9D9;margin:0 10px;">|</span>折后金额 {{detailList.cashAmount * detailList.rate | toThousands}}</td>
        </tr>
      </table>
      <!-- 金额明细 -->
      <div class="buyTableTitle">金额明细</div>
      <div class="dotted"></div>
      <table border>
        <tr>
          <td>报价</td>
          <td colspan="3">{{detailList.cashAmount * detailList.rate || 0 | toThousands}}<span
            style="color:#D9D9D9;margin:0 10px;">|</span>{{detailList.cashAmount * detailList.rate | amountToChinese}}</td>
        </tr>
        <tr>
          <td>服务费</td>
          <td colspan="3">{{detailList.serviceAmount || 0 | toThousands}}<span
            style="color:#D9D9D9;margin:0 10px;">|</span>{{detailList.serviceAmount | amountToChinese}}</td>
        </tr>
        <tr>
          <td class="mainBgColor">实际到账金额</td>
          <td colspan="3" class="mainBgColor">{{detailList.cashAmount * detailList.rate - detailList.serviceAmount || 0 | toThousands}}<span
            style="color:#D9D9D9;margin:0 10px;">|</span>{{detailList.cashAmount * detailList.rate - detailList.serviceAmount | amountToChinese}}</td>
        </tr>
      </table>
      <!-- 更多设置 -->
      <div class="buyTableTitle">更多设置</div>
      <div class="dotted"></div>
      <table border>
        <tr>
          <td>自动下架</td>
          <td colspan="3">{{detailList.deadline}}</td>
        </tr>
        <tr v-if="detailList.remark">
          <td>备注信息</td>
          <td colspan="3">{{detailList.remark}}</td>
        </tr>
      </table>
      <!-- <div class="trading-message">
        <div class="detailText">
          <span class="leftCodeText">交易编号：{{detailList.txCode}}</span>
          <span class="midTime">发布时间：{{detailList.createdOn || detailList.auditTime}}</span>
          <span class="rightStatus">状态：{{$route.query.status | saleStatus}}</span>
        </div>
        <table>
          <tr>
            <td>出售支付令</td>
            <td>{{detailList.totalAmoount || 0 | toThousands}}</td>
            <td>折扣率</td>
            <td>{{detailList.rate*100 | toFix2}}%</td>
          </tr>
          <tr>
            <td :rowspan='detailList.list.length + 2'>明细</td>
          </tr>
          <tr>
            <td>持有期（天）</td>
            <td>持有额度</td>
            <td>出售额度</td>
          </tr>
          <tr v-for="(item,index) in detailList.list" :key="index">
            <td style="height:30px">{{item.holdingPeriod}}</td>
            <td style="height:30px">{{item.balance | toThousands}}</td>
            <td style="height:30px">{{item.sellAmount | toThousands}}</td>
          </tr>
          <tr>
            <td>实时服务费
              <el-tooltip class="item" effect="light" placement="right">
                <div slot="content" style="lineHeight:20px">
                  服务费由平台服务费和持有期成本组成。
                  <br />
                  持有期为：入账日期到交易成功日期之间的天数。
                  <br />
                  因此，服务费会根据成交日期的不同而发生变化。
                  <br />
                  <span style="lineHeight:35px">计算公式：</span>
                  <br />
                  平台服务费=交易金额*0.1%（最低3元）；
                  <br />
                  持有费用=每笔交易金额*持有期天数*0.01%。
                </div>
                <i class="el-icon-question goldHelp floatRight"></i>
              </el-tooltip>
            </td>
            <td colspan="3" class="dealCount"> -{{detailList.serviceAmount || 0 | toThousands}} 元<span
                style="color:#D9D9D9;margin:0 10px">|</span>大写：{{detailList.serviceAmount || 0 | transformChinese}}

            </td>
          </tr>
          <tr>
            <td>实际收款
              <el-tooltip class="item" effect="light" placement="right">
                <div slot="content" style="lineHeight:20px">
                  实际转换到账 = 售价 - 实时服务费
                </div>
                <i class="el-icon-question goldHelp floatRight"></i>
              </el-tooltip>
            </td>
            <td colspan="3" class="dealCount"><span
                class="mainColor">{{(detailList.amount - detailList.serviceAmount) || 0 | toThousands}}</span><span
                style="color:#D9D9D9;margin:0 10px;">|</span>大写：{{(detailList.amount - detailList.serviceAmount) || 0 | transformChinese}}
            </td>
          </tr>
        </table>
        <div class="detailText" v-if="$route.query.status !== 'confirm'">
          <span class="leftCodeText">操作员：{{detailList.operatorName}}</span>
          <span class="midAdminText" v-if="detailList.adminName">管理员：{{detailList.adminName}}</span>
          <span class="rightStatus">交易截止时间：{{detailList.deadline}}</span>
        </div>
      </div>
      <div class="remarkItem" v-if="detailList.remark">备注说明：{{detailList.remark}}</div> -->
      <div class="btn" v-if="$route.query.status === 'Pending' || $route.query.status === 'Saling'">
        <Button :title="$route.query.status === 'Pending'?'审核中...':'撤销出售'" class="payBtn" @handleClick="canCelDeal"
          :disabled="$route.query.status === 'Pending'"></Button>
      </div>
    </div>
    <el-dialog :visible.sync="isSale" width="568px" center class="pay-table1">
      <div class="top-up-message" style="text-align: center">
        <div>您确认要撤销这笔交易吗？</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <Button title="确认" class="confirm-btn" @handleClick="confirmToAdmin"></Button>
        <Button title="取消" class="close" @handleClick="isSale = false"></Button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogDetail" center width="867px" top="250px" class="pay-table1">
      <div class="password">
        <p class="prompt" style="marginBottom:30px;textAlign:center;fontSize:18px">出售的支付令及出售额度</p>
        <el-table :data="detailList.sellOrderDetailDtos" stripe border style="width: 100%" header-align='center'
        class="credit-table-color-blue sy-global-has-gutter__th--text-center sy-global-el-table-fit--border">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="tokenAmount" label="支付令额度">
          <template slot-scope="scope">
            {{scope.row.tokenAmount | toThousands}}
          </template>
        </el-table-column>
        <el-table-column prop="tokenAmountCash" label="折合现金（￥）">
          <template slot-scope="scope">
            {{scope.row.tokenAmountCash | toThousands}}
          </template>
        </el-table-column>
        <el-table-column  label="支付令时间">
          <el-table-column prop="endTime" label="提现日期"></el-table-column>
          <el-table-column prop="holdDays" label="已持有天数"></el-table-column>
          <el-table-column prop="surplusDays" label="剩余天数"></el-table-column>
        </el-table-column>
        <el-table-column prop="rate" label="折现利率">
          <template slot-scope="scope">
            {{scope.row.rate/10000}}%
          </template>
        </el-table-column>
        <el-table-column label="出售支付令">
          <el-table-column prop="sellAmount" label="出售令额度">
            <template slot-scope="scope">
                {{scope.row.sellAmount | toThousands}}
            </template>
          </el-table-column>
          <el-table-column prop="cashBalance" label="折合现金">
            <template slot-scope="scope">
                {{scope.row.cashBalance | toThousands}}
            </template>
          </el-table-column>
        </el-table-column>
        </el-table>
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
      isSale: false,
      dialogDetail: false,
      form: '',
      detailList: {
        sellOrder: {},
        list: []
      },
      // 获取订单信息
      getSellDetailUrl: settings.apiGateway.getOderDetail,
      // 取消交易
      sellApprovalUrl: settings.apiGateway.sellApproval
    }
  },
  methods: {
    canCelDeal () {
      this.isSale = true
    },
    confirmToAdmin () {
      this.toTopUp('Canceled')
    },
    toTopUp (isAgree) {
      let data = {
        txCode: this.$route.query.code,
        status: isAgree
      }
      let text = ''
      isAgree === 'Canceled' ? text = '撤销成功' : text = '卖令申请已发送'
      this.fetch(this.sellApprovalUrl, 'post', data).then(data => {
        this.popUpSuccess({
          text: text,
          okBtn: '确定',
          ok: () => {
            this.$router.push('/enterprise/sale-list')
          }
        })
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err.data.msg
        })
      })
    },
    getSaleDetail () {
      this.fetch(this.getSellDetailUrl + '?txCode=' + this.$route.query.code).then(data => {
        this.detailList = data.data
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err.data.msg
        })
      })
    }
  },
  created () {
    this.getSaleDetail()
  },
  filters: {
    toFix (val) {
      return val.toFixed(2)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/variables';
.sale_to_detail {
  .remarkItem {
    width: 984px;
    margin: 0 auto 20px;
    color: #575757;
  }
  .content {
    width: 525px;
    margin: 40px auto;
    .title {
      font-size: 18px;
      text-align: center;
      font-weight: 400;
      color: rgba(61, 61, 61, 1);
      margin-bottom: 24px;
    }
    .saleTitleText {
      font-size: 18px;
      font-weight: bold;
      color: @theme-blue;
      color: var(--mainColor);
      text-align: center;
      margin-bottom: -25px;
    }
    .trading-message {
      width: 984px;
      margin: 50px auto;
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
        .midAdminText {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translateX(-50%) translateY(-50%);
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
      margin: 35px auto 50px;
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
      margin: 35px auto 0;
      .saleConfirm,
      .saleCancel {
        width: 250px;
        height: 100%;
        float: left;
      }
      .saleCancel {
        float: right;
        background-color: #ffffff;
        color: @theme-blue;
        color: var(--mainColor);
      }
    }
  }
  table {
    width: 100%;
    margin: 34px auto 0;
    tr {
      td {
        width: 25%;
        height: 41px;
        border: 1px solid #e6e6e6;
        text-align: center;
      }
      td:nth-child(2n + 1) {
          width: 120px;
          background-color: #fafafa;
        }
        td:nth-child(2n) {
          text-align: left;
          padding-left: 15px;
          width: 306px;
          background-color: #ffffff;
        }
        .mainBgColor {
          background-color: @theme-blue-light !important;
          background-color: var(--mainLightColor) !important;
        }
    }
    tr:nth-child(2n) {
      text-align: left;
      padding-left: 15px;
      width: 306px;
      background-color: #ffffff;
    }
    tr:nth-last-child(1),
    tr:nth-last-child(2),
    tr:nth-last-child(3) {
      background-color: @theme-blue-light;
      background-color: var(--mainLightColor);
      .dealCount {
        text-align: right;
        padding-right: 20px;
        .mainColor {
          color: @theme-blue;
          color: var(--mainColor);
          font-size: 16px;
          font-weight: bold;
        }
      }
    }
    tr:nth-last-child(3) {
      background-color: #ffffff;
    }
    tr:nth-child(1) {
      background-color: @theme-blue-light;
      background-color: var(--mainLightColor);
    }
  }
  .goldHelp {
    font-size: 14px;
    color: #ccc;
    float: right;
    margin-right: 10px;
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
.sale_to_detail {
  margin-bottom: 1px;
  .password {
    width: 100%;
    margin-bottom: 15px;
  }
}
.sale_to_detail/deep/.credit-table-color-blue tr {
  cursor: default;
  background-color: @table-bg;
  background-color: var(--mainTableBg) !important;
}
.sale_to_detail/deep/.credit-table-color-blue .el-table__body tr {
  &:nth-of-type(2n + 1):hover > td {
    background-color: @table-bg;
    background-color: var(--mainTableBg) !important;
  }
  td {
    height: 50px;
  }
}
.buyTableTitle {
    // width: 75px;
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
    }
    .mainTextColor{
      float: right;
      margin-right: 10px;
      text-decoration: underline;
      color:rgba(37,183,170,1);
      cursor: pointer;
    }
.pay-table1 {
  .password {
    width: 100%;
    margin-bottom: 15px;
  }
}
.pay-table1/deep/.credit-table-color-blue tr {
  cursor: default;
  background-color: @table-bg;
  background-color: var(--mainTableBg) !important;
}
.pay-table1/deep/.credit-table-color-blue .el-table__body tr {
  &:nth-of-type(2n + 1):hover > td {
    background-color: @table-hover;
    background-color: var(--mainTableHover) !important;
  }
  td {
    height: 50px;
  }
}
</style>
