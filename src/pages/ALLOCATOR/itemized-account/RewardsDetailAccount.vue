<template>
  <div class="rewardsdetail-main">
    <BusinessTitle title="金币明细账"></BusinessTitle>
    <div class="filter-area">
      <ItemizedFiltrate :filtrate="filtrate" :options="options" @getItemizedFiltrate="query"></ItemizedFiltrate>
    </div>
    <div style="margin-bottom: 20px;">
      <DetailSummary :paymentsData="paymentsData" api-type="gold" :filtrate="filtrate" :apiType='type'></DetailSummary>
    </div>
    <el-main style="padding:0">
      <el-table :data="rewardsDetailData" border stripe header-align='center'
        class="credit-table-color-blue sy-global-has-gutter__th--text-center sy-global-el-table-fit--border" ref="table"
        :default-sort="{prop:'transactionTime', order: 'descending'}" :sort-orders="['ascending', 'descending']" @sort-change="sortChange"
        @row-click="goDeal">
        <el-table-column prop="transactionTime" sortable="custom" label="申请时间" width="180">
        </el-table-column>
        <el-table-column prop="transactionCode" label="交易编号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="serialNumber" label="回单号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="transactionType" label="交易类型">
        </el-table-column>
        <el-table-column prop="income" label="收入">
          <template slot-scope="scope"><span><span
                v-if="scope.row.income > 0"></span>{{scope.row.income | toThousands}}</span></template>
        </el-table-column>
        <el-table-column prop="expenditure" label="支出">
          <template slot-scope="scope"><span><span
                v-if="scope.row.expenditure > 0"></span>{{scope.row.expenditure | toThousands}}</span></template>
        </el-table-column>
        <el-table-column label="余额">
          <template slot-scope="scope">{{scope.row.balance | toThousands}}</template>
        </el-table-column>
      </el-table>
      <el-row class="sy-global--Pagination--bg" style="margin-bottom: 2rem" v-if="rewardsDetailData.length>0">
        <el-col>
          <div class="sy-global__div--Pagination sy-global-pull-right">
            <el-pagination @current-change="pageChange" @size-change="sizeChange" :page-sizes="pageSizes"
              :pageSize="pageSize" :current-page="pageNo" layout="total, sizes, prev, pager, next, jumper"
              :total="totalCnt">
            </el-pagination>
          </div>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script>
import BusinessTitle from '@/components/BusinessTitle'
import ItemizedFiltrate from '@/components/ItemizedFiltrate'
import DetailSummary from '@/components/DetailSummary'
import settings from '@/settings'
export default {
  name: 'rewardsdetailaccount',
  components: { BusinessTitle, ItemizedFiltrate, DetailSummary },
  data () {
    return {
      // 账薄类型金币
      type: 'gold',
      // 筛选
      filtrate: {},
      // 交易类型
      options: [
        {
          value: 'Withdraw',
          label: '提现'
        },
        {
          value: 'DepositReward',
          label: '奖励入账'
        }
      ],
      rewardsDetailData: [],
      pageSize: 10,
      pageSizes: settings.pageSizes,
      pageNo: 1,
      totalCnt: 0,
      // 交易统计
      paymentsData: {},
      // 明细账接口
      getItemizedAccountUrl: settings.apiGateway.getItemizedAccount
    }
  },
  created () {
    // this.getRewardsAccountData()
  },
  methods: {
    pageChange (curPage) {
      this.pageNo = curPage
      this.getRewardsAccountData()
    },
    sizeChange (pageSize) {
      this.pageSize = pageSize
      this.getRewardsAccountData()
    },
    query () {
      this.pageNo = 1
      this.getRewardsAccountData()
    },
    getRewardsAccountData () {
      // let filtrate = Object.assign({}, this.filtrate)
      let filtrate = JSON.parse(JSON.stringify(this.filtrate))
      if (filtrate.transactionTypes) {
        filtrate.transactionTypes = [filtrate.transactionTypes]
      }
      // 过滤transctionTypes 是空字符串的情况
      if (filtrate.transactionTypes === '') {
        delete filtrate.transactionTypes
      }
      if (filtrate.min) filtrate.min = parseFloat(filtrate.min.replace(/,/g, ''))
      if (filtrate.max) filtrate.max = parseFloat(filtrate.max.replace(/,/g, ''))
      this.fetch(`${this.getItemizedAccountUrl}/${this.type}/${this.pageNo - 1}/${this.pageSize}`, 'post', filtrate).then(data => {
        this.totalCnt = data.data.totalElements
        this.pageSize = data.data.pageSize
        this.paymentsData = {
          incomeCount: data.data.incomeCount,
          expenditureCount: data.data.expenditureCount,
          incomeAmount: data.data.incomeAmount,
          expenditureAmount: data.data.expenditureAmount
        }
        let directionItem = data.data.transactions
        directionItem.forEach(item => {
          if (item.direction === 'income') {
            item.income = item.amount
            item.expenditure = ''
          } else {
            item.income = ''
            item.expenditure = item.amount
          }
        })
        this.rewardsDetailData = directionItem
      }).catch(data => {
        this.$message.error(data.msg)
      })
    },
    // 通过row拿到的数据并跳转到详单页
    goDeal (row) {
      let path = ''
      switch (row.transactionType) {
        case '提现':
          path = '/allocator/withdraw-schedule'
          break
        case '提现服务费抵扣':
          path = '/allocator/withdraw-fee-schedule'
          break
        case '奖励入账':
          path = '/allocator/reward-schedule'
          break
        // case '操作服务费':
        //   path = '/allocator/operation-schedule'
        //   break
      }
      this.$router.push({
        path: path,
        query: { code: row.id, type: this.type }
      })
    },
    sortChange (obj) {
      if (obj.order === null) {
        this.$refs.table.sort('transactionTime', 'descending')
        return obj
      }

      this.filtrate.sequence = obj.order
      this.query()
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/variables';
.rewardsdetail-main {
  .filter-area {
    width: 100%;
    margin: 22px 0;
    box-sizing: border-box;
  }
}
.rewardsdetail-main/deep/.el-table td,
.el-table th {
  text-align: center;
}
.rewardsdetail-main/deep/.credit-table-color-blue tr {
  cursor: pointer;
  background-color: @table-bg;
  background-color: var(--mainTableBg) !important;
}
.rewardsdetail-main/deep/ .el-table__header tr:first-child {
  cursor: default;
}
.rewardsdetail-main/deep/.credit-table-color-blue .el-table__body tr:hover > td {
  cursor: pointer;
  background-color: @table-hover;
  background-color: var(--mainTableHover) !important;
}
.rewardsdetail-main/deep/.el-table .cell {
  text-align: center;
  padding-left: 0px;
  padding-right: 0px;
}
</style>
