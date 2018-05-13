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
        authorize: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const id = options.id ? options.id : -1;
        this.setData({ id })
        this.init();
    },
    init() {
        let Info = wx.getStorageSync('Info')
        if (Info) {
            app.globalData.userInfo = Info;
            this.getBlackList();   //判断是否是黑名单
        } else {
            this.getUserInfo().then(()=>{
                Promise.all([this.loginHandle(), this.getUserInfo()]).then(results => {
                    const { code } = results[0];
                    const { iv, encryptedData } = results[1];
                    this.getAllUserInfo(code, iv, encryptedData);
                });
            }).catch(res=>{
                this.init();
            })
        }
    },
    //登录
    loginHandle() {
        return new Promise((resolve, reject) => {
            wx.login({
                success: res => {
                    // 发送 res.code 到后台换取 openId, sessionKey, unionId
                    resolve(res)
                }
            })
        })
    },
    //获取用户信息
    getUserInfo() {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        return new Promise((resolve, reject) => {
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
                },
                fail: res => {
                    this.setData({
                        authorize: false
                    })
                    reject(res)
                }
            })
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
                        this.init();
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