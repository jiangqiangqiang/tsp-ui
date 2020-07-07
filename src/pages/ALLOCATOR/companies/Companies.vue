<template>
  <div class="companies">
    <BusinessTitle title="往来企业列表"></BusinessTitle>
    <div class="filter">
      <div class="customer-name">
        <span style="padding-right:17px">企业名称</span>
        <input type="text" v-model="filtrate.relatedPartyName" class="customer-input">
      </div>
      <div class="filtrate">
        <div class="amount-filtrate">
          <span style="padding-right:17px">交易次数</span>
          <el-input v-model="filtrate.min" class="amount-input"></el-input>
          <span style="padding: 0 3px">--</span>
          <el-input v-model="filtrate.max" class="amount-input"></el-input>
        </div>
      </div>
      <div class="btn">
        <el-button class="search-button" type="info"  @click="getBusinessFiltrate">查询</el-button>
      </div>
    </div>
    <div>
      <el-table
        :data="companiesList"
        stripe
        header-align='center'
        border
        style="width: 100%"
        :empty-text='midCenter'
        class="companiesList credit-table-color-blue sy-global-has-gutter__th--text-center sy-global-el-table-fit--border">
        <el-table-column
          type=index
          :index="indexMethod"
          prop="applicationTime"
          label="序号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="enterpriseName"
          show-overflow-tooltip
          label="企业名称">
        </el-table-column>
        <el-table-column
          prop="enterpriseCreditCode"
          label="统一社会信用代码">
        </el-table-column>
        <el-table-column
          prop="transactionNumber"
          label="交易次数"
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作"
          width="180">
          <template slot-scope="scope" v-if="(scope.row.transactionNumber) > 0">
            <div @click="handleClick(scope.row)" class="skipBtn">查看相关交易记录</div>
          </template>
        </el-table-column>
      </el-table>
      <el-row class="sy-global--Pagination--bg" style="margin-bottom: 2rem" v-if="companiesList.length>0">
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
    </div>
  </div>
</template>

<script>
import BusinessTitle from '@/components/BusinessTitle'
import settings from '@/settings'
export default {
  components: {
    BusinessTitle
  },
  data () {
    return {
      filtrate: {
        relatedPartyName: '',
        min: '',
        max: ''
      },
      pageSize: 10,
      pageSizes: settings.pageSizes,
      pageNo: 1,
      midCenter: '暂无数据',
      totalCnt: 0,
      companiesList: [],
      getCompaniesUrl: settings.apiGateway.getCompanies
    }
  },
  methods: {
    handleClick (row) {
      this.$router.push({
        name: 'enterpriseCashdetailAccount',
        params: { enterpriseName: row.enterpriseName }
      })
    },
    indexMethod (index) {
      index = index + this.pageSize * (this.pageNo - 1) + 1
      return index
    },
    getBusinessFiltrate () {
      this.getCompanies()
    },
    pageChange (curPage) {
      this.pageNo = curPage
      this.getCompanies()
    },
    sizeChange (pageSize) {
      this.pageSize = pageSize
      this.getCompanies()
    },
    ViewRecords () {
      this.$router.push('/enterprise/companies/trading-record')
    },
    getCompanies () {
      // 要有拼接参数的步骤
      for (let key in this.filterData) {
        if (key === 'startTime') {
          this.filterData[key] = this.concatDate(this.filterData[key], '00:00:00')
        } else if (key === 'endTime') {
          this.filterData[key] = this.concatDate(this.filterData[key], '23:59:59')
        }
      }
      this.midCenter = '查询中'
      this.fetch(`${this.getCompaniesUrl}${this.pageNo - 1}/${this.pageSize}`, 'post', this.filterData).then(data => {
        this.companiesList = data.data.detailList
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
    this.getCompanies()
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
.filter{
  padding-top:13px;
  padding-left:22px;
  width: 97.8%;
  height:39px;
  border: 1px solid #ccc;
  margin-top:23px;
  background: #fcfcfc;
  .customer-name{
    float: left;
  }
  .customer-input{
    width:218px;
    height:22px;
    border: 1px solid #cccccc;
    border-radius: 4px;
  }
  .amount-filtrate{
    float: left;
    margin-left:50px;
  }
  .amount-input{
    width:83px;
  }
  .filtrate /deep/.el-input__inner{
    height: 25px;
    line-height: 25px
  }
  .btn{
    float: left;
    margin-left:289px;
    width: 80px;
    height:25px;
    .el-button {
      width: 80px;
      height:25px;
      line-height:0px;
      background-color:#e5e5e5
    }
    .search-button {
      color: #797c84;
    }
  }
}
.companiesList {
  margin-top:20px;
}
.companies/deep/.el-table .cell{
    text-align: center
}
.companies/deep/.credit-table-color-blue tr {
    background-color: @table-bg;
    background-color: var(--mainTableBg)!important;
  }
.companies/deep/.credit-table-color-blue .el-table__body tr{
    &:nth-of-type(2n+1):hover>td {
      background-color: @table-hover;
      background-color: var(--mainTableHover) !important;
    }
  }
.skipBtn {
  cursor: pointer;
  text-align: center;
  height:19px;
  margin: 0 auto;
  color:@theme-blue;
  color:var(--mainColor);
  text-decoration: underline;
  // border-bottom: 1px solid @theme-blue;
  // border-bottom: 1px solid var(--mainColor)
}
</style>
