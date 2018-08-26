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

const getUrlPara = function (str, _url) {
    var reg = new RegExp("(^|&)" + str + "=([^&]*)(&|$)", "i");
    var search = _url.split('?')[1]
    var par = search.match(reg);
    var str = par ? decodeURIComponent(par[2]) : '';
    return str;
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
    'postShare':'postShare',                 //分享
    'getFans':'getFans',                     //我的粉丝
    'getIncome':'getIncome',                 //收入记录
    'getMyInfo':'getMyInfo',                 //获取我的信息
    'getMyDetailedInfo':'getMyDetailedInfo', //获取我的资料
    'resetUserInfo':'resetUserInfo',         //修改
    'getShare':'getShare',                   //分享二维码
    'get_apply':'get_apply',                 //是否申请
    'payUpgrade':'payUpgrade',               //支付升级会员接口
    'payPostage':'payPostage',               //支付邮费
    'getSubscribe':'getSubscribe',           //获取用户有无关注
    'bindPhone':'bindPhone',           //绑定手机
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
                            title: res.data.msg || '请求失败',
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
    URL,
    getUrlPara
}

