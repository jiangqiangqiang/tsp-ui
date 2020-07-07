<!--
    传入参数：

      loadingShow: false,   是否显示加载loading （可传可不传 ）默认是false
      loadingText: ''       加载loading的文案（可传可不传 ）默认是  存储中, 请稍后...

  -->
<template>
<div class="loading">
  <el-dialog
    :showClose="false"
    :visible.sync="loadingShow"
    custom-class="dialog-loading-component--loading"
    :center='true'
    :closeOnClickModal='false'
    :closeOnPressEscape='false'
    :lockScroll='false'
    >
    <div class="loading-content">
      <img class="gifIcon" src="@/assets/img/loadingIcon.gif" alt="">
      <span class="loadingTitle">{{loadingText ? loadingText : '存储中, 请稍后...'}}</span>
    </div>
  </el-dialog>
</div>
</template>
<script>
export default {
  props: {
    loadingShow: {
      type: Boolean,
      default: false
    },
    loadingText: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="less" scoped>
  .loading-content {
    text-align: center;
    height: 3.6rem;
    line-height: 3.6rem;
  }
  .gifIcon {
    width: .7rem;
    height: .7rem;
    padding-right: .2rem;
  }
  .loadingTitle {
    font-size: 0.36rem;
    vertical-align: middle;
  }
</style>
<style lang="less">
.loading .dialog-loading-component--loading {
  width: 570px;
  height: 300px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%,-50%,0);
  border-radius: 0.08rem;
  margin-top:13px!important;
  margin-left:135px;
  .el-dialog__header {
    border:none;
    background-color:#fff;
  }
  .el-dialog__body {
    line-height: 3.6rem;
  }
}
</style>
