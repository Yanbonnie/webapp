// pages/shopping/shopping.js
const app = getApp();
const { onShareAppMessage } = require('../../utils/pageCom');
const {
    globalData: {
        REQUEST
    }
} = app;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        level: null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getMyInfo();
    },
    onShareAppMessage,
    getMyInfo() {
        REQUEST('get', 'getMyInfo', {
            unionid: app.globalData.unionid
        }).then(res => {
            wx.stopPullDownRefresh();
            const { level } = res.userinfo;
            this.setData({level:3})
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    }
})