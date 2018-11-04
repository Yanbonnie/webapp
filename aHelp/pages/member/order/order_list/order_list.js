// pages/member/order/order_list/order_list.js
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
    goDetail(){
        wx.navigateTo({
            url: '/pages/member/order/order_detail/order_detail',
        })
    }
    
})