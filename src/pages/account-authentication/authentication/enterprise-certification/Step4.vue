<template>
  <div>
    <AuthenticationTitle :stepInfo="stepInfo"></AuthenticationTitle>
    <div class="select-systemrole">
      <p style="cursor: pointer; opacity: 0.5;"  @click="goBack"><i class="el-icon-arrow-left"></i>返回重新选择企业</p>
      <div class="systemrole">
        <dl class="agent-role" @click="selectRole('agent')" :class="{selectRole:changeSelectStyle == 'agent'}">
          <dt><svg-icon iconClass='dls_sy_gys' className='agent-total-icon'></svg-icon></dt>
          <dd>我是代理商</dd>
        </dl>
        <!-- <dl class="fund-role" @click="selectRole('fund')" :class="{selectRole:changeSelectStyle == 'fund'}">
          <dt><svg-icon iconClass='ht_sy_zjf' className='fund-client-total-icon'></svg-icon></dt>
          <dd>我是资金方</dd>
          <dd class="hint">买票方</dd>
        </dl> -->
        <dl class="enterprise-role" @click="selectRole('enterprise')" :class="{selectRole:changeSelectStyle == 'enterprise'}">
          <dt><svg-icon iconClass='ht_sy_qykh_a' className='enterprise-client-total-icon'></svg-icon></dt>
          <dd>我是企业方</dd>
          <dd class="hint">核心企业/供应商/持票企业等</dd>
        </dl>
      </div>
      <Button class="next-btn" type="primary"  title="下一步" @handleClick="nextBtn" :disabled="disabled"></Button>
    </div>
  </div>
</template>

<script>
import AuthenticationTitle from '../AuthenticationTitle'
// import { Getitem } from '@/services/CommonService'
export default {
  components: {
    AuthenticationTitle
  },
  data () {
    return {
      changeSelectStyle: '',
      systemRole: '',
      enterpriseName: this.$route.query.enterpriseName,
      stepInfo: {
        list: ['账户注册', '个人实名认证', '企业实名认证', '对公银行账户信息'],
        step: 3
      }
    }
  },
  methods: {
    goBack () {
      this.$router.push({
        path: '/authentication/enterprise-certificate/step1',
        query: {
          reset: true,
          backStep: this.$route.query.backStep
        }
      })
    },
    selectRole (role) {
      this.systemRole = role
      this.changeSelectStyle = role
    },
    nextBtn () {
      this.$router.push({
        path: '/authentication/enterprise-certificate/step3',
        query: {
          systemRole: this.systemRole,
          enterpriseName: this.enterpriseName,
          backStep: this.$route.query.backStep
        }
      })
    }
  },
  created () {
    this.systemRole = this.$route.query.sysRole
    this.changeSelectStyle = this.$route.query.sysRole
  },
  computed: {
    disabled () {
      if (this.systemRole) {
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
.select-systemrole {
  width: 710px;
  margin: 40px auto;
  padding-left: 43px;
  .systemrole {
    display: flex;
    margin-top: 37px;
    flex-direction: row;
    align-items: center;
    box-sizing: border-box;
    justify-content: center;
    cursor: pointer;
    .agent-role, .fund-role, .enterprise-role{
      width: 215px;
      height: 204px;
      border: 1px solid #ededed;
      border-radius: 5px;
      text-align: center;
      line-height: 40px;
      padding-top: 50px;
      font-size:18px;
      margin: 0 14px;
    }
    .selectRole {
      border-color: #0e8ee9
    }
    .hint {
      color: #9a9e9f;
      font-size: 14px;
    }
    .agent-role{
      color: #e76b2f;
      background: #fffaf7
    }
    .agent-role:hover {
      border-color: #0e8ee9
    }
    .fund-role{
      color: #0e8ee9;
      background: #f2f9ff;
    }
    .fund-role:hover {
      border-color: #0e8ee9
    }
    .enterprise-role {
      color: #22b8ac;
      background: #f6fffe
    }
    .enterprise-role:hover {
      border-color: #0e8ee9
    }
    .agent-total-icon, .fund-client-total-icon, .enterprise-client-total-icon {
      display: inline-block;
      width: 40px!important;
      height: 40px!important;
      vertical-align: middle;
    }
    .enterprise-client-total-icon {
      color: #24b8aa;
    }
  }
  .next-btn {
    width: 403px;
    height:50px;
    border-radius: 3px;
    margin: 69px 0 0 154px;
  }
}
</style>
