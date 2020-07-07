<template>
  <div>
    <BusinessTitle title="添加银行账户" isShowBack></BusinessTitle>
    <div class="content">
      <el-form label-position="right" label-width="141px" class="admin-form">
        <el-form-item label="银行开户名">
          <el-input v-model="userInfo.bankAccountName" @blur="checkUserExist" @focus="focusUserName"
            placeholder="请输入银行账户名称" disabled>
          </el-input>
        </el-form-item>
        <el-form-item label="银行卡类型">
          <el-input value="借记卡" disabled>
          </el-input>
        </el-form-item>
        <el-form-item label="开户行">
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
            <span class="show-error">{{bankCodeText}}</span>
          </div>
        </el-form-item>
        <el-form-item label="开户银行地区">
          <el-cascader v-model="bankAdress" :options="optionsAdress" :props="props" clearable @change="adressChange"
            @active-item-change="handleItemChange" placeholder="请选择开户银行地区" :change-on-select="false" @expand-change="handleItemChange">
          </el-cascader>
        </el-form-item>
        <el-form-item label="开户银行支行名称">
          <el-input v-model="userInfo.bankBranchName" @blur="checkUserExist" @focus="focusUserName"
            placeholder="请输入开户银行支行名称">
          </el-input>
          <div v-if="errorWarning.bankBranchNameError" class="error-warning">
            <i class="el-icon-warning error-icon-warning"></i>
            <span class="show-error">{{userNameMsg}}</span>
          </div>
        </el-form-item>
        <el-form-item label="联系人手机号">
          <el-input v-model="userInfo.phone" @blur="checkPhone" placeholder="请输入手机号" disabled>
          </el-input>
          <div v-if="errorWarning.phoneError" class="error-warning">
            <i class="el-icon-warning error-icon-warning"></i>
            <span class="show-error">{{phoneText}}</span>
          </div>
        </el-form-item>
        <el-form-item label="">
          <Button class="next-button" @handleClick="openAccount" title="确定" :disabled="loginActive"></Button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import BusinessTitle from '@/components/BusinessTitle'
import { Getitem } from '@/services/CommonService.js'
import CommonUpload from '@/components/CommonUpload'
import settings from '@/settings'
export default {
  data () {
    return {
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
        bankName: '',
        bankAccountCode: '',
        bankBranchName: '',
        province: '',
        address: '',
        phone: ''
      },
      // 错误提示
      errorWarning: {
        bankAccountCodeError: false,
        phoneError: false,
        bankBranchNameError: false
      },
      bankCodeText: '',
      phoneText: '',
      userNameMsg: '手机号输入错误',
      // 获取银行列表
      getBankCodeyUrl: settings.apiGateway.getBankCodey,
      // 获取省市地区
      getAreaUrl: settings.apiGateway.getArea,
      addBankUrl: settings.apiGateway.addBank,
      // 获取联系人手机号
      getContractUrl: settings.apiGateway.getContract
    }
  },
  created () {
    this.userInfo.bankAccountName = JSON.parse(Getitem('userData')).enpName
    this.userInfo.phone = 15600000001
    this.getBankCodey()
    this.getArea()
    this.getContract()
  },
  methods: {
    openAccount () {
      if (this.errorWarning.bankAccountCodeError) return
      if (this.errorWarning.phoneError) return
      this.userInfo.address = this.bankAdress[1]
      this.userInfo.province = this.bankAdress[0]
      this.fetch(this.addBankUrl, 'POST', this.userInfo).then(data => {
        this.log(data)
        this.popUpSuccess({
          text: '添加成功',
          okBtn: '返回',
          ok: () => {
            this.goBack()
          }
        })
      }).catch(res => {
        this.$message.error(res.data.msg)
      })
    },
    getContract () {
      this.fetch(this.getContractUrl).then(data => {
        this.userInfo.phone = JSON.parse(data.data).contactMobile
      }).catch(data => {
        this.$message.error(data.data.msg)
      })
    },
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
    getBankCodey () {
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
    getArea () {
      this.fetch(this.getBankCodeyUrl).then(data => {
        this.bankOption = data.data
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    focusUserName () {
      //   this.errorWarning.userNameError = false
    },
    checkUserExist () {

    },
    checkbankAccountCode () {
      if (!this.userInfo.bankAccountCode) {
        this.errorWarning.bankAccountCodeError = true
        this.bankCodeText = '银行账号不能为空'
        return true
      }
      if (this.checkBankCode(this.userInfo.bankAccountCode)) {
        this.errorWarning.bankAccountCodeError = true
        this.bankCodeText = '输入有误'
      } else {
        this.errorWarning.bankAccountCodeError = false
      }
    },
    checkPhone () {
      if (!this.userInfo.phone) {
        this.errorWarning.phoneError = true
        this.phoneText = '手机号不能为空'
        return true
      }
      if (this.checkPhones(this.userInfo.phone)) {
        this.errorWarning.phoneError = true
        this.phoneText = '手机号输入有误'
      } else {
        this.errorWarning.phoneError = false
      }
    }
  },
  computed: {
    loginActive () {
      if (this.userInfo.bankAccountName && this.userInfo.bankName && this.userInfo.bankAccountCode && this.userInfo.bankBranchName && this.bankAdress.length > 0) {
        return false
      } else {
        return true
      }
    }
  },
  components: {
    BusinessTitle,
    CommonUpload
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/variables.less';
.content {
  width: 648px;
  margin: 20px auto;
  .next-button {
    width: 402px;
    height: 45px;
    font-size: 18px;
    border: none;
    box-shadow: 1px 6px 4px @btn-disabled;
    box-shadow: 1px 6px 4px var(--mainTableHover);
    // background-color: @theme-blue;
    // background-color: var(--mainColor);
  }
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
.error-warning {
  color: red;
  top: 33px;
  position: absolute;
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
</style>
<style lang="less">
.content .el-input {
  width: 402px;
}
.content .el-input__inner {
  height: 45px;
  line-height: 14px;
  padding-top: 12px;
  padding-bottom: 12px;
  // line-height: 45px;
  background: #fcfcfc;
}
.content .el-input__inner:focus {
  border-color: #108ee9;
}
.content .el-form-item__label {
  // font-family: SimSun;
  font-size: 16px;
}
.content .el-checkbox__label {
  color: #979797;
  font-size: 14px;
  // font-family: SimSun;
}
.content .el-upload-list--picture-card .el-upload-list__item {
  width: 263px;
  height: 163px;
  margin-right: 26px;
}
.content .el-upload--picture-card {
  width: 263px;
  height: 165px;
  margin-right: 26px;
}
.content .el-upload-list__item-delete {
  width: 100%;
  height: 42px;
  line-height: 42px;
  background-color: rgba(16, 142, 233, 0.7);
}
.content .el-upload-list--picture-card .el-upload-list__item-actions {
  background-color: transparent;
}
.content .el-icon-delete:before {
  font-size: 16px;
  // font-family: SimSun;
  content: '重新上传';
}
</style>
