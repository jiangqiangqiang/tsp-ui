import Nzh from 'nzh'
let globalFilter = {}
globalFilter.install = function (Vue) {
  Vue.filter('toThousands', val => {
    if (val === '') return ''
    if (val === null) return ''
    let num = parseFloat(val).toFixed(2) // 这里因为我需要两位小数所以做一个限制，你们看情况做小数位的限制
    num = parseFloat(num).toFixed(3) // 这里因为我需要两位小数所以做一个限制，你们看情况做小数位的限制
    let s = num.substring(0, num.length - 1) // 只取小数位2位
    return (
      s &&
      s.toString().replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
        return $1 + ','
      })
    )
  })
  /*
   * 时间格式化
   * time: 可以使任何时间
   * fmt: 输出的时间格式 例如'yyyy-MM-dd/hh:mm:ss'
  */
  Vue.filter('dateFtt', (time, fmt) => {
    if (!time) return ' '
    // '/'连接符才是广泛被接受的
    let date = new Date(Date.parse(time.replace(/-/g, '/')))
    var o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'h+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      S: date.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        (date.getFullYear() + '').substr(4 - RegExp.$1.length)
      )
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1
            ? o[k]
            : ('00' + o[k]).substr(('' + o[k]).length)
        )
      }
    }
    return fmt
  })
  // 时间戳转换时间
  // 比如需要这样的格式 yyyy-MM-dd hh:mm:ss
  Vue.filter('toDate', (val = +new Date()) => {
    if ((val + '').indexOf('T') > -1) {
      return val.substr(0, 19).replace('T', ' ').replace(/-/g, '.')
    }
    var date = new Date(val + 8 * 3600 * 1000)
    return date
      .toJSON()
      .substr(0, 19)
      .replace('T', ' ')
      .replace(/-/g, '.')
  })

  Vue.filter('setDiscount', val => {
    return val || '0.00'
  })

  /**
   * 格式化票面利率
   * 最多保留两位小数，小数末位为零不保留
   */
  Vue.filter('rateFtt', rate => {
    return Math.round(rate * 10000) / 100
  })
  Vue.filter('showOperation', rowData => {
    let operation = ''
    let status = rowData.paymentStatus
    if (rowData.statusDesc === '待支付' || rowData.statusDesc === '支付失败' || rowData.statusDesc === '管理员驳回') {
      operation = '支付'
    } else if (
      rowData.statusDesc === '申请超时' ||
      rowData.statusDesc === '已取消'
    ) {
      operation = '重新支付'
    } else if (rowData.statusDesc === '待审核') {
      operation = '取消申请'
    } else if (status === 'Succeed' || status === 'SUCCEED') {
      operation = '查看详情'
    } else {
      operation = ''
    }
    return operation
  })
  Vue.filter('saleStatus', status => {
    let operation = ''
    if (status === 'Pending') {
      operation = '待审核'
    } else if (status === 'Rejected') {
      operation = '已驳回'
    } else if (status === 'Paying') {
      operation = '待支付'
    } else if (status === 'Saling') {
      operation = '出售中'
    } else if (status === 'Finished' || status === 'Succeed') {
      operation = '已完成'
    } else if (status === 'Canceled') {
      operation = '已撤销'
    } else if (
      status === 'Cancel' ||
      status === 'CanceledByOperator' ||
      status === 'CanceledByAdmin'
    ) {
      operation = '已取消'
    } else if (status === 'PayFailed') {
      operation = '支付失败'
    } else if (status === 'Sending') {
      operation = '交易中'
    }
    return operation
  })
  Vue.filter('buyStatus', status => {
    let operation = ''
    if (status === 'Pending') {
      operation = '待审核'
    } else if (status === 'CanceledByAdmin' || status === 'Cancel') {
      operation = '审核未通过'
    } else if (
      status === 'Paying' ||
      status === 'Succeed' ||
      status === 'Sending' ||
      status === 'CanceledByOperator'
    ) {
      operation = '已通过'
    }
    return operation
  })
  Vue.filter('toFix2', val => {
    return parseFloat(val).toFixed(2)
  })
  Vue.filter('operationShow', rowData => {
    let operation = ''
    let status = rowData.status
    if (status === 'Pending') {
      operation = '继续充值'
    } else if (status === 'Succeed') {
      operation = '查看详情'
    } else {
      operation = '查看详情'
    }
    return operation
  })
  Vue.filter('topUpStatus', status => {
    let operation = ''
    if (status === 'Pending') {
      operation = '待支付'
    } else if (status === 'Succeed') {
      operation = '充值成功'
    } else if (status === 'Failed') {
      operation = '充值失败'
    } else if (status === 'Console') {
      operation = '已取消'
    } else if (status === 'Sending') {
      operation = '交易中'
    }
    return operation
  })
  Vue.filter('tradeStatus', status => {
    let operation = ''
    if (status === 'Pending') {
      operation = '待审核'
    } else if (status === 'Reject') {
      operation = '审核未通过'
    } else if (status === 'Sending') {
      operation = '提现中'
    } else if (status === 'Succeed') {
      operation = '提现成功'
    } else if (status === 'Failed') {
      operation = '提现失败'
    } else if (status === 'Expired') {
      operation = '申请超时'
    } else if (status === 'Cancel') {
      operation = '提现取消'
    } else if (status === 'BankRebut') {
      operation = '银行驳回'
    }
    return operation || status
  })
  Vue.filter('transformChinese', amount => {
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
  })
  // 转换人民币大写
  Vue.filter('amountToChinese', amount => {
    let nzhcn = Nzh.cn
    amount = amount || 0
    amount = parseFloat(
      parseFloat(amount.toString().replace(/,/g, '')).toFixed(2)
    )
    let res = nzhcn.toMoney(amount, { outSymbol: false, tenMin: false })
    if (res[res.length - 1] === '角') {
      res = res + '整'
    }
    if (amount.toString()[amount.toString().indexOf('.') - 1] === '0' && amount.toString().split('.')[1][0] > 0) {
      res = res.replace('元', '元零')
    }
    return res
  })
  // 转换备注类型
  Vue.filter('remarkType', num => {
    let type = ''
    if (num === 1) {
      type = '充值所得'
    } else if (num === 2) {
      type = '收款所得'
    } else if (num === 3) {
      type = '出售所得'
    } else if (num === 4) {
      type = '购买所得'
    } else {
      type = num
    }
    return type
  })
  // 转换支付方案类型
  Vue.filter('calcScheme', val => {
    let type = ''
    if (val === 'HOLD_SHORT_FIRST') {
      type = '方案一：服务费最少'
    } else if (val === 'LAST_SHORT_FIRST') {
      type = '方案二：享受补贴最多'
    } else if (val === 'LAST_LONG_FIRST') {
      type = '方案三：等候提现时间最短'
    } else {
      type = val
    }
    return type
  })
  // 转换企业类型
  Vue.filter('toEnterpriseType', type => {
    let madeType = ''
    if (type === 'ET_PE') {
      madeType = '企业'
    } else if (type === 'ET_SE') {
      madeType = '个体工商户'
    } else if (type === 'ET_OU') {
      madeType = '政府机构/事业单位'
    } else {
      madeType = type
    }
    return madeType
  })
  // 倒计时小时
  Vue.filter('setTimeHour', cutdowns => {
    if (cutdowns >= 0) {
      return cutdowns / 3600 < 10
        ? '0' + parseInt(cutdowns / 3600)
        : parseInt(cutdowns / 3600)
    }
  })
  // 倒计时分钟
  Vue.filter('setTimeMinutes', cutdowns => {
    if (cutdowns >= 0) {
      cutdowns = cutdowns % 3600
      return cutdowns / 60 < 10
        ? '0' + parseInt(cutdowns / 60)
        : parseInt(cutdowns / 60)
    }
  })
  // 倒计时秒
  Vue.filter('setSecond', cutdowns => {
    if (cutdowns >= 0) {
      return cutdowns % 60 < 10
        ? '0' + parseInt(cutdowns % 60)
        : parseInt(cutdowns % 60)
    }
  })
  Vue.filter('hideString', param => {
    let paramStr = String(param)
    let len = paramStr.length
    if (len < 9) {
      return paramStr
    }
    return paramStr.replace(/(.{3})(.+)(.{4})/, (x, y, z, p) => {
      let i = ''
      while (i.length < z.length) {
        i += '*'
      }
      if (i.length > 8) i = ' **** **** '
      return y + i + p
    })
  })
}

export default globalFilter
