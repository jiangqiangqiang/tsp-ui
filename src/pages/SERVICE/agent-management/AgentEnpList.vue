<template>
  <div class="agent-list-main">
    <BusinessTitle :title="$route.query.name || '企业名称'" isShowBack></BusinessTitle>
    <el-main style="padding:0 20px;marginTop:24px">
      <el-table :data="agentListData" border stripe header-align='center'
        class="credit-table-color-blue sy-global-has-gutter__th--text-center sy-global-el-table-fit--border"
        :row-class-name="rowClassName" @row-click="goAgentDetail" :empty-text='midCenter'>
        <el-table-column label="序号" type="index" width="120">
        </el-table-column>
        <el-table-column prop="enterpriseName" label="企业名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="creditCode" label="统一社会信用代码" show-overflow-tooltip>
        </el-table-column>
        <!-- <el-table-column
            width="180"
            prop="landLine"
            label="联系电话">
          </el-table-column> -->
        <el-table-column prop="createdOn" label="开户日期">
        </el-table-column>
        <el-table-column prop="userStatus" label="状态" width="160">
          <template slot-scope="scope">
            {{agentStatus[scope.row.userStatus]}}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="160">
          <template slot-scope="scope" v-if="(scope.row.userStatus !== 'WAIT_INIT')">
            <a class="resendPasswordBtn" @click.stop="viewTransactions(scope.row)">查看交易</a>
          </template>
        </el-table-column>
        <el-table-column v-if="false" prop="uid" label="用户ID">
        </el-table-column>
      </el-table>
      <el-row class="sy-global--Pagination--bg" style="margin-bottom: 2rem" v-if="agentListData.length>0">
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
</template>

<script>
import settings from '@/settings'
import BusinessTitle from '@/components/BusinessTitle'
export default {
  name: 'agentList',
  components: { BusinessTitle },
  data () {
    return {
      name: '',
      // centerDialogVisible: false,
      refundDialog: false,
      // 筛选
      filtrate: {
        roleName: 'Agent'
      },
      midCenter: '暂无数据',
      // 交易类型
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
      // 代理商列表数据
      agentListData: [],
      pageSize: 10,
      pageSizes: settings.pageSizes,
      pageNo: 1,
      totalCnt: 0,
      // 状态枚举
      agentStatus: settings.agentStatusMap,
      // 代理商下的企业列表接口
      getEnterpriseAngUrl: settings.apiGateway.getEnterpriseAng,
      // 代理商列表重新发送密码
      agentResendPadUrl: settings.apiGateway.agentResendPad,
      // 退款接口
      agentRefundUrl: settings.apiGateway.agentRefund
    }
  },
  created () {
    this.getAgentListData()
  },
  methods: {
    pageChange (curPage) {
      this.pageNo = curPage
      this.getAgentListData()
    },
    sizeChange (pageSize) {
      this.pageSize = pageSize
      this.pageNo = 1
      this.getAgentListData()
    },
    getAgentListData () {
      this.midCenter = '查询中'
      this.fetch(`${this.getEnterpriseAngUrl}${this.$route.query.id}/${this.pageNo - 1}/${this.pageSize}`).then(data => {
        this.midCenter = '暂无数据'
        this.agentListData = data.data.list
        this.totalCnt = data.data.totalCnt
        this.pageSize = data.data.pageSize
      }).catch(data => {
        this.midCenter = '暂无数据'
        this.$message.error(data.msg)
      })
    },
    // 代理商开户
    // goAgentOpenAccount () {
    //   this.$router.push('/service/agent-open-account')
    // },
    // 搜索
    getAgentListSearch () {
      this.getAgentListData()
    },
    // 代理商详情
    goAgentDetail (row, event, column) {
      // 点击非操作cell时跳转详情
      if (column.label !== '交易情况' && row.userStatus !== 'WAIT_INIT') {
        this.$router.push({
          path: '/service/enterprise-client-detail',
          query: {
            user_id: row.eid
          }
        })
      } else if (column.label === '交易情况' && row.userStatus !== 'WAIT_INIT') {
        this.viewTransactions(row)
      } else {
        this.$message.warning('该账户未进行初始化信息的填写, 无法查看信息详情')
      }
    },
    rowClassName (row, rowIndex) {
      return row.row.userStatus === 'WAIT_INIT' ? 'cursor--disabled' : 'cursor--pointer'
    },
    // 查看交易
    viewTransactions (row) {
      this.$router.push({
        path: 'service/enterprise-transaction',
        query: {
          id: row.eid,
          name: row.enterpriseName
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/variables';
.agent-list-main {
  .agent-list-button {
    height: 80px;
    padding-left: 20px;
    padding-top: 20px;
    box-sizing: border-box;
    /*
    width: 163px;
    height: 41px;
    line-height: 41px;
    text-align: center;
    font-size: 16px;
    color: #ffffff;
    background: @theme-blue;
    background: var(--mainColor);
    border-radius: 4px;
    margin: 22px 0 20px 25px;
    cursor: pointer;
    i {
      font-size: 18px;
    }
*/
  }
  .agent-list-filtrate {
    width: 97.8%;
    height: 53px;
    line-height: 53px;
    border: 1px solid #e6e6e6;
    margin-top: 20px;
    margin-bottom: 20px;
    padding-left: 23px;
    background: #fcfcfc;
    .agent-name {
      float: left;
      margin-right: 35px;
      .agent-name-input {
        width: 216px;
        height: 23px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
      }
    }
    .open-account-date {
      float: left;
      margin-right: 35px;
      .date {
        padding-right: 18px;
      }
    }
    .state-type {
      float: left;
      margin-right: 35px;
      .state-type-tile {
        padding-right: 20px;
      }
    }
    .btn {
      float: left;
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
    // width:29px;
    // height:19px;
    // margin: 0 auto;
    color: @theme-blue;
    color: var(--mainColor);
    border-bottom: @theme-blue;
    border-bottom: 1px solid var(--mainColor);
    cursor: pointer;
  }
  .resendPasswordBtn {
    width: 86px;
    height: 19px;
    margin: 0 auto;
    color: @theme-blue;
    color: var(--mainColor);
    border-bottom: @theme-blue;
    border-bottom: 1px solid var(--mainColor);
    cursor: pointer;
  }
  .color-change {
    color: @theme-blue;
    color: var(--mainColor);
  }
  .text {
    text-align: center;
    height: 40px;
    line-height: 26px;
    font-size: 19px;
    margin-top: 20px;
  }
  .dialogBtn {
    width: 30%;
    height: 50px;
    // border-color: @theme-blue;
    // border-color: var(--mainColor);
    // background-color: @theme-blue;
    // background-color: var(--mainColor);
    font-size: 18px;
  }
  // .dialogBtn:hover{
  //   border-color: @theme-blue;
  //   border-color: var(--mainColor);
  //   background-color: @theme-blue;
  //   background-color: var(--mainColor)
  // }
}
.agent-list-main/deep/ .el-date-editor.el-input {
  width: 135px;
  padding-right: 0;
}
.agent-list-main /deep/ .el-input--suffix .el-input__inner {
  padding-right: 0;
}
.agent-list-main /deep/.el-input__inner {
  // box-shadow: none;
  height: 25px;
  line-height: 25px;
}
.agent-list-main /deep/.el-input__icon {
  line-height: 25px;
}
.agent-list-main /deep/.el-input--suffix {
  width: 163px;
}
.agent-list-main/deep/.el-table td,
.el-table th {
  text-align: center;
}
.agent-list-main/deep/.credit-table-color-blue tr {
  cursor: pointer;
  background-color: @table-bg;
  background-color: var(--mainTableBg) !important;
}
.agent-list-main/deep/ .el-table__header tr:first-child {
  cursor: default;
}
.agent-list-main/deep/.credit-table-color-blue .el-table__body tr:hover > td {
  cursor: pointer;
  background-color: @table-hover;
  background-color: var(--mainTableHover) !important;
}
.agent-list-main/deep/.el-table .cell {
  text-align: center;
  padding-left: 0px;
  padding-right: 0px;
}
.agent-list-main/deep/.el-dialog {
  position: absolute;
  top: 50% !important;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  margin-top: 0 !important;
  margin-left: 108px;
}
</style>
<style lang="less">
.cursor--disabled {
  cursor: not-allowed !important;
}
.cursor--pointer {
  cursor: pointer !important;
}
.agent-list-main .dialog .el-dialog {
  height: 250px;
}
</style>
