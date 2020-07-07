<template>
  <div class="proceeds">
    <BusinessTitle title="收款"></BusinessTitle>
    <div class="minpad">
      <div>
      <Button icon="el-icon-plus" class="topUpBtn" @handleClick="StartProceeds" title="发起收款"></Button>
    </div>
    <BusinessFiltrate :filtrate="filtrate" :options="options" @getBusinessFiltrate="getBusinessFiltrate" roleType="付款企业">
    </BusinessFiltrate>
    <el-table :data="ProceedsList" stripe border style="width: 100%" header-align='center'
      class="ProceedsList credit-table-color-blue sy-global-has-gutter__th--text-center sy-global-el-table-fit--border">
      <el-table-column prop="createdOn" label="发起时间" min-width="180" :empty-text='midCenter'>
      </el-table-column>
      <el-table-column prop="transactionNumber" label="交易编号" min-width="180" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="transactionAmount" label="收款金额" min-width="141">
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
          <div v-if="(scope.row.paymentStatus)=='PAYEE_OPE_PENDING'">
            <span @click="handleClick(scope.row)" class="skipBtn">查看详情</span><span @click="cancleSubmit(scope.row)" class="skipBtn" style="marginLeft:10px">取消申请</span>
          </div>
          <!-- <div v-else-if="(scope.row.statusDesc)=='已取消'">
            <div></div>
          </div> -->
          <div v-else>
            <div @click="handleClick(scope.row)" class="skipBtn">查看详情</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="sy-global--Pagination--bg" style="margin-bottom: 2rem" v-if="ProceedsList.length>0">
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
    <el-dialog :visible.sync="dialogCancelProceed" center width="568px">
      <div>
        <p class="prompt">是否取消收款申请</p>
        <div class="password">
          <table style="width:471px">
            <tr>
              <td>收款金额</td>
              <td>{{proceedsDetail.transactionAmount || 0 | toThousands}}&nbsp;&nbsp;<span
                  style="color:#D9D9D9">|</span>&nbsp;&nbsp;大写：{{proceedsDetail.transactionAmount || 0 | amountToChinese}}
              </td>
            </tr>
            <tr>
              <td>付款企业名称</td>
              <td>{{proceedsDetail.payerName}}</td>
            </tr>
            <tr>
              <td>付款企业证件号</td>
              <td>{{proceedsDetail.payerCreditCode}}</td>
            </tr>
          </table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <Button class="confirm-btn" @handleClick="dialogCancelProceed = false" title="保留申请"></Button>
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
      content: '此金额为预估数值，因精度原因在计算过程中可能出现一定误差，结算以实际入账金额为准。',
      filtrate: {
        // startTime: '',
        // endTime: '',
        // min: '',
        // max: '',
        // transactionCode: '',
        // transactionType: ''
      },
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
        value: 'PAYEE_ADM_SUCCEED',
        label: '待支付'
      }, {
        value: 'PAYEE_ADM_REJECT',
        label: '审核未通过'
      }, {
        value: 'PAY_TIME_OUT',
        label: '支付超时'
      }, {
        value: 'PAYEE_OPE_CANCEL',
        label: '已取消'
      }],
      ProceedsList: [],
      // 获取收款列表数据
      getProceedsListUrl: settings.apiGateway.getProceedsList,
      // 收款取消接口
      paymentCancelUrl: settings.apiGateway.paymentCancel,
      // 收款详情
      toPayDetailUrl: settings.apiGateway.toPayDetail,
      dialogCancelProceed: false,
      proceedsNumber: '',
      midCenter: '暂无数据',
      proceedsDetail: {}
    }
  },
  components: {
    BusinessTitle,
    BusinessFiltrate
  },
  methods: {
    handleClick (row) {
      this.$router.push({
        path: '/enterprise/proceedsDetail',
        query: { code: row.transactionNumber }
      })
    },
    cancleSubmit (row) {
      this.proceedsNumber = row.transactionNumber
      this.fetch(`${this.toPayDetailUrl}${this.proceedsNumber}`).then(data => {
        this.proceedsDetail = data.data
        this.dialogCancelProceed = true
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    confirmCancle () {
      this.fetch(`${this.paymentCancelUrl}${this.proceedsNumber}`).then(data => {
        this.$message({
          type: 'success',
          message: '已取消收款申请'
        })
        this.dialogCancelProceed = false
        this.getProceeds()
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    getBusinessFiltrate (filtrate) {
      this.filtrate = filtrate
      this.getProceeds()
    },
    pageChange (curPage) {
      this.pageNo = curPage
      this.getProceeds()
    },
    sizeChange (pageSize) {
      this.pageSize = pageSize
      this.getProceeds()
    },
    StartProceeds () {
      this.$router.push('/enterprise/proceeds/application')
    },
    getProceeds () {
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
        if (this.filtrate.min) this.filtrate.min = this.toThousands(this.filtrate.min)
        if (this.filtrate.max) this.filtrate.max = this.toThousands(this.filtrate.max)
      }
      this.midCenter = '查询中'
      this.fetch(`${this.getProceedsListUrl}${this.pageNo - 1}/${this.pageSize}${params}`).then(data => {
        this.ProceedsList = data.data.list
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
    }
  },
  created () {
    this.getProceeds()
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
.top-title {
  width: 100%;
  height: 76px;
  line-height: 76px;
  text-align: center;
  color: #333333;
  font-size: 22px;
  background-color: #f2f9ff;
  letter-spacing: 15px;
  padding-left: 15px;
}
.topUpBtn {
  width: 163px;
  height: 41px;
  margin: 22px 0 0 25px;
  border-radius: 5px;
  color: #fff;
  border: none;
  box-shadow: 1px 6px 4px @btn-disabled;
  box-shadow: 1px 6px 4px var(--mainTableHover);
}
.topUpBtnDisabled {
  width: 163px;
  height: 41px;
  margin: 22px 0 0 25px;
  border-radius: 5px;
  color: #fff;
  border: none;
  box-shadow: 1px 6px 4px @btn-disabled;
  box-shadow: 1px 6px 4px var(--mainTableHover);
  background-color: var(--mainColorDis) !important;
}
.prompt {
  text-align: center;
  font-size: 20px;
  margin-bottom: 31px;
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
.topUpBtnDisabled:hover {
  background-color: var(--mainColorDis) !important;
}
.ProceedsList {
  position: relative;
  margin-top: 20px;
}
.proceeds/deep/.el-table .cell {
  text-align: center;
}
.proceeds/deep/.credit-table-color-blue tr {
  background-color: @table-bg;
  background-color: var(--mainTableBg) !important;
}
.proceeds/deep/.credit-table-color-blue .el-table__body tr {
  &:nth-of-type(2n + 1):hover > td {
    background-color: #e3eef8 !important;
    background-color: var(--mainTableHover) !important;
  }
}
.proceeds/deep/.el-table .cell {
  text-align: center;
  padding-left: 12px;
  padding-right: 12px;
}
.proceeds/deep/.el-table td:nth-child(3) .cell {
  text-align: right;
}
.proceeds/deep/ .el-table th {
  padding-top: 7px;
  padding-bottom: 7px;
}
.skipBtn {
  cursor: pointer;
  text-align: center;
  height: 19px;
  margin: 0 auto;
  color: @theme-blue;
  color: var(--mainColor);
  text-decoration: underline;
  // border-bottom: @theme-blue;
  // border-bottom: 1px solid var(--mainColor)
}
.icon {
  position: relative;
  left: 786px;
  top: 51px;
  z-index: 90000;
  .el-icon-question {
    color: #ccc;
  }
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
<style lang="less">
.proceeds .el-dialog {
  position: absolute;
  top: 50% !important;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  margin-top: 0 !important;
  margin-left: 108px;
  width: 576px;
}
</style>
