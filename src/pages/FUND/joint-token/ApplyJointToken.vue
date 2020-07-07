<template>
  <div class="apply-joint-token">
    <BusinessTitle title="联合发令" isShowBack></BusinessTitle>
    <div class="step">
      <div class="wrapper">
        <ul class="step-list">
          <li v-for="(item,index) in stepList" :key="index" :class="[index + 1 === step ? 'visible' : '']">
            <span class="content">
              <span class="number">{{index + 1}}</span>{{item}}
            </span>
            <i class="icon el-icon-arrow-right "></i>
          </li>
        </ul>
      </div>
    </div>
    <div class="note-content">
      <div class="note-message">
        <div class="title">票据信息</div>
        <div class="note-message-details">
          <div class="note-message-left">
            <el-form ref="form" :model="note" label-width="80px">
              <el-form-item label="票据类型">
                <el-select v-model="note.billType" placeholder="请选择票据类型">
                  <el-option label="电子银票" value="ElectronicAcceptanceBill"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="票号">
                <el-input v-model="note.billNo" placeholder="请输入票号" @blur="verifyTicket"></el-input>
                <div v-if="error.ticket" class="error-warning">
                  <i class="el-icon-warning error-icon-warning"></i>
                  <span class="login-error">票号有误</span>
                </div>
                <div v-if="error.ticketExist" class="error-warning">
                  <i class="el-icon-warning error-icon-warning"></i>
                  <span class="login-error">该票号已申请过发令</span>
                </div>
              </el-form-item>
              <el-form-item label="承兑人">
                <el-input v-model="note.acceptor" placeholder="请输入承兑人名称" @blur="verifyName"></el-input>
                <div v-if="error.name" class="error-warning">
                  <i class="el-icon-warning error-icon-warning"></i>
                  <span class="login-error">请正确填写承兑人信息</span>
                </div>
              </el-form-item>
            </el-form>
          </div>
          <div class="note-message-right">
            <el-form ref="form" :model="note" label-width="80px">
              <el-form-item label="票面金额">
                <el-input v-model="note.billAmount" placeholder="请输入票面金额" @blur="billAmount" @input="handleBillAmount">
                </el-input>
              </el-form-item>
              <el-form-item label="出票日期">
                <el-date-picker v-model="note.issuingDate" placeholder="请选择日期" type="date" :editable="false"
                  :picker-options="startPickOptions" prefix-icon="el-icon-caret-bottom" value-format="yyyy-MM-dd"
                  @blur="verifyDate">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="到期日期">
                <el-date-picker v-model="note.expiryDate" placeholder="请输入日期" type="date" :editable="false"
                  prefix-icon="el-icon-caret-bottom" value-format="yyyy-MM-dd" :picker-options="pickerOptions1"
                  @blur="verifyDate">
                </el-date-picker>
                <div v-if="error.date" class="error-warning">
                  <i class="el-icon-warning error-icon-warning"></i>
                  <span class="login-error">到期日期应大于出票日期</span>
                </div>
              </el-form-item>
              <el-form-item label="剩余天数">
                <el-input :value="lastDay" placeholder="" :disabled="true"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div class="token-message">
        <div class="title">发令信息</div>
        <div class="token-message-details">
          <div class="token-message-left">
            <el-form ref="form" :model="note" label-width="180px">
            </el-form>
          </div>
          <div class="token-message-right">
            <el-form ref="form" :model="note" label-width="195px">
              <el-form-item label="发令金额">
                <el-input v-model="note.tokenAmount" placeholder="请输入发令金额" @blur="tokenAmount"
                  @input="handleTokenAmount"></el-input>
                <div class="error-warning" v-if="error.amount">
                  <i class="el-icon-warning error-icon-warning"></i>
                  <span class="login-error">发令金额不能大于票面金额</span>
                </div>
              </el-form-item>
              <el-form-item label="企业方(持票方)">
                <el-input v-model="note.enterpriseName" placeholder="请输入企业名称" @blur="noCompanyError"></el-input>
                <!-- <span class="img" @click="getMessage"></span> -->
                <svg-icon iconClass='ht_sy_dls' className='img' @click="getMessage"></svg-icon>
              </el-form-item>
              <div class="no-company" v-if="error.noCompany">企业不存在<span class="invitation"
                  @click="invitationEnterperise">去邀请</span></div>
              <el-form-item label="企业方统一社会信用代码">
                <el-input v-model="note.enterpriseCode" placeholder="请输入统一社会信用代码" @blur="verifyRegin"></el-input>
                <div class="error-warning" v-if="error.region">
                  <i class="el-icon-warning error-icon-warning"></i>
                  <span class="login-error">统一社会信用代码由18位数字或大写字母组成</span>
                </div>
              </el-form-item>
              <el-form-item label="我方流通奖励分润比率">
                <span class="percent">
                  <input v-model="note.fundInterestRate" placeholder="请设置比率" @blur="addRate" @input="handleInput"
                    maxlength="5" class="percent-input" />
                  <span class="per-cent">%</span>
                </span>
                <!-- <el-input v-model="note.fundInterestRate" placeholder="请设置比率" @blur="addRate" @input="handleInput" maxlength="5"> </el-input>-->
              </el-form-item>
              <div class="hint" v-if="error.rateSum">请输入0-100的数值</div>
              <el-form-item label="企业方流通奖励分润比率(%)">
                <span class="percent">
                  <input v-model="note.enterpriseInterestRate" placeholder="请设置比率" class="percent-input" disabled
                    maxlength="5" />
                  <span class="per-cent">%</span>
                </span>
                <!-- <el-input v-model="note.enterpriseInterestRate" placeholder="请设置比率" disabled></el-input> -->
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="coupon-rate">
          <span>每十万贴息</span>
          <span class="interestRate">¥ {{note.interestRate}}</span>
          <span>&nbsp;&nbsp;&nbsp;&nbsp;{{interestRateAmount}}</span>
        </div>
      </div>
    </div>
    <div class="btn">
      <div class="checkbox">
        <el-checkbox v-model="note.isSaveInfo" class="checked">保存联合发令方信息</el-checkbox>
      </div>
      <Button title="提交" class="applyBtn" @handleClick="applySubmit" :disabled="disableSubmit"></Button>
    </div>
    <div class="joint-token-enterpriseName">
      <el-dialog title="常用付款企业查询" :visible.sync="paymentSuccess" :before-close="cleanInput" width="768px" top="230px">
        <div class="select-box">
          <input placeholder="输入公司名称" suffix-icon="el-icon-search" v-model="search" class="select-input"><i
            class="el-icon-search icon-search"></i>
        </div>
        <div class="select">
          <div v-for="item of detailList" :key="item.eid" class="select-message">
            <div class="pay-radio">
              <el-radio v-model="radio" label="1" @change="handleSelect(item)" class="select-radio">
                <div class="select-radio-message">
                  <span class="select-name">{{item.enterpriseName}}</span>
                  <span>{{item.enterpriseCreditCode}}</span>
                </div>
              </el-radio>
            </div>
          </div>
        </div>
        <div v-if="noSearch" class="no-search">未找到对应的公司</div>
      </el-dialog>
    </div>
    <div class="confirm-joint-token">
      <el-dialog :visible.sync="jointTokenShow" center width="570px" top="305px">
        <div class="text">是否确认发起联合发令?</div>
        <span slot="footer" class="dialog-footer">
          <Button title="确定" class="dialogBtn" @handleClick="jointTokeSuccess"></Button>
          <Button title="取消" class="dialogBtnF" @handleClick="jointTokenFailed"></Button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import BusinessTitle from '@/components/BusinessTitle'
import settings from '@/settings'
export default {
  components: {
    BusinessTitle
  },
  data () {
    return {
      stepList: ['资金方发起联合发令', '等待企业确认方案', '等待资金方付款', '等待企业背书', '等待资金方确认', '联合发令成功'],
      step: 1,
      pickerOptions1: {
        disabledDate (time) {
          return time.getTime() < Date.now()
        }
      },
      startPickOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      note: {
        isSaveInfo: true
      },
      // detailList: [],
      rate: '',
      interestRateAmount: '',
      interestRate: '',
      paymentSuccess: false,
      search: '',
      noSearch: false,
      list: [],
      radio: 'true',
      error: {
        noCompany: false,
        rateSum: false,
        ticket: false,
        name: false,
        date: false,
        region: false,
        amount: false,
        ticketExist: false
      },
      pageNo: 1,
      pageSize: 10,
      pageSizes: settings.pageSizes,
      totalCnt: 1,
      jointTokenShow: false,
      // 申请发令提交接口
      applyJointTokenUrl: settings.apiGateway.applyJointToken,
      // 资金方申请是判读企业是否存在
      judgeEnterpriseUrl: settings.apiGateway.judgeEnterprise,
      // 企业方列表
      getEnterpriseListUrl: settings.apiGateway.getEnterpriseList,
      // 判读信用代码是否存在
      judgeEnterpriseCodeUrl: settings.apiGateway.judgeEnterpriseCode,
      // 判断企业方名称和信用代码是否一致
      judgeConsistencyUrl: settings.apiGateway.judgeConsistency,
      verifyTicketExistUrl: settings.apiGateway.verifyTicketExist
    }
  },
  methods: {
    // 获取公司列表
    getMessage () {
      this.paymentSuccess = true
      this.fetch(`${this.getEnterpriseListUrl}`).then(data => {
        this.list = data.data
        // this.detailList = data.data
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    // 关闭公司弹窗
    cleanInput () {
      this.search = ''
      this.paymentSuccess = false
    },
    // 点选收款公司
    handleSelect (item) {
      this.eid = item.eid
      this.note.enterpriseName = item.enterpriseName
      this.note.enterpriseCode = item.enterpriseCreditCode
      this.radio = false
      this.paymentSuccess = false
      this.noCompanyError()
    },
    // 判断企业方是否存在断企业方是否存在
    noCompanyError () {
      if (this.note.enterpriseName) {
        this.fetch(`${this.judgeEnterpriseUrl}${this.note.enterpriseName}`).then(({ data }) => {
          if (data === 1) {
            this.error.noCompany = true
          } else {
            this.error.noCompany = false
          }
        }).catch(data => {
          this.$message({
            type: 'error',
            message: data.data.msg
          })
        })
      }
    },
    // 邀请企业方
    invitationEnterperise () {
      this.$router.push('/fund/companies/register')
    },
    // 校验票号
    verifyTicket () {
      let reg = /^[0-9]{30}$/
      if (!reg.test(this.note.billNo)) {
        this.error.ticket = true
        // setTimeout(() => {
        //   this.error.ticket = false
        // }, 2000)
        return true
      } else {
        this.error.ticket = false
      }
      this.fetch(`${this.verifyTicketExistUrl}${this.note.billNo}`).then(({ data }) => {
        if (data === 0) {
          this.error.ticketExist = true
        } else {
          this.error.ticketExist = false
        }
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    // 校验承兑人
    verifyName () {
      var reg = /(^[\u4E00-\u9FFF]+$)/
      if (!reg.test(this.note.acceptor)) {
        this.error.name = true
        // setTimeout(() => {
        //   this.error.name = false
        // }, 2000)
        return true
      } else {
        this.error.name = false
      }
    },
    // 验证统一社会信用代码
    verifyRegin () {
      let region = /(^[A-Z0-9]{18}$)/
      if (!region.test(this.note.enterpriseCode)) {
        this.error.region = true
        // setTimeout(() => {
        //   this.error.region = false
        // }, 2000)
        return true
      } else {
        this.fetch(`${this.judgeEnterpriseCodeUrl}` + this.note.enterpriseCode).then(({ data }) => {
          if (data === 1) {
            this.$message.error('企业统一社会信用代码错误')
          } else {
            this.error.region = false
          }
        }).catch(data => {
        })
      }
    },
    // 到期日大于出票日
    verifyDate () {
      var oDate1 = new Date(this.note.issuingDate)
      var oDate2 = new Date(this.note.expiryDate)
      if (this.note.issuingDate && this.note.expiryDate && oDate1.getTime() > oDate2.getTime()) {
        this.error.date = true
        // setTimeout(() => {
        //   this.error.date = false
        // }, 2000)
        return true
      } else {
        this.error.date = false
      }
      if (this.note.tokenAmount && this.note.billAmount && this.note.expiryDate) {
        this.getInterestRate()
      }
    },
    // 计算息率
    getInterestRate () {
      this.note.billAmount = this.note.billAmount.replace(/,/g, '')
      this.note.tokenAmount = this.note.tokenAmount.replace(/,/g, '')
      if (this.note.billAmount && this.note.tokenAmount && this.note.expiryDate) {
        var balance = this.note.billAmount - this.note.tokenAmount
        var str = new Date(this.note.expiryDate).getTime() - new Date().getTime()
        var differenceDate = Math.ceil(str / 1000 / 3600 / 24)
        var rate = parseFloat(balance / (this.note.billAmount * differenceDate) * 360 * 100).toFixed(2)
        this.note.interestRate = parseFloat(balance * 100000 / this.note.billAmount).toFixed(2)
        this.note.yearRate = rate
      }
      this.interestRateAmount = '(年利率' + rate + '%)'
      if (this.note.interestRate < 0 || this.note.yearRate < 0) {
        this.error.amount = true
        // setTimeout(() => {
        //   this.error.amount = false
        // }, 2000)
        return true
      } else {
        this.error.amount = false
      }
      this.note.billAmount = this.toThousands(this.note.billAmount)
      this.note.tokenAmount = this.toThousands(this.note.tokenAmount)
    },
    // 金额格式化
    toThousands (val) {
      if (!val && (val !== 0 || val !== '0')) return ''
      let str = String(val).replace(/,/g, '')
      let num1 = str.split('.')[0]
      let num = parseFloat('0.' + str.split('.')[1]).toFixed(3) // 这里因为我需要两位小数所以做一个限制，你们看情况做小数位的限制
      str = num1 + '.' + String(num).split('.')[1]
      // num = parseFloat(num).toFixed(3)
      let s = str.substring(0, (str.length - 1)) // 只取小数位2位
      return s && s.toString().replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
        return $1 + ','
      })
    },
    // 发令金额不能大于票面金额
    tokenAmount () {
      if (!isNaN(this.note.tokenAmount)) {
        this.note.tokenAmount = this.toThousands(this.note.tokenAmount)
      }
      if (this.note.tokenAmount && this.note.billAmount && this.note.expiryDate) {
        this.getInterestRate()
      }
    },
    billAmount () {
      if (!isNaN(this.note.billAmount)) {
        this.note.billAmount = this.toThousands(this.note.billAmount)
      }
      if (this.note.tokenAmount && this.note.billAmount && this.note.expiryDate) {
        this.getInterestRate()
      }
    },
    // 判断是否相加比率为100%
    addRate () {
      // if (this.note.fundInterestRate) {
      // this.note.fundInterestRate = this.note.fundInterestRate.replace(/,/g, '')
      // }
      if (!isNaN(this.note.fundInterestRate)) {
        if (this.note.fundInterestRate > 100) {
          this.$message.error('分润比率不能超过100')
          this.note.fundInterestRate = ''
        } else {
          this.note.fundInterestRate = this.note.fundInterestRate
        }
      } else {
        this.note.fundInterestRate = ''
      }
    },
    handleInput () {
      if (this.note.fundInterestRate && this.note.fundInterestRate <= 100) {
        this.note.enterpriseInterestRate = parseFloat(100 - this.note.fundInterestRate.substring(0, this.note.fundInterestRate.lastIndexOf('.') + 4))
      } else {
        this.note.enterpriseInterestRate = ''
      }
    },
    // 申请提交
    applySubmit () {
      if (this.verifyTicket()) return
      if (this.verifyName()) return
      if (this.verifyRegin()) return
      if (this.verifyDate()) return
      if (this.addRate()) return
      if (this.getInterestRate()) return
      // this.jointTokenShow = true
      // 判断企业方名称和信用代码是否一致
      this.fetch(`${this.judgeConsistencyUrl}${this.note.enterpriseCode}/${this.note.enterpriseName}`).then(data => {
        if (data.data === 1) {
          this.$message.error('付款企业名称或统一社会信用代码错误')
        } else {
          this.jointTokenShow = true
        }
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    // 申请成功
    jointTokeSuccess () {
      this.note.billAmount = this.note.billAmount.replace(/,/g, '')
      this.note.tokenAmount = this.note.tokenAmount.replace(/,/g, '')
      this.fetch(this.applyJointTokenUrl, 'post', this.note).then(data => {
        this.$router.push('/fund/joint-token-success')
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    // 取消申请
    jointTokenFailed () {
      this.jointTokenShow = false
    },
    handleBillAmount () {
      if (!isNaN(this.note.billAmount) && this.note.billAmount > 1000000000) {
        this.note.billAmount = 1000000000
      }
    },
    handleTokenAmount () {
      if (!isNaN(this.note.tokenAmount) && this.note.tokenAmount > 1000000000) {
        this.note.tokenAmount = 1000000000
      }
    }
  },
  computed: {
    disableSubmit () {
      if (this.note.billType && this.note.acceptor && this.note.issuingDate && this.note.billNo && this.note.billAmount && this.note.expiryDate && this.note.tokenAmount && this.note.enterpriseCode && this.note.fundInterestRate && this.note.enterpriseName && this.note.enterpriseInterestRate && this.note.isSaveInfo && !this.error.noCompany) {
        return false
      } else {
        return true
      }
    },
    detailList () {
      var search = this.search
      if (search) {
        return this.list.filter(function (product) {
          return Object.keys(product).some(function (key) {
            return String(product[key]).toLowerCase().indexOf(search) > -1
          })
        })
      }
      return this.list
    },
    lastDay () {
      let expiryDate = this.note.expiryDate
      if (!expiryDate) {
        return '0 天'
      }
      let str = new Date(expiryDate).getTime() - new Date().getTime()
      return Math.ceil(str / 1000 / 3600 / 24) + ' 天'
    }
  },
  watch: {
    search (newVal) {
      if (this.detailList.length === 0) {
        this.noSearch = true
      } else {
        this.noSearch = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/variables';
.step {
  width: 95%;
  margin: 0 auto;
  height: 45px;
  color: #333;
  margin-top: 26px;
  background-color: #fafafa;
  .wrapper {
    text-align: center;
  }
  .step-list {
    width: 100%;
    height: 45px;
    line-height: 45px;
    display: inline-block;
    clear: both;
    overflow: hidden;
    box-sizing: border-box;
    padding-left: 15px;
    li {
      position: relative;
      float: left;
      padding: 0px 15px 0px 7px;
      text-align: center;
      //margin-right:160px;
      .content {
        .number {
          display: inline-block;
          width: 20px;
          height: 20px;
          margin-right: 5px;
          color: #333;
          line-height: 20px;
          border-radius: 10px;
          background-color: #e8e8e8;
        }
      }
      .icon {
        width: 10px;
        height: 13px;
        font-size: 12px;
        padding-left: 8px;
      }
      &:last-child {
        margin-right: 0;
        &:after {
          display: none;
        }
      }
    }
    .visible {
      .content {
        display: inline-block;
        color: #fff;
        height: 44px;
        padding: 0 15px;
        border-radius: 5px;
        background-color: @theme-blue;
        background-color: var(--mainColor);
        .number {
          color: @theme-blue;
          color: var(--mainColor);
          background-color: #fff;
          font-weight: 700;
        }
      }
    }
  }
}
.note-content {
  width: 100%;
  height: 526px;
  margin-top: 39px;
}
.note-message {
  // height: 550px;
  // margin-top: 39px;
  width: 49%;
  float: left;
  border-right: 1px solid #f0f0f0;
  .title {
    width: 80%;
    padding-left: 30px;
    height: 34px;
    line-height: 34px;
    border-radius: 10px;
    // text-align: center;
    margin: 0 0 25px 20px;
    font-size: 16px;
    font-weight: 900;
    background-color: @theme-blue-light;
    background-color: var(--mainLightColor);
  }
  .note-message-details {
    padding-left: 85px;
    //     margin-top:38px;
  }
}
.token-message {
  // height: 550px;
  width: 47%;
  float: left;
  // margin-top: 39px;
  padding-left: 35px;
  .title {
    width: 85%;
    padding-left: 30px;
    height: 34px;
    line-height: 34px;
    border-radius: 10px;
    // text-align: center;
    margin: 0 0 25px 20px;
    font-size: 16px;
    font-weight: 900;
    background-color: @theme-blue-light;
    background-color: var(--mainLightColor);
  }
  .coupon-rate {
    padding-left: 112px;
    width: 100%;
    height: 45px;
    margin-top: 24px;
    .interestRate {
      display: inline-block;
      width: 110px;
      height: 43px;
      border-radius: 5px;
      background: #f0f0f0;
      // text-align: center;
      padding-left: 15px;
      line-height: 43px;
      margin: 0 13px;
      border: 1px solid #e1e1e1;
    }
  }
  .img {
    display: inline-block;
    width: 30px !important;
    height: 30px !important;
    vertical-align: middle;
    color: #ccc;
    position: absolute;
    right: 10px;
    top: 6px;
    // background-image:url('~@/assets/img/pay05.png');
  }
  .no-company {
    margin: 0 0 25px 200px;
    color: red;
    .invitation {
      cursor: pointer;
      text-decoration: underline;
      color: @theme-blue;
      color: var(--mainColor);
      margin-left: 10px;
    }
  }
}
.percent {
  display: inline-block;
  width: 269px;
  height: 40px;
  padding-left: 15px;
  border: 1px solid #dcdfe6;
  background: #fcfcfc;
  .percent-input {
    width: 72px;
    height: 30px;
    background: #fcfcfc;
    position: relative;
  }
  .per-cent {
    position: absolute;
    left: 87px;
    top: 2px;
    color: #b4b4b4;
  }
}
.percent-input::-webkit-input-placeholder {
  color: #b4b4b4;
}
.percent-input::-moz-placeholder {
  color: #b4b4b4;
}
.percent-input:-ms-input-placeholder {
  color: #b4b4b4;
}
.btn {
  width: 100%;
  height: 200px;
  margin-top: 30px;
  text-align: center;
  .applyBtn {
    width: 400px;
    height: 50px;
    line-height: 50px;
    padding: 0;
    margin-top: 28px;
    border-color: @theme-blue;
    border-color: var(--mainColor);
    background: @theme-blue;
    background: var(--mainColor);
    color: #ffffff;
    box-shadow: 1px 6px 4px @btn-disabled;
    box-shadow: 1px 6px 4px var(--mainTableHover);
  }
}
.el-dialog__body {
  .select-box {
    width: 300px;
    margin: 0 auto 50px;
    .select-input {
      width: 250px;
      border: 1px solid #ccc;
      border-right: 0;
      height: 37px;
      padding-left: 10px;
    }
    .icon-search {
      width: 38px;
      border: 1px solid #ccc;
      height: 37px;
      line-height: 37px;
      border-left: 0;
      float: right;
    }
  }
  .select {
    max-height: 200px;
    margin-bottom: 100px;
    overflow-y: auto;
    .select-message {
      border-top: 1px solid #e6e6e6;
      width: 100%;
      height: 40px;
      .pay-radio {
        margin: 0 auto;
        line-height: 40px;
        width: 100%;
        .select-radio {
          line-height: 40px;
          display: flex;
          justify-content: center;
          .select-radio-message {
            width: 400px;
            display: flex;
            justify-content: space-between;
          }
        }
      }
      .select-name {
        // width:24px;
        font-size: 16px;
      }
      &:nth-of-type(2n + 1) {
        background: @table-bg;
        background: var(--mainTableBg);
      }
    }
  }
}
.error-warning {
  position: absolute;
  top: 37px;
  color: red;
}
.text {
  margin-top: 68px;
  margin: 68px 0 50px 0;
  font-size: 19px;
  text-align: center;
}
.dialogBtn {
  width: 211px;
  height: 50px;
  margin-right: 10px;
  font-size: 18px;
  background-color: @theme-blue;
  background-color: var(--mainColor);
  border-color: @theme-blue;
  border-color: var(--mainColor);
}
.dialogBtnF {
  width: 211px;
  height: 50px;
  font-size: 18px;
  background-color: #fff;
  color: @theme-blue;
  color: var(--mainColor);
  border-color: @theme-blue;
  border-color: var(--mainColor);
}
.confirm-joint-token .dialogBtnF:hover {
  background-color: #fff;
  color: @theme-blue;
}
.apply-joint-token/deep/.el-input__inner {
  background: #fcfcfc;
  border-color: #dcdfe6 !important;
}
.apply-joint-token/deep/.el-input {
  width: 284px;
  height: 45px;
}
.coupon-rate/deep/.el-input {
  width: 123px;
  padding: 0 16px;
}
.coupon-rate/deep/.el-input__inner {
  background: #f0f0f0;
}
.apply-joint-token/deep/.el-checkbox__input.is-checked + .el-checkbox__label {
  color: #333;
}
.apply-joint-token/deep/.el-radio__inner {
  margin-top: 13px;
}
.no-search {
  width: 200px;
  position: relative;
  bottom: 100px;
  left: 290px;
  font-size: 18px;
}
</style>

<style>
.joint-token-enterpriseName .el-dialog {
  position: absolute;
  width: 768px;
  top: 50%;
  left: 50%;
  margin-top: -250px !important;
  margin-left: -284px;
  height: 500px;
}
.confirm-joint-token .el-dialog {
  position: absolute;
  top: 50% !important;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  margin-top: 0 !important;
  margin-left: 108px;
}
</style>
