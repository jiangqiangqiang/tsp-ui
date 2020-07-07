<template>
  <div class="stepOut">
    <ul>
      <li class="stepItem" v-for="(stepItem, index) in stepInfo.list" :key="index">
        <div :class="stepInfo.step >= index+1 ? 'icon active':'icon'"></div>
        <div :class="stepInfo.step >= index+2 ? 'line lineActive':'line'" v-show="index!==stepInfo.list.length-1"></div>
        <p class="stepStatus">{{stepItem.status}}</p>
        <p class="statusTime">{{stepItem.statusTime}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'steps',
  props: {
    stepInfo: {
      type: Object,
      default: function () {
        return {
          list: [],
          step: 0
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/variables';
.stepOut {
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: center;
  .stepItem {
    width: 260px;
    height: 70px;
    float: left;
    // font-family: SimSun;
    font-size: 16px;
    text-align: center;
    position: relative;
    .icon {
      width: 13px;
      height: 13px;
      border-radius: 50%;
      background: rgba(226, 226, 226, 1);
      margin: 0 auto;
      position: relative;
      z-index: 888;
    }
    .active {
      background-color: @theme-blue;
      background-color: var(--mainColor);
    }
    .line {
      position: absolute;
      top: 6px;
      left: 50%;
      border-bottom: 1px dashed rgba(3, 2, 2, 0.7);
      width: 260px;
      z-index: 111;
    }
    .lineActive {
      border-bottom: 1px solid @theme-blue;
      border-bottom: 1px solid var(--mainColor);
    }
    .stepStatus {
      color: rgba(87, 87, 87, 1);
      line-height: 36px;
    }
    .statusTime {
      color: rgba(87, 87, 87, 1);
      opacity: 0.5;
    }
  }
}
</style>
