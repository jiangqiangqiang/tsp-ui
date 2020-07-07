  <template>
  <div class="cash-detail-main">
    <BusinessTitle title="分润明细账"></BusinessTitle>
    <div class="filter-area">
      <ItemizedFiltrate :filtrate="filtrate" :options="options" @getItemizedFiltrate="query"></ItemizedFiltrate>
    </div>
    <div style="margin-bottom: 20px;">
      <DetailSummary :paymentsData="paymentsData" :filtrate="filtrate" type='benefit' :apiType='type'></DetailSummary>
    </div>
    <el-main style="padding:0">
      <el-table :data="cashDetailData" border stripe header-align='center'
        class="credit-table-color-blue sy-global-has-gutter__th--text-center sy-global-el-table-fit--border" ref="table"
        :default-sort="{prop:'transactionTime', order: 'descending'}" :sort-orders="['ascending', 'descending']" @sort-change="sortChange"
        @row-click="goDeal">
        <el-table-column prop="transactionTime" label="交易时间" sortable="custom" width="180">
        </el-table-column>
        <el-table-column prop="transactionCode" label="交易编号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="serialNumber" label="回单号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="transactionType" label="交易类型">
        </el-table-column>
        <el-table-column prop="relatedPartyName" label="关联方" width="220">
        </el-table-column>
        <el-table-column prop="income" label="收入">
          <template slot-scope="scope"><span><span
                v-if="scope.row.income > 0"></span>{{scope.row.income | toThousands}}</span></template>
        </el-table-column>
        <el-table-column prop="expenditure" label="支出">
          <template slot-scope="scope"><span><span
                v-if="scope.row.expenditure > 0"></span>{{scope.row.expenditure | toThousands}}</span></template>
        </el-table-column>
        <el-table-column prop="balance" label="余额">
          <template slot-scope="scope">{{scope.row.balance | toThousands}}</template>
        </el-table-column>
      </el-table>
      <el-row class="sy-global--Pagination--bg" style="margin-bottom: 2rem" v-if="cashDetailData.length>0">
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
  name: 'cashdetailaccount',
  components: { BusinessTitle, ItemizedFiltrate, DetailSummary },
  data () {
    return {
      // 账薄类型
      type: 'self',
      // 筛选
      filtrate: {},
      // 交易类型
      options: [
        {
          value: 'RationReward',
          label: '垫资方分润'
        }
      ],
      cashDetailData: [],
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
    let enterpriseName = this.$route.params.enterpriseName
    if (enterpriseName) {
      this.filtrate.relatedPartyName = enterpriseName
      // this.getCashAccountData()
    }
    // this.getCashAccountData()
  },
  methods: {
    pageChange (curPage) {
      this.pageNo = curPage
      this.getCashAccountData()
    },
    sizeChange (pageSize) {
      this.pageSize = pageSize
      this.getCashAccountData()
    },
    query () {
      this.pageNo = 1
      this.getCashAccountData()
    },
    getCashAccountData () {
      // this.filtrate = filtrate
      // 复制一个筛选数据副本,调整transactionTypes数据格式并发送副本给后端
      // let filtrates = Object.assign({}, this.filtrate)
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
      this.fetch(`${this.getItemizedAccountUrl}/${this.type}/${this.pageNo - 1}/${this.pageSize}?tag_ep=benefit`, 'post', filtrate).then(data => {
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
        this.cashDetailData = directionItem
      }).catch(data => {
        this.$message.error(data.msg)
      })
    },
    // 通过row拿到的数据并跳转到详单页
    goDeal (row) {
      let path = ''
      switch (row.transactionType) {
        case '垫资方分润':
          path = '/allocator/ration-reward-schedule'
          break
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
.cash-detail-main {
  .filter-area {
    width: 100%;
    margin: 22px 0;
    box-sizing: border-box;
  }
}
.cash-detail-main/deep/.el-table td,
.el-table th {
  text-align: center;
}
.cash-detail-main/deep/.credit-table-color-blue {
  tr {
    cursor: pointer;
    background-color: @table-bg;
    background-color: var(--mainTableBg) !important;
  }
}
.cash-detail-main/deep/ .el-table__header tr:first-child {
  cursor: default;
}
.cash-detail-main/deep/.credit-table-color-blue .el-table__body tr:hover > td {
  cursor: pointer;
  background-color: @table-hover;
  background-color: var(--mainTableHover) !important;
}
.cash-detail-main/deep/.el-table .cell {
  text-align: center;
  padding-left: 0px;
  padding-right: 0px;
}
</style>
