let fallbackStore = {}
export const Setitem = (key, val) => {
  try {
    localStorage.setItem(key, val)
  } catch (ex) {
    console.log('fallback to memory store')
    fallbackStore[key] = val
  }
}

export const Getitem = key => {
  try {
    return localStorage.getItem(key)
  } catch (ex) {
    return fallbackStore[key]
  }
}

export const Removeitem = key => {
  return localStorage.removeItem(key)
}

export const clearStorage = () => {
  Removeitem('token')
  Removeitem('userData')
  Removeitem('perfectState')
  Removeitem('enterpriseName')
  Removeitem('topName')
  // 移除本地存储中是否显示浏览器版本的提示
  Removeitem('browserLowTip')
  Removeitem('store')
  sessionStorage.removeItem('browserLowTip')
}

export const toThousands = str => {
  var num = parseFloat(str).toFixed(3) // 这里因为我需要两位小数所以做一个限制，你们看情况做小数位的限制
  var s = num.substring(0, num.length - 1) // 只取小数位2位

  return (
    s &&
    s.toString().replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
      return $1 + ','
    })
  )
}

// 处理第三步注册数据提交
export const registStep3 = data => {
  let submitData = JSON.parse(JSON.stringify(data.submitData))
  data.checked
    ? (submitData.termValidity = data.beginTime + '-' + '永久')
    : (submitData.termValidity = data.beginTime + '-' + data.endTime)
  data.codeChecked
    ? (submitData.legalCertDate = data.codeTimeStart + '-' + '永久')
    : (submitData.legalCertDate = data.codeTimeStart + '-' + data.codeTimeEnd)
  submitData.shareholder = JSON.stringify(data.shareholderList)
  for (let key in submitData) {
    if (!submitData[key]) delete submitData[key]
  }
  if (data.licenceType === '普通营业执照企业') {
    submitData.isTern = 0
  } else {
    submitData.isTern = 1
  }
  if (submitData.organizationalCode) submitData.organizationalCode = submitData.organizationalCode.replace('-', '')
  return submitData
}

// 处理日期限制
export const dateStart = timeStr => {
  if (!timeStr) {
    return {
      disabledDate (time) { // 开始时间-结束时间
        return time.getTime() < (new Date().getTime() - 1 * 24 * 60 * 60 * 1000)
      }
    }
  } else {
    return {
      disabledDate (time) { // 开始时间-结束时间
        return time.getTime() < (new Date(timeStr).getTime() + 1 * 24 * 60 * 60 * 1000) || time.getTime() < (new Date().getTime() - 1 * 24 * 60 * 60 * 1000)
      }
    }
  }
}
export const dateEnd = timeStr => {
  if (!timeStr) {
    return {
      disabledDate () { // 开始时间-结束时间
        return false
      }
    }
  } else {
    return {
      disabledDate (time) { // 开始时间-结束时间
        return (time.getTime() > new Date(timeStr).getTime())
      }
    }
  }
}
