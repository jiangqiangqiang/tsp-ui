<template>
  <div class="funnel-container">
    <h3 :style="{color: processColor[0]}" style="font-weight: 600">{{title}}</h3>
    <div class="funnel-item">
      <div>{{titleData.userCount || 0}}</div>
      <el-tooltip :content="titleData.userCount + funnelData.userCount || 0" placement="top-end" effect="light">
        <div :style="{width:funnelWidth + 'px',backgroundColor: processColor[0]}"></div>
      </el-tooltip>
    </div>
    <div class="funnel-item">
      <div>{{titleData.enableCount || 0}}</div>
      <el-tooltip :content="titleData.enableCount + funnelData.enableCount" placement="top-end" effect="light">
        <div :style="{width: funnelWidth * (funnelData.enableCount / funnelData.userCount) + 'px',backgroundColor: processColor[1]}"></div>
      </el-tooltip>
      <div>{{funnelData.userCount === 0 ? 0 : funnelData.enableCount / funnelData.userCount || 0 | rateFtt}}%</div>
    </div>
    <div class="funnel-item">
      <div>{{titleData.transactionCount || 0}}</div>
      <el-tooltip :content="titleData.transactionCount + funnelData.transactionCount" placement="top-end" effect="light">
        <div :style="{width: funnelWidth * (funnelData.transactionCount / funnelData.userCount) + 'px',backgroundColor: processColor[2]}"></div>
      </el-tooltip>
      <div>{{funnelData.userCount === 0 ? 0 : funnelData.transactionCount / funnelData.userCount || 0 | rateFtt}}%</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    processColor: {
      type: Array,
      default: () => {
        return ['#118eea', '#70bbf2', '#b8ddf8']
      }
    },
    funnelData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    title: {
      type: String,
      default: '资金方用户漏斗'
    }
  },
  data () {
    return {
      funnelWidth: 280
    }
  },
  computed: {
    titleData () {
      let role = this.title.substring(0, 3)
      return {
        userCount: role + '总数',
        enableCount: '认证通过',
        transactionCount: '有过交易数'
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .funnel-container {
    width: 425px;
    h3 {
      text-align: left;
      font-size: 16px;
      margin-bottom: 20px;
      padding-left: 82px;
    }
    .funnel-item {
      display: flex;
      flex-direction: row;
      margin-bottom: 1px;
      height: 28px;
      line-height: 28px;
      &>div:first-child {
        width: 80px;
        text-align: right;
        margin-right: 4px;
      }
      &>div:nth-child(2) {
      }
      &>div:nth-child(3) {
        margin-left: 4px;
      }
    }
  }
</style>
