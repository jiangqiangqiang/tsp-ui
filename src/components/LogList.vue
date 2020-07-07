<template>
  <div class="message">
    <div class="message-list">
      <div class=title @click="bandleClick">
        <a style="color:#656565">交易日志</a>
      </div>
      <div class="list">
        <div v-if="emptyShow" class="empty-show">暂无数据</div>
        <el-table :data="messageList" stripe style="width: 100%" v-else class="LogList sy-global-has-gutter__th--text-center" header-align='center'>
          <el-table-column prop="applicationTime" label="交易时间" width="180" align='center'>
          </el-table-column>
          <el-table-column prop="applicationTime" label="交易编号" width="180" align='center'>
          </el-table-column>
          <el-table-column prop="payerName" label="付款企业" show-overflow-tooltip align='center'>
            <template slot-scope="scope">
              <span :class="scope.row.type==='Rebate'?'remind':''">{{scope.row.payerName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="payeeName" label="收款企业" show-overflow-tooltip align='center'>
          </el-table-column>
          <!-- <el-table-column prop="rate" label="折扣率" align='center'>
            <template slot-scope="scope">
              <span>{{scope.row.rate * 100}}%</span>
            </template>
          </el-table-column> -->
          <el-table-column prop="amount" label="垫资金额" align='center'>
            <template slot-scope="scope">
              <span :class="scope.row.type==='Rebate'?'addAmount remind':'addAmount'">{{scope.row.type==='Rebate'?'+':''}}{{scope.row.amount | toThousands}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-row class="sy-global--Pagination--bg" v-if="messageList.length>0">
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
</template>

<script>
import settings from '@/settings'
export default {
  data () {
    return {
      messageList: [],
      pageSize: 10,
      pageSizes: settings.pageSizes,
      pageNo: 1,
      totalCnt: 0,
      type: 'reading',
      allocatorLogsUrl: settings.apiGateway.allocatorLogs
    }
  },
  methods: {
    pageChange (curPage) {
      this.pageNo = curPage
      this.allocatorLogs()
    },
    sizeChange (pageSize) {
      this.pageSize = pageSize
      this.allocatorLogs()
    },
    bandleClick () {
      this.$router.push(this.messageListPath)
    },
    allocatorLogs () {
      this.fetch(`${this.allocatorLogsUrl}${this.pageNo - 1}/${this.pageSize}`).then(data => {
        this.messageList = data.data.list
        this.totalCnt = data.data.totalCnt
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    }
  },
  created () {
    this.allocatorLogs()
  },
  computed: {
    emptyShow () {
      if (this.messageList.length < 1) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/less/variables';
.message {
  margin-top: 37px;
  width: 99.8%;
  border: 1px solid #cccccc;
  border-bottom: 0;
  margin-bottom: 30px;
  .message-list {
    min-height: 80px;
    _height: 80px;
    .empty-show {
      width: 100%;
      height: 80px;
      text-align: center;
      line-height: 80px;
      font-size: 16px;
      color: #333;
    }
    .title {
      width: 97.8%;
      font-size: 16px;
      font-weight: 400;
      color: #656565;
      height: 40px;
      background-color: #f5f5f5;
      padding-left: 24px;
      line-height: 40px;
      cursor: pointer;
    }
    .list-li {
      width: 97.8%;
      height: 40px;
      line-height: 40px;
      padding-left: 24px;
      border-top: 0;
      border-bottom: 1px solid #ccc;
      cursor: pointer;
      &:nth-of-type(2n) {
        background-color: @table-bg;
        background-color: var(--mainTableBg);
      }
      .message-date {
        margin-right: 44px;
      }
    }
  }
  .addAmount {
    font-size: 15px;
    font-weight: bold;
    color: rgba(147, 131, 96, 1);
  }
  .remind {
    color: rgba(225,82,82,1);
  }
  .sy-global--Pagination--bg {
    border-right: 0;
    border-left: 0;
  }
  .LogList /deep/ thead {
    tr th {
      background-color: #fcfcfc;
    }
  }
  .LogList /deep/ tbody {
    tr:nth-child(2n + 1),
    tr:nth-child(2n + 1) td {
      background-color: #fffaf4 !important;
    }
    tr:nth-child(2n),
    tr:nth-child(2n) td {
      background-color: #ffffff !important;
    }
    tr:hover td {
      background-color: #fcefe0 !important;
    }
  }
}
.message/deep/ .el-table th {
  padding-top: 3px;
  padding-bottom: 3px;
}
.message/deep/ .el-table td {
  padding-top: 9px;
  padding-bottom: 9px;
}
</style>
