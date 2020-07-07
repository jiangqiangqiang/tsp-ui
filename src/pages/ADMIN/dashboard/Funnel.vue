<template>
  <div class="funnel-container">
    <h3 :style="{color: processColor[0]}" style="font-weight: 600">{{title}}</h3>
    <div class="funnel-item">
      <div>{{titleData.userCount}}</div>
      <el-tooltip :content="titleData.userCount + funnelData.userCount" placement="bottom-end" effect="dark" :visible-arrow="false" :enterable="false">
        <div :style="{width:funnelWidth + 'px',backgroundColor: processColor[0],borderRadius: '0 5px 5px 0',height:'28px'}"></div>
      </el-tooltip>
    </div>
    <div class="funnel-item">
      <div>{{titleData.enableCount}}</div>
      <el-tooltip :content="titleData.enableCount + funnelData.enableCount" placement="bottom-end" effect="dark" :visible-arrow="false" :enterable="false">
        <div :style="{width: funnelWidth * (funnelData.enableCount / funnelData.userCount) + 'px',backgroundColor: processColor[1],borderRadius: '0 5px 5px 0',height:'28px'}"></div>
      </el-tooltip>
      <div>{{funnelData.userCount === 0 ? 0 : funnelData.enableCount / funnelData.userCount || 0 | rateFtt}}%</div>
    </div>
    <div class="funnel-item" v-if="title !== '代理商用户漏斗' && title !== '服务商用户漏斗'">
      <div>{{titleData.transactionCount}}</div>
      <el-tooltip :content="titleData.transactionCount + funnelData.transactionCount" placement="bottom-end" effect="dark" :visible-arrow="false" :enterable="false">
        <div :style="{width: funnelWidth * (funnelData.transactionCount / funnelData.userCount) + 'px',backgroundColor: processColor[2],borderRadius: '0 5px 5px 0',height:'28px'}"></div>
      </el-tooltip>
      <div>{{funnelData.userCount === 0 ? 0 : funnelData.transactionCount / funnelData.userCount | rateFtt}}%</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    processColor: {
      type: Array,
      default: () => {
        return ['#938360', '#BEB5A0', '#BEB5A0']
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
      default: '服务商用户漏斗'
    }
  },
  data () {
    return {
      funnelWidth: 210
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
    // width: 300px;
    h3 {
      text-align: left;
      font-size: 16px;
      margin-bottom: 20px;
      padding-left: 82px;
    }
    .funnel-item {
      width: 100%;
      // display: table-cell;
      // vertical-align: middle;
      margin-bottom: 1px;
      height: 28px;
      line-height: 28px;
      &>div:first-child {
        float: left;
        width: 80px;
        text-align: right;
        margin-right: 4px;
      }
      &>div:nth-child(2) {
        float: left;
        margin-right: 4px;
      }
      &>div:nth-child(3) {
        float: left;
        margin-left: 4px;
      }
    }
  }
</style>
