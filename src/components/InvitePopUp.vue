<template>
  <div class="invite-popup">
    <el-dialog :visible.sync="setPsdVisible" :before-close="handleDialogClose" center width="608px">
      <p class="inviteTitle">邀请注册</p>
      <p class="remindText">注册链接已生成！您可通过短信、微信等方式发送给受邀{{url.indexOf('Join')>=0?'用户':'企业'}}了！</p>
      <!-- <el-radio-group v-model="radio" @change="changeType">
        <el-radio :label="3" v-if="role === 'superadmin'">邀请创建服务商</el-radio>
        <el-radio :label="6" v-if="role === 'service'">邀请创建代理商</el-radio>
        <el-radio :label="9" v-if="role === 'service' || role === 'agent'">邀请创建企业方</el-radio>
        <el-radio :label="12" v-if="userRole === 'admin' || userRole === 'superadmin'">邀请为操作员</el-radio>
      </el-radio-group>
      <p class="hint">复制链接，发送给上下游企业</p> -->
      <el-input :value="url" ref="invite" class="invitInput"></el-input>
      <Button class="confirm-btn" @handleClick="copyUrl" title="复制链接地址" :disabled="!url"></Button>
      <div class="tableTitle"><span class="midText">或</span></div>
      <p class="remindText">您也可以在下方输入对方邮箱，直接将注册地址发送给受邀{{url.indexOf('Join')>=0?'用户':'企业'}}</p>
      <el-input v-model="email" class="invitInput" :placeholder="url.indexOf('Join')>=0?'请输入受邀用户的邮箱':'请输入受邀企业的邮箱'"></el-input>
      <Button class="confirm-btn" @handleClick="sendMsg" title="发送邀请邮件" :disabled="!url || sendStatus === 'success'"
        :isLoading="isLoading"></Button>
      <p class="erroMsg" v-if="sendStatus === 'failed'">邮箱发送失败</p>
      <p class="erroMsg successMsg" v-if="sendStatus === 'success'">邮箱发送成功</p>
    </el-dialog>
  </div>
</template>

<script>
import settings from '@/settings'
export default {
  data () {
    return {
      showClose: true,
      getInviteUrl: settings.apiGateway.getInvitation,
      // 发送邮件链接
      sendInviteUrl: settings.apiGateway.sendInvite,
      radio: '',
      inviteType: '',
      inviteSysRoles: '',
      userRole: '',
      role: '',
      email: '',
      isLoading: false,
      sendStatus: 'pending'
    }
  },
  props: {
    setPsdVisible: {
      type: Boolean,
      default: false
    },
    url: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleDialogClose () {
      this.email = ''
      this.sendStatus = 'pending'
      this.isLoading = false
      this.$emit('handleClose')
    },
    copyUrl () {
      var Url2 = this.$refs.invite
      Url2.select()
      document.execCommand('Copy')

      this.$message({
        type: 'success',
        showClose: true,
        message: '链接复制到粘贴板'
      })
    },
    getInvite () {
      this.fetch(`${this.getInviteUrl}/${this.inviteType}${this.radio === 12 ? '' : this.inviteSysRoles}`).then(data => {
        this.url = data.data
      }).catch(data => {
        this.$message.error(data.data.msg)
      })
    },
    sendMsg () {
      if (!this.email) {
        this.$message.error('请输入邮箱后发送')
        return
      } else if (this.checkEmails(this.email)) {
        this.$message.error('邮箱输入有误')
        return
      }
      let data = {
        email: this.email,
        url: this.url
      }
      this.isLoading = true
      this.fetch(`${this.sendInviteUrl}`, 'post', data).then(data => {
        this.isLoading = false
        if (data.data) {
          this.sendStatus = 'success'
        } else {
          this.sendStatus = 'failed'
        }
      }).catch(data => {
        this.$message.error(data.data.msg)
      })
    },
    changeType () {
      if (this.radio === 3) {
        this.inviteType = 'Create'
        this.inviteSysRoles = '/Service'
      } else if (this.radio === 6) {
        this.inviteType = 'Create'
        this.inviteSysRoles = '/Agent'
      } else if (this.radio === 9) {
        this.inviteType = 'Create'
        this.inviteSysRoles = '/Enterprise'
      } else if (this.radio === 12) {
        this.inviteType = 'Join'
      }
      this.getInvite()
    }
  },
  created () {
    this.userRole = this.getUserRole()
    this.role = this.getRole()
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/variables.less';
.inviteTitle {
  text-align: center;
  font-size: 20px;
  color: rgba(87, 87, 87, 1);
  margin-top: -20px;
  margin-bottom: 48px;
}
.remindText {
  text-align: center;
  margin-bottom: 19px;
  font-size: 16px;
  color: rgba(87, 87, 87, 1);
}
.invitInput {
  width: 370px;
  margin-left: 20px;
}
.confirm-btn {
  border: none;
  margin-left: 10px;
}
.hint {
  text-align: center;
  margin: 30px 0;
  font-size: 18px;
  line-height: 30px;
}
.text {
  cursor: pointer;
  text-decoration: underline;
  color: @theme-blue;
  color: var(--mainColor);
}
.tableTitle {
  position: relative;
  margin: 35px auto;
  width: 508px;
  height: 1px;
  background-color: #d4d4d4;
  text-align: center;
  font-size: 16px;
  color: rgba(101, 101, 101, 1);
}
.midText {
  position: absolute;
  left: 50%;
  background-color: #ffffff;
  padding: 0 15px;
  transform: translateX(-50%) translateY(-50%);
}
.erroMsg {
  margin-left: 20px;
  margin-top: 10px;
  font-size: 14px;
  color: #f75454;
}
.successMsg {
  color: #78bf3e;
}
</style>
<style lang="less">
.invite-popup {
  .el-dialog {
    position: absolute;
    top: 50% !important;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    margin-top: 0 !important;
    margin-left: 108px;
  }
}
</style>
