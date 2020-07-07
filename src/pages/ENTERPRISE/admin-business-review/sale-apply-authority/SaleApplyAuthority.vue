<template>
  <div class="saleA">
    <BusinessTitle title="交易申请审核"></BusinessTitle>
    <div :class="resizeTable">
      <div>
      <Button class="topUpBtn" @handleClick="toTrading" title="去交易市场"></Button>
    </div>
    <TradingFiltrate :filtrate="filtrate" :options="options" @getBusinessFiltrate="getBusinessFiltrate" type="saleList">
    </TradingFiltrate>
    <el-table :data="PayList" stripe border style="width: 100%" header-align='center' :empty-text='midCenter'
      class="PayList credit-table-color-blue sy-global-has-gutter__th--text-center sy-global-el-table-fit--border">
      <el-table-column prop="createdOn" label="发起时间" min-width="100">
        <template slot-scope="scope">
          {{scope.row.createdOn}}
        </template>
      </el-table-column>
      <el-table-column prop="txCode" label="交易编号" min-width="160" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="出售额度">
        <el-table-column prop="tokenNum" label="出售支付令" sortable="custom" width="141">
          <template slot-scope="scope">
            <span>{{scope.row.tokenNum | toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="convertedCash" label="折合现金" width="141">
          <template slot-scope="scope">
            <span>{{scope.row.convertedCash | toThousands}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="amount" label="报价" width="141">
        <template slot-scope="scope">
          <span>{{scope.row.amount | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="rate" label="折扣率">
        <template slot-scope="scope">
          <span>{{scope.row.rate*100 | toFix2}}%</span>
        </template>
      </el-table-column>
      <el-table-column prop="serviceAmount" label="服务费">
        <template slot-scope="scope">
          <span>{{scope.row.serviceAmount | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status">
        <template slot-scope="scope">
          <span>{{scope.row.status | saleStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <div v-if="(scope.row.status)=='Pending'">
            <Button class="toDeal" title="审核" @handleClick="TransactionDetail(scope.row)"></Button>
          </div>
          <div v-else>
            <div @click="checkTransaction(scope.row)" class="skipBtn">查看详情</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="sy-global--Pagination--bg" style="margin-bottom: 2rem" v-if="PayList.length>0">
      <el-col>
        <div class="sy-global__div--Pagination sy-global-pull-right">
          <el-pagination @current-change="pageChange" @size-change="sizeChange" :page-sizes="pageSizes"
            :pageSize="pageSize" :current-page="pageNo" layout="total, sizes, prev, pager, next, jumper"
            :total="totalCnt">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
    </div>
  </div>
</template>

<script>
import BusinessTitle from '@/components/BusinessTitle'
import TradingFiltrate from '@/components/TradingFiltrate'
import settings from '@/settings'
export default {
  components: {
    BusinessTitle,
    TradingFiltrate
  },
  data () {
    return {
      filtrate: {},
      options: [{
        value: 'Pending',
        label: '待审核'
      },
      {
        value: 'Rejected',
        label: '已驳回'
      },
      {
        value: 'Saling',
        label: '出售中'
      }],
      midCenter: '暂无数据',
      resizeTable: '',
      getPayListUrl: settings.apiGateway.getPayList,
      // 卖令列表接口
      getSellListUrl: settings.apiGateway.getOrderApprovalList,
      pageSize: 10,
      pageSizes: settings.pageSizes,
      pageNo: 1,
      totalCnt: 0,
      PayList: []
    }
  },
  methods: {
    getBusinessFiltrate (filtrate) {
      this.filtrate = filtrate
      this.getPayList()
    },
    pageChange (curPage) {
      this.pageNo = curPage
      this.getPayList()
    },
    sizeChange (pageSize) {
      this.pageSize = pageSize
      this.getPayList()
    },
    toTrading () {
      this.$router.push('/enterprise/trading-center')
    },
    // 获取列表信息
    getPayList () {
      let params = ''
      let data = JSON.parse(JSON.stringify(this.filterData))
      if (this.filtrate.totalAmountLow) this.filtrate.totalAmountLow = this.toThousands(this.filtrate.totalAmountLow)
      if (this.filtrate.totalAmountHight) this.filtrate.totalAmountHight = this.toThousands(this.filtrate.totalAmountHight)
      if (this.filtrate.rateLow) this.filtrate.rateLow = this.filtrate.rateLow * 100
      if (this.filtrate.rateHight) this.filtrate.rateHight = this.filtrate.rateHight * 100
      if (JSON.stringify(data) === '{}') {
        params = ''
        params = `?pageNo=${this.pageNo - 1}&pageSize=${this.pageSize}`
      } else {
        params += '?'
        for (let key in data) {
          if (key === 'startTime') {
            data[key] = this.concatDate(data[key], '00:00:00')
          } else if (key === 'endTime') {
            data[key] = this.concatDate(data[key], '23:59:59')
          } else if (key === 'lastUpdatedOnBegin') {
            data[key] = this.concatDate(data[key], '00:00:00')
          } else if (key === 'lastUpdatedOnEnd') {
            data[key] = this.concatDate(data[key], '23:59:59')
          } else if (key === 'totalAmountLow') {
            data[key] = data[key] * 100
          } else if (key === 'totalAmountHight') {
            data[key] = data[key] * 100
          }
          params += `${key}=${data[key]}&`
        }
        params = params.substring(0, params.length - 1)
        params = `${params}&pageNo=${this.pageNo - 1}&pageSize=${this.pageSize}`
      }
      if (this.filtrate.min) this.filtrate.min = this.toThousands(this.filtrate.min)
      if (this.filtrate.max) this.filtrate.max = this.toThousands(this.filtrate.max)
      this.midCenter = '查询中'
      this.fetch(`${this.getSellListUrl}${params}`).then(res => {
        this.PayList = res.data
        // this.PayList.forEach(list => {
        //   if (list.status === 'Pending') {
        //     this.setTime(list.txCode)
        //   }
        // })
        this.totalCnt = res.data.totalCnt
        this.midCenter = '暂无数据'
      }).catch(data => {
        this.midCenter = '暂无数据'
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    TransactionDetail (row) {
      this.$router.push({
        path: '/enterprise/sale-apply-authority/detail',
        query: { code: row.txCode, status: row.status }
      })
    },
    // 产看交易详单
    checkTransaction (row) {
      this.$router.push({
        path: '/enterprise/sale-deal',
        query: { code: row.txCode }
      })
    },
    computeWidth () {
      if ((document.documentElement.clientWidth || document.body.clientWidth) < 1372) {
        this.resizeTable = ''
      } else {
        this.resizeTable = 'minpad'
      }
    }
  },
  computed: {
    filterData () {
      let filterData = {}
      for (let key in this.filtrate) {
        if (this.filtrate[key]) {
          if (key === 'transactionType') {
            filterData['status'] = this.filtrate[key]
          } else {
            filterData[key] = this.filtrate[key]
          }
        }
      }
      return filterData
    }
  },
  mounted () {
    this.computeWidth()
    window.onresize = this.computeWidth
  },
  created () {
    this.getPayList()
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/less/variables';
.minpad {
  padding: 0 20px;
}
.PayList {
  margin-top: 20px;
  .skipBtn {
    cursor: pointer;
    text-align: center;
    height: 19px;
    margin: 0 auto;
    color: @theme-blue;
    color: var(--mainColor);
    text-decoration: underline;
  }
  .toDeal {
    width: 72px;
    height: 26px;
    letter-spacing: 0 !important;
    padding: 0 !important;
  }
}
.topUpBtn {
  width: 123px;
  height: 41px;
  margin: 22px 0 0 25px;
  border-radius: 5px;
  box-shadow: 1px 6px 4px @btn-disabled;
  box-shadow: 1px 6px 4px var(--mainTableHover);
  border: none;
  font-size: 16px;
  color: #fff;
}
.saleA/deep/.el-table .cell {
  text-align: center;
  padding-left: 12px;
  padding-right: 12px;
}
.saleA/deep/ .el-table th {
  padding-top: 3px;
  padding-bottom: 3px;
}
.saleA/deep/.el-table tr td:nth-child(3) .cell, .saleA/deep/.el-table td:nth-child(4) .cell, .saleA/deep/.el-table td:nth-child(5) .cell, .saleA/deep/.el-table td:nth-child(7) .cell {
  text-align: right;
}
.saleA/deep/.el-button:hover{
  color: #ffffff;
  background-color: @btn-disabled;
  background-color: var(--mainColorDis);
  border: 0;
}
</style>

<style lang="less">
@import '~@/assets/less/variables';
.PayList.credit-table-color-blue tr {
  background-color: @table-bg;
  background-color: var(--mainTableBg) !important;
}
.PayList.credit-table-color-blue .el-table__body tr {
  &:nth-of-type(2n + 1):hover > td {
    background-color: #e3eef8 !important;
    background-color: var(--mainTableHover) !important;
  }
}
.wait_icon {
  vertical-align: middle;
  width: 1em;
  height: 1em;
  margin-top: -3px;
  margin-right: 6px;
}
</style>
