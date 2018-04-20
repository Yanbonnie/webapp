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
        console.log(options)
        const { id } = options;
        let Timer = setInterval(() => {
            if (app.globalData.userInfo) {
                clearInterval(Timer);
                if(id || id == 0){  //首页                    
                    wx.navigateTo({
                        url: "/pages/detail/detail?id="+id
                    })
                }else{
                    wx.switchTab({
                        url: "/pages/index/index"
                    })
                }
            }
        }, 100)
    }
})