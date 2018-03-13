const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//配置参数
const Config = {
  reqUrl: 'http://192.168.22.212:8888/'
}
//请求
const WXREQ = (url,method,data,success)=>{
  wx.request({
    url: Config.reqUrl + url, //仅为示例，并非真实的接口地址
    data: data,
    method:method,
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: res => {
      success(res.data)      
    }
  })
}
//去除首尾空格
const TRIM = str=>{
  return str.replace(/\s+/g, '')
}

module.exports = {
  formatTime: formatTime,
  config:Config,
  WXREQ,
  TRIM
}
