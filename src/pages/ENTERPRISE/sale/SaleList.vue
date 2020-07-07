<template>
  <div class="sale-list">
    <BusinessTitle title="出售支付令"></BusinessTitle>
    <div :class="resizeTable">
      <div style="position:relative">
      <span @click="toSale"><Button title="去出售" class="jointTokenBtn"></Button>
        <svg-icon iconClass="sy_mcl" className='sale_icon'></svg-icon>
      </span>
      <span class="toSaleDetail" @click="toTradingCenter">去交易中心看详情</span>
    </div>
    <TradingFiltrate :filtrate="filtrate" :options="options" @getBusinessFiltrate="getBusinessFiltrate" type="saleList">
    </TradingFiltrate>
    <el-table :data="SaleList" stripe border style="width: 100%" @sort-change="sortChange" ref="table"
      header-align='center' :empty-text='midCenter'
      class="JointTokenList credit-table-color-blue sy-global-has-gutter__th--text-center sy-global-el-table-fit--border"
      :default-sort="{prop:'createdOn', order: 'descending'}" :sort-orders="['ascending', 'descending']">
      <el-table-column prop="createdOn" label="发起时间" sortable="custom" min-width="101">
        <template slot-scope="scope">
          {{scope.row.createdOn}}
        </template>
      </el-table-column>
      <el-table-column prop="lastUpdatedOn" label="结束时间" sortable="custom" min-width="101">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 'Finished'">{{scope.row.lastUpdatedOn}}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column prop="txCode" label="交易编号" show-overflow-tooltip>
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
      <el-table-column prop="amount" label="报价" sortable="custom" width="141">
        <template slot-scope="scope">
          <span>{{scope.row.amount | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="rate" label="折扣率" sortable="custom">
        <template slot-scope="scope">
          <span>{{scope.row.rate*100 | toFix2}}%</span>
        </template>
      </el-table-column>
      <el-table-column prop="serviceAmount" label="服务费">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 'Rejected' || scope.row.status === 'Canceled'">--</span>
          <span v-else>{{scope.row.serviceAmount | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span>{{scope.row.status | saleStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作" width="150">
        <template slot-scope="scope">
          <div v-if="scope.row.status==='Rejected'" @click="handleClick(scope.row)" class="skipBtn">重新申请</div>
          <div v-else-if="scope.row.status==='Saling'" @click="handleClick(scope.row)" class="skipBtn">撤销</div>
          <div v-else @click="toSaleDetail(scope.row)" class="skipBtn">查看详情</div>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="sy-global--Pagination--bg" style="margin-bottom: 2rem" v-if="SaleList.length>0">
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
      pageSize: 10,
      pageSizes: settings.pageSizes,
      pageNo: 1,
      totalCnt: 0,
      filtrate: {},
      userRole: '',
      sortColum: {},
      midCenter: '暂无数据',
      options: [
        {
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
        },
        {
          value: 'Paying',
          label: '待支付'
        },
        {
          value: 'Finished',
          label: '已完成'
        }
      ],
      SaleList: [],
      className: '',
      hasBank: false,
      hasPassword: false,
      resizeTable: '',
      // 卖令列表接口
      getSellListUrl: settings.apiGateway.getSellList,
      getBankListUrl: settings.apiGateway.getBankList,
      checkIsSetPayPasswordUrl: settings.apiGateway.checkIsSetPayPassword
    }
  },
  methods: {
    toSale () {
      this.checkPassword()
    },
    getBusinessFiltrate (filtrate) {
      this.filtrate = filtrate
      this.getSaleList()
    },
    pageChange (curPage) {
      this.pageNo = curPage
      this.getSaleList()
    },
    sizeChange (pageSize) {
      this.pageSize = pageSize
      this.getSaleList()
    },
    toTradingCenter () {
      this.$router.push('/enterprise/trading-center')
    },
    getSaleList () {
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
      this.midCenter = '查询中'
      this.fetch(`${this.getSellListUrl}${params}`).then(data => {
        this.SaleList = JSON.parse(JSON.stringify(data.data.list))
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
    handleClick (row) {
      if (row.status === 'Rejected') {
        this.$router.push({
          path: '/enterprise/start-sale',
          query: { amount: row.tokenNum / 100, rate: row.rate, endTime: row.deadline, id: row.id }
        })
      } else {
        this.$router.push({
          path: '/enterprise/sale-detail',
          query: { code: row.txCode, status: row.status }
        })
      }
    },
    toSaleDetail (row) {
      this.$router.push({
        path: '/enterprise/sale-deal',
        query: { code: row.txCode }
      })
    },
    checkPassword () {
      // 是否添加银行账户
      this.fetch(this.getBankListUrl).then(data => {
        this.hasBank = true
        if (data.data.length === 0) {
          this.hasBank = false
        }
        // 请求是否设置支付密码
        this.fetch(this.checkIsSetPayPasswordUrl).then(data => {
          let hasPassword = data.data.exist
          this.$router.push({
            path: `/enterprise/start-sale`,
            query: {
              hasBank: this.hasBank,
              hasPassword
            }
          })
        }).catch(res => {
          this.$message.error(res.data.msg)
        })
      }).catch(res => {
        this.$message.error(res.data.msg)
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
        this.getSaleList()
        return obj
      }
      this.sortColum = obj.column
      let objOrder = ''
      obj.order === 'descending' ? objOrder = 'desc' : objOrder = 'asc'
      this.filtrate.sequence = objOrder
      this.filtrate.sequenceField = obj.prop
      this.pageNo = 1
      this.getSaleList()
    },
    computeWidth () {
      if ((document.documentElement.clientWidth || document.body.clientWidth) < 1372) {
        this.resizeTable = ''
      } else {
        this.resizeTable = 'minpad'
      }
    }
  },
  created () {
    this.userRole = this.getUserRole()
    this.getSaleList()
  },
  mounted () {
    this.computeWidth()
    window.onresize = this.computeWidth
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
  },
  beforeDestroy () {
    clearInterval(this.timerId)
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/less/variables';
.minpad {
  padding: 0 20px;
}
.jointTokenBtn {
  width: 163px;
  height: 41px;
  margin: 22px 0 0 25px;
  padding-left: 42px;
  border-radius: 5px;
  color: #fff;
  box-shadow: 1px 6px 4px @btn-disabled;
  box-shadow: 1px 6px 4px var(--mainTableHover);
}
.sale_icon {
  width: 23px !important;
  height: 16px !important;
  color: #ffffff;
  position: absolute;
  top: 33px;
  left: 72px;
  cursor: pointer;
}
.toSaleDetail {
  text-decoration: underline;
  cursor: pointer;
  color: @theme-blue;
  color: var(--mainColor);
  vertical-align: bottom;
  margin: 20px 20px;
}
.skipBtn {
  cursor: pointer;
  text-align: center;
  height: 19px;
  margin: 0 auto;
  color: @theme-blue;
  color: var(--mainColor);
  text-decoration: underline;
  // border-bottom: @theme-blue;
  // border-bottom: 1px solid var(--mainColor)
}
.processState {
  position: relative;
}
.datagrey-icon {
  position: absolute;
  top: -13px;
  width: 16px !important;
  height: 16px !important;
  vertical-align: middle;
}
.red-icon {
  position: absolute;
  top: -13px;
  width: 16px !important;
  height: 16px !important;
  vertical-align: middle;
}
.JointTokenList {
  margin-top: 20px;
}
.sale-list/deep/.credit-table-color-blue tr {
  background-color: @table-bg;
  background-color: var(--mainTableBg) !important;
}
.sale-list/deep/.credit-table-color-blue .el-table__body tr {
  &:nth-of-type(2n + 1):hover > td {
    background-color: #e3eef8 !important;
    background-color: var(--mainTableHover) !important;
  }
}
.sale-list/deep/ .el-table th {
  padding-top: 3px;
  padding-bottom: 3px;
}
.sale-list/deep/.el-table .cell {
  text-align: center;
  padding-left: 12px;
  padding-right: 12px;
}
.sale-list/deep/.el-table td:nth-child(4) .cell, .sale-list/deep/.el-table td:nth-child(5) .cell, .sale-list/deep/.el-table td:nth-child(6) .cell, .sale-list/deep/.el-table td:nth-child(8) .cell {
  text-align: right;
}
.el-button--primary:hover {
  background: @theme-blue;
  background: var(--mainColor);
}
</style>
