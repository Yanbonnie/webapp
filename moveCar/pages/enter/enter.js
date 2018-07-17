//index.js
//获取应用实例
const app = getApp()
const { globalData: { REQUEST } } = app;
Page({
    data: {
        motto: '哈哈哈',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        count: 0
    },
    onLoad: function () {
        let openid = wx.getStorageSync('openid');
        if(openid){
            app.globalData.openid = openid;
            wx.switchTab({
                url: '/pages/index/index',
            })
        }else{
            if (app.globalData.userInfo) {
                this.setData({
                    userInfo: app.globalData.userInfo.userInfo,
                    hasUserInfo: true
                })
                this.loginHandle(app.globalData.userInfo);
            } else if (this.data.canIUse) {
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                app.userInfoReadyCallback = res => {
                    console.log(res)
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                    this.loginHandle(res);
                }
            } else {
                // 在没有 open-type=getUserInfo 版本的兼容处理
                wx.getUserInfo({
                    success: res => {
                        console.log(res)
                        app.globalData.userInfo = res
                        this.setData({
                            userInfo: res.userInfo,
                            hasUserInfo: true
                        })
                        this.loginHandle(res);
                    }
                })
            }
        }
        
    },
    getUserInfo: function (e) {
        console.log(e)
        if(e.detail.errMsg.indexOf('fail') == -1){
            app.globalData.userInfo = e.detail
            this.setData({
                userInfo: e.detail.userInfo,
                hasUserInfo: true
            })
            this.loginHandle(e.detail);
        }        

    },
    //登录获取code
    loginHandle({ iv, encryptedData }) {
        console.log("调取登录")
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                const { code } = res;
                this.getAllUserInfo(code, iv, encryptedData)
            }
        })
    },
    getAllUserInfo(code, iv, encryptedData) {
        let { count } = this.data;
        wx.showLoading({
            title: '加载中...'
        })
        REQUEST('POST', 'userLogin', {
            code,
            iv,
            encryptedData,
        }, true).then(res => {
            let { openid } = res.data;
            app.globalData.openid = openid;
            wx.setStorageSync('openid', openid)
            wx.hideLoading();
            wx.switchTab({
                url: '/pages/index/index',
            })
        }).catch(res => {
            if (count < 5) {
                this.loginHandle({ iv, encryptedData })
            } else {
                wx.hideLoading();
                wx.showToast({
                    icon: 'none',
                    mask: true,
                    title: '授权失败，请退出重试',
                    duration: 3000
                })
            }
            ++count;
            this.setData({
                count
            })
        })
    }
})

/*"tabBar": {
    "color": "#929292",
        "selectedColor": "#0894ec",
            "backgroundColor": "#ffffff",
                "borderStyle": "white",
                    "list": [
                        {
                            "pagePath": "pages/index/index",
                            "text": "aaaa"
                        },
                        {
                            "pagePath": "pages/apply/apply",
                            "text": "bbbb"
                        },
                        {
                            "pagePath": "pages/user/index/index",
                            "text": "cccc"
                        }
                    ]
}*/