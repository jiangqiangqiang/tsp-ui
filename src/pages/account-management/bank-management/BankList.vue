<template>
  <div>
    <BusinessTitle title="银行账户管理"></BusinessTitle>
    <div class="bank-container">
      <div @click="goAdd" class="add-bank">
        <div>
          <i class="el-icon-plus icon"></i>
          <span>添加银行账户</span>
        </div>
      </div>
      <div v-for="(bankData, bankIndex) in bankList" class="bank-table" :key="bankIndex">
        <div>
          <img :src="imgSrcList[bankIndex].src" alt="银行图标">
          <span class="bankName">{{bankData.bankName}}</span>
          <div class="delete" v-if="!bankData.use"><span
              :class="changeDefaultDialog?'chooseDefault deleteHover':'deleteHover'"
              @click="toDefault(bankData.id)">设为默认&nbsp;</span>&nbsp;|&nbsp;<span
              @click="deleteBank(bankIndex)">&nbsp;删除</span>
          </div>
          <div class="delete" v-if="bankData.use">默认</div>
        </div>
        <table>
          <tr>
            <td>银行开户名</td>
            <td colspan="3">{{bankData.bankAccountName}}</td>
          </tr>
          <tr>
            <td>银行账号</td>
            <td colspan="3">{{bankData.bankAccountCode | hideString}}</td>
          </tr>
          <tr>
            <td>开户银行地区</td>
            <td style="width:120px">{{(bankData.province || '')+'/'+ (bankData.address || '')}}</td>
            <td style="width:100px;textAlign:center">支行名称</td>
            <el-tooltip class="item" effect="dark" placement="top" :content="bankData.bankBranchName"
              v-if='bankData.bankBranchName?bankData.bankBranchName.length>8:false'>
              <td style="overflow:hidden;text-overflow:ellipsis;white-space: nowrap;">
                {{bankData.bankBranchName.substring(0, 7) + '...'}}</td>
            </el-tooltip>
            <td v-if='bankData.bankBranchName?bankData.bankBranchName.length<=8:true'>
              {{bankData.bankBranchName}}</td>
          </tr>
          <tr>
            <td>联系人手机号</td>
            <td colspan="3">{{bankData.phone}}</td>
          </tr>
        </table>
      </div>
    </div>
    <div class="delete-bank">
      <el-dialog center title="删除银行卡" :visible.sync="dialogVisible" width="568px" top="290px"
        :before-close="closeDialog">
        <p class="prompt">请谨慎删除,删除后只能重新添加</p>
        <el-form class="change-phone">
          <el-form-item>
            <span class="lableItem">手机号</span>
            <el-input type="text" class="phone-input" :value="adminMobile" disabled></el-input>
          </el-form-item>
          <el-form-item>
            <span class="lableItem">短信验证码</span>
            <el-input class="code-input" v-model="codeInfo.newCsrfCode" placeholder="请输入短信验证码" style="margin-top:28px" autocomplete="username">
            </el-input>
            <el-button class="verification-code" :disabled="!codeStatus" @click="getCode">
              {{codeStatus? '获取验证码' : `${codeTime}秒后获取`}}</el-button>
          </el-form-item>
          <el-form-item>
            <span class="lableItem">支付密码</span>
            <input type="text" style="position:absolute;left:666666px">
            <el-input type="password" class="phone-input" placeholder="请输入支付密码" v-model="codeInfo.payPassword" autocomplete="new-password"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <Button :disabled="deleteBankBtn" class="next-button" @handleClick="deleteSubmit" title="确认删除"></Button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="changeDefaultDialog" center width="568px" top="350px">
        <p style="text-align:center;margin: 20px 0 0;font-size: 18px;">是否设置此卡为默认卡?</p>
        <div slot="footer" class="dialog-footer">
          <Button class="confirm-btn" @handleClick="changeBankDefalut" title="确定"></Button>
          <Button class="confirm-btn" @handleClick="changeDefaultDialog = false" title="取消"></Button>
        </div>
      </el-dialog>
    </div>
    <NOPayPassword :setPsdVisible='!hasPassword' @handleClose="handleClose"></NOPayPassword>
    <loading :loadingShow="isLoadingShow1"></loading>
  </div>
</template>

<script>
import BusinessTitle from '@/components/BusinessTitle'
import NOPayPassword from '@/components/NOPayPassword'
import settings from '@/settings'
import BankTypes from '@/services/BankType'
export default {
  data () {
    return {
      bankList: [],
      srcList: [],
      codeInfo: {},
      id: '',
      adminMobile: '',
      dialogVisible: false,
      changeDefaultDialog: false,
      hasPassword: true,
      isLoadingShow1: false,
      // 验证码状态
      codeStatus: true,
      // 验证码获取间隔
      codeTime: 60,
      // 发送短信验证码
      getSendCodeUrl: settings.apiGateway.adminSmsCode,
      getBankListUrl: settings.apiGateway.getBankList,
      deleteBanksUrl: settings.apiGateway.deleteBanks,
      changeBanksDefaultUrl: settings.apiGateway.changeBanksDefault,
      // 检测账户是否设置支付密码
      checkIsSetPayPasswordUrl: settings.apiGateway.checkIsSetPayPassword
    }
  },
  components: {
    BusinessTitle,
    NOPayPassword
  },
  methods: {
    goAdd () {
      let role = this.getUserRole()
      this.$router.push('/' + role + '/add-bank')
    },
    handleClose () {
      this.hasPassword = true
    },
    deleteBank (index) {
      this.checkIsSetPayPassword()
      this.id = this.bankList[index].id
      // if (this.hasPassword === true) {
      //   this.dialogVisible = true
      // }
    },
    deleteSubmit () {
      var data = {
        code: this.codeInfo.newCsrfCode,
        password: this.codeInfo.payPassword,
        id: this.id
      }
      this.fetch(this.deleteBanksUrl, 'post', data).then(data => {
        this.dialogVisible = false
        this.popUpSuccess({
          text: '删除成功',
          okBtn: '确定',
          ok: () => {
            this.getBankList()
          }
        })
      }).catch(data => [
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      ])
    },
    closeDialog () {
      this.dialogVisible = false
    },
    // 第一次请求验证码接口
    getCode () {
      let data = {
        mobile: this.adminMobile,
        type: 'ValidMobile'
      }
      this.fetch(`${this.getSendCodeUrl}`, 'post', data).then(data => {
        this.$message.success('发送成功,请注意查收!')
        this.codeCountDown()
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    // 验证码倒计时
    codeCountDown () {
      let time = setTimeout(() => {
        this.codeTime--
        this.codeStatus = false
        if (this.codeTime < 1) {
          this.codeStatus = true
          this.codeTime = 60
        } else {
          this.codeCountDown()
        }
        clearTimeout(time)
      }, 1000)
    },
    checkIsSetPayPassword () {
      this.fetch(this.checkIsSetPayPasswordUrl).then(data => {
        this.hasPassword = data.data.exist
        this.adminMobile = data.data.adminMobile
        if (this.hasPassword === true) {
          this.dialogVisible = true
        }
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    getBankList () {
      this.fetch(this.getBankListUrl).then(data => {
        this.bankList = data.data
        this.bankList.forEach((item, index) => {
          let src = BankTypes[item.bankCode] || ''
          this.srcList.push(src)
        })
      }).catch(res => {
        this.$message.error(res.data.msg)
      })
    },
    // 修改默认银行卡
    changeBankDefalut () {
      this.isLoadingShow1 = true
      this.fetch(this.changeBanksDefaultUrl + '?id=' + this.id, 'put').then(data => {
        this.changeDefaultDialog = false
        this.isLoadingShow1 = false
        this.$message.success('设置成功')
        this.getBankList()
      }).catch(res => {
        this.isLoadingShow1 = false
        this.$message.error(res.data.msg)
      })
    },
    toDefault (id) {
      this.id = id
      this.changeDefaultDialog = true
    }
  },
  created () {
    this.getBankList()
  },
  computed: {
    // // 修改管理信息提交框
    deleteBankBtn () {
      if (this.codeInfo.payPassword && this.codeInfo.newCsrfCode) {
        return false
      } else {
        return true
      }
    },
    imgSrcList () {
      let datas = []
      for (let i = 0; i < this.srcList.length; i++) {
        datas.push({
          src: '' + this.srcList[i]
        })
      }
      return datas
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/variables.less';
.bank-container {
  width: 1120px;
  margin: 25px auto;
  box-sizing: border-box;
}
.add-bank,
.bank-table {
  box-sizing: border-box;
  padding: 10px;
  width: 50%;
  float: left;
  > div {
    height: 42px;
    line-height: 42px;
    text-align: left;
    border: 1px solid #e6e6e6;
    border-bottom: none;
    background-color: #fcfcfc;
    padding-left: 20px;
    img {
      height: 28px;
      margin-top: -3px;
    }
    .bankName {
      font-size: 16px;
      font-weight: bold;
      color: rgba(101, 101, 101, 1);
      margin-left: 5px;
    }
  }
  table {
    width: 100%;
    margin: 0 auto;
    tr {
      td {
        height: 38px;
        border: 1px solid #e6e6e6;
        background-clip: padding-box;
      }
      td:first-child {
        text-align: center;
        width: 150px;
        background-color: #fcfcfc;
      }
      td:nth-child(3) {
        background-color: #fcfcfc;
      }
      td:last-child {
        text-align: left;
        padding-left: 20px;
        padding-right: 10px;
      }
      td:nth-child(2n) {
        padding-left: 20px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
    // tr:nth-child(2n) {
    //   background-color: @theme-blue-light;
    //   background-color: var(--mainLightColor);
    // }
  }
}
.deleteHover:hover {
  text-decoration: underline;
  color: @theme-blue;
  color: var(--mainColor);
}
.add-bank {
  height: 220px;
  > div {
    cursor: pointer;
    box-sizing: border-box;
    border: 1px solid #e6e6e6;
    background-color: #fcfcfc;
    padding: 0;
    height: 100%;
    text-align: center;
    line-height: 200px;
    color: #cbcbcb;
  }
}
.chooseDefault {
  text-decoration: underline;
  color: @theme-blue;
  color: var(--mainColor);
}
.delete {
  float: right;
  margin-right: 15px;
  font-size: 13px;
  font-weight: 400;
  color: rgba(101, 101, 101, 1);
  cursor: pointer;
}
.prompt {
  text-align: center;
  color: #b6b6b6;
  font-size: 14px;
}
.change-phone {
  margin-bottom: 2px;
  .el-form-item {
    width: 403px;
    margin: 0 auto;
  }
  //padding-left:58px;
  .phone-input {
    width: 300px;
    text-align: center;
    margin-top: 24px;
  }
  .code-input {
    width: 188px;
  }
}
.lableItem {
  display: inline-block;
  width: 72px;
  text-align: right;
  margin-right: 10px;
}
.verification-code {
  width: 108px;
  height: 40px;
  background-color: @theme-blue-light;
  background-color: var(--mainLightColor);
  color: @theme-blue;
  color: var(--mainColor);
  border-radius: 4px;
  border: 1px solid @theme-blue;
  border: 1px solid var(--mainColor);
}
.verification-code:focus {
  background-color: @theme-blue-light;
  background-color: var(--mainLightColor);
  border-color: @theme-blue;
  border-color: var(--mainColor);
}
.next-button {
  width: 403px;
  height: 50px;
  font-size: 18px;
  margin-top: -3px;
  border: none;
  background-color: @theme-blue;
  background-color: var(--mainColor);
  box-shadow: 1px 6px 4px @btn-disabled;
  box-shadow: 1px 6px 4px var(--mainTableHover);
}
</style>

<style>
.delete-bank .el-dialog {
  position: absolute;
  top: 50% !important;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  margin-top: 0 !important;
  margin-left: 108px;
}
.delete-bank .el-dialog__footer {
  padding: 10px 20px 32px;
}
</style>
