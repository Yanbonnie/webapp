// pages/member/order/success/success.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    goHomeHandle(){
        wx.reLaunch({
            url: '/pages/index/index',
        })
    },
    goOrderHandle(){
        wx.redirectTo({
            url: '/pages/member/order/order_detail/order_detail',
        })
    }
})