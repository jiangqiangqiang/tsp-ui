
<!--
des: 资金方和企业方处于超时状态下的组件

  props: {
    // 联合发令当前所处的步骤
    type: {
      type: String,
      default: ''
    },
  }
-->

<template>
  <div class="timeOver">
    <div class="description">
      <div>
        <!-- 第二步 -->
        <div v-if="this.userRole ==='fund' && type === 'WaitConfirmSchema'">
          企业确认操作 <svg-icon iconClass='zjf_lhfl_djs' className='img'></svg-icon><span style="color:red">已超时</span> 您可以选择继续等待，也可取消此次发令
        </div>
        <div v-if="this.userRole ==='enterprise' && type === 'WaitConfirmSchema'">
          为了确保联合发令业务尽快完成, 请在<svg-icon iconClass='zjf_lhfl_djs' className='img'></svg-icon><span style="color:red">已超时</span>内确认方案
        </div>
        <!-- 第三步 -->
        <div v-if="this.userRole ==='fund' && type === 'WaitPayment'">
          为了确保联合发令业务尽快完成, 请在<svg-icon iconClass='zjf_lhfl_djs' className='img'></svg-icon><span style="color:red">已超时</span>内完成付款
        </div>
        <div v-if="this.userRole ==='enterprise' && type === 'WaitPayment'">
          资金方付款操作 <svg-icon iconClass='zjf_lhfl_djs' className='img'></svg-icon><span style="color:red">已超时</span> 您可以选择继续等待，也可取消此次联合发令
        </div>
        <!-- 第四步 -->
        <div v-if="this.userRole ==='fund' && type === 'WaitFundCancelConfirm'">
          企业背书操作 <svg-icon iconClass='zjf_lhfl_djs' className='img'></svg-icon><span style="color:red">已超时</span> 您可以选择继续等待，也可向企业申请取消联合发令
        </div>
        <div v-if="this.userRole ==='enterprise' && type === 'WaitFundCancelConfirm'">
          为了确保联合发令业务尽快完成, 请在<svg-icon iconClass='zjf_lhfl_djs' className='img'></svg-icon><span style="color:red">已超时</span>内完成背书并上传证据
          <div class="imgTitke">背书证据</div>
            <div class="uploader">
              <el-upload
                class="avatar-uploader"
                :action="actionUrl"
                :show-file-list="false"
                :on-success="handleEndorseSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="imageUr2" :src="imageUr2" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
        </div>
        <!-- 第五步 -->
        <div v-if="this.userRole ==='fund' && type === 'WaitConfirmEndorse'">
          为了确保联合发令业务尽快完成, 请在<svg-icon iconClass='zjf_lhfl_djs' className='img'></svg-icon><span style="color:red">已超时</span>内确认签收并上传签收证据
          <div style="height: 130px; margin-top: 20px">
            <div class="imgTitke">背书证据</div>
            <div class="imgShow"></div>
            <div class="imgTitke">签收证据</div>
            <div class="uploader">
              <el-upload
                class="avatar-uploader"
                :action="actionUrl"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </div>
        </div>
        <div v-if="this.userRole ==='enterprise' && type === 'WaitConfirmEndorse'">
          资金方确认操作 <svg-icon iconClass='zjf_lhfl_djs' className='img'></svg-icon><span style="color:red">已超时</span> 您可以选择继续等待，也可取消此次联合发令
        </div>
      </div>
    </div>
    <div class="operation">
      <div>
        <!-- 第二步 -->
        <el-button type="primary" class="btn" v-if="this.userRole ==='fund' && type === 'WaitConfirmSchema'" @click="handleRemind" :disabled="disabled">提醒{{countDown}}</el-button>
        <!-- 第三步 -->
        <el-button type="primary" class="btnPay" v-if="this.userRole ==='fund' && type === 'WaitPayment'" @click="handlePayment">付款</el-button>
        <el-button type="primary" class="btn" v-if="this.userRole ==='enterprise' && type === 'WaitPayment'" @click="enterpriseRemind">提醒{{countDown}}</el-button>
        <!-- 第四步 -->
        <el-button type="primary" class="btn" v-if="this.userRole ==='fund' && type === 'WaitFundCancelConfirm'" @click="handleRemind">提醒{{countDown}}</el-button>
        <el-button type="primary" class="btnPay" v-if="this.userRole ==='enterprise' && type === 'WaitFundCancelConfirm'" @click="handleEndorsement">完成背书</el-button>
        <!-- 第五步 -->
        <el-button type="primary" class="btnPay" v-if="this.userRole ==='fund' && type === 'WaitConfirmEndorse'" @click="achieveJointToken">完成发令</el-button>
        <el-button type="primary" class="btn" v-if="this.userRole ==='enterprise' && type === 'WaitConfirmEndorse'" @click="enterpriseRemind">提醒{{countDown}}</el-button>
        <span class="cancel-joint-token" v-if="this.userRole !== 'enterprise' || this.type !== 'WaitConfirmSchema'" @click="cancelJointToken">申请取消联合发令</span>
      </div>
      <div v-if="this.userRole ==='enterprise' &&  type === 'WaitConfirmSchema'">
        <el-button type="primary" class="receiveBtn" @click="receiveProject">接收方案</el-button>
        <el-button class="rejectBtn"  @click="rejectProject">拒绝方案</el-button>
      </div>
    </div>
    <div class="dialog">
      <el-dialog
      :visible.sync="dialogVisible"
      center
      width="576px"
      top="350px"
      >
      <p style="text-align:center;font-size: 16px" v-if="this.userRole ==='fund'">是否确认向企业方申请取消此次联合发令</p>
      <p style="text-align:center;font-size: 16px" v-if="this.userRole ==='enterprise'">是否确认向资金方申请取消此次联合发令</p>
      <div class="content">
      <el-form>
        <el-form-item label="取消原因">
          <el-input type="textarea" v-model="cancelReason" class="reason"></el-input>
        </el-form-item>
      </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="confirm-btn" type="primary" >确认</el-button>
        <el-button @click="dialogVisible = false" type="primary" class="confirm-btn">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="rejectProjectDialog"
      center
      width="576px"
      top="350px"
      >
      <p style="text-align:center;font-size: 16px">是否拒绝该联合发令方案</p>
      <div class="content">
      <el-form>
        <el-form-item label="拒绝原因">
          <el-input type="textarea" v-model="rejectReason" class="reason"></el-input>
        </el-form-item>
      </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="confirm-btn" type="primary" >确认</el-button>
        <el-button @click="rejectProjectDialog = false" type="primary" class="confirm-btn">取 消</el-button>
      </div>
    </el-dialog>
    </div>
  </div>
</template>

<script>
import settings from '@/settings'
import CommonUpload from '@/components/CommonUpload'
import { Setitem, Getitem, Removeitem } from '@/services/CommonService'
export default {
  components: { CommonUpload },
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      countDown: '',
      // type: 'WaitConfirmEndorse',
      // 取消原因
      cancelReason: '',
      // 拒绝方案原因
      rejectReason: '',
      // 上传文件接口
      actionUrl: settings.actionUrl,
      // 取消联合发令弹窗
      dialogVisible: false,
      // 企业方拒绝方案弹窗
      rejectProjectDialog: false,
      // 提醒倒计时时间
      codeTime: '',
      imageUrl: '',
      imageUr2: ''
    }
  },
  methods: {
    // 申请取消发令
    cancelJointToken () {
      this.dialogVisible = true
    },
    // 资金方超时提醒
    handleRemind () {
      this.popUpSuccess({
        text: '提醒成功',
        text2: '已发送提醒至企业方, 请您耐心等待',
        okBtn: '确定',
        ok: () => {
          this.codeCountDown()
        }
      })
    },
    codeCountDown () {
      let msRes = ''
      let endMsRes = Getitem('endMsRes')
      if (endMsRes === null) {
        msRes = 30
      } else {
        msRes = endMsRes
      }
      let timer = setInterval(() => {
        if (msRes > 0) {
          var s = (msRes % 60) < 10 ? ('0' + parseInt(msRes % 60)) : parseInt(msRes % 60)
          var h = msRes / 3600 < 10 ? ('0' + parseInt(msRes / 3600)) : parseInt(msRes / 3600)
          var m = (msRes - h * 3600) / 60 < 10 ? ('0' + parseInt((msRes - h * 3600) / 60)) : parseInt((msRes - h * 3600) / 60)
          var msg = m + ':' + s
          this.countDown = msg
          --msRes
          Setitem('endMsRes', msRes)
        }
        if (msRes <= 0) {
          clearInterval(timer)
          this.countDown = ''
          Removeitem('endMsRes')
        }
      }, 1000)
    },
    // 企业方超时提醒
    enterpriseRemind () {
      this.popUpSuccess({
        text: '提醒成功',
        text2: '已发送提醒至资金方, 请您耐心等待',
        okBtn: '确定',
        ok: () => {
          this.codeCountDown()
        }
      })
    },
    // 完成背书
    handleEndorsement () {
      this.alertConfirm({
        text: '确认完成背书',
        okBtn: '确定',
        infoBtn: '取消',
        ok: () => {
          // this.goBack()
        },
        info: () => {}
      })
    },
    // 资金方付款
    handlePayment () {
      this.alertSuccess({
        text: '付款完成之前请不要关闭此窗口, 请在弹出的页面完成付款',
        li1: '如果付款成功, 请点击 "付款完成" 按钮',
        li2: '如果付款失败, 请点击 "付款失败" 按钮',
        li3: '点击后, 系统将自动跳转至业务相关页面',
        okBtn: '付款完成',
        infoBtn: '付款失败',
        ok: () => {
          this.$router.push('/fund/fund-payment-success')
        },
        info: () => {}
      })
    },
    // 完成发令
    achieveJointToken () {
      this.alertSuccess({
        text: '是否确认票据已签收,并完成发令',
        li1: '点击确认将把此次发令金额全额支付到联合发令方的令账户',
        li2: '请您务必确认票据已签收',
        li3: '',
        okBtn: '确认',
        infoBtn: '取消',
        ok: () => {
          this.$router.push('/fund/joint-token-list')
        },
        info: () => {}
      })
    },
    // 接收方案
    receiveProject () {
      this.alertConfirm({
        text: '是否确认接收联合发令的方案',
        okBtn: '确定',
        infoBtn: '取消',
        ok: () => {
          // this.goBack()
        },
        info: () => {}
      })
    },
    // 拒绝方案
    rejectProject () {
      this.rejectProjectDialog = true
    },
    // 上传签收证据
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    // 上传背书证据
    handleEndorseSuccess (res, file) {
      this.imageUr2 = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      return isJPG
    }
  },
  created () {
    this.userRole = this.getUserRole()
    var msRes = Getitem('endMsRes')
    if (msRes !== null) {
      this.codeCountDown()
    }
  },
  computed: {
    disabled () {
      if (this.countDown === '') {
        return false
      } else {
        return true
      }
    }
  }
}
</script>

<style lang="less" scoped>
  @import "~@/assets/less/variables";
.title{
  padding-top: 44px;
  font-size: 18px;
  font-weight: 600
}
.description {
  margin-top: 28px;
  .img {
    display: inline-block;
    width: 16px!important;
    height:16px!important;
    vertical-align: middle;
    margin: 0 10px;
    margin-bottom: -3px;
    // background-image: url('~@/assets/img/zjf_lhfl_djs.png')
  }
}
.operation {
  margin-top: 20px;
  .btn {
    width: 162px;
    height: 44px;
    margin-right: 10px;
    font-size: 18px;
    background-color: @theme-statebtn-blue;
    background-color: var(--mainStateBtn);
    border-color: @theme-statebtn-blue;
    border-color: var(--mainStateBtn);
  }
  .cancel-joint-token {
    margin-left: 30px;
    cursor: pointer;
    text-decoration: underline;
    color: @theme-blue;
    color: var(--mainColor)
  }
  .btnPay {
    width: 162px;
    height: 44px;
    margin-right: 10px;
    font-size: 18px;
    background-color: @theme-blue;
    background-color: var(--mainColor);
    border-color: @theme-blue;
    border-color: var(--mainColor);
  }
  .receiveBtn {
    width: 162px;
    height: 44px;
    margin-right: 10px;
    font-size: 18px;
    background-color: @theme-blue;
    background-color: var(--mainColor);
    border-color: @theme-blue;
    border-color: var(--mainColor);
  }
  .rejectBtn {
    width: 162px;
    height: 44px;
    margin-right: 10px;
    font-size: 18px;
  }
}
.init-img-main {
  position: relative;
  height: 163px;
  width: 300px;
}
.init-img {
  height: 163px;
  width: 290px;
}
.init-img--close {
  position: absolute;
  top: 0;
  right: 0;
  color: #303133;
  cursor: pointer;
}
.init-img--close:hover {
  color: @theme-blue;
  color: var(--mainColor);
}

.content {
  margin: 40px 0 0 70px;
  .reason {
  // margin:30px 0 0 30px;
  width: 300px;
  height: 53px
  }
}
.confirm-btn {
  width: 150px;
  height:40px;
  background-color: @theme-blue;
  background-color: var(--mainColor);
  border: none;
}
.imgTitke {
  float: left;
}
.imgShow {
  float: left;
  width: 100px;
  height: 100px;
  margin: 0 30px 0 20px;
  border: 1px solid #e5e5e5
}
.uploader {
  float: left;
  margin-left: 20px
}
</style>

<style>
.timeOver .el-dialog__wrapper .el-dialog {
  height: 300px;
}
.timeOver .el-dialog--center .el-dialog__body {
  padding-bottom: 0
}
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
    width: 100px;
    height: 100px;
    display: block;
  }
  .timeOver .dialog .el-dialog{
    position: absolute;
    top: 50% !important;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    margin-top: 0 !important;
    margin-left: 108px;
  }
</style>
