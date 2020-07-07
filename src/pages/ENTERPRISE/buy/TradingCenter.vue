<template>
  <div class="tradingCenter">
    <BusinessTitle title="交易中心" isShowBack></BusinessTitle>
    <div class="minpad">
      <TradingFiltrate :filtrate="filtrate" @getBusinessFiltrate="getBusinessFiltrate" isRefresh type="tradingCenter">
    </TradingFiltrate>
    <el-table :data="buyListData" stripe style="width: 100%;marginTop:24px" @sort-change="sortChange" ref="table"
      class="credit-table-color-blue sy-global-has-gutter__th--text-center sy-global-el-table-fit--border" :empty-text='midCenter'
      :default-sort="{prop:'createdOn', order: 'descending'}" :sort-orders="['ascending', 'descending']" header-align='center'>
      <el-table-column prop="txCode" label="交易编号" width="180" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="createdOn" label="发布时间" sortable="custom" width="180" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.createdOn}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="convertedCash" label="待售支付令" sortable="custom">
        <template slot-scope="scope">
          <span>{{scope.row.convertedCash | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="报价" sortable="custom" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.amount | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="rate" label="折扣率" sortable="custom">
        <template slot-scope="scope">
          <span>{{scope.row.rate*100 | toFix2}}%</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <Button class="skipBtn" @handleClick="handleClick(scope.row)" title="购 买" v-if="scope.row.display && role !== 'admin'"></Button>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="sy-global--Pagination--bg" style="margin-bottom: 2rem" v-if="buyListData.length>0">
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
      pageSize: 10,
      pageSizes: settings.pageSizes,
      pageNo: 1,
      totalCnt: 0,
      buyListData: [],
      midCenter: '暂无数据',
      sortColum: {},
      role: '',
      getTradingCenterListUrl: settings.apiGateway.getTradingCenterList
    }
  },
  filters: {
    toFix (val) {
      return val.toFixed(2)
    }
  },
  methods: {
    getBusinessFiltrate (filtrate) {
      this.filtrate = filtrate
      this.getBuyList()
    },
    handleClick (row) {
      this.$router.push({
        path: '/enterprise/start-buy',
        query: { id: row.id, status: 'confirm' }
      })
    },
    pageChange (curPage) {
      this.pageNo = curPage
      this.getBuyList()
    },
    sizeChange (pageSize) {
      this.pageSize = pageSize
      this.getBuyList()
    },
    getBuyList () {
      // 要有拼接参数的步骤
      let params = ''
      let data = JSON.parse(JSON.stringify(this.filtrate))
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
      this.midCenter = '查询中'
      this.fetch(`${this.getTradingCenterListUrl}${params}`).then(data => {
        this.buyListData = JSON.parse(JSON.stringify(data.data.list))
        this.totalCnt = data.data.totalCnt
        this.midCenter = '暂无数据'
      }).catch(data => {
        this.midCenter = '暂无数据'
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    sortChange (obj) {
      if (obj.order === null) {
        this.filtrate.sequence === 'desc' ? obj.order = 'ascending' : obj.order = 'descending'
        obj.prop = this.filtrate.sequenceField
        obj.column = this.sortColum
        obj.column.order = obj.order
        this.filtrate.sequence = obj.order === 'descending' ? 'desc' : 'asc'
        this.pageNo = 1
        this.getBuyList()
        return obj
      }
      this.sortColum = obj.column
      let objOrder = ''
      obj.order === 'descending' ? objOrder = 'desc' : objOrder = 'asc'
      this.filtrate.sequence = objOrder
      this.filtrate.sequenceField = obj.prop
      this.pageNo = 1
      this.getBuyList()
    }
  },
  created () {
    this.getBuyList()
    this.role = this.getRole()
  },
  computed: {
    // filterData () {
    //   let filterData = {}
    //   for (let key in this.filtrate) {
    //     if (this.filtrate[key]) {
    //       if (key === 'transactionType') {
    //         filterData['status'] = this.filtrate[key]
    //       } else {
    //         filterData[key] = this.filtrate[key]
    //       }
    //     }
    //   }
    //   return filterData
    // }
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/less/variables';
.minpad {
  padding: 0 20px;
}
.tradingCenter {
  .skipBtn {
    text-align: center;
    height: 24px;
    padding: 4px 11px;
    letter-spacing: 0;
  }
}
.tradingCenter/deep/.el-table .cell {
  text-align: center;
}
.tradingCenter/deep/.credit-table-color-blue tr {
  cursor: default;
  background-color: @table-bg;
  background-color: var(--mainTableBg) !important;
}
.tradingCenter/deep/ .el-table th {
  padding-top: 7px;
  padding-bottom: 7px;
}
.tradingCenter/deep/.credit-table-color-blue .el-table__body tr {
  &:nth-of-type(2n + 1):hover > td {
    background-color: @table-hover;
    background-color: var(--mainTableHover) !important;
  }
}
.el-button--primary:hover {
  background: @theme-blue;
  background: var(--mainColor);
}
</style>
