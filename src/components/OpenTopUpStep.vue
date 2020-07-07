<template>
  <div class="step--main">
    <ul>
      <li :class="{active: step === 1}"><span class="change-color">1</span>申请开通充值权限</li>
      <li class="line--dashed">
        <div></div>
      </li>
      <li :class="{active: step === 2}"><span class="change-color">2</span>等待代理商审批</li>
      <li class="line--dashed">
        <div></div>
      </li>
      <li :class="{active: step === 3}"><span class="change-color">3</span>开通成功</li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    step: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      stepList: [ '', '', '' ]
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/variables";
  .step--main {
    height: 60px;
    width: 100%;
    ul {
      width: 800px;
      height: 30px;
      margin: 15px auto;
      background-color: #fafafa;
      border-radius: 15px;
      display: flex;
      justify-content: space-around;
      flex-direction: row;
      li {
        height: 30px;
        line-height: 30px;
        font-size: 16px;
        font-weight: 600;
        color: #a2a2a2;
      }
      .active {
        color: @theme-blue;
        color: var(--mainColor);
      }
      .line--dashed {
        width: 80px;
        position: relative;
        div {
          position: absolute;
          width: 100%;
          top: 15px;
          border-top: 1px dashed #6c6c6c;
        }
      }
    }
  }
.change-color {
  color: #fff;
  display: inline-block;
  margin-right: 5px;
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  border-radius: 10px;
  background-color: @theme-blue;
  background-color: var(--mainColor);
}
</style>
