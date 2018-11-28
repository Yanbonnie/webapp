// pages/member/order/success/success.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id:null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const { id } = options;
        this.setData({id})
    },

    goHomeHandle(){
        wx.reLaunch({
            url: '/pages/index/index',
        })
    },
    goOrderHandle(){
        const {id} = this.data;
        wx.redirectTo({
            url: '/pages/member/order/order_detail/order_detail?id='+id,
        })
    }
})