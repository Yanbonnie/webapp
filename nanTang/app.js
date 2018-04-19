//app.js
const key = '21ed62ad89c8b67d1a1172d4411a0c21';
// const { WXREQ, URL } = require('/utils/utils');
import { WXREQ, URL } from '/utils/util';
App({
    onLaunch: function () {
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
        // 登录
        // wx.login({
        //     success: res => {
        //         // 发送 res.code 到后台换取 openId, sessionKey, unionId
        //     }
        // })
        // 获取用户信息
        this.init();
    },
    init(){
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    Promise.all([this.loginHandle(), this.getUserInfo()]).then(results => {
                        // console.log(results); // 获得一个Array: ['P1', 'P2']
                        const { code } = results[0];
                        const { iv, encryptedData } = results[1];
                        this.getAllUserInfo(code, iv, encryptedData);
                    });
                } else {   //未授权，拉起授权获取用户信息
                    wx.authorize({
                        scope: 'scope.userInfo',
                        success: res => {  //调用成功
                        }
                    })
                }
            }
        })
    },
    //登录
    loginHandle(){        
        return new Promise((resolve,reject)=>{
            wx.login({
                success: res => {
                    // 发送 res.code 到后台换取 openId, sessionKey, unionId
                    resolve(res)
                }
            })
        })
    },
    //获取用户信息
    getUserInfo(){
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        return new Promise((resolve, reject)=>{
            wx.getUserInfo({
                success: res => {
                    // 可以将 res 发送给后台解码出 unionId
                    // this.globalData.userInfo = res.userInfo
                    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                    // 所以此处加入 callback 以防止这种情况
                    if (this.userInfoReadyCallback) {
                        this.userInfoReadyCallback(res)
                    }
                    resolve(res)                    
                }
            })
        })
    },
    //获取用户的全部信息
    getAllUserInfo(code, iv, encryptedData){
        const { key } = this.globalData;
        WXREQ('GET', URL['userLogin'],{
            code,
            iv,
            encryptedData,
            key
        },res=>{
            if (res.status == 0){
                this.globalData.userInfo = res.data;
            }else{
                wx.showModal({
                    title:'',
                    content:'登录失败，请重新登录',
                    showCancel:false,
                    confirmText:'确定',
                    success:res=>{
                        this.init();
                    }
                })
            }
        })
    },
    globalData: {
        userInfo: null,
        key,
        is_pay_apply:null,
        is_pay_praise:null
    }
})