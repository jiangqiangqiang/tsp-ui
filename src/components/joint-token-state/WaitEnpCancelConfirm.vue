<template>
  <div>
    <div v-if="role === 'fund'">
      <h4>已申请取消联合发令，请等待企业进行处理</h4>
      <div class="describe">您可以提醒企业方，要求尽快处理。</div>
      <Time :orderId="orderId" company="企业方" :step="orderData.issueStep"></Time>
    </div>
    <div v-if="role === 'enterprise'">
      <h4>资金方申请取消联合发令，请及时处理</h4>
      <div class="describe">
        <span>取消原因:</span>
        <span>{{orderData.reason || '空'}}</span>
      </div>
      <div v-if="isShow">
        <div class='supplement-endorse'>
          <p class="title">完成背书需要补充背书证据</p><span class="close" @click="handleClose">X</span>
          <div class="upload" style="margin-top:10px">
            <img-upload
              style="width: 400px"
              :limit="1"
              :on-remove="EndorseRemove"
              :on-success="EndorseAddress"
              :on-error="EndorseFailed"
              :action="actionUrl"
              >
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <img  v-else src="~@/assets/img/beishu.png" alt="背书证据">
            </img-upload>
          </div>
        </div>
      </div>
      <div class="submitBtn">
        <!-- <el-button type="primary" class="btn" @click="cancelSuccess" :disabled="isShow || disabled">同意</el-button> -->
        <!-- <el-button v-if="issueStep === 'ConfirmScheme'" type="primary" class="btn" @click="cancelRejectedAndReceive">拒接申请并接受方案</el-button> -->
        <!-- <el-button v-if="issueStep === 'WaitingPayment'" type="primary"  class="btn" @click="cancelRejected">拒绝</el-button> -->
        <!-- <el-button v-if="issueStep === 'WaitingEndorsement'" type="primary" class="btn"  @click="cancelReEndorsejected" :disabled="disabled">拒接并完成背书</el-button> -->
        <!-- <el-button v-if="issueStep === 'WaitingFundConfirm'" type="primary" class="btn" @click="cancelRejected">拒绝</el-button> -->
        <Button class="btn" @handleClick="cancelSuccess" :disabled="isShow || disabled" title="同意"></Button>
        <Button class="btn" @handleClick="cancelRejectedAndReceive"  title="拒接申请并接受方案" v-if="issueStep === 'ConfirmScheme'"></Button>
        <Button class="btn" @handleClick="cancelRejected"  title="拒绝" v-if="issueStep === 'WaitingPayment'" type="primary"></Button>
        <Button class="btn" @handleClick="cancelReEndorsejected" :disabled="disabled" title="拒接并完成背书" v-if="issueStep === 'WaitingEndorsement'"></Button>
        <Button class="btn" @handleClick="cancelRejected" title="拒绝" v-if="issueStep === 'WaitingFundConfirm'"></Button>
      </div>
    </div>
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
      endorseId: '',
      // 上传文件接口
      actionUrl: settings.actionUrl,
      imageUrl: '',
      // 是否允许隐藏上传按钮
      canHidden: true,
      isShow: false,
      disabled: false
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
    cancelRejectedAndReceive () {
      this.alertConfirm({
        text: '是否拒绝取消申请并接受该发令方案?',
        okBtn: '确定',
        infoBtn: '取消',
        ok: () => {
          this.auditApplyCancel('Rejected')
        }
      })
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
    cancelReEndorsejected () {
      if (this.imageUrl === '') {
        this.disabled = true
        this.isShow = true
      } else {
        this.disabled = false
        this.auditApplyCancel('Rejected ')
      }
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
      this.fetch(this.auditApplyCancelUrl, 'post', data).then(data => {
        this.$store.dispatch('updateCounters')
        this.goBack()
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
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
    // padding-top:42px;
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
    .upload {
      width: 367px;
      height:210px;
      text-align: center
    }
  }
// .el-button.is-disabled{
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
