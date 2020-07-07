<!--
 Des: 按钮组件
 props: {
   // 按钮的文案
   title: {
      type: String,
      default: ''
    },
    // 按钮是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否传入icon
    icon: {
      type: String,
      default: ''
    }
 }
-->

<template>
  <el-button  type="primary" @click="handleClick" :disabled="btnDisabled" :class="[this.title.length === 2 ? 'button' : 'el-button']" :icon="icon" :loading="isLoading">{{title}}</el-button>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ''
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  },
  methods: {
    handleClick () {
      this.$emit('handleClick')
    }
  },
  computed: {
    btnDisabled () {
      return this.$store.state.btnFetchDisabled || this.disabled
    }
  }
}
</script>

<style scoped lang="less">
  @import "~@/assets/less/variables.less";
  .button {
    letter-spacing: 8px;
  }
  .el-button {
    background: @theme-blue;
    background: var(--mainColor);
    // border: none;
    border-color: @theme-blue;
    border-color: var(--mainColor);
    border-radius: 3px;
    color: #ffffff;
    // box-shadow: 1px 6px 4px @btn-disabled;
    // box-shadow: 1px 6px 4px var(--mainTableHover);
  }
  .el-button--primary.is-disabled, .el-button--primary.is-disabled:hover{
    color:#fff;
    background: @theme-blue;
    background: var(--mainColor);
    opacity: 0.5
  }
  .el-button:hover{
    color: #ffffff;
    background: @theme-blue;
    background-color: var(--mainColor);
    border-color: @theme-blue;
    border-color: var(--mainColor);
  }
  .el-button:active {
  color: #fff;
  border-color: @theme-blue;
  border-color: var(--mainColor);
  background-color: @theme-blue;
  background-color: var(--mainColor);
  outline: 0;
}
</style>
