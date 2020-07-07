<template>
  <div>
    <div class="dateClass">
      <div v-if="datePickerShow" class="date-picker-container">
        <p style="padding: 10px 0;">
          <span class="showDate">
            <button @click.stop="lastMonth" class="monthBtn"><i class="el-icon-arrow-left"></i></button>
            <span>{{currentDate.year}}</span>
            <span>{{month}}</span>
            <button @click.stop="nextMonth" class="monthBtn"><i class="el-icon-arrow-right"></i></button>
          </span>
          <button @click.stop="closePicker" class="closebtn"><i class="el-icon-close"></i></button>
        </p>
        <div class="week">
          <div v-for="(item, index) in week" :key="index">{{item}}</div>
        </div>
        <div class="dates">
          <div v-for="(item, index) in priceDates" :class="{today: item.isToday, noblank: true}"
            @click.stop="pickDate(item.date, item.price)" :key="index">
            <span>{{item.date}}</span><br>
            <span style="height:17px;display:inline-block">{{item.price}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'check-in',
  props: {
    datePickerShow: {
      type: Boolean,
      default: false
    },
    feeProps: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data: function () {
    return {
      pickedDate: '',
      price: '',
      week: ['日', '一', '二', '三', '四', '五', '六'],
      priceDates: [],
      currentDate: {
        year: '',
        month: 0,
        date: ''
      }
    }
  },
  created () {
    // this.openPicker()
  },
  computed: {
    month: function () {
      const months = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
      return months[this.currentDate.month] + '月'
    }
  },
  methods: {
    openPicker: function (feeLis) {
      this.priceDates = []
      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth()
      const date = now.getDate()
      this.currentDate.year = year
      this.currentDate.month = month
      this.currentDate.date = date
      now.setDate(1)
      // now已经变为当月第一天
      now.setFullYear(this.currentDate.year)
      const firstDay = now.getDay() // 当月第一天是星期几
      now.setMonth(month + 1)
      now.setDate(1)
      // now 变为下一个月第一天
      const lastDate = new Date(now - 24 * 3600 * 1000).getDate() // 当月最后一天是几号
      for (let i = 0; i < firstDay; i++) {
        this.priceDates.push({ date: '', price: '', isToday: false })
      }
      for (let i = 1; i < lastDate + 1; i++) {
        this.priceDates.push({
          date: '' + i,
          price: '',
          isToday: this.currentDate.month === month && i === this.currentDate.date
        })
        for (let key in feeLis) {
          if (key.split('-')[0] === (this.currentDate.year + '') && key.split('-')[1] === (this.currentDate.month + 1 + '') && key.split('-')[2] === (i + '')) {
            this.priceDates[i - 1 + firstDay].price = '￥' + feeLis[key]
            this.priceDates[i - 1 + firstDay].isToday = true
          }
        }
      }
    },
    lastMonth: function () {
      if (this.currentDate.month !== 0) {
        this.currentDate.month--
      } else {
        this.currentDate.month = 11
        this.currentDate.year--
      }
      const now = new Date()
      const month = now.getMonth()
      now.setFullYear(this.currentDate.year)
      now.setMonth(this.currentDate.month)
      now.setDate(1)
      const firstDay = now.getDay() // 当月第一天是星期几
      now.setMonth(this.currentDate.month + 1)
      const lastDate = new Date(now - 24 * 3600 * 1000).getDate() // 当月最后一天是几号
      this.priceDates = []
      for (let i = 0; i < firstDay; i++) {
        this.priceDates.push({ date: '', price: '', isToday: false })
      }
      for (let i = 1; i < lastDate + 1; i++) {
        this.priceDates.push({
          date: '' + i,
          price: ' ',
          isToday: this.currentDate.month === month && i === this.currentDate.date
        })
        for (let key in this.feeProps) {
          if (key.split('-')[0] === (this.currentDate.year + '') && (parseInt(key.split('-')[1]) + '') === (this.currentDate.month + 1 + '') && (parseInt(key.split('-')[2]) + '') === (i + '')) {
            this.priceDates[i - 1 + firstDay].price = '￥' + this.feeProps[key]
            this.priceDates[i - 1 + firstDay].isToday = true
          }
        }
      }
    },
    nextMonth: function () {
      if (this.currentDate.month !== 11) {
        this.currentDate.month++
      } else {
        this.currentDate.month = 0
        this.currentDate.year++
      }
      const now = new Date()
      const month = now.getMonth()
      now.setFullYear(this.currentDate.year)
      now.setMonth(this.currentDate.month)
      now.setDate(1)
      const firstDay = now.getDay() // 当月第一天是星期几
      now.setMonth(this.currentDate.month + 1)
      const lastDate = new Date(now - 24 * 3600 * 1000).getDate() // 当月最后一天是几号
      this.priceDates = []
      for (let i = 0; i < firstDay; i++) {
        this.priceDates.push({ date: '', price: '', isToday: false })
      }
      for (let i = 1; i < lastDate + 1; i++) {
        this.priceDates.push({
          date: '' + i,
          price: ' ',
          isToday: this.currentDate.month === month && i === this.currentDate.date
        })
        for (let key in this.feeProps) {
          if (key.split('-')[0] === (this.currentDate.year + '') && (parseInt(key.split('-')[1]) + '') === (this.currentDate.month + 1 + '') && (parseInt(key.split('-')[2]) + '') === (i + '')) {
            this.priceDates[i - 1 + firstDay].price = '￥' + this.feeProps[key]
            this.priceDates[i - 1 + firstDay].isToday = true
          }
        }
      }
    },
    closePicker: function () {
      this.$emit('feeClose', false)
    },
    pickDate: function (date, price) {
      this.pickedDate = this.currentDate.year + '-' + (this.currentDate.month + 1) + '-' + date
      this.price = price
    }
  },
  watch: {
    feeProps (feeLis) {
      this.openPicker(feeLis)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/variables';
.dateClass {
  position: absolute;
  top: 16px;
  left: 0;
  z-index: 999999;
  .date-picker-container {
    width: 370px;
    border: solid #eee 1px;
    box-shadow: rgba(0, 0, 0, 0.5) 0px 5px 15px;
    padding: 0 8px;
    background-color: #fff;
    color: rgb(96, 98, 102);
    position: relative;
    .showDate {
      border: 1px solid #ebeef5;
      display: inline-block;
      width: 234px;
      line-height: 24px;
    }
    .monthBtn,
    .closebtn {
      background-color: #fff;
      cursor: pointer;
      padding: 0 30px;
    }
    .closebtn {
      position: absolute;
      padding-left: 10px;
      top: 10px;
      right: 5px;
    }
    .week {
      width: 370px;
      height: 20px;
      div {
        width: 50px;
        height: 20px;
        line-height: 20px;
        float: left;
        text-align: center;
        word-spacing: 0;
        border: 1px solid #ebeef5;
      }
    }
    .dates {
      padding: 0 0 10px;
      // border-top: 1px solid #ebeef5;
      width: 370px;
      overflow: hidden;
      & > div {
        width: 50px;
        height: 31px;
        float: left;
        text-align: center;
      }
      .today {
        color: #fff;
        background-color: @theme-blue;
        background-color: var(--mainColor);
      }
      .noblank {
        cursor: pointer;
        border: 1px solid #ebeef5;
        &:hover {
          background-color: @theme-statebtn-blue;
          background-color: var(--mainStateBtn);
        }
      }
    }
  }
}
</style>
