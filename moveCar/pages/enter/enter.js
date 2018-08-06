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
        // const { share_query } = { share_query:'%2Fpages%2Findex%2Findex%3Ffriend_unionid=oJuNW0p6JAHsCs7CCKDI6RbUgdp4'};
        const { share_query } = options;
        // console.log(share_query);
        console.log(decodeURIComponent(share_query));
        // return;
        // let share_query = 'pages/enter/enter?share_query=%2Fpages%2Findex%2Findex%3Ffriend_unionid%oJuNW0p6JAHsCs7CCKDI6RbUgdp4';
        if (share_query) {
            let friend_unionid = getUrlPara('friend_unionid', decodeURIComponent(share_query));
            console.log('friend_unionid:' + friend_unionid)
            this.setData({
                share_query,
                friend_unionid
            })
        }   
        let unionid = wx.getStorageSync('unionid');
        if (unionid){
            app.globalData.unionid = unionid;
            this.setData({
                hasUserInfo:true
            })
            if (share_query) {
                const { friend_unionid } = this.data;
                console.log('friend_unionid:' + friend_unionid)
                this.postShareHandle(friend_unionid);
                let url = decodeURIComponent(share_query);
                setTimeout(() => {
                    wx.reLaunch({
                        url
                    })
                }, 300)
            } else {
                this.postShareHandle();
                wx.switchTab({
                    url: '/pages/index/index',
                })
            }
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
            app.globalData.unionid = unionid;
            wx.setStorageSync('unionid', unionid)            
            wx.hideLoading();
            const { share_query } = this.data;
            if (share_query) {
                let url = decodeURIComponent(share_query);
                const { friend_unionid } = this.data;
                console.log("friend_unionid:" + friend_unionid)
                this.postShareHandle(friend_unionid);
                setTimeout(() => {
                    wx.reLaunch({
                        url
                    })
                }, 300)
            } else {
                wx.switchTab({
                    url: '/pages/index/index',
                })
                this.postShareHandle();
            }
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
    //关系接口
    postShareHandle(friend_unionid=''){
        console.log('friend_unionid' + friend_unionid)
        REQUEST('POST','postShare',{
            my_unionid: app.globalData.unionid,
            friend_unionid: friend_unionid
        }).then(res => {
            // console.log("我是关系结果：")
            // console.log(res)
        })
    }, 
})
