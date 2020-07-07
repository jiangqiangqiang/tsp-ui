<template>
  <div class="filtrate">
    <div style="width: 100%; lineHeight: 25px;padding-top: 14px">
      <div class="serchContent">
        <div class="time-of-application">
        <span class="title-amount">{{timeText}}</span>
        <el-date-picker v-model="startTime" type="date" :editable="false" @change="changeStart" placeholder="开始日"
          prefix-icon="el-icon-caret-bottom" value-format="yyyy-MM-dd" :picker-options="pickerBeginDateBefore">
        </el-date-picker>
        <span style="padding: 0 3px">--</span>
        <el-date-picker v-model="endTime" type="date" :editable="false" @change="changeEnd" placeholder="截至日"
          prefix-icon="el-icon-caret-bottom" value-format="yyyy-MM-dd" :picker-options="pickerBeginDateAfter">
        </el-date-picker>
      </div>
      <div class="transaction-number">
        <span class="title-amount">交易编号</span>
        <el-input type="text" class="transaction-number-input" clearable v-model="filtrate.transactionCode"></el-input>
      </div>
        <div class="transaction-number" v-if="roleType" style="paddingLeft:0">
          <span class="title-amount">{{roleType}}</span>
          <el-input type="text" class="transaction-number-input" v-model="filtrate.operator" clearable></el-input>
        </div>
      <div class="amount-filtrate" style="fontSize:14px" v-if="isDeal">
        <span class="title-amount">折扣率</span>
        <el-input v-model="filtrate.rateMin" class="amount-radio-input" placeholder="最小利率" @blur="countRateMin"
          @change='checkRateMin'></el-input>
        %<span style="padding: 0 3px">--</span>
        <el-input v-model="filtrate.rateMax" class="amount-radio-input" placeholder="最大利率" @blur="countRateMax"
          @change='checkRateMax'></el-input>%
      </div>
      <div class="amount-filtrate">
        <span class="title-amount">{{amountText}}</span>
        <el-input v-model="filtrate.min" class="amount-input" @blur="countMin" placeholder="最小金额" @change='checkMin'>
        </el-input>
        <span style="padding: 0 3px">--</span>
        <el-input v-model="filtrate.max" class="amount-input" @blur="countMax" placeholder="最大金额" @change='checkMax'>
        </el-input>
      </div>
        <div class="state-filtrate">
          <span class="title-amount">状态</span>
          <el-select clearable v-model="filtrate.transactionType">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="transaction-number" style="paddingLeft:0;opacity:0;">
          <span class="title-amount" :style="amountText === '金额范围'?'paddingLeft:0':'paddingLeft:2px'">态</span>
          <el-input type="text" class="transaction-number-input" clearable></el-input>
        </div>
        <div style="height:0;width:100%;display:inline-block"></div>
      </div>
    </div>
    <!-- <div style="width:100%; height:38px"> -->
      <!-- <div class="serchContent">
        <div class="amount-filtrate">
        <span class="title-amount">{{amountText}}</span>
        <el-input v-model="filtrate.min" class="amount-input" @blur="countMin" placeholder="最小金额" @change='checkMin'>
        </el-input>
        <span style="padding: 0 3px">--</span>
        <el-input v-model="filtrate.max" class="amount-input" @blur="countMax" placeholder="最大金额" @change='checkMax'>
        </el-input>
      </div>
        <div class="state-filtrate">
          <span class="title-amount">状态</span>
          <el-select clearable v-model="filtrate.transactionType">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="transaction-number" style="paddingLeft:0;opacity:0;">
          <span class="title-amount" :style="amountText === '金额范围'?'paddingLeft:0':'paddingLeft:2px'">态</span>
          <el-input type="text" class="transaction-number-input" clearable></el-input>
        </div>
      </div> -->
      <div class="btn">
        <el-button class="search-button" type="info" @click="getBusinessFiltrate">查 询</el-button>
      </div>
    <!-- </div> -->
  </div>
</template>

<script>
export default {
  props: {
    filtrate: {
      type: Object,
      default: () => {
        return {
          startTime: '',
          endTime: ''
        }
      }
    },
    options: {
      type: Array,
      default: () => { }
    },
    roleType: {
      type: String,
      default: '操作员'
    },
    isDeal: {
      type: Boolean,
      default: false
    },
    timeText: {
      type: String,
      default: '申请时间'
    },
    amountText: {
      type: String,
      default: '金额范围'
    }
  },
  data () {
    return {
      startTime: '',
      endTime: '',
      pickerBeginDateBefore: {
        disabledDate: (time) => {
          let beginDateVal = this.filtrate.endTime
          if (beginDateVal) {
            return time.getTime() > (new Date(beginDateVal)).getTime()
          } else {
            return time.getTime() > (new Date()).getTime()
          }
        }
      },
      pickerBeginDateAfter: {
        disabledDate: (time) => {
          let beginDateVal = this.filtrate.startTime
          if (beginDateVal) {
            return time.getTime() < (new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000) || (time.getTime() > (new Date()).getTime())
          } else {
            return time.getTime() > (new Date()).getTime()
          }
        }
      }
    }
  },
  methods: {
    getBusinessFiltrate () {
      let filtrateData = JSON.parse(JSON.stringify(this.filtrate))
      if (filtrateData.min) filtrateData.min = parseFloat(filtrateData.min.toString().replace(/,/g, ''))
      if (filtrateData.max) filtrateData.max = parseFloat(filtrateData.max.toString().replace(/,/g, ''))
      if (filtrateData.rateMin) filtrateData.rateMin = filtrateData.rateMin / 100
      if (filtrateData.rateMax) filtrateData.rateMax = filtrateData.rateMax / 100
      if (filtrateData.min > filtrateData.max) {
        this.$message.error('输入金额不符合要求')
      } else if (filtrateData.rateMin > filtrateData.rateMax) {
        this.$message.error('输入折扣率不符合要求')
      } else {
        this.$emit('getBusinessFiltrate', filtrateData)
      }
    },
    changeStart (timeStr) {
      if (!timeStr) {
        this.pickerBeginDateAfter1 = {
          disabledDate (time) { // 开始时间-结束时间
            return false
          }
        }
      } else {
        this.pickerBeginDateAfter1 = {
          disabledDate (time) { // 开始时间-结束时间
            return time.getTime() < (new Date(timeStr).getTime() - 1 * 24 * 60 * 60 * 1000) || (time.getTime() > (new Date()).getTime())
          }
        }
      }
      this.startTime = timeStr
      this.filtrate.startTime = timeStr
    },
    changeEnd (timeStr) {
      if (!timeStr) {
        this.pickerBeginDateBefore = {
          disabledDate (time) { // 开始时间-结束时间
            return time.getTime() > (new Date()).getTime()
          }
        }
      } else {
        this.pickerBeginDateBefore = {
          disabledDate (time) { // 开始时间-结束时间
            return (time.getTime() > new Date(timeStr).getTime())
          }
        }
      }
      this.endTime = timeStr
      this.filtrate.endTime = timeStr
    },
    countMin () {
      this.filtrate.min = this.toThousands(this.filtrate.min)
    },
    countMax () {
      this.filtrate.max = this.toThousands(this.filtrate.max)
    },
    countRateMin () {
      if (this.filtrate.rateMin > 100 || this.filtrate.rateMin < 0) {
        this.$message.error('折扣率超出范围')
        this.filtrate.rateMin = ''
      }
    },
    countRateMax () {
      if (this.filtrate.rateMax > 100 || this.filtrate.rateMax < 0) {
        this.$message.error('折扣率超出范围')
        this.filtrate.rateMax = ''
      }
    },
    checkMin (val) {
      let reg = /[^\d,.]/g
      if (reg.test(val.toString())) {
        this.filtrate.min = this.filtrate.min.replace(reg, ($1) => {
          return ''
        })
      }
    },
    checkMax (val) {
      let reg = /[^\d,.]/g
      if (reg.test(val.toString())) {
        this.filtrate.max = this.filtrate.max.replace(reg, ($1) => {
          return ''
        })
      }
    },
    checkRateMin (val) {
      let reg = /[^\d.]/g
      if (reg.test(val.toString())) {
        this.filtrate.rateMin = this.filtrate.rateMin.replace(reg, ($1) => {
          return ''
        })
      }
    },
    checkRateMax (val) {
      let reg = /[^\d.]/g
      if (reg.test(val.toString())) {
        this.filtrate.rateMax = this.filtrate.rateMax.replace(reg, ($1) => {
          return ''
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
.serchContent {
  width: calc(~"100% - 121px");
  height: 76px;
  min-width: 968px;
  float: left;
  display: table-cell;
  vertical-align: middle;
  text-align: justify;
}
.filtrate {
  width: calc(~"100% - 12px");
  height: 90px;
  border: 1px solid #e6e6e6;
  margin-top: 20px;
  padding-left: 10px;
  background-color: #fcfcfc;
  position: relative;
  .time-of-application {
    display: inline-block;
    width: 320px;
    height: 26px;
    font-size: 0;
    margin-bottom: 12px;
    span {
      font-size: 14px;
    }
    .demonstration {
      padding-right: 18px;
    }
  }
  .transaction-number {
    display: inline-block;
    width: 320px;
    height: 26px;
    font-size: 0;
    span {
      font-size: 14px;
    }
    padding-left: 0;
    .transaction-number-input {
      width: 224px;
      height: 21px;
      // border: 1px solid #e6e6e6;
      // padding-left: 10px;
      // border-radius: 4px;
    }
  }
  .title-amount {
      display: inline-block;
      width: 75px;
      text-align: right;
      padding-right: 18px;
    }
  .amount-filtrate {
    display: inline-block;
    width: 320px;
    height: 26px;
    font-size: 0;
    span {
      font-size: 14px;
    }
    .title-amount-sale {
      display: inline-block;
      width: 75px;
      text-align: right;
      padding-right: 18px;
      // padding-left: 21px;
      // padding-right: 18px;
    }
    .amount-input {
      width: 105px;
      height: 23px;
    }
    .amount-radio-input {
      width: 87px;
      height: 23px;
    }
  }
  .state-filtrate {
    display: inline-block;
    width: 320px;
    height: 26px;
    font-size: 0;
    span {
      font-size: 14px;
    }
    padding-left: 0;
    .state {
      display: inline-block;
      width: 75px;
      text-align: right;
      padding-right: 18px;
    }
    .state-input {
      width: 250px;
      height: 25px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
  }
  .btn {
    position: absolute;
    bottom: 12px;
    right: 0;
    margin-right: 18px;
    width: 80px;
    height: 25px;
    .el-button {
      width: 80px;
      height: 25px;
      line-height: 0px;
      background-color: #e5e5e5;
    }
    .search-button {
      border: 1px solid rgba(230, 230, 230, 1);
      font-size: 13px;
      color: rgba(101, 101, 101, 1);
    }
    .el-button:hover {
      background-color: rgb(238, 238, 238);
      color: rgba(101, 101, 101, 0.8);
    }
  }
}
.filtrate/deep/ .el-date-editor.el-input {
  width: 105px;
  padding-right: 0;
}
.filtrate/deep/.el-checkbox__input.is-checked + .el-checkbox__label {
  color: #333333;
}
.filtrate /deep/.checked {
  float: left;
  width: 150px;
  padding: 20px 30px 10px 150px;
}
.filtrate /deep/ .el-input--suffix .el-input__inner {
  padding-right: 0;
}
.filtrate /deep/.el-input__inner {
  height: 25px;
  line-height: 25px;
}
.filtrate /deep/.el-button--info.is-plain {
  width: 80px;
}
.filtrate /deep/.el-input__icon {
  line-height: 25px;
}
.filtrate /deep/.el-input--suffix {
  width: 224px;
}
.filtrate /deep/.el-input__prefix {
  left: 84px !important;
}
.filtrate /deep/.el-input--prefix .el-input__inner {
  padding-left: 10px !important;
}
// .filtrate /deep/.el-button el-button--info is-plain{}
</style>
