<template>
  <div>
    <el-dialog
      :visible.sync="dialogSucceed"
      center
      width="568px"
      top="350px"
      :show-close="false"
      >
      <div class="password">
        <p class="prompt">验证支付密码</p>
        <span class="pay-psd">支付密码</span>
        <input type="password" class="psd-input" v-model="paypassword" placeholder="请输入支付密码" @blur="getPassword" autocomplete="new-password">
        <span class="forget-psd" @click="showDialog">忘记支付密码?</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <Button class="confirm-btn" @handleClick="setRequest(Succeed)" title="确定" :disabled="payPsd"></Button>
        <Button class="confirm-btn" @handleClick="handleClose" title="取消"></Button>
      </div>
      <div class="closeBtn" @click="handleClose">X</div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialogSucceed: {
      type: Boolean,
      default: false
    },
    password: {
      type: String,
      default: ''
    }
    // payPsd: {
    //   type: Boolean,
    //   default: true
    // },
  },
  data () {
    return {
      paypassword: this.password,
      Succeed: this.dialogSucceed
    }
  },
  methods: {
    getPassword () {
      this.$emit('getPassword', this.paypassword)
    },
    setRequest () {
      this.$emit('setRequest')
    },
    handleClose () {
      this.$emit('handleClose')
    },
    showDialog () {
      this.$emit('showDialog')
    }
  },
  computed: {
    payPsd () {
      if (!this.paypassword) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/less/variables';
.password {
  width:426px;
  margin: 0 auto;
  .prompt {
    text-align: center;
    font-size: 16px;
    margin-bottom: 30px;
  }
  .psd-input {
    padding-left: 10px;
    width: 220px;
    height:43px;
    border: 1px solid #e1e1e1;
    border-radius: 4px;
    margin: 0 14px 0 19px;
    background: #fcfcfc;
  }
  .forget-psd {
    cursor: pointer;
    color: @theme-blue;
    color: var(--mainColor);
    text-decoration: underline
  }
}
.dialog-footer {
  margin-bottom: 20px;
  .confirm-btn {
    width: 211px;
    height:50px;
    font-size: 16px;
  }
}
.closeBtn {
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 15px;
  cursor: pointer;
  color: #909399;
}
</style>
