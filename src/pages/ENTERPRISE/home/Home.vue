<template>
  <div class="enterPriceHome">
    <div class="enterprise_assets">企业资产<span class="checkDetail" @click="toBalanceList">查看结构</span></div>
    <div class="enterprise_assets_content">
      <div class="cashCount">
        <div class="countTop">
          <div class="leftCountName">
            <span class="textCashIcon"><svg-icon iconClass='qyrz_zjf' className='iconTotol'></svg-icon>资产总额 </span>
          </div>
          <!-- <div class="rightCountNum"></div> -->
        </div>
        <div class="detailTitle">
          <span class="mainColor">{{$store.state.account.total || 0 | toThousands}}</span>
          <span class="balanceItem">
            可用余额：<span style="fontWeight:bold;">{{$store.state.account.availableBalance || 0 | toThousands}}</span>
            <!-- <div class="checkListI" @click="cashDetailCount('valible')">查看结构</div> -->
          </span>
          <span class="balanceItem">
            冻结额度：<span style="fontWeight:bold;">{{$store.state.account.frozenBalance || 0 | toThousands}}</span>
            <!-- <div class="checkListI" @click="cashDetailCount('frozen')">查看结构</div> -->
          </span>
        </div>
      </div>
    </div>
    <div class="enterprise_assets">业务处理</div>
    <div class="business-entrance">
      <ul :class="[isAdmin === 'Operator' ? 'menu-operator' :' menu-admin']">
        <li v-for="(item,index) in menuList" :key="index" v-if="isAdmin === 'Operator'" class="adminCont">
          <div :class="[Role === 'fund' || isIE ? item.className : item.classNameY]" @click="goUrl(item)">
            <svg-icon :iconClass='item.classNameI' className='icon'></svg-icon>
            <p class="text">{{item.name}}</p>
            <el-badge :value="item.badge" class="admin-badge-item1" v-if=" item.badge&&item.badge > 0" :max="99">
            </el-badge>
          </div>
        </li>
        <li v-for="(item,index) in menuListAdmin" :key="index" v-if="isAdmin === 'Admin'" class="adminCont">
          <div :class="[Role === 'fund' || isIE ? item.className : item.classNameY]" @click="goUrl(item)">
            <svg-icon :iconClass='item.classNameI' className='icon'></svg-icon>
            <p class="text">{{item.name}}</p>
            <el-badge :value="item.badge" class="admin-badge-item1" v-if="item.badge && item.badge > 0" :max="99">
            </el-badge>
          </div>
        </li>
      </ul>
    </div>
    <HomeMessages messageInfoPath="/enterprise/message-info" messageListPath="/enterprise/message"></HomeMessages>
    <BroswerPopUp></BroswerPopUp>
    <el-dialog :visible.sync="dialogCountAlert" center width="568px">
      <div style="margin-bottom:24px;text-align:center">{{dialogListTitle}}</div>
      <div class="tableBody">
        <table style="width: 100%" class="goldDetail">
          <tr>
            <td colspan="2">来源/持有期</td>
            <td :style="(listData.length >= 1 && listData[0].reason) ? 'width:30%':'width:50%'">数量</td>
            <td v-if="listData.length >= 1 && listData[0].reason" style="width:25%">冻结原因</td>
          </tr>
          <tr v-for="(list, index) in daysList" :key="index">
            <td :rowspan="daysList.length" v-if="index===0">收款/购买</td>
            <td style="width:25%">{{list.days}} 天</td>
            <td>{{list.balance | toThousands}}
              <span style="color:#f56c6c" v-if="list.days >= 365">*</span>
            </td>
            <td v-if="listData.length >= 1 && listData[0].reason">{{list.reason}}</td>
          </tr>
          <tr v-for="(list, index) in listData" :key="index+'a'" v-if="list.days < 0">
            <td colspan="2" v-if="list.days < 0">{{list.days ===-1?'充值':'出售转换'}}</td>
            <td v-if="list.days < 0">{{list.balance | toThousands}}
              <span style="color:#f56c6c">*</span>
            </td>
            <td v-if="listData.length >= 1 && listData[0].reason">{{list.reason}}</td>
          </tr>
        </table>
        <div v-if="listData.length < 1" style="textAlign:center;width:100%;marginTop:10px">暂无数据</div>
      </div>
      <div style="marginTop:20px">注：标<span style="color:#f56c6c"> * </span>的金额表示可以随时提现。</div>
      <Button class="confirm-btn" @handleClick="dialogCountAlert=false" title="关闭"></Button>
    </el-dialog>
  </div>
</template>

<script>
import { Getitem } from '@/services/CommonService'
import HomeMessages from '@/components/HomeMessages'
import BroswerPopUp from '@/components/BroswerPopUp'
import BrowserMatch from '@/services/Browser.js'
import settings from '@/settings'
import { mapState } from 'vuex'
export default {
  components: {
    HomeMessages,
    BroswerPopUp
  },
  data () {
    return {
      listData: [],
      dialogCountAlert: false,
      isAdmin: '',
      Role: '',
      isFirefox: false,
      dialogListTitle: '支付令明细',
      typeBalanceLable: '金额',
      // 获取电话号码
      getEnterpriseUrl: settings.apiGateway.getEnterprise,
      // 获取金币
      getAccountGoldUrl: settings.apiGateway.getAccountGold,
      // 初始化时提示这只设置支付密码
      // SetPayPasswordUrl: settings.apiGateway.checkIsSetPayPassword,
      // setPsdVisible: true,
      remind: '',
      // 按钮列表
      menuList: [
        {
          name: '充值',
          className: 'top-up',
          classNameY: 'Ytop-up',
          classNameI: 'qyf_sy_cz',
          path: '/enterprise/top-up',
          brage: ''
        },
        {
          name: '提现',
          className: 'withdraw-cash',
          classNameY: 'Ywithdraw-cash',
          classNameI: 'qyf_sy_tx',
          path: '/enterprise/withdraw-list',
          brage: ''
        },
        {
          name: '收款',
          className: 'gathering',
          classNameY: 'Ygathering',
          classNameI: 'qyf_sy_sk',
          path: '/enterprise/proceeds',
          brage: ''
        },
        {
          name: '支付',
          className: 'pay',
          classNameY: 'Ypay',
          classNameI: 'qyf_sy_zf',
          path: '/enterprise/payment',
          brage: ''
        },
        {
          name: '购买',
          className: 'join-token',
          classNameY: 'Yjoin-token',
          classNameI: 'sy_mrl',
          path: '/enterprise/buy-list',
          brage: ''
        },
        {
          name: '出售',
          className: 'join-token',
          classNameY: 'Yjoin-token',
          classNameI: 'sy_mcl',
          path: '/enterprise/sale-list',
          brage: ''
        }
      ],
      menuListAdmin: [
        {
          name: '提现申请审核',
          className: 'withdraw-cash',
          classNameY: 'Ywithdraw-cash',
          classNameI: 'qyf_sy_tx',
          path: '/enterprise/withdraw-apply-authority',
          brage: ''
        },
        {
          name: '收款申请审核',
          className: 'gathering',
          classNameY: 'Ygathering',
          classNameI: 'qyf_sy_sk',
          path: '/enterprise/proceeds-apply-authority',
          brage: ''
        },
        {
          name: '支付申请审核',
          className: 'pay',
          classNameY: 'Ypay',
          classNameI: 'qyf_sy_zf',
          path: '/enterprise/pay-apply-authority',
          brage: ''
        },
        {
          name: '购买申请审核',
          className: 'withdraw-cash',
          classNameY: 'Ywithdraw-cash',
          classNameI: 'sy_mrl',
          path: '/enterprise/buy-apply-authority',
          brage: ''
        },
        {
          name: '出售申请审核',
          className: 'withdraw-cash',
          classNameY: 'Ywithdraw-cash',
          classNameI: 'sy_mcl',
          path: '/enterprise/sale-apply-authority',
          brage: ''
        }
      ]
    }
  },
  methods: {
    // 路由跳转
    goUrl (item) {
      this.$router.push(item.path)
    },
    toBalanceList () {
      this.$router.push('/enterprise/balance-list')
    },
    cashDetailCount (val) {
      if (val === 'valible') {
        this.dialogListTitle = '支付令明细'
        this.typeBalanceLable = '数量'
        this.accountBalaceList()
      } else {
        this.dialogListTitle = '支付令明细'
        this.typeBalanceLable = '数量'
        this.accountGoldList()
      }
    }
  },
  computed: {
    ...mapState([
      'counters'
    ]),
    isIE () {
      return this.$store.state.isIE
    },
    daysList () {
      return this.listData.filter(item => {
        return item.days >= 0
      })
    }

  },
  created () {
    this.$store.dispatch('updateCounters')
    this.getAccount()
    this.getGold()
    // this.SetPayPassword()
    this.Role = this.getUserRole()
    let userData = Getitem('userData')
    this.isAdmin = JSON.parse(userData).role
    try {
      // 获取浏览器信息
      BrowserMatch.init()
      // 判断浏览器类型是否是IE
      // alert(BrowserMatch.browser)
      // alert(BrowserMatch.version)
      if (BrowserMatch.browser === 'firefox' && BrowserMatch.version.split('.')[0] <= 54) {
        this.isFirefox = true
      } else {
        this.isFirefox = false
      }
    } catch (e) {
      this.isFirefox = false
    }
    // 获取账户余额的操作放到SysIndex.vue中获取放到store中
  },
  watch: {
    counters (val) {
      if (JSON.parse(Getitem('userData')).role === 'Operator') {
        this.menuList[0].badge = val.deposit
        this.$set(this.menuList, 0, this.menuList[0])
        this.menuList[2].badge = val.receive
        this.$set(this.menuList, 2, this.menuList[2])
        this.menuList[4].badge = val.buyNum
        this.$set(this.menuList, 4, this.menuList[4])
        this.menuList[3].badge = val.payment
        this.$set(this.menuList, 3, this.menuList[3])
      } else if (this.isAdmin === 'Admin') {
        this.menuListAdmin[2].badge = val.payment
        this.$set(this.menuListAdmin, 2, this.menuListAdmin[2])
        this.menuListAdmin[1].badge = val.receive
        this.$set(this.menuListAdmin, 1, this.menuListAdmin[1])
        this.menuListAdmin[0].badge = val.withdrawNum
        this.$set(this.menuListAdmin, 0, this.menuListAdmin[0])
        this.menuListAdmin[3].badge = val.buyAuditNum
        this.$set(this.menuListAdmin, 3, this.menuListAdmin[3])
        this.menuListAdmin[4].badge = val.sellAuditNum
        this.$set(this.menuListAdmin, 4, this.menuListAdmin[4])
      }
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/less/variables';
.enterprise_assets {
  height: 40px;
  font-size: 16px;
  font-weight: 400;
  color: rgba(101, 101, 101, 1);
  line-height: 40px;
  background-color: #f5f5f5;
  border: 1px solid #e1e1e1;
  padding-left: 23px;
  .checkDetail {
    text-decoration: underline;
    font-size: 14px;
    color: @theme-blue;
    color: var(--mainColor);
    cursor: pointer;
    float: right;
    margin-right: 28px;
  }
}
.enterprise_assets_content {
  border: 1px solid #e6e6e6;
  border-top: 0;
  background-color: #f6fffe;
  margin-bottom: 22px;
  height: 67px;
  position: relative;
  .cashCount,
  .goldCount {
    height: 67px;
    float: left;
    .countTop {
      height: 100%;
      line-height: 67px;
      float: left;
      .leftCountName {
        text-align: left;
        padding-left: 50px;
        .textCashIcon {
          font-size: 14px;
          // font-weight: bold;
          color: #656565;
        }
        .checkDetail {
          margin-left: 15px;
          font-size: 12px;
          // font-family: SimSun;
          text-decoration: underline;
          color: @theme-blue;
          color: var(--mainColor);
          cursor: pointer;
        }
      }
      .rightCountNum {
        text-align: left;
        padding-left: 50px;
        font-size: 24px;
        margin: 16px 0;
        font-family: Arial;
        font-weight: bold;
        color: @theme-blue;
        color: var(--mainColor);
      }
    }
    .detailTitle {
      float: left;
      font-size: 14px;
      color: #656565;
      margin-top: 17px;
      .balanceItem {
        display: inline-block;
        text-align: left;
        padding-left: 40px;
      }
    }
  }
  .mainColor {
    display: inline-block;
    line-height: 27px;
    font-size: 26px;
    font-weight: bold;
    margin-left: 14px;
    color: @theme-blue;
    color: var(--mainColor);
  }
  .cashCount {
    width: calc(~'100% - 2px');
    margin: 0;
  }
  .checkList,
  .checkListI {
    font-size: 14px;
    text-decoration: underline;
    color: @theme-blue;
    color: var(--mainColor);
    cursor: pointer;
    line-height: 20px;
  }
  .checkList {
    position: absolute;
    top: 19px;
    right: 23px;
  }
  .goldCount {
    width: 56%;
  }
  .cashCount_icon {
    width: 23px !important;
    height: 23px !important;
    margin-right: 10px;
    color: @theme-blue;
    color: var(--mainColor);
    vertical-align: middle !important;
  }
}
.confirm-btn {
  margin: 23px 216px 0 216px;
  padding-left: 28px;
}
.mock-clip {
  width: 300px;
  margin: 0 auto;
  overflow: hidden;
  height: 109px;
}
.goldDetail {
  text-align: center;
  border-collapse: collapse;
  tr {
    height: 36px;
    line-height: 36px;
    // border: 1px solid #E1E1E1;
    td {
      border: 1px solid #e1e1e1;
    }
    &:hover {
      background-color: #f6fffe;
    }
  }
}
.title {
  width: 100%;
  height: 128px;
  background-color: #f2f9ff;
  text-align: center;
  padding-top: 20px;
}
.circle {
  width: 300px;
  height: 150px;
  border: 1px solid #118eea;
  border: 1px solid var(--mainColor);
  border-radius: 150px 150px 0 0;
  border-bottom: none;
  margin: 0 auto;
  clip-path: inset(0 0 42px 0);
  .cash-name {
    font-size: 22px;
    margin-top: 31px;
    color: #333;
  }
  .cash-amount {
    color: @theme-blue;
    color: var(--mainColor);
    margin-top: 14px;
    font-size: 24px;
  }
}
.circleF {
  width: 230px;
  height: 115px;
  border: 1px solid #118eea;
  border: 1px solid var(--mainColor);
  border-radius: 115px 115px 0 0;
  border-bottom: none;
  margin: 0 auto;
  // clip-path: inset(0 0 42px 0);
  .cash-name {
    font-size: 22px;
    margin-top: 35px;
    color: #333;
  }
  .cash-amount {
    color: @theme-blue;
    color: var(--mainColor);
    margin-top: 25px;
    font-size: 24px;
  }
}
.business-entrance {
  width: 1132px;
  margin: 0 auto;
  height: 190px;
  .menu-operator {
    width: 90%;
    margin: 0 auto;
    clear: both;
    overflow: hidden;
    li {
      float: left;
      width: 15%;
      padding: 52px 0;
    }
    li:nth-child(2n + 1) {
      margin-right: -10px;
    }
    li:nth-child(2n) {
      margin-right: 30px;
    }
  }
  .menu-admin {
    width: 100%;
    clear: both;
    overflow: hidden;
    li {
      float: left;
      width: 18%;
      padding: 52px 0;
    }
  }
  .top-up,
  .join-token,
  .pay,
  .gathering,
  .withdraw-cash,
  .Ypay,
  .Yjoin-token,
  .Ytop-up,
  .Ygathering,
  .Ywithdraw-cash {
    width: 123px;
    height: 107px;
    margin: 0 auto;
    text-align: center;
    border-radius: 6px;
    border: 1px solid @theme-blue;
    border: 1px solid var(--mainColor);
    cursor: pointer;
    .icon {
      display: inline-block;
      width: 40px;
      height: 40px;
      margin: 14px 0;
      color: @theme-blue;
      color: var(--mainColor);
      background-repeat: no-repeat;
    }
    .text {
      color: @theme-blue;
      color: var(--mainColor);
      font-size: 16px;
    }
  }
}
.iconTotol {
  display: inline-block;
  width: 26px !important;
  height: 25px !important;
  vertical-align: middle;
  margin-right: 10px;
  margin-top: -2px;
  color: @theme-blue;
  color: var(--mainColor);
}
.dialog-footer {
  .confirm-btn {
    width: 140px;
    // background-color: @theme-blue;
    // background-color: var(--mainColor);
    border: none;
  }
}
.admin-badge-item1 {
  position: absolute;
  top: -94px;
  left: 62px;
  z-index: 222;
}
.adminCont div {
  position: relative;
}
</style>
<style lang="less">
.enterPriceHome {
  padding: 0 20px;
  .el-dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    margin-left: 110px !important;
    margin-top: 0 !important;
  }
}
</style>
