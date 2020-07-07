<template>
  <div>
    <BusinessTitle title="参数设置"></BusinessTitle>
    <!-- <div v-if="!editFlag" class="edit-button" @click="editParameter">
      <span>编辑参数</span>
    </div>
    <div v-else>
      <div class="edit-button" @click="saveParameter">
        <span>保存</span>
      </div>
      <div class="edit-button" @click="cancelParameter">
        <span>放弃</span>
      </div>
    </div> -->
    <div class="parameter-setting--show" v-if="!editFlag">
      <div class="setting-detail">
        <h4>充值费率</h4>
        <div class="rate-standards" style="width:500px">
          <div class="rate-box">
            <span>充值折扣率</span>
            <span class="textMainColor">{{parameterData.billDiscountRate | rateFtt}}</span>%
          </div>
          <div class="rate-box">
            <span>最低充值额度</span>
            <span class="textMainColor">{{parameterData.depositLowerLimit | toThousands}}</span>元
          </div>
        </div>
      </div>
      <div class="setting-detail">
        <h4>支付费率</h4>
        <div class="rate-standards" style="width:500px">
          <div class="rate-box">
            <span>支付利率</span>
            <span class="textMainColor">{{parameterData.payRate | rateFtt}}</span>%
          </div>
          <div class="rate-box">
            <span>持有期利率</span>
            <span class="textMainColor">{{parameterData.dailyRate | rateFtt}}</span>%
          </div>
        </div>
      </div>
      <div class="setting-detail">
        <h4>提现费率</h4>
        <div class="rate-standards" style="width:800px">
          <div class="rate-box">
            <span>提现服务费</span>
            <span class="textMainColor">{{parameterData.withBonusFees | toThousands}}</span>元
          </div>
          <div class="rate-box">
            <span>三方服务费</span>
            <span class="textMainColor">{{parameterData.withAccessFees | toThousands}}</span>元
          </div>
          <div class="rate-box">
            <span>最低提现额度</span>
            <span class="textMainColor">{{parameterData.withdrawLimit | toThousands}}</span>元
          </div>
        </div>
      </div>
    </div>
    <div class="parameter-setting--edit" v-else>
      <div class="setting-detail">
        <h4>费率设置</h4>
        <div class="rate-standards">
          <!-- <div class="rate-box" ref="conversionCostRate">
            <span>转融成本费率</span>
            <span>
              <input
                @blur="inputBlur('conversionCostRate')"
                @focus="inputFocus('conversionCostRate')"
                type="text" v-model="parameterData.conversionCostRate">
            </span>%
          </div> -->
          <div class="rate-box" ref="withdrawCashFee">
            <span>操作服务费</span>
            <span>
              <input @blur="inputBlur('withdrawCashFee')" @focus="inputFocus('withdrawCashFee')" type="text"
                v-model="parameterData.withdrawCashFee">
            </span>令
          </div>
          <!-- <div class="rate-box" ref="withdrawCashCostRate">
            <span>提现服务费率</span>
            <span>
              <input
                @blur="inputBlur('withdrawCashCostRate')"
                @focus="inputFocus('withdrawCashCostRate')"
                type="text" v-model="parameterData.withdrawCashCostRate">
            </span>%
          </div> -->
          <div class="rate-box" ref="depositFee">
            <span>充值服务费率</span>
            <span>
              <input @blur="inputBlur('depositFee')" @focus="inputFocus('depositFee')" type="text"
                v-model="parameterData.depositFee">
            </span>%
          </div>
        </div>
        <!-- <div class="withdraw-times" ref="counter">
          <span>提现免费流转轮次</span>
          <span>
            <input
              @blur="inputBlur('counter')"
              @focus="inputFocus('counter')"
              type="text" v-model="parameterData.counter">
          </span>次
        </div> -->
      </div>
      <div style="width: 100%; height:115px;">
        <!-- <div class="rate-setting-detail-left">
          <h4>返利比率设置</h4>
          <div class="rate-box" ref="payerRebate">
            <span>返利比率</span>
            <span style="padding: 0 10px 0 23px">
              <input
                @blur="inputBlur('payerRebate')"
                @focus="inputFocus('payerRebate')"
                type="text"
                v-model="parameterData.payerRebate">
            </span>%
          </div>
        </div> -->
        <div class="rate-setting-detail-right">
          <h4>支付令金额设置</h4>
          <div class="rate-box" ref="depositLowerLimit">
            <span>单次支付令金额下限</span><span style="padding: 0 5px 0 24px"></span>
            <span class="symbol">¥</span>
            <span>
              <input style="padding-left: 30px;width: 126px;" @blur="inputBlur('depositLowerLimit')"
                @focus="inputFocus('depositLowerLimit')" type="text" v-model="parameterData.depositLowerLimit">
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BusinessTitle from '@/components/BusinessTitle'
import settings from '@/settings'
export default {
  name: 'parameterSetting',
  data () {
    return {
      parameterData: {},
      editFlag: false,
      systemConfigUrl: settings.apiGateway.systemConfig,
      backupParameterData: {},
      saveDisabled: true
    }
  },
  created () {
    this.getParaInfo()
  },
  methods: {
    getParaInfo () {
      // 获取参数信息
      this.fetch(this.systemConfigUrl, 'get').then(data => {
        this.parameterData = data.data
        this.editFlag = false
      }).catch(res => {
        this.$message.error(res.data.msg)
      })
    },
    rateFtt (rate) {
      return Math.round(rate * 10000) / 100
    },
    editParameter () {
      this.backupParameterData = JSON.parse(JSON.stringify(this.parameterData))
      this.parameterData.conversionCostRate = this.rateFtt(this.parameterData.conversionCostRate)
      this.parameterData.withdrawCashCostRate = this.rateFtt(this.parameterData.withdrawCashCostRate)
      this.parameterData.depositFee = this.rateFtt(this.parameterData.depositFee)
      this.parameterData.payerRebate = this.rateFtt(this.parameterData.payerRebate)
      this.parameterData.counter = this.parameterData.counter
      this.editFlag = true
    },
    saveParameter () {
      if (!this.saveDisabled) {
        this.$message.error('数值必须为整数或小数，小数点后不超过4位。')
        return
      }
      // 确认弹窗
      this.alertConfirm({
        text: '确定要更改参数?',
        okBtn: '确认',
        infoBtn: '我再想想',
        ok: () => {
          // 调整数据
          let Data = {
            conversionCostRate: this.parameterData.conversionCostRate / 100,
            withdrawCashCostRate: this.parameterData.withdrawCashCostRate / 100,
            depositFee: this.parameterData.depositFee / 100,
            payerRebate: this.parameterData.payerRebate / 100,
            withdrawCashFee: this.parameterData.withdrawCashFee,
            depositLowerLimit: this.parameterData.depositLowerLimit,
            counter: this.parameterData.counter
          }
          // 发送请求
          this.fetch(`${this.systemConfigUrl}`, 'post', Data).then(data => {
            // 获取时间
            let effectiveTime
            let now = new Date().getTime()
            let nextSeconds = now + 24 * 60 * 60 * 1000
            let nextDay = new Date(nextSeconds)
            let year = nextDay.getFullYear()
            let month = nextDay.getMonth() + 1
            let day = nextDay.getDate()
            effectiveTime = year + '年' + month + '月' + day + '日0点'
            // 显示成功弹层
            this.popUpSuccess({
              text: '<div style="text-align:center;">修改成功<div><div style="text-align:center;">新参数将于' + effectiveTime + '生效,请注意通知客户</div>',
              okBtn: '返回',
              ok: () => {
                this.getParaInfo()
              }
            })
          }).catch(res => {
            this.$messgae.error(res.data.msg)
          })
        },
        info: () => { }
      })
    },
    cancelParameter () {
      // 确认弹窗
      this.alertConfirm({
        text: '确定要放弃更改参数?',
        okBtn: '确认',
        infoBtn: '我再想想',
        ok: () => {
          this.parameterData = JSON.parse(JSON.stringify(this.backupParameterData))
          this.editFlag = false
        },
        info: () => { }
      })
    },
    inputFocus (tdEle) {
      this.$refs[tdEle].getElementsByTagName('input')[0].style.border = '1px solid #938361'
    },
    inputBlur (tdEle) {
      this.$refs[tdEle].getElementsByTagName('input')[0].style.border = '1px solid #fff'
    }
  },
  watch: {
    parameterData: {
      handler () {
        this.saveDisabled = true
        let numReg = /(^0$)|(^[1-9](\d+)?(\.\d{1,4})?$)|(^\d\.\d{1,4}$)/
        for (let key in this.parameterData) {
          if (!numReg.test(this.parameterData[key])) {
            this.$message.error('数值必须为整数或小数，小数点后不超过4位。')
            this.saveDisabled = false
          }
        }
      },
      deep: true
    }
  },
  components: {
    BusinessTitle
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/variables.less';
.edit-button {
  display: inline-block;
  width: 163px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  font-size: 16px;
  color: #ffffff;
  background: @theme-blue;
  background: var(--mainColor);
  border-radius: 4px;
  margin: 22px 0 0 25px;
  cursor: pointer;
}
.textMainColor {
  font-family: ArialMT;
  font-weight: bold;
  color: @theme-blue;
  color: var(--mainColor);
}
.parameter-setting--show {
  .setting-detail {
    margin: 30px 0;
    height: 121px;
    border: 1px solid #d9d9d9;
    .rate-standards {
      width: 56%;
      margin: 0 auto;
      height: 88px;
      line-height: 88px;
      display: flex;
      justify-content: space-between;
      .rate-box {
        width: 280px;
        font-size: 14px;
        // font-family: SimSun;
        font-weight: 400;
        color: rgba(87, 87, 87, 1);
        text-align: center;
      }
      span:nth-child(2n) {
        padding: 0 10px 0 23px;
        font-size: 18px;
        color: @theme-blue;
        color: var(--mainColor);
      }
    }
    .withdraw-times {
      width: 100%;
      text-align: center;
      font-size: 16px;
      span:nth-child(2n) {
        color: @theme-blue;
        padding: 0 10px 0 23px;
        font-size: 18px;
        color: var(--mainColor);
      }
    }
  }
  // .rate-setting-detail-left {
  //   float: left;
  // }
  // .rate-setting-detail-right {
  //   float: right;
  // }
  .rate-setting-detail-right {
    width: 99.8%;
    height: 115px;
    text-align: center;
    font-size: 16px;
    line-height: 81px;
    border: 1px solid #d9d9d9;
    .depositLowerLimit {
      font-size: 18px;
      color: @theme-blue;
      color: var(--mainColor);
    }
  }
}
.parameter-setting--edit {
  input {
    border: 1px solid #e6e6e6;
    width: 76px;
    height: 37px;
    border-radius: 5px;
    background: #fafafa;
    padding-left: 8px;
  }
  .setting-detail {
    margin: 30px 0;
    height: 121px;
    border: 1px solid #d9d9d9;
    .rate-standards {
      width: 56%;
      margin: 0 auto;
      height: 88px;
      line-height: 88px;
      display: flex;
      justify-content: space-between;
      .rate-box {
        width: 291px;
        font-size: 16px;
        text-align: center;
      }
      span:nth-child(2n) {
        padding: 0 10px 0 23px;
        font-size: 14px;
        color: @theme-blue;
        color: var(--mainColor);
      }
    }
    .withdraw-times {
      width: 100%;
      text-align: center;
      font-size: 16px;
      span:nth-child(2n) {
        color: @theme-blue;
        padding: 0 10px 0 23px;
        font-size: 14px;
        color: var(--mainColor);
      }
    }
  }
  // .rate-setting-detail-left {
  //   float: left;
  // }
  // .rate-setting-detail-right {
  //   float: right;
  // }
  .rate-setting-detail-right {
    width: 99.8%;
    height: 115px;
    text-align: center;
    font-size: 16px;
    line-height: 81px;
    border: 1px solid #d9d9d9;
    position: relative;
  }
  span:nth-child(2n) {
    font-size: 14px;
    color: @theme-blue;
    color: var(--mainColor);
    display: inline;
  }
  .symbol {
    position: absolute;
    top: 35px;
    left: 576px;
    font-size: 16px;
  }
}
h4 {
  background-color: #f0f0f0;
  height: 32px;
  line-height: 32px;
  text-align: center;
  border-bottom: 1px solid #d9d9d9;
}
</style>
