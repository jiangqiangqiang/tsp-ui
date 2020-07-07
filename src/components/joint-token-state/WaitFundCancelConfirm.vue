<template>
  <div>
    <div v-if="role === 'enterprise'">
      <h4>已申请取消联合发令，请等待资金方进行处理</h4>
      <div class="describe">您可以提醒资金方，要求尽快处理。</div>
      <Time company="资金方" :orderId="orderId" :step="orderData.issueStep"></Time>
    </div>
    <div v-if="role === 'fund'">
      <h4>企业方申请取消联合发令，请及时处理</h4>
      <div class="describe">
        <span>取消原因:</span>
        <span>{{orderData.reason || '空'}}</span>
      </div>
      <div v-if="isShow">
        <div class='supplement-endorse'>
          <p class="title">完成背书需要补充签收证据</p><span class="close" @click="handleClose">X</span>
          <div class="upload" style="margin-top: 10px">
            <img-upload
              style="width: 400px"
              :limit="1"
              :on-remove="EndorseRemove"
              :on-success="EndorseAddress"
              :on-error="EndorseFailed"
              :action="actionUrl"
              >
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <img  v-else src="~@/assets/img/zjf_qszj.gif" alt="背书证据">
            </img-upload>
          </div>
        </div>
      </div>
      <div class="submitBtn">
        <!--   ['Initiating', 'ConfirmScheme', 'WaitingPayment', 'WaitingEndorsement', 'WaitingFundConfirm', 'JoinConfirmSuccess']    -->
        <!-- <el-button type="primary" class="btn" @click="cancelSuccess" :disabled="isShow || disabled">同意</el-button> -->
        <!-- <el-button v-if="issueStep === 'WaitingPayment'" type="primary"  class="btn" @click="cancelRejectedAndpay">拒绝并付款</el-button> -->
        <!-- <el-button v-if="issueStep === 'WaitingEndorsement'" type="primary" class="btn"  @click="cancelRejected">拒绝</el-button>
        <el-button :disabled="disabled" v-if="issueStep === 'WaitingFundConfirm'" type="primary" class="btn" @click="cancelRejectedAndIssue">拒绝并完成发令</el-button> -->
        <Button class="btn" @handleClick="cancelSuccess" :disabled="isShow || disabled" title="同意"></Button>
        <Button class="btn" @handleClick="cancelRejectedAndpay" title="拒绝并付款" v-if="issueStep === 'WaitingPayment'"></Button>
        <Button class="btn" @handleClick="cancelRejected" title="拒绝" v-if="issueStep === 'WaitingEndorsement'" type="primary"></Button>
        <Button class="btn" @handleClick="cancelRejectedAndIssue" title="拒绝并完成发令" v-if="issueStep === 'WaitingFundConfirm'"></Button>
      </div>
    </div>
    <loading :loadingShow="loadingShow"></loading>
  </div>
</template>

<script>
import Time from '@/components/Time'
import settings from '@/settings'
import ImgUpload from '@/components/ImgUpload'
export default {
  components: {
    Time,
    ImgUpload
  },
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
      role: '',
      orderId: this.$route.query.code,
      // 审核申请取消
      auditApplyCancelUrl: settings.apiGateway.auditApplyCancel,
      // 上传文件接口
      actionUrl: settings.actionUrl,
      imageUrl: '',
      // 是否允许隐藏上传按钮
      canHidden: true,
      isShow: false,
      disabled: false,
      endorseId: '',
      loadingShow: false,
      // 拒绝并支付
      fundPaymentUrl: settings.apiGateway.fundPayment
    }
  },
  methods: {
    cancelSuccess () {
      this.alertConfirm({
        text: '是否同意取消联合发令?',
        okBtn: '确定',
        infoBtn: '取消',
        ok: () => {
          this.auditApplyCancel('Succeed')
        }
      })
    },
    cancelRejectedAndIssue () {
      if (this.imageUrl === '') {
        this.disabled = true
        this.isShow = true
      } else {
        this.disabled = false
        this.alertConfirm({
          text: '是否同意取消联合发令?',
          okBtn: '确定',
          infoBtn: '取消',
          ok: () => {
            this.auditApplyCancel('Rejected')
          }
        })
      }
    },
    cancelRejected () {
      this.alertConfirm({
        text: '是否拒绝取消联合发令?',
        okBtn: '确定',
        infoBtn: '取消',
        ok: () => {
          this.auditApplyCancel('Rejected')
        }
      })
    },
    cancelRejectedAndpay () {
      this.alertConfirm({
        text: '是否拒绝取申请并支付?',
        okBtn: '确定',
        infoBtn: '取消',
        ok: () => {
          // this.auditApplyCancel('Rejected')
          this.loadingShow = true
          this.fetch(`${this.fundPaymentUrl}${this.orderId}`, 'post').then(data => {
            this.$router.push({
              path: '/fund/fund-payment-success',
              query: {
                code: this.orderId,
                amount: data.data
              }
            })
          }).catch(res => {
            this.$message.error(res.data.msg)
          })
        }
      })
    },
    // 审核申请取消
    auditApplyCancel (auditType) {
      let data = {}
      if (this.endorseId) {
        data = {
          auditType: auditType,
          recordId: this.orderId,
          endorseId: this.endorseId
        }
      } else {
        data = {
          auditType: auditType,
          recordId: this.orderId
        }
      }
      this.loadingShow = true
      this.fetch(this.auditApplyCancelUrl, 'post', data).then(data => {
        this.goBack()
      }).catch(res => {
        this.$message.error(res.data.msg)
      })
    },
    // 背书上传
    EndorseAddress (response, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.upLoadSuccess(response, file)
    },
    // 上传成功
    upLoadSuccess (response, file) {
      if (response.code === 0) {
        this.endorseId = response.data.fileId
        this.disabled = false
      } else {
        this.$message({
          type: 'error',
          message: response.msg
        })
      }
    },
    // 文件删除成功
    EndorseRemove (file, fileList) {
      this.submitData[file.upLoadType] = ''
    },
    // 上传文件失败触发报错
    EndorseFailed () {
      this.$message({
        type: 'error',
        message: '文件上传失败'
      })
    },
    handleClose () {
      this.disabled = false
      this.isShow = false
      this.endorseId = ''
      this.imageUrl = ''
    }
  },
  created () {
    this.role = this.getUserRole()
  },
  watch: {},
  computed: {
    issueStep () {
      return this.orderData.issueStep
    }
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
  .describe {
    margin-top: 31px;
  }
  .submitBtn {
    margin:30px 0;
    .btn {
      width: 160px;
      height: 40px;
      border: none;
      background-color: @theme-blue;
      background-color: var(--mainColor);
      box-shadow: 1px 6px 4px @btn-disabled;
      box-shadow: 1px 6px 4px var(--mainTableHover);
    }
  }
  .supplement-endorse {
    width: 384px;
    height:237px;
    text-align: center;
    background: #fafafa;
    position: relative;
    margin-top: 17px;
    .title {
      padding-top: 20px;
    }
    .close {
       position: absolute;
       top: 20px;
       right: 30px;
       color: #bdbdbd;
       cursor: pointer;
    }
  }
  .uploader {
    margin-top:15px;
  }
//  .el-button.is-disabled {
//   color:#858585;
//   background-color: @btn-bg-disabeled;
//   border-color: @btn-bg-disabeled;
// }
// .el-button.is-disabled:hover{
//   color: #858585;
//   background-color: @btn-bg-disabeled;
//   border-color: @btn-bg-disabeled;
// }
</style>

<style>
.avatar-uploader .el-upload {
    /* border: 1px dashed #d9d9d9; */
    /* border-radius: 6px; */
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 300px;
    height:167px;
    display: block;
  }
</style>
