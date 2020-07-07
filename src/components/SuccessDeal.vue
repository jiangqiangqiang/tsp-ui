<template>
  <div>
    <div class="content">
      <i class="el-icon-circle-check-outline icon"></i>
      <slot>
        <div class="success-text">{{succeedText}}</div>
        <div class="success-top-up">{{reminder}} <span class="amount">{{amount | toThousands}}</span> 元</div>
        <div class="view-details sy-global-cursor--pointer" @click="getTransactionDetails" v-if="!textLater">点击查看交易详情
        </div>
        <div class="dotted" v-if="textLater"></div>
        <p class="waitingText" v-if="textLater">支付成功，系统金额会在1分钟后到账，请稍后查看余额。</p>
      </slot>
      <div v-if="showBottom">
        <div class="dotted"></div>
        <div class="moreover">您还可以</div>
        <div :class="[isShow ? 'sort-utility' : 'no-border']">
          <div @click="getRecord">{{checkRecord}}</div>
          <div style="width: 1.5px; background: #cccccc" v-if="isShow"></div>
          <div @click="continueTopUp">{{carryOn}}</div>
        </div>
      </div>
      <Button class="btn" @handleClick="goBack" title="返回"></Button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    reminder: {
      type: String,
      default: ''
    },
    succeedText: {
      type: String,
      default: ''
    },
    carryOn: {
      type: String,
      default: ''
    },
    amount: {
      type: String,
      default: '0'
    },
    isShow: {
      type: Boolean,
      default: true
    },
    checkRecord: {
      type: String,
      default: ''
    },
    payment: {
      type: Boolean,
      default: true
    },
    showBottom: {
      type: Boolean,
      default: true
    },
    textLater: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getTransactionDetails () {
      // this.$router.push()
      this.$emit('getTransactionDetails')
    },
    getRecord () {
      // this.$router.push()
      this.$emit('getRecord')
    },
    continueTopUp () {
      // this.$router.push()
      this.$emit('continueTopUp')
    },
    goBack () {
      // this.$router.push()
      this.$emit('goBack')
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/less/variables';
.content {
  width: 440px;
  height: 318px;
  margin: 0 auto;
  margin-top: 38px;
  text-align: center;
  .icon {
    font-size: 65px;
    color: #7bbd3f;
  }
  .success-top-up {
    cursor: pointer;
    margin-top: 24px;
  }
  .success-text {
    margin-top: 10px;
    font-size: 20px;
    .amount
  }
  .amount {
    color: @theme-blue;
    color: var(--mainColor);
  }
  .view-details {
    width: 120px;
    margin: 0 auto;
    margin-top: 24px;
    color: @theme-blue;
    color: var(--mainColor);
    border-bottom: 1px solid @theme-blue;
    border-bottom: 1px solid var(--mainColor);
  }
  .dotted {
    margin-top: 20px;
    border-top: 1px dotted #000;
    width: 100%;
    height: 1px;
  }
  .moreover {
    margin-top: 30px;
  }
  .sort-utility {
    width: 170px;
    height: 21px;
    line-height: 21px;
    margin: 0 auto;
    margin-top: 22px;
    color: @theme-blue;
    color: var(--mainColor);
    display: table;
    div {
      display: table-cell;
      text-align: center;
      vertical-align: middle;
    }
    cursor: pointer;
  }
  .no-border {
    width: 170px;
    height: 21px;
    line-height: 21px;
    margin: 0 auto;
    margin-top: 22px;
    color: @theme-blue;
    color: var(--mainColor);
    text-decoration: underline;
    cursor: pointer;
  }
}
.btn {
  width: 402px;
  height: 48px;
  padding: 0;
  line-height: 48px;
  margin: 52px auto;
  cursor: pointer;
  box-shadow: 1px 6px 4px @btn-disabled;
  box-shadow: 1px 6px 4px var(--mainTableHover);
}
.waitingText {
  font-size: 16px;
  margin-top: 22px;
  // font-family: SimSun;
  color: rgba(87, 87, 87, 1);
  opacity: 0.8;
}
</style>
