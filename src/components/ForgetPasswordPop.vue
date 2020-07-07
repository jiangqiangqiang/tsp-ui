<template>
  <div class="forget-password-dialog">
    <el-dialog center :visible.sync="dialogVisible" width="500px" :before-close="handleDialogClose" class="pay-table1">
      <div style="height:30px;line-height:30px;text-align:center;">如您忘记您的支付密码，</div>
      <div style="height:30px;line-height:30px;text-align:center;">请联系好快通宝官方客服验证身份并处理，</div>
      <div style="height:30px;line-height:30px;text-align:center;marginBottom:1px;">官方客服电话为{{$store.state.serviceTel}}</div>
      <span slot="footer" class="dialog-footer">
        <Button @handleClick="$emit('handleClose')" title="确定"></Button>
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
@import '~@/assets/less/variables.less';
.dialog-footer {
  .el-button {
    width: 240px;
    background-color: @theme-blue;
    background-color: var(--mainColor);
    border: none;
  }
}
</style>
