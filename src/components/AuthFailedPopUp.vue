<!--
  个人和企业信息认证失败弹窗,不传数据默认显示个人认证失败的文案
  props: {
    // required 是否显示弹窗
    showTip: {
      type: Boolean,
      default: false
    },
    // 标题
    titleText: {
      type: String,
      default: '管理员认证失败'
    },
    // 内容: 可传入html字符串
    htmlText: {
      type: String,
      default: '<p>管理员姓名、身份证号码及手机号码必须为同一人所有</p>'
    }
  }
-->
<template>
  <div class="message-error">
    <el-dialog
      :visible.sync="showTip"
      width="500px"
      :before-close="confirm"
      center
      >
      <div class="dialog-container">
        <div class="tip-icon">
          <!-- <i></i> -->
          <svg-icon iconClass='gg_bc' className='tip-icon1'></svg-icon>
        </div>
        <div>
          <p>{{titleText}}</p>
          <div style="text-align:center;" v-html="htmlText"></div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="confirm" type="primary" class="btn">确定</el-button> -->
        <Button @handleClick="confirm"  class="btn" title="确定"></Button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    showTip: {
      type: Boolean,
      default: false
    },
    titleText: {
      type: String,
      default: '管理员认证失败'
    },
    htmlText: {
      type: String,
      default: '<p>管理员姓名、身份证号码及手机号码必须为同一人所有</p>'
    }
  },
  data () {
    return {}
  },
  created () {},
  methods: {
    confirm () {
      this.$emit('confirm')
    }
  },
  watch: {}
}
</script>

<style lang="less" scoped>
  @import '~@/assets/less/variables.less';
  .dialog-container {
    .tip-icon {
      text-align: center;
      .tip-icon1 {
        width: 66px;
        height: 66px;
        vertical-align: middle;
        display: inline-block;
        // background: url('~@/assets/img/gg_bc.png') center no-repeat;
      }
    }
    p {
      color: #575757;
      text-align: center;
      height: 30px;
      line-height: 30px;
      &:first-child {
        font-size: 16px;
        margin-top: 20px;
      }
    }
  }
  .dialog-footer {
    .btn {
      width: 180px;
      height: 36px;
      // background-color: @theme-blue;
      // background-color: var(--mainColor);
      border: none;
    }
  }
</style>
<style>
  .message-error .el-dialog {
    position:absolute;
    top:50%;
    left:50%;
    margin-top:-150px!important;
    margin-left:-150px;
  }
</style>
