  <template>
  <div class="cash-detail-main">
    <BusinessTitle title="交易记录"></BusinessTitle>
    <div class="minpad">
      <div class="filter-area">
      <ItemizedFiltrate :filtrate="filtrate" :options="options" @getItemizedFiltrate="query"></ItemizedFiltrate>
    </div>
    <div style="margin-bottom: 20px;">
      <DetailSummary :paymentsData="paymentsData" :filtrate="filtrate" apiType='records'></DetailSummary>
    </div>
    <el-main style="padding:0">
      <el-table :data="cashDetailData" border stripe :empty-text='midCenter'
        class="credit-table-color-blue sy-global-has-gutter__th--text-center sy-global-el-table-fit--border" ref="table"
        :default-sort="{prop:'createTime', order: 'descending'}" :sort-orders="['ascending', 'descending']"
        @sort-change="sortChange" header-align='center'>
        <el-table-column prop="createTime" label="交易时间" sortable="custom" width="180">
        </el-table-column>
        <el-table-column prop="tx_id" label="交易编号" width="160">
        </el-table-column>
        <el-table-column prop="type" label="交易类型">
          <template slot-scope="scope">
            {{scope.row.type==='payee'?'收款':'支付'}}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
        </el-table-column>
        <el-table-column prop="realtionName" label="关联方" width="220">
        </el-table-column>
        <el-table-column prop="inAmount" label="收入">
          <template slot-scope="scope">
            <span>
              <span v-if="scope.row.inAmount > 0">{{scope.row.inAmount | toThousands}}</span>
              <span v-else></span>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="outAmount" label="支出">
          <template slot-scope="scope"><span>
              <span v-if="scope.row.outAmount > 0">{{scope.row.outAmount | toThousands}}</span>
              <span v-else></span>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="balance" label="操作">
          <template slot-scope="scope">
            <div class="skipBtn" @click="goDeal(scope.row)">查看详情</div>
          </template>
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
      // 筛选
      filtrate: {},
      // 交易类型
      options: [
        {
          value: 'payer',
          label: '支付'
        },
        {
          value: 'payee',
          label: '收款'
        }
      ],
      midCenter: '暂无数据',
      cashDetailData: [],
      pageSize: 10,
      pageSizes: settings.pageSizes,
      pageNo: 1,
      totalCnt: 0,
      // 交易统计
      paymentsData: {},
      // 交易账接口
      getEnpTradingUrl: settings.apiGateway.getEnpTrading
    }
  },
  created () {
    this.filtrate.relatedPartyName = this.$store.state.tradingEnp
    // let enterpriseName = this.$route.params.enterpriseName
    // if (enterpriseName) {
    //   this.filtrate.relatedPartyName = enterpriseName
    //   // this.getCashAccountData()
    // }
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
      let filtrate = JSON.parse(JSON.stringify(this.filtrate))
      if (filtrate.transactionTypes) filtrate.type = filtrate.transactionTypes
      // 过滤transctionTypes 是空字符串的情况
      delete filtrate.transactionTypes
      if (filtrate.min) filtrate.min = parseFloat(filtrate.min.replace(/,/g, ''))
      if (filtrate.max) filtrate.max = parseFloat(filtrate.max.replace(/,/g, ''))
      this.midCenter = '查询中'
      this.fetch(`${this.getEnpTradingUrl}${this.pageNo - 1}/${this.pageSize}`, 'post', filtrate).then(data => {
        this.totalCnt = data.data.totalElements
        this.pageSize = data.data.pageSize
        this.paymentsData = {
          incomeCount: data.data.incomeCount,
          expenditureCount: data.data.expenditureCount,
          incomeAmount: data.data.incomeAmount,
          expenditureAmount: data.data.expenditureAmount
        }
        this.cashDetailData = data.data.paymentDtoElements
        this.midCenter = '暂无数据'
      }).catch(data => {
        this.midCenter = '暂无数据'
        this.$message.error(data.msg)
      })
    },
    // 通过row拿到的数据并跳转到详单页
    goDeal (row) {
      let path = ''
      switch (row.type) {
        case 'payee':
          path = '/enterprise/proceedsDetail'
          break
        case 'payer':
          path = '/enterprise/payment-detail'
          break
      }
      this.$router.push({
        path: path,
        query: { code: row.tx_id }
      })
    },
    sortChange (obj) {
      if (obj.order === null) {
        this.$refs.table.sort('createTime', 'descending')
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
.skipBtn {
  cursor: pointer;
  text-align: center;
  height: 19px;
  margin: 0 auto;
  color: @theme-blue;
  color: var(--mainColor);
  text-decoration: underline;
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
  padding-left: 0px;
  padding-right: 0px;
}
.cash-detail-main/deep/ .el-table th {
  padding-top: 3px;
  padding-bottom: 3px;
}
</style>
