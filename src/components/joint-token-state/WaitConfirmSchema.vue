<!--
  判断逻辑: 首先判断是否超时,然后判断角色,超时的情况下两个角色的不同表现
-->
<template>
  <div>
    <div v-if="!isOverTime">
      <div v-if="role === 'fund'">
        <h4>请等待企业确认联合发令方案</h4>
        <CutDown aheadText="若企业在" afterText="后未确认,您可通过系统提醒功能,通知企业尽快处理." :cutdownms="expirationTime"></CutDown>
        <div style="margin-top: 20px">
          <ApplyCancelTokenBtn :orderId="orderId"></ApplyCancelTokenBtn>
        </div>
      </div>
      <div v-if="role === 'enterprise'">
        <h4>资金方已发起联合发令,请及时确认方案</h4>
        <CutDown aheadText="为了确保联合发令尽快完成,请在" afterText="内确认方案." :cutdownms="expirationTime"></CutDown>
        <div class="btn-container">
          <Button class="access-btn" @handleClick="auditSchema('Succeed')" title="接受方案"></Button>
          <Button class="refuse-btn" @handleClick="auditSchema('Rejected')" title="拒绝方案"></Button>
        </div>
      </div>
    </div>
    <div v-else>
      <!--   超时的情况   -->
      <div v-if="role === 'enterprise'">
        <h4>资金方已发起联合发令,请及时确认方案</h4>
        <CutDown aheadText="为了确保联合发令尽快完成,请在" afterText="内确认方案." :cutdownms="expirationTime"></CutDown>
        <div class="btn-container">
          <Button class="access-btn" @handleClick="auditSchema('Succeed')" title="接受方案"></Button>
          <Button class="refuse-btn" @handleClick="auditSchema('Rejected')" title="拒绝方案"></Button>
        </div>
      </div>
      <div v-if="role === 'fund'">
        <h4>请等待企业确认联合发令方案</h4>
        <CutDown showTimeoutText aheadText="企业确认操作" afterText="您可以选择继续等待,也可取消此次发令." :cutdownms="expirationTime"></CutDown>
        <div>
          <Time :orderId="orderId" company="企业方" :step="orderData.issueStep"></Time>
          <ApplyCancelTokenBtn :orderId="orderId"></ApplyCancelTokenBtn>
        </div>
      </div>
    </div>
    <RefuseDialog
      refuseText="是否拒绝该联合发令方案？"
      :rejectDialogShow="rejectDialogShow"
      @rejectSuccess="rejectSuccess"
      @rejectFailed="rejectFailed"
      ></RefuseDialog>
  </div>
</template>

<script>
import CutDown from '@/components/CutDown.vue'
import Time from '@/components/Time.vue'
import ApplyCancelTokenBtn from '@/components/ApplyCancelTokenBtn.vue'
import RefuseDialog from '@/components/RefuseDialog.vue'
import settings from '@/settings'
export default {
  props: {
    orderData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      // 审批意见 'Succeed' or 'Rejected'
      opinion: '',
      refusalReason: '',
      role: '',
      rejectDialogShow: false,
      enterpriseAuditSchemaUrl: settings.apiGateway.enterpriseAuditSchema,
      orderId: this.$route.query.code
    }
  },
  created () {
    this.role = this.getUserRole()
  },
  computed: {
    isOverTime () {
      if (this.orderData.expirationTime <= 0) {
        return true
      } else {
        return false
      }
    },
    expirationTime () {
      return this.orderData.expirationTime
    }
  },
  methods: {
    auditSchema (opinion) {
      this.opinion = opinion
      if (opinion === 'Succeed') {
        // 如果成功则提示确认
        this.alertConfirm({
          text: '是否确认接受该联合发令方案？',
          okBtn: '确定',
          infoBtn: '取消',
          ok: () => {
            this.setSchema(opinion)
          }
        })
      } else {
        // 如果拒绝则提示输入拒绝原因
        this.rejectDialogShow = true
      }
    },
    rejectSuccess (reason) {
      this.log(reason)
      this.setSchema(this.opinion, reason)
    },
    rejectFailed () {
      this.rejectDialogShow = false
    },
    setSchema (type, reason) {
      this.fetch(this.enterpriseAuditSchemaUrl, 'post', {
        auditType: type,
        recordId: this.orderId,
        refusalReason: reason
      }).then(data => {
        this.$store.dispatch('updateCounters')
        this.log(data)
        this.rejectDialogShow = false
        this.goBack()
      }).catch(res => {
        this.$message.error(res.data.msg)
      })
    }
  },
  components: {
    CutDown,
    ApplyCancelTokenBtn,
    RefuseDialog,
    Time
  }
}
</script>

<style scoped lang="less">
  @import "~@/assets/less/variables.less";
  h4 {
    height: 40px;
    line-height: 40px;
    font-weight: 600;
    font-size: 18px;
  }
  .btn-container {
    .access-btn, .refuse-btn {
      width: 163px;
      height: 41px;
      border: none;
      margin: 22px 0 0 25px;
      border-radius: 5px;
      color: #fff;
      box-shadow: 1px 6px 4px @btn-disabled;
      box-shadow: 1px 6px 4px var(--mainTableHover);
      // background-color: @theme-blue;
      // background-color: var(--mainColor);
    }
    .access-btn {
      margin-left: 0;
    }
  }
</style>
