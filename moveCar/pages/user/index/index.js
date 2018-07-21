// pages/user/index/index.js
const {
    changeNav
} = require('../../../utils/pageCom');
const app = getApp();
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
        navIndex: 2,
        ewmStatus: false,
        is_binding: null,
        wxheadpic: '',
        wxname: '',
        level: 1,
        car_number:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            is_binding: app.globalData.is_binding
        })
        console.log(this.data.is_binding)
        this.getMyInfo();
    },
    changeNav,
    getMyInfo() {
        REQUEST('get', 'getMyInfo', {
            unionid: app.globalData.unionid
        }).then(res => {
            console.log(res)
            const {
                wxheadpic,
                wxname,
                level,
                car_number,
                is_binding
            } = res.userinfo;
            this.setData({
                wxheadpic,
                wxname,
                level,
                car_number,
                is_binding
            })
        })
    },
    goInfoHandle() {
        wx.navigateTo({
            url: '/pages/user/info/info',
        })
    },
    goRecordHandle() {
        wx.navigateTo({
            url: '/pages/user/record/record',
        })
    },
    showEwmFn(e) {
        const {
            state
        } = e.currentTarget.dataset;
        this.setData({
            ewmStatus: state == 1 ? true : false
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})