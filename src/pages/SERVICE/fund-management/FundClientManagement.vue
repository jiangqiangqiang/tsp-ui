<template>
  <div>
    <BusinessTitle title="资金方列表"></BusinessTitle>
    <div class="search-container">
      <span style="margin-left:30px;margin-right:10px;">资金方名称</span>
      <el-input
        class="client-name"
        v-model="searchData.enterpriseName"
        size="mini"
        clearable>
      </el-input>
      <span style="margin-left:30px;margin-right:10px;">开户日期</span>
      <el-date-picker
          v-model="searchData.startTime"
          type="date"
          size="mini"
          :editable="false"
          prefix-icon="el-icon-caret-bottom"
          value-format="yyyy-MM-dd">
      </el-date-picker>
      <span style="padding: 0 3px">--</span>
      <el-date-picker
          v-model="searchData.endTime"
          type="date"
          size="mini"
          :editable="false"
          prefix-icon="el-icon-caret-bottom"
          value-format="yyyy-MM-dd">
      </el-date-picker>
      <div class="btn">
        <el-button class="search-button" type="info" @click="search">查询</el-button>
      </div>
    </div>
    <el-main class="list-container" style="padding:0">
        <el-table
          :data="tableData"
          border
          stripe
          header-align='center'
          @row-click="rowClick"
          :row-class-name="rowClassName"
          :empty-text='midCenter'
          class="credit-table-color-blue sy-global-has-gutter__th--text-center sy-global-el-table-fit--border">
          <el-table-column
            label="序号"
            type="index"
            width="120">
          </el-table-column>
          <el-table-column
            prop="enterpriseName"
            label="资金方名称"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="creditCode"
            label="统一信用代码">
            </el-table-column>
          <!-- <el-table-column
            prop="landLine"
            label="联系电话"
            width="180">
          </el-table-column> -->
          <el-table-column
            prop="createdOn"
            label="开户日期">
            </el-table-column>
          <el-table-column
            prop="userStatus"
            label="状态"
            width="120">
            <template slot-scope="scope">
              {{enterpriseStatus[scope.row.userStatus]}}
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="交易情况">
            <template slot-scope="scope" v-if="scope.row.userStatus !== 'WAIT_INIT'">
              <a class="skipBtn" @click.stop="handleClick(scope.row)">查看交易</a>
            </template>
          </el-table-column>
        </el-table>
        <el-row class="sy-global--Pagination--bg" style="margin-bottom: 2rem" v-if="tableData.length>0">
          <el-col>
            <div class="sy-global__div--Pagination sy-global-pull-right">
              <el-pagination
                @current-change="pageChange"
                @size-change="sizeChange"
                :page-sizes="pageSizes"
                :pageSize="pageSize"
                :current-page="pageNo"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCnt">
              </el-pagination>
            </div>
          </el-col>
        </el-row>
      </el-main>
  </div>
</template>

<script>
import BusinessTitle from '@/components/BusinessTitle.vue'
import settings from '@/settings'
export default {
  name: 'enterpriseManagement',
  data () {
    return {
      searchData: {
        enterpriseName: '',
        startTime: '',
        endTime: '',
        userType: '',
        roleName: 'Fund'
      },
      options: [
        {
          label: '核心企业',
          value: '核心企业'
        },
        {
          label: '资金方',
          value: '资金方'
        }
      ],
      midCenter: '暂无数据',
      pageSize: 10,
      pageSizes: settings.pageSizes,
      pageNo: 1,
      totalCnt: 0,
      enterpriseStatus: settings.agentStatusMap,
      tableData: [],
      // 列表接口
      adminFundUrl: settings.apiGateway.enterpriseList
    }
  },
  created () {
    this.getEnterpriseList()
  },
  methods: {
    pageChange (curPage) {
      this.pageNo = curPage
      this.getEnterpriseList()
    },
    sizeChange (pageSize) {
      this.pageSize = pageSize
      this.pageNo = 1
      this.getEnterpriseList()
    },
    rowClick (row, event, column) {
      // 点击非操作cell时跳转详情
      if (column.label !== '交易情况' && row.userStatus !== 'WAIT_INIT') {
        this.$router.push({
          path: '/service/fund-client-detail',
          query: {
            userType: row.userType,
            user_id: row.eid
          }
        })
      } else if (column.label === '交易情况' && row.userStatus !== 'WAIT_INIT') {
        this.handleClick(row)
      } else {
        this.$message.warning('该账户未进行初始化信息的填写, 无法查看信息详情')
      }
    },
    handleClick (rowData) {
      this.$router.push({
        path: 'service/fund-transaction',
        query: {
          id: rowData.eid,
          name: rowData.enterpriseName
        }
      })
    },
    search () {
      this.getEnterpriseList()
    },
    getEnterpriseList () {
      // let data = {}
      for (let key in this.searchData) {
        if (this.searchData[key]) {
          if (key === 'startTime') {
            this.searchData[key] = this.concatDate(this.searchData[key], '00:00:00')
          } else if (key === 'endTime') {
            this.searchData[key] = this.concatDate(this.searchData[key], '23:59:59')
          }
        }
      }
      this.midCenter = '查询中'
      this.fetch(`${this.adminFundUrl}${this.pageNo - 1}/${this.pageSize}`, 'post', this.searchData).then(data => {
        this.totalCnt = data.data.totalCnt
        this.tableData = data.data.list
        this.midCenter = '暂无数据'
      }).catch(res => {
        this.midCenter = '暂无数据'
        this.$messgae.error(res.data.msg)
      })
    },
    rowClassName (row, rowIndex) {
      return row.row.userStatus === 'WAIT_INIT' ? 'cursor--disabled' : 'cursor--pointer'
    }
  },
  components: {
    BusinessTitle
  }
}
</script>

<style lang="less" scoped>
  @import '~@/assets/less/variables';
  .search-container {
    height: 45px;
    background-color: #fcfcfc;
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
      margin-right: 82px;
      width: 80px;
      height:25px;
      .el-button {
        width: 80px;
        height:25px;
        line-height:0px;
        background-color:#e5e5e5;
      }
      .search-button {
        color: #797c84;
      }
    }
  }
  .skipBtn {
    color: @theme-blue;
    color: var(--mainColor);
    text-decoration: underline;
    cursor: pointer;
  }
  .list-container/deep/.el-table td, .el-table th {
    text-align: center;
  }
  .list-container/deep/.credit-table-color-blue tr {
    background-color: @table-bg;
    background-color: var(--mainTableBg)!important;
  }
  .list-container/deep/.credit-table-color-blue .el-table__body tr:hover>td {
    background-color: @table-hover;
    background-color: var(--mainTableHover)!important;
  }
  .list-container/deep/.el-table .cell {
    text-align: center;
    padding-left: 0px;
    padding-right: 0px;
  }
</style>
<style lang="less">
  .cursor--disabled {
    cursor: not-allowed!important;
  }
  .cursor--pointer {
    cursor: pointer!important;
  }
</style>
