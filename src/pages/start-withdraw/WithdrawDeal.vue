<template>
  <div class="withdraw-deal">
    <BusinessTitle isShowBack title="提现交易详情"></BusinessTitle>
    <p class="stepText">提现进度</p>
    <Steps :stepInfo="stepInfo"></Steps>
    <DealDetail :dealDetail="basicInfo">
      <template slot="dealInfo">
        <div class="enpInfo">
          <div class="topUpInfo">
            <div>提现企业</div>
            <div>企业名称： {{basicInfo.enterpriseName}}</div>
            <div>企业证件号：{{basicInfo.enterpriseCreditCode}}</div>
          </div>
        </div>

      </template>
      <template slot="feeInfo">
        <div class="feeInfo">
          <table>
            <tr>
              <td>提现金额</td>
              <td>
                <span>{{basicInfo.amount || 0 | toThousands}}</span>
              </td>
            </tr>
            <tr>
              <td>服务费</td>
              <td>
                <span>{{basicInfo.fee || 0 | toThousands}}</span>
              </td>
            </tr>
            <tr>
              <td>实际到账金额</td>
              <td>
                <span class="amountColor">{{basicInfo.realAmount || 0 | toThousands}}</span>
                <p class="cnfnot">{{basicInfo.realAmount || 0 | amountToChinese}}</p>
              </td>
            </tr>
          </table>
        </div>
      </template>
    </DealDetail>
  </div>
</template>

<script>
import settings from '@/settings'
import BusinessTitle from '@/components/BusinessTitle'
import DealDetail from '@/components/DealDetail'
import Steps from '@/components/Steps'
export default {
  name: 'withdrawDeal',
  components: { BusinessTitle, DealDetail, Steps },
  data () {
    return {
      // 交易详单基本信息
      basicInfo: {
        // 交易时间
        finalTime: '',
        // 业务类型
        transactionType: '',
        payerName: '',
        payeeName: '',
        // 信用代码
        payerCreditCode: '',
        payeeCreditCode: '',
        amount: '',
        rebateAmount: '',
        fee: '',
        realAmount: ''
      },
      // 获取交易编号
      txCode: this.$route.query.code,
      // 提现详单 Url
      withdrawDetailUrl: settings.apiGateway.withDrawDetalAll
    }
  },
  created () {
    this.checkOderStatus()
  },
  methods: {
    checkOderStatus () {
      this.fetch(`${this.withdrawDetailUrl}/${this.txCode}`).then(data => {
        this.basicInfo = data.data
      }).catch(data => {
        this.$message.error(data.msg)
      })
    }
  },
  computed: {
    stepInfo () {
      if (this.basicInfo.status === 'Pending') {
        return {
          list: [{ status: '提现申请提交成功，金额冻结', statusTime: this.basicInfo.applyTime }, { status: '审核通过，提交银行处理', statusTime: '' }, { status: '预计到账时间', statusTime: '' }],
          step: 1
        }
      } else if (this.basicInfo.status === 'Reject') {
        return {
          list: [{ status: '提现申请提交成功，金额冻结', statusTime: this.basicInfo.applyTime }, { status: '审核被拒绝', statusTime: this.basicInfo.finalTime }],
          step: 2
        }
      } else if (this.basicInfo.status === 'Cancel') {
        return {
          list: [{ status: '提现申请提交成功，金额冻结', statusTime: this.basicInfo.applyTime }, { status: '提现取消', statusTime: this.basicInfo.finalTime }],
          step: 2
        }
      } else if (this.basicInfo.status === 'Failed') {
        return {
          list: [{ status: '提现申请提交成功，金额冻结', statusTime: this.basicInfo.applyTime }, { status: '系统异常，提现失败', statusTime: this.basicInfo.finalTime }],
          step: 2
        }
      } else if (this.basicInfo.status === 'Expired') {
        return {
          list: [{ status: '提现申请提交成功，金额冻结', statusTime: this.basicInfo.applyTime }, { status: '申请超时', statusTime: this.basicInfo.finalTime }],
          step: 2
        }
      } else if (this.basicInfo.status === 'Sending') {
        return {
          list: [{ status: '提现申请提交成功，金额冻结', statusTime: this.basicInfo.applyTime }, { status: '审核通过，提交银行处理', statusTime: this.basicInfo.auditTime }, { status: '预计到账时间', statusTime: this.basicInfo.endDate }],
          step: 2
        }
      } else if (this.basicInfo.status === 'BankRebut') {
        return {
          list: [{ status: '提现申请提交成功，金额冻结', statusTime: this.basicInfo.applyTime }, { status: '审核通过，提交银行处理', statusTime: this.basicInfo.auditTime }, { status: '银行驳回，提现失败', statusTime: this.basicInfo.finalTime }, { status: '金额退还到账户', statusTime: this.basicInfo.finalTime }],
          step: 4
        }
      } else if (this.basicInfo.status === 'Succeed') {
        return {
          list: [{ status: '提现申请提交成功，金额冻结', statusTime: this.basicInfo.applyTime }, { status: '审核通过，提交银行处理', statusTime: this.basicInfo.auditTime }, { status: '到账成功', statusTime: this.basicInfo.finalTime }],
          step: 3
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/variables';
.withdraw-deal {
  .enpInfo {
    width: 100%;
    display: table;
  }
  .withdrawInfo {
    display: table-cell;
    text-align: justify;
    vertical-align: middle;
    width: calc(~'50% - 16px');
    color: rgba(101, 101, 101, 1);
    font-size: 14px;
    border: 1px solid #e1e1e1;
    background-color: #fcfcfc;
    line-height: 35px;
    padding-left: 10px;
  }
  .topUpInfo {
    width: calc(~'100% - 12px');
    color: rgba(101, 101, 101, 1);
    font-size: 14px;
    border: 1px solid #e1e1e1;
    background-color: #f2f9ff;
    background-color: var(--mainTableBg);
    line-height: 35px;
    padding-left: 10px;
  }
  .withdrawReal {
    color: @theme-blue;
    color: var(--mainColor);
    font-weight: bold;
  }
  .realCh {
    color:rgba(87,87,87,1);
    opacity:0.6;
  }
  .dotted {
    border-top: 1px dotted #4B4B4B;
    width: 100%;
    height: 1px;
    margin: 10px 0 10px -10px;
    padding: 0 10px;
  }
  .stepText {
    font-size: 18px;
    font-weight: bold;
    color: rgba(87, 87, 87, 1);
    margin: 40px 0 30px 0;
    text-align: center;
  }
}
table {
  width: 100%;
  .amountColor {
    font-size: 16px;
    font-weight: bold;
    color: @theme-blue;
    color: var(--mainColor);
  }
  tr {
    td {
      height: 40px;
      line-height: 40px;
      border: 1px solid #e6e6e6;
    }
    td:first-child {
      width: 162px;
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
.cnfnot {
  font-size: 13px;
  line-height: 13px;
  margin-bottom: 8px;
}
</style>
