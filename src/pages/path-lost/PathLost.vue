<template>
  <div class="lost-container">
    <Header :showElse="showElse"></Header>
    <div class="lost-main">
      <div :class="[isIE ? 'lost-main--img fund-lost' : styleClass]">
        <p>很抱歉,页面不小心迷路了~</p>
        <p>It looks like you are lost</p>
      </div>
      <el-button type="primary" @click="$router.push($route.query.path)" class="back-index">返回首页</el-button>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header'
export default {
  data () {
    return {
      showElse: false,
      styleClass: 'lost-main--img'
    }
  },
  components: {
    Header
  },
  created () {
    this.Role = this.getUserRole()
    this.setSystem(this.Role)
  },
  watch: {
    $route () {
      // 这里获取用户名的字段有待确认
      this.Role = this.getUserRole()
      this.setSystem(this.Role)
    }
  },
  methods: {
    setSystem (role) {
      switch (role) {
        case 'fund':
          this.styleClass += ' fund-lost'
          break
        case 'enterprise':
          this.styleClass += ' enterprise-lost'
          break
        case 'agent':
          this.styleClass += ' agent-lost'
          break
        case 'admin':
          this.styleClass += ' admin-lost'
          break
        case 'bonus':
          this.styleClass += ' admin-lost'
          break
        default:
          break
      }
    }
  },
  computed: {
    isIE () {
      return this.$store.state.isIE
    }
  }
}
</script>

<style lang="less" scoped>
  @import '~@/assets/less/variables.less';
  .lost-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .lost-main {
    width: 100%;
    height: 100%;
    border: 1px solid #f8f8f8;
    background-color: #f8f8f8;
    .lost-main--img {
      margin: 40px auto 10px;
      width: 500px;
      height: 350px;
      position: relative;
      p {
        position: absolute;
        text-align: center;
        width: 100%;
        font-size: 20px;
        height: 25px;
        line-height: 25px;
      }
      p:first-child {
        top: 300px;
      }
      p:last-child {
        font-size: 22px;
        top: 330px;
      }
    }
    .back-index {
      width: 300px;
      height: 50px;
      display: block;
      font-size: 18px;
      margin: 60px auto 0;
      border: none;
      background-color: @theme-blue;
      background-color: var(--mainColor);
    }
  }
  .fund-lost {
    background: url('~@/assets/img/404.png') no-repeat center;
  }
  .enterprise-lost {
    background: url('~@/assets/img/404_qyf.png') no-repeat center;
  }
  .agent-lost {
    background: url('~@/assets/img/404_dls.png') no-repeat center;
  }
  .admin-lost {
    background: url('~@/assets/img/404_ht.png') no-repeat center;
  }
</style>
