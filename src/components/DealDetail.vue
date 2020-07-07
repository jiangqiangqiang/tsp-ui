<!--
  交易详情插件
    描述：  交易详情公共模板
    props:
      dealDetail: 详情信息
    attribute:
-->
<template>
  <div class="dealOutline">
    <div>
      <div class="buyTableTitle">交易信息<span class="operatorName">操作员：{{dealDetail.operator || dealDetail.operatorName}}
          <span v-if="dealDetail.admin || dealDetail.adminName"
            style="marginLeft:20px">管理员：{{dealDetail.admin || dealDetail.adminName}}</span></span></div>
      <div class="dotted"></div>
      <div class="dealInfo">
        <div>交易编号：{{dealDetail.transactionCode || dealDetail.txId || dealDetail.txCode}}
          <span class="status" v-if="isSaleStatus">交易状态：<span :class="saleStatusClass">{{dealDetail.status | saleStatus}}</span></span>
          <span class="status" v-else>交易状态：<span :class="saleStatusClass">{{dealDetail.statusDesc || dealDetail.status | tradeStatus}}</span></span>
        </div>
        <div>发起时间：{{dealDetail.createTime || dealDetail.applyTime}}</div>
        <div v-if="isApplyTime">申请时间：{{dealDetail.applyTime}}</div>
        <div v-if="dealDetail.auditTime">审核时间：{{dealDetail.auditTime}}</div>
        <div v-if="dealDetail.statusDesc === '拒绝支付' && dealDetail.finalTime">拒绝支付：{{dealDetail.finalTime}}</div>
        <div
          v-else-if="(dealDetail.statusDesc === '已取消' || dealDetail.status === 'Cancel' || dealDetail.status === 'Canceled' || dealDetail.status === '已取消') && dealDetail.finalTime">
          取消时间：{{dealDetail.finalTime}}</div>
        <div
          v-else-if="isShowFinal && (dealDetail.status === '支付成功' || dealDetail.status === 'Finished') && dealDetail.finalTime">
          成交时间：{{dealDetail.finalTime}}</div>
        <div
          v-else-if="dealDetail.finalTime && dealDetail.status !== 'BankRebut' && dealDetail.status !== 'Reject' && dealDetail.status !== 'Expired' && dealDetail.status !== 'Failed'">
          到账时间：{{dealDetail.finalTime}}</div>
        <slot name="dealInfo"></slot>
      </div>
    </div>
    <div v-if="dealDetail.bankDto">
      <div class="buyTableTitle">提现银行账户</div>
      <div class="dotted"></div>
      <div class="dealInfo">
        <div>开户银行：{{dealDetail.bankDto.bankName}}</div>
        <div>银行账户：{{dealDetail.bankDto.bankAccountCode}}</div>
        <div>开户行支行：{{dealDetail.bankDto.bankBranchName}}</div>
        <div>联系人手机号：{{dealDetail.bankDto.phone}}</div>
      </div>
    </div>
    <div v-if="isSaleStatus">
      <div class="buyTableTitle">支付令结构</div>
      <div class="dotted"></div>
      <div class="dealInfo mt20">
        <slot name="amountList"></slot>
      </div>
    </div>
    <slot name="feeList"></slot>
    <div>
      <div class="buyTableTitle">费用说明</div>
      <div class="dotted"></div>
      <div class="dealInfo mt20">
        <slot name="feeInfo"></slot>
      </div>
    </div>
    <div v-if="dealDetail.remark">
      <div class="buyTableTitle">备注说明</div>
      <div class="dotted"></div>
      <div class="dealInfo">
        <div>{{dealDetail.remark}}</div>
      </div>
    </div>
    <div class="backBtn">
      <Button class="back-btn" @handleClick="toBack" title="返 回"></Button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    dealDetail: {
      type: Object,
      default: function () {
        return {
          operator: '',
          applyTime: '',
          status: '',
          depositNumber: '',
          bankDto: '',
          remark: ''
        }
      }
    },
    isApplyTime: {
      type: Boolean,
      default: false
    },
    isShowFinal: {
      type: Boolean,
      default: false
    },
    isSaleStatus: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  computed: {
    saleStatusClass () {
      const successArr = ['succeed', 'finished', '充值成功', '充值成功', '收款成功', '支付成功', '提现成功', '已完成']
      const failedArr = ['rejected', 'payfailed', 'reject', 'failed', 'bankrebut', 'expired', '审核未通过', '拒绝支付', '申请超时', '支付失败', '银行驳回', '提现失败', '已驳回', '充值失败']
      let status = this.dealDetail.status || this.dealDetail.statusDesc || ''
      status = status.toLowerCase()
      if (successArr.includes(status)) {
        return 'succeedClass'
      } else if (failedArr.includes(status)) {
        return 'failedClass'
      } else {
        return 'normal'
      }
    }
  },
  created () {

  },
  methods: {
    toBack () {
      this.$router.back()
    }
  }
}
</script>
<style scoped lang='less'>
@import '~@/assets/less/variables';
.dealOutline {
  width: 660px;
  padding: 0px 34px 30px;
  margin: 20px auto;
  border: 1px solid #e1e1e1;
}
.backBtn {
  width: 192px;
  height: 50px;
  margin: 30px auto 10px;
}
.back-btn, .back-btn:hover {
  width: 192px;
  height: 50px;
  background-color: #fff;
  color: @theme-blue;
  color: var(--mainColor);
  border: 1px solid  @theme-blue;
  border: 1px solid  var(--mainColor);
  font-size: 18px;
  letter-spacing: 0;
}
.buyTableTitle {
  height: 16px;
  font-size: 16px;
  font-weight: bold;
  color: rgba(101, 101, 101, 1);
  margin: 38px 0 15px;
  padding-left: 9px;
  border-left: 4px solid @theme-blue;
  border-left: 4px solid var(--mainColor);
}
.operatorName {
  float: right;
  font-size: 14px;
  font-weight: normal;
  padding-top: 5px;
}
.dotted {
  border-top: 1px solid #d9d9d9;
  width: 100%;
  height: 1px;
}
.dealInfo {
  width: 640px;
  margin: 0 auto;
  font-size: 14px;
  color: rgba(101, 101, 101, 1);
  padding: 10px 10px 0;
  line-height: 35px;
}
.status {
  float: right;
}
.succeedClass {
  font-weight: bold;
  color: #7ABF4B;
}
.failedClass {
  font-weight: bold;
  color: #ED5656;
}
.normal {
  font-weight: bold;
}
.mt20 {
  margin-top: 10px;
}
</style>
