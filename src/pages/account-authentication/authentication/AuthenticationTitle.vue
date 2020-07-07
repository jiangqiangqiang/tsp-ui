<template>
  <div>
    <!-- <div class="business-title"><a v-if="isShowBack" class="back-btn" @click="goBack">&lt; 返回</a>{{title}}</div> -->
    <!-- <p class="message">· 只需提交如下信息,系统将为您完成相关认证过程 ·</p> -->
    <div :class="stepInfo.list.length < 4 ?'wrapper long-step':'wrapper'">
      <slot>
        <ul :class="['step-list',stepInfo.list.length < 4 ? 'long-step' : '']">
          <li v-for="(item,index) in stepInfo.list" :key="index" :class="[index + 1 <= stepInfo.step ? 'visible' : '']">
            <span>{{index + 1}}</span>{{item}}</li>
        </ul>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    stepInfo: {
      type: Object,
      default: () => ({})
    },
    title: {
      type: String,
      default: ' 账户认证'
    },
    isShowBack: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    goBack () { }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/variables';
.business-title {
  width: 100%;
  height: 80px;
  line-height: 80px;
  color: #4a4a4a;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  position: relative;
  background-color: @theme-blue-light;
  margin-bottom: 40px;
  .back-btn {
    position: absolute;
    color: #4a4a4a;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    left: 20px;
    top: 5px;
    cursor: pointer;
    font-weight: 400;
  }
  .back-btn:hover {
    color: @theme-blue;
  }
}
.long-step {
  width: 370px!important;
}
.message {
  margin-bottom: 21px;
  text-align: center;
  font-size: 14px;
  color: #a2a2a2;
}
.wrapper {
  width: 832px;
  height: 38px;
  // margin-left: 240px;
  // margin-top: 53px;
  margin: 53px auto 0;
  background: #fafafa;
  border-radius: 38px;
  .step-list {
    display: inline-block;
    clear: both;
    overflow: hidden;
    box-sizing: border-box;
    font-size: 15px;
    li {
      position: relative;
      float: left;
      padding: 8px 23px 5px 16px;
      text-align: center;
      margin-right: 37px;
      margin-left: 20px;
      color: #a2a2a2;
      span {
        display: inline-block;
        width: 20px;
        height: 20px;
        margin-right: 5px;
        line-height: 21px;
        border-radius: 50%;
        border: 1px solid #a2a2a2;
      }
      &:after {
        content: '';
        position: absolute;
        right: -50px;
        top: 50%;
        margin-top: 2px;
        width: 53px;
        border-top: 1px dashed #6c6c6c;
        z-index: 9;
      }
      &:last-child {
        margin-right: 0;
        &:after {
          display: none;
        }
      }
    }
    .visible {
      color: @theme-blue;
      border-radius: 20px;
      span {
        color: #fff;
        background-color: @theme-blue;
        border: none;
      }
    }
  }
}
</style>
