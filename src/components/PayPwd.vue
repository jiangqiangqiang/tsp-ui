<!--
 Des: 密码支付组件
 props: {
   title: {
      type: String,
      default: ''
    }
 }
-->

<template>
  <div class="input">
    <span class="password1" @click="setTimer('tag')"><span class="iconfont" v-for="i in password.length"
        :key="i"></span><span v-show="isFocus" class="focusIcon"></span></span>
    <input type="text" class="password" Width="300" ID="txtPassword" MaxLength="26" v-model="password" autofocus
      @click="setTimer('tag')">
    <div class="maskClick" @click="clearFocus"></div>
  </div>
</template>

<script>
export default {
  props: {},
  data () {
    return {
      mask: '|',
      password: '',
      isFocus: true,
      timer: null,
      timerOut: null
    }
  },
  methods: {
    setTimer (tag) {
      const that = this
      that.clearFocus()
      setTimeout(() => {
        that.isFocus = true
      }, 400)
      that.timer = setInterval(() => {
        this.isFocus = false
        that.timerOut = setTimeout(() => {
          this.isFocus = true
        }, 1200)
      }, 800)
    },
    clearFocus () {
      window.clearInterval(this.timer)
      this.timer = null
      window.clearTimeout(this.timerOut)
      this.timerOut = null
      setTimeout(() => {
        this.isFocus = false
      }, 20)
    }
  },
  mounted () {
    this.setTimer()
  },
  watch: {
    password (val) {
      var s = ''
      for (var i = 0; i < val.length; i++) {
        s = s + '*'
      }
      this.mask = s
    }
  },
  beforeDestroy () {
    window.clearInterval(this.timer)
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/less/variables.less';
.iconfont {
  display: inline-block;
  height: 7px;
  width: 7px;
  margin-right: 2px;
  border-radius: 50%;
  background-color: rgb(51, 51, 51)
}
#txtPassword {
  opacity: 0;
}
input {
  width: 220px;
  padding-left: 10px;
  padding-top: 3px;
  background: #fcfcfc;
  height: 38px;
  line-height: 43px;
  font-size: 18px;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
}
div.input {
  position: relative;
}
div.input input {
  position: absolute;
  left: 0;
  z-index: 22;
}
.maskClick {
  width: 500px;
  height: 500px;
  position: absolute;
  top: -125px;
  left: -125px;
  z-index: 1;
}
.password1 {
  position: absolute;
  left: 0;
  z-index: 22;
  width: 220px;
  padding-left: 10px;
  background: #fcfcfc;
  height: 38px;
  line-height: 33px;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
}
.focusIcon {
  display: inline-block;
  width: 1.5px;
  height: 20px;
  background: #606266;
  vertical-align: middle;
}
</style>
