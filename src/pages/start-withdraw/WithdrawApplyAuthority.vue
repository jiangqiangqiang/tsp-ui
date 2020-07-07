
<template>
  <div class="withdrawApply">
    <BusinessTitle title="提现申请审核"></BusinessTitle>
    <div class="minpad">
      <BusinessFiltrate :filtrate="filtrate" :options="options" @getBusinessFiltrate="getBusinessFiltrate" roleType="操作员">
    </BusinessFiltrate>
    <el-table :data="withdrawList" stripe border style="width: 100%" header-align='center' :empty-text='midCenter'
      class="WithdrawList credit-table-color-blue sy-global-has-gutter__th--text-center sy-global-el-table-fit--border">
      <el-table-column prop="applicationTime" label="发起时间" min-width="180">
      </el-table-column>
      <el-table-column prop="transactionCode" label="交易编号" min-width="180" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="amount" label="提现金额">
        <template slot-scope="scope">
          <span>{{scope.row.amount | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="serviceFee" label="服务费">
        <template slot-scope="scope">
          <span>{{scope.row.serviceFee | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="operatorName" label="操作员">
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span>
            <el-tooltip class="item" effect="light" placement="right" v-if="scope.row.status==='待审核'">
              <div slot="content">
                剩余{{cutTime[scope.row.transactionCode] |setTimeHour}}时{{cutTime[scope.row.transactionCode] | setTimeMinutes}}分{{cutTime[scope.row.transactionCode] | setSecond}}秒
              </div>
              <svg-icon iconClass="zjf_lhfl_djs" className='wait_icon'></svg-icon>
            </el-tooltip>{{scope.row.status}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <div v-if="(scope.row.status)=='待审核'">
            <Button class="toDeal" title="审核" @handleClick="handleAudit(scope.row)"></Button>
            <!-- <div @click="handleAudit(scope.row)" class="skipBtn">审核</div> -->
          </div>
          <div v-else-if="(scope.row.status)=='提现中' && !scope.row.msgCode">
            <Button class="toDeal" title="继续验证" @handleClick="toCode(scope.row)"></Button>
          </div>
          <div v-else>
            <div @click="checkTransaction(scope.row)" class="skipBtn">查看详情</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="sy-global--Pagination--bg" style="margin-bottom: 2rem" v-if="withdrawList.length>0">
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
    <!-- 验证手机弹窗 -->
    <SmsCodeDialog :succeedDialog.sync="succeedDialog" :selectInfo="selectInfo"></SmsCodeDialog>
    <!-- <div>
      <el-dialog :visible.sync="succeedDialog" center width="568px" top="-134px" :close-on-click-modal="false"
        :close-on-press-escape="false">
        <div class="password">
          <p class="prompt">验证手机号</p>
          <div class="codeItem">
            <span class="pay-psd">联系人手机号</span>
            <input type="text" class="psd-input dis longW" :value="selectInfo.phone" disabled />
          </div>
          <div class="codeItem" style="marginBottom:19px;">
            <span class="pay-psd">短信验证码</span>
            <input type="text" class="psd-input" v-model="smCode" placeholder="请输入短信验证码" autocomplete="new-password"
              autocapitalize="off" />
            <el-button class="verification-code" :disabled="!codeStatus" @click="getCode" :loading="codeLoading">
              {{codeStatus? (codeLoading ? '':'获取验证码') : `${codeTime}秒后获取`}}</el-button>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <Button class="confirm-btn" @handleClick="withdrawOrder('Succeed')" :title="isLoading?'':'确定'"
            :disabled="!smCode" :isLoading="isLoading"></Button>
          <Button class="confirm-btn" @handleClick="succeedDialog = false" title="取消"></Button>
        </div>
      </el-dialog>
    </div> -->
  </div>
</template>

<script>
import BusinessTitle from '@/components/BusinessTitle'
import BusinessFiltrate from '@/components/BusinessFiltrate'
import SmsCodeDialog from '@/components/SmsCodeDialog'
import settings from '@/settings'
export default {
  components: {
    BusinessTitle,
    BusinessFiltrate,
    SmsCodeDialog
  },
  data () {
    return {
      succeedDialog: false,
      smCode: '',
      isLoading: false,
      codeLoading: false,
      codeStatus: true,
      codeTime: 120,
      time: null,
      selectInfo: {},
      filtrate: {},
      options: [{
        value: '待审核',
        label: '待审核'
      }, {
        value: '提现成功',
        label: '提现成功'
      }, {
        value: '提现失败',
        label: '提现失败'
      }, {
        value: '提现取消',
        label: '提现取消'
      }, {
        value: '申请超时',
        label: '申请超时'
      }, {
        value: '审核未通过',
        label: '审核未通过'
      }, {
        value: '提现中',
        label: '提现中'
      }],
      cutTime: {},
      pageSize: 10,
      pageSizes: settings.pageSizes,
      pageNo: 1,
      totalCnt: 0,
      withdrawList: [],
      midCenter: '暂无数据',
      role: '',
      getWithdrawListUrl: settings.apiGateway.getWithdrawList,
      // 提现短信发送
      withdrawMsgUrl: settings.apiGateway.withdrawMsg,
      // 重新获取验证码
      reSendwithdrawMsgUrl: settings.apiGateway.reSendwithdrawMsg
    }
  },
  methods: {
    getBusinessFiltrate (filtrate) {
      this.filtrate = filtrate
      this.getWithdrawList()
    },
    pageChange (curPage) {
      this.pageNo = curPage
      this.getWithdrawList()
    },
    sizeChange (pageSize) {
      this.pageSize = pageSize
      this.getWithdrawList()
    },
    // 获取列表信息
    getWithdrawList () {
      let flitrate = {
        startTime: this.filtrate.startTime,
        endTime: this.filtrate.endTime,
        min: this.filtrate.min,
        max: this.filtrate.max,
        transactionCode: this.filtrate.transactionCode,
        status: this.filtrate.transactionType
      }
      this.midCenter = '查询中'
      this.fetch(`${this.getWithdrawListUrl}${this.pageNo - 1}/${this.pageSize}`, 'post', flitrate).then(data => {
        this.withdrawList = data.data.transactions
        this.withdrawList.forEach(list => {
          if (list.status === '待审核') {
            this.$set(this.cutTime, list.transactionCode, Math.ceil(list.remainTime / 1000))
            this.setTime(list.transactionCode)
          }
        })
        this.totalCnt = data.data.totalCnt
        this.midCenter = '暂无数据'
      }).catch(data => {
        this.midCenter = '暂无数据'
        this.$message.error('数据获取失败')
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
    // 验证验证码
    toCode (row) {
      this.selectInfo = row
      this.succeedDialog = true
      this.smCode = ''
      clearTimeout(this.time)
      // this.codeCountDown()
    },
    // 验证码倒计时
    // codeCountDown () {
    //   this.codeStatus = false
    //   this.time = setTimeout(() => {
    //     this.codeTime--
    //     if (this.codeTime < 1) {
    //       this.codeStatus = true
    //       this.codeTime = 120
    //       clearTimeout(this.time)
    //     } else {
    //       this.codeCountDown()
    //     }
    //   }, 1000)
    // },
    // 请求验证码接口
    // getCode () {
    //   this.codeLoading = true
    //   this.fetch(`${this.reSendwithdrawMsgUrl}${this.selectInfo.withdrawId}`, 'post').then(data => {
    //     this.codeLoading = false
    //     this.$message.success('发送成功,请注意查收!')
    //     this.codeCountDown()
    //   }).catch(data => {
    //     this.codeLoading = false
    //     this.$message.error(data.data.data)
    //   })
    // },
    // withdrawOrder (status) {
    //   this.isLoading = true
    //   this.fetch(`${this.withdrawMsgUrl}${this.selectInfo.withdrawId}/${this.smCode}`, 'post').then(data => {
    //     this.isLoading = false
    //     this.$router.push({
    //       path: `/${this.role}/withdraw-apply-authority/withdrawSuccess`,
    //       query: {
    //         code: this.selectInfo.transactionCode,
    //         amount: this.selectInfo.amount
    //       }
    //     })
    //   }).catch(data => {
    //     this.isLoading = false
    //     this.$message.error(data.data.data)
    //   })
    // },
    // 产看交易详单
    checkTransaction (row) {
      this.$router.push({
        path: `/${this.role}/withdraw-detail`,
        query: { code: row.transactionCode, type: 'info' }
      })
    },
    // 查看审核页面
    handleAudit (row) {
      if (this.cutTime[row.transactionCode] === 0) {
        this.$message.error('申请已超时，已无法审核')
        this.getWithdrawList()
        return
      }
      this.$router.push({
        path: `/${this.role}/withdraw-apply-authority/detail`,
        query: { code: row.transactionCode }
      })
    }
  },
  created () {
    this.getWithdrawList()
    this.role = this.getUserRole()
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/less/variables';
.minpad {
  padding: 0 20px;
}
.WithdrawList {
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
}
.toDeal {
  width: 72px;
  height: 26px;
  letter-spacing: 0 !important;
  padding: 0 !important;
}
.wait_icon {
  width: 1em;
  height: 1em;
  vertical-align: middle;
  margin-top: -3px;
  margin-right: 6px;
}
.pay-psd {
  display: inline-block;
  width: 112px;
  text-align: right;
  font-size: 16px;
  // font-family: SimSun;
  color: rgba(87, 87, 87, 1);
}
.pay-psd1 {
  font-size: 16px;
  // font-family: SimSun;
  color: rgba(87, 87, 87, 1);
}
.psd-input {
  padding-left: 10px;
  width: 210px;
  height: 43px;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  margin: 0 5px 0 15px;
  background: #fcfcfc;
}
.widthPwd {
  width: 364px;
}
.forget-psd {
  cursor: pointer;
  font-size: 14px;
  // font-family: SimSun;
  text-decoration: underline;
  color: rgba(87, 87, 87, 1);
}
.password {
  width: 465px;
  margin: 0 auto;
  .prompt {
    text-align: center;
    font-size: 20px;
    color: rgba(87, 87, 87, 1);
    margin-bottom: 30px;
  }
  .codeItem {
    margin-bottom: 20px;
  }
  .dis {
    cursor: not-allowed;
    background-color: rgba(225, 225, 225, 1);
  }
  .longW {
    width: 316px;
    margin-right: 0;
  }
  .psd-phone {
    display: inline-block;
    padding-left: 19px;
    height: 43px;
    line-height: 43px;
  }
  .verification-code {
    width: 98px;
    height: 45px;
    padding-left: 12px;
    background-color: @theme-blue-light;
    background-color: var(--mainLightColor);
    color: @theme-blue;
    color: var(--mainColor);
    border-radius: 4px;
    border: 1px solid @theme-blue;
    border: 1px solid var(--mainColor);
  }
  .verification-code:focus {
    border-color: @theme-blue;
    border-color: var(--mainColor);
  }
}
.withdrawApply /deep/.el-select .el-input.is-focus .el-input__inner,
.withdrawApply /deep/.el-select .el-input__inner:focus {
  border-color: @theme-blue;
  border-color: var(--mainColor);
}
.withdrawApply/deep/.el-table .cell {
  text-align: center;
  padding-left: 12px;
  padding-right: 12px;
}
.withdrawApply/deep/ .el-table th {
  padding-top: 7px;
  padding-bottom: 7px;
}
.withdrawApply/deep/.el-table td:nth-child(3) .cell, .withdrawApply/deep/.el-table td:nth-child(4) .cell {
  text-align: right;
}
.dialog-footer {
  margin-bottom: 20px;
  .confirm-btn {
    width: 211px;
    height: 50px;
    font-size: 16px;
  }
}
.WithdrawList/deep/.el-button:hover{
  color: #ffffff;
  background-color: @btn-disabled;
  background-color: var(--mainColorDis);
  border: 0;
}
</style>

<style lang="less">
@import '~@/assets/less/variables';
.WithdrawList.el-table .cell {
  text-align: center;
}
.WithdrawList.credit-table-color-blue tr {
  background-color: @table-bg;
  background-color: var(--mainTableBg) !important;
}
.WithdrawList.credit-table-color-blue .el-table__body tr {
  &:nth-of-type(2n + 1):hover > td {
    background-color: @table-hover;
    background-color: var(--mainTableHover) !important;
  }
}
.withdrawApply .el-dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  margin-top: 0 !important;
  margin-left: 108px;
}
</style>
