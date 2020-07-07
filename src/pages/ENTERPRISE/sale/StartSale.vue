<template>
  <div class="startSale">
    <BusinessTitle title="出售支付令" isShowBack></BusinessTitle>
    <div class="scheduleContent">
      <div class="buyTableTitle">出售信息<span style="float:right;color:rgba(101,101,101,.5);fontSize:14px">注：报价不得高于折合现金</span></div>
      <div class="dotted"></div>
      <!-- 出售支付令设置 -->
      <div class="functionLis">
        <div class="funLable">出售支付令</div>
        <div class="funItem">
          <Button title="请选择支付令" class="buyConfirm amount-input1" @handleClick="chooseBalance"></Button>
          <!-- <el-input maxlength="20" placeholder="请输入出售支付令" class="amount-input" v-model="amount"
            @focus="CountersignAmount" @blur="dataLayout" @change='checkAmount'></el-input> -->
        </div>
        <!-- <div class="isShowDetail" @click="isShowDetail=!isShowDetail">{{isShowDetail?'收起详情':'展开详情'}}
          <i :class="!isShowDetail?'el-icon-caret-bottom':'el-icon-caret-top'"></i>
          <span style="color:#ABABAB;marginLeft:7px">|</span>
        </div> -->
        <!-- <div class="saleBalance">
          <span style="color:#ABABAB">可出售余额&nbsp;</span>
          <span class="mainColor" style="fontSize:14px">{{sellTotalAmount || 0 | toThousands}}</span>
          <el-tooltip class="item" effect="light" placement="right">
            <div slot="content" style="lineHeight:20px">
              不能出售的包括：被冻结的支付令，通过充值得到的支付令，
              <br />
              通过出售转换得到的支付令。
            </div>
            <i class="el-icon-question goldHelp"></i>
          </el-tooltip>
        </div> -->
      </div>
      <table border>
          <tr >
            <td>出售支付令</td>
            <td colspan="3">{{getTotalFee.sellAmount || 0 | toThousands}}</td>
          </tr>
          <tr style="height:63px">
            <td class="mainBgColor">折合现金</td>
            <td colspan="3" class="mainBgColor"><span class="mainColor">{{getTotalFee.cashBalance || 0 | toThousands}}</span>
              <p class="cnfnot">{{getTotalFee.cashBalance | amountToChinese}}</p>
            </td>
          </tr>
        </table>
      <!-- 报价 -->
      <div class="functionLis bottom0">
        <div class="funLable">报 &nbsp;价&nbsp;&nbsp;&nbsp;按折扣率</div>
        <div class="funItem centerText">
          <!-- <el-radio v-model="radio" label="rate" @change="rateChange">按折扣率</el-radio> -->
          <span>
            <el-input class="rate-input" v-model="rateNum" @focus="CountersignRate" @blur="rateBlur"
              @change='checkRate'></el-input> %<span class="error-warning" v-if="warningText"><i class="el-icon-error"></i>&nbsp;&nbsp;{{warningText}}</span>
          </span>
        </div>
        <div class="funLable1">
          折合金额
          <span class="mainColor">{{getTotalFee.cashBalance * rateNum/100 || 0 | toThousands}}</span> 元
        </div>
      </div>
      <!-- 金额明细 -->
      <div class="buyTableTitle">金额明细</div>
      <div class="dotted"></div>
      <table border>
          <tr>
            <td>报价</td>
            <td colspan="3">{{getTotalFee.cashBalance * rateNum/100 || 0 | toThousands}}</td>
          </tr>
          <tr>
            <td>服务费</td>
            <td colspan="3">{{serviceFee || 0 | toThousands}}</td>
          </tr>
          <tr style="height:63px">
            <td class="mainBgColor">实际到账金额</td>
            <td colspan="3" class="mainBgColor"><span class="mainColor">{{finalAmount | toThousands}}</span>
              <p class="cnfnot">{{finalAmount | amountToChinese}}</p>
            </td>
          </tr>
        </table>
      <!-- 更多设置 -->
      <div class="buyTableTitle">更多设置</div>
      <div class="dotted"></div>
      <!-- <div class="functionLis">
        <div class="funLable"></div>
        <div class="funItem centerText">
          <el-radio v-model="radio" label="sum" @change="rateChange">按金额</el-radio>
          <span v-if="radio==='sum'">
            <el-input class="rate-input" v-model="sumNum" @focus="CountersignRate" @blur="sumBlur" @change='checkSum'>
            </el-input> 元 ,折合折扣率
            <span
              class="mainColor">{{(amount?sumNum.toString().replace(/,/g,''):0)/amount.toString().replace(/,/g,'')*100 || 0 | toFix}}
              %</span>
          </span>
        </div>
      </div> -->
      <!-- 出售截止时间 -->
      <div class="functionLis">
        <div class="funLable">自动下架
          <div class="saleBalance">
            <el-tooltip class="item" effect="light" placement="right">
              <div slot="content" style="lineHeight:20px">
                出售截止日期表示，这笔交易如果到了截止日期仍未出售成功,
                <br /> 将自动撤销交易。
              </div>
              <i class="el-icon-question goldHelp"></i>
            </el-tooltip>
          </div>
        </div>
        <div class="funItem">
          <el-date-picker v-model="endTime" type="date" :editable="false" placeholder="请选择自动下架时间" class="amount-input"
            value-format="timestamp" :picker-options="pickerBeginDateBefore"
            @change="dateChange">
          </el-date-picker>
        </div>
      </div>
      <div class="functionLis">
        <div class="funLable mrn">备注信息</div>
        <div class="funItem">
          <el-input type="text" maxlength='20' class="remark-input" v-model="remark" placeholder="请输入备注信息(仅我方可见)"
            autocomplete="username"></el-input>
          <span style="color:rgba(87, 87, 87, 0.5);">20个字</span>
          <input type="text" style="width:0;height:0;">
        </div>
      </div>
       <div class="warning-box">
        <div class="warning-text">
          <i class="el-icon-warning"></i>
          <span> 提示：交易成功后，出售的支付令将立即转换为不计持有期的等量支付令，可随时提现。</span><br>
        </div>
      </div>
      <div class="btnConfirm">
        <Button title="提交出售申请" class="buyConfirm" @handleClick="confirmSale" :disabled="btnSubDisabled"></Button>
        <Button title="取   消" class="buyCancel" @handleClick="cancelSale"></Button>
      </div>
    </div>
    <el-dialog :visible.sync="dialogSale" center width="568px" :before-close="beforePwdClose" class="pay-table1">
      <div class="password">
        <p class="prompt">验证支付密码</p>
        <span class="pay-psd" style="marginLeft:40px">支付密码</span>
        <input type="password" class="psd-input" v-model="payPassword" placeholder="请输入支付密码"
          autocomplete="new-password">
        <span class="forget-psd" @click="dialogVisible=true">忘记支付密码?</span>
      </div>
      <div style="margin: 10px 0 0 0;textAlign:center;color:#DB6363" v-if="errText">{{errText}}</div>
      <div slot="footer" class="dialog-footer">
        <Button class="confirm-btn" @handleClick="SaleOrder" title="确定" :disabled="payPsd"></Button>
        <Button class="confirm-btn1" @handleClick="dialogSale = false" title="取消"></Button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="bankVisible" :before-close="handleDialogClose" center width="480px" class="pay-table1">
      <p class="hint">您还没有设置收款账户，请先设置银行账户</p>
      <div slot="footer" class="dialog-footer">
        <Button class="confirm-btn" style="margin-top: -60px;" @handleClick="setBank" title="设置银行账户"></Button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="isConfirm" center width="480px" class="pay-table1">
      <p class="hint" style="marginBottom:-1px">您确认要出售这批令吗？</p>
      <div slot="footer" class="dialog-footer">
        <Button class="confirm-btn" @handleClick="confirmToPwd" title="确定"></Button>
        <Button class="confirm-btn1" @handleClick="isConfirm = false" title="取消"></Button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="finalLimit" center width="568px"  class="pay-table1">
      <div class="password" style="width:457px">
        <p class="helpTitle1 mb30">系统提示</p>
        <p class="helpLine1">按照三方支付平台的限额要求，您此次出售申请的服务</p>
        <p class="helpLine1">费/返还垫资/折扣金额过大，无法提交出售申请，请重新</p>
        <p class="helpLine1">选择出售方案。</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <Button class="confirm-btn bigW" @handleClick="finalLimit = false" title="确 定"></Button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogDetail" center width="867px" class="pay-table1">
      <div class="password">
        <p class="prompt" style="marginBottom:30px">请选择要出售的支付令及出售额度</p>
        <el-table :data="balanceDetail" stripe border style="width: 100%;marginTop:32px" header-align='center'
        class="credit-table-color-blue sy-global-has-gutter__th--text-center sy-global-el-table-fit--border">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="tokenAmount" label="支付令额度">
          <template slot-scope="scope">
            {{scope.row.tokenAmount | toThousands}}
          </template>
        </el-table-column>
        <el-table-column prop="cashBalance" label="折合现金（￥）">
          <template slot-scope="scope">
            {{scope.row.cashBalance | toThousands}}
          </template>
        </el-table-column>
        <el-table-column  label="支付令时间">
          <el-table-column prop="endTime" label="提现日期"></el-table-column>
          <el-table-column prop="holdDays" label="已持有天数"></el-table-column>
          <el-table-column prop="surplusDays" label="剩余天数"></el-table-column>
        </el-table-column>
        <el-table-column prop="rate" label="折现利率">
          <template slot-scope="scope">
            {{scope.row.rate/10000}}%
          </template>
        </el-table-column>
        <el-table-column label="出售支付令">
          <el-table-column prop="amount" label="出售令额度">
            <template slot-scope="scope">
                <el-input placeholder="请输入额度" class="amount-input2" v-model="scope.row.num"  @blur='checkAmount1(scope)'></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="折合现金">
            <template slot-scope="scope">
              {{sellCashObj[scope.row.id] || '' | toThousands}}
            </template>
          </el-table-column>
        </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer winthMid">
          <Button class="buyConfirm confirm-btn2" @handleClick="confirmToPwd1" title="确定"></Button>
          <Button class="buyCancel confirm-btn2" @handleClick="dialogDetail = false" title="取消"></Button>
        </div>
      </div>
    </el-dialog>
    <ForgetPasswordPop :dialogVisible="dialogVisible" @handleClose="dialogVisible=false"></ForgetPasswordPop>
    <NOPayPassword :setPsdVisible="!hasPassword" @handleClose="handleClose"></NOPayPassword>
  </div>
</template>

<script>
import BusinessTitle from '@/components/BusinessTitle'
import ForgetPasswordPop from '@/components/ForgetPasswordPop'
import NOPayPassword from '@/components/NOPayPassword'
import Calendar from '@/components/Calendar'
import settings from '@/settings'
import BankTypes from '@/services/BankType'
export default {
  components: {
    BusinessTitle,
    ForgetPasswordPop,
    NOPayPassword,
    Calendar
  },
  data () {
    return {
      listData: [],
      balanceDetail: [],
      amount: 0,
      remark: '',
      errText: '',
      warningText: '',
      dialogDetail: false,
      finalLimit: false,
      isShowDetail: false,
      dialogVisible: false,
      bankVisible: false,
      hasPassword: false,
      dialogSale: false,
      isConfirm: false,
      payPassword: '',
      // 获取可用余额列表
      getAvailableSellUrl: settings.apiGateway.getAvailableSell,
      // 获取可用余额总额
      getSellTotalUrl: settings.apiGateway.getSellTotal,
      // 订单提交审核
      sellerOrderUrl: settings.apiGateway.sellerOrder,
      // 根据截至日期算出服务费
      getTimeFeeUrl: settings.apiGateway.getTimeFee,
      // 根据勾选计算折合现金
      calculateCashUrl: settings.apiGateway.calculateCash,
      checkSellAmountUrl: settings.apiGateway.checkSellAmount,
      datePickerShow: false,
      feeProps: {},
      getBankListUrl: settings.apiGateway.getBankList,
      endTime: '',
      endTimeStrap: '',
      sellDays: '',
      radio: 'rate',
      rateNum: this.$route.query.rate * 10000 / 100 || 0,
      sumNum: 0,
      sellTotalAmount: 0,
      serviceFee: 0,
      selectedBank: {},
      valiableData: {},
      sellList: [],
      sellCashObj: {},
      pickerBeginDateBefore: {
        disabledDate: (time) => {
          return time.getTime() <= (new Date()).getTime()
        }
      },
      // 后台需要账期列表数据 addr为属性名 balance为属性值
      recode: {},
      selectSrc: ''
    }
  },
  methods: {
    handleClose () {
      this.hasPassword = false
      this.$message.error('请先设置支付密码')
    },
    handleDialogClose () {
      this.bankVisible = true
      this.$message.error('请先设置银行账户')
    },
    beforePwdClose () {
      this.dialogSale = false
      this.payPassword = ''
    },
    setBank () {
      this.$router.push('/enterprise/bank-list')
    },
    // rateChange (rate) {
    //   if (rate === 'rate') {
    //     this.sumNum = 0
    //   } else {
    //     this.rateNum = 0
    //   }
    // },
    chooseBalance () {
      this.dialogDetail = true
      // this.checkDetail()
    },
    // checkDetail () {
    //   this.balanceDetail = [
    //     { amount: 12002, date: '2019-12-12', days: 50, rate: 0.04, real: 10000, remark: '充值所得' },
    //     { amount: 12002, date: '2019-12-12', days: 50, rate: 0.04, real: 10000, remark: '充值所得' },
    //     { amount: 12002, date: '2019-12-12', days: 50, rate: 0.04, real: 10000, remark: '充值所得' },
    //     { amount: 12002, date: '2019-12-12', days: 50, rate: 0.04, real: 10000, remark: '充值所得' }
    //   ]
    //   this.dialogDetail = true
    // },
    CountersignAmount () {
      if (this.amount <= 0) {
        this.amount = ''
      } else if (this.amount) {
        this.amount = this.amount.toString().replace(/,/g, '')
      }
    },
    checkAmount (val) {
      let reg = /[^\d,.]/g
      if (reg.test(val.toString())) {
        this.amount = this.amount.replace(reg, ($1) => {
          return ''
        })
      }
    },
    checkAmount1 (scope) {
      if (scope.row.num > scope.row.tokenAmount) {
        this.$set(this.sellCashObj, scope.row.id, '')
        this.$message.error('出售令额度不能大于支付令额度')
        return
      }
      if (!scope.row.num) {
        this.$set(this.sellCashObj, scope.row.id, '')
        this.sellList = this.sellList.filter((item) => {
          return item.id !== scope.row.id
        })
        console.log(this.sellList, this.sellCashObj)
        return
      }
      if (isNaN(parseFloat(scope.row.num))) {
        this.$set(this.sellCashObj, scope.row.id, '')
        this.$message.error('请正确输入出售令额度')
        return
      }
      let recode = [{
        id: scope.row.id,
        sellAmount: scope.row.num.toString().replace(/,/g, '')
      }]
      this.fetch(`${this.calculateCashUrl}`, 'post', recode).then(data => {
        for (let index = 0; index < this.sellList.length; index++) {
          let item = this.sellList[index]
          if (item.id === scope.row.id) {
            this.sellList[index].sellAmount = scope.row.num
            this.sellList[index].cashBalance = data.data.cashBalance
            // this.sellList[index].serviceFee = data.data.serviceFee
            this.$set(this.sellList, index, this.sellList[index])
            this.$set(this.sellCashObj, scope.row.id, data.data.cashBalance)
            console.log(this.sellCashObj)
            return
          }
        }
        this.sellList.push({
          id: scope.row.id,
          sellAmount: scope.row.num,
          cashBalance: data.data.cashBalance
          // serviceFee: data.data.serviceFee
        })
        this.$set(this.sellCashObj, scope.row.id, data.data.cashBalance)
        // this.sellCashObj[scope.row.id] = data.data.cashBalance
        console.log(this.sellCashObj)
      }).catch(data => {
        this.$message.error(data.data.msg)
      })
    },
    checkRate (val) {
      let reg = /[^\d,.]/g
      if (reg.test(val.toString())) {
        this.rateNum = this.rateNum.replace(reg, ($1) => {
          return ''
        })
      }
    },
    // checkSum (val) {
    //   let reg = /[^0-9.]/ig
    //   if (reg.test(val.toString())) {
    //     this.sumNum = this.sumNum.replace(reg, ($1) => {
    //       return ''
    //     })
    //   }
    // },
    dateChange (val) {
      this.endTimeStrap = val
    },
    confirmToPwd () {
      this.dialogSale = true
      this.errText = ''
      this.isConfirm = false
    },
    confirmToPwd1 () {
      let sellList = JSON.parse(this.sumSellList())
      this.fetch(`${this.calculateCashUrl}`, 'post', sellList).then(data => {
        this.serviceFee = data.data.serviceFee
        this.sellDays = data.data.sellDays
        this.pickerBeginDateBefore = {
          disabledDate: (time) => {
            return time.getTime() <= (new Date()).getTime() || time.getTime() > (new Date(this.sellDays)).getTime()
          }
        }
        this.dialogDetail = false
      }).catch(data => {
        this.$message.error(data.data.msg)
      })
    },
    CountersignRate () {
      console.log(this.rateNum)
      if (this.rateNum <= 0) {
        this.rateNum = ''
      }
    },
    // dataLayout () {
    //   if (this.amount > this.sellTotalAmount) {
    //     this.$message.error('出售支付令不能大于可出售余额')
    //     return
    //   }
    //   this.amount = this.toThousands(parseFloat(this.amount))
    //   if (!this.amount) return
    //   this.getAvailableSell()
    // },
    // sumBlur () {
    //   if (!this.amount) {
    //     this.$message.error('请输入出售支付令')
    //   } else if (parseFloat(this.sumNum.toString().replace(/,/g, '')) > parseFloat(this.amount.toString().replace(/,/g, ''))) {
    //     this.$message.error('报价金额不能大于出售支付令')
    //   }
    //   this.sumNum = this.toThousands(this.sumNum)
    // },
    rateBlur () {
      if (!this.getTotalFee.sellAmount) {
        this.warningText = '请选择出售支付令'
      } else if (this.rateNum > 100) {
        this.warningText = '折扣率不能大于100%'
      } else {
        this.warningText = null
      }
    },
    getDateFee () {
      let amount = parseFloat(this.amount.toString().replace(/,/g, '')) + ''
      if (!amount) return this.$message.error('请输入出售令额')
      if (!this.endTimeStrap) return this.$message.error('请选择出售截至日期')
      this.fetch(`${this.getTimeFeeUrl}?amount=${amount}&deadline=${this.endTimeStrap}`).then(data => {
        this.feeProps = data.data
        this.datePickerShow = true
      }).catch(data => {
        this.$message.error(data.data.msg)
      })
    },
    closeFee () {
      this.datePickerShow = false
    },
    confirmSale () {
      this.checkSellAmount()
      // this.isConfirm = true
    },
    cancelSale () {
      this.$router.push('/enterprise/sale-list')
    },
    sumSellList () {
      let sellList = JSON.parse(JSON.stringify(this.sellList))
      sellList.forEach((item, index) => {
        delete sellList[index].cashBalance
        // delete sellList[index].serviceFee
      })
      sellList = JSON.stringify(sellList)
      return sellList
    },
    // 订单携带密码提交
    SaleOrder () {
      // let amount = parseFloat(this.amount.toString().replace(/,/g, ''))
      let sellList = this.sumSellList()
      let data = {
        sellAmount: this.getTotalFee.sellAmount,
        passWord: this.payPassword,
        endTime: this.endTimeStrap,
        recode: sellList,
        discountRate: parseFloat(parseFloat(this.rateNum * 100 / 10000).toFixed(4)),
        // serviceAmount: this.valiableData.serviceAmount,
        // discountAmount: this.comAmount,
        remark: this.remark
      }
      if (this.$route.query.id) data.sellOrderId = this.$route.query.id
      // if (this.radio === 'rate') {
      //   data.discountRate = this.rateNum * 100 / 10000
      //   data.discountRate = parseFloat(parseFloat(data.discountRate).toFixed(4))
      // }
      this.fetch(`${this.sellerOrderUrl}`, 'post', data).then(data => {
        this.popUpSuccess({
          text: '卖令申请已提交至管理员',
          okBtn: '确定',
          ok: () => {
            this.goBack()
          }
        })
      }).catch(data => {
        this.errText = data.data.msg
        // this.$message.error(data.data.msg)
      })
    },
    // 检查提交是否合格
    checkSellAmount () {
      let sellList = this.sumSellList()
      let data = {
        sellAmount: this.getTotalFee.sellAmount,
        endTime: this.endTimeStrap,
        recode: sellList,
        discountRate: parseFloat(parseFloat(this.rateNum * 100 / 10000).toFixed(4)),
        remark: this.remark
      }
      if (this.$route.query.id) data.sellOrderId = this.$route.query.id
      this.fetch(`${this.checkSellAmountUrl}`, 'post', data).then(data => {
        if (data.msg === 'Succeed') {
          this.isConfirm = true
        } else {
          this.finalLimit = true
        }
      }).catch(data => {
        if (data.msg === 'Succeed') {
          this.isConfirm = true
        } else {
          this.finalLimit = true
        }
      })
    },
    getAvailableSell () {
      // let amount = parseFloat(this.amount.toString().replace(/,/g, ''))
      this.fetch(`${this.getAvailableSellUrl}`).then(data => {
        this.balanceDetail = data.data
        for (let index = 0; index < this.balanceDetail.length; index++) {
          this.balanceDetail[index].num = ''
          this.$set(this.balanceDetail, index, this.balanceDetail[index])
        }
        // this.valiableData = data.data
        // this.listData = data.data.list
        // this.listData.forEach(item => {
        //   this.recode[item.addr] = item.balance
        // })
      }).catch(data => {
        this.$message.error(data.data.msg)
      })
    },
    getSellTotal () {
      this.fetch(`${this.getSellTotalUrl}`).then(data => {
        this.sellTotalAmount = data.data / 100
        this.amount = this.$route.query.amount || 0
        if (this.$route.query.amount) this.dataLayout()
        this.amount = this.toThousands(this.amount)
      }).catch(data => {
        this.$message.error(data.data.msg)
      })
    },
    toPickerDate (val = +new Date()) {
      var date = new Date(val + 8 * 3600 * 1000)
      return date.toJSON().substr(0, 19).replace('T', ' ')
    }
  },
  filters: {
    toFix (val) {
      return val.toFixed(2)
    }
  },
  created () {
    this.getSellTotal()
    this.getAvailableSell()
    this.$route.query.hasPassword === 'false' || this.$route.query.hasPassword === false ? this.hasPassword = false : this.hasPassword = true
    this.$route.query.hasBank === 'false' || this.$route.query.hasBank === false ? this.bankVisible = true : this.bankVisible = false
    this.endTime = this.$route.query.endTime
    if (this.$route.query.endTime) this.endTimeStrap = this.$route.query.endTime
    if (this.bankVisible) return
    this.fetch(this.getBankListUrl).then(data => {
      if (data.data.length > 0) {
        data.data.forEach(item => {
          if (item.use) {
            this.selectedBank = item
            this.selectSrc = '' + BankTypes[item.bankCode] || ''
          }
        })
        if (JSON.stringify(this.selectedBank) === '{}') {
          this.$message.error('请设置默认银行卡')
        }
      }
    }).catch(res => {
      this.$message.error(res.data.msg)
    })
  },
  computed: {
    payPsd () {
      if (!this.payPassword) {
        return true
      } else {
        return false
      }
    },
    btnSubDisabled () {
      if (!this.rateNum || !this.getTotalFee.sellAmount || this.finalAmount <= 0 || this.rateNum > 100 || parseFloat(this.sumNum.toString().replace(/,/g, '')) > this.getTotalFee.sellAmount) {
        return true
      } else if (this.getTotalFee.sellAmount && this.endTime) {
        return false
      } else {
        return true
      }
    },
    // 交易金额
    finalAmount () {
      let amount = this.getTotalFee.cashBalance
      if (amount <= 0 || this.rateNum <= 0 || amount * this.rateNum < this.serviceFee) {
        return 0
      } else {
        return (amount * this.rateNum - this.serviceFee).toFixed(2)
      }
    },
    // 总价
    comAmount () {
      let amount = this.amount.toString().replace(/,/g, '')
      let sumNum = this.sumNum.toString().replace(/,/g, '')
      if (this.radio === 'rate') {
        if (amount <= 0 || this.rateNum <= 0) {
          return 0
        } else {
          return amount * this.rateNum
        }
      } else {
        if (amount <= 0 || sumNum <= 0) {
          return 0
        } else {
          return sumNum * 100
        }
      }
    },
    // 计算选择的出售令
    getTotalFee () {
      let feeObj = {
        sellAmount: 0,
        cashBalance: 0
        // serviceFee: 0
      }
      this.sellList.forEach(item => {
        feeObj.sellAmount += parseFloat(item.sellAmount.toString().replace(/,/g, ''))
        feeObj.cashBalance += item.cashBalance
        // feeObj.serviceFee += item.serviceFee
      })
      return feeObj
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/variables';
.cnfnot {
  font-size: 13px;
  line-height: 13px;
  margin-bottom: 8px;
}
.startSale {
  .scheduleContent {
    width: 583px;
    margin: 0 auto;
    text-align: center;
    .dotted {
      border-top: 1px solid rgba(0, 0, 0, .21);
      width: 100%;
      height: 1px;
    }
    .detailFee {
      margin-left: 10px;
      position: relative;
      width: 28px;
      height: 16px;
      display: inline-block;
      .detailText {
        text-decoration: underline;
        cursor: pointer;
        color: @theme-blue;
        color: var(--mainColor);
      }
    }
    .functionLis {
      width: 100%;
      height: 45px;
      margin: 26px 0;
      font-size: 16px;
      // font-family: SimSun;
      color: rgba(87, 87, 87, 1);
      .funLable {
        // width: 126px;
        height: 45px;
        line-height: 45px;
        text-align: right;
        margin-right: 16px;
        float: left;
      }
      .mrn {
        margin-right: 16px;
        padding-left: 21px;
      }
      .funItem {
        height: 45px;
        float: left;
        .amount-input {
          width: 360px;
        }
        .amount-input1 {
          font-size: 16px;
          width: 135px;
          height: 41px;
        }
        .rate-input {
          width: 79px;
        }
      }
      .centerText {
        line-height: 45px;
      }
      .isShowDetail,
      .saleBalance {
        float: right;
        width: 100px;
        height: 45px;
        line-height: 45px;
        margin-left: 5px;
        font-size: 14px;
      }
      .isShowDetail {
        cursor: pointer;
      }
      .saleBalance {
        width: auto;
        max-width: 235px;
        overflow: hidden;
      }
    }
    .bottom0 {
      margin-bottom: -10px;
      height: 90px;
      position: relative;
    }
    .funLable1 {
      position: absolute;
      top: 65px;
      left: 0;
    }
    .error-warning {
      margin-left: 15px;
      font-size: 14px;
      color: rgb(219,69,68);
    }
    .detailTable {
      border: 1px solid #e1e1e1;
      border-bottom: 0;
      margin-top: 34px;
    }
    .sumSale {
      width: clac(~'100% - 2px');
      height: 23px;
      line-height: 23px;
      padding: 12px 0;
      background-color: #fcfcfc;
      border: 1px solid #e1e1e1;
      border-top: 0;
      text-align: right;
    }
    table {
      width: 100%;
      margin: 34px auto 0;
      tr {
        td {
          height: 40px;
          line-height: 40px;
          border: 1px solid #e6e6e6;
          text-align: center;
          position: relative;
          // 解决火狐浏览器背景颜色覆盖边框问题
          background-clip: padding-box;
          .bankName {
            font-size: 14px;
            font-weight: bold;
            color: rgba(101, 101, 101, 1);
          }
        }
        td:nth-child(2n + 1) {
          width: 120px;
          background-color: #fafafa;
        }
        td:nth-child(2n) {
          text-align: left;
          padding-left: 15px;
          width: 306px;
          background-color: #ffffff;
        }
        .mainBgColor {
          line-height: 30px;
          background-color: @theme-blue-light !important;
          background-color: var(--mainLightColor) !important;
        }
      }
      tr:nth-child(3) {
        td {
          line-height: 30px;
          background-color: @theme-blue-light;
          background-color: var(--mainLightColor);
        }
        .dealCount {
          text-align: center;
        }
      }
      tr:nth-child(1) {
        background-color: #fafafa;
      }

      tr:nth-child(2n) {
        background-color: #ffffff !important;
      }
    }
    .colorMain {
      color: @theme-blue;
      color: var(--mainColor);
      font-size: 35px;
    }
  }
  .mainColor {
    color: @theme-blue;
    color: var(--mainColor);
    font-weight: bold;
    font-size: 16px;
  }
  .buyTableTitle {
    // width: 75px;
    text-align: left;
    height: 16px;
    font-size: 16px;
    color: rgba(101, 101, 101, 1);
    margin: 38px 0 15px;
    padding-left: 9px;
    border-left: 4px solid @theme-blue;
    border-left: 4px solid var(--mainColor);
  }
  .remark-input {
    width: 360px;
    height: 43px;
    margin: 0 14px 0 0;
    color: rgba(87, 87, 87, 1);
  }
  .goldHelp {
    font-size: 16px;
    color: #ccc;
  }
  .floatRight {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
  }
  .btnConfirm {
    width: 525px;
    height: 50px;
    margin: 20px auto 40px;
  }
  .buyConfirm,
    .buyCancel {
      width: 250px;
      height: 100%;
      float: left;
      font-size: 18px;
    }
    .buyCancel, .buyCancel:hover {
      float: right;
      background-color: #ffffff;
      color: @theme-blue;
      color: var(--mainColor);
    }
  .dialog-footer {
    margin-bottom: 20px;
    .confirm-btn, .confirm-btn1 {
      padding-left: 50px;
      padding-right: 50px;
    }
    .bigW {
      padding: 0;
      width: 211px;
      height: 50px;
      font-size: 18px;
      margin-top: -25px;
    }
    .confirm-btn1, .confirm-btn1:hover {
      border: 1px solid @theme-blue;
      border: 1px solid var(--mainColor);
      color: @theme-blue;
      color: var(--mainColor);
      background-color: #fff;
    }
  }
  .winthMid {
    width: 448px;
    height: 50px;
    margin: 20px auto 10px;
    .confirm-btn2 {
      width: 211px;
      height: 50px;
    }
  }
  .password {
    width: 426px;
    margin: 0 auto;
    .prompt {
      text-align: center;
      font-size: 18px;
      font-weight:bold;
      margin-bottom: 30px;
    }
    .psd-input {
      padding-left: 10px;
      width: 220px;
      height: 43px;
      border: 1px solid #e1e1e1;
      border-radius: 4px;
      margin: 0 14px 0 19px;
      background: #fcfcfc;
    }
    .forget-psd {
      cursor: pointer;
      color: @theme-blue;
      color: var(--mainColor);
      text-decoration: underline;
    }
  }
  .hint {
    text-align: center;
    margin: 20px 0;
    font-size: 18px;
    line-height: 30px;
  }
}
.warning-box {
  color: @theme-blue;
  color: var(--mainColor);
  background-color: @theme-blue-light;
  background-color: var(--mainLightColor);
  border-radius: 4px;
  font-size: 12px;
  line-height: 36px;
  text-align: center;
}
.el-icon-warning {
  font-size: 14px;
}
.helpTitle1 {
  font-size: 22px;
  font-weight: 400;
  color: rgba(87, 87, 87, 1);
  line-height: 42px;
  text-align: center;
}
.helpLine1 {
  font-size: 18px;
  font-weight: 400;
  color: rgba(87, 87, 87, 1);
  line-height: 34px;
  text-align: left;
}
.mb30 {
  margin-top: -10px;
  margin-bottom: 30px;
}
.amount-input2 /deep/ .el-input__inner{
  padding-left: 5px;
  padding-right: 5px;
}
.startSale/deep/.el-table .cell {
  text-align: center;
}
.startSale/deep/ .el-input__inner {
  height: 45px;
  line-height: 14px;
  padding-top: 12px;
  padding-bottom: 12px;
}
.startSale/deep/.credit-table-color-blue tr:nth-child(2n + 1) {
  cursor: default;
  background-color: @table-bg;
  background-color: var(--mainTableBg);
}
.startSale/deep/.credit-table-color-blue .el-table__body tr {
  &:nth-of-type(2n + 1):hover > td {
    background-color: @table-hover;
    background-color: var(--mainTableHover) !important;
  }
}
.startSale/deep/.el-table tr td:nth-child(8) > .cell {
  padding-left: 3px;
  padding-right: 3px;
}
.startSale/deep/.el-radio__input.is-checked .el-radio__inner,
.startSale/deep/.el-radio__inner:hover {
  border-color: #b1b1b1;
  background: #ffffff;
}
.startSale/deep/.el-radio__inner::after {
  background: rgba(87, 87, 87, 1);
  width: 6px;
  height: 6px;
}
.startSale/deep/.el-radio__input.is-checked + .el-radio__label {
  color: rgba(87, 87, 87, 1);
}
.startSale/deep/.el-radio__label {
  font-size: 16px;
}
.pay-table1, .pay-table2 {
  .password {
    width: 100%;
    margin-bottom: 15px;
  }
}
.pay-table1/deep/.credit-table-color-blue tr {
  cursor: default;
  background-color: @table-bg;
  background-color: var(--mainTableBg) !important;
}
.pay-table1/deep/.credit-table-color-blue .el-table__body tr {
  &:nth-of-type(2n + 1):hover > td {
    background-color: @table-bg;
    background-color: var(--mainTableBg) !important;
  }
  td {
    height: 50px;
  }
}
.pay-table1/deep/ .el-table th {
  padding-top: 4px;
  padding-bottom: 4px;
}
.pay-table1/deep/.credit-table-color-blue .el-table__body tr {
  &:nth-of-type(2n):hover > td {
    background-color: #fafafa !important;
  }
}
.startSale/deep/.el-input__prefix {
  left: 327px;
}
.startSale /deep/ .scheduleContent .functionLis .funItem .amount-input .el-input__inner {
  padding-left: 15px;
}
</style>
