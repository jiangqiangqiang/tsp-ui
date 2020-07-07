<template>
  <div class="payA">
    <BusinessTitle title="支付申请审核"></BusinessTitle>
    <div class="minpad">
      <BusinessFiltrate :filtrate="filtrate" :options="options" @getBusinessFiltrate="getBusinessFiltrate" roleType="收款企业">
    </BusinessFiltrate>
    <el-table :data="PayList" stripe border style="width: 100%" header-align='center' :empty-text='midCenter'
      class="PayList credit-table-color-blue sy-global-has-gutter__th--text-center sy-global-el-table-fit--border">
      <el-table-column prop="createdOn" label="发起时间" min-width="180">
      </el-table-column>
      <el-table-column prop="transactionNumber" label="交易编号" min-width="140" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="transactionAmount" label="支付金额" width="141">
        <template slot-scope="scope">
          <span>{{scope.row.transactionAmount | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="days" align="center" label="账期（天）">
      </el-table-column>
      <el-table-column prop="payerName" label="收款企业名称" min-width="240">
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span :style="scope.row.statusDesc==='拒绝支付' || scope.row.statusDesc==='审核未通过' ? 'color:rgba(206,42,42,1);':''">
            <el-tooltip class="item" effect="light" placement="right" v-if="scope.row.statusDesc==='待审核' || scope.row.statusDesc==='支付中'">
              <div slot="content">
                剩余{{cutTime[scope.row.transactionNumber] || 0 |setTimeHour}}时{{cutTime[scope.row.transactionNumber] || 0 | setTimeMinutes}}分{{cutTime[scope.row.transactionNumber] || 0 | setSecond}}秒
              </div>
              <svg-icon iconClass="zjf_lhfl_djs" className='wait_icon'></svg-icon>
            </el-tooltip>{{scope.row.statusDesc}}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="服务费">
        <template slot-scope="scope">
          <span
            v-if="scope.row.statusDesc==='待审核' || scope.row.statusDesc==='支付成功'">{{scope.row.fee | toThousands}}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <div v-if="scope.row.statusDesc=='待审核'">
            <!-- <div @click="handleAudit(scope.row)" class="skipBtn">审核</div> -->
            <Button class="toDeal" title="审核" @handleClick="handleAudit(scope.row)"></Button>
          </div>
          <div v-else-if="scope.row.statusDesc=='支付中'">
            <Button class="toDeal" title="继续支付" @handleClick="handleAudit(scope.row)"></Button>
          </div>
          <div v-else-if="scope.row.statusDesc=='待支付'">
            <div></div>
          </div>
          <div v-else>
            <div @click="checkTransaction(scope.row)" class="skipBtn">查看详情</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="sy-global--Pagination--bg" style="margin-bottom: 2rem" v-if="PayList.length>0">
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
    <el-dialog :visible.sync="succeedDialog" center width="568px" class="pay-table1" :close-on-click-modal="false"
      :close-on-press-escape="false">
      <div class="password">
        <p class="prompt fs20">验证手机号码</p>
        <div class="codeItem">
          <span class="pay-psd">联系人手机号</span>
          <input type="text" class="psd-input dis longW" :value="contractPhone" disabled />
        </div>
        <div class="codeItem" style="marginBottom:0;">
          <span class="pay-psd">短信验证码</span>
          <input type="text" class="psd-input smallW" v-model="smCode" placeholder="请输入短信验证码" autocomplete="new-password"
            autocapitalize="off" />
          <el-button class="verification-code" :disabled="!codeStatus" @click="getCode" :loading="codeLoading">
            {{codeStatus? (codeLoading ? '':'获取验证码') : `${codeTime}秒后获取`}}</el-button>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <Button class="confirm-btn" @handleClick="payOrder('Succeed')" :title="isLoading?'正在验证':'确定'"
          :disabled="!smCode" :isLoading="isLoading"></Button>
        <Button class="confirm-btn1" @handleClick="succeedDialog = false" title="取消"></Button>
      </div>
    </el-dialog>
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
      filtrate: {},
      succeedDialog: false,
      contractPhone: '',
      smCode: '',
      codeStatus: true,
      codeTime: 120,
      codeLoading: false,
      isLoading: false,
      time: null,
      options: [{
        value: 'PAYEE_ADM_SUCCEED',
        label: '待支付'
      },
      {
        value: 'SUCCEED',
        label: '支付成功'
      },
      {
        value: 'PAYER_OPE_REJECT',
        label: '拒绝支付'
      },
      {
        value: 'PAYER_OPE_SUCCEED',
        label: '待审核'
      },
      {
        value: 'PAYER_ADM_REJECT',
        label: '审核未通过'
      },
      {
        value: 'PAYER_ADM_CANCEL',
        label: '管理员驳回'
      },
      {
        value: 'PAY_TIME_OUT',
        label: '支付超时'
      },
      {
        value: 'PAYER_TIME_OUT',
        label: '申请超时'
      }],
      getPayListUrl: settings.apiGateway.getPayList,
      // 支付短信发送
      payMsgUrl: settings.apiGateway.payMsg,
      // 重新获取验证码
      reSendPayMsgUrl: settings.apiGateway.reSendPayMsg,
      // 获取联系人手机号
      getContractUrl: settings.apiGateway.getContractP,
      pageSize: 10,
      pageSizes: settings.pageSizes,
      pageNo: 1,
      midCenter: '暂无数据',
      totalCnt: 0,
      PayList: [],
      cutTime: {}
    }
  },
  methods: {
    getBusinessFiltrate (filtrate) {
      this.filtrate = filtrate
      this.getPayList()
    },
    pageChange (curPage) {
      this.pageNo = curPage
      this.getPayList()
    },
    sizeChange (pageSize) {
      this.pageSize = pageSize
      this.getPayList()
    },
    // 获取联系人手机号
    getContranct () {
      this.fetch(this.getContractUrl).then(data => {
        this.contractPhone = data.data
        this.succeedDialog = true
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    payOrder (status) {
      this.isLoading = true
      this.fetch(`${this.payMsgUrl}${this.transactionNumber}/${this.smCode}`, 'post').then(data => {
        this.isLoading = false
        this.$router.push({
          path: `/enterprise/pay-apply-authority/paySuccess`,
          query: {
            code: this.transactionNumber,
            amount: this.transactionAmount
          }
        })
      }).catch(data => {
        this.isLoading = false
        this.$message.error(data.data.data)
      })
    },
    // 请求验证码接口
    getCode () {
      this.codeLoading = true
      this.fetch(`${this.reSendPayMsgUrl}${this.transactionNumber}`, 'post').then(data => {
        this.codeLoading = false
        this.$message.success('发送成功,请注意查收!')
        this.codeCountDown()
      }).catch(data => {
        this.codeLoading = false
        this.$message.error(data.data.data)
      })
    },
    // 验证码倒计时
    codeCountDown () {
      this.codeStatus = false
      this.time = setTimeout(() => {
        this.codeTime--
        if (this.codeTime < 1) {
          this.codeStatus = true
          this.codeTime = 120
          clearTimeout(this.time)
        } else {
          this.codeCountDown()
        }
      }, 1000)
    },
    // 获取列表信息
    getPayList () {
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
          if (key === 'operator') {
            this.filterData.relatedPartyName = this.filterData[key]
            delete this.filterData[key]
            params += `relatedPartyName=${this.filterData.relatedPartyName}&`
          } else {
            params += `${key}=${this.filterData[key]}&`
          }
        }
        params = params.substring(0, params.length - 1)
      }
      if (this.filtrate.min) this.filtrate.min = this.toThousands(this.filtrate.min)
      if (this.filtrate.max) this.filtrate.max = this.toThousands(this.filtrate.max)
      this.midCenter = '查询中'
      this.fetch(`${this.getPayListUrl}${this.pageNo - 1}/${this.pageSize}${params}`).then(res => {
        this.PayList = res.data.list
        this.PayList.forEach(list => {
          if (list.statusDesc === '待审核' || list.statusDesc === '支付中') {
            this.$set(this.cutTime, list.transactionNumber, Math.ceil(list.remainTime / 1000))
            this.setTime(list.transactionNumber)
          }
        })
        this.totalCnt = res.data.totalCnt
        this.midCenter = '暂无数据'
      }).catch(data => {
        this.midCenter = '暂无数据'
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    setTime (transactionNumber) {
      let that = this
      let timer = setInterval(() => {
        if (that.cutTime[transactionNumber] > 0) {
          that.cutTime[transactionNumber]--
        }
        if (that.cutTime[transactionNumber] <= 0) {
          clearInterval(timer)
        }
      }, 1000)
    },
    // 产看交易详单
    checkTransaction (row) {
      this.$router.push({
        path: '/enterprise/payment-detail',
        query: { code: row.transactionNumber }
      })
    },
    // 查看审核页面
    handleAudit (row) {
      if (this.cutTime[row.transactionNumber] === 0) {
        let error = (row.statusDesc === '支付中') ? '申请已超时，已无法继续支付' : '申请已超时，已无法审核'
        this.$message.error(error)
        this.getPayList()
        return
      }
      if (row.statusDesc === '支付中') {
        this.transactionNumber = row.transactionNumber
        this.transactionAmount = row.transactionAmount
        this.getContranct()
        return
      }
      this.$router.push({
        path: '/enterprise/pay-apply-authority/detail',
        query: { code: row.transactionNumber }
      })
    }
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
  created () {
    this.getPayList()
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/less/variables';
.minpad {
  padding: 0 20px;
}
.PayList {
  margin-top: 20px;
  .skipBtn {
    cursor: pointer;
    text-align: center;
    height: 19px;
    margin: 0 auto;
    color: @theme-blue;
    color: var(--mainColor);
    text-decoration: underline;
  }
  .toDeal {
    width: 72px;
    height: 26px;
    letter-spacing: 0 !important;
    padding: 0 !important;
  }
}
.payA/deep/.el-table .cell {
  text-align: center;
  padding-left: 12px;
  padding-right: 12px;
}
.payA/deep/.el-table .cell {
  text-align: center;
}
.payA/deep/ .el-table th {
  padding-top: 7px;
  padding-bottom: 7px;
}
.payA/deep/.el-table td:nth-child(3) .cell, .payA/deep/.el-table td:nth-child(7) .cell {
  text-align: right;
}
.pay-table1 {
  align-items: center;
  .password {
    width: 100%;
  }
}
.password {
  width: 426px;
  margin: 0 auto;
  .prompt {
    text-align: center;
    font-size: 16px;
    margin-bottom: 30px;
  }
  .fs20 {
    font-size: 20px;
  }
  .codeItem {
    width: 420px;
    margin: 0 auto 20px;
    font-size: 0;
  }
  .dis {
    cursor: not-allowed;
    background-color: rgba(225, 225, 225, 1);
  }
  .longW {
    width: 267px;
    margin-right: 0;
  }
  .smallW {
    width: 143px;
  }
  .forget-psd {
    cursor: pointer;
    color: @theme-blue;
    color: var(--mainColor);
    text-decoration: underline;
  }
}
.psd-input {
  padding-left: 10px;
  width: 220px;
  height: 43px;
  font-size: 16px;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  margin: 0 14px 0 19px;
  background: #fcfcfc;
}
.pay-psd {
  display: inline-block;
  width: 112px;
  text-align: right;
  font-size: 16px;
  color: rgba(87, 87, 87, 1);
}
.verification-code {
  width: 111px;
  height: 45px;
  text-align: center;
  padding: 0;
  background-color: @theme-blue-light !important;
  background-color: var(--mainLightColor) !important;
  color: @theme-blue !important;
  color: var(--mainColor) !important;
  border-radius: 4px;
  border: 1px solid @theme-blue !important;
  border: 1px solid var(--mainColor) !important;
}
.verification-code:focus, .verification-code:hover {
  border-color: @theme-blue !important;
  border-color: var(--mainColor) !important;
  color: @theme-blue !important;
  color: var(--mainColor) !important;
  background-color: @theme-blue-light !important;
  background-color: var(--mainLightColor) !important;
}
.dialog-footer {
  margin-bottom: 20px;
  .confirm-btn, .confirm-btn1 {
    width: 211px;
    height: 50px;
    font-size: 18px;
  }
  .confirm-btn1, .confirm-btn1:hover {
    border: 1px solid @theme-blue;
    border: 1px solid var(--mainColor);
    color: @theme-blue;
    color: var(--mainColor);
    background-color: #fff;
  }
}
.PayList/deep/.el-button:hover{
  color: #ffffff;
  background-color: @btn-disabled;
  background-color: var(--mainColorDis);
  border: 0;
}
</style>

<style lang="less">
@import '~@/assets/less/variables';
.PayList.credit-table-color-blue tr {
  background-color: @table-bg;
  background-color: var(--mainTableBg) !important;
}
.PayList.credit-table-color-blue .el-table__body tr {
  &:nth-of-type(2n + 1):hover > td {
    background-color: #e3eef8 !important;
    background-color: var(--mainTableHover) !important;
  }
}
.wait_icon {
  vertical-align: middle;
  width: 1em;
  height: 1em;
  margin-top: -3px;
  margin-right: 6px;
}
</style>
