<template>
  <div>
    <BusinessTitle title="代理企业管理" inviteText="邀请企业方"></BusinessTitle>
    <div class="minpad">
      <div class="search-container">
        <div class="serchContent">
          <div class="serchItem">
          <span class="title-amount-sale">开户日期</span>
        <el-date-picker v-model="searchData.startTime" type="date" :editable="false" @change="changeStart"
          placeholder="开始日" prefix-icon="el-icon-caret-bottom" value-format="yyyy-MM-dd"
          :picker-options="pickerBeginDateBefore">
        </el-date-picker>
        <span style="padding: 0 3px">--</span>
        <el-date-picker v-model="searchData.endTime" type="date" :editable="false" @change="changeEnd" placeholder="截至日"
          prefix-icon="el-icon-caret-bottom" value-format="yyyy-MM-dd" :picker-options="pickerBeginDateAfter">
        </el-date-picker>
      </div>
      <div class="serchItem">
        <span class="title-amount-sale">企业名称</span>
        <el-input class="client-name" v-model="searchData.enterpriseName" size="mini" clearable>
        </el-input>
      </div>
      <div class="serchItem">
        <span class="title-amount-sale">代理公司</span>
        <el-input class="client-name" v-model="searchData.enterpriseName" size="mini" clearable>
        </el-input>
      </div>
      <div class="serchItem"><span class="title-amount-sale">状态</span>
        <el-select size="mini" clearable v-model="searchData.transactionType">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
        </div>
      <div class="btn">
        <el-button class="search-button" type="info" @click="search">查询</el-button>
      </div>
    </div>
    <el-main class="list-container" style="padding:0">
      <el-table :data="tableData" border stripe @row-click="rowClick" header-align='center'
        class="credit-table-color-blue sy-global-has-gutter__th--text-center sy-global-el-table-fit--border"
        :row-class-name="rowClassName" :empty-text='midCenter'>
        <el-table-column label="序号" type="index" width="120">
        </el-table-column>
        <el-table-column prop="enterpriseName" label="企业名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="enterpriseCreditCode" label="统一信用代码">
        </el-table-column>
        <el-table-column prop="openTime" label="开户日期">
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            {{scope.row.status==='ENABLE'?'正常':scope.row.status==='CANCEL'?'注销用户':'待初始化'}}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="sysRole" label="客户类型">
          <template slot-scope="scope">
            {{scope.row.sysRole}}
          </template>
        </el-table-column> -->
        <el-table-column prop="name" label="交易情况">
          <template slot-scope="scope">
            <a class="skipBtn" @click.stop="handleClick(scope.row)" v-if="scope.row.status==='ENABLE'">查看</a>
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
    </el-main>
    </div>
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
        transactionType: 'ENABLE',
        roleName: 'Enterprise'
      },
      options: [
        {
          value: 'ENABLE',
          label: '正常'
        },
        {
          value: 'CANCEL',
          label: '注销用户'
        },
        {
          value: 'WAIT_INIT',
          label: '待初始化'
        }
      ],
      midCenter: '暂无数据',
      pageSize: 10,
      pageSizes: settings.pageSizes,
      pageNo: 1,
      totalCnt: 0,
      enterpriseListUrl: settings.apiGateway.getAgentInviteList,
      enterpriseStatus: settings.agentStatusMap,
      tableData: [],
      pickerBeginDateBefore: {
        disabledDate: (time) => {
          let beginDateVal = this.searchData.endTime
          if (beginDateVal) {
            return time.getTime() > (new Date(beginDateVal)).getTime()
          } else {
            return time.getTime() > (new Date()).getTime()
          }
        }
      },
      pickerBeginDateAfter: {
        disabledDate: (time) => {
          let beginDateVal = this.searchData.startTime
          if (beginDateVal) {
            return time.getTime() < (new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000) || (time.getTime() > (new Date()).getTime())
          } else {
            return time.getTime() > (new Date()).getTime()
          }
        }
      }
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
      this.getEnterpriseList()
    },
    changeStart (timeStr) {
      if (!timeStr) {
        this.pickerBeginDateAfter = {
          disabledDate (time) { // 开始时间-结束时间
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
    changeEnd (timeStr) {
      if (!timeStr) {
        this.pickerBeginDateBefore = {
          disabledDate (time) { // 开始时间-结束时间
            return time.getTime() > (new Date()).getTime()
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
    rowClick (row, event, column) {
      // 点击非操作cell时跳转详情
      if (column.label !== '操作') {
        this.$router.push({
          path: '/agent/agency-enterpeise-detail',
          query: {
            sysRole: row.sysRole,
            user_id: row.eid
          }
        })
      } else {
        this.$message.warning('该账户未进行初始化信息的填写, 无法查看信息详情')
      }
    },
    handleClick (rowData) {
      this.$router.push({
        path: '/agent/agency-enterpeise/enterprise-transaction',
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
      this.fetch(`${this.enterpriseListUrl}${this.pageNo - 1}/${this.pageSize}`, 'post', this.searchData).then(data => {
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
.minpad {
  padding: 0 20px;
}
.serchContent {
  width: calc(~"100% - 121px");
  min-width: 958px;
  float: left;
  display: table-cell;
  vertical-align: middle;
  text-align: justify;
  .serchItem {
    display: inline-block;
    width: 320px;
    height: 26px;
    font-size: 0;
    margin-bottom: 12px;
    span {
      font-size: 14px;
    }
  }
}
.title-amount-sale {
  display: inline-block;
  width: 75px;
  line-height: 26px;
  text-align: right;
  padding-right: 18px;
}
.search-container {
  overflow: hidden;
  background-color: #fcfcfc;
  border: 1px solid #e6e6e6;
  margin: 25px 0 15px;
  box-sizing: border-box;
  padding-top: 10px;
  position: relative;
  .el-select {
    width: 224px;
  }
  .el-input {
    width: 130px;
  }
  .client-name {
    display: inline-block;
    width: 224px;
  }
  .btn {
    position: absolute;
    right: 0;
    bottom: 12px;
    margin-right: 20px;
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
.skipBtn {
  color: @theme-blue;
  color: var(--mainColor);
  text-decoration: underline;
  cursor: pointer;
}
.list-container/deep/.el-table td,
.el-table th {
  text-align: center;
}
.list-container/deep/.credit-table-color-blue tr {
  background-color: @table-bg;
  background-color: var(--mainTableBg) !important;
}
.list-container/deep/.credit-table-color-blue .el-table__body tr:hover > td {
  cursor: pointer;
  background-color: @table-hover;
  background-color: var(--mainTableHover) !important;
}
.list-container/deep/.el-table .cell {
  text-align: center;
  padding-left: 0px;
  padding-right: 0px;
}
.search-container/deep/ .el-date-editor.el-input {
  width: 104px;
  padding-right: 0;
}
.search-container/deep/ .el-input__prefix {
  left: 80px !important;
}
.search-container /deep/.el-input__inner {
  height: 25px;
  line-height: 25px;
  padding-left: 10px;
  padding-right: 0;
}
.search-container /deep/.el-input__icon {
  line-height: 25px;
}
.search-container /deep/ .el-select .el-input.is-focus .el-input__inner, .search-container /deep/ .el-select .el-input__inner:focus {
  border-color: @theme-blue!important;
  border-color: var(--mainColor)!important;
}
</style>
<style lang="less">
@import '~@/assets/less/variables';
.cursor--disabled {
  cursor: not-allowed !important;
}
.cursor--pointer {
  cursor: pointer !important;
}
.el-select-dropdown__item.selected {
  color: @theme-blue;
  color: var(--mainColor);
}
</style>
