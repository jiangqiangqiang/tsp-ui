<template>
  <div class="authority-list">
    <BusinessTitle title="权限管理" :inviteText="role === 'admin'?'邀请用户':''"></BusinessTitle>
    <!-- <div class="review-apply">
      <el-badge :value="badge" :max="99" class="item">
        <el-button type="primary" plain class="review-btn" @click="handleApply">审核加入申请</el-button>
      </el-badge>
    </div> -->
    <div style="marginTop:22px;padding: 0 20px;">
      <el-table :data="AuthorityList" border stripe style="width: 100%" header-align='center'
        class="TopUpList credit-table-color-blue sy-global-has-gutter__th--text-center sy-global-el-table-fit--border">
        <el-table-column type="index" label="序号" width='100'>
        </el-table-column>
        <el-table-column prop="adminName" label="姓名">
        </el-table-column>
        <el-table-column prop="adminIdNumber" label="身份证号">
        </el-table-column>
        <el-table-column prop="adminMobile" label="手机号码 (账户)" width="200">
        </el-table-column>
        <el-table-column prop="enterpriseAdminStatus" label="身份" width="160">
          <template slot-scope="scope">
            {{enterpriseAdminName[scope.row.enterpriseAdminStatus]}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope" v-if="scope.row.enterpriseAdminStatus === 'Operator'">
            <el-button @click="handleFire(scope.row)" type="text" size="small" class="operation-btn">解除绑定</el-button>
            <el-button type="text" size="small" class="operation-btn" @click="replaceAdmin(scope.row)">替换为管理员
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row class="sy-global--Pagination--bg" style="margin-bottom: 2rem" v-if="AuthorityList.length>0">
        <el-col>
          <div class="sy-global__div--Pagination sy-global-pull-right">
            <el-pagination @current-change="pageChange" @size-change="sizeChange" :page-sizes="pageSizes"
              :pageSize="pageSize" :current-page="pageNo" layout="total, sizes, prev, pager, next, jumper"
              :total="totalCnt">
            </el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="change-or-unbound">
      <el-dialog center title="验证现管理员身份" :visible.sync="changeAdminDialogShow" width="568px" top="290px"
        :before-close="closeDialog">
        <p class="prompt">为了您的账号安全, 请先进行身份验证</p>
        <el-form class="change-phone">
          <el-form-item>
            <el-input class="phone-input" v-model="showTelephoneNum" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input class="code-input" v-model="CsrfCode" placeholder="请输入短信验证码"></el-input>
            <el-button class="verification-code" :disabled="!codeStatus" @click="getCode">
              {{codeStatus? '获取验证码' : `${codeTime}秒后获取`}}</el-button>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <Button :disabled="basicInfoNextActive" class="next-button" @handleClick="changeAdmin" title="确定"></Button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="unboundDialogShow" width="568px" top="290px" :before-close="closeDialog" center>
        <p class="hint">
          <span>是否确认解除</span>
          <span class="color-text">{{unboundName}}</span>
          <span>与</span>
          <span class="color-text">{{enterprise}}</span>
          <span>的绑定关系？</span>
        </p>
        <div slot="footer" class="dialog-footer">
          <Button class="dialogBtn" @handleClick="logoutSuccess" title="确定"></Button>
          <Button class="dialogBtnF" @handleClick="logoutFailed" title="取消"></Button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import settings from '@/settings'
import BusinessTitle from '@/components/BusinessTitle'
import { Getitem } from '@/services/CommonService.js'
export default {
  components: {
    BusinessTitle
  },
  data () {
    return {
      badge: '',
      pageSize: 10,
      pageSizes: settings.pageSizes,
      pageNo: 1,
      totalCnt: 0,
      AuthorityList: [],
      unboundName: '',
      enterprise: JSON.parse(Getitem('userData')).enpName,
      changeAdminDialogShow: false,
      unboundDialogShow: false,
      sort: '',
      telephoneNumber: '',
      showTelephoneNum: '',
      userRole: '',
      role: '',
      // adminMobile: this.$store.state.adminMobile,
      // 状态枚举
      enterpriseAdminName: settings.enterpriseAdminStatusMap,
      CsrfCode: '',
      // 验证码状态
      codeStatus: true,
      // 验证码获取间隔
      codeTime: 60,
      // 发送短信验证码
      getSendCodeUrl: settings.apiGateway.adminSmsCode,
      // 获取手机号 Url
      getMobileUrl: settings.apiGateway.getMobile,
      // 获取管理员信息接口
      getEnterpriseAdminUrl: settings.apiGateway.getEnterpriseAdmin,
      // 替换管理员接口
      replaceAdminUrl: settings.apiGateway.replaceAdmin,
      // 解除绑定
      fireAuditUrl: settings.apiGateway.fireAudit
    }
  },
  methods: {
    getEnterpriseAdmin () {
      this.fetch(`${this.getEnterpriseAdminUrl}${this.pageNo - 1}/${this.pageSize}`).then(data => {
        this.AuthorityList = data.data.list
        this.badge = data.data.applyNum
        if (this.badge === 0) {
          this.badge = ''
        }
        this.totalCnt = data.data.totalCnt
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    handleApply () {
      this.$router.push('/' + this.userRole + '/authority-apply')
    },
    // 获取手机号
    getMobile () {
      this.fetch(this.getMobileUrl).then(data => {
        this.telephoneNumber = data.data
      }).catch(data => {
        this.$message.error(data.msg)
      })
    },
    // 解除绑定
    handleFire (row) {
      this.sort = 'unbound'
      this.uid = row.uid
      this.unboundName = row.adminName
      this.showTelephoneNum = `请使用手机 ${this.telephoneNumber.replace(/(.{3})(.+)(.{4})/, (x, y, z, p) => {
        let i = ''
        while (i.length < z.length) {
          i += '*'
        }
        return y + i + p
      })} 验证`
      this.unboundDialogShow = true
    },
    // 替换按钮
    replaceAdmin (row) {
      this.sort = 'change'
      this.showTelephoneNum = `请使用手机 ${this.telephoneNumber.replace(/(.{3})(.+)(.{4})/, (x, y, z, p) => {
        let i = ''
        while (i.length < z.length) {
          i += '*'
        }
        return y + i + p
      })} 验证`
      this.uid = row.uid
      this.alertConfirm({
        text: '是否替换管理员？',
        okBtn: '确定',
        infoBtn: '取消',
        ok: () => {
          this.changeAdminDialogShow = true
        }
      })
    },
    getCode () {
      this.codeCountDown()
      let data = {
        mobile: this.telephoneNumber,
        type: 'ValidMobile'
      }
      this.fetch(`${this.getSendCodeUrl}`, 'post', data).then(data => {
        this.$message.success('发送成功,请注意查收!')
      }).catch(data => {
        this.$message.error(data.msg)
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
          clearTimeout(time)
        } else {
          this.codeCountDown()
        }
      }, 1000)
    },
    // 关闭弹窗
    closeDialog () {
      this.CsrfCode = ''
      this.changeAdminDialogShow = false
      this.unboundDialogShow = false
    },
    // 确认替换/解绑
    changeAdmin () {
      this.changeAdminDialogShow = false
      if (this.sort === 'change') {
        this.fetch(`${this.replaceAdminUrl}${this.uid}/${this.CsrfCode}`, 'post').then(data => {
          this.popUpSuccess({
            text: '替换成功',
            okBtn: '返回',
            ok: () => {
              this.CsrfCode = ''
              this.logOut()
            }
          })
        }).catch(data => {
          this.$message({
            type: 'error',
            message: data.data.msg
          })
        })
      } else {
        this.fetch(`${this.fireAuditUrl}${this.uid}/${this.CsrfCode}`, 'post').then(data => {
          this.popUpSuccess({
            text: '解绑成功',
            okBtn: '返回',
            ok: () => {
              this.CsrfCode = ''
              this.getEnterpriseAdmin()
            }
          })
        }).catch(data => {
          this.$message({
            type: 'error',
            message: data.data.msg
          })
        })
      }
    },
    logoutSuccess () {
      this.unboundDialogShow = false
      this.changeAdminDialogShow = true
    },
    logoutFailed () {
      this.unboundDialogShow = false
    },
    pageChange (curPage) {
      this.pageNo = curPage
      this.getEnterpriseAdmin()
    },
    sizeChange (pageSize) {
      this.pageSize = pageSize
      this.getEnterpriseAdmin()
    }
  },
  created () {
    this.userRole = this.getUserRole()
    this.role = this.getRole()
    this.getEnterpriseAdmin()
    this.getMobile()
  },
  computed: {
    // 第一个弹框
    basicInfoNextActive () {
      if (this.CsrfCode) {
        return false
      } else {
        return true
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/variables';
.authority-list {
  .review-apply {
    position: relative;
    left: 960px;
    top: -60px;
    .review-btn {
      width: 133px;
      height: 41px;
    }
  }
  .operation-btn {
    text-decoration: underline;
    color: @theme-blue;
    color: var(--mainColor);
  }
  .prompt {
    text-align: center;
    color: #b6b6b6;
    font-size: 14px;
  }
  .change-phone {
    .el-form-item {
      width: 403px;
      margin: 0 auto;
    }
    //padding-left:58px;
    .phone-input {
      width: 100%;
      text-align: center;
      margin-bottom: 29px;
      margin-top: 25px;
    }
    .code-input {
      width: 290px;
    }
  }
  .verification-code {
    width: 108px;
    height: 42px;
    background-color: @theme-blue-light;
    background-color: var(--mainLightColor);
    color: @theme-blue;
    color: var(--mainColor);
    border-radius: 4px;
    border: 1px solid @theme-blue;
    border: 1px solid var(--mainColor);
  }
  .verification-code:focus {
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
  }
  .hint {
    height: 120px;
    line-height: 120px;
    text-align: center;
    width: 100%;
    font-size: 16px;
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
}
</style>

<style lang="less">
@import '~@/assets/less/variables';
.authority-list .el-button--primary.is-plain {
  border-color: @theme-blue;
  border-color: var(--mainColor);
  color: #4b4b4b;
  background-color: @theme-review;
  background-color: var(--mainReviewBtn);
}
.authority-list .el-button--primary.is-plain:hover {
  border-color: @theme-blue;
  border-color: var(--mainColor);
  color: #4b4b4b;
  background-color: @theme-review;
  background-color: var(--mainReviewBtn);
}
.authority-list .el-table .cell {
  text-align: center;
}
.authority-list .credit-table-color-blue tr {
  cursor: default;
  background-color: @table-bg;
  background-color: var(--mainTableBg) !important;
}
.authority-list .credit-table-color-blue .el-table__body tr {
  &:nth-of-type(2n + 1):hover > td {
    background-color: #e3eef8 !important;
    background-color: var(--mainTableHover) !important;
  }
}
.change-or-unbound .el-dialog {
  position: absolute;
  top: 50% !important;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  margin-top: 0 !important;
  margin-left: 108px;
}
</style>
