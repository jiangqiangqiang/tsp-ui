<template>
  <div>
    <BusinessTitle title="修改记录" isShowBack></BusinessTitle>
    <div class="search-container">
      <span style="margin-left:30px;margin-right:10px;">修改时间</span>
      <el-date-picker v-model="searchData.startTime" type="date" size="mini" :editable="false"
        prefix-icon="el-icon-caret-bottom" value-format="yyyy-MM-dd" placeholder="开始日" @change="changeStart"
        :picker-options="pickerBeginDateBefore">
      </el-date-picker>
      <span style="padding: 0 3px">--</span>
      <el-date-picker v-model="searchData.endTime" type="date" size="mini" :editable="false"
        prefix-icon="el-icon-caret-bottom" value-format="yyyy-MM-dd" placeholder="截止日" @change="changeEnd"
        :picker-options="pickerBeginDateAfter">
      </el-date-picker>
      <span style="margin-left:30px;margin-right:10px;">姓名</span>
      <el-input class="client-name" v-model="searchData.operator" size="mini" clearable>
      </el-input>
      <div class="btn">
        <el-button class="search-button" type="info" @click="search">查询</el-button>
      </div>
    </div>
    <div class="message">
      <div class="message-list">
        <div class="list">
          <div v-if="emptyShow" class="empty-show">暂无数据</div>
          <el-table :data="messageList" stripe style="width: 100%" v-else
            class="LogList sy-global-has-gutter__th--text-center" header-align='center'>
            <el-table-column prop="createOn" label="修改时间" align='center'>
            </el-table-column>
            <el-table-column prop="name" label="姓名" show-overflow-tooltip align='center'>
            </el-table-column>
            <el-table-column prop="billDiscountRate" label="折扣率" align='center'>
              <template slot-scope="scope">
                <span>{{scope.row.billDiscountRate * 100}}%</span>
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
  </div>
</template>

<script>
import settings from '@/settings'
import BusinessTitle from '@/components/BusinessTitle.vue'
export default {
  components: {
    BusinessTitle
  },
  data () {
    return {
      messageList: [],
      pageSize: 10,
      pageSizes: settings.pageSizes,
      pageNo: 1,
      totalCnt: 0,
      type: 'reading',
      searchData: {
        operator: '',
        startTime: '',
        endTime: ''
      },
      pickerBeginDateBefore: {
        disabledDate: (time) => {
          return time.getTime() > (new Date()).getTime()
        }
      },
      pickerBeginDateAfter: {
        disabledDate: (time) => {
          return time.getTime() > (new Date()).getTime()
        }
      },
      systemLogUrl: settings.apiGateway.systemLog
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
    changeEnd (timeStr) {
      if (!timeStr) {
        this.pickerBeginDateBefore = {
          disabledDate (time) {
            return (time.getTime() > new Date().getTime())
          }
        }
      } else {
        this.pickerBeginDateBefore = {
          disabledDate (time) { // 开始时间-结束时间
            return (time.getTime() > new Date(timeStr).getTime())
          }
        }
      }
    },
    changeStart (timeStr) {
      if (!timeStr) {
        this.pickerBeginDateAfter = {
          disabledDate (time) {
            return time.getTime() > (new Date()).getTime()
          }
        }
      } else {
        this.pickerBeginDateAfter = {
          disabledDate (time) { // 开始时间-结束时间
            return (time.getTime() < new Date(timeStr).getTime() - 1 * 24 * 60 * 60 * 1000) || (time.getTime() > (new Date()).getTime())
          }
        }
      }
    },
    search () {
      this.allocatorLogs()
    },
    allocatorLogs () {
      let data = this.deleteObj(this.searchData)
      this.fetch(`${this.systemLogUrl}${this.pageNo - 1}/${this.pageSize}`, 'post', data).then(data => {
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
.search-container {
  height: 45px;
  padding: 4px 0;
  background-color: #f5f5f5;
  border: 1px solid #e6e6e6;
  margin: 25px 0 15px;
  box-sizing: border-box;
  padding-top: 8px;
  .el-select {
    width: 130px;
  }
  .el-input {
    width: 130px;
  }
  .client-name {
    display: inline-block;
    width: 200px;
  }
  .btn {
    float: right;
    margin-right: 282px;
    width: 80px;
    height: 25px;
    .el-button {
      width: 80px;
      height: 25px;
      line-height: 0px;
      background-color: #e5e5e5;
    }
    .search-button {
      color: #797c84;
    }
  }
}
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
  }
  .addAmount {
    font-size: 15px;
    font-weight: bold;
    color: rgba(147, 131, 96, 1);
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
      &:hover {
        background-color: #fffaf4 !important;
      }
    }
    tr:nth-child(2n),
    tr:nth-child(2n) td {
      background-color: #ffffff !important;
      &:hover {
        background-color: #ffffff !important;
      }
    }
  }
}
</style>
