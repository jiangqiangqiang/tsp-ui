<template>
  <div>
    <BusinessTitle title="CA认证服务监控"></BusinessTitle>
    <div class="minpad">
      <div class="search-container">
      <span style="margin-left:30px;margin-right:10px;">时间段</span>
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
      <span style="margin-left:30px;margin-right:10px;">接口名称</span>
      <el-select clearable v-model="searchData.serviceName" size="mini">
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
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
        class="credit-table-color-blue sy-global-has-gutter__th--text-center sy-global-el-table-fit--border">
        <el-table-column
          prop="serviceName"
          label="接口名称"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="callCount"
          label="调用次数">
          </el-table-column>
        <el-table-column
          prop="successfulCount"
          label="成功次数">
        </el-table-column>
        <el-table-column
          prop="failedCount"
          label="失败次数">
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
  </div>
</template>

<script>
import BusinessTitle from '@/components/BusinessTitle'
import settings from '@/settings'
export default {
  name: 'CAServiceMonitoring',
  data () {
    return {
      searchData: {
        startTime: '',
        endTime: '',
        serviceName: ''
      },
      pageSize: 10,
      pageSizes: settings.pageSizes,
      pageNo: 1,
      totalCnt: 0,
      options: [
        {
          label: '企业四要素认证接口',
          value: '企业四要素认证接口'
        },
        {
          label: '企业用户颁发数字证书接口',
          value: '企业用户颁发数字证书接口'
        },
        {
          label: '三要素认证接口',
          value: '三要素认证接口'
        },
        {
          label: '模板创建合同接口',
          value: '模板创建合同接口'
        },
        {
          label: '获取用户证书信息接口',
          value: '获取用户证书信息接口'
        },
        {
          label: '后台自动签署接口',
          value: '后台自动签署接口'
        }
      ],
      tableData: [],
      /*
       {
        serviceName: '企业用户颁发数字证书',
        callCount: '500',
        successfulCount: '499',
        failedCount: '1'
      }, {
        serviceName: '企业用户更新企业证书',
        callCount: '500',
        successfulCount: '499',
        failedCount: '1'
      }, {
        serviceName: '获取用户信息接口',
        callCount: '500',
        successfulCount: '499',
        failedCount: '1'
      }, {
        serviceName: '企业基本信息四要素核验',
        callCount: '500',
        successfulCount: '499',
        failedCount: '1'
      }, {
        serviceName: '个人三要素实名认证',
        callCount: '500',
        successfulCount: '499',
        failedCount: '1'
      }
      */
      CAmonitorUrl: settings.apiGateway.CAmonitor
    }
  },
  created () {
    this.getCAList()
  },
  methods: {
    pageChange (curPage) {
      this.pageNo = curPage
      this.getCAList()
    },
    sizeChange (pageSize) {
      this.pageSize = pageSize
      this.getCAList()
    },
    search () {
      this.getCAList()
    },
    getCAList () {
      for (let key in this.searchData) {
        if (this.searchData[key]) {
          if (key === 'startTime') {
            this.searchData[key] = this.concatDate(this.searchData[key], '00:00:00')
          }
          if (key === 'endTime') {
            this.searchData[key] = this.concatDate(this.searchData[key], '23:59:59')
          }
        }
      }
      this.fetch(`${this.CAmonitorUrl}${this.pageNo - 1}/${this.pageSize}`, 'post', this.searchData).then(data => {
        this.totalCnt = data.data.totalCnt
        this.tableData = data.data.detailList
      }).catch(res => {
        this.$message.error(res.data.msg)
      })
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
  .search-container {
    height: 45px;
    background-color: #fcfcfc;
    border: 1px solid #e6e6e6;
    margin: 25px 0 15px;
    box-sizing: border-box;
    padding-top: 8px;
    .el-input {
      width: 150px;
    }
    .client-name {
      display: inline-block;
      width: 200px;
    }
    .btn {
      float: right;
      margin-right: 20px;
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
  .list-container/deep/.el-table td, .el-table th {
    text-align: center;
  }
  .list-container/deep/.credit-table-color-blue tr {
    cursor: default;
    background-color: @table-bg;
    background-color: var(--mainTableBg)!important;
  }
  .list-container/deep/.credit-table-color-blue .el-table__body tr{
    &:nth-of-type(2n+1):hover>td {
      background-color: @table-hover;
      background-color: var(--mainTableHover) !important;
    }
  }
  // .list-container/deep/.credit-table-color-blue .el-table__body tr:hover>td {
  //   border-top: 1px solid @theme-blue;
  //   border-top: 1px solid var(--mainColor);
  //   border-bottom: 1px solid @theme-blue;
  //   border-bottom: 1px solid var(--mainColor);
  //   background-color: @table-hover;
  //   background-color: var(--mainTableHover)!important;
  // }
  .list-container/deep/.el-table .cell {
    text-align: center;
    padding-left: 0px;
    padding-right: 0px;
  }
</style>
