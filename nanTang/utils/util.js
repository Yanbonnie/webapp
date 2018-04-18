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

const Config = {
    reqUrl: 'https://xnt.xhwxpos.com/sznt/wxapp/Index/'
}

const URL = {
    'userLogin':'userLogin',
    'getConfig':'getConfig',
    'getShop':'getShop',
    'getTel':'getTel',
    'postShopInfo': 'postShopInfo',     //商家⼊入驻信息提交接⼝口
    'uploadFile':'uploadFile',          //上传图片接口

}

const WXREQ = (method,url,data,succfn)=>{
    wx.request({
        url: Config.reqUrl + url, //仅为示例，并非真实的接口地址
        data: data,
        method: method,
        header: {
            'content-type': 'application/json' // 默认值
        },
        success: res => {
            succfn(res.data)
        }
    })
}
module.exports = {
  formatTime: formatTime,
  URL,
  WXREQ,
  Config
}
