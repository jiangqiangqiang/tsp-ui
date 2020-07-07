  <template>
  <div class="cash-detail-main">
    <BusinessTitle title="企业账簿"></BusinessTitle>
    <div class="minpad">
      <div class="serchEnp">
      <span style="margin: 0 14px 0 79px">企业名称</span>
      <el-autocomplete
        v-model="enterpriseName"
        :fetch-suggestions="querySearchAsync"
        class="amount-input"
        placeholder="请输入企业名称"
        @select="handleSelect"
      ></el-autocomplete>
      <!-- <el-input v-model="enterpriseName" class="amount-input" placeholder="请输入企业名称"></el-input> -->
      <span style="margin: 0 14px 0 44px">统一社会信用代码</span>
      <el-input v-model="creditCode" class="amount-input" placeholder="请输入统一社会信用代码"></el-input>
      <Button title="查 询" class="confirm-btn" @handleClick="serchEnpInfo"></Button>
    </div>
    <table>
      <tr>
        <td>公司名称</td>
        <td style="width:270px">{{enterpriseInfo.enterpriseName || ''}}</td>
        <td>角色</td>
        <td style="width:83px">{{enterpriseInfo.role || ''}}</td>
        <td>账户余额</td>
        <td>{{enterpriseInfo.total || 0 | toThousands}} 元</td>
        <td>三方账户余额</td>
        <td>{{enterpriseInfo.huifu || 0 | toThousands}} 元</td>
      </tr>
    </table>
    <div class="filter-area">
      <ItemizedFiltrate :filtrate="filtrate" :options="options" @getItemizedFiltrate="query"></ItemizedFiltrate>
    </div>
    <div style="margin-bottom: 20px;">
      <DetailSummary :paymentsData="paymentsData" :filtrate="filtrate" :apiType='type' :enterpriseName="enterpriseInfo.enterpriseName"></DetailSummary>
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
        <el-table-column prop="transactionType" label="交易类型" min-width="103">
        </el-table-column>
        <el-table-column prop="relatedPartyName" label="关联方" min-width="180" show-overflow-tooltip>
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
import ItemizedFiltrate from '@/components/ItemizedFiltrate'
import DetailSummary from '@/components/DetailSummary'
import settings from '@/settings'
export default {
  name: 'cashdetailaccount',
  components: { BusinessTitle, ItemizedFiltrate, DetailSummary },
  data () {
    return {
      // 账薄类型
      type: 'enp',
      // 筛选
      filtrate: {},
      enterpriseName: '',
      creditCode: '',
      restaurants: [],
      timeout: null,
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
      enterpriseInfo: {},
      pageSize: 10,
      pageSizes: settings.pageSizes,
      pageNo: 1,
      totalCnt: 0,
      // 交易统计
      paymentsData: {},
      // 明细账接口
      getItemizedAccountUrl: settings.apiGateway.getItemizedAccount,
      getEnpDimUrl: settings.apiGateway.getEnpDim,
      serchEnpUrl: settings.apiGateway.serchEnp
    }
  },
  created () {
    // this.restaurants = [
    //   { value: 'abc' },
    //   { value: 'aabc' },
    //   { value: 'aaabc' },
    //   { value: 'bbc' },
    //   { value: 'cbc' }
    // ]
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
    debounce (func, delay = 200) {
      let timeout = null
      return function () {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          func.apply(this, arguments)
        }, delay)
      }
    },
    changeAction (queryString, cb) {
      const self = this
      if (!this.enterpriseName) {
        // this.$message.error('请输入企业名称')
        return
      }
      this.fetch(`${this.getEnpDimUrl}0/40?name=${this.enterpriseName}`).then(data => {
        self.restaurants = data.data.list
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.restaurants.forEach((item, index) => {
            this.restaurants[index].value = this.restaurants[index].enterpriseName
          })
          var results = queryString ? this.restaurants.filter(this.createStateFilter(queryString)) : this.restaurants
          cb(results)
        }, 10)
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    // 模糊搜索异步函数
    querySearchAsync (queryString, cb) {
      this.debounce(this.changeAction, 200)(queryString, cb)
    },
    createStateFilter (queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect (item) {
      console.log(item, this.enterpriseName)
    },
    serchEnpInfo () {
      let query = ''
      if (this.enterpriseName) {
        this.creditCode ? query = '?name=' + this.enterpriseName + '&creditCode=' + this.creditCode : query = '?name=' + this.enterpriseName
      } else if (this.creditCode) {
        query = '?creditCode=' + this.creditCode
      }
      this.fetch(`${this.serchEnpUrl}${query}`).then(data => {
        this.enterpriseInfo = data.data
        this.getCashAccountData()
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
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
      if (!this.enterpriseInfo.enterpriseName) {
        this.$message.error('请先输入企业名称或统一社会信用代码查询')
        return
      }
      this.midCenter = '查询中'
      filtrate.enterpriseName = this.enterpriseInfo.enterpriseName
      if (filtrate.min) filtrate.min = parseFloat(filtrate.min.replace(/,/g, ''))
      if (filtrate.max) filtrate.max = parseFloat(filtrate.max.replace(/,/g, ''))
      this.fetch(`${this.getItemizedAccountUrl}/${this.type}/${this.pageNo - 1}/${this.pageSize}`, 'post', filtrate).then(data => {
        this.totalCnt = data.data.totalElements
        this.pageSize = data.data.pageSize
        this.midCenter = '暂无数据'
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
      if (this.enterpriseInfo.enterpriseName) {
        this.query()
      }
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
.serchEnp {
  width: calc(~ '100% - 2px');
  height: 46px;
  border: 1px solid rgba(230, 230, 230, 1);
  background-color: #fcfcfc;
  margin-top: 18px;
  padding-top: 15px;
  .amount-input {
    width: 287px;
  }
}
.serchEnp /deep/.el-input__inner {
  height: 31px;
}
.confirm-btn {
  width: 121px;
  height: 31px;
  letter-spacing: 0;
  margin-left: 46px;
  padding: 0 !important;
}
table {
  width: 100%;
  margin-top: 19px;
  tr {
    td {
      font-size: 14px;
      color:rgba(101,101,101,1);
      height: 40px;
      line-height: 40px;
      border: 1px solid #e6e6e6;
    }
    td:nth-child(2n+1) {
      text-align: center;
      padding: 0 15px;
      background-color: #F2F2F4;
    }
    td:nth-child(2n) {
      text-align: left;
      padding-left: 15px;
    }
  }
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
.cash-detail-main/deep/.credit-table-color-blue .el-table__body tr:hover > td {
  cursor: pointer;
  background-color: @table-hover;
  background-color: var(--mainTableHover) !important;
}
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
