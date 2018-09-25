// pages/user/income/income.js
const app = getApp();
const {
    globalData: {
        REQUEST
    }
} = app;
const { onShareAppMessage } = require('../../../utils/pageCom');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list:null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getIncome();
    },
    onShareAppMessage,
    getIncome() {
        wx.showLoading({
            title: '加载中...',
        })
        REQUEST('get', 'getIncome', {
            unionid: app.globalData.unionid
        }).then(res => {
            wx.hideLoading();
            this.setData({
                list: res.data
            })
        })
    }
})