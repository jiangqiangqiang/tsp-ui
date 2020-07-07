<template>
  <div class="top-up">
    <BusinessTitle title="提现"></BusinessTitle>
    <div class="minpad">
      <div>
      <Button icon="el-icon-plus" class="topUpBtn" @handleClick="checkPassword" title="发起提现"></Button>
    </div>
    <BusinessFiltrate :filtrate="filtrate" :options="options" @getBusinessFiltrate="getBusinessFiltrate">
    </BusinessFiltrate>
    <el-table :data="withdrawList" stripe border style="width: 100%" header-align='center' :empty-text='midCenter'
      class="withdrawList credit-table-color-blue sy-global-has-gutter__th--text-center sy-global-el-table-fit--border">
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
      <el-table-column prop="operatorName" label="操作员">
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span :style="scope.row.status==='提现失败' ? 'color:rgba(206,42,42,1);':''">
            <el-tooltip class="item" effect="light" placement="right" v-if="scope.row.status==='待审核'">
              <div slot="content">
                剩余{{cutTime[scope.row.transactionCode] |setTimeHour}}时{{cutTime[scope.row.transactionCode] | setTimeMinutes}}分{{cutTime[scope.row.transactionCode] | setSecond}}秒
              </div>
              <svg-icon iconClass="zjf_lhfl_djs" className='wait_icon'></svg-icon>
            </el-tooltip>{{scope.row.status}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <div v-if="(scope.row.status)=='提现中' && !scope.row.msgCode && role === 'allocator'">
            <div @click="toCode(scope.row)" class="skipBtn">继续验证</div>
          </div>
          <div class="skipBtn" v-else>
            <span @click="handleClick(scope.row)">查看详情</span>
            <span v-if="scope.row.status === '待审核'" @click="cancelWithdraw(scope.row)"
              style="marginLeft:8px;">取消申请</span>
          </div>
          <!-- <div v-if="scope.row.status === '待审核'" @click="cancelWithdraw(scope.row)" class="skipBtn">取消申请</div> -->
        </template>
        <!-- <template slot-scope="scope">
          <div @click="cancelWithdraw(scope.row)" class="skipBtn">取消申请</div>
        </template> -->
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
    <el-dialog :visible.sync="dialogCancelWithdraw" center width="568px" class="dialog">
      <div>
        <p class="prompt">是否取消提现申请</p>
        <div class="password">
          <table style="width:471px;marginBottom:-1px">
            <tr>
              <td>银行账户</td>
              <td :style="(withdrawDetail.dincountAmount > 0 && role!=='admin') ?'padding-top:2px':'padding-top:3px'">{{bankInfo.bankAccountCode | hideString}}
                <div class="bankImg"><img :src="selectSrc" alt="银行图标">
                  <span class="bankName">{{bankInfo.bankName}}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td>提现金额</td>
              <td>{{withdrawDetail.amount || 0 | toThousands}}</td>
            </tr>
            <tr v-if="role !== 'admin'">
              <td>服务费</td>
              <td>
                {{(withdrawDetail.amount - withdrawDetail.realAmount - withdrawDetail.dincountAmount + withdrawDetail.goldAmount) || 0 | toThousands}}
              </td>
            </tr>
            <tr v-else>
              <td>服务费</td>
              <td>{{withdrawDetail.withdrawFee || 0 | toThousands}}</td>
            </tr>
            <tr v-if="role !== 'admin' && withdrawDetail.dincountAmount > 0">
              <td>扣除优惠额度</td>
              <td>
                {{withdrawDetail.dincountAmount || 0 | toThousands}}
              </td>
            </tr>
            <tr>
              <td>实际到账金额</td>
              <td><span class="themeColor">{{withdrawDetail.realAmount || 0 | toThousands}}</span>
              <p class="cnfnot">{{withdrawDetail.realAmount || 0 | amountToChinese}}</p>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <Button class="confirm-btn" @handleClick="dialogCancelWithdraw = false" title="保留申请"></Button>
        <Button class="confirm-btn-cancel" @handleClick="confirmCancle" title="取消申请"></Button>
      </div>
    </el-dialog>
    <!-- 验证手机弹窗 -->
    <div>
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
          <Button class="confirm-btn" @handleClick="withdrawOrder('Succeed')" :title="isLoading?'正在验证':'确定'"
            :disabled="!smCode" :isLoading="isLoading"></Button>
          <Button class="confirm-btn" @handleClick="succeedDialog = false" title="取消"></Button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import BusinessTitle from '@/components/BusinessTitle'
import BusinessFiltrate from '@/components/BusinessFiltrate'
import settings from '@/settings'
import BankTypes from '@/services/BankType'
export default {
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
      pageSize: 10,
      pageSizes: settings.pageSizes,
      pageNo: 1,
      totalCnt: 0,
      filtrate: {},
      cutTime: {},
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
        value: '申请超时',
        label: '申请超时'
      }, {
        value: '审核未通过',
        label: '审核未通过'
      }, {
        value: '提现取消',
        label: '提现取消'
      }, {
        value: '提现中',
        label: '提现中'
      }],
      withdrawList: [],
      midCenter: '暂无数据',
      role: '',
      getWithdrawListUrl: settings.apiGateway.getWithdrawList,
      getBankListUrl: settings.apiGateway.getBankList,
      checkIsSetPayPasswordUrl: settings.apiGateway.checkIsSetPayPassword,
      checkTransactionUrl: settings.apiGateway.checkTransaction,
      // 提现详情
      withdrawInfoUrl: settings.apiGateway.withdrawInfo,
      // 取消提现申请接口
      withdrawCancelUrl: settings.apiGateway.withdrawCancel,
      // 提现短信发送
      withdrawMsgUrl: settings.apiGateway.withdrawMsg,
      // 重新获取验证码
      reSendwithdrawMsgUrl: settings.apiGateway.reSendwithdrawMsg,
      dialogCancelWithdraw: false,
      withdrawNumber: '',
      withdrawDetail: {},
      bankInfo: {},
      transactionCode: '',
      hasBank: false,
      hasPassword: false,
      selectSrc: ''
    }
  },
  components: {
    BusinessTitle,
    BusinessFiltrate
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
    sizeChange (curSize) {
      this.pageSize = curSize
      this.getWithdrawList()
    },
    confirmCancle () {
      this.fetch(`${this.withdrawCancelUrl}?txId=${this.transactionCode}&&status=Cancel`).then(data => {
        this.$message({
          type: 'success',
          message: '已取消支付申请'
        })
        this.dialogCancelWithdraw = false
        this.getWithdrawList()
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    // 验证验证码
    toCode (row) {
      this.succeedDialog = true
      this.smCode = ''
      clearTimeout(this.time)
      // this.codeTime = 120
      // this.codeCountDown()
      this.selectInfo = row
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
    // 请求验证码接口
    getCode () {
      this.codeLoading = true
      this.fetch(`${this.reSendwithdrawMsgUrl}${this.selectInfo.withdrawId}`, 'post').then(data => {
        this.codeLoading = false
        this.$message.success('发送成功,请注意查收!')
        this.codeCountDown()
      }).catch(data => {
        this.codeLoading = false
        this.$message.error(data.data.data)
      })
    },
    withdrawOrder (status) {
      this.isLoading = true
      this.fetch(`${this.withdrawMsgUrl}${this.selectInfo.withdrawId}/${this.smCode}`, 'post').then(data => {
        this.isLoading = false
        this.$router.push({
          path: `/${this.role}/withdraw-success`,
          query: {
            code: this.selectInfo.transactionCode,
            amount: this.selectInfo.amount
          }
        })
      }).catch(data => {
        this.isLoading = false
        this.$message.error(data.data.data)
      })
    },
    cancelWithdraw (row) {
      if (this.cutTime[row.transactionCode] === 0) {
        this.$message.error('订单状态已更新，无法进行此操作')
        this.getWithdrawList()
        return
      }
      this.transactionCode = row.transactionCode
      this.getWithdrawDetail()
      this.dialogCancelWithdraw = true
    },
    getWithdrawDetail () {
      this.fetch(`${this.withdrawInfoUrl}/${this.transactionCode}`).then(data => {
        this.withdrawDetail = data.data
      }).catch(data => {
        this.$message.error(data.data.msg)
      })
    },
    getBankList () {
      // 是否添加银行账户
      this.fetch(this.getBankListUrl).then(data => {
        this.hasBank = true
        if (data.data.length === 0) {
          this.hasBank = false
        } else {
          this.bankInfo = data.data.filter((item) => {
            return item.use
          })[0]
          this.selectSrc = '' + BankTypes[this.bankInfo.bankCode] || ''
        }
      }).catch(res => {
        this.$message.error(res.data.msg)
      })
    },
    checkPassword () {
      // 请求是否设置支付密码
      this.fetch(this.checkIsSetPayPasswordUrl).then(data => {
        let hasPassword = data.data.exist
        this.$router.push({
          path: `/${this.role}/withdraw`,
          query: {
            hasBank: this.hasBank,
            hasPassword
          }
        })
      }).catch(res => {
        this.$message.error(res.data.msg)
      })
    },
    getWithdrawList () {
      let flitrate = {
        startTime: this.filtrate.startTime,
        endTime: this.filtrate.endTime,
        min: this.filtrate.min,
        max: this.filtrate.max,
        transactionCode: this.filtrate.transactionCode,
        status: this.filtrate.transactionType,
        operator: this.filtrate.operator
      }
      if (this.filtrate.min) this.filtrate.min = this.toThousands(this.filtrate.min)
      if (this.filtrate.max) this.filtrate.max = this.toThousands(this.filtrate.max)
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
    handleClick (row) {
      this.$router.push({
        path: `/${this.role}/withdraw-detail`,
        query: {
          code: row.transactionCode
        }
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
    }
  },
  created () {
    this.role = this.getUserRole()
    this.getWithdrawList()
    this.getBankList()
  },
  watch: {
    role (val) {
      if (val === 'allocator' || val === 'admin') this.options = [{ value: '提现中', label: '提现中' }, { value: '银行驳回', label: '银行驳回' }, { value: '提现成功', label: '提现成功' }, { value: '提现失败', label: '提现失败' }, { value: '申请超时', label: '申请超时' }]
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/less/variables';
.pay-psd {
  display: inline-block;
  width: 112px;
  text-align: right;
  font-size: 16px;
  // font-family: SimSun;
  color: rgba(87, 87, 87, 1);
}
.minpad {
  padding: 0 20px;
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
.cnfnot {
  font-size: 13px;
  line-height: 20px;
}
.forget-psd {
  cursor: pointer;
  font-size: 14px;
  // font-family: SimSun;
  text-decoration: underline;
  color: rgba(87, 87, 87, 1);
}
.prompt {
  text-align: center;
  font-size: 20px;
  color: rgba(87, 87, 87, 1);
  margin-bottom: 30px;
}
.password {
  width: 465px;
  margin: 20px auto 0;
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
.themeColor {
  font-size: 16px;
  font-weight: bold;
  color: @theme-blue !important;
  color: var(--mainColor) !important;
}
.dialog-footer {
  margin-bottom: 20px;
  .confirm-btn {
    width: 211px;
    height: 50px;
    font-size: 16px;
  }
}
table {
  width: 600px;
  margin: 0 auto;
  .amountColor {
    font-size: 16px;
    font-family: ArialMT;
    font-weight: bold;
    color: @theme-blue;
    color: var(--mainColor);
  }
  tr {
    td {
      height: 40px;
      line-height: 40px;
      border: 1px solid #e6e6e6;
      position: relative;
      .bankImg {
        position: absolute;
        top: 5px;
        right: 5px;
      }
      img {
        height: 25px;
      }
    }
    .bankName {
      font-size: 14px;
      font-weight: bold;
      color: rgba(101, 101, 101, 1);
    }
    td:first-child {
      width: 120px;
      text-align: center;
      padding: 0 15px;
      background-color: #FAFAFA;
    }
    td:last-child {
      text-align: left;
      padding-left: 20px;
      line-height: 30px;
    }
  }
  tr:last-child {
    height: 63px;
  }
  tr:last-child td {
    background-color: @theme-blue-light;
    background-color: var(--mainLightColor);
  }
}
.top-title {
  width: 100%;
  height: 76px;
  line-height: 76px;
  text-align: center;
  color: #333333;
  font-size: 22px;
  background-color: #f2f9ff;
  letter-spacing: 15px;
  padding-left: 15px;
}
.topUpBtn {
  width: 163px;
  height: 41px;
  margin: 22px 0 0 25px;
  border-radius: 5px;
  box-shadow: 1px 6px 4px @btn-disabled;
  box-shadow: 1px 6px 4px var(--mainTableHover);
  border: none;
  color: #fff;
}
.topUpBtnDisabled {
  width: 163px;
  height: 41px;
  margin: 22px 0 0 25px;
  border-radius: 5px;
  color: #fff;
  border: none;
  box-shadow: 1px 6px 4px @btn-disabled;
  box-shadow: 1px 6px 4px var(--mainTableHover);
  background-color: var(--mainColorDis) !important;
}
.topUpBtnDisabled:hover {
  background-color: var(--mainColorDis) !important;
}
.skipBtn {
  text-align: center;
  height: 19px;
  margin: 0 auto;
  color: @theme-blue;
  color: var(--mainColor);
  text-decoration: underline;
  cursor: pointer;
}
.withdrawList {
  margin-top: 20px;
}
.top-up/deep/.el-table .cell {
  text-align: center;
}
.top-up/deep/.credit-table-color-blue tr {
  background-color: @table-bg;
  background-color: var(--mainTableBg) !important;
}
.top-up/deep/.credit-table-color-blue .el-table__body tr {
  &:nth-of-type(2n + 1):hover > td {
    background-color: @table-hover;
    background-color: var(--mainTableHover) !important;
  }
}
.top-up /deep/.el-dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  margin-top: 0 !important;
  margin-left: 108px;
}
.top-up /deep/.el-select .el-input.is-focus .el-input__inner, .top-up /deep/.el-select .el-input__inner:focus {
  border-color: @theme-blue;
  border-color: var(--mainColor);
}
.select-btn, .top-up /deep/.el-select-dropdown__item.selected {
  color: @theme-blue;
  color: var(--mainColor);
}
.top-up/deep/.el-table .cell {
  text-align: center;
  padding-left: 12px;
  padding-right: 12px;
}
.top-up/deep/.el-table td:nth-child(3) .cell, .top-up/deep/.el-table td:nth-child(4) .cell {
  text-align: right;
}
.top-up/deep/ .el-table th {
  padding-top: 7px;
  padding-bottom: 7px;
}
.wait_icon {
  width: 1em;
  height: 1em;
  vertical-align: middle;
  margin-top: -3px;
  margin-right: 6px;
}
.dialog-footer {
  margin-bottom: 20px;
  margin-top: -10px;
  .el-button {
    border-radius: 5px;
    padding: 15px 68.5px;
    font-size: 18px;
  }
  .confirm-btn {
    background-color: @theme-blue;
    background-color: var(--mainColor);
  }
  .confirm-btn-cancel {
    background-color: #fff;
    color: @theme-blue;
    color: var(--mainColor);
  }
}
</style>
