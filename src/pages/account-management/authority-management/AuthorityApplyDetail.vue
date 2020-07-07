<template>
  <div class="authorityApplyDetail">
    <BusinessTitle title="审核加入申请" isShowBack></BusinessTitle>
    <div class="apply-table">
      <table>
        <tr>
          <td>姓名</td>
          <td>{{authorityApply.realName}}</td>
        </tr>
        <tr>
          <td>身份证号码</td>
          <td>{{authorityApply.idNumber}}</td>
        </tr>
        <tr>
          <td>手机号码</td>
          <td>{{authorityApply.userName}}</td>
        </tr>
        <tr>
          <td>申请时间</td>
          <td>{{authorityApply.applyTime}}</td>
        </tr>
      </table>
      <div class="set-identity">
        <span class="title">设置身份</span>
        <el-select v-model="identity" placeholder="请选择" style="width:400px">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <div style="margin-top: 38px">
          <Button class="dialogBtn" @handleClick="confirm" title="确定"></Button>
          <Button class="dialogBtn" @handleClick="cancel" title="拒绝"></Button>
        </div>
      </div>
    </div>
    <div class="dialogs">
      <el-dialog :visible.sync="confirmDialogShow" width="568px" top="290px" :before-close="closeDialog" center>
        <p class="hint">
          <span>是否确定设置</span>
          <span class="color-text">{{authorityApply.realName}}</span>
          <span>为</span>
          <span class="color-text">操作员？</span>
        </p>
        <div slot="footer" class="dialog-footer">
          <Button class="dialogBtn" @handleClick="confirmSuccess" title="确定"></Button>
          <Button class="dialogBtnF" @handleClick="logoutFailed" title="取消"></Button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="cancelDialogShow" width="568px" top="290px" :before-close="closeDialog" center>
        <p class="hint">
          <span>是否确定拒绝</span>
          <span class="color-text">{{authorityApply.realName}}</span>
          <span>的加入申请？</span>
        </p>
        <div slot="footer" class="dialog-footer">
          <Button class="dialogBtn" @handleClick="cancelSuccess" title="确定"></Button>
          <Button class="dialogBtnF" @handleClick="logoutFailed" title="取消"></Button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="SuccessDialogShow" width="568px" top="290px" :before-close="closeDialog" center>
        <div class="check-record">
          <div><i class="el-icon-circle-check-outline"></i></div>
          <div class="success-text">操作成功</div>
          <div>
            <span>您还可以</span>
            <span class="record" @click="checkRecord">查看审批记录</span>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <Button class="dialogBtn" @handleClick="Success" title="返回"></Button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import settings from '@/settings'
import BusinessTitle from '@/components/BusinessTitle'
export default {
  components: {
    BusinessTitle
  },
  data () {
    return {
      authorityApply: {},
      identity: '操作员',
      options: [{
        label: '操作员',
        value: '操作员'
      }],
      Operator: 'Operator',
      id: this.$route.query.id,
      confirmDialogShow: false,
      cancelDialogShow: false,
      SuccessDialogShow: false,
      auditApplyDetailUrl: settings.apiGateway.auditApplyDetail,
      auditApplyUrl: settings.apiGateway.auditApply
    }
  },
  methods: {
    auditApplyDetail () {
      this.fetch(`${this.auditApplyDetailUrl}${this.id}`).then(data => {
        this.authorityApply = data.data
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    confirm () {
      this.confirmDialogShow = true
    },
    cancel () {
      this.cancelDialogShow = true
    },
    confirmSuccess () {
      this.confirmDialogShow = false
      this.auditApply('Succeed')
    },
    cancelSuccess () {
      this.cancelDialogShow = false
      this.auditApply('Rejected')
    },
    logoutFailed () {
      this.confirmDialogShow = false
      this.cancelDialogShow = false
    },
    closeDialog () {
      this.confirmDialogShow = false
      this.cancelDialogShow = false
      this.SuccessDialogShow = false
    },
    Success () {
      this.$router.push('/' + this.userRole + '/authority-apply')
    },
    checkRecord () {
      this.$router.push('/' + this.userRole + '/authority-apply')
    },
    auditApply (status) {
      let auditStatus = status
      this.fetch(`${this.auditApplyUrl}${this.id}/${auditStatus}/${this.Operator}`, 'post').then(data => {
        if (auditStatus === 'Succeed') {
          this.SuccessDialogShow = true
          this.$store.dispatch('updateCounters')
        } else if (auditStatus === 'Rejected') {
          this.SuccessDialogShow = true
          this.$store.dispatch('updateCounters')
        }
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    }
  },
  created () {
    this.userRole = this.getUserRole()
    this.auditApplyDetail()
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/variables';
.apply-table {
  width: 100%;
  margin: 50px 0;
  table {
    width: 576px;
    margin: 0 auto;
    tr {
      td {
        height: 40px;
        border: 1px solid #e6e6e6;
        background-clip: padding-box;
      }
      td:first-child {
        width: 174px;
        text-align: center;
        padding: 0 15px;
      }
      td:last-child {
        text-align: left;
        padding-left: 20px;
      }
    }
    tr:nth-child(2n) {
      background-color: @theme-blue-light;
      background-color: var(--mainLightColor);
    }
  }
  .set-identity {
    width: 576px;
    margin: 32px auto;
    .title {
      padding: 0 18px 0 10px;
    }
  }
  .dialogBtn {
    width: 242px;
    height: 50px;
    margin-right: 10px;
    font-size: 18px;
    background-color: @theme-blue;
    background-color: var(--mainColor);
    border-color: @theme-blue;
    border-color: var(--mainColor);
    box-shadow: 1px 6px 4px @btn-disabled;
    box-shadow: 1px 6px 4px var(--mainTableHover);
    &:nth-child(1) {
      margin-left: 34px;
    }
  }
}
.hint {
  height: 120px;
  line-height: 120px;
  text-align: center;
  width: 100%;
  font-size: 18px;
}
.check-record {
  text-align: center;
  width: 100%;
  font-size: 14px;
  .el-icon-circle-check-outline {
    font-size: 66px;
    color: #78bf3f;
  }
  .success-text {
    font-weight: 700;
    padding: 19px 0;
    font-size: 18px;
  }
  .record {
    cursor: pointer;
    text-decoration: underline;
    color: @theme-blue;
    color: var(--mainColor);
    margin-left: 11px;
  }
}
.color-text {
  color: @theme-blue;
  color: var(--mainColor);
  padding: 0 10px;
}
.dialogBtn {
  width: 211px;
  height: 50px;
  margin-right: 10px;
  font-size: 18px;
  background-color: @theme-blue;
  background-color: var(--mainColor);
  border-color: @theme-blue;
  border-color: var(--mainColor);
}
.dialogBtnF {
  width: 211px;
  height: 50px;
  font-size: 18px;
  background-color: #fff;
  color: @theme-blue;
  color: var(--mainColor);
  border-color: @theme-blue;
  border-color: var(--mainColor);
}
</style>

<style lang="less">
.dialogs .el-dialog {
  position: absolute;
  top: 50% !important;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  margin-top: 0 !important;
  margin-left: 108px;
}
.authorityApplyDetail .el-dialog__footer {
  padding: 10px 20px 37px !important;
}
</style>
