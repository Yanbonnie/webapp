// pages/propShopping/propShopping.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options);
        console.log(app)
    },
    // 获取商城道具接口
    getToolsList(){
        wx.showLoading({
            title: '加载中...',
            mask:true
        })
        app.api.requestHandle({
            url: app.api.stringifyUrl({
                path: '/wxapp/Index/getToolsList'
            }),
            data: {
                unionid: this.data.userInfo.unionid,
                code: this.data.options.code,
                formId,
                tools_id
            },
            success: res => {
                wx.hideLoading();
                let data = res.data;
                if (data.status == 0) {
                    wx.showToast({
                        title: '成功使用道具',
                        icon: 'success',
                        mask: true
                    })
                } else {
                    wx.showToast({
                        title: data.msg || '出错了',
                        icon: 'none',
                        mask: true
                    })
                }
            }
        });
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