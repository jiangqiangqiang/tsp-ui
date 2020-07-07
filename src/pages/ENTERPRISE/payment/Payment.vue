<template>
  <div>
    <BusinessTitle title="支付"></BusinessTitle>
    <div class="minpad">
      <div class="filter-area">
      <BusinessFiltrate @getBusinessFiltrate="getBusinessFiltrate" :filtrate="filtrate" :options="options"
        roleType="收款企业">
      </BusinessFiltrate>
    </div>
    <div class="tabledetail-main">
      <el-table :data="tableData" border stripe style="width: 100%" header-align='center' :empty-text='midCenter'
        class="credit-table-color-blue sy-global-has-gutter__th--text-center sy-global-el-table-fit--border">
        <el-table-column prop="createdOn" align="center" label="发起时间" min-width="160">
        </el-table-column>
        <el-table-column prop="transactionNumber" align="center" label="交易编号" min-width="140" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="transactionAmount" align="center" label="支付金额" width="141">
          <template slot-scope="scope">
            <span>{{scope.row.transactionAmount | toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="days" align="center" label="账期（天）">
        </el-table-column>
        <el-table-column prop="payerName" align="center" label="收款企业名称" min-width="240">
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <span :style="scope.row.statusDesc==='拒绝支付' || scope.row.statusDesc==='审核未通过' ? 'color:rgba(206,42,42,1);':''">
              <el-tooltip class="item" effect="light" placement="right" v-if="scope.row.statusDesc==='待审核'">
                <div slot="content">
                  剩余{{cutTime[scope.row.transactionNumber] |setTimeHour}}时{{cutTime[scope.row.transactionNumber] | setTimeMinutes}}分{{cutTime[scope.row.transactionNumber] | setSecond}}秒
                </div>
                <svg-icon iconClass="zjf_lhfl_djs" className='wait_icon'></svg-icon>
              </el-tooltip>{{scope.row.statusDesc}}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="服务费">
          <template slot-scope="scope">
            <span
              v-if="scope.row.statusDesc==='待审核' || scope.row.statusDesc==='支付成功'">{{scope.row.fee | toThousands}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <a class="operation-btn" @click="handleClick(scope.row)" type="text" size="small"
              v-if="scope.row.paymentStatus.toLowerCase() === 'succeed' || scope.row.statusDesc === '拒绝支付' || scope.row.statusDesc === '交易中' || scope.row.statusDesc === '支付中' || scope.row.statusDesc === '支付超时'">查看详情</a>
            <span v-else-if="scope.row.statusDesc === '待审核'">
              <a class="operation-btn" @click="handleClick(scope.row)" type="text" size="small">取消申请</a>
              <a class="operation-btn" @click="toDetail(scope.row)" type="text" size="small">查看详情</a>
            </span>
            <Button class="toDeal" :title="scope.row | showOperation" @handleClick="handleClick(scope.row)"
              v-else-if="scope.row.statusDesc === '待支付' || scope.row.statusDesc === '管理员驳回' || scope.row.statusDesc === '申请超时' || scope.row.statusDesc === '支付失败'|| scope.row.statusDesc === '已取消'"></Button>
          </template>
        </el-table-column>
      </el-table>
      <el-row class="sy-global--Pagination--bg" style="margin-bottom: 2rem" v-if="tableData.length>0">
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
    <el-dialog :visible.sync="dialogCancelPayment" center width="568px" class="dialog">
      <div>
        <p class="prompt">是否取消支付申请</p>
        <div class="password">
          <table style="width:471px;">
            <tr>
              <td>收款企业</td>
              <td>{{paymentDetail.enpName}}</td>
            </tr>
            <tr>
              <td>企业证件号</td>
              <td>{{paymentDetail.creditCode}}</td>
            </tr>
            <tr>
              <td>发起收款金额</td>
              <td>{{paymentDetail.transactionAmount || 0 | toThousands}}&nbsp;&nbsp;<span
                  style="color:#D9D9D9">|</span>&nbsp;&nbsp;{{paymentDetail.transactionAmount || 0 | amountToChinese}}
              </td>
            </tr>
            <tr>
              <td>支付金额</td>
              <td>{{paymentDetail.transactionAmount || 0 | toThousands}}&nbsp;&nbsp;<span
                  style="color:#D9D9D9">|</span>&nbsp;&nbsp;{{paymentDetail.transactionAmount || 0 | amountToChinese}}
              </td>
            </tr>
            <tr>
              <td>平台补贴</td>
              <td>{{paymentDetail.subsidy || 0 | toThousands}}&nbsp;&nbsp;<span
                  style="color:#D9D9D9">|</span>&nbsp;&nbsp;{{paymentDetail.subsidy || 0 | amountToChinese}}</td>
            </tr>
            <tr>
              <td>服务费</td>
              <td>{{paymentDetail.transactionCost || 0 | toThousands}}&nbsp;&nbsp;<span
                  style="color:#D9D9D9">|</span>&nbsp;&nbsp;{{paymentDetail.transactionCost || 0 | amountToChinese}}</td>
            </tr>
            <tr>
              <td>折合现金</td>
              <td>{{paymentDetail.currentAmount || 0 | toThousands}}&nbsp;&nbsp;<span
                  style="color:#D9D9D9">|</span>&nbsp;&nbsp;{{paymentDetail.currentAmount || 0 | amountToChinese}}
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <Button class="confirm-btn" @handleClick="dialogCancelPayment = false" title="保留申请"></Button>
        <Button class="confirm-btn-cancel" @handleClick="confirmCancle" title="取消申请"></Button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BusinessTitle from '@/components/BusinessTitle'
import BusinessFiltrate from '@/components/BusinessFiltrate'
import settings from '@/settings'
export default {
  data () {
    return {
      pageSize: 10,
      pageSizes: settings.pageSizes,
      pageNo: 1,
      totalCnt: 0,
      filtrate: {},
      getPayListUrl: settings.apiGateway.getPayList,
      checkTransactionUrl: settings.apiGateway.checkTransaction,
      // 收款取消接口
      paymentCancelUrl: settings.apiGateway.paymentCancel,
      // 收款详情
      pamentCancelDetailUrl: settings.apiGateway.pamentCancelDetail,
      paymentNumber: '',
      paymentDetail: {},
      cutTime: {},
      options: [
        {
          value: 'PAYEE_ADM_SUCCEED',
          label: '待支付'
        },
        {
          value: 'SUCCEED',
          label: '支付成功'
        },
        {
          value: 'PAYER_OPE_REJECT',
          label: '拒绝支付'
        },
        {
          value: 'PAYER_OPE_SUCCEED',
          label: '待审核'
        },
        {
          value: 'PAYER_ADM_REJECT',
          label: '审核未通过'
        },
        {
          value: 'PAYER_ADM_CANCEL',
          label: '管理员驳回'
        },
        {
          value: 'PAYER_TIME_OUT',
          label: '申请超时'
        },
        {
          value: 'PAY_TIME_OUT',
          label: '支付超时'
        },
        {
          value: 'PAYER_OPE_CANCEL',
          label: '已取消'
        }
      ],
      tableData: [],
      midCenter: '暂无数据',
      dialogCancelPayment: false
    }
  },
  methods: {
    handleClick (row) {
      // 分流如果状态是待支付跳转支付页面,支付成功则是查看交易详情页面
      if (row.statusDesc === '待支付' || row.statusDesc === '管理员驳回' || row.statusDesc === '申请超时' || row.statusDesc === '已取消' || row.statusDesc === '支付失败') {
        this.$router.push({
          path: '/enterprise/payment-confirm',
          query: {
            txNum: row.transactionNumber
          }
        })
      } else if (row.statusDesc === '待审核') {
        if (this.cutTime[row.transactionNumber] === 0) {
          this.$message.error('订单状态已更新，无法进行此操作')
          this.getPayListData()
          return
        }
        this.paymentNumber = row.transactionNumber
        this.getPaymentDetail(row.transactionNumber)
      } else {
        this.toDetail(row)
      }
    },
    toDetail (row) {
      this.$router.push({
        path: '/enterprise/payment-detail',
        query: {
          code: row.transactionNumber
        }
      })
    },
    getPaymentDetail (transactionNumber) {
      this.fetch(`${this.pamentCancelDetailUrl}${transactionNumber}`).then(res => {
        this.paymentDetail = res.data
        this.dialogCancelPayment = true
      }).catch(res => {
        this.$message.error(res.data.msg)
      })
    },
    confirmCancle () {
      this.fetch(`${this.paymentCancelUrl}${this.paymentNumber}`).then(data => {
        this.$message({
          type: 'success',
          message: '已取消支付申请'
        })
        this.dialogCancelPayment = false
        this.getPayListData()
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    pageChange (curPage) {
      this.pageNo = curPage
      this.getPayListData()
    },
    sizeChange (curSize) {
      this.pageSize = curSize
      this.getPayListData()
    },
    getBusinessFiltrate (filtrateData) {
      this.filtrate = filtrateData
      this.getPayListData()
    },
    getPayListData () {
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
      this.fetch(`${this.getPayListUrl}${this.pageNo - 1}/${this.pageSize}${params}`).then(res => {
        this.tableData = res.data.list
        this.tableData.forEach(list => {
          if (list.statusDesc === '待审核') {
            this.$set(this.cutTime, list.transactionNumber, Math.ceil(list.remainTime / 1000))
            this.setTime(list.transactionNumber)
          }
        })
        this.totalCnt = res.data.totalCnt
        this.midCenter = '暂无数据'
      }).catch(res => {
        this.midCenter = '暂无数据'
        this.$message.error(res.data.msg)
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
    }
  },
  created () {
    this.getPayListData()
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
  },
  components: {
    BusinessTitle,
    BusinessFiltrate
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/variables';
.minpad {
  padding: 0 20px;
}
.prompt {
  text-align: center;
  font-size: 20px;
  margin-bottom: 31px;
}
.toDeal {
  width: 72px;
  height: 26px;
  letter-spacing: 0 !important;
  padding: 0 !important;
}
.password {
  margin-top: 20px;
}
table {
  width: 600px;
  margin: 0 auto;
  .amountColor {
    font-size: 16px;
    font-family: ArialMT;
    font-weight: bold;
    color: @theme-blue;
    color: var(--mainColor);
  }
  tr {
    td {
      height: 38px;
      line-height: 38px;
      border: 1px solid #e6e6e6;
    }
    td:first-child {
      width: 120px;
      text-align: center;
      padding: 0 15px;
    }
    td:last-child {
      text-align: left;
      padding-left: 20px;
    }
  }
  tr:nth-child(2n + 1) {
    background-color: @theme-blue-light;
    background-color: var(--mainLightColor);
  }
}
.filter-area {
  width: 100%;
  margin: 15px 0;
  box-sizing: border-box;
}
.tabledetail-main/deep/.credit-table-color-blue tr {
  background-color: @table-bg;
  background-color: var(--mainTableBg) !important;
}
.tabledetail-main/deep/.credit-table-color-blue .el-table__body tr {
  &:nth-of-type(2n + 1):hover > td {
    background-color: #e3eef8 !important;
    background-color: var(--mainTableHover) !important;
  }
}
.tabledetail-main/deep/.el-table .cell {
  padding-left: 0px;
  padding-right: 0px;
}
.tabledetail-main/deep/.el-table .cell {
  text-align: center;
  padding-left: 12px;
  padding-right: 12px;
}
.tabledetail-main/deep/ .el-table th {
  padding-top: 7px;
  padding-bottom: 7px;
}
.tabledetail-main/deep/.el-table td:nth-child(3) .cell, .tabledetail-main/deep/.el-table td:nth-child(7) .cell {
  text-align: right;
}
.tabledetail-main/deep/.el-button:hover{
  color: #ffffff;
  background-color: @btn-disabled;
  background-color: var(--mainColorDis);
  border: 0;
}
.dialog /deep/.el-dialog {
  position: absolute;
  top: 50% !important;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  margin-top: 0 !important;
  margin-left: 108px;
}
.operation-btn {
  cursor: pointer;
  color: @theme-blue;
  color: var(--mainColor);
  text-decoration: underline;
}
.wait_icon {
  width: 1em;
  height: 1em;
  vertical-align: middle;
  margin-top: -3px;
  margin-right: 6px;
}
.dialog-footer {
  margin-bottom: 20px;
  margin-top: -10px;
  .el-button {
    border-radius: 5px;
    padding: 15px 68.5px;
    font-size: 18px;
  }
  .confirm-btn {
    background-color: @theme-blue;
    background-color: var(--mainColor);
  }
  .confirm-btn-cancel {
    background-color: #fff;
    color: @theme-blue;
    color: var(--mainColor);
  }
}
</style>
