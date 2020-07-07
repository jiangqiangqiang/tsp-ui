<template>
<div>
  <BusinessTitle title="订单查询"></BusinessTitle>
  <div class="serchEnp">
    <div style="width:473px;margin:0 auto">
      <span style="marginRight:14px">交易编号</span>
      <el-input v-model="txCode" class="amount-input" placeholder="请输入交易编号"></el-input>
      <Button title="查 询" class="confirm-btn" @handleClick="serchOrder"></Button>
    </div>
  </div>
  <div v-if="!orderDetail.txCode" class="lis0">暂无数据</div>
  <div class="orderDetail" v-else>
  <div class="buyTableTitle">TSP订单信息</div>
  <div class="dotted"></div>
  <table>
    <tr>
      <td>交易编号</td>
      <td>{{orderDetail.txCode}}</td>
    </tr>
    <tr>
      <td>发起时间</td>
      <td>{{orderDetail.createTime}}</td>
    </tr>
    <tr>
      <td>交易类型</td>
      <td>{{orderDetail.type}}</td>
    </tr>
    <tr>
      <td>交易状态</td>
      <td>{{orderDetail.status}}</td>
    </tr>
    <tr>
      <td>交易金额</td>
      <td>
        <span class="amountColor">{{orderDetail.amount || 0 | toThousands}}&nbsp;</span> 元
      </td>
    </tr>
    <tr>
      <td>企业名称</td>
      <td>{{orderDetail.enterpriseName}}</td>
    </tr>
    <tr>
      <td>企业证件号</td>
      <td>{{orderDetail.creditCode}}</td>
    </tr>
  </table>
  <div class="buyTableTitle">汇付订单信息</div>
  <div class="dotted"></div>
  <table style="marginBottom:20px" v-for="orderLis in orderDetail.pspOrderDto" :key="orderLis.orderId">
    <tr>
      <td>汇付订单编号</td>
      <td>{{orderLis.orderId}}</td>
    </tr>
    <tr>
      <td>订单日期</td>
      <td>{{orderLis.orderDate}}</td>
    </tr>
    <tr>
      <td>交易类型</td>
      <td>{{orderLis.type}}</td>
    </tr>
    <tr>
      <td>交易状态</td>
      <td>{{orderLis.status}}</td>
    </tr>
    <tr>
      <td>交易金额</td>
      <td>
        <span class="amountColor">{{orderLis.parseAmount || 0 | toThousands}}&nbsp;</span> 元
      </td>
    </tr>
  </table>
  </div>
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
      // 明细账接口
      getPspOrdersUrl: settings.apiGateway.getPspOrders,
      txCode: '',
      orderDetail: {}
    }
  },
  methods: {
    serchOrder () {
      if (!this.txCode) {
        this.$message.error('请输入交易编号')
        return
      }
      this.fetch(`${this.getPspOrdersUrl}${this.txCode}`, 'post').then(data => {
        this.orderDetail = data.data
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    }
  },
  created () {
  }
}
</script>
<style lang="less" scoped>
@import '~@/assets/less/variables';
.serchEnp {
  width: calc(~ '100% - 2px');
  height: 46px;
  border: 1px solid rgba(230, 230, 230, 1);
  background-color: #fcfcfc;
  margin-top: 18px;
  padding-top: 15px;
  .amount-input {
    width: 287px;
  }
}
.orderDetail {
  width: 577px;
  margin: 0 auto;
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
.dotted {
  border-top: 1px solid #d9d9d9;
  width: 100%;
  height: 1px;
  margin-bottom: 18px;
}
.lis0 {
  text-align: center;
  margin-top: 20px;
  opacity: .7;
}
table {
    width: 100%;
    tr {
      td {
        height: 36px;
        line-height: 36px;
        color:rgba(101,101,101,1);
        border: 1px solid #e6e6e6;
        .amountColor {
          font-size: 16px;
          font-weight: bold;
          color: @theme-blue;
          color: var(--mainColor);
        }
      }
      td:first-child {
        width: 170px !important;
        text-align: center;
        padding: 0 15px;
        background-color: #FAFAFA;
      }
      td:last-child {
        text-align: left;
        padding-left: 20px;
      }
    }
  }
.serchEnp /deep/.el-input__inner {
  height: 31px;
}
.confirm-btn {
  width: 81px;
  height: 31px;
  letter-spacing: 0;
  margin-left: 12px;
  padding: 0 !important;
}
</style>
