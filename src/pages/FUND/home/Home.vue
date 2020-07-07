<template>
  <div>
    <div class="aggregate">
      <dl class="token">
        <dt class="text">累计发令</dt>
        <dd class="amount">
          <!-- <div class="icon"></div> -->
          <svg-icon iconClass='zjf_sy_ljfl' className='icon'></svg-icon>
          <div class="quantity">{{amount.totalIssueToken | toThousands}}</div>
        </dd>
      </dl>
      <dl class="earnings">
        <dt class="text">累计收益</dt>
        <dd class="amount">
          <!-- <div class="icon"></div> -->
          <svg-icon iconClass='qyf_sy_tx' className='icon'></svg-icon>
          <div class="quantity">{{amount.totalBenefit | toThousands}}</div>
        </dd>
      </dl>
    </div>
    <div class="business-entrance">
      <ul class="menu" :class="[isAdmin === 'Operator' ? 'menu-operator' :' menu-admin']">
        <li v-for="(item,index) in menuList" :key="index" v-if="isAdmin === 'Operator'" class="adminCont">
          <div :class="item.className" @click="goUrl(item)">
            <!-- <span class="icon"></span> -->
            <svg-icon :iconClass='item.classNameI' className='icon'></svg-icon>
            <p class="text">{{item.name}}</p>
            <el-badge :value="item.badge" class="admin-badge-item2" v-if="item.badge&& item.badge > 0" :max="99"></el-badge>
          </div>
        </li>
        <li v-for="(item,index) in menuListAdmin" :key="index" v-if="isAdmin === 'Admin'" class="adminCont">
          <div :class="item.className" @click="goUrl(item)">
            <!-- <span class="icon"></span> -->
            <svg-icon :iconClass='item.classNameI' className='icon'></svg-icon>
            <p class="text">{{item.name}}</p>
            <el-badge :value="item.badge" class="admin-badge-item1" v-if="item.badge&& item.badge > 0" :max="99"></el-badge>
          </div>
        </li>
      </ul>
    </div>
    <HomeMessages messageListPath="/fund/message" messageInfoPath="/fund/message-info"></HomeMessages>
    <BroswerPopUp></BroswerPopUp>
  </div>
</template>

<script>
import settings from '@/settings'
import { Getitem } from '@/services/CommonService'
import HomeMessages from '@/components/HomeMessages'
import BroswerPopUp from '@/components/BroswerPopUp'
export default {
  components: {
    HomeMessages,
    BroswerPopUp
  },
  data () {
    return {
      isAdmin: '',
      Role: '',
      // 首页金额
      getFundAmountUrl: settings.apiGateway.getFundAmount,
      // 获取电话号码
      getEnterpriseUrl: settings.apiGateway.getEnterprise,
      // 初始化时提示这只设置支付密码
      // SetPayPasswordUrl: settings.apiGateway.checkIsSetPayPassword,
      // setPsdVisible: true,
      // remind: '',
      // 按钮列表
      menuList: [
        {
          name: '联合发令',
          className: 'joint-token',
          classNameI: 'qyf_sy_lhfl',
          path: '/fund/joint-token-list'
        },
        {
          name: '提现',
          className: 'withdraw',
          classNameI: 'qyf_sy_tx',
          path: '/fund/withdraw-list'
        }
      ],
      menuListAdmin: [
        {
          name: '提现申请审核',
          className: 'withdraw-audit',
          classNameI: 'qyf_sy_tx',
          path: '/fund/withdraw-apply-authority'
        }
      ],
      amount: {}
    }
  },
  methods: {
    // 路由跳转
    goUrl (item) {
      this.$router.push(item.path)
    },
    // SetPayPassword () {
    //   this.fetch(this.SetPayPasswordUrl).then(data => {
    //     this.remind = data.data.remind
    //   }).catch(data => {
    //     this.$message({
    //       type: 'error',
    //       message: data.data.msg
    //     })
    //   })
    // },
    // setPassword () {
    //   this.$router.push('/fund/change-password')
    // },
    // handleDialogClose () {
    //   this.setPsdVisible = false
    // },
    getFundAmount () {
      this.fetch(this.getFundAmountUrl).then(data => {
        this.amount = data.data
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    // 获取电话号
    getAdminMobileInfo () {
      // this.fetch(this.getEnterpriseUrl).then(data => {
      //   this.adminMobile = data.data.adminMobile
      //   this.$store.commit('setAdminMobile', this.adminMobile)
      // }).catch(data => {
      //   this.$message({
      //     type: 'error',
      //     message: data.data.msg
      //   })
      // })
    },
    getNavReminderNumber () {
      var data = this.$store.state.counters
      if (this.isAdmin === 'Operator') {
        this.menuList[0].badge = data.jointToken
        this.menuList[1].badge = data.withdrawNum
      } else if (this.isAdmin === 'Admin') {
        this.menuListAdmin[0].badge = data.withdrawNum
      }
    }
  },
  created () {
    this.getFundAmount()
    this.getNavReminderNumber()
    this.getAdminMobileInfo()
    let userData = Getitem('userData')
    this.isAdmin = JSON.parse(userData).role
    // this.SetPayPassword()
  },
  computed: {
    isIE () {
      return this.$store.state.isIE
    }
  },
  watch: {
    '$store.state.counters' () {
      this.getNavReminderNumber()
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/less/variables';
.aggregate {
  width: 100%;
  height: 87px;
  padding-top: 35px;
  display: flex;
  justify-content: center;
  background-color: @theme-blue-light;
  background-color: var(--mainLightColor);
  .text {
    padding-left: 13px;
    font-size: 18px;
    padding-bottom: 19px;
  }
  .icon {
    display: inline-block;
    width: 26px!important;
    height: 26px!important;
    vertical-align: middle;
    background-repeat: no-repeat;
    background-size: cover;
  }
  .token,
  .earnings {
    text-align: center;
    .amount {
      display: flex;
      justify-content: space-around;
      height: 26px;
      line-height: 26px;
    }
    .quantity {
      font-size: 22px;
      margin-left: 10px;
      color: var(--mainColor);
      color: @theme-blue;
    }
  }
  .token {
    .icon {
      // background-image: url('~@/assets/img/IE-home-icon2.png');
      color: var(--mainColor);
      color: @theme-blue;
    }
  }
  .earnings {
    margin-left: 285px;
    .icon {
      // background-image: url('~@/assets/img/zjf_sy_tx.png');
      color: var(--mainColor);
      color: @theme-blue;
    }
  }
}
.business-entrance {
  width: 100%;
  height: 109px;
  padding-top: 38px;
  .menu-admin {
    width: 50%;
    display: flex;
    justify-content: space-around;
    margin: 0 auto;
    clear: both;
    overflow: hidden;
  }
  .joint-token,
  .withdraw,
  .withdraw-audit {
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
      width: 40px!important;
      height: 40px!important;
      margin: 14px 0;
      vertical-align: middle;
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
  // .joint-token {
  //   .icon {
  //     background-image: url('~@/assets/img/zjf_sy_lhfl.png');
  //   }
  // }
  // .withdraw {
  //   .icon {
  //     background-image: url('~@/assets/img/zjf_sy_tx.png');
  //   }
  // }
  // .withdraw-audit {
  //   .icon {
  //     background-image: url('~@/assets/img/withdraw.png');
  //   }
  // }
}
// .dialog-footer {
//   .confirm-btn {
//     width: 140px;
//     // background-color: @theme-blue;
//     // background-color: var(--mainColor);
//     border: none;
//   }
// }
// .hint {
//   text-align:center;
//   margin: 20px 0;
//   font-size:18px;
//   line-height: 30px;
// }
// .text {
//   cursor: pointer;
//   text-decoration: underline;
//   color: @theme-blue;
//   color: var(--mainColor);
// }
// .noset-pas {
//   cursor: pointer;
//   text-decoration: underline;
//   margin-right: 20px;
//   color: @theme-blue;
//   color: var(--mainColor);
// }
.admin-badge-item2 {
  position: absolute;
  top: -9px;
  left: 112px;
  z-index: 222;
}
.admin-badge-item1 {
  position: absolute;
  top: -94px;
  left: 62px;
  z-index: 222;
}
.adminCont div {
  position: absolute;
}
</style>
<style lang="less">
// .no-pay-password {
//   .el-dialog {
//     position: absolute;
//     top: 50%;
//     left: 50%;
//     margin-left: -132px!important;
//     margin-top: -121px!important;;
//   }
// }
</style>
