// pages/member/index/index.js
const app = getApp();
const Promise = require('../../../utils/es6-promise.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo:null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            userInfo:app.globalData.userInfo.userInfo
        })
    },
    // 拨打电话
    makePhoneCallHandle(e){
        const { phone } = e.currentTarget.dataset;
        wx.makePhoneCall({
            phoneNumber: phone // 仅为示例，并非真实的电话号码
        })
    },
    // 页面跳转
    navagateTo(e){
        const { page } = e.currentTarget.dataset;
        wx.navigateTo({
            url: page+'?unionid='+app.globalData.unionid,
        })
    }

})