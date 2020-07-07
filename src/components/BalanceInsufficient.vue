<template>
<div class="forget-password-dialog">
  <el-dialog
    center
    :visible.sync="dialogVisible"
    width="568px"
    :before-close="handleDialogClose">
    <div style="text-align:center; font-size: 16px;margin-top:30px">
      <p class="prompt-text">抱歉, 当前邀请费用余额不足, 无法进行邀请。</p>
      <p class="prompt-text">请联系好快通宝官网进行充值</p>
      <p class="prompt-text">官方客服电话: <span class="service-tel">{{$store.state.serviceTel}}</span></p>
    </div>
    <span slot="footer" class="dialog-footer">
      <Button  @handleClick="$emit('handleClose')" title="确定"></Button>
    </span>
  </el-dialog>
</div>

</template>

<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleDialogClose () {
      this.$emit('handleClose')
    }
  }
}
</script>

<style lang="less" scoped>
  @import "~@/assets/less/variables.less";
  .dialog-footer {
    .el-button {
      width: 240px;
      background-color: @theme-blue;
      background-color: var(--mainColor);
      border: none;
    }
  }
  .prompt-text {
    height: 35px;
    line-height: 35px;
  }
  .service-tel {
    font-weight: 700;
    color: @theme-blue;
    color: var(--mainColor);
  }
</style>

<style lang="less">
  .forget-password-dialog {
    .el-dialog {
      height: 319px;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -156px!important;
      margin-top: -159px!important;;
    }
  }
</style>
