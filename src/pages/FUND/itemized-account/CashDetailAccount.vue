  <template>
  <div class="cash-detail-main">
    <BusinessTitle title="支付令明细账"></BusinessTitle>
    <div class="filter-area">
      <ItemizedFiltrate :filtrate="filtrate" :options="options" @getItemizedFiltrate="query"></ItemizedFiltrate>
    </div>
    <div style="margin-bottom: 20px;">
      <DetailSummary :paymentsData="paymentsData" :filtrate="filtrate" :apiType='type'></DetailSummary>
    </div>
     <el-main style="padding:0">
        <el-table
          :data="cashDetailData"
          border
          stripe
          header-align='center'
          class="credit-table-color-blue sy-global-has-gutter__th--text-center sy-global-el-table-fit--border"
          ref="table"
          :default-sort="{prop:'transactionTime', order: 'descending'}"
          :sort-orders="['ascending', 'descending']"
          @sort-change="sortChange"
          @row-click="goDeal">
          <el-table-column
            prop="transactionTime"
            sortable="custom"
            label="交易时间"
            width="180">
          </el-table-column>
          <el-table-column
            prop="transactionCode"
            label="交易编号"
            show-overflow-tooltip>
            </el-table-column>
          <el-table-column
            prop="transactionType"
            label="类型">
            </el-table-column>
          <el-table-column
            prop="relatedPartyName"
            label="关联方"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="income"
            label="收入">
            <template slot-scope="scope">{{scope.row.income | toThousands}}</template>
          </el-table-column>
          <el-table-column
            prop="expenditure"
            label="支出">
            <template slot-scope="scope">{{scope.row.expenditure | toThousands}}</template>
          </el-table-column>
          <el-table-column
            prop="balance"
            label="余额">
            <template slot-scope="scope">{{scope.row.balance | toThousands}}</template>
          </el-table-column>
        </el-table>
        <el-row class="sy-global--Pagination--bg" style="margin-bottom: 2rem" v-if="cashDetailData.length>0">
          <el-col>
            <div class="sy-global__div--Pagination sy-global-pull-right">
              <el-pagination
                @current-change="pageChange"
                @size-change="sizeChange"
                :page-sizes="pageSizes"
                :pageSize="pageSize"
                :current-page="pageNo"
                layout="total, sizes, prev, pager, next, jumper"
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
        // {
        //   value: 'Deposit',
        //   label: '充值'
        // },
        // {
        //   value: 'Payment',
        //   label: '支付'
        // },
        // {
        //   value: 'Rebate',
        //   label: '返利'
        // },
        {
          value: 'Withdraw',
          label: '提现'
        },
        // {
        //   value: 'Receive',
        //   label: '收款'
        // },
        // {
        //   value: 'PaymentFee',
        //   label: '转融成本'
        // },
        {
          value: 'CurrencyReward',
          label: '流通奖励'
        },
        {
          value: 'JointToken',
          label: '联合发令'
        },
        {
          value: 'FundPay',
          label: '资金方付款'
        },
        {
          value: 'WithdrawFee',
          label: '提现服务费'
        }
      ],
      cashDetailData: [],
      pageSize: 10,
      pageSizes: settings.pageSizes,
      pageNo: 1,
      totalCnt: 0,
      // 汇总信息数据
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
      // 复制一个筛选数据副本,调整transactionTypes数据格式并发送副本给后端
      // let filtrate = Object.assign({}, this.filtrate)
      let filtrate = JSON.parse(JSON.stringify(this.filtrate))
      if (filtrate.transactionTypes) {
        filtrate.transactionTypes = [filtrate.transactionTypes]
      }
      // 过滤transctionTypes 是空字符串的情况
      if (filtrate.transactionTypes === '') {
        delete filtrate.transactionTypes
      }
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
        // this.filtrate.transactionTypes = this.filtrate.transactionTypes.toString()
        this.cashDetailData = directionItem
      }).catch(data => {
        this.$message.error(data.msg)
      })
    },
    // 通过row拿到的数据并跳转到详单页
    goDeal (row) {
      let path = ''
      switch (row.transactionType) {
        case '提现':
          path = '/fund/withdraw-schedule'
          break
        case '提现服务费':
          path = '/fund/withdraw-fee-schedule'
          break
        case '邀请奖励':
          path = '/fund/invite-reward-schedule'
          break
        case '流通奖励':
          path = '/fund/circulation-reward-schedule'
          break
        case '资金方付款':
          path = '/fund/fund-payment-schedule'
          break
        case '联合发令':
          path = '/fund/joint-token-schedule'
          break
        case '操作服务费':
          path = '/fund/operation-schedule'
          break
      }
      this.$router.push({
        path: path,
        query: { code: row.id }
      })
    },
    sortChange (obj) {
      if (obj.order === null) {
        this.$refs.table.sort('transactionTime', 'ascending')
        return obj
      }

      this.filtrate.sequence = obj.order
      this.getCashAccountData()
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
.cash-detail-main/deep/.el-table td, .el-table th {
  text-align: center;
}
.cash-detail-main/deep/.credit-table-color-blue tr {
  cursor: pointer;
  background-color: @table-bg;
  background-color: var(--mainTableBg)!important;
  }
  .cash-detail-main/deep/ .el-table__header  tr:first-child {
    cursor: default;
  }
.cash-detail-main/deep/.credit-table-color-blue .el-table__body tr:hover>td {
  background-color: @table-hover;
  background-color: var(--mainTableHover)!important;
}
.cash-detail-main/deep/.el-table .cell {
  text-align: center;
  padding-left: 0px;
  padding-right: 0px;
}
</style>
