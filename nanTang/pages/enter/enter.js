// pages/enter/enter.js
const app = getApp();
const Promise = require('../../utils/es6-promise')
import { REQUEST } from '../../utils/request.js';
import { WXREQ, URL } from '../../utils/util';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: null,
        is_black: 0,
        msg: "",
        hasUserInfo:true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const id = options.id ? options.id : -1;
        this.setData({ id })
        let Info = wx.getStorageSync('Info')
        if(Info){
            app.globalData.userInfo = Info;
            this.getBlackList();   //判断是否是黑名单
        }else{
            this.getUserInfo().then(res => {   //判断授权按钮是否显示
                if (!res.success) {
                    this.setData({
                        hasUserInfo: false
                    })
                }
            })
            if (app.globalData.userInfoData) {
                this.loginHandle(app.globalData.userInfoData);
            } else {
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                app.userInfoReadyCallback = res => {
                    if (res.userInfo) {
                        this.loginHandle(res)
                    }
                }
            }
        }
        
    },
    //获取用户信息
    getUserInfo() {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        return new Promise((resolve, reject) => {
            wx.getUserInfo({
                success: res => {
                    resolve({ success: true })
                },
                fail: res => {
                    resolve({ success: false })
                }
            })
        })
    },    
    bindGetuserinfo: function (e) {  //没有授权的时候进入页面
        if (e.detail.userInfo) {
            // const { iv, encryptedData } = e.detail.userInfo;
            console.log("点击了允许授权按钮");
            console.log(e)
            this.loginHandle(e.detail)
            //用户按了允许授权按钮
        } else {
            //用户按了拒绝按钮
            console.log("点击了拒绝授权按钮")
        }
    },
    //登录获取code
    loginHandle({ iv, encryptedData }) {
        console.log(iv)
        console.log(encryptedData)
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                const { code } = res;
                this.getAllUserInfo(code, iv, encryptedData)
            }
        })
    },    
    //获取用户的全部信息
    getAllUserInfo(code, iv, encryptedData) {
        const { key } = app.globalData;
        WXREQ('GET', URL['userLogin'], {
            code,
            iv,
            encryptedData,
            key
        }, res => {
            if (res.status == 0) {
                app.globalData.userInfo = res.data;
                wx.setStorageSync('Info', res.data);
                this.getBlackList();  ////判断是否是黑名单
            } else {
                // wx.hideLoading();
                wx.showModal({
                    title: '',
                    content: '登录失败，请重新登录',
                    showCancel: false,
                    confirmText: '确定',
                    success: res => {
                        // this.init();
                        this.loginHandle(app.globalData.userInfoData);
                    }
                })
            }
        })
    },

    //判断用户是否是黑名单
    getBlackList() {
        REQUEST('GET', 'getBlackList', {}, 0).then(res => {
            this.setData({
                is_black: res.is_black
            })
            if (res.is_black == 1) {  //黑名单
                this.setData({
                    msg: res.msg
                })
            } else {
                this.goPage();
            }
        })
    },
    goPage() {
        const { id } = this.data;
        if (id > -1) {
            wx.reLaunch({
                url: "/pages/detail/detail?id=" + id + "&index=1"
            })
        } else { //首页   
            wx.reLaunch({
                url: "/pages/index/index"
            })
        }
    }
})