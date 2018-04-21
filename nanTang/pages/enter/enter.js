// pages/enter/enter.js
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
    onLoad: function (options) {
        const { id } = options;
        let Timer = setInterval(() => {
            if (app.globalData.userInfo) {
                clearInterval(Timer);
                if(id || id == 0){                   
                    wx.redirectTo({
                        url: "/pages/detail/detail?id="+id+"&index=1"
                    })
                } else { //首页   
                    wx.switchTab({
                        url: "/pages/index/index"
                    })
                }
            }
        }, 100)
    }
})