<template>
  <div>
    <AuthenticationTitle :stepInfo="stepInfo"></AuthenticationTitle>
    <div class="seek-enterprise">
      <el-form label-position="right" label-width="80px" class="enterprise-form">
        <el-form-item label="企业名称">
          <el-input v-model="enterpriseName" placeholder="输入公司名称 (全称)"></el-input>
          <div class="error-warning" v-if="nameError">
            <i class="el-icon-warning error-icon-warning"></i>
            <span class="login-error">企业名称由汉字与括号组成</span>
          </div>
        </el-form-item>
      </el-form>
      <el-button type="primary" class="seek-btn" @click="handleSeek">查询已认证企业</el-button>
    </div>
    <div class="enInfo" v-if="show">
      <div class="buyTableTitle">已创建企业档案</div>
      <div class="dotted"></div>
      <p style="marginBottom:14px">管理员姓名：{{enterprise.adminName}}<span
          style="marginLeft:100px">管理员电话：{{enterprise.adminMobile}}</span></p>
      <table>
        <tr>
          <td colspan="6" style="background:#F2F9FF;">企业信息</td>
        </tr>
        <tr>
          <td>企业名称</td>
          <td style="minWidth:90px">{{enterprise.name}}</td>
          <td>企业证件类型</td>
          <td>{{enterprise.isTern?'三证合一企业':'普通营业执照企业'}}</td>
          <td>{{enterprise.isTern?'统一社会信用代码':'营业执照注册号'}}</td>
          <td>{{enterprise.creditCode}}</td>
        </tr>
        <tr v-if="!enterprise.isTern">
          <td>组织机构代码</td>
          <td>{{enterprise.organizationalCode}}</td>
          <td>税务登记证号</td>
          <td>{{enterprise.taxRegistrationCertificate}}</td>
          <td>营业执照有效期</td>
          <td>{{enterprise.termValidity}}</td>
        </tr>
        <tr>
          <td v-if="enterprise.isTern">注册资本</td>
          <td v-if="enterprise.isTern">{{enterprise.registeredCapital}}万元</td>
          <td>营业执照有效期</td>
          <td>{{enterprise.termValidity}}</td>
          <td>固定电话</td>
          <td>{{enterprise.landLinePhone}}</td>
          <td v-if="!enterprise.isTern">行业</td>
          <td v-if="!enterprise.isTern">{{enterprise.industry}}</td>
        </tr>
        <tr>
          <td>注册地址</td>
          <td :colspan="enterprise.isTern?3:5">{{enterprise.registeredAddress}}</td>
          <td v-if="enterprise.isTern">行业</td>
          <td v-if="enterprise.isTern">{{enterprise.industry}}</td>
        </tr>
        <tr>
          <td>经营地址</td>
          <td colspan="5">{{enterprise.businessAddress}}</td>
        </tr>
        <tr>
          <td>经营范围</td>
          <td colspan="5">{{enterprise.businessScope}}</td>
        </tr>
      </table>
      <Button class="apply-btn" @handleClick="applyJoin" title="加入企业">加入企业</Button>
    </div>
    <!-- <div class="enterprise-message" v-if="show">
      <div class="search-result">搜索结果</div>
      <table>
        <tr>
          <td>企业名称</td>
          <td>{{enterprise.name}}</td>
          <td>管理员</td>
          <td>{{enterprise.adminName}}</td>
          <td>联系方式</td>
          <td>{{enterprise.adminMobile}}</td>
        </tr>
      </table>
      <Button class="apply-btn" @handleClick="applyJoin" title="申请加入该企业">申请加入该企业</Button>
    </div> -->
    <el-dialog title="抱歉的通知您" :visible.sync="centerDialogVisible" width="500px" top="300px" :show-close='false'
      :close-on-click-modal='false' :close-on-press-escape='false' center>
      <div>
        <p>您的企业信息审核已被<span class="color-red">拒绝</span>。</p>
        <p class="refuse-reason">拒绝原因: <span class="color-red">{{this.refusalReason}}</span></p>
        <p style="line-height:20px;">请再次核对企业信息,按照拒绝原因进行修改并再次提交。有任何疑问请详询官方客服电话101-89532114,给您造成的不便请谅解。</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <Button class="dialogBtn" type="primary" @handleClick="goEnterpriseInfo" title="确定"></Button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import settings from '@/settings'
import { Setitem, Getitem } from '@/services/CommonService'
import AuthenticationTitle from '../AuthenticationTitle'
export default {
  components: {
    AuthenticationTitle
  },
  data () {
    return {
      enterpriseName: '',
      getName: '',
      nameError: false,
      show: false,
      enterprise: {
        name: '',
        adminName: '',
        adminMobile: '',
        isTern: false
      },
      stepInfo: {
        list: ['账户注册', '个人实名认证', '企业实名认证', '对公银行账户信息'],
        step: 3
      },
      sysRole: '',
      // 检测企业信息是否通过
      checkAuditSatus: settings.apiGateway.checkAuditSatus,
      refusalReason: '',
      userId: '',
      centerDialogVisible: false,
      // 企业初始化信息用于重新修改提交
      getEnterpriseInitInfoUrl: settings.apiGateway.getEnterpriseInitInfo,
      getEnterpriseMessageUrl: settings.apiGateway.getEnterpriseMessage,
      // 申请加入企业
      joinEnterpriseUrl: settings.apiGateway.joinEnterprise,
      getApplyInfoUrl: settings.apiGateway.getApplyInfo
    }
  },
  methods: {
    verifyCompanyName () {
      this.noCompany = false
      let name = /(^[\u4E00-\u9FFF()（）]+$)/
      if (!name.test(this.enterpriseName)) {
        this.nameError = true
        return true
      } else {
        this.nameError = false
      }
    },
    handleSeek () {
      this.verifyCompanyName()
      if (this.verifyCompanyName()) return
      if (this.enterpriseName) {
        // 去除空格
        this.enterpriseName = this.enterpriseName.trim()
        if (this.enterpriseName === this.getName) {
          this.$router.push({
            path: '/authentication/enterprise-certificate/step4',
            query: {
              enterpriseName: this.enterpriseName,
              backStep: 'true',
              sysRole: this.sysRole
            }
          })
          return
        }
        this.fetch(`${this.getEnterpriseMessageUrl}${this.enterpriseName}`).then(data => {
          this.enterprise = data.data
          if (this.enterprise === null) {
            this.$router.push({
              path: '/authentication/enterprise-certificate/step4',
              query: {
                enterpriseName: this.enterpriseName,
                sysRole: this.sysRole
              }
            })
          } else {
            if (this.enterprise.status === 'Succeed') {
              this.show = true
              this.enterprise.adminMobile = this.enterprise.adminMobile.replace(/(.{3})(.+)(.{4})/, (x, y, z, p) => {
                let i = ''
                while (i.length < z.length) {
                  i += '*'
                }
                return y + i + p
              })
            } else if (this.enterprise.status === 'Pending' || this.enterprise.status === 'PspPending') {
              this.$message.error('该账户已被注册，请重新输入')
            } else if (this.enterprise.status === 'Rejected' || this.enterprise.status === 'OpenFailed') {
              this.$router.push({
                path: '/authentication/enterprise-certificate/step4',
                query: {
                  enterpriseName: this.enterpriseName,
                  sysRole: this.sysRole
                }
              })
            } else {
              this.$message.error('企业信息已存在')
            }
          }
        }).catch(data => {
          this.$message({
            type: 'error',
            message: data.data.msg
          })
        })
      }
    },
    applyJoin () {
      this.fetch(`${this.joinEnterpriseUrl}${this.enterprise.eid}`, 'post').then(data => {
        this.$router.push('/authentication/enterprise-certificate/step2')
      }).catch(data => {
        if (data.data.code === 2043) {
          this.$router.push('/authentication/enterprise-certificate/step2')
        }
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    checkStatus () {
      // clearInterval(this.timer)
      this.fetch(this.checkAuditSatus).then(data => {
        if (data.data.status === 'Rejected') {
          // 要弹窗
          this.refusalReason = data.data.refusalReason
          this.userId = data.data.userId
          // this.centerDialogVisible = true
        } else if (data.data.status === 'Pending') {
          Setitem('perfectState', 3)
          // 修改步骤
          let userData = JSON.parse(Getitem('userData'))
          userData.perfectState = '3'
          Setitem('userData', JSON.stringify(userData))
          this.$router.push('/authentication/initialization')
        }
      }).catch(res => {
        this.$message.error(res.data.msg)
      })
    },
    goEnterpriseInfo () {
      this.centerDialogVisible = false
      this.$router.push({
        path: '/authentication/enterprise-certificate/step3',
        query: {
          userId: this.userId,
          noShow: this.noShow
        }
      })
    },
    getEpInfo () {
      this.fetch(this.getEnterpriseInitInfoUrl).then(data => {
        if (!data.data) return
        this.enterpriseName = data.data.name
        this.sysRole = data.data.sysRole.toLowerCase()
        this.getName = data.data.name
      }).catch(res => {
        this.$message.error(res.data.msg)
      })
    }
  },
  created () {
    Setitem('perfectState', 2)
    let userData = JSON.parse(Getitem('userData'))
    userData.perfectState = '2'
    Setitem('userData', JSON.stringify(userData))
    this.getEpInfo()
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/less/variables';
.error-warning {
  color: red;
  padding-bottom: 5px;
  // left: 8rem;
  // top: 0;
  position: absolute;
}
.seek-enterprise {
  width: 600px;
  height: 70px;
  margin: 40px auto;
  .enterprise-form {
    float: left;
    .el-input {
      width: 350px;
    }
  }
  .seek-btn {
    float: right;
  }
}
.enterprise-message {
  height: 200px;
  margin: 40px auto;
  .search-result {
    width: 100%;
    height: 41px;
    line-height: 41px;
    text-align: center;
    background-color: #e5e5e5;
    border-top: 1px solid #e1e1e1;
  }
}
.enInfo {
  width: 832px;
  margin: 0 auto;
}
.buyTableTitle {
  width: 375px;
  height: 16px;
  font-size: 16px;
  font-weight: bold;
  color: rgba(101, 101, 101, 1);
  margin: 18px 0 15px;
  padding-left: 9px;
  border-left: 4px solid @theme-blue;
  border-left: 4px solid var(--mainColor);
}
table {
  width: 100%;
  tr {
    td {
      height: 42px;
      padding-left: 10px;
      border: 1px solid #e6e6e6;
      font-size: 14px;
      &:nth-of-type(2n + 1) {
        width: 130px;
        text-align: center;
        padding: 0;
        background-color: #fafafa;
      }
    }
  }
}
.apply-btn {
  width: 404px;
  height: 50px;
  font-size: 18px;
  margin: 50px 0 0 242px;
  box-shadow: 1px 6px 4px @btn-disabled;
  box-shadow: 1px 6px 4px var(--mainTableHover);
}
.dotted {
  border-top: 1px dotted #000;
  width: 100%;
  height: 1px;
  margin-bottom: 30px;
}
</style>

<style>
.seek-enterprise .el-input__inner:focus {
  border-color: #108ee9;
}
</style>
