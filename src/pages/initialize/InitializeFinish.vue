<template>
  <div>
    <Header></Header>
    <div class="initialize-finish-main">
      <InitializeHeader :stepInfo="stepInfo"></InitializeHeader>
      <div class="content">
        <div class="icon-box"><i class="el-icon-circle-check-outline success-icon"></i></div>
        <p class="title">恭喜, <span class="enterprise-name">{{enterpriseName}}</span> 账号已完成初始化</p>
        <Button  title="进入系统" class="initialize-finish-button" @handleClick="login"></Button>
      </div>
    </div>
  </div>
</template>

<script>
import settings from '@/settings'
import Header from '@/components/Header'
import InitializeHeader from '../../components/InitializeHeader'
export default {
  name: 'initializefinish',
  components: { Header, InitializeHeader },
  data () {
    return {
      // 步骤
      stepInfo: {
        list: ['个人认证', '企业认证', '账号初始化', '认证完成'],
        step: 4
      },
      // 企业名称
      enterpriseName: '',
      // 获取企业名
      getEnterpriseUrl: settings.apiGateway.getEnterprise
    }
  },
  created () {
    this.userRole = this.getUserRole()
    this.getEnterpriseName()
  },
  methods: {
    // 获取企业名称
    getEnterpriseName () {
      this.fetch(this.getEnterpriseUrl).then(data => {
        this.enterpriseName = data.data.name
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    // 完成初始化 进入系统
    login () {
      this.$router.replace('/' + this.userRole)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/variables';
.initialize-finish-main {
  width: 700px;
  margin: 0 auto;
  .content {
    text-align: center;
    .title {
      text-align: center;
      color: #585858;
      font-size: 16px;
      font-weight: 600;
      letter-spacing: 1px;
      .enterprise-name {
        // color: #0e8fea;
        color: @theme-blue;
        color: var(--mainColor);
      }
    }
    .icon-box {
      text-align: center;
      .success-icon {
        display: inline-block;
        font-size: 66px;
        color: #78bf3e;
        margin: 15px 0 29px 0;
      }
    }
    .initialize-finish-button {
      width: 400px;
      height: 45px;
      font-size: 18px;
      margin-top: 90px;
      background-color: @theme-blue;
      background-color: var(--mainColor);
      border: none;
      box-shadow: 1px 6px 4px @btn-disabled;
      box-shadow: 1px 6px 4px var(--mainTableHover);
    }
  }
}

</style>
