<template>
  <div>
    <BusinessTitle isShowBack title="平台协议"></BusinessTitle>
    <div class="content">
      <div class="title">协议详情</div>
      <div class="agreement">
        <span class="agreement-title">协议名称</span><span class="agreement-content">《好快通宝用户协议》 <span class="download">下载</span></span>
      </div>
      <div class="agreement">
        <span class="agreement-title" style="border-left:none">签订时间</span><span  class="agreement-content">{{signTime}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import BusinessTitle from '@/components/BusinessTitle'
import settings from '@/settings'
export default {
  components: {
    BusinessTitle
  },
  data () {
    return {
      signTime: '',
      getSignTimeUrl: settings.apiGateway.getSignTime
    }
  },
  created () {
    this.fetch(this.getSignTimeUrl).then(data => {
      this.signTime = data.data
    }).catch(data => {
      this.$message({
        type: 'error',
        message: data.data.msg
      })
    })
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/variables';
.content {
  margin: 30px auto 0;
  width: 1137px;
  .title {
    width:100%;
    text-align: center;
    height: 42px;
    line-height: 42px;
    background-color: #e5e5e5;
    color: #333
  }
  .agreement {
    float: left;
    cursor: pointer;
    .agreement-title {
      display: inline-block;
      width: 153px;
      height:41px;
      text-align: center;
      line-height: 41px;
      border:1px solid #ccc;
      float: left;
    }
    .download {
      color: @theme-blue;
      color: var(--mainColor);
      border-bottom: 1px solid var(--mainColor)
    }
    .agreement-content {
      display: inline-block;
      width: 392px;
      height: 41px;
      line-height: 41px;
      padding-left:21px;
      border:1px solid #cccccc;
      border-left:none
    }
  }
}
</style>
