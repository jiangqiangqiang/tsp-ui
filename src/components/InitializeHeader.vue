<template>
  <div class="initialize-header-main">
    <div class="yp-logo logo-position">
      <!-- <div :class="[isIE ? 'image fund-logo' : styleClass]"></div> -->
      <svg-icon iconClass='zjf_logo' :className='styleClass'></svg-icon>
    </div>
    <p class="message">· 只需提交如下信息,系统将为您完成相关认证过程 ·</p>
    <div class="wrapper">
      <slot>
        <ul :class="['step-list',stepInfo.list.length > 4 ? 'long-step' : '']">
          <li v-for="(item,index) in stepInfo.list" :key="index" :class="[index + 1 === stepInfo.step ? 'visible' : '']"><span>{{index + 1}}</span>{{item}}</li>
        </ul>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'initializeheader',
  props: {
    stepInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      styleClass: 'image'
    }
  },
  created () {
    this.Role = this.getUserRole()
    this.getLogoImg(this.Role)
  },
  methods: {
    getLogoImg (role) {
      switch (role) {
        case 'fund':
          this.styleClass += ' fund-logo'
          break
        case 'enterprise':
          this.styleClass += ' enterprise-logo'
          break
        case 'agent':
          this.styleClass += ' agent-logo'
          break
        case 'admin':
          this.styleClass += ' admin-logo'
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
@import '~@/assets/less/variables';
.initialize-header-main {
  margin-bottom: 49px;
  .logo-position {
      margin: 77px 0 46px 0;
  }
  .message {
      margin-bottom: 21px;
      text-align: center;
      font-size: 14px;
      color: #a2a2a2;
  }
  .wrapper {
      width: 700px;
      height: 38px;
      margin: 0 auto;
      background: #fafafa;
      border-radius: 38px;
      .step-list{
          display: inline-block;
          clear: both;
          overflow: hidden;
          box-sizing: border-box;
          font-size: 15px;
      li{
          position: relative;
          float: left;
          padding: 8px 16px 5px 10px;
          text-align: center;
          margin-right: 37px;
          margin-left: 20px;
          color: #a2a2a2;
          span{
              display: inline-block;
              width:20px;
              height:20px;
              margin-right:5px;
              line-height:21px;
              border-radius: 50%;
              border: 1px solid #a2a2a2;
          }
          &:after{
              content:'';
              position:absolute;
              right:-50px;
              top:50%;
              margin-top:2px;
              width:53px;
              border-top:1px dashed #6c6c6c;
              z-index:9;
          }
              &:last-child{
                margin-right:0;
              &:after{
                display: none;
              }
          }
      }
      .visible{
          color: @theme-blue;
          color: var(--mainColor);
          border-radius: 20px;
          span{
              color:#fff;
              background-color: @theme-blue;
              background-color: var(--mainColor);
              border: none;
          }
      }
    }
  }
}
.image {
    width: 137px!important;
    height: 43px!important;
    vertical-align: middle;
    margin: 0 auto;
    color: @theme-blue;
    color: var(--mainColor);
  }
</style>
