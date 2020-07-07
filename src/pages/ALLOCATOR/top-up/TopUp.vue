<template>
  <div class="top-up">
    <BusinessTitle title="充值"></BusinessTitle>
    <div class="flow-amount"></div>
    <div>
      <div class="btn-container">
        <Button icon="el-icon-plus" class="topUpBtn"
          @handleClick="StartTopUp" title="发起充值"></Button>
      </div>
      <BusinessFiltrate :filtrate="filtrate" :options="options" @getBusinessFiltrate="getBusinessFiltrate"
        roleType="操作员">
      </BusinessFiltrate>
      <el-table :data="TopUpList" stripe border style="width: 100%" header-align='center' :empty-text='midCenter'
        class="TopUpList credit-table-color-blue sy-global-has-gutter__th--text-center sy-global-el-table-fit--border">
        <el-table-column prop="applicationTime" label="发起时间" width="180">
        </el-table-column>
        <el-table-column prop="transactionCode" label="交易编号" width="180" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="amount" label="支付令金额">
          <template slot-scope="scope">
            <span>{{scope.row.amount | toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="服务费">
          <template slot-scope="scope">
            <span>{{scope.row.serviceAmount || 0 | toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <div :style="scope.row.status==='Failed' ? 'color:rgba(206,42,42,1);':''">{{scope.row.status | topUpStatus}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="操作员">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div @click="handleClick(scope.row)" class="skipBtn">{{scope.row | operationShow}}</div>
          </template>
        </el-table-column>
      </el-table>
      <el-row class="sy-global--Pagination--bg" style="margin-bottom: 2rem" v-if="TopUpList.length>0">
        <el-col>
          <div class="sy-global__div--Pagination sy-global-pull-right">
            <el-pagination @current-change="pageChange" @size-change="sizeChange" :page-sizes="pageSizes"
              :pageSize="pageSize" :current-page="pageNo" layout="total, sizes, prev, pager, next, jumper"
              :total="totalCnt">
            </el-pagination>
          </div>
        </el-col>
      </el-row>
      <el-dialog :visible.sync="dialogVisible" width="576px" center style="marginTop:17vh">
        <p style="text-align:center; font-size: 20px;">无法申请支付</p>
        <div class="top-up-message">
          <div><span class="message">您有一个申请未被审核，金额暂时被冻结，无法发起申请，请通知管理员尽快审核。</span></div>
        </div>
        <div slot="footer" class="dialog-footer">
          <Button title="知道了" class="confirm-btn" @handleClick="dialogVisible=false"></Button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import BusinessTitle from '@/components/BusinessTitle'
import BusinessFiltrate from '@/components/BusinessFiltrate'
import settings from '@/settings'
export default {
  data () {
    return {
      adminName: '',
      adminPhone: '',
      pageSize: 10,
      pageSizes: settings.pageSizes,
      pageNo: 1,
      totalCnt: 0,
      filtrate: {},
      options: [{
        value: 'Succeed',
        label: '充值成功'
      }, {
        value: 'Console',
        label: '已取消'
      }, {
        value: 'Failed',
        label: '充值失败'
      }, {
        value: 'Pending',
        label: '待支付'
      }],
      midCenter: '暂无数据',
      TopUpList: [],
      // 获取充值列表数据
      getTopUpListUrl: settings.apiGateway.getTopUpList,
      noAccess: false,
      Access: false,
      loadingShow: true,
      depositPower: '',
      // 流通金额剩余比例
      currencyRate: '',
      dialogVisible: false
    }
  },
  components: {
    BusinessTitle,
    BusinessFiltrate
  },
  methods: {
    handleClick (row) {
      if (row.status === 'Pending') {
        this.$router.push({
          path: '/allocator/top-up/top-up-detail',
          query: {
            code: row.transactionCode
          }
        })
      } else {
        this.$router.push({
          path: '/allocator/top-up/top-up-deal',
          query: { code: row.transactionCode }
        })
      }
    },
    getBusinessFiltrate (filtrate) {
      this.filtrate = filtrate
      this.getTopUpList()
    },
    pageChange (curPage) {
      this.pageNo = curPage
      this.getTopUpList()
    },
    sizeChange (pageSize) {
      this.pageSize = pageSize
      this.getTopUpList()
    },
    StartTopUp () {
      this.$router.push('/allocator/top-up/start-top-up')
    },
    getTopUpList () {
      this.loadingShow = true
      let flitrate = {
        startTime: this.filtrate.startTime,
        endTime: this.filtrate.endTime,
        min: this.filtrate.min,
        max: this.filtrate.max,
        status: this.filtrate.transactionType,
        transactionCode: this.filtrate.transactionCode,
        operator: this.filtrate.operator
      }
      if (this.filtrate.min) this.filtrate.min = this.toThousands(this.filtrate.min)
      if (this.filtrate.max) this.filtrate.max = this.toThousands(this.filtrate.max)
      this.midCenter = '查询中'
      this.fetch(`${this.getTopUpListUrl}${this.pageNo - 1}/${this.pageSize}`, 'post', flitrate).then(data => {
        this.loadingShow = false
        this.TopUpList = data.data.list
        this.totalCnt = data.data.totalCnt
        this.pageSize = data.data.pageSize
        this.currencyRate = data.data.currencyRate
        this.adminName = data.data.adminName
        this.adminPhone = data.data.adminPhone
        this.midCenter = '暂无数据'
      }).catch(data => {
        this.loadingShow = false
        this.midCenter = '暂无数据'
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    }
  },
  created () {
    this.getTopUpList()
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/less/variables';
.flow-amount {
  position: relative;
  top: -48px;
  left: 620px;
  font-size: 14px;
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
.btn-container {
  .topUpBtn,
  .open-top-up-btn {
    width: 163px;
    height: 41px;
    border: none;
    margin: 22px 0 0 25px;
    border-radius: 5px;
    color: #fff;
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
    background-color: var(--mainColorDis);
  }
  .topUpBtnDisabled:hover {
    background-color: var(--mainColorDis);
  }
  .open-top-up-btn {
    width: 300px;
    display: block;
    margin: 30px auto 0;
  }
}
.sorry-tips {
  margin-top: 200px;
  font-size: 16px;
  text-align: center;
  height: 40px;
  line-height: 40px;
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
.TopUpList {
  margin-top: 20px;
}
.top-up/deep/.el-table .cell {
  text-align: center;
}
.top-up/deep/.credit-table-color-blue tr {
  background-color: @table-bg;
  background-color: var(--mainTableBg) !important;
}
.top-up/deep/.credit-table-color-blue .el-table__body tr {
  &:nth-of-type(2n + 1):hover > td {
    background-color: #e3eef8 !important;
    background-color: var(--mainTableHover) !important;
  }
}
.top-up/deep/.el-table .cell {
  text-align: center;
  padding-left: 12px;
  padding-right: 12px;
}
.top-up/deep/.el-table td:nth-child(3) .cell, .top-up/deep/.el-table td:nth-child(4) .cell {
  text-align: right;
}
.top-up/deep/ .el-table th {
  padding-top: 7px;
  padding-bottom: 7px;
}
.top-up-message {
  width: 449px;
  margin: 0px auto;
  margin-top: 20px;
  font-size: 16px;
  line-height: 30px;
  text-align: center;
  .message {
    margin-left: 20px;
  }
}
.dialog-footer {
  margin-bottom: 20px;
  .el-button {
    border-radius: 5px;
    padding-left: 50px;
    padding-right: 50px;
  }
  .confirm-btn {
    background-color: @theme-blue;
    background-color: var(--mainColor);
    border: none;
  }
}
</style>
