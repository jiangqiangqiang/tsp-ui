<!--
   明细账汇总收支组件
-->
<template>
  <div>
    <div>
      <span class="title" v-if="!type">统计金额</span>
    </div>
    <div class="payments">
      <span class="income" v-if="!type">已收入 {{paymentsData.incomeCount || 0}} 笔,共 <span class="font-bold">{{ paymentsData.incomeAmount || 0 | toThousands }}</span></span>
      <span class="expend" v-if="!type">已支出 {{paymentsData.expenditureCount || 0}} 笔,共 <span class="font-bold">{{ paymentsData.expenditureAmount || 0 | toThousands }}</span></span>
      <span class="expend" v-if="type">分润总额 <span class="font-bold">{{ paymentsData.incomeAmount || 0 | toThousands }}</span></span>
      <span @click="down" class="excel">导出Excel</span>
    </div>
  </div>
</template>

<script>
import settings from '@/settings'
export default {
  data () {
    return {
      // 下载excel
      downloadExcel: settings.apiGateway.downloadExcel
    }
  },
  props: {
    paymentsData: {
      type: Object,
      default: () => {
        return {
          incomeCount: 0,
          expenditureCount: 0,
          incomeAmount: 0,
          expenditureAmount: 0
        }
      }
    },
    filtrate: {
      type: Object
    },
    apiType: {
      type: String,
      default: 'self'
    },
    enterpriseName: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    }
  },
  computed: {},
  methods: {
    down () {
      let filtrate = JSON.parse(JSON.stringify(this.filtrate))
      if (filtrate.transactionTypes) {
        filtrate.transactionTypes = [filtrate.transactionTypes]
      } else {
        delete filtrate['transactionTypes']
      }
      this.enterpriseName && (filtrate.enterpriseName = this.enterpriseName)
      let type = this.type ? '?tag_ep=benefit' : ''
      this.axios({
        url: `${this.downloadExcel}${this.apiType}${type}`,
        data: filtrate,
        onDownloadProgress: p => {
          this.precent = Math.floor(100 * (p.loaded / p.total))
        },
        method: 'post',
        responseType: 'blob'
      }).then(data => {
        let filename = decodeURI(data.headers.filename)
        if (navigator.appVersion.toString().indexOf('.NET') > 0) {
          window.navigator.msSaveBlob(data.data, filename)
        } else {
          let url = window.URL.createObjectURL(data.data)
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', filename)
          document.body.appendChild(link)
          link.click()
        }
      }).catch(data => {
        this.$message.error('服务器开小差了！')
      })
    }
  }
}
</script>

<style lang="less" scoped>
  @import "~@/assets/less/variables.less";
  .title {
    display: inline-block;
    width: 100px;
    text-align: center;
    height: 44px;
    line-height: 44px;
    border: 1px solid #e6e6e6;
    border-bottom: none;
    background-color: #fcfcfc;
  }
  .payments {
    border: 1px solid #e6e6e6;
    height: 36px;
    line-height: 36px;
    background-color: @theme-blue-light;
    background-color: var(--mainLightColor);
    color: #656565;
  }
  .font-bold {
    color: @theme-blue;
    color: var(--mainColor);
    font-weight: bold;
  }
  .income {
    height: 20px;
    line-height: 20px;
    margin-top: 8px;
    display: inline-block;
    padding: 0 15px 0 30px;
    border-right: 1px solid #656565;
  }
  .expend {
    height: 20px;
    line-height: 20px;
    margin-top: 8px;
    display: inline-block;
    padding: 0 30px 0 15px;
  }
  .excel {
    float: right;
    margin-right: 40px;
    cursor: pointer;
    text-decoration: underline;
  }
</style>
