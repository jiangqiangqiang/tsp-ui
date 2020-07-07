<!--
Des: 等待资金方确认企业方背书状态,包含超时状态和未超时状态下企业方和资金方的页面显示
Author: siger
props: {
  orderData: {
    type: Object,
    default: () => {
      return {}
    }
  },
  orderId: {
    type: String,
    default: () => {
      return {}
    }
  }
}
-->

<template>
  <div class="WaitConfirmEndorse">
    <div v-if="role === 'fund'">
      <h4>企业已完成背书,请尽快确认并上传证据</h4>
      <CutDown aheadText="为了确保联合发令业务尽快完成,请在" afterText="内确认签收并上传签收证据" :cutdownms="orderData.expirationTime"></CutDown>
      <div class="endorse-file">
        <div class="endorse-img">
          <img @click="endorseImgShow=true;imgShow=true;" ref="endorseImg" alt="背书证据">
          <div @click="close" class="big-img" v-if="endorseImgShow">
            <img class="img-message-big" v-if="endorseImgShow" :src="endorseImg" alt="签收证据">
          </div>
          <p class="title">背书证据</p>
        </div>
        <div class='upload'>
          <img-upload style="width: 260px" :limit="1" :on-remove="EndorseRemove" :on-success="EndorseAddress"
            :on-error="EndorseFailed" :action="actionUrl">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <img v-else src="~@/assets/img/zjf_qszj.gif" alt="签收证据">
          </img-upload>
          <p class="title">签收证据</p>
        </div>
      </div>
      <div class="btn-container">
        <Button class="confirm-btn" :disabled="!endorseId" @handleClick="confirmToken" title="完成发令"></Button>
        <div style="display: inline-block;width: 25px;"></div>
        <ApplyCancelTokenBtn :orderId="orderId"></ApplyCancelTokenBtn>
      </div>
    </div>
    <div v-if="role === 'enterprise'">
      <h4>请等待资金方确认</h4>
      <div>
        <CutDown v-if="!isOvertime" aheadText="若资金方在" afterText="后未确认,您可通过系统提醒功能,通知资金方尽快处理"
          :cutdownms="orderData.expirationTime"></CutDown>
        <CutDown v-else aheadText="资金方确认操作" showTimeoutText afterText=",您可以选择继续等待,可以取消此次联合发令."
          :cutdownms="orderData.expirationTime"></CutDown>
      </div>
      <div style="padding-top: 15px;">
        <Time v-if="isOvertime" :orderId="orderId" company="资金方" :step="orderData.issueStep"></Time>
        <div v-if="isOvertime" style="display: inline-block;width: 25px;"></div>
        <ApplyCancelTokenBtn :orderId="orderId"></ApplyCancelTokenBtn>
      </div>
    </div>
    <div class="img-layer" v-if="imgShow" @click="close"></div>
    <el-dialog :visible.sync="rejectProjectDialog" center width="528px" top="350px">
      <div class="content">
        <p class="text">是否确认票据已签收, 并完成发令</p>
        <div class="text">点击确认将把此次发令金额全额支付到联合发令方的令账户, 请您务必确认票据已签收</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <Button class="confirm-btn" :disabled="!endorseId" @handleClick="clickButton('Succeed')" title="确认"></Button>
        <Button class="confirm-btn" :disabled="!endorseId" @handleClick="rejectProjectDialog = false"
          title="取消"></Button>
      </div>
    </el-dialog>
    <loading :loadingShow="loadingShow"></loading>
  </div>
</template>

<script>
import Time from '@/components/Time'
import CutDown from '@/components/CutDown'
import ApplyCancelTokenBtn from '@/components/ApplyCancelTokenBtn'
import ImgUpload from '@/components/ImgUpload'
import settings from '@/settings'
export default {
  components: {
    ApplyCancelTokenBtn,
    Time,
    CutDown,
    ImgUpload
  },
  props: {
    orderData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    orderId: {
      type: String,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      role: this.getUserRole(),
      isOvertime: false,
      // 完成发令接口
      confirmTokenUrl: settings.apiGateway.confirmToken,
      // 上传文件接口
      actionUrl: settings.actionUrl,
      // 下载凭证接口
      downloadCodeUrl: settings.apiGateway.downloadCode,
      // 下载接口
      downloadUrl: settings.downloadUrl,
      header: '',
      code: '',
      endorseImg: '',
      imageUrl: '',
      fileId: '',
      endorseId: '',
      endorseImgShow: false,
      imgShow: false,
      rejectProjectDialog: false,
      loadingShow: false
    }
  },
  methods: {
    close () {
      this.imgShow = false
      this.endorseImgShow = false
    },
    // 获取图片 code方法
    getCode (imgId) {
      this.fileId = imgId
      this.fetch(`${this.downloadCodeUrl}/${this.fileId}`).then(data => {
        this.header = data.data.token
        this.code = data.data.code
        this.setImgHeader()
      }).catch(data => {
        this.$message({
          type: 'error',
          message: '获取文件名失败！'
        })
      })
    },
    setImgHeader () {
      this.axios({
        url: this.downloadUrl,
        params: { code: this.code },
        headers: {
          'FileToken': `Bearer ${this.header}`
        },
        responseType: 'blob'
      }).then(data => {
        function blobToDataURL (blob, callback) {
          var a = new FileReader()
          a.onload = function (e) {
            callback(e.target.result)
          }
          a.readAsDataURL(blob)
        }
        blobToDataURL(data.data, (result) => {
          this.$refs.endorseImg.src = result
          this.endorseImg = result
        })
      }).catch(data => {
        this.$message({
          type: 'error',
          message: '获取code失败！'
        })
      })
    },
    // 资金方完成发令
    confirmToken () {
      this.rejectProjectDialog = true
      // this.alertConfirm({
      //   text: '<span style="margin-bottom: -30px">是否确认票据已签收, 并完成发令</br> <p style="margin-top: 20px" >点击确认将把此次发令金额全额支付到联合发令方的令账户, 请您务必确认票据已签收</p></span>',
      //   okBtn: '确定',
      //   infoBtn: '取消',
      //   ok: () => {
      //     this.fetch(this.confirmTokenUrl, 'post', {
      //       auditType: opinion,
      //       endorseId: this.endorseId,
      //       recordId: this.orderId
      //     }).then(data => {
      //       this.goBack()
      //     }).catch(res => {
      //       this.$message.error(res.data.msg)
      //     })
      //   },
      //   info: () => {}
      // })
    },
    clickButton (opinion) {
      this.rejectProjectDialog = false
      this.loadingShow = true
      this.fetch(this.confirmTokenUrl, 'post', {
        auditType: opinion,
        endorseId: this.endorseId,
        recordId: this.orderId
      }).then(data => {
        this.$store.dispatch('updateCounters')
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
      } else {
        this.$message({
          type: 'error',
          message: response.msg
        })
      }
    },
    // 文件删除成功
    EndorseRemove (file, fileList) {
      // this.submitData[file.upLoadType] = ''
    },
    // 上传文件失败触发报错
    EndorseFailed () {
      this.$message({
        type: 'error',
        message: '文件上传失败'
      })
    }
  },
  watch: {
    orderData: {
      immediate: true,
      deep: true,
      handler (newVal) {
        this.isOvertime = newVal.expirationTime <= 0
        if (newVal.fileInfo) {
          // 获取背书证据
          this.getCode(newVal.fileInfo.fileId)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/variables.less';
h4 {
  font-size: 18px;
  font-weight: 600;
  height: 50px;
  line-height: 50px;
  text-align: left;
}
.endorse-file {
  background-color: #fafafa;
  height: 240px;
  width: 100%;
  .upload,
  .endorse-img {
    height: 167px;
    width: 300px;
    margin-top: 20px;
    float: left;
  }
  .endorse-img {
    margin-right: 30px;
    > img {
      width: 300px;
      height: 167px;
      cursor: pointer;
    }
    .big-img {
      width: 1500px;
      height: 1000px;
      display: block;
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      z-index: 1000;
      cursor: pointer;
      text-align: center;
      .img-message-big {
        height: 70%;
        z-index: 1000;
        cursor: pointer;
      }
    }
  }
  .title {
    height: 40px;
    line-height: 40px;
    text-align: center;
  }
}
.btn-container {
  height: 100px;
  padding-top: 20px;
  .confirm-btn {
    width: 160px;
    height: 40px;
    border: none;
    box-shadow: 1px 6px 4px @btn-disabled;
    box-shadow: 1px 6px 4px var(--mainTableHover);
    // background-color: @theme-blue;
    // background-color: var(--mainColor);
  }
}
.img-layer {
  position: fixed;
  cursor: pointer;
  z-index: 999;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.7);
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.content {
  width: 400px;
  margin: 0 auto;
  text-align: center;
  font-size: 16px;
  .text {
    margin-top: 20px;
    line-height: 24px;
  }
}
// .WaitConfirmEndorse/deep/.el-dialog--center .el-dialog__body {
//   padding: 25px 68px 30px
// }
.WaitConfirmEndorse/deep/.el-dialog__footer {
  padding: 10px 20px 49px;
}
.dialog-footer {
  .confirm-btn {
    width: 180px;
    height: 40px;
    // background-color: @theme-blue;
    // background-color: var(--mainColor);
    border: none;
  }
}
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
  border-color: #409eff;
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
  height: 167px;
  display: block;
}
.WaitConfirmEndorse .el-dialog {
  position: absolute;
  top: 50% !important;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  margin-top: 0 !important;
  margin-left: 108px;
}
</style>
