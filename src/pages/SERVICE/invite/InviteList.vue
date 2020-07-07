<template>
  <div class="agent-list-main">
    <BusinessTitle title="邀请记录"></BusinessTitle>
    <div class="minpad">
      <div class="agent-list-filtrate">
      <div class="open-account-date">
        <span class="date">创建日期</span>
        <el-date-picker v-model="filtrate.startTime" type="date" :editable="false" prefix-icon="el-icon-caret-bottom"
          value-format="yyyy-MM-dd">
        </el-date-picker>
        <span style="padding: 0 3px">--</span>
        <el-date-picker v-model="filtrate.endTime" type="date" :editable="false" prefix-icon="el-icon-caret-bottom"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>
      <div class="agent-name">
        <span style="padding-right: 10px">目标邮箱</span>
        <input type="text" class="agent-name-input" v-model="filtrate.email">
      </div>
      <div>
        <div class="state-type">
          <span class="state-type-title">状态</span>
          <el-select clearable v-model="filtrate.status" style="padding-left: 10px">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="btn">
        <el-button class="search-button" type="info" @click="getAgentListSearch">查询</el-button>
      </div>
    </div>
    <el-main style="padding:0">
      <el-table :data="agentListData" border stripe header-align='center'
        class="credit-table-color-blue sy-global-has-gutter__th--text-center sy-global-el-table-fit--border"
        :row-class-name="rowClassName" :empty-text='midCenter'>
        <el-table-column prop="createdOn" label="创建时间" width="160">
        </el-table-column>
        <el-table-column prop="url" label="链接">
        </el-table-column>
        <el-table-column prop="inviteType" label="邀请类型" width="140">
        </el-table-column>
        <el-table-column prop="email" label="目标邮箱" width="160">
        </el-table-column>
        <el-table-column prop="inviteStatus" label="状态" width="100">
        </el-table-column>
        <el-table-column prop="phone" label="注册手机号" width="140">
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
        email: '',
        startTime: '',
        endTime: '',
        status: ''
      },
      // 交易类型
      options: [
        {
          value: 'Registering',
          label: '待注册'
        },
        {
          value: 'Registered',
          label: '已注册'
        },
        {
          value: 'Expired',
          label: '已过期'
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
      getAgentListUrl: settings.apiGateway.getInviteLis
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
      this.fetch(`${this.getAgentListUrl}${this.pageNo - 1}/${this.pageSize}`, 'post', this.filterData).then(data => {
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
    width: calc(~ '100% - 25px');
    // min-width: 1073px;
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
        width: 146px;
        padding-left: 5px;
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
  width: 125px;
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
  width: 103px;
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
