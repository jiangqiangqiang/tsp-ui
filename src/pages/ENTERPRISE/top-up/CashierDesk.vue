<template>
  <div class="authentication">
    <el-container class="container">
      <el-header style="height:80px;background:#fcfcfc;border-bottom: 1px solid #f1f1f3">
        <div style="width: 1340px;margin:0 auto;">
          <div class="logo">
            <svg-icon iconClass="zjf_logo" class="icon"></svg-icon>
            <span class="registerTitle">收银台</span>
          </div>
          <div style="float:right" class="logout">
            <span class="drop-down">操作员： {{opaName}}</span>
          </div>
        </div>
      </el-header>
      <div style="width: 1019px;margin: 0 auto" class="contert">
        <div class="topInfo">
          <p class="firstLine">
            <span class="leftCompany">企业名称：{{enpName}}</span>
            <span class="rightCountTitle">支付金额</span>
          </p>
          <p class="secondLine">
            <span class="leftOrder">订单号：{{$route.query.orderId}}</span>
            <span class="rightCount">{{$route.query.amount || 0 | toThousands}}</span>
          </p>
          <p class="thirdLine">
            <span class="leftRemind">
              该订单
              <span class="redColor">2小时</span> 未完成支付将自动取消
            </span>
            <span class="rightCountUp">{{$route.query.amount || 0 | amountToChinese}}</span>
          </p>
        </div>
        <div class="bankImg">
          <div class="buyTableTitle">
            企业网银支持银行列表
            <span class="bankTypeSup">（仅支持借记卡）</span>
          </div>
          <div class="dotted"></div>
          <div class="imgItem" @click="bankClick">
            <img src="~@/assets/img/gsyh.gif" alt="中国工商银行" :class="bankType==='中国工商银行'?'chooseBank':''" />
            <img src="~@/assets/img/nyyh.gif" alt="中国农业银行" :class="bankType==='中国农业银行'?'chooseBank':''" />
            <img src="~@/assets/img/zgyh.gif" alt="中国银行" :class="bankType==='中国银行'?'chooseBank':''" />
            <img src="~@/assets/img/jsyh.gif" alt="中国建设银行" :class="bankType==='中国建设银行'?'chooseBank':''" />
            <img src="~@/assets/img/jtyh.gif" alt="交通银行" :class="bankType==='交通银行'?'chooseBank':''" />
            <img src="~@/assets/img/zxyh.gif" alt="中信银行" :class="bankType==='中信银行'?'chooseBank':''" />
            <img src="~@/assets/img/gdyh.gif" alt="光大银行" :class="bankType==='光大银行'?'chooseBank':''" />
            <img src="~@/assets/img/gfyh.gif" alt="广发银行" :class="bankType==='广发银行'?'chooseBank':''" />
            <img src="~@/assets/img/zsyh.gif" alt="招商银行" :class="bankType==='招商银行'?'chooseBank':''" />
            <img src="~@/assets/img/xyyh.gif" alt="兴业银行" :class="bankType==='兴业银行'?'chooseBank':''" />
            <img src="~@/assets/img/pfyh.gif" alt="浦东发展银行" :class="bankType==='浦东发展银行'?'chooseBank':''" />
            <img src="~@/assets/img/bjyh.gif" alt="北京银行" :class="bankType==='北京银行'?'chooseBank':''" />
            <img src="~@/assets/img/payh.gif" alt="平安银行" :class="bankType==='平安银行'?'chooseBank':''" />
            <img src="~@/assets/img/shncsyyh.gif" alt="上海农村商业银行" :class="bankType==='上海农村商业银行'?'chooseBank':''" />
            <img src="~@/assets/img/yzcxyh.gif" alt="邮储银行" :class="bankType==='邮储银行'?'chooseBank':''" />
            <img src="~@/assets/img/msyh.gif" alt="民生银行" :class="bankType==='民生银行'?'chooseBank':''" />
            <img src="~@/assets/img/shyh.gif" alt="上海银行" :class="bankType==='上海银行'?'chooseBank':''" />
            <img src="~@/assets/img/gzyh.gif" alt="贵州银行" :class="bankType==='贵州银行'?'chooseBank':''" />
            <img src="~@/assets/img/hxyh.gif" alt="华夏银行" :class="bankType==='华夏银行'?'chooseBank':''" />
            <img src="~@/assets/img/hzyh.gif" alt="杭州银行" :class="bankType==='杭州银行'?'chooseBank':''" />
            <img src="~@/assets/img/qdyh.gif" alt="青岛银行" :class="bankType==='青岛银行'?'chooseBank':''" />
          </div>
          <div class="topay">
            <Button title="立即支付" class="btn" @handleClick="CountersignTopUp" :disabled="!form"></Button>
          </div>
        </div>
      </div>
    </el-container>
    <form method="POST" style="display:none;" ref="postRequest" :action="url">
      <!-- target="_blank" -->
      <input type="text" name="returnURL" :value="returnURL">
      <!-- <input type="text" name="notifyURL" :value="notifyURL"> -->
      <input type="text" name="tspOrderNo" :value="tspOrderNo">
      <input type="text" name="tspID" :value="tspID">
      <input type="text" name="amount" :value="orderAmount">
      <input type="text" name="accountID" :value="accountID">
      <input type="text" name="timestamp" :value="timestamp">
      <input type="text" name="subject" :value="subject">
      <input type="text" name="sign" :value="sign">
      <input type="text" name="gateId" :value="bankCode">
    </form>
  </div>
</template>

<script>
import Header from '@/components/Header'
import { Getitem } from '@/services/CommonService.js'
import settings from '@/settings'
export default {
  name: 'cashierDesk',
  data () {
    return {
      bankType: '',
      returnURL: '',
      tspOrderNo: '',
      tspID: '',
      amount: 0,
      accountID: '',
      timestamp: '',
      subject: '',
      sign: '',
      url: '',
      orderNum: '',
      orderAmount: '',
      notifyURL: '',
      enpName: JSON.parse(Getitem('userData')).enpName,
      opaName: JSON.parse(Getitem('userData')).adminName,
      // 获取三方充值信息
      getThirdpartyUrl: settings.apiGateway.getThirdparty,
      // 获取银行网管code
      getBankCodeUrl: settings.apiGateway.getBankCode,
      // 选择银行接口
      getSelectBankUrl: settings.apiGateway.getSelectBank,
      form: '',
      bankCodeList: [],
      bankCode: ''
    }
  },
  components: {
    Header
  },
  methods: {
    bankClick (e) {
      if (e.target.nodeName.toLowerCase() === 'img') {
        this.bankType = e.target.alt
        let bankCode = this.bankCodeList.filter(item => {
          return item.name === this.bankType
        })[0].code + ''
        this.fetch(`${this.getSelectBankUrl}${this.$route.query.orderId}/${bankCode}`, 'post').then(data => {
          this.getFormData(bankCode)
        }).catch(data => {
          this.$message.error(data.data.msg)
        })
      }
    },
    getFormData (bankCode) {
      this.fetch(`${this.getThirdpartyUrl}${this.$route.query.orderId}`).then(data => {
        this.orderNum = data.data.depositNumber
        this.url = data.data.payRequestUrl
        this.tspOrderNo = data.data.payReqDto.tspOrderNo
        this.returnURL = data.data.payReqDto.returnURL
        this.orderAmount = data.data.payReqDto.amount
        this.accountID = data.data.payReqDto.accountID
        this.notifyURL = data.data.payReqDto.notifyURL
        this.subject = data.data.payReqDto.subject
        this.sign = data.data.payReqDto.sign
        this.timestamp = data.data.payReqDto.timestamp
        this.tspID = data.data.payReqDto.tspID
        this.form = this.$refs.postRequest
        this.bankCode = bankCode
      }).catch(data => {
        this.$message.error(data.data.msg)
      })
    },
    getBankCode () {
      this.fetch(`${this.getBankCodeUrl}`).then(data => {
        this.bankCodeList = data.data
      }).catch(data => {
        this.$message.error(data.data.msg)
      })
    },
    CountersignTopUp () {
      if (this.form) {
        this.form.submit()
      } else {
        this.$message.error('订单错误')
      }
    }
  },
  created () {
    this.getBankCode()
    // this.getFormData()
  },
  computed: {
    // bankCode () {
    //   let selectCode = this.bankCodeList.filter(item => {
    //     return item.name === this.bankType
    //   })
    //   if (selectCode.length > 0) {
    //     selectCode = selectCode[0].code
    //   } else {
    //     selectCode = ''
    //   }
    //   return selectCode
    // }
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/less/variables';
.el-header,
.el-footer {
  padding: 0;
}
.topInfo {
  width: calc(~'100% - 2px');
  height: 131px;
  background-color: #f6fffe;
  border: 1px solid rgba(230, 230, 230, 1);
  margin-top: 22px;
  .firstLine {
    margin: 24px 31px 17px 29px;
    font-size: 18px;
    color: rgba(75, 75, 75, 1);
  }
  .rightCountTitle,
  .rightCount,
  .rightCountUp {
    float: right;
  }
  .secondLine {
    margin: 0 31px 17px 29px;
  }
  .thirdLine {
    margin: 0 31px 0 29px;
    font-size: 14px;
    color: rgba(75, 75, 75, 1);
    .redColor {
      color: #db6a6a;
    }
  }
  .leftOrder {
    font-size: 14px;
    color: rgba(75, 75, 75, 1);
  }
  .rightCount {
    font-size: 20px;
    font-family: Arial;
    font-weight: bold;
    color: rgba(37, 183, 170, 1);
    margin-top: -4px;
  }
}
.bankImg {
  width: 952px;
  margin: 0 auto;
}
.container {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
}
.icon {
  display: inline-block;
  width: 137px !important;
  height: 43px !important;
  color: @theme-blue;
  color: var(--mainColor);
  vertical-align: middle;
  background-repeat: no-repeat;
  background-size: cover;
}
.logo {
  float: left;
  margin: 15px 0 0 56px;
  font-size: 30px;
  text-align: center;
  font-size: 15px;
  font-weight: 400;
  color: rgba(75, 75, 75, 1);
}
.registerTitle {
  margin-left: 31px;
}
.logout {
  margin-right: 50px;
  float: right;
  font-size: 16px;
  margin-top: 30px;
  .drop-down {
    cursor: pointer;
    font-size: 16px;
  }
}
.buyTableTitle {
  height: 16px;
  font-size: 16px;
  color: rgba(101, 101, 101, 1);
  margin: 38px 0 15px;
  padding-left: 9px;
  border-left: 4px solid @theme-blue;
  border-left: 4px solid var(--mainColor);
  .bankTypeSup {
    font-size: 14px;
    color: rgba(101, 101, 101, 1);
    opacity: 0.6;
  }
}
.dotted {
  border-top: 1px dotted #000;
  width: 100%;
  height: 1px;
  margin-bottom: 33px;
}
.imgItem {
  img {
    width: 171px;
    height: 48px;
    border: 1px solid #D9D9D9;
    margin-right: 15px;
    margin-bottom: 16px;
    cursor: pointer;
  }
  img:nth-child(5n) {
    margin-right: 0;
  }
  .chooseBank {
    border: 3px solid @theme-blue;
    border: 3px solid var(--mainColor);
    width: 167px;
    height: 44px;
  }
}
.topay {
  width: 403px;
  height: 50px;
  margin: 23px auto;
}
.btn {
  width: 100%;
  height: 100%;
  font-size: 18px;
  color: rgba(255, 255, 255, 1);
}
</style>
