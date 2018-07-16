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
    reqUrl: 'https://car.jc5588.cn/index.php/wxapp/index/'
}
const URL = {
    'userLogin': 'userLogin',          //登录接口
}

//请求接口封装
const REQUEST = (method, url, data, err = false) => {   //err->true  需要对失败进行特殊处理
    return new Promise((resolve, reject) => {
        // console.log(Config.reqUrl + URL[url])
        wx.request({
            method,
            url: Config.reqUrl + URL[url],
            data,
            success: res => {
                // console.log(res)
                if (res.data.status == 0) {
                    resolve(res.data);
                } else {
                    if (err) {
                        reject(res.data)
                    } else {
                        wx.showToast({
                            icon: 'none',
                            mask: true,
                            title: res.data.msg,
                        })
                    }

                }
            }
        })
    })
}

module.exports = {
    formatTime: formatTime,
    REQUEST,
    Config,
    URL
}

