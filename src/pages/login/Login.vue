<template>
  <div class="loginItem">
    <div class="logo">
      <!-- <div class='image fund-logo'></div> -->
      <svg-icon iconClass='dls_logo' className='image'></svg-icon>
    </div>
    <div class="login-main">
      <el-form label-width="80px">
        <el-form-item label="手机号码">
          <el-input v-model="userInfo.userName" placeholder="请输入手机号码" @blur="verifyPhone"></el-input>
          <div v-if="errorWarning.userNameError" class="error-warning">
            <i class="el-icon-warning error-icon-warning"></i>
            <span class="show-error">手机号格式有误</span>
          </div>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="userInfo.password" placeholder="请输入密码" @blur="verifyPassword"
            autocomplete="new-password"></el-input>
          <div v-if="errorWarning.passwordError" class="error-warning">
            <i class="el-icon-warning error-icon-warning"></i>
            <span class="show-error">密码有误,请重试</span>
          </div>
        </el-form-item>
        <el-form-item label="验证码">
          <el-input type="phone" class="code-input" v-model="codeInfo.imgCode" placeholder="请输入验证码"></el-input>
          <div class="code-img-box">
            <img class="code-img" :src="imgSrc" alt="图片验证码">
            <span class="refresh-button" @click="getImgCode">
              <div class="el-icon-refresh refresh-icon"></div>
            </span>
          </div>
          <div v-if="errorWarning.imgCodeError" class="error-warning">
            <i class="el-icon-warning error-icon-warning"></i>
            <span class="show-error">验证码有误</span>
          </div>
        </el-form-item>
        <el-form-item>
          <div style="line-height:25px">
            <span>
              <el-checkbox class="remember" v-model="checked">记住用户名</el-checkbox>
            </span>
            <span class="forget" @click="goRouter">忘记密码?</span>
          </div>
        </el-form-item>
        <el-button type="primary" :disabled="loginActive" class="login-button" @click="handleLogin">登录</el-button>
      </el-form>
      <div class="no-regist">
        <span>还未加入？请联系您的合作伙伴，或者企业管理员，为您发送注册邀请！</span>
      </div>
    </div>
    <el-dialog :visible.sync="reverseSample" center width="568px">
      <p class="mindText">管理员邀请您加入</p>
      <p class="mindText colorMain">{{enpName}}</p>
      <p class="mindText">您同意加入吗？</p>
      <div class="dialog-footer">
        <Button class="reject-btn" title="拒绝" @handleClick="rejectJoin"></Button>
        <Button class="confirm-btn" title="同意" @handleClick="agreeJoin"></Button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import settings from '@/settings'
import { Getitem, Setitem, Removeitem, clearStorage } from '../../services/CommonService'
export default {
  name: 'login',
  data () {
    return {
      // 用户信息
      userInfo: {
        userName: '',
        password: '',
        imgCode: '',
        csrfCode: '',
        sign: '',
        data: ''
      },
      enpName: '',
      reverseSample: false,
      // 验证码信息
      codeInfo: {
        imgCode: '',
        csrfCode: ''
      },
      // 错误提示
      errorWarning: {
        userNameError: false,
        passwordError: false,
        imgCodeError: false
      },
      // 登录后 返回的用户数据
      userData: {
        token: '',
        role: '',
        perfectState: '',
        adminName: ''
      },
      // 记住我
      checked: false,
      // 图片验证码路径
      imgSrc: '',
      // 登录 Url
      loginUrl: settings.apiGateway.loginUrl,
      // 请求csrfCode Url
      getCsrfCodeUrl: settings.apiGateway.getCsrfCode,
      // 图片验证码 Url
      getImgCodeUrl: settings.apiGateway.getImgCode,
      // 个人初始化时判断操作员是否已加入公司
      getApplyInfoUrl: settings.apiGateway.getApplyInfo,
      // 加入企业
      joinUrl: settings.apiGateway.joinUrl
    }
  },
  created () {
    this.getImgCode()
    // 是否勾选记住我
    let remember = Getitem('userName')
    if (remember) {
      this.userInfo.userName = remember
      this.checked = true
    } else {
      this.checked = false
    }
  },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      vm.getImgCode()
    })
  },
  methods: {
    // 校验手机号码
    verifyPhone () {
      // this.verifyUser()
      let number = /^[1][3,5,7,8][0-9]{9}$/
      if (!number.test(this.userInfo.userName)) {
        this.errorWarning.userNameError = true
        return true
      } else {
        this.errorWarning.userNameError = false
      }
    },
    // 校验密码位数
    verifyPassword () {
      let password = /^.{6,16}$/
      if (!password.test(this.userInfo.password)) {
        this.errorWarning.passwordError = true
        return true
      } else {
        this.errorWarning.passwordError = false
      }
    },
    keyCodeEvent () {
      // 主页添加键盘事件 注意 不能直接在焦点事件上添加回车
      let that = this
      let nowRouter = this.$route.path
      if (nowRouter === '/login') {
        document.onkeydown = function (e) {
          let key = window.event.keyCode
          if (key === 13) {
            that.handleLogin()
          }
        }
      }
    },
    // 请求验证码标识
    getImgCode () {
      this.fetch(this.getCsrfCodeUrl).then(data => {
        this.imgSrc = `${settings.domain.domain}${this.getImgCodeUrl}/${data.data.csrfCode}`
        this.codeInfo.csrfCode = data.data.csrfCode
      }).catch(data => {
        this.$message({
          type: 'error',
          message: '验证码获取失败'
        })
      })
    },
    agreeJoin () {
      this.fetch(`${this.joinUrl}/agree/${this.$route.query.data}`, 'post').then(({ data }) => {
        if (data.perfectState === '4') {
          this.$router.push(`/${data.systemRole}`)
        } else if (data.perfectState === '1') {
          // 用户个人信息
          this.$router.push({
            path: '/authentication/personal-certificate',
            query: {
              data: this.$route.query.data
            }
          })
        }
        Setitem('perfectState', data.perfectState)
        Setitem('userData', JSON.stringify(data))
      }).catch(data => {
        this.$message.error(data.data.msg)
      })
    },
    rejectJoin () {
      this.fetch(`${this.joinUrl}/cancel/${this.$route.query.data}`, 'post').then(({ data }) => {
        Setitem('perfectState', data.perfectState)
        this.$router.push('/out-of-work')
      }).catch(data => {
        this.$message.error(data.data.msg)
      })
    },
    // 登录
    handleLogin () {
      this.userInfo.imgCode = this.codeInfo.imgCode
      this.userInfo.csrfCode = this.codeInfo.csrfCode
      this.$route.query.sign ? this.userInfo.sign = this.$route.query.sign : delete this.userInfo.sign
      this.$route.query.data ? this.userInfo.data = this.$route.query.data : delete this.userInfo.data
      // const dataParams = new URLSearchParams()
      // for (var key in this.userInfo) {
      //   dataParams[key] = this.userInfo[key]
      // }
      this.fetch(this.loginUrl + `?time=${new Date().getTime()}`, 'post', this.userInfo).then(data => {
        clearStorage()
        this.userData = data.data
        // 登录时 存储用户信息
        Setitem('userData', JSON.stringify(this.userData))
        Setitem('token', data.data.token)
        if (this.checked) {
          Setitem('userName', this.userInfo.userName)
        }
        // 如果是加入企业需要显示弹框
        if (data.data.show) {
          this.enpName = data.data.joinEnpName
          this.reverseSample = true
          return
        }
        if (this.userData.userStatus === 'WAIT_BIND') {
          this.$router.push('/out-of-work')
          return
        }
        let managerialRole = data.data.systemRole
        if (data.data.systemRole !== null) {
          managerialRole = managerialRole.toLowerCase()
        }
        // if (managerialRole === 'bonus') {
        //   this.$router.push('/bonus')
        //   return
        // }
        if (data.data.systemRole === null) {
          this.$router.push('/authentication')
          return
        }
        // 根据返回信息 判断用户信息完整度 跳转相应的页面
        let initializeProgress = data.data.perfectState
        Setitem('perfectState', initializeProgress)
        if (data.data.systemRole !== null) {
          if (initializeProgress === '1') {
            // 用户个人信息
            this.$router.push('/authentication/personal-certificate')
          } else if (initializeProgress === '2') {
            // 创建或加入企业
            this.$router.push('/authentication/enterprise-certificate')
          } else if (initializeProgress === '3') {
            // 银行信息
            this.$router.push({
              path: '/authentication/enterprise-certificate/step5',
              query: {
                enterpriseName: this.userData.enpName
              }
            })
          } else if (initializeProgress === '5' || initializeProgress === '6') {
            // 等待认证
            this.$router.push('/authentication/initialization')
          } else if (initializeProgress === '4') {
            // 认证成功
            this.$store.commit('setUserToken', null)
            this.$router.push(`/${managerialRole}`)
          }
        } else if (initializeProgress < 4) {
          this.$router.push('/authentication')
        } else {
          this.$router.push(`/${managerialRole}`)
        }
        //  else if (initializeProgress === '7') {
        //     // 最后签约
        //     let query = data.data.role === 'Admin' ? { registStatus: 1 } : { status: 'Succeed' }
        //     this.$router.push({
        //       path: '/authentication/finished',
        //       query: query
        //     })
        //   }
      }).catch(data => {
        this.getImgCode()
        if (data.data.code === 2002) {
          this.errorWarning.imgCodeError = true
          setTimeout(() => {
            this.errorWarning.imgCodeError = false
          }, 2000)
        } else if (data.data.code === 2024) {
          this.$message.error('用户名或密码错误')
        } else if (data.data.code === 2025) {
          this.$message({
            type: 'error',
            message: data.data.msg
          })
        }
      })
    },
    // 跳转到忘记密码页
    goRouter () {
      this.$router.push({
        path: '/forgetpass',
        query: {
          userName: this.userInfo.userName
        }
      })
    },
    handleRegist () {
      this.$router.push('/register')
    }
  },
  computed: {
    loginActive () {
      if (this.userInfo.userName && this.userInfo.password && this.codeInfo.imgCode) {
        this.keyCodeEvent()
        return false
      } else {
        return true
      }
    }
  },
  watch: {
    checked (cur) {
      if (cur) {
        Setitem('userName', this.userInfo.userName)
      } else {
        Removeitem('userName')
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
  margin-top: 77px;
  margin-bottom: 81px;
  font-size: 30px;
  height: 44px;
  color: @btn-bg-color;
  text-align: center;
  p {
    height: 32px;
    line-height: 32px;
    margin-bottom: 3px;
  }
  span {
    color: #b8b8b8;
    font-size: 14px;
  }
}
.mindText {
  font-size: 20px;
  color: rgba(87, 87, 87, 1);
  line-height: 42px;
  text-align: center;
}
.dialog-footer {
  width: 447px;
  margin: 0 auto;
  margin-top: 45px;
  .reject-btn,
  .confirm-btn {
    width: 211px;
    height: 50px;
    border: 1px solid @theme-blue;
    font-size: 18px;
  }
  .reject-btn {
    background: #ffffff;
    color: @theme-blue;
    &:hover {
      background: #ffffff;
      color: @theme-blue;
    }
  }
  .confirm-btn {
    background: @theme-blue;
    color: #ffffff;
    &:hover {
      background: @theme-blue;
      color: #ffffff;
    }
  }
}
.colorMain {
  color: #108ee9;
}
.login-main {
  margin: 0 auto;
  width: 525px;
  .error-warning {
    position: absolute;
    left: 375px;
    top: 0;
    width: 200px;
  }
  .show-error {
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
  .remember {
    color: @gray-shallow;
    cursor: pointer;
  }
  .forget {
    margin-left: 200px;
    color: #108ee9;
    text-decoration: underline;
    cursor: pointer;
  }
  .code-input {
    width: 205px;
    float: left;
  }
  .code-img-box {
    width: 162px;
    height: 43px;
    float: left;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
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
    width: 370px;
    height: 45px;
    margin-left: 80px;
    font-size: 18px;
    border: none;
    letter-spacing: 8px;
    box-shadow: 1px 6px 4px #c0e2fa;
    box-shadow: 1px 6px 4px #c0e2fa;
    letter-spacing: 8px;
  }
}
.login-main .el-button.is-disabled {
  color: #fff;
  background-color: @theme-blue;
  border-color: @theme-blue;
  opacity: 0.5;
  letter-spacing: 8px;
}
.image {
  width: 220px !important;
  height: 69px !important;
  vertical-align: middle;
  color: @theme-blue;
  margin: 0 auto;
  display: inline-block;
  background-repeat: no-repeat;
}
// .fund-logo {
//   background-size: cover;
//   background-image:url('~@/assets/img/login_logo.png');
// }
.no-regist {
  margin-top: 30px;
  margin-left: 61px;
  font-size: 14px;
  // font-family: SimSun;
  color: rgba(44, 44, 44, 1);
  opacity: 0.75;
}
</style>

<style lang="less">
.login-main .el-input {
  width: 370px;
}
.login-main .el-input__inner {
  height: 45px;
  line-height: 14px;
  padding-top: 12px;
  padding-bottom: 12px;
  background: #fcfcfc;
}
.login-main .el-input__inner:focus {
  border-color: #108ee9;
}
.login-main .el-checkbox__input.is-checked .el-checkbox__inner,
.login-main .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #409eff !important;
  border-color: #409eff !important;
}
.loginItem .el-dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: 0 !important;
  transform: translate3d(-50%, -50%, 0);
}
</style>
