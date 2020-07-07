<template>
  <div class="filtrate">
    <div style="width: 100%; height: 38px;padding-top: 14px">
      <div class="serchContent">
        <div class="time-of-filtrate">
        <span class="title-amount-sale">日期</span>
        <el-date-picker v-model="startTime" type="date" :editable="false" prefix-icon="el-icon-caret-bottom"
          @change="changeStart" value-format="yyyy-MM-dd" :clearable='false' :picker-options="pickerBeginDateBefore">
        </el-date-picker>
        <span style="padding: 0 3px">--</span>
        <el-date-picker v-model="endTime" type="date" :editable="false" @change="changeEnd"
          prefix-icon="el-icon-caret-bottom" value-format="yyyy-MM-dd" :clearable='false'
          :picker-options="pickerBeginDateAfter">
        </el-date-picker>
      </div>
      <div v-if="$route.path!=='/enterprise/rewards-detail-account'" class="related-party">
        <span class="title-amount-sale">关联方</span>
        <el-input type="text" clearable class="related-party-input" v-model="filtrate.relatedPartyName"></el-input>
      </div>
        <div class="trade-type">
          <span class="title-amount-sale">交易类型</span>
          <el-select clearable v-model="filtrate.transactionTypes">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      <div class="amount-filtrate">
        <span class="title-amount-sale">金额</span>
        <el-input v-model="filtrate.min" class="amount-input" @blur="countMin"></el-input>
        <span style="padding: 0 3px">--</span>
        <el-input v-model="filtrate.max" class="amount-input" @blur="countMax"></el-input>
      </div>
      <div class="transaction-number">
        <span class="title-amount-sale">交易编号</span>
        <el-input clearable type="text" class="transaction-number-input" v-model="filtrate.transactionCode"></el-input>
      </div>
      <div class="transaction-number" style="opacity:0">
        <span class="title-amount-sale">交易编号</span>
        <el-input clearable type="text" class="transaction-number-input"></el-input>
      </div>
      <div style="height:0;width:100%;display:inline-block"></div>
      </div>
    </div>
    <!-- <div style="width:100%; height:38px"> -->
      <!-- <div class="serchContent"> -->
        <!-- <div class="amount-filtrate">
        <span class="title-amount">金额</span>
        <el-input v-model="filtrate.min" class="amount-input" @blur="countMin"></el-input>
        <span style="padding: 0 3px">--</span>
        <el-input v-model="filtrate.max" class="amount-input" @blur="countMax"></el-input>
      </div>
      <div class="transaction-number">
        <span style="padding-right: 20px">交易编号</span>
        <el-input clearable type="text" class="transaction-number-input" v-model="filtrate.transactionCode"></el-input>
      </div>
      <div class="transaction-number op0">
        <span style="padding-right: 20px">交易编号</span>
        <el-input type="text" class="transaction-number-input"></el-input>
      </div> -->
      <!-- </div> -->
      <div class="btn">
        <el-button class="search-button" type="info" @click="getItemizedFiltrate">查询</el-button>
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
    getInit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      startTime: '',
      endTime: '',
      pickerBeginDateBefore: {
        disabledDate: (time) => {
          let beginDateVal = this.endTime
          if (beginDateVal) {
            return time.getTime() > (new Date(beginDateVal)).getTime()
          }
        }
      },
      pickerBeginDateAfter: {
        disabledDate: (time) => {
          let beginDateVal = this.startTime
          if (beginDateVal) {
            // return time.getTime() < beginDateVal
            return (time.getTime() < (new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000)) || (time.getTime() > (new Date()).getTime())
          } else {
            // 大于今天的日期不能选,王悦确认5.20
            return time.getTime() > (new Date()).getTime
          }
        }
      }
    }
  },
  methods: {
    pickerBeginDateBeforeFunc (time) {
      let beginDateVal = this.endTime
      if (beginDateVal) {
        return time.getTime() > beginDateVal
      }
    },
    pickerBeginDateAfterFunc (time) {
      let beginDateVal = this.startTime
      if (beginDateVal) {
        // return time.getTime() < beginDateVal
        return (time.getTime() < (new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000)) || (time.getTime() > (new Date()).getTime())
      } else {
        // 大于今天的日期不能选,王悦确认5.20
        return time.getTime() > (new Date()).getTime
      }
    },
    getItemizedFiltrate () {
      let filtrateData = JSON.parse(JSON.stringify(this.filtrate))
      if (filtrateData.min) filtrateData.min = parseFloat(filtrateData.min.toString().replace(/,/g, ''))
      if (filtrateData.max) filtrateData.max = parseFloat(filtrateData.max.toString().replace(/,/g, ''))
      if (filtrateData.min > filtrateData.max) {
        this.$message.error('输入金额不符合要求')
      } else {
        this.$emit('getItemizedFiltrate', filtrateData)
      }
    },
    getCurrentMonthFirst () {
      var date = new Date()
      date.setDate(1)
      var month = parseInt(date.getMonth() + 1)
      var day = date.getDate()
      if (month < 10) {
        month = '0' + month
      }
      if (day < 10) {
        day = '0' + day
      }
      this.startTime = date.getFullYear() + '-' + month + '-' + day
      this.filtrate.startTime = this.startTime
    },
    getCurrentMonthLast () {
      var date = new Date()
      // var currentMonth = date.getMonth()
      // var nextMonth = ++currentMonth
      // var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1)
      // var oneDay = 1000 * 60 * 60 * 24
      // var lastTime = new Date(nextMonthFirstDay - oneDay)
      var lastTime = date
      var month = parseInt(lastTime.getMonth() + 1)
      var day = lastTime.getDate()
      if (month < 10) {
        month = '0' + month
      }
      if (day < 10) {
        day = '0' + day
      }
      this.endTime = date.getFullYear() + '-' + month + '-' + day
      this.filtrate.endTime = this.endTime
    },
    changeStart (timeStr) {
      this.pickerBeginDateAfter = {
        disabledDate (time) { // 开始时间-结束时间
          return (time.getTime() < new Date(timeStr).getTime() - 1 * 24 * 60 * 60 * 1000) || (time.getTime() > (new Date()).getTime())
        }
      }
      this.filtrate.startTime = timeStr
    },
    changeEnd (timeStr) {
      this.pickerBeginDateBefore = {
        disabledDate (time) { // 开始时间-结束时间
          return (time.getTime() > new Date(timeStr).getTime())
        }
      }
      this.filtrate.endTime = timeStr
    },
    countMin () {
      this.filtrate.min = this.toThousands(this.filtrate.min)
    },
    countMax () {
      this.filtrate.max = this.toThousands(this.filtrate.max)
    }
  },
  created () {
    this.getCurrentMonthFirst()
    this.getCurrentMonthLast()
  },
  watch: {
    getInit (val) {
      if (val) {
        this.getCurrentMonthFirst()
        this.getCurrentMonthLast()
      }
    },
    'filtrate.endTime' (val) {
      if (val) this.endTime = val
    },
    'filtrate.startTime' (val) {
      if (val) this.startTime = val
    }
  }
}
</script>

<style scoped lang="less">
.serchContent {
  width: calc(~"100% - 125px");
  min-width: 968px;
  height: 76px;
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
.filtrate {
  width: calc(~"100% - 12px");
  padding-left: 10px;
  position: relative;
  height: 90px;
  border: 1px solid #e6e6e6;
  margin-top: 20px;
  background: #fcfcfc;
  .time-of-filtrate {
    display: inline-block;
    margin-bottom: 12px;
    width: 320px;
    height: 26px;
    font-size: 0;
    span {
      font-size: 14px;
    }
    .date-range {
      // padding-right: 20px;
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
    // padding-left: 49px;
    .transaction-number-input {
      width: 224px;
      height: 21px;
      // border: 1px solid #e6e6e6;
      // border-radius: 4px;
    }
  }
  .op0 {
    opacity: 0;
  }
  .related-party {
    display: inline-block;
    width: 320px;
    height: 26px;
    font-size: 0;
    span {
      font-size: 14px;
    }
    // padding-left: 63px;
    .related-party-input {
      width: 224px;
      height: 21px;
      // border: 1px solid #e6e6e6;
      // border-radius: 4px;
    }
  }
  .amount-filtrate {
    display: inline-block;
    width: 320px;
    height: 26px;
    font-size: 0;
    span {
      font-size: 14px;
    }
    .amount-input {
      width: 105px;
      height: 23px;
    }
  }
  .trade-type {
    display: inline-block;
    width: 320px;
    height: 26px;
    font-size: 0;
    span {
      font-size: 14px;
    }
  }
  .btn {
    position: absolute;
    right: 0;
    bottom: 12px;
    margin-right: 20px;
    width: 81px;
    height: 25px;
    .el-button {
      width: 80px;
      height: 25px;
      line-height: 0px;
      background-color: #e5e5e5;
    }
    .search-button {
      color: #797c84;
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
.filtrate /deep/.el-icon-circle-close {
  padding-left: 30px !important;
}
.filtrate /deep/.el-input__prefix {
  left: 82px !important;
}
.filtrate /deep/.el-input--prefix .el-input__inner {
  padding-left: 15px !important;
}
// .filtrate /deep/.el-icon-circle-close:before {
//   content: ''!important
// }
// .filtrate /deep/.el-button el-button--info is-plain{}
</style>
