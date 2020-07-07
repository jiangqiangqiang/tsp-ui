import { Getitem, Removeitem } from '@/services/CommonService.js'
import Nzh from 'nzh'
import settings from '@/settings'
export default {
  data () {
    return {
      // 身份证验证
      IDReg: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1|2][0-9]\d{2}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
    }
  },
  methods: {
    fetch (path, type, data) {
      if (
        (type && type.toLocaleLowerCase() === 'post') ||
        (type && type.toLocaleLowerCase() === 'put')
      ) {
        this.$store.commit('setFetchDisabled', true)
      }
      // 清除在运行的message
      this.$message.close()
      // 正式返回
      return new Promise((resolve, reject) => {
        this.axios({
          method: type || 'get',
          url: path,
          data: data,
          headers: {
            'Content-Type': 'application/json; charset=UTF-8'
          }
        })
          .then(res => {
            // 操作等待标志位,可以在组件总利用这个标志位,省去自己重置
            this.loadingShow = false
            this.$store.commit('setFetchDisabled', false)
            if (res.status === 403 || res.status === 401) {
              this.$message({
                type: 'error',
                message: '认证失败！'
              })
              this.logOut()
              return
            }
            // 操作过时重新登录
            if (res.status === 402) {
              this.$message({
                type: 'error',
                message: '由于长时间未操作,登录已失效,请重新登录.'
              })
              this.logOut()
              return
            }
            if (res.data.code === 0) {
              resolve(res.data)
            } else {
              reject(res)
            }
          })
          .catch(res => {
            this.loadingShow = false
            this.$store.commit('setFetchDisabled', false)
            this.$message({
              type: 'error',
              message: '服务器开小差了！'
            })
          })
      })
    },
    goBack () {
      this.$router.go(-1)
    },
    alertSuccess (obj) {
      this.$confirm(
        `<div class="sy-global-success-text"><div>${
          obj.text
        }</div><div><ul class="sy-global-success-ul"><li class="sy-global-success-ul-li">${
          obj.li1
        }</li><li class="sy-global-success-ul-li">${
          obj.li2
        }</li><li class="sy-global-success-ul-li">${
          obj.li3
        }</li></ul></div></div>`,
        '',
        {
          // 是否当做HTML片段插入
          dangerouslyUseHTMLString: true,
          // box的ClassName
          customClass: 'alert-success--across',
          // 两个按钮的文案
          cancelButtonText: obj.okBtn,
          confirmButtonText: obj.infoBtn,
          //
          cancelButtonClass: 'sy-global-cancel',
          confirmButtonClass: 'sy-global-confirm',
          // 是否显示右上角关闭按钮
          showClose: false,
          center: true,
          // 是否可以点击遮罩层关闭
          closeOnClickModal: false,
          // 是否可以摁ESC关闭
          closeOnPressEscape: false,
          // 是否禁止滚动
          lockScroll: false
        }
      )
        .then(obj.info)
        .catch(obj.ok)
    },
    popUpSuccess (obj) {
      let horizontal = obj.horizontal
      this.$alert(
        `<div class="sy-global-success-text"><i style="display: ${
          horizontal ? 'inline-block' : 'block'
        }" class="el-icon-circle-check-outline"></i><span>${
          obj.text
        }</span><span style="display:${
          obj.text2 ? 'block' : 'none'
        };font-size:14px;text-align:center;margin-bottom:10px;">${
          obj.text2
        }</span></div>`,
        '',
        {
          /* this.$alert(`<div class="sy-global-success-text"><i class="el-icon-circle-check-outline"></i>
      <span>${obj.text}</span></div>`, '', { */
          // 是否当做HTML片段插入
          dangerouslyUseHTMLString: true,
          // box的ClassName
          customClass: 'alert-success',
          // 两个按钮的文案
          confirmButtonText: obj.okBtn,
          // 是否显示右上角关闭按钮
          showClose: false,
          center: true,
          // 是否可以点击遮罩层关闭
          closeOnClickModal: false,
          // 是否可以摁ESC关闭
          closeOnPressEscape: false
        }
      )
        .then(obj.ok)
        .catch(res => {
          console.log(res)
        })
    },
    // 确认弹层
    alertConfirm (obj) {
      let cancelButtonClass = obj.plain
        ? 'sy-global-cancel-button--plain'
        : 'sy-global-cancel-button'
      return new Promise((resolve, reject) => {
        return this.$confirm(
          `<div class="dialog-success-text"><span>${obj.text}</span></div>`,
          '',
          {
            // 是否当做HTML片段插入
            dangerouslyUseHTMLString: true,
            // box的ClassName
            customClass: 'confirm-dialog',
            // 两个按钮的文案
            confirmButtonText: obj.infoBtn,
            cancelButtonText: obj.okBtn,
            cancelButtonClass: cancelButtonClass,
            // 是否显示右上角关闭按钮
            showClose: false,
            center: true,
            // 是否可以点击遮罩层关闭
            closeOnClickModal: false,
            // 是否可以摁ESC关闭
            closeOnPressEscape: false,
            // 是否禁止滚动
            lockScroll: false
          }
        )
          .then(obj.info)
          .catch(obj.ok)
      })
    },
    // 转换人民币
    transformChinese (amount) {
      let nzhcn = Nzh.cn
      amount = parseFloat(amount.toString().replace(/,/g, '')).toFixed(2)
      if (parseInt(amount) === amount) {
        // 是整数
        amount = nzhcn.encodeB(amount)
        return amount + '整'
      } else {
        // 不是整数
        amount = nzhcn.encodeB(amount)
        return amount
      }
    },
    amountToChinese (amount) {
      let nzhcn = Nzh.cn
      amount = parseFloat(
        parseFloat(amount.toString().replace(/,/g, '')).toFixed(2)
      )
      return nzhcn.toMoney(amount, { outSymbol: false })
    },
    // 获取用户角色
    getUserRole () {
      let userData = Getitem('userData')
      if (userData) {
        let systemRole = JSON.parse(userData).systemRole
        if (systemRole) {
          return systemRole.toLowerCase()
        } else {
          return 'unknow'
        }
      } else {
        return 'unknow'
      }
    },
    getRole () {
      let userData = Getitem('userData')
      if (userData) {
        let role = JSON.parse(userData).role
        if (role) {
          return role.toLowerCase()
        } else {
          return 'unknow'
        }
      } else {
        return 'unknow'
      }
    },
    // 退出登录
    logOut () {
      Removeitem('token')
      Removeitem('userData')
      Removeitem('perfectState')
      Removeitem('enterpriseName')
      Removeitem('topName')
      // 移除本地存储中是否显示浏览器版本的提示
      Removeitem('browserLowTip')
      Removeitem('store')
      sessionStorage.removeItem('browserLowTip')
      this.$router.replace('/login')
    },
    concatDate (date, concat) {
      date = date.slice(0, 10) + ' ' + concat
      return date
    },
    // 获取账户余额
    getAccount () {
      const getAccountUrl = settings.apiGateway.getAccountBalance
      this.fetch(getAccountUrl)
        .then(data => {
          this.$store.commit('setAccount', data.data)
        })
        .catch(data => {
          this.$message({
            type: 'error',
            message: data.data.msg
          })
        })
    },
    // 检查是否有待审核业务接口
    checkCodeStatus () {
      this.fetch(settings.apiGateway.checkTransaction)
        .then(res => {
          this.$store.commit('setCheckcodeStatus', res.data.code)
        })
        .catch(data => {
          let code = data.data ? data.data.code : 0
          this.$store.commit('setCheckcodeStatus', code)
        })
    },
    // 获取金币余额
    getGold () {
      const getAccountGold = settings.apiGateway.getAccountGold
      this.fetch(getAccountGold)
        .then(data => {
          this.$store.commit('setGold', data.data)
        })
        .catch(data => {
          this.$message({
            type: 'error',
            message: data.data.msg
          })
        })
    },
    // 全局log方法
    log (info, level = 'production', type = 'log') {
      // type enum 'log' 'info' 'warn' 'error' default log
      // level enum 'development' 'production' etc
      let env = process.env.NODE_ENV
      // 如果传入的level和运行环境有一个是development则可打印
      if (level === 'development' || env === 'development') {
        // console[type](info)
      }
    },
    // 金额格式化
    toThousands (val) {
      if (!val && (val !== 0 || val !== '0')) return ''
      let str = parseFloat(String(val).replace(/,/g, '')) + ''
      let num1 = str.split('.')[0]
      let num = parseFloat('0.' + str.split('.')[1]).toFixed(3) // 这里因为我需要两位小数所以做一个限制，你们看情况做小数位的限制
      str = num1 + '.' + String(num).split('.')[1]
      // num = parseFloat(num).toFixed(3)
      let s = str.substring(0, str.length - 1) // 只取小数位2位
      return (
        s &&
        s.toString().replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
          return $1 + ','
        })
      )
    },
    // 时间戳转换时间
    toNormalDate (val) {
      let date = new Date(val)
      let Y = date.getFullYear() + '.'
      let M =
        (date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) + '.'
      let D = date.getDate() + ' '
      let h = date.getHours() + ':'
      let m = date.getMinutes() + ':'
      let s = date.getSeconds()
      return Y + M + D + h + m + s
    },
    // 检验手机号
    checkPhones (val) {
      let number = /^[1][3,4,5,6,9,7,8][0-9]{9}$/
      if (!number.test(val)) {
        return true
      } else {
        return false
      }
    },
    // 检验文字姓名
    checkNames (val) {
      let NameReg = /^[\u4E00-\u9FA5]{2,20}$/
      if (!NameReg.test(val)) {
        return true
      } else {
        return false
      }
    },
    // 检验邮箱
    checkEmails (val) {
      if (val.length > 40) {
        return true
      }
      let EmailReg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/i
      if (val && !EmailReg.test(val)) {
        return true
      } else {
        return false
      }
    },
    // 检验信用代码
    checkCredits (val) {
      let region = /(^[A-Z0-9]{18}$)/
      if (!region.test(val)) {
        return true
      } else {
        return false
      }
    },
    // 检验身份证号
    // checkCodes (val) {
    //   let idCard = this.IDReg
    //   if (!idCard.test(val)) {
    //     return true
    //   } else {
    //     return false
    //   }
    // },
    // 检验身份证号
    checkCodes (id) {
      // 1 "验证通过!", 0 //校验不通过 // id为身份证号码
      var format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/
      // 号码规则校验
      if (!format.test(id)) {
        return true
      }
      // 区位码校验
      // 出生年月日校验  前正则限制起始年份为1900;
      var year = id.substr(6, 4) // 身份证年
      var month = id.substr(10, 2) // 身份证月
      var date = id.substr(12, 2) // 身份证日
      var time = Date.parse(month + '-' + date + '-' + year) // 身份证日期时间戳date
      var nowTime = Date.parse(new Date()) // 当前时间戳
      var dates = new Date(year, month, 0).getDate() // 身份证当月天数
      if (time > nowTime || date > dates) {
        return true
      }
      // 校验码判断
      var c = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2] // 系数
      var b = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'] // 校验码对照表
      var idArray = id.split('')
      var sum = 0
      for (var k = 0; k < 17; k++) {
        sum += parseInt(idArray[k]) * parseInt(c[k])
      }
      if (idArray[17].toUpperCase() !== b[sum % 11].toUpperCase()) {
        return true
      }
      return false
    },
    // 检验银行账号
    checkBankCode (val) {
      let BankCode = /^\d{12,32}$/
      if (!BankCode.test(val)) {
        return true
      } else {
        return false
      }
    },
    // 检验字符串字节长度
    checkStrByte (str) {
      try {
        return new Blob([str]).size
      } catch (e) {
        return str.length
      }
    },
    // 证件类型校验
    checkTypeCard (type, code) {
      if (type === '01020100') {
        if (this.checkCodes(code)) return '身份证号输入错误'
        return false
      } else if (type === '01020101') {
        let region = /(^[a-zA-Z0-9]{20}$)/
        if (!region.test(code)) return '护照号输入错误'
        return false
      } else if (type === '01020102') {
        let region = /(^[0-9]{7}$)/
        if (!region.test(code)) return '军官证号输入错误'
        return false
      } else if (type === '01020103') {
        let region = /(^[0-9]{7}$)/
        if (!region.test(code)) return '士兵证号输入错误'
        return false
      } else if (type === '01020104') {
        let region = /(^[a-zA-Z][0-9]{10}$)/
        if (!region.test(code)) return '回乡证号输入错误'
        return false
      } else if (type === '01020105') {
        let region = /(^[0-9]{1,7}$)/
        if (!region.test(code)) return '警官证号输入错误'
        return false
      } else if (type === '01020106') {
        let region = /(^[a-zA-Z0-9]\d{0,7}$)/
        if (!region.test(code)) return '台胞证号输入错误'
        return false
      } else if (type === '01020107') {
        let region = /(^[a-zA-Z0-9]{15,20}$)/
        if (!region.test(code)) return '证件号输入错误'
        return false
      }
    },
    // 删除无用对象
    deleteObj (obj) {
      let newObj = JSON.parse(JSON.stringify(obj))
      for (let key in newObj) {
        if (!newObj[key]) delete newObj[key]
      }
      return newObj
    }
  }
}
