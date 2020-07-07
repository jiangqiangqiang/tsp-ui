<!--
Des: 审批拒绝相关组件
Author: Siger
props: {
// 传入拒绝文案
}
output: {
// 确定后触发emit上传事件
}
-->
<template>
  <div class="reject-Dialog">
    <el-dialog :before-close="beforeClose" :visible.sync="rejectDialogShow" center width="570px" top="305px">
      <div>
        <p class="refuse-text">{{refuseText}}</p>
        <div class="reason-container">
          <span class="title">{{reasonText}}</span>
          <el-input @blur="checkReason" type="textarea" v-model="refuseReason" class="reason" placeholder="最多30字"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <Button class="dialogBtn" @handleClick="rejectSuccess" title="确定"></Button>
        <Button class="dialogBtn" @handleClick="rejectFailed" title="取消"></Button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    rejectDialogShow: {
      type: Boolean,
      default: false
    },
    refuseText: {
      type: String,
      default: ''
    },
    reasonText: {
      type: String,
      default: '拒绝原因'
    }
  },
  data () {
    return {
      refuseReason: '',
      inputLegal: false
    }
  },
  methods: {
    rejectSuccess () {
      let refuseReason = this.refuseReason.trim()
      if (refuseReason && this.inputLegal) {
        this.$emit('rejectSuccess', refuseReason)
      } else if (!this.inputLegal) {
        this.$message.error(this.reasonText + '请输入30字以内')
      } else {
        this.$message.error(this.reasonText + '必填')
      }
    },
    beforeClose () {
      this.$emit('rejectFailed')
    },
    rejectFailed () {
      this.$emit('rejectFailed')
    },
    checkReason () {
    }
  },
  watch: {
    refuseReason (newVal) {
      if (this.refuseReason.trim().length > 30) {
        this.inputLegal = false
        this.$message.error(this.reasonText + '请输入30字以内')
      } else {
        this.inputLegal = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
  @import "~@/assets/less/variables.less";
  .el-dialog {
    .refuse-text {
      height: 40px;
      line-height: 40px;
      font-size: 18px;
      text-align: center;
    }
    .reason-container {
      margin-top: 20px;
      .title {
        display: inline-block;
        margin-top:16px;
        font-size: 16px;
        margin-left: 20px;
      }
      .reason {
        margin-right: 20px;
        float: right;
        width: 402px;
      }
    }
    .dialogBtn{
      width: 211px;
      height: 50px;
      margin-right: 10px;
      margin-top: 20px;
      font-size: 18px;
      background-color: @theme-blue;
      background-color: var(--mainColor);
      border-color: @theme-blue;
      border-color: var(--mainColor);
    }
    .dialogBtnF {
      width: 211px;
      height: 50px;
      font-size: 18px;
      background-color: #fff;
      margin-top: 20px;
      color: @theme-blue;
      color: var(--mainColor);
      border-color: @theme-blue;
      border-color: var(--mainColor);
    }
  }
</style>

<style>
  .reject-Dialog .el-dialog{
    position: absolute;
    top: 50% !important;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    margin-top: 0 !important;
    margin-left: 108px;
  }
</style>
