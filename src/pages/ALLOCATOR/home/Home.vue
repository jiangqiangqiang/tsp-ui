<template>
  <div class="enterPriceHome">
    <div class="enterprise_assets">企业资产<span class="warningAccounut"
        v-if="$store.state.account.total<100000">警告：余额较低，请尽快充值！</span></div>
    <div class="enterprise_assets_content">
      <div class="cashCount">
        <div class="countTop">
          <div class="leftCountName">
            <div class="textCashIcon">
              <svg-icon iconClass="zjf_sy_ljfl" className='cashCount_icon'></svg-icon>信融令余额
              <span class="rightCountNum">{{$store.state.account.total || 0 | toThousands}}</span>
              <span>元</span>
              <span class="frozen">已冻结：{{$store.state.account.frozenBalance || 0 | toThousands}}</span>
              <div class="checkDetail topUp" @click="cashDetailCount('balance')">充值</div>
              <div class="checkDetail" @click="cashDetailCount('withdraw')">提现</div>
            </div>
            <!-- <div class="rightCountNum">{{$store.state.account.total || 0 | toThousands}}</div> -->
          </div>
        </div>
        <!-- <div class="countBottom">
          <div class="cashItem">
            <div class="detailTitle">已冻结：{{$store.state.account.frozenBalance || 0 | toThousands}}</div>
          </div>
        </div> -->
      </div>
      <!-- <div class="goldCount">
        <div class="countTop">
          <div class="leftCountName">
            <div class="textCashIcon">
              <svg-icon iconClass='qyf_sy_zf' className='cashCount_icon'></svg-icon>金币余额
              <div class="checkDetail" @click="cashDetailCount('gold')">查看结构</div>
            </div>
            <div class="rightCountNum">{{$store.state.gold.issued || 0 | toThousands}}
            </div>
          </div>
        </div>
        <div class="countBottom">
          <div class="goldItem">
            <div class="detailTitle">未发放金币：{{$store.state.gold.notIssued || 0 | toThousands}}<span
                style="marginLeft:20px">可提现金币：{{$store.state.gold.withdraw || 0 | toThousands}}</span></div>
          </div>
        </div>
      </div> -->
    </div>
    <div class="sideTitle">垫资金额统计</div>
    <div class="dotted"></div>
    <div class="barType">
      <div id="chartLine"></div>
    </div>
    <LogList></LogList>
    <BroswerPopUp></BroswerPopUp>
    <el-dialog :visible.sync="dialogCountAlert" center width="568px">
      <div style="margin-bottom:24px;text-align:center">{{dialogListTitle}}</div>
      <el-table :data="listData" style="width: 100%" border size='mini' header-align='center' class="goldDetail">
        <el-table-column label="持有时间（天）" align='center'>
          <template slot-scope="scope">
            {{scope.row.days ===-1?'充值':scope.row.days}}
          </template>
        </el-table-column>
        <el-table-column :label="typeBalanceLable" align='center'>
          <template slot-scope="scope">
            {{scope.row.balance | toThousands}}
          </template>
        </el-table-column>
      </el-table>
      <Button class="confirm-btn" @handleClick="dialogCountAlert=false" title="关闭"></Button>
    </el-dialog>
  </div>
</template>

<script>
import { Getitem } from '@/services/CommonService'
import LogList from '@/components/LogList'
import echarts from 'echarts'
import BroswerPopUp from '@/components/BroswerPopUp'
import BrowserMatch from '@/services/Browser.js'
import settings from '@/settings'
import { mapState } from 'vuex'
export default {
  components: {
    LogList,
    BroswerPopUp
  },
  data () {
    return {
      listData: [],
      dialogCountAlert: false,
      isAdmin: '',
      Role: '',
      isFirefox: false,
      dialogListTitle: '金额持有期明细',
      typeBalanceLable: '金额',
      // 获取电话号码
      getEnterpriseUrl: settings.apiGateway.getEnterprise,
      // 获取金币结构
      getAccountGoldListUrl: settings.apiGateway.getAccountGoldList,
      getBugetCountUrl: settings.apiGateway.getBugetCount,
      remind: '',
      // 按钮列表
      menuList: [
        {
          name: '充值',
          className: 'top-up',
          classNameY: 'Ytop-up',
          classNameI: 'qyf_sy_cz',
          path: '/allocator/top-up',
          brage: ''
        }
      ],
      menuListAdmin: [
        {
          name: '充值',
          className: 'top-up',
          classNameY: 'Ytop-up',
          classNameI: 'qyf_sy_cz',
          path: '/allocator/top-up',
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
    cashDetailCount (val) {
      if (val === 'balance') {
        this.$router.push('/allocator/top-up')
      } else if (val === 'withdraw') {
        this.$router.push('/allocator/withdraw-list')
      } else {
        this.dialogListTitle = '金币持有期明细'
        this.typeBalanceLable = '金币'
        this.accountGoldList()
      }
    },
    // 获取电话号
    getAdminMobileInfo () {
      //   this.fetch(this.getEnterpriseUrl).then(data => {
      //     this.adminMobile = data.data.adminMobile
      //     this.$store.commit('setAdminMobile', this.adminMobile)
      //   }).catch(data => {
      //     this.$message({
      //       type: 'error',
      //       message: data.data.msg
      //     })
      //   })
    },
    // 获取金币结构
    accountGoldList () {
      this.fetch(this.getAccountGoldListUrl).then(data => {
        this.listData = data.data.sort((list1, list2) => {
          return list1.days - list2.days
        })
        this.listData.push({ days: '未发放', balance: this.$store.state.gold.notIssued })
        this.dialogCountAlert = true
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    getBugetCount () {
      this.fetch(this.getBugetCountUrl).then(data => {
        this.drawLine(data.data)
      }).catch(data => {
        this.$message.error(data.data.msg)
      })
    },
    drawLine (data) {
      this.chartLine = echarts.init(document.getElementById('chartLine'))
      var option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          orient: 'horizontal',
          y: 'bottom',
          padding: [50, 0, 0, 0],
          data: ['垫资', '返还']
        },
        color: ['#FDB200', '#7BBBED'],
        grid: {
          left: '10%',
          right: '13%',
          show: true
        },
        xAxis: {
          name: '日期',
          type: 'category',
          data: data.xaxis,
          splitLine: { show: false }
        },
        yAxis: {
          name: '金额',
          type: 'value',
          splitLine: { show: true }
        },
        series: [
          {
            name: '垫资',
            symbol: 'circle',
            symbolSize: 7,
            type: 'line',
            data: data.subsidyService
          },
          {
            name: '返还',
            symbol: 'circle',
            symbolSize: 7,
            type: 'line',
            data: data.rebateService
          }
        ]
      }
      this.chartLine.setOption(option)
    }
  },
  computed: {
    ...mapState([
      'counters'
    ]),
    isIE () {
      return this.$store.state.isIE
    }
  },
  created () {
    this.$store.dispatch('updateCounters')
    this.getAccount()
    this.getAdminMobileInfo()
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
  mounted () {
    this.getBugetCount()
  },
  watch: {
    counters (val) {
      if (JSON.parse(Getitem('userData')).role === 'Operator') {
        this.menuList[0].badge = val.deposit
        this.$set(this.menuList, 0, this.menuList[0])
      } else if (this.isAdmin === 'Admin') {
        this.menuListAdmin[0].badge = val.deposit
        this.$set(this.menuListAdmin, 0, this.menuListAdmin[0])
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
  .warningAccounut {
    color: rgba(219, 61, 61, 1);
    margin-left: 21px;
    font-size: 14px;
  }
}
.sideTitle {
  height: 16px;
  font-size: 16px;
  font-weight: bold;
  color: rgba(101, 101, 101, 1);
  margin: 38px 0 15px 20px;
  padding-left: 9px;
  border-left: 4px solid @theme-blue;
  border-left: 4px solid var(--mainColor);
}
.dotted {
  border-top: 1px solid #d9d9d9;
  width: 100%;
  height: 1px;
}
.enterprise_assets_content {
  margin-bottom: 22px;
  height: 64px;
  .cashCount,
  .goldCount {
    width: calc(~'100% - 2px');
    height: 100%;
    border: 1px solid #e6e6e6;
    border-top: 0;
    float: left;
    .countTop {
      width: 100%;
      height: 64px;
      .leftCountName {
        // width: 157px;
        height: 100%;
        // float: left;
        // text-align: center;
        .textCashIcon {
          height: 100%;
          // padding-top: 8px;
          background-color: #fffbf4;
          font-size: 14px;
          color: rgba(34, 34, 34, 1);
          position: relative;
          display: flex;
          align-items: center;
        }
        .checkDetail {
          position: absolute;
          right: 35px;
          top: 26px;
          float: right;
          font-size: 12px;
          text-decoration: underline;
          color: @theme-blue;
          color: var(--mainColor);
          cursor: pointer;
        }
        .topUp {
          right: 80px;
        }
      }
      .rightCountNum {
        // text-align: center;
        font-size: 24px;
        margin-right: 12px;
        margin-left: 25px;
        font-family: Arial;
        font-weight: bold;
        color: @theme-blue;
        color: var(--mainColor);
      }
      .frozen {
        color: rgba(34,34,34,.7);
        margin-left: 36px;
      }
    }
    .countBottom {
      height: 57px;
      width: 100%;
      text-align: center;
      .cashItem {
        height: 100%;
      }
      .detailTitle {
        font-size: 14px;
        color: #656565;
        margin-top: 8px;
      }
      .detailTitleCount {
        font-size: 18px;
        font-family: Arial;
        font-weight: bold;
        color: rgba(120, 120, 120, 1);
        margin-top: 10px;
      }
    }
  }
  // .cashCount {
  //   width: 49%;
  //   margin-right: calc(~'2% - 4px');
  // }
  // .goldCount {
  //   width: 49%;
  //   margin-right: 0;
  // }
  .cashCount_icon {
    width: 23px !important;
    height: 23px !important;
    margin-right: 15px;
    margin-left: 25px;
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
  max-height: 300px;
  overflow: auto;
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
  width: 100%;
  height: 190px;
  .menu-admin {
    width: 100%;
    clear: both;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: space-around;
    li {
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
.barType {
  width: 100%;
  position: relative;
  #chartLine {
    width: 90%;
    height: 300px;
    margin: 0 auto 15px;
    position: relative;
  }
}
</style>
<style lang="less">
.enterPriceHome {
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
