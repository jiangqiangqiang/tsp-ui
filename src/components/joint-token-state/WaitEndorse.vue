<template>
    <div>
      <div v-if="!isOverTime">
        <div v-if="role === 'fund'">
          <h4>请等待企业进行背书</h4>
          <div style="margin:20px 0 30px">
            <CutDown aheadText="若企业在" afterText="后未完成背书,您可通过系统提醒功能,通知企业尽快处理." :cutdownms="orderData.expirationTime"></CutDown>
          </div>
          <ApplyCancelTokenBtn :orderId="orderId"></ApplyCancelTokenBtn>
        </div>
        <div v-if="role === 'enterprise'">
          <h4>资金方已完成付款,请及时完成背书并上传证据</h4>
          <CutDown aheadText="为了确保联合发令尽快完成,请在" afterText="内完成背书并上传证据." :cutdownms="orderData.expirationTime"></CutDown>
          <div class='supplement-endorse'>
            <div class='upload'>
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
            <p class="title">背书证据</p>
            </div>
          </div>
          <div class="btn-container">
            <Button :disabled="!fileId" class="endorse-btn" @handleClick="achieveEndorse('Succeed')" title="完成背书"></Button>
            <ApplyCancelTokenBtn :orderId="orderId"></ApplyCancelTokenBtn>
          </div>
        </div>
      </div>
      <div v-else>
        <div v-if="role === 'fund'">
          <h4>请等待企业进行背书</h4>
          <div>
            <CutDown aheadText="企业背书操作" showTimeoutText afterText=",您可以选择继续等待,也可向企业申请取消此次联合法令." :cutdownms="orderData.expirationTime"></CutDown>
          </div>
          <div class="subBtn">
            <Time :orderId="orderId" company="企业方" :step="orderData.issueStep"></Time>
            <ApplyCancelTokenBtn :orderId="orderId"></ApplyCancelTokenBtn>
          </div>
        </div>
        <div v-if="role === 'enterprise'">
          <h4>资金方已完成付款,请及时完成背书并上传证据</h4>
          <CutDown aheadText="为了确保联合发令尽快完成,请在" afterText="内完成背书并上传证据." :cutdownms="orderData.expirationTime"></CutDown>
          <div class='supplement-endorse'>
            <div class='upload'>
              <div class="uploader">
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
            <p class="title">背书证据</p>
            </div>
          </div>
          <div class="btn-container">
            <Button :disabled="!fileId" class="endorse-btn" @handleClick="achieveEndorse('Succeed')" title="完成背书"></Button>
            <ApplyCancelTokenBtn :orderId="orderId"></ApplyCancelTokenBtn>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import ImgUpload from '@/components/ImgUpload'
import settings from '@/settings'
import Time from '@/components/Time'
import CutDown from '@/components/CutDown.vue'
import ApplyCancelTokenBtn from '@/components/ApplyCancelTokenBtn.vue'
export default {
  props: {
    orderData: {
      type: Object,
      default: () => {
        return {
          // 审批意见 'Succeed' or 'Rejected'
          opinion: '',
          refusalReason: ''
        }
      }
    },
    orderId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      role: '',
      // 上传文件接口
      actionUrl: settings.actionUrl,
      imageUrl: '',
      fileId: '',
      // 完成背书
      achieveEndorseUrl: settings.apiGateway.achieveEndorse
    }
  },
  methods: {
    // 背书上传
    EndorseAddress (response, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.upLoadSuccess(response, file)
    },
    // 上传成功
    upLoadSuccess (response, file) {
      if (response.code === 0) {
        this.fileId = response.data.fileId
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
    achieveEndorse (auditType) {
      this.alertConfirm({
        text: '是否确认完成背书',
        okBtn: '确定',
        infoBtn: '取消',
        ok: () => {
          let data = {
            auditType: auditType,
            recordId: this.orderId,
            endorseId: this.fileId
          }
          this.fetch(this.achieveEndorseUrl, 'post', data).then(data => {
            this.$store.dispatch('updateCounters')
            this.goBack()
          }).catch(data => {
            this.$message({
              type: 'error',
              message: data.data.msg
            })
          })
        },
        info: () => {}
      })
    }
  },
  components: {
    Time,
    CutDown,
    ImgUpload,
    ApplyCancelTokenBtn
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
    // padding-top:22px;
  }
  .describe {
    margin-top: 31px;
  }
  .endorse-btn{
    margin-right: 28px;
    width: 160px;
    height: 40px;
    border: none;
    box-shadow: 1px 6px 4px @btn-disabled;
    box-shadow: 1px 6px 4px var(--mainTableHover);
    // background-color: @theme-blue;
    // background-color: var(--mainColor);
  }
  .supplement-endorse {
    width: 100%;
    height:230px;
    background: #fafafa;
    position: relative;
    margin: 17px 0;
    padding-top:10px;
    .upload {
      width: 367px;
      height:210px;
      text-align: center
    }
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
//   .el-button.is-disabled{
//   color:#858585;
//   background-color: @btn-bg-disabeled;
//   border-color: @btn-bg-disabeled;
// }
// .el-button.is-disabled:hover{
//   color: #858585;
//   background-color: @btn-bg-disabeled;
//   border-color: @btn-bg-disabeled;
// }
.btn-container {
  margin-bottom: 30px
}
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
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
