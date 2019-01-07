var md5 = require('./md5.js')

const Promise = require('./es6-promise')
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
    reqUrl: 'http://weixiu.globaldream.cn/api/'
}

const URL = {
    'getslideimage': 'getslideimage',        //幻灯片
    'getcategory': 'getcategory',            //获取分类
    'wechatauth': 'wechatauth',              //登陆接口
    'getstoreaddress':'getstoreaddress',     //获取门店地址
    'createorders':'createorders',           //创建订单
    'getorderdetail':'getorderdetail',       //获取订单详情
    'getservicename':'getservicename',       //获取维修项目name
    'getorderlist':'getorderlist',           //获取订单列表
    'sendsms': 'sendsms',                    //发送验证码
    'updatesms': 'updatesms',                //验证手机
    'wxpay':'wxpay',                         //微信支付
    'getmobile':'getmobile',                 //验证是否已经提供过手机信息
    'cancelorder':'cancelorder',             //取消订单
}

//请求接口封装
const REQUEST = ({
    method = 'get',
    url,
    data = {},
    header = {},
    err = false
}) => { //err->true  需要对失败进行特殊处理
    return new Promise((resolve, reject) => {
        var key = '6ff0041a7b03ee2c2556c11fe8df0c4a';
        var x_time = Math.floor(new Date().getTime() / 1000);
        var agent = "Api Client";

        wx.request({
            method,
            url: Config.reqUrl + URL[url],
            data,
            header: {
                'X-User-Agent': agent,
                'X-Authorization-Time': x_time,
                'X-Authorization-Token': md5.hex_md5(key + x_time + agent),
                ...header
            },
            success: res => {
                // wx.hideLoading()
                if (res.data.api_status == 1) {
                    resolve(res.data);
                } else {

                    if (err) {

                        reject(res.data)
                    } else {
                        wx.showToast({
                            icon: 'none',
                            mask: true,
                            title: res.data.api_message || '请求失败',
                        })
                    }
                }
            },
            fail: err => {
                wx.showToast({
                    icon: 'none',
                    mask: true,
                    title: '服务器出错了',
                })
            }
        })
    })
}

module.exports = {
    formatTime: formatTime,
    REQUEST,
    Config,
    URL,
}