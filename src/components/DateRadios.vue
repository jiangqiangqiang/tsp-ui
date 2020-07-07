<template>
  <div class="radio-container">
    <div>
      <div class="user-defined">
        <el-date-picker
          :disabled="interval !== '自定义'"
          v-model="definedTime"
          type="daterange"
          size="small"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
          @blur="handleUserDefined">
        </el-date-picker>
      </div>
      <div class="select-date">
        <el-select size="small" v-model="interval" placeholder="请选择" @change="handleUserDefined">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      definedTime: '',
      options: [{
        value: '7',
        label: '近7天'
      }, {
        value: '30',
        label: '近30天'
      }, {
        value: '90',
        label: '近90天'
      }, {
        value: '180',
        label: '近半年'
      }, {
        value: '自定义',
        label: '自定义'
      }],
      interval: '7',
      query: '?days=7',
      choiceDate: '',
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.choiceDate = minDate.getTime()
          if (maxDate) {
            this.choiceDate = ''
          }
        },
        disabledDate: (time) => {
          if (this.choiceDate) {
            const one = 180 * 24 * 3600 * 1000
            const minTime = this.choiceDate - one
            const maxTime = this.choiceDate + one
            return time.getTime() < minTime || time.getTime() > maxTime
          }
        }
      }
    }
  },
  created () {
    setTimeout(() => {
      this.$emit('UserDefined', this.query)
    }, 50)
  },
  methods: {
    handleUserDefined () {
      if (this.interval === '自定义') {
        if (!this.definedTime[0]) return
        this.query = `?startTime=${this.definedTime[0]}&endTime=${this.definedTime[1]}`
      } else {
        this.query = '?days=' + this.interval
      }
      this.$emit('UserDefined', this.query)
    }
  },
  watch: {
    choiceDate (val) {
      console.log(val)
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/less/variables';
  .user-defined{
    float: left;
  }
  .select-date {
    float: left;
    margin-left: 10px
  }
</style>
<style lang="less">
  .user-defined {
    .el-date-editor--daterange.el-input__inner {
      width: 210px;
    }
    .el-date-editor .el-range__close-icon {
      width: 0
    }
    .el-input--suffix {
      width: 160px
    }
  }
  .select-date {
    .el-input--suffix {
      width: 100px
    }
  }
</style>
