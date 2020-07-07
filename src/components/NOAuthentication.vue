<template>
  <div class="no-authentication">
    <el-dialog
      :visible.sync="showDialog"
      width="500px"
      center
      :show-close="showClose"
      :close-on-press-escape="showClose"
      :close-on-click-modal="showClose"
      @before-close="closeDialog"
      >
      <div class="dialog-container">
          <p>您尚未完成账户认证, 请先完成账户认证</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ToAttestation" class="btn" type="primary">去认证</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showClose: false
    }
  },
  methods: {
    closeDialog () {
      this.showDialog = false
    },
    ToAttestation () {
      this.$emit('ToAttestation')
    }
  }
}
</script>
<style lang="less" scoped>
  @import '~@/assets/less/variables.less';
.dialog-container {
    p {
      margin-top: 20px;
      color: #575757;
      text-align: center;
      height: 30px;
      font-size: 16px;
      line-height: 30px;
    }
  }
.dialog-footer {
    .btn {
      width: 180px;
      height: 36px;
      border: none;
    }
  }
</style>

<style lang="less">
  .no-authentication {
    .el-dialog {
      position: absolute;
      top: 50%;
      left: 50%;
      height: 233px;
      margin-left: -250px!important;
      margin-top: -121px!important;
    }
  }
</style>
