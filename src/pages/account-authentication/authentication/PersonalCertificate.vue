<template>
  <div>
    <AuthenticationTitle :stepInfo="stepInfo"></AuthenticationTitle>
    <div class="content">
      <el-form label-position="right" label-width="108px" class="admin-form" auto-complete="off">
        <el-form-item label="真实姓名" :rules="{ required: true}">
          <el-input v-model="personal.adminName" placeholder="请输入姓名" @blur="verifyAdminName" autocomplete="username">
          </el-input>
          <div v-if="errorWarning.adminNameError" class="error-warning">
            <i class="el-icon-warning error-icon-warning"></i>
            <span class="login-error">{{adminNameText}}</span>
          </div>
        </el-form-item>
        <el-form-item label="身份证号码" :rules="{ required: true}">
          <el-input v-model="personal.adminIdNumber" placeholder="请输入身份证号码" @blur="verifyIdNum"
            auto-complete="username"></el-input>
          <div v-if="errorWarning.adminIdNumberError" class="error-warning">
            <i class="el-icon-warning error-icon-warning"></i>
            <span class="login-error">{{idNumberText}}</span>
          </div>
        </el-form-item>
        <el-form-item label="手机号" :rules="{ required: true}">
          <el-input v-model="personal.telephoneNumber" placeholder="请输入手机号码" @blur="verifyPhone" disabled readonly
            auto-complete="username"></el-input>
          <div v-if="errorWarning.telephoneNumberError" class="error-warning">
            <i class="el-icon-warning error-icon-warning"></i>
            <span class="login-error">手机号码错误</span>
          </div>
        </el-form-item>
        <el-form-item label="邮箱" :rules="{ required: true}">
          <el-input v-model="personal.adminEmail" placeholder="请输入邮箱地址" @blur="verifyIdEmail" auto-complete="username">
          </el-input>
          <div v-if="errorWarning.adminEmailError" class="error-warning">
            <i class="el-icon-warning error-icon-warning"></i>
            <span class="login-error">{{adminEmailText}}</span>
          </div>
        </el-form-item>
        <Button :disabled="adminActive" class="next-button" @handleClick="goNext" title="下一步"></Button>
      </el-form>
    </div>
    <AuthFailedPopUp :showTip="showTip" @confirm="closePopUp" titleText="个人信息认证失败"> </AuthFailedPopUp>
    <AuthFailedPopUp :showTip="phoneTip" @confirm="phoneTip=false" titleText="个人信息认证失败"
      :htmlText="'<p>'+errorText+'</p>'"> </AuthFailedPopUp>
  </div>
</template>

<script>
import AuthFailedPopUp from '@/components/AuthFailedPopUp'
import { Getitem, Setitem } from '@/services/CommonService.js'
import AuthenticationTitle from './AuthenticationTitle'
import settings from '@/settings'
export default {
  data () {
    return {
      // 步骤
      stepInfo: {
        list: ['账户注册', '个人实名认证', '企业实名认证', '对公银行账户信息'],
        step: 2
      },
      personal: {
        adminName: '',
        adminIdNumber: '',
        telephoneNumber: '',
        adminEmail: ''
      },
      adminNameText: '',
      idNumberText: '',
      errorWarning: {
        adminIdNumberError: false,
        adminMobileeError: false,
        adminMobileeFormatError: false,
        smsCodeError: false,
        adminEmailError: false,
        adminNameError: false,
        telephoneNumberError: false
      },
      postPersonalMessageUrl: settings.apiGateway.postPersonalMessage,
      // 验证个人信息是否匹配
      authUserUrl: settings.apiGateway.authUser,
      // 是否显示企业认证失败弹窗
      showTip: false,
      phoneTip: false,
      errorText: ''
    }
  },
  components: {
    AuthenticationTitle,
    AuthFailedPopUp
  },
  methods: {
    // 验证姓名
    verifyAdminName () {
      if (!this.personal.adminName) {
        this.errorWarning.adminNameError = true
        this.adminNameText = '姓名不能为空'
        return true
      }
      let NameReg = /^[\u4E00-\u9FA5]{2,20}$/
      if (!NameReg.test(this.personal.adminName)) {
        this.errorWarning.adminNameError = true
        this.adminNameText = '姓名输入有误'
        return true
      } else {
        this.errorWarning.adminNameError = false
      }
    },
    // 验证身份证号码
    verifyIdNum () {
      if (!this.personal.adminIdNumber) {
        this.errorWarning.adminIdNumberError = true
        this.idNumberText = '身份证不能为空'
        return true
      }
      if (this.checkCodes(this.personal.adminIdNumber)) {
        this.errorWarning.adminIdNumberError = true
        this.idNumberText = '身份证有误'
        return true
      } else {
        this.personal.adminIdNumber = this.personal.adminIdNumber.toUpperCase()
        this.errorWarning.adminIdNumberError = false
      }
    },
    // 校验手机号码
    verifyPhone () {
      // this.verifyUser()
      let number = /^[1][3,5,4,6,9,7,8][0-9]{9}$/
      if (!number.test(this.personal.telephoneNumber)) {
        this.errorWarning.telephoneNumberError = true
        return true
      } else {
        this.errorWarning.telephoneNumberError = false
      }
    },
    // 校验邮箱
    verifyIdEmail () {
      if (!this.personal.adminEmail) {
        this.errorWarning.adminEmailError = true
        this.adminEmailText = '邮箱不能为空'
        return true
      }
      let EmailReg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/i
      if (this.personal.adminEmail && !EmailReg.test(this.personal.adminEmail)) {
        this.errorWarning.adminEmailError = true
        this.adminEmailText = '邮箱有误'
        return true
      } else {
        this.errorWarning.adminEmailError = false
      }
    },
    goNext () {
      if (this.verifyAdminName() || this.verifyIdNum() || this.verifyIdEmail() || this.verifyIdEmail()) return
      let personal = {
        email: this.personal.adminEmail,
        idNumber: this.personal.adminIdNumber,
        relaName: this.personal.adminName
      }
      this.fetch(this.postPersonalMessageUrl, 'post', personal).then(data => {
        let userData = JSON.parse(Getitem('userData'))
        Setitem('topName', this.personal.adminName)
        if (this.$route.query.data && this.$route.query.data.indexOf('Join') > 0) {
          userData.perfectState = '4'
          Setitem('perfectState', 4)
          Setitem('userData', JSON.stringify(userData))
          this.$router.push({
            path: '/authentication/finished',
            query: { status: 'Succeed' }
          })
        } else {
          userData.perfectState = '2'
          Setitem('perfectState', 2)
          Setitem('userData', JSON.stringify(userData))
          this.$router.push('/authentication/enterprise-certificate/step3')
        }
      }).catch(data => {
        if (data.data.code === 4003) {
          this.showTip = true
        } else {
          this.$message({
            type: 'error',
            message: data.data.msg
          })
        }
      })
    },
    closePopUp () {
      this.showTip = false
    }
  },
  computed: {
    adminActive () {
      // 判断必填项是否为空并且符合输入规则才可以发送请求
      if (this.personal.adminName && this.personal.adminEmail && !this.errorWarning.adminEmailError && this.personal.adminIdNumber && this.personal.telephoneNumber && this.errorWarning.adminNameError === false && this.errorWarning.adminIdNumberError === false && this.errorWarning.telephoneNumberError === false) {
        return false
      } else {
        return true
      }
    }
  },
  created () {
    let userData = Getitem('userData')
    this.personal.telephoneNumber = JSON.parse(userData).adminName
    if (this.$route.query.data && this.$route.query.data.indexOf('Join') > 0) {
      this.stepInfo = {
        list: ['账户注册', '个人实名认证'],
        step: 2
      }
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/less/variables';
.content {
  margin-top: 60px;
  .admin-form {
    width: 525px;
    // margin-left: 275px;
    margin: 0 auto;
  }
  .error-warning {
    position: absolute;
    left: 8rem;
    top: 0;
    width: 228px;
  }
  .login-error {
    color: #f27072;
    margin-left: 5px;
    font-size: 15px;
    letter-spacing: 1px;
  }
  .error-icon-warning {
    margin-left: 19px;
    font-size: 24px;
    color: #f2706e;
    vertical-align: middle;
  }
  .next-button {
    width: 417px;
    height: 45px;
    font-size: 18px;
    margin-left: 108px;
    border: none;
    box-shadow: 1px 6px 4px @btn-disabled;
    // box-shadow: 1px 6px 4px var(--mainTableHover);
  }
}
.content/deep/ .el-input__inner {
  height: 40px;
  line-height: 14px;
  padding-top: 10px;
  padding-bottom: 10px;
}
.content/deep/.el-button--primary.is-disabled,
.content/deep/.el-button--primary.is-disabled:hover,
.content/deep/.el-button,
.content/deep/.el-button:hover {
  background-color: #108ee9;
}
</style>

<style>
.content .el-input__inner:focus {
  border-color: #108ee9;
}
.content .el-form-item__label {
  /* font-family: SimSun; */
  font-size: 16px;
}
</style>
