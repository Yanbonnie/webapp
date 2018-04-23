//app.js
const key = '21ed62ad89c8b67d1a1172d4411a0c21';
// const { WXREQ, URL } = require('/utils/utils');
import { WXREQ, URL } from '/utils/util';
App({
    onLaunch: function () {

        this.init();
    },
    init(){
        // wx.showLoading({
        //     title: '加载中...',
        //     mask:true
        // })
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    Promise.all([this.loginHandle(), this.getUserInfo()]).then(results => {
                        const { code } = results[0];
                        const { iv, encryptedData } = results[1];
                        
                        this.getAllUserInfo(code, iv, encryptedData);
                    });
                } else {   //未授权，拉起授权获取用户信息
                    wx.authorize({
                        scope: 'scope.userInfo',
                        success: res => {  //调用成功
                            this.init();
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
            if(res.status == 0){
                this.globalData.userInfo = res.data;
                
            }else{
                // wx.hideLoading();
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