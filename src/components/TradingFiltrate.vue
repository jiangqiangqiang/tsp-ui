<template>
  <div class="tradingCenter">
    <div class="filtrate">
        <div class="serchContent">
          <div class="time-of-application">
          <span class="title-amount-sale">发布时间</span>
          <el-date-picker v-model="startTime" type="date" :editable="false" @change="changeStart" placeholder="开始日"
            prefix-icon="el-icon-caret-bottom" value-format="yyyy-MM-dd" :picker-options="pickerBeginDateBefore">
          </el-date-picker>
          <span style="padding: 0 3px">--</span>
          <el-date-picker v-model="endTime" type="date" :editable="false" @change="changeEnd" placeholder="截至日"
            prefix-icon="el-icon-caret-bottom" value-format="yyyy-MM-dd" :picker-options="pickerBeginDateAfter">
          </el-date-picker>
        </div>
        <div class="time-of-application" v-if="type === 'saleList'">
          <span class="title-amount-sale">结束时间</span>
          <el-date-picker v-model="lastUpdatedOnBegin" type="date" :editable="false" @change="changeStart1"
            placeholder="开始日" prefix-icon="el-icon-caret-bottom" value-format="yyyy-MM-dd"
            :picker-options="pickerBeginDateBefore1">
          </el-date-picker>
          <span style="padding: 0 3px">--</span>
          <el-date-picker v-model="lastUpdatedOnEnd" type="date" :editable="false" @change="changeEnd1"
            placeholder="截至日" prefix-icon="el-icon-caret-bottom" value-format="yyyy-MM-dd"
            :picker-options="pickerBeginDateAfter1">
          </el-date-picker>
        </div>
        <div :class="type === 'saleList'?'transaction-number':'sale-number'">
          <span class="title-amount-sale">交易编号</span>
          <el-input type="text" clearable class="transaction-number-input" v-model="filtrate.txCode"></el-input>
        </div>
        <div class="amount-filtrate">
          <span class="title-amount-sale">报价</span>
          <el-input v-model="filtrate.totalAmountLow" class="amount-input" @blur="countMin" placeholder="最小金额"
            @change='checkMin'>
          </el-input>
          <span style="padding: 0 3px">--</span>
          <el-input v-model="filtrate.totalAmountHight" class="amount-input" @blur="countMax" placeholder="最大金额"
            @change='checkMax'>
          </el-input>
        </div>
        <div class="amount-filtrate" style="position:relative;">
          <span class="title-amount-sale">折扣率</span>
          <el-input v-model="filtrate.rateLow" class="amount-radio-input" placeholder="最小利率" @blur="countRateMin"
            @change='checkRateMin'></el-input>
          <span class="unitItem">%</span>
          <span style="padding: 0 3px">--</span>
          <el-input v-model="filtrate.rateHight" class="amount-radio-input" placeholder="最大利率" @blur="countRateMax"
            @change='checkRateMax'></el-input>
          <span class="unitItem1">%</span>
        </div>
        <div class="amount-filtrate" v-if="type === 'saleList'">
          <span class="title-amount-sale">状态</span>
          <el-select clearable v-model="filtrate.status">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div style="height:0;width:100%;display:inline-block"></div>
        </div>
      <!-- <div style="width:100%; height:38px;position:relative"> -->
        <!-- <div class="serchContent"> -->
          <!-- <div class="amount-filtrate">
          <span class="title-amount-sale">报价</span>
          <el-input v-model="filtrate.totalAmountLow" class="amount-input" @blur="countMin" placeholder="最小金额"
            @change='checkMin'>
          </el-input>
          <span style="padding: 0 3px">--</span>
          <el-input v-model="filtrate.totalAmountHight" class="amount-input" @blur="countMax" placeholder="最大金额"
            @change='checkMax'>
          </el-input>
        </div>
        <div class="amount-filtrate" style="position:relative;">
          <span class="title-amount-sale">折扣率</span>
          <el-input v-model="filtrate.rateLow" class="amount-radio-input" placeholder="最小利率" @blur="countRateMin"
            @change='checkRateMin'></el-input>
          <span class="unitItem">%</span>
          <span style="padding: 0 3px">--</span>
          <el-input v-model="filtrate.rateHight" class="amount-radio-input" placeholder="最大利率" @blur="countRateMax"
            @change='checkRateMax'></el-input>
          <span class="unitItem1">%</span>
        </div>
        <div class="amount-filtrate" v-if="type === 'saleList'">
          <span class="title-amount-sale">状态</span>
          <el-select clearable v-model="filtrate.status">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div> -->
        <!-- <div :class="type === 'saleList'?'transaction-number':'sale-number'" v-else style="opacity:0">
          <span class="title-amount-sale">交易编号</span>
          <el-input type="text" clearable class="transaction-number-input"></el-input>
        </div> -->
        <!-- </div> -->
        <div class="btn">
          <el-button class="search-button" type="info" @click="getBusinessFiltrate">查 询</el-button>
          <!-- <el-button class="search-button" type="info" @click="getBusinessFiltrate" v-if="isRefresh">刷 新</el-button> -->
        </div>
      <!-- </div> -->
    </div>
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
    isRefresh: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      startTime: '',
      lastUpdatedOnBegin: '',
      endTime: '',
      lastUpdatedOnEnd: '',
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
      pickerBeginDateBefore1: {
        disabledDate: (time) => {
          let beginDateVal = this.filtrate.lastUpdatedOnEnd
          if (beginDateVal) {
            return time.getTime() > (new Date(beginDateVal)).getTime()
          } else {
            return false
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
      },
      pickerBeginDateAfter1: {
        disabledDate: (time) => {
          let beginDateVal = this.filtrate.lastUpdatedOnBegin
          if (beginDateVal) {
            return time.getTime() < (new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000)
          } else {
            return false
          }
        }
      }
    }
  },
  methods: {
    getBusinessFiltrate () {
      let filtrateData = JSON.parse(JSON.stringify(this.filtrate))
      if (filtrateData.totalAmountLow) filtrateData.totalAmountLow = parseFloat(filtrateData.totalAmountLow.toString().replace(/,/g, ''))
      if (filtrateData.totalAmountHight) filtrateData.totalAmountHight = parseFloat(filtrateData.totalAmountHight.toString().replace(/,/g, ''))
      if (filtrateData.rateLow) filtrateData.rateLow = filtrateData.rateLow / 100
      if (filtrateData.rateHight) filtrateData.rateHight = filtrateData.rateHight / 100
      if (filtrateData.totalAmountLow > filtrateData.totalAmountHight) {
        this.$message.error('输入金额不符合要求')
      } else if (filtrateData.rateLow > filtrateData.rateHight) {
        this.$message.error('输入折扣率不符合要求')
      } else {
        for (let key in filtrateData) {
          if (!filtrateData[key]) {
            delete filtrateData[key]
          }
        }
        this.$emit('getBusinessFiltrate', filtrateData)
      }
    },
    changeStart (timeStr) {
      if (!timeStr) {
        this.pickerBeginDateAfter = {
          disabledDate (time) { // 开始时间-结束时间
            return time.getTime() > (new Date()).getTime()
          }
        }
      } else {
        this.pickerBeginDateAfter = {
          disabledDate (time) { // 开始时间-结束时间
            return (time.getTime() < new Date(timeStr).getTime() - 1 * 24 * 60 * 60 * 1000) || (time.getTime() > (new Date()).getTime())
          }
        }
      }

      this.startTime = timeStr
      this.filtrate.startTime = timeStr
    },
    changeStart1 (timeStr) {
      if (!timeStr) {
        this.pickerBeginDateAfter1 = {
          disabledDate (time) { // 开始时间-结束时间
            return false
          }
        }
      } else {
        this.pickerBeginDateAfter1 = {
          disabledDate (time) { // 开始时间-结束时间
            return time.getTime() < (new Date(timeStr).getTime() - 1 * 24 * 60 * 60 * 1000)
          }
        }
      }
      this.lastUpdatedOnBegin = timeStr
      this.filtrate.lastUpdatedOnBegin = timeStr
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
    changeEnd1 (timeStr) {
      if (!timeStr) {
        this.pickerBeginDateBefore1 = {
          disabledDate (time) { // 开始时间-结束时间
            return false
          }
        }
      } else {
        this.pickerBeginDateBefore1 = {
          disabledDate (time) { // 开始时间-结束时间
            return (time.getTime() > new Date(timeStr).getTime())
          }
        }
      }
      this.lastUpdatedOnEnd = timeStr
      this.filtrate.lastUpdatedOnEnd = timeStr
    },
    countMin () {
      this.filtrate.totalAmountLow = this.toThousands(this.filtrate.totalAmountLow)
    },
    countMax () {
      this.filtrate.totalAmountHight = this.toThousands(this.filtrate.totalAmountHight)
    },
    countRateMin () {
      if (this.filtrate.rateLow > 100 || this.filtrate.rateLow < 0) {
        this.$message.error('折扣率超出范围')
        this.filtrate.rateLow = ''
      }
    },
    countRateMax () {
      if (this.filtrate.rateHight > 100 || this.filtrate.rateHight < 0) {
        this.$message.error('折扣率超出范围')
        this.filtrate.rateHight = ''
      }
    },
    checkMin (val) {
      let reg = /[^\d,.]/g
      if (reg.test(val.toString())) {
        this.filtrate.totalAmountLow = this.filtrate.totalAmountLow.replace(reg, ($1) => {
          return ''
        })
      }
    },
    checkMax (val) {
      let reg = /[^\d,.]/g
      if (reg.test(val.toString())) {
        this.filtrate.totalAmountHight = this.filtrate.totalAmountHight.replace(reg, ($1) => {
          return ''
        })
      }
    },
    checkRateMin (val) {
      let reg = /[^\d.]/g
      if (reg.test(val.toString())) {
        this.filtrate.rateLow = this.filtrate.rateLow.replace(reg, ($1) => {
          return ''
        })
      }
    },
    checkRateMax (val) {
      let reg = /[^\d.]/g
      if (reg.test(val.toString())) {
        this.filtrate.rateHight = this.filtrate.rateHight.replace(reg, ($1) => {
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
  // height: 76px;
  min-width: 958px;
  float: left;
  display: table-cell;
  vertical-align: middle;
  text-align: justify;
}
.title-amount-sale {
  display: inline-block;
  width: 75px;
  text-align: right;
  padding-right: 18px;
}
.tradingCenter {
  .filtrate {
    width: calc(~"100% - 12px");
    padding-left: 10px;
    position: relative;
    // height: 90px;
    border: 1px solid #e6e6e6;
    margin-top: 20px;
    background-color: #fcfcfc;
    overflow: hidden;
    .time-of-application {
      display: inline-block;
      width: 320px;
      height: 26px;
      font-size: 0;
      margin-top: 14px;
      span {
        font-size: 14px;
      }
      .demonstration {
        padding-right: 18px;
      }
    }
    .transaction-number,
    .sale-number {
      display: inline-block;
      width: 320px;
      height: 26px;
      margin-top: 14px;
      font-size: 0;
      span {
        font-size: 14px;
      }
      .transaction-number-input {
        width: 224px;
        height: 21px;
      }
    }
    .amount-filtrate {
      display: inline-block;
      width: 320px;
      height: 26px;
      margin-top: 14px;
      font-size: 0;
      span {
        font-size: 14px;
      }
      .title-amount {
        padding-right: 18px;
      }
      .amount-input {
        width: 104px;
        height: 23px;
      }
      .amount-radio-input {
        width: 104px;
        height: 23px;
      }
      .unitItem, .unitItem1 {
        position: absolute;
        right: 10px;
        top: 5px;
      }
      .unitItem {
        right: 128px;
      }
    }
    .state-filtrate {
      display: inline-block;
      width: 320px;
      height: 26px;
      margin-top: 14px;
      font-size: 0;
      span {
        font-size: 14px;
      }
      padding-left: 100px;
      .state {
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
      right: 0;
      bottom: 12px;
      margin-right: 20px;
      height: 25px;
      .el-button {
        width: 80px;
        height: 25px;
        line-height: 0px;
        background-color: rgb(229, 229, 229);
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
}
.filtrate/deep/ .el-date-editor.el-input {
  width: 104px;
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
  left: 80px !important;
}
.filtrate /deep/.el-input--prefix .el-input__inner {
  padding-left: 15px !important;
}
</style>
