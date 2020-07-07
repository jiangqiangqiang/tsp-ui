<template>
  <div>
    <!-- 对公银行信息 -->
    <AuthenticationTitle :stepInfo="stepInfo"></AuthenticationTitle>
    <div class="register-main">
      <el-form label-width="141px">
        <el-form-item label="银行账户名称">
          <el-input v-model="userInfo.bankAccountName" @blur="checkUserExist" @focus="focusUserName"
            placeholder="请输入银行账户名称" disabled>
          </el-input>
        </el-form-item>
        <el-form-item label="开户银行">
          <el-select v-model="userInfo.bankName" placeholder="请选择开户银行" style="width:400px">
            <el-option v-for="item in bankOption" :key="item.id" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开户银行账号">
          <el-input v-model="userInfo.bankAccountCode" @blur="checkbankAccountCode" @focus="focusUserName"
            placeholder="请输入开户银行账号">
          </el-input>
          <div v-if="errorWarning.bankAccountCodeError" class="error-warning">
            <i class="el-icon-warning error-icon-warning"></i>
            <span class="show-error">{{bankAccountText}}</span>
          </div>
        </el-form-item>
        <el-form-item label="开户银行支行名称">
          <el-input v-model="userInfo.bankBranchName" @blur="checkBankBranch" @focus="focusUserName"
            placeholder="请输入开户银行支行名称">
          </el-input>
          <div v-if="errorWarning.bankBranchNameError" class="error-warning">
            <i class="el-icon-warning error-icon-warning"></i>
            <span class="show-error">{{userNameMsg}}</span>
          </div>
        </el-form-item>
        <el-form-item label="开户银行地区">
          <el-cascader v-model="bankAdress" :options="optionsAdress" :props="props" clearable @change="adressChange"
            @active-item-change="handleItemChange" placeholder="请选择开户银行地区" :change-on-select="false" @expand-change="handleItemChange">
          </el-cascader>
        </el-form-item>
        <el-form-item label="上传银行开户许可" style="height:195px">
          <span v-if="reversFormat" class="error-img"><i class="el-icon-warning"></i> 上传失败，请检查网络是否连接</span>
          <div class="init-img-main" v-if="initUpload2">
            <img class="init-img" ref="openAccountSingle" alt="法人身份证背面">
            <a class="init-img--close" @click="closeInitImg('initUpload2', 'openAccountSingleAddress')">X</a>
          </div>
          <common-upload v-else :limit="1" :on-remove="loanApplyFormRemove" :on-success="openAccountSingleAddress"
            :on-error="loanApplyFormUploadFailed" :action="actionUrl" :canHidden="canHidden" list-type="picture-card"
            :beforeRemove="beforeRemove" ref="upload5" uploadType="3">
            <img src="~@/assets/img/ID-card-back.gif" alt="反面">
          </common-upload>
          <span class="textAmind">
            <span style="fontWeight:bold;color:#606266;">注意事项</span>
            <br />
            <span style="fontWeight:bold;color:#606266;">1, </span>“对公银行账户信息”提供印鉴卡、银行流水单号、
            <br />&nbsp;&nbsp;银行开户许可证、银行开户回执单，4项中任一即可
            <span style="fontWeight:bold;color:#606266;">2, </span>“对公银行账户信息”中必须显示对应银行的支行信
            <br />&nbsp;&nbsp;息，并附有银行公章
            <br />
            <span style="fontWeight:bold;color:#606266;">3, </span>对公账户银行凭证还需加盖商户<span style="color: #f75454;">有色公章</span>。
          </span>
        </el-form-item>
        <el-form-item label="">
          <Button :disabled="loginActive" class="login-button" @handleClick="handleRegister" title="确认提交"></Button>
        </el-form-item>
      </el-form>
      <div class="no-regist">
      </div>
    </div>
  </div>
</template>

<script>
import settings from '@/settings'
import { Setitem, Getitem } from '@/services/CommonService'
import CommonUpload from '@/components/CommonUpload'
import AuthenticationTitle from '../AuthenticationTitle'
export default {
  name: 'login',
  components: {
    AuthenticationTitle,
    CommonUpload
  },
  data () {
    return {
      // 步骤
      stepInfo: {
        list: ['账户注册', '个人实名认证', '企业实名认证', '对公银行账户信息'],
        step: 4
      },
      // 开户银行地址
      bankAdress: [],
      optionsAdress: [{ code: '111', name: '北京', cities: [{ code: '111', name: '北京' }] }],
      props: {
        value: 'code',
        label: 'name',
        children: 'cities'
      },
      bankOption: [],
      // 用户信息
      userInfo: {
        bankAccountName: '',
        inviteCode: '',
        bankName: '',
        bankAccountCode: '',
        bankBranchName: '',
        openAccountSingleAddress: '',
        province: '',
        address: ''
      },
      // 错误提示
      errorWarning: {
        bankAccountCodeError: false,
        bankBranchNameError: false
      },
      bankAccountText: '',
      // 登录后 返回的用户数据
      userData: {
        token: '',
        role: '',
        perfectState: '',
        adminName: ''
      },
      // 是否允许隐藏上传按钮
      canHidden: false,
      reversFormat: false,
      initUpload2: false,
      userNameMsg: '手机号输入错误',
      // 提交银行信息
      bankInfoUrl: settings.apiGateway.bankInfo,
      // 个人初始化时判断操作员是否已加入公司
      getApplyInfoUrl: settings.apiGateway.getApplyInfo,
      // 获取银行列表
      getBankCodeyUrl: settings.apiGateway.getBankCodey,
      // 获取省市地区
      getAreaUrl: settings.apiGateway.getArea,
      // 获取对公银行初始化信息接口
      getBankInfoUrl: settings.apiGateway.getBankInfo,
      // 上传文件接口
      actionUrl: settings.actionUrl,
      downloadCodeUrl: settings.apiGateway.downloadCode,
      // 下载接口
      downloadUrl: settings.downloadUrl,
      loading: false
    }
  },
  created () {
    this.userInfo.bankAccountName = this.$route.query.enterpriseName
    // if (this.$route.query.backStep) {
    this.getBankInfo()
    // }
    this.getBankCodey()
    this.getArea()
  },
  methods: {
    // 根据点击省获取地区信息
    handleItemChange (val) {
      const that = this
      setTimeout(() => {
        that.optionsAdress.forEach(item => {
          if (item.code === val[0]) {
            that.fetch(that.getAreaUrl + '?parentCode=' + val[0]).then(data => {
              item.cities = data.data
            }).catch(data => {
              that.$message({
                type: 'error',
                message: data.data.msg
              })
            })
          }
        })
      }, 100)
    },
    adressChange () {
    },
    // 获取缓存信息
    getBankInfo () {
      this.fetch(this.getBankInfoUrl).then(data => {
        if (!data.data) return
        this.initUpload2 = true
        for (let key in this.userInfo) {
          this.userInfo[key] = data.data[key]
          if (key === 'openAccountSingleAddress') {
            this.userInfo[key] = this.userInfo[key]
            this.getCode(this.userInfo[key], 'openAccountSingle')
          }
        }
        this.userInfo.bankAccountName = this.$route.query.enterpriseName || this.userInfo.bankAccountName
        this.handleItemChange([this.userInfo.province])
        setTimeout(() => {
          this.bankAdress = [this.userInfo.province, this.userInfo.address]
        }, 101)
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
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
      this.userInfo[address] = ''
    },
    beforeRemove () {
      return true
    },
    // 获取省列表
    getArea () {
      this.fetch(this.getAreaUrl).then(data => {
        let optionsAdress = data.data
        optionsAdress.forEach(item => {
          item.cities = []
        })
        this.optionsAdress = optionsAdress
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    // 获取银行列表
    getBankCodey () {
      this.fetch(this.getBankCodeyUrl).then(data => {
        this.bankOption = data.data
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    openAccountSingleAddress (response, file) {
      this.upLoadSuccess(response, file, 'openAccountSingleAddress')
    },
    // 上传成功
    upLoadSuccess (response, file, type) {
      if (response.code === 0) {
        this.userInfo[type] = response.data.fileId
        // 给file增加type标识
        file.upLoadType = type
        if (type === 'openAccountSingleAddress') {
          this.reversFormat = false
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
      this.userInfo[file.upLoadType] = ''
    },
    // 上传文件失败触发报错
    loanApplyFormUploadFailed () {
      this.reversFormat = true
    },
    // 提交
    handleRegister () {
      // 获取链接
      let invite = this.$route.query.invite
      if (invite) {
        this.userInfo.inviteCode = invite
      }
      if (this.errorWarning.bankAccountCodeError) return
      this.userInfo.address = this.bankAdress[1]
      this.userInfo.province = this.bankAdress[0]
      this.loading = true
      this.fetch(this.bankInfoUrl, 'post', this.userInfo).then(data => {
        this.loading = false
        Setitem('perfectState', 5)
        // 修改步骤
        let userData = JSON.parse(Getitem('userData'))
        userData.perfectState = '5'
        Setitem('userData', JSON.stringify(userData))
        this.$router.push('/authentication/initialization')
      }).catch(data => {
        this.loading = false
        this.$message.error(data.data.msg)
      })
    },
    // 跳转到忘记密码页
    goRouter (url) {
      this.$router.push(url)
    },
    checkBankBranch () {
      if (this.checkStrByte(this.userInfo.bankBranchName) > 100) {
        this.errorWarning.bankBranchNameError = true
        this.userNameMsg = '开户银行支行名称不能超过100位字节'
      }
    },
    checkUserExist () {
    },
    focusUserName () {
    },
    checkbankAccountCode () {
      if (!this.userInfo.bankAccountCode) {
        this.errorWarning.bankAccountCodeError = true
        this.bankAccountText = '银行账号不能为空'
        return true
      }
      if (this.checkBankCode(this.userInfo.bankAccountCode)) {
        this.errorWarning.bankAccountCodeError = true
        this.bankAccountText = '输入有误'
      } else {
        this.errorWarning.bankAccountCodeError = false
      }
    },
    handleLogin () {
      this.$router.push('/login')
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      let userData = JSON.parse(Getitem('userData'))
      if (userData.perfectState === '4') {
        vm.$router.push('/')
      } else if (userData.perfectState === '5' || userData.perfectState === '6') {
        vm.$router.push('/authentication/initialization')
      }
    })
  },
  computed: {
    loginActive () {
      if (this.userInfo.bankAccountName && !this.loading && this.userInfo.bankName && this.userInfo.bankAccountCode && this.userInfo.bankBranchName && this.userInfo.openAccountSingleAddress && this.bankAdress.length > 0) {
        return false
      } else {
        return true
      }
    }
  },
  destroyed () {
    document.onkeydown = null
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/variables';
.logo {
  float: left;
  margin: 15px 0 0 56px;
  font-size: 30px;
  text-align: center;
  font-size: 15px;
  font-weight: 400;
  color: rgba(75, 75, 75, 1);
}
.textAmind {
  position: absolute;
  right: -70px;
  top: 0;
  font-size: 13px;
  color: #b7b7b7;
  line-height: 22px;
  width: 304px;
  height: 163px;
}
.error-img {
  color: red;
  font-size: 16px;
  width: 200px;
  display: inline-block;
  position: absolute;
  bottom: -24px;
  left: 0;
}
.init-img-main {
  position: relative;
  height: 163px;
  width: 300px;
}
.init-img {
  height: 163px;
  width: 260px;
}
.init-img--close {
  position: absolute;
  top: 0;
  right: 24px;
  color: #303133;
  cursor: pointer;
}
.init-img--close:hover {
  color: @theme-blue;
}
.registerTitle {
  margin-left: 31px;
}
.register-main {
  margin: 49px auto 30px;
  width: 656px;
  .error-warning,
  .remind-warning {
    position: absolute;
    left: 402px;
    top: 0;
    width: 190px;
  }
  .remind-warning {
    width: 304px;
  }
  .show-error {
    color: #f27072;
    margin-left: 5px;
    font-size: 15px;
    letter-spacing: 1px;
  }
  .show-remind {
    font-size: 14px;
    // font-family: SimSun;
    font-weight: 400;
    color: #b7b7b7;
    margin-left: 14px;
  }
  .error-icon-warning {
    margin-left: 19px;
    font-size: 24px;
    color: #f2706e;
    vertical-align: middle;
  }
  .forget {
    float: right;
    color: #108ee9;
    text-decoration: underline;
    cursor: pointer;
  }
  .code-img-box {
    width: 162px;
    height: 43px;
    // float: right;
    display: inline-block;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    margin-left: 7px;
    .code-img {
      width: 118px;
      height: 44px;
    }
    .refresh-button {
      width: 44px;
      height: 44px;
      float: right;
      background: #e8e8e8;
      .refresh-icon {
        color: #afafaf;
        font-size: 21px;
        margin: 12px 12px;
        cursor: pointer;
      }
    }
  }
  .login-button {
    width: 402px;
    height: 45px;
    font-size: 18px;
    margin-bottom: 50px;
    border: none;
    box-shadow: 1px 6px 4px #c0e2fa;
    box-shadow: 1px 6px 4px #c0e2fa;
  }
  .code-input {
    width: 285px;
  }
  .code-input1 {
    width: 227px;
  }
  .verification-code {
    width: 108px;
    height: 42px;
    background-color: @theme-blue-light;
    color: @theme-blue;
    border-radius: 4px;
    border: 1px solid @theme-blue;
  }
  .verification-code:focus {
    border-color: @theme-blue;
  }
  .el-button--primary:active {
    background: @theme-blue;
  }
  .no-regist {
    margin-top: 30px;
    margin-left: 183px;
    .to-regist {
      cursor: pointer;
      text-decoration: underline;
      color: @theme-blue;
      margin-left: 10px;
    }
  }
}
.register-main .el-button.is-disabled {
  color: #fff;
  background-color: @theme-blue;
  border-color: @theme-blue;
  opacity: 0.5;
  letter-spacing: 8px;
}
.register-main .code-form .el-button.is-disabled {
  letter-spacing: 0px;
}
.image {
  width: 90px !important;
  height: 69px !important;
  vertical-align: middle;
  color: @theme-blue;
  margin: 0 auto;
}
.fund-logo {
  width: 63px !important;
  height: 50px !important;
  color: @theme-blue;
  color: var(--mainColor);
  vertical-align: middle;
}
.register-main/deep/.el-upload {
  top: 0;
  left: 0;
}
.register-main/deep/.el-button--primary.is-disabled,
.register-main/deep/.el-button--primary.is-disabled:hover,
.register-main/deep/.el-button:hover {
  background-color: #108ee9;
}
.register-main/deep/.el-upload--picture-card {
  top: 0 !important;
}
</style>

<style lang="less">
.register-main .el-input {
  width: 402px;
}
.register-main .el-input__inner {
  height: 45px;
  line-height: 14px;
  padding-top: 12px;
  padding-bottom: 12px;
  // line-height: 45px;
  background: #fcfcfc;
}
.register-main .el-input__inner:focus {
  border-color: #108ee9;
}
.register-main .el-form-item__label {
  // font-family: SimSun;
  font-size: 16px;
}
.register-main .el-checkbox__label {
  color: #979797;
  font-size: 14px;
  // font-family: SimSun;
}
.register-main .el-upload-list--picture-card .el-upload-list__item {
  width: 263px;
  height: 163px;
  margin-right: 26px;
}
.register-main .el-upload--picture-card {
  width: 260px;
  height: 165px;
  margin-right: 26px;
}
.register-main .el-upload-list__item-delete {
  width: 100%;
  height: 42px;
  line-height: 42px;
  background-color: rgba(16, 142, 233, 0.7);
}
.register-main .el-upload-list--picture-card .el-upload-list__item-actions {
  background-color: transparent;
}
.register-main .el-icon-delete:before {
  font-size: 16px;
  // font-family: SimSun;
  content: '重新上传';
}
</style>
