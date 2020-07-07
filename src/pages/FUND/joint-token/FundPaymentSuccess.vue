<template>
  <div>
    <BusinessTitle title="联合发令" isShowBack></BusinessTitle>
    <div class="step">
      <div class="wrapper">
        <ul class="step-list">
          <li v-for="(item,index) in stepList" :key="index" :class="[index + 1 === step ? 'visible' : '']">
            <span class="content">
              <span class="number">{{index + 1}}</span>{{item}}
            </span>
            <i class="icon el-icon-arrow-right "></i>
          </li>
        </ul>
      </div>
    </div>
    <SuccessDeal
      reminder="您已成功付款"
      :amount="amount"
      @goBack="goBack"
      @getTransactionDetails="getTransactionDetails"
      @getRecord="getRecord"
      :isShow="isShow"
      checkRecord="查看记录">
    </SuccessDeal>
  </div>
</template>

<script>
import SuccessDeal from '@/components/SuccessDeal'
import BusinessTitle from '@/components/BusinessTitle'
export default {
  components: {
    SuccessDeal,
    BusinessTitle
  },
  data () {
    return {
      carryOn: '继续联合发令',
      stepList: ['资金方发起联合发令', '等待企业确认方案', '等待资金方付款', '等待企业背书', '等待资金方确认', '联合发令成功'],
      step: 3,
      isShow: false
    }
  },
  methods: {
    goBack () {
      // 返回
      this.$router.push('/fund/joint-token-list')
    },
    getTransactionDetails () {
      // 交易详情
      this.$router.push({
        path: '/fund/fund-payment-schedule',
        query: {
          code: this.$route.query.code
        }
      })
    },
    getRecord () {
      // 查看记录
      this.$router.replace('/fund/joint-token-list')
    }
    // continueTopUp () {
    //   // 继续支付
    //   this.$router.replace('/enterprise/payment')
    // }
  },
  // computed: {
  // amount () {
  // return this.$route.query.amount.toString()
  // }
  // },
  created () {
    // 成功后获取一下余额
    this.getAccount()
  },
  computed: {
    amount () {
      return this.$route.query.amount.toString()
    }
  }
}
</script>

<style scoped lang="less">
@import "~@/assets/less/variables";
.step{
  width:95%;
  margin:0 auto;
  height:45px;
  color:#333;
  margin-top: 26px;
  background-color:#fafafa;
  .wrapper{
    text-align: center;
  }
  .step-list{
    width: 100%;
    height:45px;
    line-height: 45px;
    display: inline-block;
    clear: both;
    overflow: hidden;
    box-sizing: border-box;
    padding-left: 15px;
    li{
      position:relative;
      float:left;
      padding:0px 15px 0px 7px;
      text-align: center;
      //margin-right:160px;
      .content {
        .number{
        display: inline-block;
        width:20px;
        height:20px;
        margin-right:5px;
        color:#333;
        line-height:20px;
        border-radius: 10px;
        background-color:#e8e8e8;
        }
      }
      .icon {
        width:10px;
        height:13px;
        font-size: 12px;
        padding-left:8px
      }
      &:last-child{
        margin-right:0;
        &:after{
          display: none;
        }
      }
    }
    .visible{
      .content {
        display: inline-block;
        color: #fff;
        height:44px;
        padding: 0 15px;
        border-radius: 5px;
        background-color: @theme-blue;
        background-color: var(--mainColor);
        .number{
          color: @theme-blue;
          color:var(--mainColor);
          background-color:#fff;
          font-weight: 700
        }
      }
    }
  }
}
.sccess {
  padding-top: 23px;
  font-weight: 600px;
  font-size: 18px;
}
.send-password {
  padding-top:24px
}
</style>
