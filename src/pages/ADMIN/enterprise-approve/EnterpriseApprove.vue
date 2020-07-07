<template>
    <div class="agent-approval-main">
      <BusinessTitle title="企业信息审核列表"></BusinessTitle>
      <div class="minpad">
        <div class="select-btn">
        <el-radio-group v-model="classify" @change="handleChange">
          <el-badge :value="pendingNum.Service" class="item" :max="99">
            <el-radio-button label="service" >服务商</el-radio-button>
          </el-badge>
          <el-badge :value="pendingNum.Agent" class="item" :max="99">
            <el-radio-button label="agent" >代理商</el-radio-button>
          </el-badge>
          <el-badge :value="pendingNum.Enterprise" class="item" :max="99">
            <el-radio-button label="enterprise" >企业方</el-radio-button>
          </el-badge>
        </el-radio-group>
      </div>
      <div class="agent-approval-table">
        <el-main style="padding:0">
          <el-table
            :data="enterpriseApproveData"
            border
            stripe
            header-align='center'
            :empty-text='midCenter'
            class="credit-table-color-blue sy-global-has-gutter__th--text-center sy-global-el-table-fit--border">
            <el-table-column
              prop="createdOn"
              label="申请时间"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="企业名称"
              min-width="150"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="creditCode"
              min-width="150"
              label="统一社会信用代码">
              </el-table-column>
            <el-table-column
            :show-overflow-tooltip="true"
              prop="landLinePhone"
              label="联系电话"
              min-width="120">
            </el-table-column>
            <!-- <el-table-column
              prop="sysRoles"
              label="企业角色"
              min-width="150">
            </el-table-column> -->
            <el-table-column
              prop="auditStatus"
              label="运营商审核"
              min-width="110">
              <template slot-scope="scope">
                {{enterpriseApproveStatusMap[scope.row.auditStatus]}}
              </template>
            </el-table-column>
            <el-table-column
              prop="thirdPartyAuditStatus"
              label="三方审核"
              min-width="110">
              <template slot-scope="scope">
                {{enterpriseApproveStatusMap[scope.row.thirdPartyAuditStatus] || '--'}}
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="操作"
              width="110">
              <template slot-scope="scope">
                <div v-if="scope.row.auditStatus === 'Pending'" class="skipBtn" @click="handleClick(scope.row)">处理</div>
                <div v-else @click="handleClick(scope.row)" class="skipBtn">查看</div>
              </template>
            </el-table-column>
          </el-table>
          <el-row class="sy-global--Pagination--bg" style="margin-bottom: 2rem" v-if="enterpriseApproveData.length>0">
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
  </div>
</template>

<script>
import settings from '@/settings'
import BusinessTitle from '@/components/BusinessTitle'
export default {
  name: 'agentApproval',
  components: { BusinessTitle },
  data () {
    return {
      pendingNum: {
        agent: '',
        service: '',
        enterprise: ''
      },
      midCenter: '暂无数据',
      classify: 'service',
      // 代理商注销申请列表数据
      enterpriseApproveData: [],
      pageSize: 10,
      pageSizes: settings.pageSizes,
      pageNo: 1,
      totalCnt: 0,
      totalReadingElements: '1',
      activeName: '',
      // 状态枚举
      enterpriseApproveStatusMap: settings.enterpriseApproveStatusMap,
      // 企业信息列表接口
      auditEnterpriseListUrl: settings.apiGateway.auditEnterpriseList,
      // 统计企业方、代理商、资金方待处理个数
      getPendingNumUrl: settings.apiGateway.getPendingNum
    }
  },
  created () {
    this.getEnterpriseApproveData()
    this.getPendingNum()
  },
  methods: {
    getPendingNum () {
      this.fetch(this.getPendingNumUrl).then(data => {
        this.pendingNum = data.data
        for (let item in this.pendingNum) {
          if (this.pendingNum[item] === 0) {
            this.pendingNum[item] = ''
          }
        }
      }).catch(data => {
        this.$message.error(data.msg)
      })
    },
    handleChange () {
      this.getEnterpriseApproveData(this.classify)
    },
    pageChange (curPage) {
      this.pageNo = curPage
      this.getEnterpriseApproveData(this.classify)
    },
    sizeChange (pageSize) {
      this.pageSize = pageSize
      this.pageNo = 1
      this.getEnterpriseApproveData(this.classify)
    },
    getEnterpriseApproveData (select) {
      let type = 'service'
      if (select) {
        type = select
      }
      this.midCenter = '查询中'
      this.fetch(`${this.auditEnterpriseListUrl}/${type}/${this.pageNo - 1}/${this.pageSize}`).then(data => {
        this.enterpriseApproveData = data.data.list
        this.totalCnt = data.data.totalCnt
        this.pageSize = data.data.pageSize
        this.midCenter = '暂无数据'
      }).catch(data => {
        this.midCenter = '暂无数据'
        this.$message.error(data.msg)
      })
    },
    // 处理注销
    handleClick (row) {
      this.$router.push({
        path: '/admin/enterprise-approve-detail',
        query: {
          creditCode: row.creditCode,
          user_id: row.userId,
          name: row.name,
          id: row.id,
          tag: row.sysRoles
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/variables';
.minpad {
  padding: 0 20px;
}
.agent-approval-main {
  .select-btn {
    border-bottom: 1px solid #e5e5e5;
    margin: 27px 0 20px;
  }
  .agent-approval-table {
    .skipBtn {
    cursor: pointer;
    width:29px;
    height:19px;
    margin: 0 auto;
    color: @theme-blue;
    color:var(--mainColor);
    text-decoration: underline;
   }
  }
}
.agent-approval-main/deep/.el-table td, .el-table th {
  text-align: center;
}
.agent-approval-main/deep/.credit-table-color-blue tr {
  background-color: @table-bg;
  background-color: var(--mainTableBg)!important;
  }
.agent-approval-main/deep/.credit-table-color-blue .el-table__body tr{
    &:nth-of-type(2n+1):hover>td {
      background-color: @table-hover;
      background-color: var(--mainTableHover) !important;
    }
  }
.agent-approval-main/deep/.el-table .cell {
  text-align: center;
  padding-left: 5px;
  padding-right: 5px;
}
</style>
<style lang="less">
@import '~@/assets/less/variables';
.agent-approval-main .el-badge__content.is-fixed{
  z-index: 999!important;
  right: 18px;
}
.agent-approval-main  .el-radio-button__inner {
  padding: 12px 55px!important;
  border-radius: 0!important;
  background: #e5e5e5
}
.agent-approval-main  .el-radio-button__orig-radio:checked+.el-radio-button__inner {
  border:0;
  color: #928260;
  background: @theme-blue-light;
  background:var(--mainLightColor);
  border: 1px solid #938361
}
.agent-approval-main .el-radio-button__inner:hover {
  color: #928260;
}
</style>
