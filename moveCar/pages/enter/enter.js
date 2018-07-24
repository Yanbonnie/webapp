//index.js
//获取应用实例
const app = getApp()
const { globalData: { REQUEST, getUrlPara } } = app;
Page({
    data: {
        motto: '哈哈哈',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        count: 0,
        share_query:null,
        friend_unionid:''
    },
    onLoad: function (options) {
        const { share_query } = options;
        // let share_query = '%2Fpages%2Fuser%2Findex%2Findex%3Ffriend_unionid%3DoJuNW0hHmY9lgAtsamZkfEZHGPgQ';
        if (share_query) {
            let friend_unionid = getUrlPara('friend_unionid', decodeURIComponent(share_query));
            // console.log("friend_unionid:" + friend_unionid);
            this.setData({
                share_query,
                friend_unionid
            })
        }   
        let unionid = wx.getStorageSync('unionid');
        if (unionid){
            app.globalData.unionid = unionid;
            setTimeout(() => {
                if (share_query) {
                    const { friend_unionid } = this.data;                 
                    this.postShareHandle(friend_unionid);
                    let url = decodeURIComponent(share_query);
                    // console.log('url:' + url)
                    wx.reLaunch({ url })
                } else {
                    this.postShareHandle();
                    wx.switchTab({
                        url: '/pages/index/index',
                    })
                }
            }, 200)
            return;
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
            let { openid, unionid } = res.data;
            // app.globalData.openid = openid;
            // wx.setStorageSync('openid', openid)
            app.globalData.unionid = unionid;
            wx.setStorageSync('unionid', unionid)
            
            wx.hideLoading();
            // wx.reLaunch({
            //     url: '/pages/index/index',
            // })
            const { share_query } = this.data;
            setTimeout(() => {
                if (share_query) {
                    let url = decodeURIComponent(share_query);
                    const { friend_unionid } = this.data;
                    this.postShareHandle(friend_unionid);
                    wx.reLaunch({ url })
                } else {
                    wx.switchTab({
                        url: '/pages/index/index',
                    })
                    this.postShareHandle();
                }
            }, 200)
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
    },
    postShareHandle(friend_openid=''){
        REQUEST('post','postShare',{
            my_unionid: app.globalData.unionid,
            friend_unionid: friend_openid
        },res=>{
            console.log(res)
        })
    },
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