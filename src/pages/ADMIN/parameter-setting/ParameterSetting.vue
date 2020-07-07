<template>
  <div class="parameterSetting">
    <BusinessTitle title="参数设置"></BusinessTitle>
    <!-- <div v-if="!editFlag" class="edit-button" @click="editParameter">
      <span>编辑参数</span>
    </div>
    <div v-else>
      <div class="edit-button" @click="saveParameter">
        <span>保存</span>
      </div>
      <div class="edit-button" @click="cancelParameter">
        <span>放弃</span>
      </div>
    </div> -->
    <div class="parameter-setting--show" v-if="!editFlag">
      <div class="setting-detail">
        <h4>充值</h4>
        <div class="rate-standards">
          <div class="rate-box">
            <span class="titleFl">充值服务费率</span>
            <span class="contFl">
              <span class="textMainColor">{{parameterData.depositFeeRate || 0 | rateFtt}}</span>%
              <!-- <span class="toUpRate" @click="dialogTopUpRate = true">修改</span>
              <span class="toUpRate" @click="checkRecord">查看记录</span> -->
            </span>
          </div>
          <div class="rate-box">
            <span class="titleFl">最低充值额度</span>
            <span class="contFl">
              <span class="textMainColor">{{parameterData.depositLowerLimit || 0 | toThousands}}</span>元
            </span>
          </div>
        </div>
      </div>
      <div class="setting-detail">
        <h4>提现</h4>
        <div class="rate-standards">
          <div class="rate-box">
            <span class="titleFl">提现服务费率</span>
            <span class="contFl">
              <span class="textMainColor">{{parameterData.withdrawFeeRate || 0 | rateFtt}}</span>%
            </span>
          </div>
          <div class="rate-box">
            <span class="titleFl">最低提现额度</span>
            <span class="contFl">
              <span class="textMainColor">{{parameterData.withdrawLimit || 0 | toThousands}}</span>元
            </span>
          </div>
        </div>
      </div>
      <div class="setting-detail">
        <h4>支付</h4>
        <div class="rate-standards">
          <div class="rate-box">
            <span class="titleFl">基础费率</span>
            <span class="contFl">
              <span class="textMainColor">{{parameterData.payRate || 0 | rateFtt}}</span>%
            </span>
          </div>
          <div class="rate-box">
            <span class="titleFl">持有期费率</span>
            <span class="contFl">
              <span class="textMainColor">{{parameterData.dailyRate || 0 | rateFtt}}</span>%
            </span>
          </div>
        </div>
      </div>
      <div class="setting-detail">
        <h4>账期和利率</h4>
        <el-table :data="balanceDetail" stripe border style="width: 100%" header-align='center'
          class="credit-table-color-blue sy-global-has-gutter__th--text-center sy-global-el-table-fit--border">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="min" label="最少天数">
            <template slot-scope="scope">
              <span v-if="!isEdit">{{scope.row.min}}</span>
              <input v-else type="text" class="psd-input" v-model="scope.row.newMin" @blur="minBlur(scope.row)"/>
            </template>
          </el-table-column>
          <el-table-column prop="max" label="最多天数">
            <template slot-scope="scope">
              <span v-if="!isEdit">{{scope.row.max}}</span>
              <input v-else type="text" class="psd-input" v-model="scope.row.newMax" @blur="maxBlur(scope.row)"/>
            </template>
          </el-table-column>
          <el-table-column prop="rate" label="年化利率">
            <template slot-scope="scope">
              <span v-if="!isEdit">{{scope.row.rate/10000}}%</span>
              <input v-else type="text" class="psd-input" v-model="scope.row.newRate" @blur="rateBlur(scope.row)"/>
              <span v-if="isEdit">%</span>
            </template>
          </el-table-column>
          <el-table-column prop="maxRate" label="最大折扣率">
            <template slot-scope="scope">
              <span v-if="!isEdit">{{scope.row.maxRate/10000}}%</span>
              <span v-else>{{scope.row.newMaxRate | round4}}</span>
              <span v-if="isEdit">%</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="operateBar">
          <span class="mainColor" style="marginLeft:15px" @click="editOrSave">{{isEdit?'完成':'编辑'}}</span>
          <span class="mainColor" style="marginLeft:15px" @click="cancle" v-if="isEdit">取消</span>
          <span class="mainColor" style="marginLeft:55px" @click="addRate">新增</span>
          <span class="mainColor" style="float:right;marginRight:40px">查看日志</span>
        </div>
      </div>
      <div class="setting-detail">
        <h4>限额</h4>
        <div class="rate-standards">
          <div class="rate-box" style="width:100%;borderRight:0">
            <span class="titleFl" style="width:128px">小额免密金额</span>
            <span class="contFl">
              <span class="textMainColor">{{parameterData.maxFreeAmount / 10000 || 0 | toThousands}}</span> 万
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="parameter-setting--edit" v-else>
      <div class="setting-detail">
        <h4>费率设置</h4>
        <div class="rate-standards">
          <div class="rate-box" ref="withdrawCashFee">
            <span>操作服务费</span>
            <span>
              <input @blur="inputBlur('withdrawCashFee')" @focus="inputFocus('withdrawCashFee')" type="text"
                v-model="parameterData.withdrawCashFee">
            </span>令
          </div>
          <div class="rate-box" ref="depositFee">
            <span>充值服务费率</span>
            <span>
              <input @blur="inputBlur('depositFee')" @focus="inputFocus('depositFee')" type="text"
                v-model="parameterData.depositFee">
            </span>%
          </div>
        </div>
      </div>
      <div style="width: 100%; height:115px;">
        <div class="rate-setting-detail-right">
          <h4>充值支付令设置</h4>
          <div class="rate-box" ref="depositLowerLimit">
            <span>单次支付令金额下限</span><span style="padding: 0 5px 0 24px"></span>
            <span class="symbol">¥</span>
            <span>
              <input style="padding-left: 30px;width: 126px;" @blur="inputBlur('depositLowerLimit')"
                @focus="inputFocus('depositLowerLimit')" type="text" v-model="parameterData.depositLowerLimit">
            </span>
          </div>
        </div>
      </div>
    </div> -->
    <!-- 修改充值折扣率弹窗 -->
    <el-dialog :visible.sync="dialogTopUpRate" center width="568px" :close-on-click-modal="false"
      :close-on-press-escape="false">
      <div class="password">
        <p class="prompt">修改充值折扣率</p>
        <div class="codeItem">
          <span class="pay-psd">充值折扣率</span>
          <input type="text" class="psd-input" v-model="topUpRate" maxlength="5" @blur="topUpRateBlur" />
          <span class="rateUnit">%</span>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <Button class="confirm-btn" @handleClick="RateSave" title="保存" :isLoading="isLoading"
          :disabled="disRate"></Button>
        <Button class="dialogBtnF" @handleClick="dialogTopUpRate = false" title="取消"></Button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BusinessTitle from '@/components/BusinessTitle'
import settings from '@/settings'
export default {
  name: 'parameterSetting',
  data () {
    return {
      parameterData: {},
      balanceDetail: [],
      editFlag: false,
      // 获取系统参数接口
      systemConfigUrl: settings.apiGateway.systemConfig,
      // 获取账期和利率接口
      getTermRateUrl: settings.apiGateway.getTermRate,
      backupParameterData: {},
      saveDisabled: true,
      dialogTopUpRate: false,
      isLoading: false,
      isEdit: false,
      topUpRate: 0
    }
  },
  created () {
    this.getParaInfo()
    this.getTermRate()
  },
  methods: {
    getParaInfo () {
      // 获取参数信息
      this.fetch(this.systemConfigUrl, 'get').then(data => {
        this.parameterData = data.data
        this.topUpRate = this.parameterData.billDiscountRate * 100
        this.editFlag = false
      }).catch(res => {
        this.$message.error(res.data.msg)
      })
    },
    // 编辑保存账期与利率
    editOrSave () {
      if (!this.isEdit) {
        this.isEdit = true
      } else {
        let data = {
          termRateDtoList: []
        }
        this.balanceDetail.forEach(item => {
          data.termRateDtoList.push({
            id: parseInt(item.id),
            max: parseFloat(item.newMax),
            min: parseFloat(item.newMin),
            rate: parseFloat(item.newRate * 10000)
          })
        })
        console.log(data)
        this.fetch(this.systemConfigUrl, 'post', data).then(data => {
          this.$message.success('操作成功')
          this.getTermRate()
          this.isEdit = false
        }).catch(res => {
          this.$message.error(res.data.msg)
        })
      }
    },
    cancle () {
      this.getTermRate()
      this.isEdit = false
    },
    findVal (id, newVal, val) {
      this.balanceDetail.forEach((item, index) => {
        if (id === item.id) {
          this.balanceDetail[index][newVal] = val
          this.$set(this.balanceDetail, index, this.balanceDetail[index])
        }
      })
    },
    minBlur (row) {
      if (!row.newMin) {
        this.findVal(row.id, 'newMin', row.min)
      } else if (isNaN(Number(row.newMin))) {
        this.$message.error('请正确输入最小天数')
        this.findVal(row.id, 'newMin', row.min)
      } else if (parseFloat(row.newMin) > parseFloat(row.newMax)) {
        this.$message.error('最小天数不能大于最大天数')
        this.findVal(row.id, 'newMin', row.min)
      }
    },
    maxBlur (row) {
      if (!row.newMax) {
        this.findVal(row.id, 'newMax', row.max)
      } else if (isNaN(Number(row.newMax))) {
        this.$message.error('请正确输入最大天数')
        this.findVal(row.id, 'newMax', row.max)
      } else if (parseFloat(row.newMin) > parseFloat(row.newMax)) {
        this.$message.error('最大天数不能小于最小天数')
        this.findVal(row.id, 'newMax', row.max)
      }
      this.findVal(row.id, 'newMaxRate', row.newMax / 360 * row.newRate)
    },
    rateBlur (row) {
      if (!row.newRate) {
        this.findVal(row.id, 'newRate', row.rate / 10000)
      } else if (isNaN(Number(row.newRate))) {
        this.$message.error('请正确输入年化利率')
        this.findVal(row.id, 'newRate', row.rate / 10000)
      } else if (row.newRate > 100 || row.newRate <= 0) {
        this.$message.error('利率在0~100%之间')
        this.findVal(row.id, 'newRate', row.rate / 10000)
      }
      this.findVal(row.id, 'newMaxRate', row.newMax / 360 * row.newRate)
    },
    // 增加账期利率
    addRate () {
      this.isEdit = true
      this.balanceDetail.push({
        id: this.balanceDetail[this.balanceDetail.length - 1].id + 1,
        min: 0,
        max: 0,
        rate: 0,
        maxRate: 0,
        newRate: 0,
        newMin: 0,
        newMax: 0,
        newMaxRate: 0
      })
    },
    getTermRate () {
      // 获取参数信息
      this.fetch(this.getTermRateUrl, 'get').then(data => {
        this.balanceDetail = data.data
        this.balanceDetail.forEach((item, index) => {
          this.balanceDetail[index].newRate = item.rate / 10000
          this.balanceDetail[index].newMin = item.min
          this.balanceDetail[index].newMax = item.max
          this.balanceDetail[index].newMaxRate = item.maxRate / 10000
          this.$set(this.balanceDetail, index, this.balanceDetail[index])
        })
      }).catch(res => {
        this.$message.error(res.data.msg)
      })
    },
    rateFtt (rate) {
      return Math.round(rate * 10000) / 100
    },
    RateSave () {
      this.fetch(this.systemConfigUrl, 'post', { billDiscountRate: this.topUpRate / 100 }).then(data => {
        this.$message.success('配置成功')
        this.dialogTopUpRate = false
        this.getParaInfo()
      }).catch(res => {
        this.$message.error(res.data.msg)
      })
    },
    topUpRateBlur () {
      if (this.topUpRate > 100) this.$message.error('充值折扣率不能大于100%')
    },
    checkRecord () {
      this.$router.push('/admin/parameter-record')
    },
    editParameter () {
      this.backupParameterData = JSON.parse(JSON.stringify(this.parameterData))
      this.parameterData.conversionCostRate = this.rateFtt(this.parameterData.conversionCostRate)
      this.parameterData.withdrawCashCostRate = this.rateFtt(this.parameterData.withdrawCashCostRate)
      this.parameterData.depositFee = this.rateFtt(this.parameterData.depositFee)
      this.parameterData.payerRebate = this.rateFtt(this.parameterData.payerRebate)
      this.parameterData.counter = this.parameterData.counter
      this.editFlag = true
    },
    saveParameter () {
      if (!this.saveDisabled) {
        this.$message.error('数值必须为整数或小数，小数点后不超过4位。')
        return
      }
      // 确认弹窗
      this.alertConfirm({
        text: '确定要更改参数?',
        okBtn: '确认',
        infoBtn: '我再想想',
        ok: () => {
          // 调整数据
          let Data = {
            conversionCostRate: this.parameterData.conversionCostRate / 100,
            withdrawCashCostRate: this.parameterData.withdrawCashCostRate / 100,
            depositFee: this.parameterData.depositFee / 100,
            payerRebate: this.parameterData.payerRebate / 100,
            withdrawCashFee: this.parameterData.withdrawCashFee,
            depositLowerLimit: this.parameterData.depositLowerLimit,
            counter: this.parameterData.counter
          }
          // 发送请求
          this.fetch(`${this.systemConfigUrl}`, 'post', Data).then(data => {
            // 获取时间
            let effectiveTime
            let now = new Date().getTime()
            let nextSeconds = now + 24 * 60 * 60 * 1000
            let nextDay = new Date(nextSeconds)
            let year = nextDay.getFullYear()
            let month = nextDay.getMonth() + 1
            let day = nextDay.getDate()
            effectiveTime = year + '年' + month + '月' + day + '日0点'
            // 显示成功弹层
            this.popUpSuccess({
              text: '<div style="text-align:center;">修改成功<div><div style="text-align:center;">新参数将于' + effectiveTime + '生效,请注意通知客户</div>',
              okBtn: '返回',
              ok: () => {
                this.getParaInfo()
              }
            })
          }).catch(res => {
            this.$messgae.error(res.data.msg)
          })
        },
        info: () => { }
      })
    },
    cancelParameter () {
      // 确认弹窗
      this.alertConfirm({
        text: '确定要放弃更改参数?',
        okBtn: '确认',
        infoBtn: '我再想想',
        ok: () => {
          this.parameterData = JSON.parse(JSON.stringify(this.backupParameterData))
          this.editFlag = false
        },
        info: () => { }
      })
    },
    inputFocus (tdEle) {
      this.$refs[tdEle].getElementsByTagName('input')[0].style.border = '1px solid #938361'
    },
    inputBlur (tdEle) {
      this.$refs[tdEle].getElementsByTagName('input')[0].style.border = '1px solid #fff'
    }
  },
  computed: {
    disRate () {
      if (this.topUpRate > 100 || this.topUpRate < 0) {
        return true
      } else {
        return false
      }
    }
  },
  filters: {
    round4 (val) {
      val = val || 0
      return val.toFixed(4)
    }
  },
  watch: {
    parameterData: {
      handler () {
        this.saveDisabled = true
        let numReg = /(^0$)|(^[1-9](\d+)?(\.\d{1,4})?$)|(^\d\.\d{1,4}$)/
        for (let key in this.parameterData) {
          if (!numReg.test(this.parameterData[key])) {
            this.$message.error('数值必须为整数或小数，小数点后不超过4位。')
            this.saveDisabled = false
          }
        }
      },
      deep: true
    }
  },
  components: {
    BusinessTitle
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/variables.less';
.edit-button {
  display: inline-block;
  width: 163px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  font-size: 16px;
  color: #ffffff;
  background: @theme-blue;
  background: var(--mainColor);
  border-radius: 4px;
  margin: 22px 0 0 25px;
  cursor: pointer;
}
.textMainColor {
  font-family: ArialMT;
  font-weight: bold;
  color: @theme-blue;
  color: var(--mainColor);
}
.toUpRate {
  color: @theme-blue;
  color: var(--mainColor);
  text-decoration: underline;
  cursor: pointer;
  margin-left: 25px;
  font-size: 14px !important;
  padding: 0 !important;
}
.password {
  width: 469px;
  margin: 0 auto;
  font-size: 16px;
  .prompt {
    text-align: center;
    font-size: 20px;
    margin-bottom: 30px;
  }
  .codeItem {
    margin-bottom: 20px;
    position: relative;
    .rateUnit {
      position: absolute;
      right: 174px;
      top: 14px;
    }
  }
  .pay-psd {
    display: inline-block;
    width: 102px;
    text-align: right;
  }
}
.psd-input {
  width: 80px;
  height: 30px;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  background: #fcfcfc;
  text-align: center;
}
.dialog-footer {
  margin-bottom: 20px;
  .confirm-btn {
    width: 211px;
    height: 50px;
    font-size: 18px;
  }
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
  &:hover {
    background-color: #fff;
    color: @theme-blue;
    color: var(--mainColor);
    border-color: @theme-blue;
    border-color: var(--mainColor);
  }
}
h4 {
  margin: 0;
}
.parameterSetting/deep/ .el-dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  margin-top: 0 !important;
  margin-left: 108px;
}
.parameter-setting--show {
  .setting-detail {
    width: 579px;
    margin: 30px auto;
    border: 1px solid #d9d9d9;
    .rate-standards {
      width: 100%;
      margin: 0 auto;
      height: 41px;
      line-height: 41px;
      display: table;
      .rate-box {
        display: table-cell;
        vertical-align: middle;
        width: 50%;
        font-size: 14px;
        border-right: 1px solid #e1e1e1;
        // font-family: SimSun;
        font-weight: 400;
        color: rgba(87, 87, 87, 1);
        text-align: center;
        .titleFl {
          float: left;
          width: calc(~'40% - 1px');
          background-color: #fcfcfc;
          border-right: 1px solid #e1e1e1;
        }
        .contFl {
          float: left;
          width: 60%;
        }
        &:nth-child(3n) {
          border-right: 0;
        }
      }
      span:nth-child(2n) {
        // padding: 0 10px 0 23px;
        font-size: 16px;
        color: @theme-blue;
        color: var(--mainColor);
      }
    }
    .withdraw-times {
      width: 100%;
      text-align: center;
      font-size: 16px;
      span:nth-child(2n) {
        color: @theme-blue;
        padding: 0 10px 0 23px;
        font-size: 16px;
        color: var(--mainColor);
      }
    }
  }
  // .rate-setting-detail-left {
  //   float: left;
  // }
  // .rate-setting-detail-right {
  //   float: right;
  // }
  .rate-setting-detail-right {
    width: 99.8%;
    height: 115px;
    text-align: center;
    font-size: 16px;
    line-height: 81px;
    border: 1px solid #d9d9d9;
    .depositLowerLimit {
      font-size: 18px;
      color: @theme-blue;
      color: var(--mainColor);
    }
  }
}
.parameter-setting--edit {
  input {
    border: 1px solid #e6e6e6;
    width: 76px;
    height: 37px;
    border-radius: 5px;
    background: #fafafa;
    padding-left: 8px;
  }
  .setting-detail {
    width: 579px;
    margin: 30px auto;
    border: 1px solid #d9d9d9;
    .rate-standards {
      width: 100%;
      height: 41px;
      line-height: 41px;
      display: table;
      .rate-box {
        display: table-cell;
        vertical-align: middle;
        width: 50%;
        font-size: 16px;
        text-align: center;
      }
      span:nth-child(2n) {
        padding: 0 10px 0 23px;
        font-size: 14px;
        color: @theme-blue;
        color: var(--mainColor);
      }
    }
    .withdraw-times {
      width: 100%;
      text-align: center;
      font-size: 16px;
      span:nth-child(2n) {
        color: @theme-blue;
        padding: 0 10px 0 23px;
        font-size: 14px;
        color: var(--mainColor);
      }
    }
  }
  // .rate-setting-detail-left {
  //   float: left;
  // }
  // .rate-setting-detail-right {
  //   float: right;
  // }
  .rate-setting-detail-right {
    width: 99.8%;
    height: 115px;
    text-align: center;
    font-size: 16px;
    line-height: 81px;
    border: 1px solid #d9d9d9;
    position: relative;
  }
  span:nth-child(2n) {
    font-size: 14px;
    color: @theme-blue;
    color: var(--mainColor);
    display: inline;
  }
  .symbol {
    position: absolute;
    top: 35px;
    left: 576px;
    font-size: 16px;
  }
}
.operateBar {
  width: 100%;
  line-height: 41px;
  background-color: #FEFBFF;
  .mainColor {
    font-size:13px;
    color:rgba(147,131,96,1);
    cursor: pointer;
  }
}
h4 {
  background-color: #f0f0f0;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-bottom: 1px solid #d9d9d9;
}
.parameterSetting/deep/.credit-table-color-blue tr {
  cursor: default;
  background-color: @table-bg;
  background-color: var(--mainTableBg) !important;
}
.parameterSetting/deep/.credit-table-color-blue .el-table__body tr {
  &:nth-of-type(2n + 1):hover > td {
    background-color: @table-hover;
    background-color: var(--mainTableHover) !important;
  }
}
.parameterSetting/deep/.el-table th>.cell {
  padding: 0 3px;
}
.parameterSetting/deep/.el-table__footer-wrapper td {
  text-align: center;
}
</style>
