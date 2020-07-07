<!--
Des: 申请取消联合发令的按钮,包括弹窗和填入申请原因的弹窗
Author: Siger
props: {
  // 传入申请的单号(orderId)
  orderId: {
    type: String,
    default: ''
  }
},
// 完成后提交给父组件
emit: 申请成功事件
-->
<template>
  <div style="display: inline-block;">
    <a class="cancel-btn" @click="applyCancel">申请取消联合发令</a>
    <RefuseDialog
      :refuseText="refuseText"
      reasonText="取消原因"
      :rejectDialogShow="rejectDialogShow"
      @rejectSuccess="rejectSuccess"
      @rejectFailed="rejectFailed"></RefuseDialog>
  </div>
</template>

<script>
import settings from '@/settings.js'
import RefuseDialog from '@/components/RefuseDialog.vue'
export default {
  props: {
    orderId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      refuseText: '资金方',
      // 申请取消的api POST
      applyCancelTokenUrl: settings.apiGateway.applyCancelToken,
      rejectDialogShow: false
    }
  },
  created () {
    let role = this.getUserRole()
    if (role === 'fund') {
      this.refuseText = '是否确认向企业申请取消此次联合发令？'
    } else {
      this.refuseText = '是否确认向资金方申请取消此次联合发令？'
    }
  },
  methods: {
    applyCancel () {
      this.rejectDialogShow = true
    },
    rejectSuccess (reason) {
      this.fetch(this.applyCancelTokenUrl, 'post', {
        orderId: this.orderId,
        reason: reason
      }).then(data => {
        this.log(data)
        this.rejectDialogShow = false
        this.$emit('cancelSuccess')
        this.goBack()
      }).catch(res => {
        this.$message.error(res.data.msg)
      })
    },
    rejectFailed () {
      this.rejectDialogShow = false
    }
  },
  components: {
    RefuseDialog
  }
}
</script>

<style scoped lang="less">
  @import "~@/assets/less/variables.less";
  .cancel-btn {
    color: @theme-blue;
    color: var(--mainColor);
    text-decoration: underline;
    cursor: pointer;
  }
</style>
