<template>
  <div class="no-pay-password">
    <el-dialog :visible.sync="setPsdVisible" :before-close="handleDialogClose" center width="480px" class="pay-table1">
      <p class="hint">为了你的账号安全,请先设置支付密码</p>
      <div slot="footer" class="dialog-footer">
        <Button class="confirm-btn" style="margin-top: -60px;" @handleClick="setPsd" title="设置支付密码"></Button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showClose: true
    }
  },
  props: {
    setPsdVisible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleDialogClose () {
      this.$emit('handleClose')
    },
    setPsd () {
      let role = this.getUserRole()
      this.$router.push(
        {
          path: '/' + role + '/change-password',
          query: {
            choose: 'PayPassword'
          }
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/variables.less';
.dialog-footer {
  .confirm-btn {
    width: 240px;
    // background-color: @theme-blue;
    // background-color: var(--mainColor);
    border: none;
  }
}
.hint {
  text-align: center;
  margin: 20px 0;
  font-size: 18px;
  line-height: 31px;
}
.text {
  cursor: pointer;
  text-decoration: underline;
  color: @theme-blue;
  color: var(--mainColor);
}
</style>
