<template>
  <div class="proceedsA">
    <BusinessTitle title="收款申请审核"></BusinessTitle>
    <div class="minpad">
      <BusinessFiltrate :filtrate="filtrate" :options="options" @getBusinessFiltrate="getBusinessFiltrate" roleType="付款企业">
    </BusinessFiltrate>
    <el-table :data="ProceedList" stripe border style="width: 100%" header-align='center' :empty-text='midCenter'
      class="ProceedList credit-table-color-blue sy-global-has-gutter__th--text-center sy-global-el-table-fit--border">
      <el-table-column prop="createdOn" label="发起时间" min-width="180">
      </el-table-column>
      <el-table-column prop="transactionNumber" label="交易编号" min-width="180" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="transactionAmount" label="收款金额"  width="141">
        <template slot-scope="scope">
          <span>{{scope.row.transactionAmount | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="days" label="账期（天）">
      </el-table-column>
      <el-table-column prop="payerName" label="付款企业名称" min-width="240">
      </el-table-column>
      <el-table-column prop="statusDesc" label="状态">
      </el-table-column>
      <el-table-column prop="address" label="操作" width="160">
        <template slot-scope="scope">
          <div v-if="(scope.row.statusDesc)==='待审核'">
            <!-- <div @click="handleAudit(scope.row)" class="skipBtn">审核</div> -->
            <Button class="toDeal" title="审核" @handleClick="handleAudit(scope.row)"></Button>
          </div>
          <div v-else>
            <div @click="checkTransaction(scope.row)" class="skipBtn">查看详情</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="sy-global--Pagination--bg" style="margin-bottom: 2rem" v-if="ProceedList.length>0">
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
import BusinessFiltrate from '@/components/BusinessFiltrate'
import settings from '@/settings'
export default {
  components: {
    BusinessTitle,
    BusinessFiltrate
  },
  data () {
    return {
      filtrate: {},
      options: [{
        value: 'PAYEE_OPE_PENDING',
        label: '待审核'
      }, {
        value: 'SUCCEED',
        label: '收款成功'
      }, {
        value: 'PAYER_OPE_REJECT',
        label: '拒绝支付'
      }, {
        value: 'PAY_TIME_OUT',
        label: '支付超时'
      }, {
        value: 'PAYEE_ADM_SUCCEED',
        label: '待支付'
      }, {
        value: 'PAYEE_ADM_REJECT',
        label: '审核未通过'
      }],
      midCenter: '暂无数据',
      pageSize: 10,
      pageSizes: settings.pageSizes,
      pageNo: 1,
      totalCnt: 0,
      // 获取收款列表数据
      getProceedsListUrl: settings.apiGateway.getProceedsList,
      ProceedList: []
    }
  },
  methods: {
    getBusinessFiltrate (filtrate) {
      this.filtrate = filtrate
      this.getPeoceedList()
    },
    pageChange (curPage) {
      this.pageNo = curPage
      this.getPeoceedList()
    },
    sizeChange (pageSize) {
      this.pageSize = pageSize
      this.getPeoceedList()
    },
    // 获取列表信息
    getPeoceedList () {
      // 要有拼接参数的步骤
      let params = ''
      if (JSON.stringify(this.filterData) === '{}') {
        params = ''
      } else {
        params += '?'
        if (this.filterData.operator) {
          this.filterData.relatedPartyName = this.filterData.operator
          delete this.filterData.operator
        }
        for (let key in this.filterData) {
          if (key === 'startTime') {
            this.filterData[key] = this.concatDate(this.filterData[key], '00:00:00')
          } else if (key === 'endTime') {
            this.filterData[key] = this.concatDate(this.filterData[key], '23:59:59')
          }
          params += `${key}=${this.filterData[key]}&`
        }
        params = params.substring(0, params.length - 1)
      }
      if (this.filtrate.min) this.filtrate.min = this.toThousands(this.filtrate.min)
      if (this.filtrate.max) this.filtrate.max = this.toThousands(this.filtrate.max)
      this.midCenter = '查询中'
      this.fetch(`${this.getProceedsListUrl}${this.pageNo - 1}/${this.pageSize}${params}`).then(data => {
        this.ProceedList = data.data.list
        this.ProceedList.map(item => {
          item.arrivalAmount = item.transactionAmount - item.transferCost
        })
        this.totalCnt = data.data.totalCnt
        this.pageSize = data.data.pageSize
        this.midCenter = '暂无数据'
      }).catch(data => {
        this.midCenter = '暂无数据'
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    // 产看交易详单
    checkTransaction (row) {
      this.$router.push({
        path: '/enterprise/proceedsDetail',
        query: { code: row.transactionNumber }
      })
    },
    // 查看审核页面
    handleAudit (row) {
      this.$router.push({
        path: '/enterprise/proceeds-apply-authority/detail',
        query: { code: row.transactionNumber }
      })
    }
  },
  created () {
    this.getPeoceedList()
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
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/less/variables';
.minpad {
  padding: 0 20px;
}
.ProceedList {
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
    width: 67px;
    height: 26px;
    letter-spacing: 0;
    padding: 0 !important;
  }
}
.proceedsA/deep/.el-table .cell {
  text-align: center;
  padding-left: 12px;
  padding-right: 12px;
}
.proceeds/deep/ .el-table th {
  padding-top: 7px;
  padding-bottom: 7px;
}
.proceedsA/deep/.el-table td:nth-child(3) .cell {
  text-align: right;
}
.ProceedList/deep/.el-button:hover{
  color: #ffffff;
  background-color: @btn-disabled;
  background-color: var(--mainColorDis);
  border: 0;
}
</style>

<style lang="less">
@import '~@/assets/less/variables';
.ProceedList.el-table .cell {
  text-align: center;
}
.ProceedList.credit-table-color-blue tr {
  background-color: @table-bg;
  background-color: var(--mainTableBg) !important;
}
.ProceedList.credit-table-color-blue .el-table__body tr {
  &:nth-of-type(2n + 1):hover > td {
    background-color: #e3eef8 !important;
    background-color: var(--mainTableHover) !important;
  }
}
</style>
