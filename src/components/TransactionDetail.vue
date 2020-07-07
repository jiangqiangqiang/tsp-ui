<!--
  交易清单页插件
    描述：  交易清单页面公共模板
    props:
      title: 模板的标题
      tradeType: 交易类型
      tradeCode: 交易编号
      txCodeRefer: 关联交易编号
      tradeTime: 交易时间
      tokenCode: 类型  现令/服务费
    attribute:
-->
<template>
  <div :class="styleClass">
    <div class="title">{{title}}</div>
    <div class="container">
      <div class="h20"></div>
      <div class="line-three">
        <div class="line-box">
          交易时间 ：{{tradeTime}}
        </div>
        <div class="line-box">
          交易编号 ：{{tradeCode}}
        </div>
        <div class="line-box" v-if="trade_back_code">
          回单号 ：{{trade_back_code}}
        </div>
      </div>
      <div class="h20"></div>
      <div class="line-box tradeType">
        交易类型 ：{{tradeType | tradeStatus}}
      </div>
      <div class="h20"></div>
      <slot></slot>
    </div>
    <div class="footerItem" v-if="operator_name">操作员 ：{{operator_name}}<span class="footerAdmin" v-if="admin_name">管理员 ：{{admin_name}}</span></div>
  </div>
</template>
<script>
export default {
  props: ['title', 'trade-type', 'trade-code', 'tx-code-refer', 'trade-time', 'token-code', 'trade_back_code', 'operator_name', 'admin_name'],
  data () {
    return {
      styleClass: 'common-transaction-detail'
    }
  },
  created () {
    // 拿到userData里的role 显示不同logo
    let isIE = this.$store.state.isIE
    let getRole = this.getUserRole()
    if (getRole === 'enterprise') {
      this.styleClass += ' y-role-bg'
    } else if (getRole === 'fund') {
      this.styleClass += ' x-role-bg'
    } else if (getRole === 'agent') {
      this.styleClass += ' agent-role-bg'
    } else if (getRole === 'admin') {
      this.styleClass += ' admin-role-bg'
    } else if (getRole === 'allocator') {
      this.styleClass += ' admin-role-bg'
    } else if (getRole === 'service') {
      this.styleClass += ' admin-role-bg'
    }
    if (isIE) {
      this.styleClass += ' x-role-bg'
    }
  },
  methods: {
  }
}
</script>
<style scoped lang='less'>
.y-role-bg {
  background-image: url('~@/assets/img/gys_zd_bg.gif');
}
.x-role-bg {
  background-image: url('~@/assets/img/x_zd_bg.gif');
}
.agent-role-bg {
  background-image: url('~@/assets/img/dls_zd_bg.gif');
}
.admin-role-bg {
  background-image: url('~@/assets/img/ht_zd_bg.gif');
}
.common-transaction-detail {
  width: 1136px;
  margin: 25px auto 0;
  position: relative;
  height: 492px;
  border-right: 1px solid #e1e1e1;
  .title {
    text-align: center;
    line-height: 114px;
    font-size: 18px;
    height: 117px;
    font-weight: 700;
  }
  .container {
    width: 952px;
    margin: 0 auto;
    font-size: 14px;
    color: rgba(75, 75, 75, 1);
    .line-three {
      width: 100%;
      height: 20px;
      line-height: 20px;
      display: table;
      .line-box {
        display: table-cell;
        text-align: justify;
        vertical-align: middle;
      }
    }
    .href {
      text-decoration: underline;
      color: #118eea;
      cursor: pointer;
    }
  }
  .image-logo {
    position: absolute;
    bottom: 61px;
    right: 153px;
  }
  .image-seal {
    position: absolute;
    bottom: 60px;
    left: 150px;
  }
  .footerItem {
    position: absolute;
    bottom: 0;
    left: 0;
    color: rgba(75, 75, 75, 1);
    height: 45px;
    line-height: 45px;
    margin: 0 auto;
    padding: 0 94px;
    .footerAdmin {
      margin-left: 90px;
    }
  }
}
.tradeType {
  margin-top: 30px;
}
</style>
