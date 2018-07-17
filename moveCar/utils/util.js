  const Promise = require('../libs/es6-promise.js');
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
    'userLogin': 'userLogin',                //登录接口
    'get_banner':'get_banner',               //获取首页banner
    'post_uploadpic':'post_uploadpic',       //图片识别车牌号码
    'post_move_car':'post_move_car',         //提交我要挪车接口
    'post_apply':'post_apply',               //提交申请信息接口
    'get_msgcode':'get_msgcode',             //获取验证码
    'post_binding':'post_binding',           //我要绑定
    'get_mymove':'get_mymove',               //我要挪车列表 
    'del_mymove':'del_mymove',               //删除我要挪车数据
    'get_mycarlog':'get_mycarlog',           //我的车辆
    'del_mycarlog':'del_mycarlog',           //删除我的车辆    
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

