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
    'userLogin': 'userLogin',            //登录接口
    'getslideimage':'getslideimage',     //幻灯片
    'getcategory':'getcategory',         //获取分类
    'wechatauth':'wechatauth',
}

//请求接口封装
const REQUEST = ({ method='get', url, data={}, header={}, err=false}) => { //err->true  需要对失败进行特殊处理
    return new Promise((resolve, reject) => {
        wx.request({
            method,
            url: Config.reqUrl + URL[url],
            data,
            header:{
                'X-Authorization-Token': '841e34cad5e266379ae2dd92f94d9df9',
                'X-Authorization-Time': new Date().getTime(),
                'X-User-Agent': 'api',
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