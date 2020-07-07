<!--
  企业详情组件
  由于获取企业信息成为公共接口,四个角色都要用到接口获取数据的过程也放到组件内部
  现在需要父组件传入配置title 和是否可以修改管理员手机号等部分差异
-->
<template>
  <div>
    <div class="approve-passed" v-if="adminAuditStatus === 'Succeed'">
      <div>处理状态: <i class="el-icon-success passed-icon"></i>已通过</div>
    </div>
    <div class="approve-rejected" v-if="adminAuditStatus === 'Rejected'">
      <div>处理状态: <i class="el-icon-success passed-icon"></i>已拒绝</div>
      <div>拒绝原因: <span>{{refusalReason}}</span></div>
    </div>
    <div class="approve-passed" v-if="adminAuditStatus === 'PspPending'">
      <div>处理状态: 等待开户</div>
    </div>
    <div class="approve-rejected" v-if="adminAuditStatus === 'OpenFailed'">
      <div>处理状态: <i class="el-icon-success passed-icon"></i>开户失败</div>
      <div>失败原因: <span>{{refusalReason}}</span></div>
    </div>
    <EnterpriseDetail :showTitle="false" :Id="Number($route.query.id)" :isAudit="true" @statusData="statusData">
    </EnterpriseDetail>
  </div>
</template>

<script>
import settings from '@/settings'
import EnterpriseDetail from '@/components/EnterpriseDetail'
export default {
  name: 'enterpriseDetail',
  props: {
    // title是否显示返回按钮
    isShowBack: {
      type: Boolean,
      default: false
    },
    // title文案
    title: {
      type: String,
      default: '企业信息'
    },
    // 列表序号查询企业信息使用,查询自己不用传
    Id: {
      type: Number,
      default: 1
    },
    // 企业查询角色
    sysRoles: {
      type: String,
      default: ''
    },
    // 用户标签
    tag: {
      type: String,
      default: ''
    },
    // 用户标签背景颜色
    tagColor: {
      type: String,
      default: '#22b9aa'
    },
    userId: {
      type: String,
      default: ''
    },
    isAudit: {
      type: Boolean,
      default: false
    },
    systemRole: {
      type: String,
      default: ''
    }
  },
  components: {
    EnterpriseDetail
  },
  data () {
    return {
      toolbar: false,
      closeImg: '',
      imgBigshow: [false],
      imgShow: false,
      // 管理员信息
      managerInfoData: {
        // 管理员手机号码
        userName: null,
        // 管理员姓名
        realName: null,
        // 管理员身份证号码
        idNumber: null,
        // 管理员邮箱
        email: null,
        // 注册日期
        registerTime: ''
      },
      // 企业信息
      enterpriseInfoData: {
        // 企业名称
        name: '',
        // 企业注册资本
        registeredCapital: null,
        // 企业注册地
        registeredAddress: null,
        // 企业法人姓名
        legalPersonName: null,
        // 企业法人身份证号码
        legalPersonIdNumber: null,
        // 企业统一社会信用代码
        creditCode: '',
        // 企业类型
        enterpriseType: '',
        // 企业营业执照图片地址
        businessLicenceAddress: {
          name: '',
          fileId: ''
        },
        // 企业注册协议地址
        registrationAgreementAddress: {
          name: '',
          fileId: ''
        },
        // 企业法人身份证正面图片地址
        legalPersonIdFrontAddress: {
          name: '',
          fileId: ''
        },
        // 企业法人身份证背面图片地址
        legalPersonIdBackAddress: {
          name: '',
          fileId: ''
        }
      },
      // 审核拒绝原因
      refusalReason: '',
      // 审核状态
      adminAuditStatus: '',
      // 验证码信息
      codeInfo: {
        // 第一个弹框验证码信息
        oldCsrfCode: '',
        // 第二个弹框验证码信息
        newCsrfCode: ''
      },
      // 下载凭证接口
      downloadCodeUrl: settings.apiGateway.downloadCode,
      // 下载接口
      downloadUrl: settings.downloadUrl,
      // 下载文件的名称
      fileId: '',
      // 头部信息
      Header: '',
      // 返回的code
      code: '',
      // 文件名
      fileName: '',
      // 进度
      precent: 0,
      // 弹窗
      dialogVisible: false,
      // dialog title
      dialogTitle: '准备下载',
      // 身份证正面绑定的 ref
      legalPersonIdFront: '',
      // 身份证背面绑定的 ref
      legalPersonIdBack: null,
      // 企业营业执照的 ref
      businessLicence: null,
      // 企业名称过长 超出隐藏 鼠标划过显示
      longName: false,
      // 账户信息 Url
      getAccountInfoUrl: settings.apiGateway.getAccountInfo,
      // 获取企业审核信息详情
      auditEnterpriseDetailUrl: settings.apiGateway.auditEnterpriseDetail
    }
  },
  created () {
    // this.getAuditEnterpriseDetail()
    this.userRole = this.getUserRole()
  },
  methods: {
    statusData (statusData) {
      this.adminAuditStatus = statusData.adminAuditStatus
      this.refusalReason = statusData.refusalReason
      this.$emit('statusData', statusData)
    },
    // 获取图片 code方法
    getCode (imgId, type) {
      this.fileId = imgId
      this.fetch(`${this.downloadCodeUrl}/${this.fileId}`).then(data => {
        this.Header = data.data.token
        this.code = data.data.code
        this.setImgHeader(type)
      }).catch(data => {
        this.$message({
          type: 'error',
          message: '获取文件名失败！'
        })
      })
    },
    setImgHeader (nameImg) {
      this.axios({
        url: this.downloadUrl,
        params: { code: this.code },
        headers: {
          'FileToken': `Bearer ${this.Header}`
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
          if (nameImg === 'legalPersonIdFront') {
            // this.$refs.legalPersonIdFront.src = result
            this.legalPersonIdFront = result
          } else if (nameImg === 'legalPersonIdBack') {
            // this.$refs.legalPersonIdBack.src = result
            this.legalPersonIdBack = result
          } else if (nameImg === 'businessLicence') {
            // this.$refs.businessLicence.src = result
            this.businessLicence = result
          }
        })
      }).catch(data => {
        this.$message({
          type: 'error',
          message: '获取code失败！'
        })
      })
    },
    // 法人身份证正面
    getLegalPersonIdFront () {
      this.fileId = this.enterpriseInfoData.legalPersonIdFrontAddress.fileId
      this.getCode(this.fileId, 'legalPersonIdFront')
    },
    // 法人身份证反面
    getLegalPersonIdBack () {
      this.fileId = this.enterpriseInfoData.legalPersonIdBackAddress.fileId
      this.getCode(this.fileId, 'legalPersonIdBack')
    },
    // 营业执照
    getBusinessLicence () {
      this.fileId = this.enterpriseInfoData.businessLicenceAddress.fileId
      this.getCode(this.fileId, 'businessLicence')
    },
    getAuditEnterpriseDetail () {
      this.fetch(`${this.auditEnterpriseDetailUrl}${this.Id}`).then(data => {
        this.managerInfoData = data.data.adminAuthDetail
        this.enterpriseInfoData = data.data.enterpriseAuthDetail
        this.adminAuditStatus = data.data.adminAuditStatus
        this.refusalReason = data.data.refusalReason
        if (this.enterpriseInfoData.name.length > 13) {
          this.longName = true
        }
        // 获取法人身份证正面code
        this.getLegalPersonIdFront()
        // 获取法人身份证背面code
        this.getLegalPersonIdBack()
        // 获取营业执照code
        this.getBusinessLicence()
      }).catch(data => {
        this.$message.error(data.data.msg)
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/variables';
.approve-passed {
  // width: 846px;
  height: 42px;
  line-height: 42px;
  padding-left: 34px;
  margin: 0 auto;
  margin-top: 33px;
  border: 1px solid #e6e6e6;
  background-color: @theme-blue-light;
  background-color: var(--mainLightColor);
  .passed-icon {
    color: #8acd3f;
    width: 22px;
    height: 22px;
  }
}
.approve-rejected {
  // width: 846px;
  height: 66px;
  line-height: 33px;
  padding-left: 34px;
  margin: 0 auto;
  margin-top: 33px;
  border: 1px solid #e6e6e6;
  background-color: @theme-blue-light;
  background-color: var(--mainLightColor);
  .passed-icon {
    color: #ec5053;
    width: 22px;
    height: 22px;
  }
}
.basic-info-main {
  // width: 880px;
  // height: 625px;
  margin: 0 auto;
  margin-top: 34px;
  // border: 1px solid #e6e6e6;
  .basic-info-content {
    .authentification {
      width: 100%;
      height: 42px;
      line-height: 42px;
      // background: #e5e5e5;
      text-align: center;
    }
    .title__top {
      font-weight: 600;
    }
    .message {
      border-left: 1px solid #e6e6e6;
      _height: 383px;
      li {
        float: left;
        width: 155px;
        height: 42px;
        line-height: 42px;
        border-bottom: 1px solid #e6e6e6;
        border-right: 1px solid #e6e6e6;
        &:nth-of-type(2n + 1) {
          text-align: center;
          background: #fcfcfc;
        }
        &:nth-of-type(2n) {
          padding-left: 16px;
          width: 266px;
        }
      }
      .admin-imgs {
        min-height: 183px;
        height: 183px;
      }
      .long-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .no-right--border {
        border-right: 0;
      }
    }
    .admin-attestation {
      overflow-y: auto;
      .el-button {
        border: none;
        background-color: @theme-blue;
        background-color: var(--mainColor);
        color: #ffffff;
      }
    }
    .company-attestation {
      //min-height: 500px;
      height: 600px;
      .img-message {
        width: 100%;
        height: 100%;
        transform: scale(1);
        transition: all ease 0.5s;
        cursor: pointer;
      }
      .download {
        cursor: pointer;
        color: #118eea;
        text-decoration: underline;
      }
    }
    .img-box {
      width: 438px;
      height: 239px;
      float: left;
      .img-title {
        width: 100%;
        height: 41px;
        line-height: 41px;
        text-align: center;
        color: #656565;
        font-size: 14px;
        border-bottom: 1px solid #e6e6e6;
      }
      .imgs {
        float: left;
        height: 147px;
        width: 198px;
        margin-top: 23px;
        cursor: pointer;
        .image {
          margin-left: 23px;
          width: 175px;
          height: 111px;
          border: 3px solid #f5f5f5;
          cursor: pointer;
        }
      }
      .businessLicence-img {
        width: 175px;
        height: 111px;
        margin: 0 auto;
        margin-top: 23px;
        .image {
          width: 175px;
          height: 111px;
          border: 3px solid #f5f5f5;
          cursor: pointer;
        }
      }
      .img-name {
        padding-top: 15px;
        text-align: center;
        height: 14px;
        line-height: 14px;
        cursor: pointer;
        overflow: hidden; //超出的文本隐藏
        text-overflow: ellipsis; //溢出用省略号显示
        white-space: nowrap; //溢出不换行
      }
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
}
</style>

<style>
.basic-info-content .el-input__inner {
  height: 45px;
  line-height: 14px;
  padding-top: 12px;
  padding-bottom: 12px;
  /* line-height: 45px; */
}
.basic-info-content .el-form-item {
  margin-bottom: 0;
}
.basic-info-content .el-dialog .el-dialog__title {
  line-height: 0;
}
.basic-info-content .el-dialog__header {
  padding: 56px 20px 0;
}
.basic-info-content .el-dialog__wrapper .el-dialog {
  height: 387px;
}
</style>
