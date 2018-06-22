//app.js
const key = '21ed62ad89c8b67d1a1172d4411a0c21';
// const { WXREQ, URL } = require('/utils/utils');
import { WXREQ, URL } from '/utils/util';
const Promise = require('/utils/es6-promise')
App({
    onLaunch: function () {
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            console.log(res)
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfoData = res;
                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                } else {
                    this.userInfoReadyCallback({ "oppenid": "none" })
                }
            }
        })
    },
    userInfoReadyCallback() { },
    globalData: {
        userInfoData:null,
        userInfo: null,
        key,
        is_pay_apply:null,
        is_pay_praise:null
    }
})