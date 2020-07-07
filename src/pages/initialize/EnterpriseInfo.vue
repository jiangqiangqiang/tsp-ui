<template>
  <div>
    <Header></Header>
    <div
      v-loading="loadingShow"
      element-loading-text=""
      element-loading-spinner="el-icon-loading"
     >
    <div class="enterprise-info-main">
      <InitializeHeader :stepInfo="stepInfo"></InitializeHeader>
      <div class="content">
        <el-form label-width="170px" label-paddingRight="80px" :model="submitData" class="enterprise-form">
          <el-form-item label="企业名称" >
            <el-input v-model="enterpriseInfo.name" placeholder="请输入企业名称" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="统一社会信用代码" :rules="{ required: true}">
            <el-input v-model="enterpriseInfo.creditCode" placeholder="请输入统一社会信用代码" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="企业法人姓名" :rules="{ required: true}">
            <el-input v-model="submitData.legalPersonName" placeholder="请输入企业法人姓名" @blur="verifyAdminName"></el-input>
                <div v-if="errorWarning.adminNameError" class="error-warning">
                    <i class="el-icon-warning error-icon-warning"></i>
                    <span class="login-error">姓名输入有误</span>
                </div>
          </el-form-item>
          <el-form-item label="企业法人身份证号码" :rules="{ required: true}">
            <el-input v-model="submitData.legalPersonIdNumber" placeholder="请输入企业法人身份证号码" @blur="verifyIdNum"></el-input>
              <div v-if="errorWarning.legalPersonIdNumberError" class="error-warning">
                <i class="el-icon-warning error-icon-warning"></i>
                <span class="login-error">身份证有误</span>
              </div>
          </el-form-item>
          <el-form-item label="企业法人身份证扫描件" :rules="{ required: true}">
            <span v-if="format" class="error-img"><i class="el-icon-warning"></i> 图片大小不能超过5M</span>
            <span class="upload-format" v-if="hintFrontShow">（仅支持.jpg .jpeg .png .bmp,文件大小不能大于5M）</span>
            <div class="init-img-main" v-if="initUpload1">
              <img class="init-img" ref="legalPersonIdFront" alt="法人身份证正面">
              <a class="init-img--close" @click="closeInitImg('initUpload1', 'legalPersonIdFrontAddress')">X</a>
            </div>
            <common-upload
              v-else
              style="width: 400px; margin-top: 15px;"
              :limit="1"
              :on-remove="loanApplyFormRemove"
              :on-success="legalPersonIdFrontAddress"
              :on-error="loanApplyFormFrontUploadFailed"
              :action="actionUrl"
              :canHidden="canHidden"
              list-type="picture">
              <img @click="upLoadClick(1)" src="~@/assets/img/ID-card-front.gif" alt="正面" style="margin-right: 140px">
              <p class="upload-title">企业法人身份证照片-正面 <span class="upload-sample" @click.stop="frontExamineSample">查看样例</span></p>
            </common-upload>
          </el-form-item>
          <el-form-item label="">
            <span v-if="reversFormat" class="error-reversFormat"><i class="el-icon-warning"></i> 图片大小不能超过5M</span>
            <span class="upload-reversformat" v-if="hintBackShow">（仅支持.jpg .jpeg .png .bmp,文件大小不能大于5M）</span>
            <div class="init-img-main" v-if="initUpload2">
              <img class="init-img" ref="legalPersonIdBack" alt="法人身份证背面">
              <a class="init-img--close" @click="closeInitImg('initUpload2', 'legalPersonIdBackAddress')">X</a>
            </div>
            <common-upload
              v-else
              style="width: 400px;"
              :limit="1"
              :on-remove="loanApplyFormRemove"
              :on-success="legalPersonIdBackAddress"
              :on-error="loanApplyFormUploadFailed"
              :action="actionUrl"
              :canHidden="canHidden"
              list-type="picture">
              <img src="~@/assets/img/ID-card-back.gif" alt="反面" style="margin-right: 140px">
              <p class="upload-title">企业法人身份证照片-反面 <span class="upload-sample" @click.stop="reverseExamineSample">查看样例</span></p>
            </common-upload>
          </el-form-item>
          <el-form-item label="企业类型" :rules="{ required: true}">
            <el-select v-model="companyType" placeholder="请选择" style="width:400px">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="企业注册地" :rules="{ required: true}">
            <el-input v-model="submitData.registeredAddress" placeholder="请输入企业注册地"></el-input>
          </el-form-item>
          <el-form-item label="企业客服电话" :rules="{ required: true}">
            <el-input maxlength="20" v-model="submitData.landLinePhone" placeholder="请输入有效联系电话" @blur="checkRegisteredPhone"></el-input>
              <div v-if="errorWarning.registeredPhoneError" class="error-warning">
                <i class="el-icon-warning error-icon-warning"></i>
                <span class="login-error">企业客服电话不能为空且小于20位</span>
              </div>
            <span style="margin-left:5px" class="hint">
              <el-tooltip class="item" :content=content placement="right">
                <span><i class="el-icon-question"></i></span>
              </el-tooltip>
            </span>
          </el-form-item>
          <el-form-item label="企业注册资本" :rules="{ required: true}">
            <el-input maxlength="26" v-model="submitData.registeredCapital" placeholder="请输入企业注册资本" @blur="checkRegisteredCapital"></el-input>
            <span class="unit-price">万元</span>
              <div v-if="errorWarning.registeredCapitalError" class="error-warning">
                <i class="el-icon-warning error-icon-warning"></i>
                <span class="login-error">数值必须为20位以内的整数或6位以内的小数</span>
              </div>
          </el-form-item>
          <el-form-item label="企业营业执照扫描件" :rules="{ required: true}">
            <span v-if="LicenceFormat" class="error-LicenceFormat"><i class="el-icon-warning"></i> 图片大小不能超过5M</span>
            <p class="upload-title" style="font-size: 12px;margin-top:8px;width:406px;" @click.stop="show1">企业营业执照扫描件（仅支持.jpg .jpeg .png .bmp,文件大小不能大于5M）</p>
            <div class="init-img-main" v-if="initUpload3">
              <img class="init-img" ref="businessLicence" alt="企业营业执照扫描件">
              <a class="init-img--close" @click="closeInitImg('initUpload3', 'businessLicenceAddress')">X</a>
            </div>
            <common-upload
              v-else
              style="width: 400px; margin-top: 15px;"
              :limit="1"
              :on-remove="loanApplyFormRemove"
              :on-success="businessLicenceAddress"
              :on-error="loanApplyFormLicenceUploadFailed"
              :action="actionUrl"
              :canHidden="canHidden"
              list-type="picture">
              <img src="~@/assets/img/business-license.gif" alt="企业营业执照" style="margin-right: 140px">
            </common-upload>
          </el-form-item>
          <Button :disabled="enterpriseActive" class="enterprise-info-button" @handleClick="goNext" title="下一步"></Button>
        </el-form>
      </div>
    </div>
    <AuthFailedPopUp :showTip="showTip" titleText="企业认证失败" :htmlText="htmlText" @confirm="closePopUp"></AuthFailedPopUp>
    </div>
    <div class="enterprise-info-sample">
      <el-dialog
        :visible.sync="frontSample"
        center
        width="568px"
        title="身份证照片正面样例"
        >
        <p style="text-align:center;font-size: 16px;margin-top:13px">请保持图片角度正确 , 身份证号码清晰无遮挡 , 如下图</p>
        <div class="sample-img">
          <img src="~@/assets/img/yl_z.gif" alt="">
        </div>
        <div slot="footer" class="dialog-footer">
          <Button class="confirm-btn" title="确定" @handleClick="frontSample = false"></Button>
        </div>
      </el-dialog>
      <el-dialog
        :visible.sync="reverseSample"
        center
        width="568px"
        title="身份证照片反面样例"
        >
        <p style="text-align:center;font-size: 16px;margin-top:13px">请保持图片角度正确 , 身份证号码清晰无遮挡 , 如下图</p>
        <div class="sample-img">
          <img src="~@/assets/img/yl_b.gif" alt="">
        </div>
        <div slot="footer" class="dialog-footer">
          <Button class="confirm-btn" title="确定" @handleClick="reverseSample = false"></Button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import settings from '@/settings'
import Header from '@/components/Header'
import InitializeHeader from '@/components/InitializeHeader'
import CommonUpload from '@/components/CommonUpload'
import AuthFailedPopUp from '@/components/AuthFailedPopUp'
import { Removeitem, Setitem, Getitem } from '@/services/CommonService'
export default {
  name: 'enterpriseinfo',
  components: { Header, InitializeHeader, CommonUpload, AuthFailedPopUp },
  data () {
    return {
      // 步骤
      stepInfo: {
        list: ['管理员认证', '企业认证', '账号初始化', '初始化完成'],
        step: 2
      },
      next: '',
      downloadCodeUrl: settings.apiGateway.downloadCode,
      // 下载接口
      downloadUrl: settings.downloadUrl,
      header: '',
      // 是否显示默认图片
      initUpload1: false,
      initUpload2: false,
      initUpload3: false,
      loadingShow: false,
      // 是否显示上传错误提示
      format: false,
      reversFormat: false,
      LicenceFormat: false,
      // 提示是否显示
      hintFrontShow: true,
      hintBackShow: true,
      // 企业名和信用代码信息
      enterpriseInfo: {
        // 企业名称
        name: '',
        // 社会统一信用代码
        creditCode: ''
      },
      // 企业信息
      submitData: {
        // 企业法人姓名
        legalPersonName: '',
        // 企业法人身份证号码
        legalPersonIdNumber: '',
        // 企业法人身份证正面图片地址
        legalPersonIdFrontAddress: '',
        // 企业法人身份证背面图片地址
        legalPersonIdBackAddress: '',
        // 企业类型
        enterpriseType: '',
        // 企业注册地
        registeredAddress: '',
        // 企业注册资本
        registeredCapital: '',
        // 企业营业执照图片地址
        businessLicenceAddress: '',
        // 企业联系电话
        landLinePhone: ''
      },
      // 错误提示
      errorWarning: {
        legalPersonIdNumberError: false,
        registeredCapitalError: false,
        registeredPhoneError: false,
        adminNameError: false
      },
      companyType: '',
      // 公司列表
      options: [{ value: '有限责任公司' }, { value: '股份有限公司' }],
      // 上传类型
      upLoadType: '',
      // 获取企业信息 企业名和信用代码
      getEnterpriseUrl: settings.apiGateway.getEnterprise,
      // 企业信息初始化 Url
      enterpriseInfoUrl: settings.apiGateway.enterpriseInfo,
      // 上传文件接口
      actionUrl: settings.actionUrl,
      // 上传凭证接口
      getUploadCode: settings.apiGateway.getUploadCode,
      // 企业四要素认证
      authEnterpriseUrl: settings.apiGateway.authEnterprise,
      // 企业初始化信息用于重新修改提交
      getEnterpriseInitInfoUrl: settings.apiGateway.getEnterpriseInitInfo,
      // 是否允许隐藏上传按钮
      canHidden: false,
      // 显示企业认证失败的标志
      showTip: false,
      // 身份证正面照样例
      frontSample: false,
      // 身份证反面照样例
      reverseSample: false,
      // 企业认证失败提示文案
      htmlText: `<p style="height:30px;line-height:30px;">请确保企业名称、统一社会信用代码、企业法人姓名</p><p style="height:30px;line-height:30px;">及企业法人身份证号码与工商注册信息一致</p>`,
      content: '为了让企业客户更方便的联系到您, 请认真填写该信息'
    }
  },
  beforeRouteEnter (to, from, next) {
    let perfectState = parseInt(Getitem('perfectState'))
    next(vm => {
      // 通过 `vm` 访问组件实例
      if (perfectState < 4) {
        let nextPath = vm.$store.state.initializationStepRoute[perfectState - 1]
        vm.$router.push(nextPath)
      } else {
        vm.$router.push(from.fullPath)
      }
    })
  },
  beforeRouteLeave (to, from, next) {
    if (to.path === '/account-num') {
      next()
    } else if (to.path === '/admin-info') {
      next()
    } else if (to.path === '/login') {
      Removeitem('token')
      Removeitem('userData')
      Removeitem('perfectState')
      Removeitem('topName')
      Removeitem('enterpriseName')
      // 移除本地存储中是否显示浏览器版本的提示
      Removeitem('browserLowTip')
      Removeitem('store')
      sessionStorage.removeItem('browserLowTip')
      next()
    } else {
      let perfectState = parseInt(Getitem('perfectState'))
      if (perfectState > 3) {
        next()
      } else {
        next(false)
      }
    }
  },
  created () {
    this.getenterpriseInfo()
    if (this.$route.query.userId) {
      this.getEnterpriseInitInfo()
      this.initUpload1 = true
      this.initUpload2 = true
      this.initUpload3 = true
    }
  },
  methods: {
    show1 () {},
    frontExamineSample () {
      this.frontSample = true
    },
    reverseExamineSample () {
      this.reverseSample = true
    },
    // 检测管理员姓名
    verifyAdminName () {
      let NameReg = /^[\u4E00-\u9FA5]{2,20}$/
      if (!NameReg.test(this.submitData.legalPersonName)) {
        this.errorWarning.adminNameError = true
        // setTimeout(() => {
        //   this.errorWarning.adminNameError = false
        // }, 2000)
        return true
      } else {
        this.errorWarning.adminNameError = false
      }
    },
    // 验证身份证号码
    verifyIdNum () {
      let idCard = this.IDReg
      if (!idCard.test(this.submitData.legalPersonIdNumber)) {
        this.errorWarning.legalPersonIdNumberError = true
        // setTimeout(() => {
        //   this.errorWarning.legalPersonIdNumberError = false
        // }, 2000)
      } else {
        this.errorWarning.legalPersonIdNumberError = false
      }
    },
    // 验证联系电话
    checkRegisteredPhone () {
      // let RegisteredPhone = /^((0\d{2,3}-\d{7,8})|(1[3,5,7,8]\d{9}))$/
      // if (!RegisteredPhone.test(this.submitData.landLinePhone)) {
      //   this.errorWarning.registeredPhoneError = true
      //   setTimeout(() => {
      //     this.errorWarning.registeredPhoneError = false
      //   }, 2000)
      // }
      if (!this.submitData.landLinePhone || this.submitData.landLinePhone.length > 20) {
        this.errorWarning.registeredPhoneError = true
        // setTimeout(() => {
        //   this.errorWarning.registeredPhoneError = false
        // }, 2000)
        return true
      } else {
        this.errorWarning.registeredPhoneError = false
      }
    },
    // 检测注册资本
    checkRegisteredCapital () {
      this.submitData.registeredCapital = parseFloat(this.submitData.registeredCapital)
      let registeredCapitalReg = /^\d{1,20}(\.\d{1,6})?$/
      if (!registeredCapitalReg.test(this.submitData.registeredCapital)) {
        this.errorWarning.registeredCapitalError = true
        // setTimeout(() => {
        //   this.errorWarning.registeredCapitalError = false
        // }, 2000)
      } else {
        this.errorWarning.registeredCapitalError = false
      }
    },
    // 获取企业名称和信用代码
    getenterpriseInfo () {
      this.fetch(this.getEnterpriseUrl).then(data => {
        this.enterpriseInfo = data.data
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    getEnterpriseInitInfo () {
      this.fetch(this.getEnterpriseInitInfoUrl).then(data => {
        for (let key in this.submitData) {
          this.submitData[key] = data.data[key]
          if (key === 'legalPersonIdFrontAddress') {
            this.submitData[key] = this.submitData[key].fileId
            this.getCode(this.submitData[key], 'legalPersonIdFront')
          }
          if (key === 'legalPersonIdBackAddress') {
            this.submitData[key] = this.submitData[key].fileId
            this.getCode(this.submitData[key], 'legalPersonIdBack')
          }
          if (key === 'businessLicenceAddress') {
            this.submitData[key] = this.submitData[key].fileId
            this.getCode(this.submitData[key], 'businessLicence')
          }
        }
        if (this.submitData.enterpriseType === 'CoLtd') {
          this.companyType = '有限责任公司'
        } else {
          this.companyType = '股份有限公司'
        }
      }).catch(res => {
        this.$message.error(res.data.msg)
      })
    },
    goNext () {
      if (this.verifyAdminName()) return
      if (this.checkRegisteredPhone()) return
      let registeredCapitalReg = /^\d+(\.\d{1,6})?$/
      let idCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      // let RegisteredPhone = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/
      let canPass = true
      if (!idCard.test(this.submitData.legalPersonIdNumber)) {
        canPass = false
        this.errorWarning.legalPersonIdNumberError = true
        setTimeout(() => {
          this.errorWarning.legalPersonIdNumberError = false
        }, 3000)
      }
      if (!registeredCapitalReg.test(this.submitData.registeredCapital)) {
        canPass = false
        this.errorWarning.registeredCapitalError = true
        setTimeout(() => {
          this.errorWarning.registeredCapitalError = false
        }, 2000)
      }
      if (!this.submitData.landLinePhone) {
        canPass = false
        this.errorWarning.registeredPhoneError = true
        setTimeout(() => {
          this.errorWarning.registeredPhoneError = false
        }, 2000)
      }
      // 如果有三者有错误就return
      if (!canPass) return
      // 企业信息验证
      this.fetch(this.authEnterpriseUrl, 'post', {
        legalPersonName: this.submitData.legalPersonName,
        legalPersonIdNumber: this.submitData.legalPersonIdNumber
      }).then(data => {
        // 验证成功状态
        // this.next = true
        this.loadingShow = true
        if (this.companyType === '有限责任公司') {
          this.submitData.enterpriseType = 'CoLtd'
        } else {
          this.submitData.enterpriseType = 'Stock'
        }
        this.fetch(this.enterpriseInfoUrl, 'post', this.submitData).then(data => {
          Setitem('perfectState', 3)
          this.$router.push('/account-num')
        }).catch(data => {
          if (data.data.code === 4004) {
            this.showTip = true
          } else {
            this.$message({
              type: 'error',
              message: data.data.msg
            })
          }
        })
      }).catch(res => {
        if (res.data.code === -1) {
          // 验证失败状态
          this.showTip = true
        } else if (res.data.code === 1002) {
          this.errorWarning.legalPersonIdNumberError = true
          setTimeout(() => {
            this.errorWarning.legalPersonIdNumberError = false
          }, 3000)
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 身份证正面上传
    legalPersonIdFrontAddress (response, file) {
      this.upLoadSuccess(response, file, 'legalPersonIdFrontAddress')
    },
    // 身份证背面上传
    legalPersonIdBackAddress (response, file) {
      this.upLoadSuccess(response, file, 'legalPersonIdBackAddress')
    },
    // 营业执照上传
    businessLicenceAddress (response, file) {
      this.upLoadSuccess(response, file, 'businessLicenceAddress')
    },
    // 上传成功
    upLoadSuccess (response, file, type) {
      if (response.code === 0) {
        this.submitData[type] = response.data.fileId
        // 给file增加type标识
        file.upLoadType = type
        if (type === 'legalPersonIdFrontAddress') {
          this.format = false
          this.hintFrontShow = false
        } else if (type === 'legalPersonIdBackAddress') {
          this.reversFormat = false
          this.hintBackShow = false
        } else if (type === 'businessLicenceAddress') {
          this.LicenceFormat = false
        }
      } else {
        this.$message({
          type: 'error',
          message: response.msg
        })
      }
    },
    // 文件删除成功
    loanApplyFormRemove (file, fileList, type) {
      this.submitData[file.upLoadType] = ''
    },
    // 上传文件失败触发报错
    loanApplyFormUploadFailed () {
      this.reversFormat = true
      this.hintBackShow = false
    },
    loanApplyFormFrontUploadFailed () {
      this.format = true
      this.hintFrontShow = false
    },
    loanApplyFormLicenceUploadFailed () {
      this.LicenceFormat = true
    },
    upLoadClick (num) {
    },
    closePopUp (closeBoolean) {
      this.showTip = closeBoolean
    },
    // 获取图片 code方法
    getCode (imgId, type) {
      this.fetch(`${this.downloadCodeUrl}/${imgId}`).then(data => {
        this.setImgHeader(data.data.code, data.data.token, type)
      }).catch(data => {
        this.$message({
          type: 'error',
          message: '获取文件名失败！'
        })
      })
    },
    setImgHeader (code, token, nameImg) {
      this.axios({
        url: this.downloadUrl,
        params: { code: code },
        headers: {
          'FileToken': `Bearer ${token}`
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
          this.$refs[nameImg].src = result
          /* if (nameImg === 'legalPersonIdFront') {
            this.fileListIdFront[0] = { url: result }
          } else if (nameImg === 'legalPersonIdBack') {
            this.fileListIdBack[0] = { url: result }
          } else if (nameImg === 'businessLicence') {
            this.fileListBusinessLicence[0] = { url: result }
          }
          this.$forceUpdate() */
        })
      }).catch(data => {
        this.$message({
          type: 'error',
          message: '获取code失败！'
        })
      })
    },
    closeInitImg (initImg, address) {
      this[initImg] = false
      this.submitData[address] = ''
    }
  },
  computed: {
    // 不满足条件申请按钮不可按
    enterpriseActive () {
      if (this.submitData.legalPersonName && this.submitData.legalPersonIdNumber && this.companyType && this.submitData.registeredAddress && this.submitData.registeredCapital && this.submitData.legalPersonIdFrontAddress && this.submitData.legalPersonIdBackAddress && this.submitData.businessLicenceAddress && this.submitData.landLinePhone) {
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
.enterprise-info-main {
  margin: 0 auto;
  .enterprise-form {
    width: 566px;
    margin: 0 auto;
  }
  .unit-price{
    position: absolute;
    top:15px;
    right:10px;
    padding: 2px 10px 0 0;
  }
  .error-warning {
    position: absolute;
    left: 410px;
    top: 7px;
    width: 380px;
    text-align: left
  }
  .login-error {
    color: #f27072;
    margin-left: 5px;
    font-size: 15px;
    letter-spacing: 1px;
  }
  // .line-feed {
  //   margin-left: 30px
  // }
  .error-icon-warning {
    margin-left: 19px;
    font-size: 24px;
    color: #f2706e;
    vertical-align: middle;
  }
  .enterprise-info-button {
    margin-top: 20px;
    margin-left: 160px;
    margin-bottom: 130px;
    width: 400px;
    height: 45px;
    font-size: 18px;
    border: none;
    background-color: @theme-blue;
    background-color: var(--mainColor);
    box-shadow: 1px 6px 4px @btn-disabled;
    box-shadow: 1px 6px 4px var(--mainTableHover);
  }
  .application-upload-button {
    width: 100px;
    border: none;
    background-color: @theme-blue;
    background-color: var(--mainColor);
  }
  .upload-title{
    cursor: default;
    height: 20px;
    line-height: 20px;
    color: #b6b6b6;
    text-align:left;
    font-size: 14px;
    // margin-top: 10px;
  }
  .upload-sample {
    margin-left: 30px;
    cursor: pointer;
    text-decoration: underline;
    color: @theme-blue;
    color: var(--mainColor)
  }
  .upload-format {
    font-size: 14px;
    display: inline-block;
    position: relative;
    top:105px;
    left: 275px
  }
  .upload-reversformat {
    font-size: 14px;
    display: inline-block;
    position: relative;
    top:90px;
    left: 275px
  }
  .file-title-float {
    // float: right;
    // margin-left: 25px;
    .down-file-title {
      color: #adadad;
      text-decoration: underline;
      cursor: pointer;
    }
    .down-file-title:hover {
      color: @btn-bg-color;
    }
  }
}
.sample-img {
  width:433px;
  height: 265px;
  margin: 30px auto;
}
.error-img {
  color: red;
  font-size: 16px;
  display: inline-block;
  position: relative;
  top:107px;
  left: 280px
}
.error-reversFormat {
  color: red;
  font-size: 16px;
  display: inline-block;
  position: relative;
  top:90px;
  left: 280px
}
.error-LicenceFormat {
  color: red;
  font-size: 16px;
  display: inline-block;
  position: relative;
  top:130px;
  left: 280px
}
.confirm-btn {
  width: 211px;
  height:50px;
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
.hint {
  // color: red;
  font-size: 16px;
  position: absolute;
  top: 12px;
  left: 400px;
  .el-icon-question {
    color: #cccccc;
  }
}
.constraint {
  color: red;
  margin-left:5px;
  display: inline-block;
  height: 40px;
  font-weight: 600;
  line-height: 40px;
}
.companyType-constraint{
  position: absolute;
  top: 4px;
  right: 2px;
  color: red;
}
.wait-next {
  width: 200px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  margin: -13px 0 10px 213px;
  color: @theme-blue;
  color: var(--mainColor);;
  border: 1px solid var @theme-blue;
  border: 1px solid var(--mainColor);
  background-color: @theme-blue-light;
  background-color: var(--mainLightColor);
}
</style>

<style lang="less">
.enterprise-info-main .el-input__inner {
  height: 45px;
  line-height: 14px;
  padding-top: 12px;
  padding-bottom: 12px;
  // line-height: 45px;
}
.enterprise-info-main .el-form-item__content{
  line-height: 12px
}
.enterprise-info-sample .el-dialog--center .el-dialog__body {
  padding: 0!important
}
.upload-format:focus{
  color: #333!important
}
</style>
