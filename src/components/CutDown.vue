<!--
 Des: 倒计时组件,倒计时为0时停止
 Author: siger
 props: {
   // 传入倒计时ms数
   cutdownms: {
     type: Number,
     default: 0
   }
   // 倒计时前面的文案
   aheadText: {
      type: String,
      default: ''
   },
   // 倒计时后面的文案
   afterText: {
      type: String,
      default: ''
   },
   // 倒计时为0时是否显示已超时文案,默认不显示
    showTimeoutText: {
      type: Boolean,
      default: false
    }
 }
 output: 0时00分00秒
-->
<template>
  <div style="line-height: 30px;border: 1px solid #fff;">
    <span>{{aheadText}}</span>
    <!-- <span :class="[overtime ? 'clock_icon--overtime' : 'clock_icon--intime']"></span> -->
    <div style="display: inline-block;width: 20px;position: relative;height: 100%;"><svg-icon :iconClass="overtime ? 'zjf_lhfl_cs' : 'zjf_lhfl_djs'" className='clock_icon--overtime'></svg-icon></div>
    <span v-if="overtime && showTimeoutText" class="text--red">
      已超时
    </span>
    <span v-else>
      <span class="text--red"> {{hours}} </span> 时 <span class="text--red"> {{minutes}} </span> 分 <span class="text--red"> {{seconds}} </span> 秒
    </span>
    <span>{{afterText}}</span>
  </div>
</template>

<script>
export default {
  props: {
    cutdownms: {
      type: Number,
      default: 0
    },
    aheadText: {
      type: String,
      default: ''
    },
    afterText: {
      type: String,
      default: ''
    },
    showTimeoutText: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      hours: '00',
      minutes: '00',
      seconds: '00',
      cutdowns: 0,
      timerId: null,
      overtime: false
    }
  },
  created () {},
  methods: {
    setCutdowns () {
      this.timerId = setInterval(() => {
        this.cutdowns--
        this.setTime()
      }, 1000)
    },
    setTime () {
      if (this.cutdowns <= 0) {
        this.hours = '00'
        this.minutes = '00'
        this.seconds = '00'
        this.overtime = true
        clearInterval(this.timerId)
      } else {
        this.hours = Math.floor(this.cutdowns / (60 * 60))
        this.hours = this.hours >= 10 ? this.hours : '0' + this.hours
        let distance = this.cutdowns % 3600
        this.minutes = Math.floor(distance / 60)
        this.minutes = this.minutes >= 10 ? this.minutes : '0' + this.minutes
        distance = distance % 60
        this.seconds = distance >= 10 ? distance : '0' + distance
        this.overtime = false
      }
    }
  },
  watch: {
    cutdownms: {
      immediate: true,
      handler (newVal) {
        this.cutdowns = Math.floor(newVal / 1000)
        this.setTime()
        this.setCutdowns()
      }
    }
  },
  beforeDestroy () {
    clearInterval(this.timerId)
  },
  computed: {}
}
</script>

<style scoped lang="less">
  .clock_icon--overtime, .clock_icon--intime {
    display: inline-block;
    position: absolute;
    vertical-align: middle;
    top: -15px;
    width: 20px!important;
    height: 20px!important;
  }
  // .clock_icon--overtime {
  // }
  // .clock_icon--intime {
  // }
  span {
    display: inline-block;
    height: 30px;
    line-height: 30px;
  }
  .text--red {
    color: #de2827;
    font-size: 16px;
    font-weight: 600
  }
</style>
