<template>
  <div class="agent-list-main">
    <BusinessTitle title="用户列表"></BusinessTitle>
    <div class="minpad">
      <div class="agent-list-filtrate">
        <div class="serchContent">
          <div class="open-account-date">
        <span class="title-amount-sale">创建日期</span>
        <el-date-picker v-model="filtrate.startTime" type="date" :editable="false" prefix-icon="el-icon-caret-bottom"
          value-format="yyyy-MM-dd">
        </el-date-picker>
        <span style="padding: 0 3px;fontSize:14px">--</span>
        <el-date-picker v-model="filtrate.endTime" type="date" :editable="false" prefix-icon="el-icon-caret-bottom"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>
      <div class="agent-name">
        <span class="title-amount-sale">姓名</span>
        <input type="text" class="agent-name-input" v-model="filtrate.name">
      </div>
      <div class="agent-name">
        <span class="title-amount-sale">身份证号</span>
        <input type="text" class="agent-name-input longW" v-model="filtrate.idNumber">
      </div>
      <div class="agent-name">
        <span class="title-amount-sale">所属企业</span>
        <input type="text" class="agent-name-input longW1" v-model="filtrate.enterpriseName">
      </div>
        <div class="state-type">
          <span class="title-amount-sale">角色</span>
          <el-select clearable v-model="filtrate.role">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="agent-name putRight">
          <span class="title-amount-sale">手机号</span>
          <input type="text" class="agent-name-input" v-model="filtrate.phone">
        </div>
        <div style="height:0;width:100%;display:inline-block"></div>
        </div>
      <div class="btn">
        <el-button class="search-button" type="info" @click="getAgentListSearch">查询</el-button>
      </div>
    </div>
    <el-main style="padding:0">
      <el-table :data="agentListData" border stripe header-align='center'
        class="credit-table-color-blue sy-global-has-gutter__th--text-center sy-global-el-table-fit--border"
        :row-class-name="rowClassName" :empty-text='midCenter'>
        <el-table-column prop="createdOn" label="创建时间" min-width="169">
        </el-table-column>
        <el-table-column prop="realName" label="姓名" min-width="130">
        </el-table-column>
        <el-table-column prop="idNumber" label="身份证号" min-width="169">
        </el-table-column>
        <el-table-column prop="phone" label="手机号" min-width="130">
        </el-table-column>
        <el-table-column prop="enterpriseName" label="所属企业" min-width="200" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="role" label="角色">
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
        serviceName: ''
      },
      // 交易类型
      options: [
        {
          value: 'Admin',
          label: '管理员'
        },
        {
          value: 'Operator',
          label: '操作员'
        }
      ],
      midCenter: '暂无数据',
      // 代理商列表数据
      agentListData: [],
      pageSize: 10,
      pageSizes: settings.pageSizes,
      pageNo: 1,
      totalCnt: 0,
      // 状态枚举
      agentStatus: settings.agentStatusMap,
      // 代理商列表接口
      getUserLisUrl: settings.apiGateway.getUserLis,
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
      // 问号传参
      for (let key in this.filterData) {
        if (key === 'startTime') {
          this.filterData[key] = this.concatDate(this.filterData[key], '00:00:00')
        } else if (key === 'endTime') {
          this.filterData[key] = this.concatDate(this.filterData[key], '23:59:59')
        }
      }
      this.midCenter = '查询中'
      this.fetch(`${this.getUserLisUrl}${this.pageNo - 1}/${this.pageSize}`, 'post', this.filterData).then(data => {
        this.agentListData = data.data.list
        this.totalCnt = data.data.totalCnt
        this.pageSize = data.data.pageSize
        this.midCenter = '暂无数据'
      }).catch(data => {
        this.midCenter = '暂无数据'
        this.$message.error(data.msg)
      })
    },
    // 代理商开户
    goAgentOpenAccount () {
      this.$router.push('/admin/agent-open-account')
    },
    // 搜索
    getAgentListSearch () {
      this.getAgentListData()
    },
    rowClassName (row, rowIndex) {
      return row.row.userStatus === 'WAIT_INIT' ? 'cursor--disabled' : 'cursor--pointer'
    }
  },
  computed: {
    filterData () {
      let filterData = JSON.parse(JSON.stringify(this.filtrate))
      for (let key in filterData) {
        if (!filterData[key]) {
          delete filterData[key]
        }
      }
      return filterData
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/variables';
.minpad {
  padding: 0 20px;
}
.serchContent {
  width: calc(~"100% - 125px");
  min-width: 968px;
  // height: 76px;
  float: left;
  display: table-cell;
  vertical-align: middle;
  text-align: justify;
}
.title-amount-sale {
  display: inline-block;
  width: 75px;
  font-size: 14px;
  text-align: right;
  padding-right: 18px;
}
.agent-list-main {
  .agent-list-button {
    height: 80px;
    padding-left: 20px;
    padding-top: 20px;
    box-sizing: border-box;
  }
  .agent-list-filtrate {
    width: calc(~"100% - 12px");
    padding-left: 10px;
    position: relative;
    // height: 106px;
    // line-height: 53px;
    border: 1px solid #e6e6e6;
    margin-top: 20px;
    margin-bottom: 20px;
    background: #fcfcfc;
    overflow: hidden;
    .agent-name {
      display: inline-block;
      width: 320px;
      height: 26px;
      font-size: 0;
      margin-top: 14px;
      .agent-name-input {
        width: 217px;
        height: 23px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        padding-left: 5px;
        font-size: 14px;
      }
    }
    .open-account-date {
      display: inline-block;
      width: 320px;
      height: 26px;
      font-size: 0;
      margin-top: 14px;
      .date {
        padding-right: 5px;
        font-size: 14px;
      }
    }
    .state-type {
      display: inline-block;
      width: 320px;
      height: 26px;
      font-size: 0;
      margin-top: 14px;
      .state-type-tile {
        padding-right: 20px;
        font-size: 14px;
      }
    }
    .btn {
      position: absolute;
      right: 0;
      bottom: 15px;
      margin-right: 20px;
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
  width: 105px;
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
.agent-list-main /deep/.el-input__prefix {
  left: 72px !important;
}
.agent-list-main /deep/.el-input--suffix {
  width: 224px;
}
.agent-list-main/deep/.el-table td,
.el-table th {
  text-align: center;
}
.agent-list-main/deep/.credit-table-color-blue tr {
  background-color: @table-bg;
  background-color: var(--mainTableBg) !important;
}
.agent-list-main/deep/.credit-table-color-blue .el-table__body tr:hover > td {
  background-color: #fcefe0 !important;
  cursor: default;
}
.agent-list-main/deep/.el-table .cell {
  text-align: center;
  padding-left: 5px;
  padding-right: 5px;
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
