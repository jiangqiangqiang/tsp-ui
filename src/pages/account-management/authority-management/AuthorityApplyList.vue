<template>
  <div class="authority-apply-list">
    <BusinessTitle title="审核加入申请" isShowBack @goBack="goAuthprithList"></BusinessTitle>
    <div style="margin-top: 35px;padding: 0 20px;">
      <el-table :data="AuthorityList" border stripe style="width: 100%" header-align='center'
        class="TopUpList credit-table-color-blue sy-global-has-gutter__th--text-center sy-global-el-table-fit--border">
        <el-table-column type="index" label="序号" width='100'>
        </el-table-column>
        <el-table-column prop="applyTime" label="申请时间">
        </el-table-column>
        <el-table-column prop="realName" label="姓名">
        </el-table-column>
        <el-table-column prop="idNumber" label="身份证号">
        </el-table-column>
        <el-table-column prop="userName" label="手机号码 (账户)">
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            {{enterpriseAdminName[scope.row.status]}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope" v-if="scope.row.status === 'Pending'">
            <el-button @click="handleClick(scope.row)" type="text" size="small" class="operation-btn">处理</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row class="sy-global--Pagination--bg" style="margin-bottom: 2rem" v-if="AuthorityList.length>0">
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
import BusinessTitle from '@/components/BusinessTitle'
export default {
  components: {
    BusinessTitle
  },
  data () {
    return {
      badge: '12',
      pageSize: 10,
      pageSizes: settings.pageSizes,
      pageNo: 1,
      totalCnt: 0,
      AuthorityList: [],
      auditApplyListUrl: settings.apiGateway.auditApplyList,
      // 状态枚举
      enterpriseAdminName: settings.enterpriseApproveStatusMap
    }
  },
  methods: {
    goAuthprithList () {
      this.$router.push('/' + this.userRole + '/authority-management')
    },
    auditApplyList () {
      this.fetch(`${this.auditApplyListUrl}${this.pageNo - 1}/${this.pageSize}`).then(data => {
        this.AuthorityList = data.data.list
        this.totalCnt = data.data.totalCnt
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    pageChange (curPage) {
      this.pageNo = curPage
      this.auditApplyList()
    },
    sizeChange (pageSize) {
      this.pageSize = pageSize
      this.auditApplyList()
    },
    handleClick (row) {
      this.$router.push({
        path: '/' + this.userRole + '/authority-apply-detail',
        query: {
          id: row.id
        }
      })
    }
  },
  created () {
    this.userRole = this.getUserRole()
    this.auditApplyList()
  },
  computed: {
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/variables';
.authority-apply-list {
  .review-apply {
    position: relative;
    left: 960px;
    top: -60px;
    .review-btn {
      width: 133px;
      height: 41px;
    }
  }
  .operation-btn {
    font-size: 14px;
    text-decoration: underline;
    color: @theme-blue;
    color: var(--mainColor);
  }
}
</style>

<style lang="less">
@import '~@/assets/less/variables';
.authority-apply-list .el-table .cell {
  text-align: center;
}
.authority-apply-list .credit-table-color-blue tr {
  cursor: default;
  background-color: @table-bg;
  background-color: var(--mainTableBg) !important;
}
.authority-apply-list .credit-table-color-blue .el-table__body tr {
  &:nth-of-type(2n + 1):hover > td {
    background-color: #e3eef8 !important;
    background-color: var(--mainTableHover) !important;
  }
}
.authority-apply-list .el-dialog {
  position: absolute;
  top: 50% !important;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  margin-top: 0 !important;
  margin-left: 108px;
}
</style>
