<template>
  <div class="joint-token">
    <BusinessTitle title="联合发令"></BusinessTitle>
    <div v-if="this.userRole === 'fund'">
      <Button  title="申请联合发令" class="jointTokenBtn" @handleClick="applyJointToken" icon="el-icon-plus"></Button>
    </div>
    <BusinessFiltrate :filtrate="filtrate" :options="options" @getBusinessFiltrate="getBusinessFiltrate"></BusinessFiltrate >
    <el-table
      :data="JointTokenList"
      stripe
      header-align='center'
      border
      style="width: 100%"
      class="JointTokenList credit-table-color-blue sy-global-has-gutter__th--text-center sy-global-el-table-fit--border">
      <el-table-column
        prop="createdOn"
        label="申请时间"
        width="180">
      </el-table-column>
      <el-table-column
        prop="orderId"
        label="交易编号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="amount"
        label="发令金额">
        <template slot-scope="scope">
          <span>{{scope.row.amount | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="this.userRole === 'fund'"
        prop="enterpriseName"
        label="企业方">
      </el-table-column>
      <el-table-column v-if="this.userRole === 'enterprise'"
        prop="fundName"
        label="资金方">
      </el-table-column>
      <el-table-column
        prop="processState"
        label="状态">
        <template slot-scope="scope">
          <span class="processState">{{scope.row.processStateName}}</span>
          <!--    时钟图标显示逻辑      -->
          <div v-if="userRole === 'fund' && (['WaitPayment', 'WaitConfirmEndorse'].indexOf(scope.row.processState) !== -1)" style="display: inline-block;position: relative;">
            <el-tooltip class="item" effect="light" :content="scope.row.content" placement="top">
              <!-- <span :class="[scope.row.expirationTime > 0 ? 'datagrey-icon' : 'red-icon']"></span> -->
              <svg-icon :iconClass="scope.row.expirationTime > 0 ? 'zjf_lhfl_djs' : 'zjf_lhfl_cs'" className='datagrey-icon'></svg-icon>
            </el-tooltip>
          </div>
          <div v-if="userRole === 'enterprise' && (['WaitConfirmSchema', 'WaitEndorse'].indexOf(scope.row.processState) !== -1)" style="display: inline-block;position: relative;">
            <el-tooltip class="item" effect="light" :content="scope.row.content" placement="top">
              <!-- <span :class="[scope.row.expirationTime > 0 ? 'datagrey-icon' : 'red-icon']"></span> -->
              <svg-icon :iconClass="scope.row.expirationTime > 0 ? 'zjf_lhfl_djs' : 'zjf_lhfl_cs'" className='datagrey-icon'></svg-icon>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
        <template slot-scope="scope">
          <div @click="handleClick(scope.row)" class="skipBtn">查看</div>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="sy-global--Pagination--bg" style="margin-bottom: 2rem">
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
</template>

<script>
import BusinessTitle from '@/components/BusinessTitle'
import BusinessFiltrate from '@/components/BusinessFiltrate'
import settings from '@/settings'
export default {
  components: {
    BusinessTitle,
    BusinessFiltrate
  },
  data () {
    return {
      pageSize: 10,
      pageSizes: settings.pageSizes,
      pageNo: 1,
      totalCnt: 0,
      filtrate: {},
      userRole: '',
      options: [
        {
          value: 'WaitConfirmSchema',
          label: '等待企业确认方案'
        },
        {
          value: 'WaitPayment',
          label: '等待资金方付款'
        },
        {
          value: 'WaitEndorse',
          label: '等待企业背书'
        },
        {
          value: 'WaitConfirmEndorse',
          label: '等待确认背书'
        },
        {
          value: 'Succeed',
          label: '联合发令成功'
        },
        {
          value: 'WaitFundCancelConfirm',
          label: '企业方申请取消'
        },
        {
          value: 'WaitEnpCancelConfirm',
          label: '资金方申请取消'
        },
        {
          value: 'Canceled',
          label: '已取消'
        }
      ],
      JointTokenList: [],
      className: '',
      // 资金方联合发令列表
      getJointTokenListUrl: settings.apiGateway.getJointTokenList
    }
  },
  methods: {
    setJointTokenList () {
      clearInterval(this.timerId)
      this.JointTokenList.forEach((item, index) => {
        item.content = this.setCutdowns(item.expirationTime)
        item.expirationTime = item.expirationTime <= 0 ? 0 : item.expirationTime - 1000
        this.log(item)
      })
      this.timerId = setInterval(() => {
        this.log('cutdownms')
        this.JointTokenList.forEach((item, index) => {
          item.content = this.setCutdowns(item.expirationTime)
          item.expirationTime = item.expirationTime <= 0 ? 0 : item.expirationTime - 1000
          this.log(item)
        })
        let allTimesOut = this.JointTokenList.every((item) => {
          return item.content === '已超时'
        })
        if (allTimesOut) {
          clearInterval(this.timerId)
        }
      }, 1000)
    },
    setCutdowns (cutdownms) {
      let cutdowns = Math.ceil(cutdownms / 1000)
      function setTime () {
        let hours, minutes, seconds
        hours = Math.floor(cutdowns / (60 * 60))
        hours = hours >= 10 ? hours : '0' + hours
        let distance = cutdowns % 3600
        minutes = Math.floor(distance / 60)
        minutes = minutes >= 10 ? minutes : '0' + minutes
        distance = distance % 60
        seconds = distance >= 10 ? distance : '0' + distance
        return `${hours}时${minutes}分${seconds}秒`
      }
      if (cutdownms <= 0) {
        return '已超时'
      } else {
        return setTime()
      }
    },
    applyJointToken () {
      // this.$router.push('/fund/wait-enterprise-affirm')
      this.$router.push('/fund/apply-joint-token')
    },
    getBusinessFiltrate (filtrate) {
      this.filtrate = filtrate
      this.getJointTokenList()
    },
    pageChange (curPage) {
      this.pageNo = curPage
      this.getJointTokenList()
    },
    sizeChange (pageSize) {
      this.pageSize = pageSize
      this.getJointTokenList()
    },
    getJointTokenList () {
      // 要有拼接参数的步骤
      let params = ''
      if (JSON.stringify(this.filterData) === '{}') {
        params = ''
      } else {
        params += '?'
        for (let key in this.filterData) {
          if (key === 'startTime') {
            this.filterData[key] = this.concatDate(this.filterData[key], '00:00:00')
          } else if (key === 'endTime') {
            this.filterData[key] = this.concatDate(this.filterData[key], '23:59:59')
          }
          params += `${key}=${this.filterData[key]}&`
        }
        params = params.substring(0, params.length - 1)
      }
      this.fetch(`${this.getJointTokenListUrl}${this.pageNo - 1}/${this.pageSize}${params}`).then(data => {
        this.JointTokenList = JSON.parse(JSON.stringify(data.data.list))
        this.setJointTokenList()
        this.totalCnt = data.data.totalCnt
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    handleClick (row) {
      this.$router.push({
        path: '/' + this.userRole + '/joint-token-info',
        query: { code: row.orderId }
      })
    }
  },
  created () {
    this.userRole = this.getUserRole()
    this.getJointTokenList()
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
  },
  beforeDestroy () {
    clearInterval(this.timerId)
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/less/variables';
.jointTokenBtn {
  width: 163px;
  height: 41px;
  margin: 22px 0 0 25px;
  border-radius: 5px;
  color: #fff;
  box-shadow: 1px 6px 4px @btn-disabled;
  box-shadow: 1px 6px 4px var(--mainTableHover);
}
.skipBtn {
  cursor: pointer;
  text-align: center;
  height:19px;
  margin: 0 auto;
  color: @theme-blue;
  color:var(--mainColor);
  text-decoration:underline;
  // border-bottom: @theme-blue;
  // border-bottom: 1px solid var(--mainColor)
}
.processState {
  position: relative;
}
.datagrey-icon {
  position: absolute;
  top: -13px;
  width: 16px!important;
  height: 16px!important;
  vertical-align: middle;
}
.red-icon {
  position: absolute;
  top: -13px;
  width: 16px!important;
  height: 16px!important;
  vertical-align: middle;
}
.JointTokenList{
    margin-top:20px
}
.joint-token/deep/.el-table .cell{
    text-align: center
}
.joint-token/deep/.credit-table-color-blue tr {
    cursor: default;
    background-color: @table-bg;
    background-color: var(--mainTableBg)!important;
  }
.joint-token/deep/.credit-table-color-blue .el-table__body tr{
    &:nth-of-type(2n+1):hover>td {
      background-color: @table-hover;
      background-color: var(--mainTableHover) !important;
    }
  }
 .el-button--primary:hover{
  background: @theme-blue;
  background:var(--mainColor)
  }
</style>
