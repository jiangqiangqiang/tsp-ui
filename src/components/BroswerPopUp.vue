<!--
  浏览器版本过低提示弹窗直接引入component使用
-->
<template>
  <div class="versions">
    <el-dialog :visible.sync="showDialog" width="500px" top="295px" @before-close="IKnow" :show-close="showClose"
      :close-on-press-escape="showClose" :close-on-click-modal="showClose">
      <div class="dialog-container">
        <div class="tip-icon">
          <!-- <i></i> -->
          <svg-icon iconClass='gg_bc' className='tip-icon1'></svg-icon>
        </div>
        <div>
          <p>您的浏览器版本过低,为了更好的体验</p>
          <p>请使用谷歌或者火狐最新版本浏览器</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <Button @handleClick="IKnow" class="btn" title="我知道了"></Button>
        <el-checkbox @change="noTip" v-model="checked">不再提示</el-checkbox>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Setitem, Getitem } from '@/services/CommonService'
export default {
  data () {
    return {
      checked: false,
      showDialog: false,
      showClose: false
    }
  },
  created () {
    let sTip = sessionStorage.getItem('browserLowTip')
    let lTip = Getitem('browserLowTip')
    let isIE = this.$store.state.isIE
    if (lTip) {
      this.showDialog = false
    } else {
      if (sTip) {
        this.showDialog = false
      } else {
        if (isIE) {
          this.showDialog = true
          this.setPsdVisible = false
        } else {
          this.showDialog = false
        }
      }
    }
  },
  methods: {
    IKnow () {
      this.showDialog = false
      if (!this.checked) {
        sessionStorage.setItem('browserLowTip', 'yes')
      }
      if (this.remind === true) {
        this.setPsdVisible = true
      }
    },
    noTip (tip) {
      if (tip) {
        // 设置localeStorage
        Setitem('browserLowTip', 'yes')
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/variables.less';
.dialog-container {
  .tip-icon {
    text-align: center;
    .tip-icon1 {
      width: 66px !important;
      height: 66px !important;
      vertical-align: middle;
      display: inline-block;
      // background: url('~@/assets/img/gg_bc.png') center no-repeat;
    }
  }
  p {
    color: #575757;
    text-align: center;
    height: 30px;
    line-height: 30px;
    &:first-child {
      margin-top: 20px;
    }
  }
}
.dialog-footer {
  .btn {
    width: 180px;
    height: 36px;
    border: none;
  }
  .el-checkbox {
    margin-right: 40px;
    margin-left: 20px;
  }
}
</style>

<style>
.versions .el-dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  margin-left: 108px !important;
  margin-top: 0 !important;
}
</style>
