<template>
  <div>
    <BusinessTitle title="查询验证码"></BusinessTitle>
    <div class="minpad">
      <div class="search-container">
        <div style="width:308px;margin:0 auto">
          <span style="margin-right:10px;">手机号</span>
          <el-input v-model="phone" class="amount-input" clearable></el-input>
          <div class="btn">
          <el-button class="search-button" type="info" @click="search">查询</el-button>
        </div>
      </div>
    </div>
    <el-main class="list-container" style="padding:0">
      <el-table :data="tableData" border stripe header-align='center' :empty-text='midCenter'
        class="credit-table-color-blue sy-global-has-gutter__th--text-center sy-global-el-table-fit--border">
        <el-table-column prop="sendTime" label="发送时间" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="phone" label="目标手机号">
        </el-table-column>
        <el-table-column prop="code" label="验证码">
        </el-table-column>
      </el-table>
      <el-row class="sy-global--Pagination--bg" style="margin-bottom: 2rem" v-if="tableData.length>0">
        <el-col>
          <div class="sy-global__div--Pagination sy-global-pull-right sizeItem">
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
import BusinessTitle from '@/components/BusinessTitle'
import settings from '@/settings'
export default {
  name: 'CAServiceMonitoring',
  data () {
    return {
      phone: '',
      pageSize: 10,
      pageSizes: settings.pageSizes,
      pageNo: 1,
      totalCnt: 0,
      midCenter: '暂无数据',
      tableData: [],
      getAdminCodeUrl: settings.apiGateway.getAdminCode
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
      let data = this.phone ? '?phone=' + this.phone : ''
      this.midCenter = '查询中'
      this.fetch(`${this.getAdminCodeUrl}${this.pageNo - 1}/${this.pageSize}${data}`).then(data => {
        this.totalCnt = data.data.totalCnt
        this.tableData = data.data.list
        this.midCenter = '暂无数据'
      }).catch(res => {
        this.midCenter = '暂无数据'
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
    width: 130px;
  }
  .client-name {
    display: inline-block;
    width: 200px;
  }
  .btn {
    // float: right;
    // margin-right: 20px;
    width: 80px;
    height: 25px;
    display: inline-block;
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
.list-container/deep/.el-table td,
.el-table th {
  text-align: center;
}
.list-container/deep/.credit-table-color-blue tr {
  cursor: default;
  background-color: @table-bg;
  background-color: var(--mainTableBg) !important;
}
.list-container/deep/.credit-table-color-blue .el-table__body tr {
  &:nth-of-type(2n + 1):hover > td {
    background-color: @table-hover;
    background-color: var(--mainTableHover) !important;
  }
}
.amount-input {
  margin-right: 20px;
}
.search-container /deep/ .el-input__inner {
  width: 130px;
  height: 23px;
  padding-right: 10px !important;
}
.list-container/deep/.el-table .cell {
  text-align: center;
  padding-left: 0px;
  padding-right: 0px;
}
.list-container/deep/.el-select .el-input.is-focus .el-input__inner,
.list-container/deep/ .el-select .el-input__inner:focus,
.list-container/deep/.el-pagination__sizes .el-input .el-input__inner:hover {
  border-color: @theme-blue;
  border-color: var(--mainColor);
}
// .el-select-dropdown__item.selected {
//   color: @theme-blue;
//   color: var(--mainColor) !important;
// }
</style>
<style lang="less">
@import '~@/assets/less/variables';
.el-select-dropdown__item.selected {
  color: @theme-blue;
  color: var(--mainColor);
}
</style>
