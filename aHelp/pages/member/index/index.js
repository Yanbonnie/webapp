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
    // 页面跳转
    navagateTo(e){
        const { page } = e.currentTarget.dataset;
        wx.navigateTo({
            url: page,
        })
    }

})