<template>
  <div class="enterprise-approve">
    <BusinessTitle isShowBack :title="title"></BusinessTitle>
    <EnterpriseDetail title="企业信息审核" :Id="this.Id" :tag="$route.query.tag" @statusData='statusData'>
      <div class="enterprise-title" slot="overInfo">
        {{name}}<el-tag class="tag" :color="tagColor">{{this.$route.query.tag}}</el-tag>
      </div>
    </EnterpriseDetail>
    <div class="btn-main" v-if="adminAuditStatus === 'Pending'">
      <Button class="approval-button" @handleClick="handleLogout" title="通过"></Button>
      <Button class="approval-button reject-button" @handleClick="handleReject" title="拒绝"
        tyle="margin-left: 12px"></Button>
    </div>
    <div>
      <el-dialog :visible.sync="logoutDialogShow" center width="570px" top="297px">
        <div class="text" style="lineHeight:30px">是否确认通过&nbsp;<span class="color-change">{{name}}&nbsp;</span>的<br v-if="name.length >= 12"/>企业信息审核?</div>
        <span slot="footer" class="dialog-footer">
          <Button class="dialogBtn" @handleClick="logoutSuccess" title="确定"></Button>
          <Button class="dialogBtnF" @handleClick="logoutFailed" title="取消"></Button>
        </span>
      </el-dialog>
    </div>
    <div>
      <el-dialog :visible.sync="rejectDialogShow" center width="570px" top="297px">
        <div>
          <p class="refuse-text">是否拒绝&nbsp;<span class="color-change">{{name}}&nbsp;</span>的企业信息审核?</p>
          <p class="refuse-text">如拒绝,请继续填写拒绝原因。</p>
          <div class="shortcut-choice">
            <span style="margin-right: 10px">拒绝原因</span>
            <span class="shortcut-key" @click="check(fristReason)">{{fristReason}}</span>
            <span class="shortcut-key" @click="check(secondeReason)">{{secondeReason}}</span>
          </div>
          <div class="reason-container">
            <span class="reason-container-text"></span>
            <el-input type="textarea" v-model="refuseReason" class="reason" placeholder="最多30字" maxlength="30">
            </el-input>
          </div>
          <!-- <div class="shortcut-choice">
            <span style="margin-right: 10px">快捷输入</span>
            <span class="shortcut-key" @click="check(fristReason)">{{fristReason}}</span>
            <span class="shortcut-key" @click="check(secondeReason)">{{secondeReason}}</span>
          </div> -->
        </div>
        <span slot="footer" class="dialog-footer">
          <Button class="dialogBtn" @handleClick="rejectSuccess" title="确定"></Button>
          <Button class="dialogBtnF" @handleClick="rejectFailed" title="取消"></Button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import BusinessTitle from '@/components/BusinessTitle'
import EnterpriseDetail from './AdminEnterpriseDetail'
import settings from '@/settings'
export default {
  name: 'enterpriseApproveDetail',
  data () {
    return {
      title: '企业信息审核 - ',
      fristReason: '上传证件不清晰',
      secondeReason: '企业资质不符合要求',
      logoutDialogShow: false,
      rejectDialogShow: false,
      // 拒绝原因
      refuseReason: '',
      name: this.$route.query.name,
      // 审核状态
      adminAuditStatus: '',
      thirdPartyAuditStatus: '',
      creditCode: this.$route.query.creditCode,
      // 审批url
      enterpriseAuditUrl: settings.apiGateway.enterpriseAudit,
      // 获取企业审核信息详情
      auditEnterpriseDetailUrl: settings.apiGateway.auditEnterpriseDetail,
      eid: '',
      tagColor: '#22b9aa'
    }
  },
  created () {
    this.Id = Number(this.$route.query.id)
    // this.getAuditEnterpriseDetail()
    switch (this.$route.query.tag) {
      case '资金方':
        this.tagColor = '#118eea'
        this.title += '资金方'
        break
      case '企业方':
        this.tagColor = '#24b7ad'
        this.title += '企业方'
        break
      case '代理商':
        this.tagColor = '#e66b30'
        this.title += '代理商'
        break
      case '服务商':
        this.tagColor = '#938361'
        this.title += '服务商'
        break
    }
  },
  methods: {
    check (Reason) {
      this.refuseReason += Reason + ', '
      var maxlength = '30'
      if (this.refuseReason.length > maxlength) {
        var text = this.refuseReason.substring(0, maxlength)
        this.refuseReason = text
      }
    },
    statusData (statusData) {
      this.adminAuditStatus = statusData.adminAuditStatus
      this.thirdPartyAuditStatus = statusData.thirdPartyAuditStatus
      this.eid = statusData.eid
      this.creditCode = statusData.creditCode
    },
    getAuditEnterpriseDetail () {
      this.fetch(`${this.auditEnterpriseDetailUrl}${this.$route.query.id}`).then(data => {
        this.name = data.data.name
        this.creditCode = data.data.enterpriseAuthDetail.creditCode
        this.adminAuditStatus = data.data.adminAuditStatus
        this.thirdPartyAuditStatus = data.data.thirdPartyAuditStatus
      }).catch(data => {
        this.$message.error(data.data.msg)
      })
    },
    // 拒绝
    handleReject () {
      this.rejectDialogShow = true
    },
    // 拒绝注销弹窗确定按钮
    rejectSuccess () {
      if (!this.refuseReason.trim()) {
        this.$message.error('拒绝原因不能为空')
        return
      }
      if (this.refuseReason.trim().length > 30) {
        this.$message.error('拒绝原因不能超过30个字符')
        return
      }
      this.rejectDialogShow = false
      this.type = 'Rejected'
      let data = {
        creditCode: this.creditCode,
        refusalReason: this.refuseReason,
        type: this.type,
        id: this.$route.query.id
      }
      this.fetch(this.enterpriseAuditUrl, 'post', data).then(data => {
        this.$store.dispatch('updateCounters')
        // 显示成功弹层
        this.popUpSuccess({
          text: '操作成功',
          okBtn: '返回',
          ok: () => {
            this.$router.push('/admin/enterprise-approve')
          }
        })
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    // 拒绝注销弹窗取消按钮
    rejectFailed () {
      this.rejectDialogShow = false
    },
    // 注销
    handleLogout () {
      this.logoutDialogShow = true
    },
    // 注销弹窗确定按钮
    logoutSuccess () {
      this.logoutDialogShow = false
      this.type = 'Succeed'
      let data = {
        creditCode: this.creditCode,
        type: this.type,
        id: this.$route.query.id
      }
      if (this.eid) data.eid = this.eid
      this.fetch(this.enterpriseAuditUrl, 'post', data).then(data => {
        this.$store.dispatch('updateCounters')
        // 显示成功弹层
        this.popUpSuccess({
          text: '操作成功',
          okBtn: '返回',
          ok: () => {
            this.$router.push('/admin/enterprise-approve')
          }
        })
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    // 注销弹窗取消按钮
    logoutFailed () {
      this.logoutDialogShow = false
    }
  },
  components: {
    BusinessTitle,
    EnterpriseDetail
  },
  computed: {
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/variables';
.enterprise-title {
  text-align: center;
  color: #646464;
  height: 45px;
  line-height: 45px;
  background-color: #fcfcfc;
  font-size: 16px;
  .tag {
    margin-left: 15px;
    width: 49px;
    height: 19px;
    line-height: 19px;
    border: 0;
    color: #fff;
    padding: 0;
    vertical-align: text-bottom;
    // background-color: @theme-blue;
    // background-color: #25b7aa;
  }
}
.btn-main {
  margin: 42px auto 20px;
  width: 430px;
  .approval-button {
    width: 192px;
    height: 50px;
    font-size: 18px;
    border: none;
    background-color: @theme-blue;
    background-color: var(--mainColor);
    box-shadow: 1px 6px 4px @btn-disabled;
    box-shadow: 1px 6px 4px var(--mainTableHover);
  }
  .reject-button {
    background-color: #fff;
    border: 1px solid @theme-blue;
    border: 1px solid var(--mainColor);
    color: @theme-blue;
    color: var(--mainColor);
    float: right;
    box-shadow: 1px 6px 4px @btn-disabled;
    box-shadow: 1px 6px 4px var(--mainTableHover);
  }
}
.text {
  margin-top: 68px;
  margin: 68px 0 50px 0;
  font-size: 19px;
  text-align: center;
}
.refuse-text {
  height: 35px;
  line-height: 35px;
  font-size: 16px;
  text-align: left;
  margin-left: 68px;
}
.reason-container {
  width: 440px;
  height: 91px;
  margin: 20px auto;
  .reason-container-text {
    // display: inline-block;
    font-size: 16px;
    margin: 15px 20px 0 20px;
    float: left;
  }
  .reason {
    float: left;
    margin-left: 68px;
    width: 300px;
    height: 91px;
  }
}
.shortcut-choice {
  height: 35px;
  font-size: 16px;
  margin-left: 68px;
  margin-top: 10px;
}
.color-change {
  color: @theme-blue;
  color: var(--mainColor);
}
.dialog-footer {
  .dialogBtn {
    width: 195px;
    height: 50px;
    margin-right: 10px;
    font-size: 18px;
    background-color: @theme-blue;
    background-color: var(--mainColor);
    border-color: @theme-blue;
    border-color: var(--mainColor);
  }
  .dialogBtnF {
    width: 195px;
    height: 50px;
    font-size: 18px;
    background-color: #fff;
    color: @theme-blue;
    color: var(--mainColor);
    border-color: @theme-blue;
    border-color: var(--mainColor);
  }
}
.shortcut-key {
  display: inline-block;
  height: 30px;
  line-height: 30px;
  border-radius: 5px;
  padding: 0 12px;
  border: 1px solid #e1e1e1;
  background: #fff;
  font-size: 14px;
  color: #575757;
  cursor: pointer;
}
.shortcut-key:hover {
  color: #938361;
  border-color: #938361;
}
</style>

<style lang="less">
.enterprise-approve {
  .el-dialog {
    position: absolute;
    top: 50% !important;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    margin-top: 0 !important;
    margin-left: 108px;
  }
  .el-dialog--center .el-dialog__body {
    padding-bottom: 0px;
  }
}
.enterprise-approve .el-textarea__inner {
  height: 91px;
}
.enterprise-approve .el-dialog__footer {
  padding: 10px 20px 37px !important;
}
</style>
