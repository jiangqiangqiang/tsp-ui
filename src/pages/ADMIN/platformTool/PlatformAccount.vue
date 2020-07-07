  <template>
  <div class="cash-detail-main">
    <BusinessTitle title="平台流水账簿"></BusinessTitle>
    <div class="minpad">
      <div class="topTitle"><span>企业资产</span></div>
    <div class="balance-box">
      <div class="balance-item">
        <svg-icon iconClass='qyrz_zjf' className='balance-icon ml23'></svg-icon>
        <span style="margin: 0 14px 0 10px">平台资金总额</span>
        <span class="main-color">{{ledgerTotal || 0 | toThousands}}&nbsp;</span>
        <span>元</span>
      </div>
    </div>
    <div class="filter-area">
      <PlaformFiltrate :filtrate="filtrate" :options="options" @getItemizedFiltrate="query"></PlaformFiltrate>
    </div>
    <div style="margin-bottom: 20px;">
      <DetailSummary :paymentsData="paymentsData" :filtrate="filtrate" :apiType='type'></DetailSummary>
    </div>
    <el-main style="padding:0">
      <el-table :data="cashDetailData" border stripe
        class="credit-table-color-blue sy-global-has-gutter__th--text-center sy-global-el-table-fit--border" ref="table"
        :default-sort="{prop:'transactionTime', order: 'ascending'}" :sort-orders="['ascending', 'descending']" @sort-change="sortChange"
        header-align='center' :empty-text='midCenter'>
        <el-table-column prop="transactionTime" label="交易时间" sortable="custom" min-width="160">
        </el-table-column>
        <el-table-column prop="transactionCode" label="交易编号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="enterpriseName" label="交易主体" min-width="190" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="transactionType" label="类型">
        </el-table-column>
        <el-table-column prop="relatedPartyName" label="关联方" min-width="190" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="income" label="收入" min-width="125">
          <template slot-scope="scope"><span><span
                v-if="scope.row.income > 0"></span>{{scope.row.income | toThousands}}</span></template>
        </el-table-column>
        <el-table-column prop="expenditure" label="支出" min-width="125">
          <template slot-scope="scope"><span><span
                v-if="scope.row.expenditure > 0"></span>{{scope.row.expenditure | toThousands}}</span></template>
        </el-table-column>
        <el-table-column prop="balance" label="余额" min-width="125">
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
  </div>
</template>

<script>
import BusinessTitle from '@/components/BusinessTitle'
import PlaformFiltrate from '@/components/PlaformFiltrate'
import DetailSummary from '@/components/DetailSummary'
import settings from '@/settings'
export default {
  name: 'cashdetailaccount',
  components: { BusinessTitle, PlaformFiltrate, DetailSummary },
  data () {
    return {
      // 账薄类型
      type: 'all',
      // 筛选
      filtrate: {},
      midCenter: '暂无数据',
      // 交易类型
      options: [
        {
          value: 'Deposit',
          label: '充值'
        },
        {
          value: 'Payment',
          label: '支付'
        },
        {
          value: 'Withdraw',
          label: '提现'
        },
        {
          value: 'Receive',
          label: '收款'
        },
        {
          value: '["SubsidyIn", "SubsidyOut"]',
          label: '垫资'
        },
        {
          value: 'AllocatorAward',
          label: '奖励入账'
        },
        {
          value: '["RebateIn", "RebateOut"]',
          label: '垫资返还'
        },
        {
          value: '["PayServerChargeOut", "PayServerChargeIn"]',
          label: '支付服务费'
        },
        {
          value: 'WithdrawFeeIn',
          label: '提现服务费'
        },
        {
          value: 'WithdrawBoneRevenue',
          label: '提现成本'
        },
        {
          value: '["AgentRewardIn", "AgentRewardOut"]',
          label: '代理商分润'
        },
        {
          value: 'PlatformFee',
          label: '操作手续费'
        },
        {
          value: 'CurrencyReward',
          label: '流通奖励'
        },
        {
          value: 'Dividend',
          label: '分红'
        },
        {
          value: '["PlatformRewardIn", "PlatformRewardOut"]',
          label: '服务商分润'
        },
        {
          value: 'Buy',
          label: '购买'
        },
        {
          value: 'BuyCharge',
          label: '购买充值'
        },
        {
          value: 'Sell',
          label: '出售'
        },
        {
          value: '["SellFeeIn", "ellFeeOut"]',
          label: '出售服务费'
        },
        {
          value: '["DepositServiceFeeIn", "DepositServiceFeeOut"]',
          label: '充值服务费'
        },
        {
          value: '["WithdrawServiceFeeIn", "WithdrawServiceFeeOut"]',
          label: '提现服务费'
        },
        {
          value: '["BuyServiceFeeIn", "BuyServiceFeeOut"]',
          label: '购买服务费'
        },
        {
          value: '["RationRewardIn", "RationRewardOut"]',
          label: '垫资方分润'
        },
        {
          value: 'BonusRewars',
          label: '分红池分润'
        },
        {
          value: 'OperatorRewars',
          label: '运营商奖励'
        },
        {
          value: '["OperatorRewarsExportIn", "OperatorRewarsExportOut"]',
          label: '运营商分润'
        },
        {
          value: '["DiscountIn", "DiscountOut"]',
          label: '折扣'
        },
        {
          value: 'Convert',
          label: '出售转换'
        }
      ],
      cashDetailData: [],
      ledgerTotal: 0,
      pageSize: 10,
      pageSizes: settings.pageSizes,
      pageNo: 1,
      totalCnt: 0,
      // 交易统计
      paymentsData: {},
      // 明细账接口
      getItemizedAccountUrl: settings.apiGateway.getItemizedAccount,
      getLedgerTotalUrl: settings.apiGateway.getLedgerTotal
    }
  },
  created () {
    let enterpriseName = this.$route.params.enterpriseName
    if (enterpriseName) {
      this.filtrate.relatedPartyName = enterpriseName
      // this.getCashAccountData()
    }
    this.getLedgerTotal()
    // this.getCashAccountData()
  },
  methods: {
    getLedgerTotal () {
      this.fetch(this.getLedgerTotalUrl).then(data => {
        this.ledgerTotal = data.data
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
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
        if (filtrate.transactionTypes.indexOf('[') === -1) {
          filtrate.transactionTypes = [filtrate.transactionTypes]
        } else {
          console.log(filtrate.transactionTypes)
          filtrate.transactionTypes = JSON.parse(filtrate.transactionTypes)
        }
      }
      // 过滤transctionTypes 是空字符串的情况
      if (filtrate.transactionTypes === '') {
        delete filtrate.transactionTypes
      }
      if (filtrate.min) filtrate.min = parseFloat(filtrate.min.replace(/,/g, ''))
      if (filtrate.max) filtrate.max = parseFloat(filtrate.max.replace(/,/g, ''))
      this.midCenter = '查询中'
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
        this.cashDetailData = directionItem
        this.midCenter = '暂无数据'
      }).catch(data => {
        this.midCenter = '暂无数据'
        this.$message.error(data.msg)
      })
    },
    // 通过row拿到的数据并跳转到详单页
    goDeal (row) {
      let path = ''
      switch (row.transactionType) {
        case '充值':
          path = '/enterprise/top-up-schedule'
          break
        case '收款':
          path = '/enterprise/proceeds-schedule'
          break
        case '支付':
          path = '/enterprise/payment-schedule'
          break
        case '提现':
          path = '/enterprise/withdraw-schedule'
          break
        case '提现服务费':
          path = '/enterprise/withdraw-fee-schedule'
          break
        case '购买':
          path = '/enterprise/buy-schedule'
          break
        case '出售':
          path = '/enterprise/sale-schedule'
          break
        case '返还金额':
          path = '/enterprise/rebate-schedule'
          break
        case '支付服务费':
          path = '/enterprise/operation-schedule'
          break
        case '出售转换':
          path = '/enterprise/convert-schedule'
          break
      }
      this.$router.push({
        path: path,
        query: { code: row.id, type: this.type }
      })
    },
    sortChange (obj) {
      if (obj.order === null) {
        this.$refs.table.sort('transactionTime', 'ascending')
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
.minpad {
  padding: 0 20px;
}
.cash-detail-main {
  .filter-area {
    width: 100%;
    margin: 22px 0;
    box-sizing: border-box;
  }
}
.topTitle {
    width: calc(~ '100% - 2px');
    height: 42px;
    background-color: #F7F4F8;
    line-height: 42px;
    border: 1px solid rgba(230, 230, 230, 1);
    font-size: 16px;
    color:rgba(101,101,101,1);
    margin-top: 22px;
    span {
      margin-left: 23px;
    }
  }
.balance-box {
    width: calc(~ '100% - 2px');
    height: 67px;
    background: rgba(255,251,244,1);
    margin-bottom: 23px;
    border: 1px solid rgba(230, 230, 230, 1);
    border-top: 0;
    .balance-item {
      display: flex;
      align-items: center;
      float: left;
      width: 50%;
      line-height: 67px;
    }
  }
  .balance-icon {
    width: 23px !important;
    height: 22px !important;
    color: @theme-blue;
    color: var(--mainColor);
    vertical-align: middle;
  }
  .ml23 {
    margin-left: 23px;
  }
  .main-color {
    font-size: 24px;
    font-weight: bold;
    color: @theme-blue;
    color: var(--mainColor);
  }
.cash-detail-main/deep/.el-table td,
.el-table th {
  text-align: center;
}
.cash-detail-main/deep/.credit-table-color-blue {
  tr {
    background-color: @table-bg;
    background-color: var(--mainTableBg) !important;
  }
}
// .cash-detail-main/deep/.credit-table-color-blue .el-table__body tr:hover > td {
//   background-color: @table-hover;
//   background-color: var(--mainTableHover) !important;
// }
.cash-detail-main/deep/.el-table .cell {
  text-align: center;
  padding-left: 12px;
  padding-right: 12px;
}
.cash-detail-main/deep/.el-table td:nth-child(6) .cell, .cash-detail-main/deep/.el-table td:nth-child(7) .cell, .cash-detail-main/deep/.el-table td:nth-child(8) .cell {
  text-align: right;
}
.cash-detail-main/deep/ .el-table th {
  padding-top: 3px;
  padding-bottom: 3px;
}
.cash-detail-main/deep/.credit-table-color-blue .el-table__body tr:hover > td {
  background-color: #fcefe0 !important;
  cursor: default;
}
.cash-detail-main/deep/.credit-table-color-blue .el-table__body tr:nth-child(2n) td {
  background-color: #ffffff;
}
.cash-detail-main/deep/.credit-table-color-blue .el-table__body tr td {
  padding: 9.5px 0;
}
</style>
