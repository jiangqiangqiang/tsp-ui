<template>
  <div class="joint-token">
    <BusinessTitle title="购买支付令"></BusinessTitle>
    <div class="minpad">
      <div style="position:relative" @click="toBuy">
      <Button title="去购买" class="jointTokenBtn"></Button>
      <svg-icon iconClass="sy_mrl" className='buy_icon'></svg-icon>
    </div>
    <BusinessFiltrate :filtrate="filtrate" :options="options" @getBusinessFiltrate="getBusinessFiltrate" roleType=""
      :isDeal="true" timeText="购买时间" amountText="报价"></BusinessFiltrate>
    <div class="buyTableTitle">购买记录</div>
    <el-table :data="buyListData" stripe border style="width: 100%" @sort-change="sortChange" ref="table"
      class="credit-table-color-blue sy-global-has-gutter__th--text-center sy-global-el-table-fit--border"
      :default-sort="{prop:'createdOn', order: 'descending'}" :sort-orders="['ascending', 'descending']"
      header-align='center' :empty-text='midCenter'>
      <el-table-column prop="createdOn" label="购买时间" sortable="custom" min-width="180">
        <template slot-scope="scope">
          <span>{{scope.row.createdOn}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="txCode" label="交易编号" min-width="180" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="tokenNum" label="购买支付令" sortable="custom" width="141">
        <template slot-scope="scope">
          <span>{{scope.row.tokenNum | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="报价" sortable="custom" width="141">
        <template slot-scope="scope">
          <span>{{scope.row.amount | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="serviceFee" label="服务费">
        <template slot-scope="scope">
          <span>{{scope.row.serviceFee | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="rate" label="折扣率" sortable="custom">
        <template slot-scope="scope">
          <span>{{scope.row.rate*100 | toFix2}}%</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span>{{scope.row.status | saleStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作" width="150">
        <template slot-scope="scope">
          <div v-if="scope.row.status === 'Paying'">
            <!-- <span @click="handleClick(scope.row)">支付</span> -->
            <Button class="toDeal" title="支付" @handleClick="handleClick(scope.row)"></Button>
            <span class="skipBtn" style="marginLeft:10px" @click="toBuyDetail(scope.row)">查看详情</span>
          </div>
          <div class="skipBtn" v-else @click="toBuyDetail(scope.row)">查看详情</div>
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
import BusinessFiltrate from '@/components/BusinessFiltrate'
import settings from '@/settings'
export default {
  components: {
    BusinessTitle,
    BusinessFiltrate
  },
  data () {
    return {
      pageSize: 10,
      pageSizes: settings.pageSizes,
      pageNo: 1,
      totalCnt: 0,
      filtrate: {},
      midCenter: '暂无数据',
      userRole: '',
      options: [{
        value: 'Paying',
        label: '待支付'
      },
      {
        value: 'Succeed',
        label: '已完成'
      },
      {
        value: 'CanceledByOperator',
        label: '已取消'
      },
      {
        value: 'Pending',
        label: '待审核'
      },
      {
        value: 'Sending',
        label: '交易中'
      }],
      buyListData: [],
      sortColum: {},
      className: '',
      // 买令列表
      getBuyListUrl: settings.apiGateway.getBuyerList
    }
  },
  methods: {
    toBuy () {
      this.$router.push('/enterprise/trading-center')
    },
    getBusinessFiltrate (filtrate) {
      this.filtrate = filtrate
      this.getBuyList()
    },
    pageChange (curPage) {
      this.pageNo = curPage
      this.getBuyList()
    },
    sizeChange (pageSize) {
      this.pageSize = pageSize
      this.getBuyList()
    },
    toBuyDetail (row) {
      this.$router.push({
        path: '/enterprise/buy-detail',
        query: { code: row.id }
      })
    },
    getBuyList () {
      let data = JSON.parse(JSON.stringify(this.filtrate))
      if (this.filtrate.min) this.filtrate.min = this.toThousands(this.filtrate.min)
      if (this.filtrate.max) this.filtrate.max = this.toThousands(this.filtrate.max)
      if (this.filtrate.rateMin) this.filtrate.rateMin = this.filtrate.rateMin * 100
      if (this.filtrate.rateMax) this.filtrate.rateMax = this.filtrate.rateMax * 100
      if (data.startTime) data.startTime = this.concatDate(data.startTime, '00:00:00')
      if (data.endTime) data.endTime = this.concatDate(data.endTime, '23:59:59')
      if (data.transactionType) {
        if (data.transactionType === 'CanceledByOperator' || data.transactionType === 'CanceledByAdmin') {
          data.statusList = ['Cancel', 'CanceledByOperator', 'CanceledByAdmin']
          delete data.transactionType
        } else {
          data.statusList = [data.transactionType]
          delete data.transactionType
        }
      }
      this.midCenter = '查询中'
      this.fetch(`${this.getBuyListUrl}${this.pageNo - 1}/${this.pageSize}`, 'post', data).then(data => {
        this.buyListData = JSON.parse(JSON.stringify(data.data.list)).concat(JSON.parse(JSON.stringify(data.data.list)))
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
      this.$router.push({
        path: '/enterprise/start-buy',
        query: { id: row.id, status: row.status }
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
      this.sortColum = ''
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
    this.userRole = this.getUserRole()
    this.getBuyList()
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
  filters: {
    toFix (val) {
      return parseFloat(val).toFixed(2)
    }
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
.toDeal {
  width: 52px;
  height: 26px;
  letter-spacing: 0 !important;
  padding: 0 !important;
}
.buy_icon {
  width: 23px !important;
  height: 16px !important;
  color: #ffffff;
  position: absolute;
  top: 33px;
  left: 72px;
  cursor: pointer;
}
.buyTableTitle {
  width: 75px;
  height: 16px;
  font-size: 16px;
  color: rgba(101, 101, 101, 1);
  margin: 28px 0 21px 22px;
  padding-left: 9px;
  border-left: 4px solid @theme-blue;
  border-left: 4px solid var(--mainColor);
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
.joint-token/deep/.el-table .cell {
  text-align: center;
}
.joint-token/deep/.credit-table-color-blue tr {
  background-color: @table-bg;
  background-color: var(--mainTableBg) !important;
}
.joint-token/deep/.credit-table-color-blue .el-table__body tr {
  &:nth-of-type(2n + 1):hover > td {
    background-color: #e3eef8 !important;
    background-color: var(--mainTableHover) !important;
  }
}
.joint-token/deep/ .el-table th {
  padding-top: 3px;
  padding-bottom: 3px;
}
.el-button--primary:hover {
  background: @theme-blue;
  background: var(--mainColor);
}
.dialogBtn {
  padding-left: 26px;
}
.joint-token/deep/.el-table .cell {
  text-align: center;
  padding-left: 12px;
  padding-right: 12px;
}
.joint-token/deep/.el-button:hover{
  color: #ffffff;
  background-color: @btn-disabled;
  background-color: var(--mainColorDis);
  border: 0;
}
.joint-token/deep/.el-table td:nth-child(3) .cell, .joint-token/deep/.el-table td:nth-child(4) .cell, .joint-token/deep/.el-table td:nth-child(5) .cell {
  text-align: right;
}
</style>

<style lang="less">
.dialogs .el-dialog {
  position: absolute;
  top: 50% !important;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  margin-top: 0 !important;
  margin-left: 108px;
}
.joint-token .el-dialog__footer {
  padding: 10px 20px 37px !important;
}
</style>
