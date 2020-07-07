<template>
  <div class="balanceList">
      <div class="business-title">
      <a class="back-btn" @click="goBack">&lt; 返回</a>
      <div class="cashC">
        <div class="countTop">
        <div class="leftCountName">
          <span class="textCashIcon"><svg-icon iconClass='qyrz_zjf' className='iconTotol'></svg-icon>资产总额 </span>
        </div>
        </div>
        <div class="detailTitle">
          <span class="mainColor">{{balanceTotal.amount || 0 | toThousands}}</span>
          <span class="balanceItem">
            折合现金：<span style="fontWeight:bold;fontSize:20px;">{{balanceTotal.currentAmount || 0 | toThousands}}</span>
          </span>
          <el-tooltip class="item" effect="light" placement="right">
            <div slot="content" style="lineHeight:20px">
              未到期的支付令可根据折现利率计算其现金价值。
              <br>
              现金价值是支付和出售时的参考值，不支持提现。
            </div>
            <i class="el-icon-question goldHelp1"></i>
          </el-tooltip>
        </div>
      </div>
    </div>
    <div class="channel">
      <div :class="isBalance?'channelItem active':'channelItem'" @click="getTotolList('tag')">可用额度</div>
      <div :class="!isBalance?'channelItem active':'channelItem'" @click="getFrozenList('tag')">冻结</div>
    </div>
    <div class="useBalance" v-if="isBalance">
      <span class="splitLine"></span>
      <span class="balanceText">可用余额</span>
      <span class="balanceAmount">{{TotolList.amount || 0 | toThousands}}</span>
      <span class="balanceReal"><span style="fontSize:16px;">&nbsp; | &nbsp;</span>折合现金 ￥{{TotolList.currentAmount || 0 | toThousands}}</span>
    </div>
    <div class="useBalance" v-else>
      <span class="splitLine"></span>
      <span class="balanceText">冻结额度</span>
      <span class="balanceAmount">{{frozenList.amount || 0 | toThousands}}</span>
    </div>
    <div class="TotolList1" v-if="isBalance">
      <el-table :data="TotolList.list" stripe border style="width: 100%" header-align='center' key="atable"
      class="TotolList credit-table-color-blue sy-global-has-gutter__th--text-center sy-global-el-table-fit--border" :empty-text='midCenter'>
      <el-table-column type="index" label="序号">
      </el-table-column>
      <el-table-column prop="balance" label="支付令" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.balance || 0 | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付令时间">
        <el-table-column prop="arrivalTime" label="提现日期">
          <template slot-scope="scope">
            <span>{{scope.row.arrivalTime || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="days" label="已持有天数">
        </el-table-column>
        <el-table-column prop="lastDays" label="剩余天数">
        </el-table-column>
      </el-table-column>
      <el-table-column label="折现利率">
        <template slot-scope="scope">
          <span v-if="scope.row.remark!==1 && scope.row.remark!==3 && scope.row.remark!==4">{{scope.row.rate / 10000}}%</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column label="折合现金(￥)">
        <template slot-scope="scope">
          <span>{{scope.row.current || 0  | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注">
        <template slot-scope="scope">
          <span>{{scope.row.remark | remarkType}}</span>
        </template>
      </el-table-column>
    </el-table>
    </div>
    <div class="TotolList2" v-else>
      <el-table :data="frozenList.list" stripe border style="width: 100%" header-align='center' key="btable" :empty-text='midCenter'
      class="TotolList  credit-table-color-blue sy-global-has-gutter__th--text-center sy-global-el-table-fit--border">
      <el-table-column prop="balance" label="金额">
        <template slot-scope="scope">
          <span>{{scope.row.balance || 0  | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="days" label="持有天数">
      </el-table-column>
      <el-table-column prop="arrivalTime" label="提现日期">
      </el-table-column>
      <el-table-column prop="remark" label="冻结原因">
        <template slot-scope="scope">
          <span>{{scope.row.remark===1?'支付':(scope.row.remark===2?'出售':'提现')}}</span>
        </template>
      </el-table-column>
    </el-table>
    </div>
    <el-row class="sy-global--Pagination--bg" style="margin-bottom: 2rem" v-if="pageCom">
      <el-col>
        <div class="sy-global__div--Pagination sy-global-pull-right">
          <el-pagination @current-change="pageChange" @size-change="sizeChange" :page-sizes="pageSizes"
          :pageSize="pageSize" :current-page="pageNo" layout="total"
          :total="totalCnt">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import settings from '@/settings'
export default {
  data () {
    return {
      isBalance: true,
      pageSize: 10,
      pageSizes: settings.pageSizes,
      getAmountUrl: settings.apiGateway.getAmount,
      // 获取冻结结构
      getFrozenListUrl: settings.apiGateway.getFrozenList,
      // 获取可用余额结构
      getValibleListUrl: settings.apiGateway.getValibleList,
      pageNo: 1,
      totalCnt: 0,
      midCenter: '暂无数据',
      TotolList: {
        list: []
      },
      frozenList: {
        list: []
      },
      balanceTotal: {}
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    pageChange (curPage) {
      this.pageNo = curPage
      this.isBalance && this.getTotolList()
      !this.isBalance && this.getFrozenList()
    },
    getTotolList (val) {
      this.isBalance = true
      val && this.initSize()
      this.accountBalaceList()
    },
    initSize () {
      this.pageSize = 10
      this.pageNo = 1
      this.totalCnt = 0
    },
    getFrozenList (val) {
      this.isBalance = false
      val && this.initSize()
      this.accountFrozenList()
    },
    sizeChange (pageSize) {
      this.pageSize = pageSize
      this.isBalance && this.getTotolList()
      !this.isBalance && this.getFrozenList()
    },
    // 获取可用金额结构
    accountBalaceList () {
      this.midCenter = '查询中'
      this.fetch(this.getValibleListUrl).then(data => {
        this.TotolList = data.data
        this.totalCnt = this.TotolList.list.length
        this.midCenter = '暂无数据'
      }).catch(data => {
        this.midCenter = '暂无数据'
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    // 获取冻结结构
    accountFrozenList () {
      this.midCenter = '查询中'
      this.fetch(this.getFrozenListUrl).then(data => {
        this.frozenList = data.data
        this.totalCnt = this.frozenList.list.length
        this.midCenter = '暂无数据'
      }).catch(data => {
        this.midCenter = '暂无数据'
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    }
  },
  created () {
    this.accountBalaceList()
    this.fetch(this.getAmountUrl).then(data => {
      this.balanceTotal = data.data
    }).catch(res => {
      this.$message.error(res.data.msg)
    })
  },
  computed: {
    pageCom () {
      if (this.isBalance) {
        return this.TotolList.list.length > 0
      } else {
        return this.frozenList.list.length > 0
      }
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/less/variables';
.balanceList {
  padding: 0 20px;
}
.business-title {
  width: calc(~ "100% - 2px");
  border:1px solid rgba(241, 242, 243, 1);
  height: 90px;
  color: #4a4a4a;
  font-size: 20px;
  position: relative;
  background-color: @theme-blue-light;
  background-color: var(--mainLightColor);
  background-clip: padding-box;
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
.countTop {
  height: 100%;
  margin-top: 30px;
  line-height: 50px;
  float: left;
  .leftCountName {
    float: left;
    text-align: left;
    padding-left: 20px;
    .textCashIcon {
      font-size: 14px;
      color: #656565;
    }
    .checkDetail {
      margin-left: 15px;
      font-size: 12px;
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
  margin-top: 47px;
  font-size: 14px;
  color: #656565;
  .balanceItem {
    display: inline-block;
    text-align: left;
    padding-left: 40px;
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
.mainColor {
  display: inline-block;
  line-height: 21px;
  font-size: 20px;
  font-weight: bold;
  margin-left: 14px;
  color: @theme-blue;
  color: var(--mainColor);
}
.goldHelp1 {
  font-size: 18px;
  color: #ccc;
  margin-left: 5px;
}
.channel {
  width: 224px;
  height: 42px;
  margin: 17px 0 32px 0;
  .channelItem {
    float: left;
    width: 110px;
    font-size: 16px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border: 1px solid #E2E1E4;
    background-color: #F6F5F8;
    cursor: pointer;
  }
  .active {
    color: @theme-blue;
    color: var(--mainColor);
    background-color: #fff;
    border: 1px solid @theme-blue;
    border: 1px solid var(--mainColor);
  }
}
.useBalance {
  height: 17px;
  font-size: 16px;
  padding-left: 23px;
  .splitLine {
    display: inline-block;
    width: 4px;
    height: 17px;
    background-color: @theme-blue;
    background-color: var(--mainColor);
    margin-right: 9px;
    vertical-align: middle;
  }
  .balanceText {
    font-weight: bold;
    margin-right: 10px;
  }
  .balanceAmount {
    font-weight: bold;
    color: @theme-blue;
    color: var(--mainColor);
  }
  .balanceReal {
    font-size: 14px;
    color: #9C9C9C;
  }
}
.TotolList {
  margin-top: 20px;
}
.balanceList/deep/.el-table .cell {
  text-align: center;
}
.balanceList/deep/.credit-table-color-blue tr {
  cursor: default;
  background-color: @table-bg;
  background-color: var(--mainTableBg) !important;
}
.balanceList/deep/.credit-table-color-blue .el-table__body tr {
  &:nth-of-type(2n + 1):hover > td {
    background-color: @table-hover;
    background-color: var(--mainTableHover) !important;
  }
}
.TotolList1/deep/.el-table td:nth-child(2) .cell, .TotolList1/deep/.el-table td:nth-child(7) .cell {
  text-align: right;
}
.TotolList2 /deep/.el-table td:nth-child(1) .cell {
  text-align: right;
}
.balanceList/deep/ thead .el-table_1_column_3_column_4,
.balanceList/deep/ thead .el-table_1_column_3_column_5,
.balanceList/deep/ thead .el-table_1_column_3_column_6 {
  background-color: #F2F2F4 !important;
}
</style>
