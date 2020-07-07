
<!--
Des: 提醒倒计时组件,
 props: {
   // 接收提醒消息方
   company: {
      type: String,
      default: ''
    },
    // 发送请求用
    orderId: {
      type: String,
      default: ''
    }
 }
-->

<template>
  <div class="RemindBtn">
    <el-button type="primary" class="btn" @click="handleRemind" :disabled="disabled">提醒 {{countDown}}</el-button>
    <el-dialog
      :visible.sync="rejectProjectDialog"
      center
      width="576px"
      top="350px"
      >
      <i class="el-icon-circle-check-outline icon"></i>
      <div class="content">
        <p class="text">提醒成功</p>
        <div class="text">已发送提醒至{{company}}, 请您耐心等待</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <Button class="confirm-btn"  @handleClick="clickButton" title="确认"></Button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Setitem, Getitem, Removeitem } from '@/services/CommonService'
import settings from '@/settings'
export default {
  data () {
    return {
      content: '',
      countDown: '',
      rejectProjectDialog: false,
      remindUrl: settings.apiGateway.remind
    }
  },
  props: {
    company: {
      type: String,
      default: ''
    },
    orderId: {
      type: String,
      default: ''
    },
    step: {
      type: String,
      default: ''
    }
  },
  created () {
    var msRes = Getitem('endMsRes' + this.orderId)
    if (msRes !== null) {
      this.codeCountDown()
    }
  },
  methods: {
    handleRemind () {
      // type未知暂时搁置
      this.fetch(`${this.remindUrl}/${this.orderId}`, 'post').then(data => {
        this.rejectProjectDialog = true
      }).catch(res => {
        this.$message.error(res.data.msg)
      })
    },
    clickButton () {
      this.rejectProjectDialog = false
      let endMsRes = (new Date()).getTime() + 3600000
      let residueObj = {}
      residueObj.orderId = this.orderId
      residueObj.step = this.step
      residueObj.msRes = endMsRes
      Setitem('endMsRes' + this.orderId, JSON.stringify(residueObj))
      this.calLastTime(endMsRes)
    },
    codeCountDown () {
      let endMs = Getitem('endMsRes' + this.orderId)
      if (endMs !== null) {
        let endMsRes = JSON.parse(endMs)
        this.calLastTime(endMsRes.msRes)
      }
    },
    calLastTime (endTime) {
      let msRes = Math.ceil((endTime - (new Date()).getTime()) / 1000)
      let timer = setInterval(() => {
        if (msRes > 0) {
          // var h = msRes / 3600 < 10 ? ('0' + parseInt(msRes / 3600)) : parseInt(msRes / 3600)
          var m = (msRes / 60) < 10 ? ('0' + parseInt(msRes / 60)) : parseInt(msRes / 60)
          var s = (msRes % 60) < 10 ? ('0' + parseInt(msRes % 60)) : parseInt(msRes % 60)
          var msg = m + ':' + s
          this.countDown = msg
          msRes--
        }
        if (msRes <= 0) {
          clearInterval(timer)
          this.countDown = ''
          Removeitem('endMsRes' + this.orderId)
        }
      }, 1000)
    }
  },
  computed: {
    disabled () {
      if (this.countDown === '') {
        return false
      } else {
        return true
      }
    }
  }
}
</script>

<style lang="less" scoped>
  @import "~@/assets/less/variables";
  .RemindBtn {
    display: inline-block;
    margin: 20px 0;
    .btn {
      width: 162px;
      height: 40px;
      margin-right: 10px;
      font-size: 14px;
      background-color: @theme-blue;
      background-color: var(--mainColor);
      border-color: @theme-blue;;
      border-color: var(--mainColor);
    }
    .el-button.is-disabled{
      color:#858585;
      background-color: @theme-statebtn-blue;
      background-color: var(--mainStateBtn);
      border-color: @theme-statebtn-blue;
      border-color: var(--mainStateBtn);
    }
  }
  .icon {
    font-size:66px;
    width: 100%;
    text-align: center;
    color: #78bf3e;
  }
  .content {
    width: 100%;
    text-align: center;
    font-size: 18px;
    .text {
      margin-top:20px;
    }
  }
  .dialog-footer {
    .confirm-btn {
      width:180px;
      height: 40px;
      background-color: @theme-blue;
      background-color: var(--mainColor);
      border: none;
    }
  }
</style>

<style>
  .RemindBtn .el-dialog{
    position: absolute;
    top: 50% !important;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    margin-top: 0 !important;
    margin-left: 108px;
  }
</style>
