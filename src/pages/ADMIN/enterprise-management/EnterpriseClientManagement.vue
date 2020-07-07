<template>
  <div class="enterpriseManage">
    <BusinessTitle title="企业方列表"></BusinessTitle>
    <div class="minpad">
      <div class="search-container">
      <span style="margin-left:30px;margin-right:10px;">企业方名称</span>
      <el-input class="client-name" v-model="searchData.enterpriseName" size="mini" clearable>
      </el-input>
      <span style="margin-left:30px;margin-right:10px;">开户日期</span>
      <el-date-picker v-model="searchData.startTime" type="date" size="mini" :editable="false"
        prefix-icon="el-icon-caret-bottom" value-format="yyyy-MM-dd">
      </el-date-picker>
      <span style="padding: 0 3px">--</span>
      <el-date-picker v-model="searchData.endTime" type="date" size="mini" :editable="false"
        prefix-icon="el-icon-caret-bottom" value-format="yyyy-MM-dd">
      </el-date-picker>
      <span style="margin-left:30px;margin-right:10px;">代理商名称</span>
      <el-input class="client-name" v-model="searchData.agentName" size="mini" clearable>
      </el-input>
      <div class="btn">
        <el-button class="search-button" type="info" @click="search">查询</el-button>
      </div>
    </div>
    <el-main class="list-container" style="padding:0">
      <el-table :data="tableData" border stripe header-align='center' @row-click="rowClick"
        class="credit-table-color-blue sy-global-has-gutter__th--text-center sy-global-el-table-fit--border"
        :row-class-name="rowClassName" :empty-text='midCenter'>
        <el-table-column label="序号" type="index" width="120">
        </el-table-column>
        <el-table-column prop="enterpriseName" label="企业名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="creditCode" label="统一信用代码">
        </el-table-column>
        <el-table-column prop="agentName" label="代理商" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="createdOn" label="开户日期" width="120">
        </el-table-column>
        <el-table-column prop="userStatus" label="状态" width="120">
          <template slot-scope="scope">
            {{enterpriseStatus[scope.row.userStatus]}}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="操作" width="150">
          <template slot-scope="scope" v-if="scope.row.userStatus !== 'WAIT_INIT'">
            <a class="skipBtn" @click.stop="handleClick(scope.row)">查看交易</a>
            <a class="skipBtn ml30" @click.stop="setRate(scope.row)">配置费率</a>
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
    <el-dialog :visible.sync="dialogTopUpRate" center width="568px" :close-on-click-modal="false"
      :close-on-press-escape="false">
      <div class="password">
        <p class="prompt">配置服务费</p>
        <div class="codeItem">
          <span class="pay-psd">充值服务费率</span>
          <input type="text" class="psd-input" v-model="rateData.depositFeeRate.value" maxlength="5"
            @blur="topUpRateBlur('depositFeeRate')" />
          <span class="rateUnit">%</span>
        </div>
        <div class="codeItem">
          <span class="pay-psd">生效时间</span>
          <el-date-picker v-model="rateData.depositFeeRate.start" type="date" :editable="false"
            @change="changeStartCode" placeholder="年/月/日" value-format="yyyy-MM-dd" :picker-options="pickerDateBefore"
            style="width:108px;marginLeft:18px">
          </el-date-picker>
          <el-date-picker v-model="rateData.depositFeeRate.end" type="date" :editable="false" @change="changeEndCode"
            placeholder="年/月/日" value-format="yyyy-MM-dd" :picker-options="pickerDateAfter"
            style="width:108px;margin: 0 8px;" :disabled="dispositeChecked">
          </el-date-picker>
          <el-checkbox v-model="dispositeChecked" class="checkRadio">长期有效</el-checkbox>
        </div>
        <div class="dotted"></div>
        <div class="codeItem">
          <span class="pay-psd">提现服务费率</span>
          <input type="text" class="psd-input" v-model="rateData.withdrawFeeRate.value" maxlength="5"
            @blur="topUpRateBlur('withdrawFeeRate')" />
          <span class="rateUnit">%</span>
        </div>
        <div class="codeItem">
          <span class="pay-psd">生效时间</span>
          <el-date-picker v-model="rateData.withdrawFeeRate.start" type="date" :editable="false"
            @change="changeStartCode1" placeholder="年/月/日" value-format="yyyy-MM-dd" :picker-options="pickerDateBefore1"
            style="width:108px;marginLeft:18px">
          </el-date-picker>
          <el-date-picker v-model="rateData.withdrawFeeRate.end" type="date" :editable="false" @change="changeEndCode1"
            placeholder="年/月/日" value-format="yyyy-MM-dd" :picker-options="pickerDateAfter1"
            style="width:108px;margin: 0 8px;" :disabled="withdrawChecked">
          </el-date-picker>
          <el-checkbox v-model="withdrawChecked" class="checkRadio">长期有效</el-checkbox>
        </div>
        <div class="dotted"></div>
        <div class="codeItem">
          <span class="pay-psd">买令服务费率</span>
          <input type="text" class="psd-input" v-model="rateData.buyFeeRate.value" maxlength="5"
            @blur="topUpRateBlur('buyFeeRate')" />
          <span class="rateUnit">%</span>
        </div>
        <div class="codeItem">
          <span class="pay-psd">生效时间</span>
          <el-date-picker v-model="rateData.buyFeeRate.start" type="date" :editable="false" @change="changeStartCode2"
            placeholder="年/月/日" value-format="yyyy-MM-dd" :picker-options="pickerDateBefore2"
            style="width:108px;marginLeft:18px">
          </el-date-picker>
          <el-date-picker v-model="rateData.buyFeeRate.end" type="date" :editable="false" @change="changeEndCode2"
            placeholder="年/月/日" value-format="yyyy-MM-dd" :picker-options="pickerDateAfter2"
            style="width:108px;margin: 0 8px;" :disabled="buyChecked">
          </el-date-picker>
          <el-checkbox v-model="buyChecked" class="checkRadio">长期有效</el-checkbox>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <Button class="confirm-btn" @handleClick="RateSave" title="保存" :isLoading="isLoading"
          :disabled="disRate"></Button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BusinessTitle from '@/components/BusinessTitle.vue'
import settings from '@/settings'
import { dateStart, dateEnd } from '@/services/CommonService.js'
export default {
  name: 'enterpriseManagement',
  data () {
    return {
      searchData: {
        enterpriseName: '',
        startTime: '',
        endTime: '',
        userType: '',
        roleName: 'Enterprise',
        agentName: ''
      },
      midCenter: '暂无数据',
      eid: '',
      rateData: {
        buyFeeRate: {
          end: '',
          start: '',
          value: 0.05
        },
        depositFeeRate: {
          end: '',
          start: '',
          value: 0.05
        },
        withdrawFeeRate: {
          end: '',
          start: '',
          value: 0.05
        }
      },
      buyChecked: false,
      dispositeChecked: false,
      withdrawChecked: false,
      pickerDateBefore: {
        disabledDate: (time) => {
          return false
        }
      },
      pickerDateAfter: {
        disabledDate: (time) => {
          return time.getTime() < (new Date().getTime() - 1 * 24 * 60 * 60 * 1000)
        }
      },
      pickerDateBefore1: {
        disabledDate: (time) => {
          return false
        }
      },
      pickerDateAfter1: {
        disabledDate: (time) => {
          return time.getTime() < (new Date().getTime() - 1 * 24 * 60 * 60 * 1000)
        }
      },
      pickerDateBefore2: {
        disabledDate: (time) => {
          return false
        }
      },
      pickerDateAfter2: {
        disabledDate: (time) => {
          return time.getTime() < (new Date().getTime() - 1 * 24 * 60 * 60 * 1000)
        }
      },
      options: [
        {
          label: '核心企业',
          value: '核心企业'
        },
        {
          label: '供应商',
          value: '供应商'
        }
      ],
      isLoading: false,
      dialogTopUpRate: false,
      pageSize: 10,
      pageSizes: settings.pageSizes,
      pageNo: 1,
      totalCnt: 0,
      enterpriseListUrl: settings.apiGateway.enterpriseList,
      // 查看企业服务费率
      getFeeRateUrl: settings.apiGateway.getFeeRate,
      // 修改服务费率
      updateFeeRateUrl: settings.apiGateway.updateFeeRate,
      enterpriseStatus: settings.agentStatusMap,
      tableData: []
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
      this.pageNo = 1
      this.getEnterpriseList()
    },
    RateSave () {
      let data = this.sumData(this.rateData)
      this.fetch(`${this.updateFeeRateUrl}${this.eid}`, 'post', data).then(data => {
        this.$message.success('配置成功')
        this.dialogTopUpRate = false
      }).catch(res => {
        this.$message.error(res.data.msg)
      })
    },
    // 计算服务费率参数
    sumData (data) {
      let newData = JSON.parse(JSON.stringify(this.rateData))
      newData.buyFeeRate = this.forEndData(newData.buyFeeRate, 'buyChecked')
      newData.depositFeeRate = this.forEndData(newData.depositFeeRate, 'dispositeChecked')
      newData.withdrawFeeRate = this.forEndData(newData.withdrawFeeRate, 'withdrawChecked')
      return newData
    },
    forEndData (obj, check) {
      let newObj = JSON.parse(JSON.stringify(obj))
      for (let key in newObj) {
        if (key === 'end' && this[check]) newObj.end = 'forever'
        if (key === 'value') newObj.value /= 100
      }
      return newObj
    },
    topUpRateBlur (type) {
      this.rateData[type].value = this.rateData[type].value.replace(/[^.\d]/g, '')
      this.rateData[type].value > 100 && (this.rateData[type].value = 100)
      parseFloat(this.rateData[type].value) === 0 && (this.rateData[type].value = '0.0')
    },
    // 限制日期选择 dateStart 为开始日期变化设置结束 dateEnd相反
    changeStartCode (timeStr) {
      this.pickerDateAfter = dateStart(timeStr)
    },
    changeEndCode (timeStr) {
      this.pickerDateBefore = dateEnd(timeStr)
    },
    changeStartCode1 (timeStr) {
      this.pickerDateAfter1 = dateStart(timeStr)
    },
    changeEndCode1 (timeStr) {
      this.pickerDateBefore1 = dateEnd(timeStr)
    },
    changeStartCode2 (timeStr) {
      this.pickerDateAfter2 = dateStart(timeStr)
    },
    changeEndCode2 (timeStr) {
      this.pickerDateBefore2 = dateEnd(timeStr)
    },
    rowClick (row, event, column) {
      // 点击非操作cell时跳转详情
      if (column.label !== '交易情况' && row.userStatus !== 'WAIT_INIT') {
        this.$router.push({
          path: '/admin/enterprise-client-detail',
          query: {
            userType: row.userType,
            user_id: row.eid
          }
        })
      } else if (column.label === '交易情况' && row.userStatus !== 'WAIT_INIT') {
        this.handleClick(row)
      } else {
        this.$message.warning('该账户未进行初始化信息的填写, 无法查看信息详情')
      }
    },
    // 查看交易
    handleClick (rowData) {
      this.$router.push({
        path: 'admin/enterprise-transaction',
        query: {
          id: rowData.eid,
          name: rowData.enterpriseName
        }
      })
    },
    // 配置费率按钮
    setRate (rowData) {
      this.eid = rowData.eid
      this.getRate()
      this.dialogTopUpRate = true
    },
    // 企业配置费率查询
    getRate (eid) {
      this.fetch(`${this.getFeeRateUrl}${this.eid}`).then(data => {
        let rateData = data.data
        let checkObj = {
          buyFeeRate: 'buyChecked',
          depositFeeRate: 'dispositeChecked',
          withdrawFeeRate: 'withdrawChecked'
        }
        for (let key in rateData) {
          rateData[key].value *= 100
          this.rateData[key] = rateData[key]
          if (rateData[key].end === 'forever') {
            this.rateData[key].end = ''
            this[checkObj[key]] = true
          } else {
            this[checkObj[key]] = false
          }
        }
      }).catch(res => {
        this.$messgae.error(res.data.msg)
      })
    },
    search () {
      this.getEnterpriseList()
    },
    getEnterpriseList () {
      let data = JSON.parse(JSON.stringify(this.searchData))
      for (let key in data) {
        if (data[key]) {
          if (key === 'startTime') {
            data[key] = this.concatDate(data[key], '00:00:00')
          } else if (key === 'endTime') {
            data[key] = this.concatDate(data[key], '23:59:59')
          }
        } else {
          delete data[key]
        }
      }
      this.midCenter = '查询中'
      this.fetch(`${this.enterpriseListUrl}${this.pageNo - 1}/${this.pageSize}`, 'post', data).then(data => {
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
    },
    forData (type, check) {
      for (let key in this.rateData[type]) {
        if (key === 'end' && check) return false
        if (!this.rateData[type][key]) return true
      }
      return false
    }
  },
  computed: {
    disRate () {
      return this.forData('buyFeeRate', this.buyChecked) || this.forData('depositFeeRate', this.dispositeChecked) || this.forData('withdrawFeeRate', this.withdrawChecked)
    }
  },
  watch: {
    'buyChecked' (val) {
      if (val) this.rateData.buyFeeRate.end = ''
    },
    'dispositeChecked' (val) {
      if (val) this.rateData.depositFeeRate.end = ''
    },
    'withdrawChecked' (val) {
      if (val) this.rateData.withdrawFeeRate.end = ''
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
.enterpriseManage /deep/ .el-dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  margin-top: 0 !important;
  margin-left: 108px;
}
.enterpriseManage/deep/ .el-input--suffix .el-input__inner {
  padding-right: 0;
}
.enterpriseManage /deep/ .el-checkbox__input.is-checked .el-checkbox__inner,
.enterpriseManage /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: @theme-blue;
  background-color: var(--mainColor);
  border-color: @theme-blue;
  border-color: var(--mainColor);
}
.enterpriseManage /deep/.el-checkbox__input.is-checked + .el-checkbox__label {
  color: @theme-blue;
  color: var(--mainColor);
}
.enterpriseManage /deep/.el-checkbox__input.is-focus .el-checkbox__inner,
.enterpriseManage /deep/.el-checkbox__inner:hover {
  border-color: @theme-blue;
  border-color: var(--mainColor);
}
.dotted {
  border-top: 1px dotted #575757;
  width: 457px;
  margin: 26px auto 26px;
  height: 1px;
}
.search-container {
  height: 45px;
  background-color: #fcfcfc;
  border: 1px solid #e6e6e6;
  margin: 25px 0 15px;
  box-sizing: border-box;
  padding-top: 8px;
  .el-select {
    width: 106px;
  }
  .el-input {
    width: 106px;
  }
  .client-name {
    display: inline-block;
    width: 200px;
  }
  .btn {
    float: right;
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
.ml30 {
  margin-left: 10px;
}
.password {
  width: 469px;
  margin: 0 auto;
  .prompt {
    text-align: center;
    font-size: 20px;
    margin-bottom: 30px;
  }
  .codeItem {
    margin-bottom: 20px;
    position: relative;
    font-size: 16px;
    .rateUnit {
      position: absolute;
      right: 282px;
      top: 14px;
    }
  }
  .pay-psd {
    display: inline-block;
    width: 102px;
    text-align: right;
  }
  .psd-input {
    width: 305px;
    height: 43px;
    border: 1px solid #e1e1e1;
    border-radius: 4px;
    margin: 0 14px 0 19px;
    background: #fcfcfc;
    padding-right: 7px;
    padding-left: 7px;
    color: @theme-blue;
    color: var(--mainColor);
    font-weight: bold;
  }
}
.dialog-footer {
  margin-bottom: 20px;
  margin-top: -20px;
  .confirm-btn {
    width: 211px;
    height: 50px;
    font-size: 18px;
  }
}
.list-container/deep/.el-table td,
.el-table th {
  text-align: center;
}
.list-container/deep/.el-table td .cell {
  padding: 0 5px;
}
.list-container/deep/.credit-table-color-blue tr {
  background-color: @table-bg;
  background-color: var(--mainTableBg) !important;
}
.list-container/deep/.credit-table-color-blue .el-table__body tr:hover > td {
  cursor: pointer;
  background-color: #fcefe0 !important;
}
.list-container/deep/.el-table .cell {
  text-align: center;
  padding-left: 0px;
  padding-right: 0px;
}
</style>
<style lang="less">
.cursor--disabled {
  cursor: not-allowed !important;
}
.cursor--pointer {
  cursor: pointer !important;
}
</style>
