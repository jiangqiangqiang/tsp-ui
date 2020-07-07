<template>
  <div>
    <!-- <BusinessTitle title="联合发令" @click="goBack" isShowBack></BusinessTitle> -->
    <div class="business-title"><a class="back-btn" @click="goBack">&lt; 返回</a>联合发令</div>
    <div class="step">
      <div class="wrapper">
        <ul class="step-list">
          <li v-for="(item,index) in list" :key="index" :class="[index + 1 === step ? 'visible' : '']">
            <span class="content">
              <span class="number">{{index + 1}}</span>{{item}}
            </span>
            <i v-if="index < list.length - 1" class="icon el-icon-arrow-right "></i>
          </li>
        </ul>
      </div>
    </div>
    <slot>
      <div class="state">
        <slot name="state">
          <!--     等待企业确认方案     -->
          <WaitConfirmSchema v-if="processState === 'WaitConfirmSchema'" :orderData="orderData"></WaitConfirmSchema>
          <!--     等待企业审批取消申请     -->
          <WaitEnpCancelConfirm v-if="processState === 'WaitEnpCancelConfirm'" :orderData="orderData"></WaitEnpCancelConfirm>
          <!--     等待资金方审批取消申请     -->
          <WaitFundCancelConfirm v-if="processState === 'WaitFundCancelConfirm'" :orderData="orderData"></WaitFundCancelConfirm>
          <!--    已取消      -->
          <Cancel v-if="processState === 'Canceled'" :orderData="orderData"></Cancel>
          <!--    发令成功      -->
          <Succeed v-if="processState === 'Succeed'"></Succeed>
          <!--     等待资金方付款     -->
          <WaitPayment v-if="processState === 'WaitPayment'" :orderData="orderData" :orderId="orderId"></WaitPayment>
          <!--     等待背书状态     -->
          <WaitEndorse v-if="processState === 'WaitEndorse'" :orderData="orderData" :orderId="orderId"></WaitEndorse>
          <!--     企业方已提交背书,等待确认背书的状态      -->
          <WaitConfirmEndorse v-if="processState === 'WaitConfirmEndorse'" :orderData="orderData" :orderId="orderId"></WaitConfirmEndorse>
          <!-- <div class="title">{{title}}</div> -->
        </slot>
      </div>
      <div class="reshimot">
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane label="发令信息" name="first">
            <div style="box-sizing: border-box;border-top:1px solid #e6e6e6;">
              <ul class="token-message">
                <li>交易编号</li>
                <li>{{tokenData.orderId}}</li>
                <li>申请时间</li>
                <li>{{tokenData.createdOn}}</li>
                <li>分润比例</li>
                <li v-if="role === 'fund'">我方{{tokenData.fundInterestRate}}%(企业方{{tokenData.enterpriseInterestRate}}%)</li>
                <li v-if="role === 'enterprise'">我方{{tokenData.enterpriseInterestRate}}%(资金方{{tokenData.fundInterestRate}}%)</li>
              </ul>
              <ul class="token-message">
                <li>发令金额</li>
                <li>{{tokenData.amount | toThousands}}</li>
                <li v-if="role === 'fund'">企业名称</li>
                <li v-if="role === 'enterprise'">资金方名称</li>
                <li v-if="role === 'enterprise'">{{tokenData.fundName}}</li>
                <li v-if="role === 'fund'">{{tokenData.enterpriseName}}</li>
                <li v-if="role === 'fund'">企业统一社会信用代码</li>
                <li v-if="role === 'enterprise'">资金方统一社会信用代码</li>
                <li v-if="role === 'enterprise'">{{tokenData.fundCode}}</li>
                <li v-if="role === 'fund'">{{tokenData.enterpriseCode}}</li>
              </ul>
            </div>
          </el-tab-pane>
          <el-tab-pane label="票据信息" name="second">
            <div style="box-sizing: border-box;border-top:1px solid #e6e6e6;">
              <ul class="token-message">
                <li>类型</li>
                <li>{{bileData.billType}}</li>
                <li>出票日期</li>
                <li>{{bileData.issuingDate}}</li>
                <li>到期日期</li>
                <li>{{bileData.expiryDate}}</li>
              </ul>
              <ul class="token-message">
                <li>票面金额</li>
                <li>¥{{bileData.amount | toThousands}}</li>
                <li>票号</li>
                <li style="width: 579px">{{bileData.billNo}}</li>
              </ul>
              <ul class="token-message">
                <li>每十万贴息</li>
                <li>¥{{bileData.interestRate | toThousands}}/(年利率 {{bileData.yearRate | toThousands}}%)</li>
                <li>承兑人</li>
                <li>{{bileData.acceptor}}</li>
                <li>剩余天数</li>
                <li>{{bileData.lastDay}}</li>
              </ul>
            </div>
          </el-tab-pane>
          <el-tab-pane label="跟踪记录" name="third">
            <div class="record">
              <ul class="record-list">
                <li v-for="(item,index) in logData" :key="index">
                  <span class="icon--dot"></span>
                  <div>
                    <span style="margin-right: 100px;">{{item.createdOn}}</span>
                    <span class="content">{{item.eventDesc}}</span>
                    <span v-if="item.event === 'Rejected'" @click="showSecRecord('Rejected', item, index)">
                      <span  class="word" v-if="idx.indexOf(index) != -1">收起</span>
                      <span  class="word" v-else>展开</span>
                      <!-- <div class="secMessage" v-if="rejectedShow">拒绝原因: {{item.cancellationReason}}</div> -->
                      <div class="secMessage" v-if="idx.indexOf(index) != -1">拒绝原因: {{item.cancellationReason}}</div>
                    </span>
                    <span v-if="item.event === 'EnterpriseApplyCancellation'" @click="showSecRecord('Rejected', item, index)">
                      <span  class="word" v-if="idx.indexOf(index) != -1">收起</span>
                      <span  class="word" v-else>展开</span>
                      <div class="secMessage" v-if="idx.indexOf(index) != -1">取消原因: {{item.cancellationReason}}</div>
                    </span>
                    <span v-if="item.event === 'FunderApplyCancellation'" @click="showSecRecord('Rejected', item, index)">
                      <span  class="word" v-if="idx.indexOf(index) != -1">收起</span>
                      <span  class="word" v-else>展开</span>
                      <div class="secMessage" v-if="idx.indexOf(index) != -1">取消原因: {{item.cancellationReason}}</div>
                    </span>
                    <span v-if="item.event === 'Endorsed'">
                      <span  @click="showSecRecord('Endorsed', item, index)" class="word" v-if="idx.indexOf(index) != -1">收起</span>
                      <span  @click="showSecRecord('Endorsed', item, index)" class="word" v-else>展开</span>
                      <div class="proof--main" v-if="idx.indexOf(index) != -1">
                        <img @click="endorseImgShow=true;imgShow=true;" class="proof-img" :src="endorseImg" alt="背书证据">
                        <div @click="close" class="big-img" v-if="endorseImgShow">
                          <img class="img-message-big" v-if="endorseImgShow" :src="endorseImg" alt="背书证据">
                        </div>
                        <p>背书证据</p>
                      </div>
                    </span>
                    <span v-if="item.event === 'Received'" >
                      <span @click="showSecRecord('Received', item, index)" class="word" v-if="idx.indexOf(index) != -1">收起</span>
                      <span @click="showSecRecord('Received', item, index)" class="word" v-else>展开</span>
                       <div class="proof--main" v-if="idx.indexOf(index) != -1">
                         <img class="proof-img" :src="receivedImg" alt="签收证据" @click="receivedImgShow=true;imgShow=true;">
                         <div @click="close" class="big-img" v-if="receivedImgShow">
                           <img class="img-message-big" v-if="receivedImgShow" :src="receivedImg" alt="签收证据">
                         </div>
                         <p>签收证据</p>
                        </div>
                    </span>
                  </div>
              </li>
            </ul>
          </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </slot>
    <div class="img-layer" v-if="imgShow" @click="close"></div>
  </div>
</template>

<script>
import BusinessTitle from '@/components/BusinessTitle'
import WaitTimeOut from '@/components/WaitTimeOut'
import Cancel from '@/components/joint-token-state/Cancel'
import Succeed from '@/components/joint-token-state/Succeed'
import WaitConfirmSchema from '@/components/joint-token-state/WaitConfirmSchema'
import WaitEnpCancelConfirm from '@/components/joint-token-state/WaitEnpCancelConfirm'
import WaitFundCancelConfirm from '@/components/joint-token-state/WaitFundCancelConfirm'
import WaitConfirmEndorse from '@/components/joint-token-state/WaitConfirmEndorse'
import WaitEndorse from '@/components/joint-token-state/WaitEndorse'
import WaitPayment from '@/components/joint-token-state/WaitPayment'
import CommonDownload from '@/components/CommonDownload'
import settings from '@/settings'

export default {
  components: {
    BusinessTitle,
    WaitConfirmSchema,
    Cancel,
    Succeed,
    WaitEnpCancelConfirm,
    WaitFundCancelConfirm,
    WaitPayment,
    WaitEndorse,
    WaitConfirmEndorse,
    WaitTimeOut,
    CommonDownload
  },
  props: {
    // 跟踪信息
    logData: {
      type: Array,
      default: () => {
        /*
        * eventlist: Started(资金方发起联合发令),Confirmed(确认方案),Rejected(拒绝),FunderApplyCancellation(资金方申请取消联合发令),cancelAccepted,cancelRejected(拒绝申请取消),enterpriseApplyCancellation(企业方申请取消),Endorsed(背书),Received(确认背书),payed(支付),BillExpired(票据到期)
        */
        return []
      }
    },
    // 票据信息
    bileData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 发令信息
    tokenData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 订单信息
    orderData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      activeName: 'first',
      list: ['资金方发起联合发令', '等待企业确认方案', '等待资金方付款', '等待企业背书', '等待资金方确认', '联合发令成功'],
      tokenSteps: ['Initiating', 'ConfirmScheme', 'WaitingPayment', 'WaitingEndorsement', 'WaitingFundConfirm', 'JoinConfirmSuccess'],
      endorseWord: '展开',
      receivedWord: '展开',
      rejectedWord: '展开',
      EnterpriseWord: '展开',
      FunderWord: '展开',
      EnterpriseShow: false,
      FundShow: false,
      endorseShow: false,
      receivedShow: false,
      rejectedShow: false,
      role: '',
      // step: 1,
      type: 'WaitPayment',
      title: '请等待企业确认联合发令方案',
      orderId: this.$route.query.code,
      // 下载凭证接口
      downloadCodeUrl: settings.apiGateway.downloadCode,
      // 下载接口
      downloadUrl: settings.downloadUrl,
      header: '',
      code: '',
      endorseImg: '',
      receivedImg: '',
      idx: [],
      // 放大显示
      receivedImgShow: false,
      endorseImgShow: false,
      imgShow: false
    }
  },
  created () {
    this.role = this.getUserRole()
  },
  methods: {
    goBack () {
      this.$router.push('/' + this.role + '/joint-token-list')
    },
    close () {
      this.imgShow = false
      this.receivedImgShow = false
      this.endorseImgShow = false
    },
    // 获取图片 code方法
    getCode (imgId, type) {
      let fileId = imgId
      this.fetch(`${this.downloadCodeUrl}/${fileId}`).then(data => {
        this.header = data.data.token
        this.code = data.data.code
        this.setImgHeader(type)
      }).catch(data => {
        this.$message({
          type: 'error',
          message: '获取文件名失败！'
        })
      })
    },
    setImgHeader (type) {
      this.axios({
        url: this.downloadUrl,
        params: { code: this.code },
        headers: {
          'FileToken': `Bearer ${this.header}`
        },
        responseType: 'blob'
      }).then(data => {
        function blobToDataURL (blob, callback) {
          var a = new FileReader()
          a.onload = function (e) {
            callback(e.target.result)
          }
          a.readAsDataURL(blob)
        }
        blobToDataURL(data.data, (result) => {
          if (type === 'Endorsed') {
            this.endorseImg = result
          } else {
            this.receivedImg = result
          }
        })
      }).catch(data => {
        this.$message({
          type: 'error',
          message: '获取code失败！'
        })
      })
    },
    showSecRecord (type, item, index) {
      if (this.idx.indexOf(index) === -1) {
        if (type === 'Endorsed') {
          let fileId = item.enterpriseEndorsement
          this.getCode(fileId, type)
        } else if (type === 'Received') {
          let fileId = item.fundEndorsement
          this.getCode(fileId, type)
        }
        this.idx.push(index)
      } else {
        this.idx = this.idx.filter(function (item) {
          return item !== index
        })
      }

      // return
      // let fileId
      // if (type === 'Endorsed') {
      //   fileId = item.enterpriseEndorsement
      // } else {
      //   fileId = item.fundEndorsement
      // }
      // if (type === 'Endorsed') {
      //   this.endorseShow = !this.endorseShow
      //   if (this.endorseShow) {
      //     this.getCode(fileId, type)
      //   } else {
      //   }
      // } else if (type === 'Received') {
      //   this.receivedShow = !this.receivedShow
      //   if (this.receivedShow) {
      //     this.getCode(fileId, type)
      //     this.receivedWord = '收起'
      //   } else {
      //     this.receivedWord = '展开'
      //   }
      // } else if (type === 'Rejected') {
      //   switch (item.event) {
      //     case 'Rejected':
      //       this.rejectedShow = !this.rejectedShow
      //       this.rejectedShow ? this.rejectedWord = '收起' : this.rejectedWord = '展开'
      //       break
      //     case 'EnterpriseApplyCancellation':
      //       this.EnterpriseShow = !this.EnterpriseShow
      //       this.EnterpriseShow ? this.EnterpriseWord = '收起' : this.EnterpriseWord = '展开'
      //       break
      //     case 'FunderApplyCancellation':
      //       this.FundShow = !this.FundShow
      //       this.FundShow ? this.FunderWord = '收起' : this.FunderWord = '展开'
      //       break
      //   }
      // }
    }
  },
  computed: {
    // 获取当前步骤
    step () {
      return this.tokenSteps.indexOf(this.tokenData.issueStep) + 1 || 1
    },
    // 当前状态
    processState () {
      return this.orderData.currentState
    }
  }
}
</script>

<style lang="less" scoped>
  @import "~@/assets/less/variables";
  .business-title {
    width: 100%;
    height: 80px;
    line-height: 80px;
    color: #4a4a4a;
    text-align: center;
    font-size: 20px;
    font-weight: 500;
    position: relative;
    background-color: @theme-blue-light;
    background-color: var(--mainLightColor);
    .back-btn {
      position: absolute;
      color: #4a4a4a;
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      left: 20px;
      top: 5px;
      cursor: pointer;
      font-weight: 400;
    }
    .back-btn:hover {
      color: @theme-blue;
      color: var(--mainColor);
    }
  }
.step{
  width:95%;
  margin:0 auto;
  height:45px;
  color:#333;
  margin-top: 26px;
  background-color:#fafafa;
  .wrapper{
    text-align: center;
  }
  .step-list{
    width: 100%;
    height:45px;
    line-height: 45px;
    display: inline-block;
    clear: both;
    overflow: hidden;
    box-sizing: border-box;
    padding-left: 15px;
    li{
      position:relative;
      float:left;
      padding:0px 15px 0px 7px;
      text-align: center;
      //margin-right:160px;
      .content {
        .number{
        display: inline-block;
        width:20px;
        height:20px;
        margin-right:5px;
        color:#333;
        line-height:20px;
        border-radius: 10px;
        background-color:#e8e8e8;
      }
      }
      .icon {
        width:10px;
        height:13px;
        font-size: 12px;
        padding-left:8px
      }
      // &:after{
      //   content:'';
      //   position:absolute;
      //   right:-155px;
      //   top:50%;
      //   margin-top:-1px;
      //   width:150px;
      //   z-index:9;
      // }
      &:last-child{
        margin-right:0;
        &:after{
          display: none;
        }
      }
    }
    .visible{
      .content {
        display: inline-block;
        color: #fff;
        height:44px;
        padding: 0 15px;
        border-radius: 5px;
        background-color: @theme-blue;
        background-color: var(--mainColor);
        .number{
          color: @theme-blue;
          color:var(--mainColor);
          background-color:#fff;
          font-weight: 700
        }
      }
    }
  }
}
.state {
  width: 100%;
  min-height:166px;
  _height: 166px;
  padding-left:60px;
  margin-top: 20px;
  box-sizing: border-box;
  .title{
    padding-top: 42px;
    font-size: 19px;
    font-weight: 900
  }
}
.reshimot {
  margin-top: 28px;
  .token-message {
    height: 40px;
    line-height:40px;
    box-sizing: border-box;
    border-bottom: 1px solid #e6e6e6;
    // border-left: 1px solid #e6e6e6;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    li {
      box-sizing: border-box;
      border-right:1px solid #e6e6e6;
      padding-left: 18px;
      &:nth-of-type(2n+1) {
        width: 159px;
        background: #fcfcfc;
        padding-left: 0;
        text-align: center
      }
      &:nth-of-type(2n) {
        width: 200px;
      }
      &:last-child {
        flex: 1;
      }
    }
  }
  .record {
    width:99.8%;
    min-height: 80px;
    _height: 80px;
    border: 1px solid #e6e6e6;
    border-top: none;
    padding: 17px 0;
    .record-list {
      margin-left: 40px;
      li {
        position: relative;
        padding-bottom: 30px;
        .icon--dot {
          display: inline-block;
          width: 1px;
          position: absolute;
          top: -1px;
          left: 177px;
          width: 7px;
          height: 7px;
          border-radius: 7px;
          background: #c8c8c8;
          z-index: 10;
        }
        &:after{
          content: '';
          display: inline-block;
          width:1px;
          height: 100%;
          position:absolute;
          background: #e6e6e6;
          top: 8px;
          left: 180px;
          z-index: 5;
        }
        &:last-child{
          &:after{
            display: none;
          }
        }
        .word {
          color: @theme-blue;
          color: var(--mainColor);
          text-decoration: underline;
          cursor: pointer;
        }
        .seconde-message {
          margin-left: 255px;
          padding-top: 20px;
          text-decoration: none;
        }
        .seconde-message-active {
          margin-left: 255px;
          padding-top: 20px;
          text-decoration: none;
          display: none;
        }
      }
    }
  }
}

.reshimot/deep/.el-tabs__header {
     margin: 0
}

.reshimot/deep/.el-tabs__item {
  width: 159px;
  text-align: center;
  background: #e5e5e5;
  border: 1px solid #e5e5e5;
  border-right: 1px solid #fff;
}

.reshimot/deep/.el-tabs__item:last-child{
    border-right-color: #e5e5e5
}
.reshimot/deep/.el-tabs__item:hover {
  border-color: 1px solid @theme-blue;
  border-color: 1px solid var(--mainColor)!important;
  color: @theme-blue;
  color: var(--mainColor)!important;
  background-color: @theme-blue-light;
  background-color: var(--mainLightColor)!important;
}
.reshimot/deep/.el-tabs__item.is-active {
  border-color: 1px solid @theme-blue;
  border-color: 1px solid var(--mainColor)!important;
  color: @theme-blue;
  color: var(--mainColor)!important;
  background-color: @theme-blue-light;
  background-color: var(--mainLightColor)!important;
}
  .proof--main {
    width: 250px;
    text-align: center;
    margin: 15px 0  15px 230px;
    background-color: #f0f0f0;
    .proof-img {
      width: 100%;
      height: 180px;
      cursor: pointer;
    }
  }
  .secMessage{
    margin: 15px 0 0 250px;
  }
  // .secMessage-cancel {
  //   width: 250px;
  //   text-align: center;
  //   margin: 15px 0 0 210px;
  // }
  .big-img {
    width:1500px;
    height: 80%;
    display: block;
    position: fixed;
    top:0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 1000;
    cursor: pointer;
    text-align: center;
    .img-message-big {
      height: 100%;
      z-index: 1000;
      cursor: pointer;
    }
  }
  .img-layer{
    position: fixed;
    cursor: pointer;
    z-index: 999;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.7);
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>

<style lang="less">
@import '~@/assets/less/variables';
/*
.el-tabs__item:hover {
  border-color: 1px solid @theme-blue;
  border-color: 1px solid var(--mainColor)!important;
  color: @theme-blue;
  color: var(--mainColor)!important;
  background-color: @theme-blue-light;
  background-color: var(--mainLightColor)!important;
}
.el-tabs__item.is-active {
  border-color: 1px solid @theme-blue;
  border-color: 1px solid var(--mainColor)!important;
  color: @theme-blue;
  color: var(--mainColor)!important;
  background-color: @theme-blue-light;
  background-color: var(--mainLightColor)!important;
}
*/
</style>
