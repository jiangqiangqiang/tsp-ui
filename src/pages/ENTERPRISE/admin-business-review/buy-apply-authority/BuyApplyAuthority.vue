<template>
  <div class="bugA">
    <BusinessTitle title="交易申请审核"></BusinessTitle>
    <div class="minpad">
      <BusinessFiltrate :filtrate="filtrate" :options="options" @getBusinessFiltrate="getBusinessFiltrate" roleType=""
      :isDeal="true" timeText="发布时间" amountText="报价">
    </BusinessFiltrate>
    <el-table :data="PayList" stripe border style="width: 100%" header-align='center' :empty-text='midCenter'
      class="PayList credit-table-color-blue sy-global-has-gutter__th--text-center sy-global-el-table-fit--border">
      <el-table-column prop="createdOn" label="发布时间" min-width="180">
        <template slot-scope="scope">
          <span>{{scope.row.createdOn}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="txCode" label="交易编号" min-width="180" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="tokenNum" label="购买支付令" width="141">
        <template slot-scope="scope">
          <span>{{scope.row.tokenNum | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="报价" width="141">
        <template slot-scope="scope">
          <span>{{scope.row.amount | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="serviceFee" label="服务费">
        <template slot-scope="scope">
          <span>{{scope.row.serviceFee | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="rate" label="折扣率">
        <template slot-scope="scope">
          <span>{{scope.row.rate*100 | toFix2}}%</span>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span>
            <!-- <el-tooltip class="item" effect="light" placement="right" v-if="scope.row.status==='Pending'">
              <div slot="content">
                剩余{{cutTime[scope.row.transactionNumber] |setTimeHour}}时{{cutTime[scope.row.transactionNumber] | setTimeMinutes}}分{{cutTime[scope.row.transactionNumber] | setSecond}}秒
              </div>
              <svg-icon iconClass="zjf_lhfl_djs" className='wait_icon'></svg-icon>
            </el-tooltip> -->
            {{scope.row.status | buyStatus}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <div v-if="(scope.row.status)=='Pending'">
            <Button class="toDeal" title="审核" @handleClick="Transaction(scope.row)"></Button>
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
        value: 'Paying',
        label: '已通过'
      },
      {
        value: 'Pending',
        label: '待审核'
      },
      {
        value: 'CanceledByAdmin',
        label: '审核未通过'
      }],
      midCenter: '暂无数据',
      getPayListUrl: settings.apiGateway.getBuyerList,
      pageSize: 10,
      pageSizes: settings.pageSizes,
      pageNo: 1,
      totalCnt: 0,
      PayList: [],
      cutTime: {}
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
    // 获取列表信息
    getPayList () {
      let data = JSON.parse(JSON.stringify(this.filtrate))
      if (this.filtrate.min) this.filtrate.min = this.toThousands(this.filtrate.min)
      if (this.filtrate.max) this.filtrate.max = this.toThousands(this.filtrate.max)
      if (this.filtrate.rateMin) this.filtrate.rateMin = this.filtrate.rateMin * 100
      if (this.filtrate.rateMax) this.filtrate.rateMax = this.filtrate.rateMax * 100
      if (data.startTime) data.startTime = this.concatDate(data.startTime, '00:00:00')
      if (data.endTime) data.endTime = this.concatDate(data.endTime, '23:59:59')
      if (data.transactionType) {
        if (data.transactionType === 'Paying') {
          data.statusList = ['Paying', 'Succeed', 'Sending', 'CanceledByOperator']
          delete data.transactionType
        } else {
          data.statusList = [data.transactionType]
          delete data.transactionType
        }
      }
      this.midCenter = '查询中'
      this.fetch(`${this.getPayListUrl}${this.pageNo - 1}/${this.pageSize}`, 'post', data).then(res => {
        this.PayList = res.data.list
        // this.PayList.forEach(list => {
        //   if (list.statusDesc === '待审核' || list.statusDesc === '支付失败') {
        //     this.$set(this.cutTime, list.transactionNumber, Math.ceil(list.remainTime / 1000))
        //     this.setTime(list.transactionNumber)
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
    setTime (transactionNumber) {
      let that = this
      let timer = setInterval(() => {
        if (that.cutTime[transactionNumber] > 0) {
          that.cutTime[transactionNumber]--
        }
        if (that.cutTime[transactionNumber] <= 0) {
          clearInterval(timer)
        }
      }, 1000)
    },
    Transaction (row) {
      this.$router.push({
        path: '/enterprise/buy-apply-authority/detail',
        query: { id: row.id, status: row.status }
      })
    },
    // 产看交易详单
    checkTransaction (row) {
      this.$router.push({
        path: '/enterprise/buy-detail',
        query: { code: row.id }
      })
    }
  },
  // computed: {
  //   filterData () {
  //     let filterData = {}
  //     for (let key in this.filtrate) {
  //       if (this.filtrate[key]) {
  //         if (key === 'transactionType') {
  //           filterData['status'] = this.filtrate[key]
  //         } else {
  //           filterData[key] = this.filtrate[key]
  //         }
  //       }
  //     }
  //     return filterData
  //   }
  // },
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
.bugA/deep/.el-table .cell {
  text-align: center;
  padding-left: 12px;
  padding-right: 12px;
}
.bugA/deep/.el-table td:nth-child(3) .cell, .bugA/deep/.el-table td:nth-child(4) .cell, .bugA/deep/.el-table td:nth-child(5) .cell {
  text-align: right;
}
.bugA/deep/ .el-table th {
  padding-top: 3px;
  padding-bottom: 3px;
}
.bugA/deep/.el-button:hover{
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
