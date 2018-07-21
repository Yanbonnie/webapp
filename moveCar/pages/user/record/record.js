// pages/user/record/record.js
const app = getApp();
const { globalData: { REQUEST } } = app;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabIndex:0,
        mymove: [],
        mycarlog: [],
        dataList:[],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getMyMoveFn();
    },
    changeTab(e){
      const { index } = e.currentTarget.dataset;
      this.setData({
        tabIndex:index
      })

      if(index == 0){
        this.getMyMoveFn();
      }else{
        this.getMyCarLog();
      }
    },
    getMyMoveFn() {
        wx.showLoading({
            title: '加载中...',
            mask: true
        })
        REQUEST('GET', 'get_mymove', {
            unionid: app.globalData.unionid
        }).then(res => {
            wx.hideLoading();
            this.setData({
                mymove: res.data ? res.data : [],
                dataList: res.data ? res.data : [],
            })
        })
    },
    delMymoveHandle(e) {
        const { code } = e.currentTarget.dataset;
        wx.showModal({
            title: '提示',
            content: '确认删除？',
            success: res => {
                if (res.confirm) {
                    REQUEST('POST', 'del_mymove', {
                        code,
                        unionid: app.globalData.unionid
                    }).then(res => {
                        this.getMyMoveFn();
                    })
                }
            }
        })
    },
    getMyCarLog() {
        wx.showLoading({
            title: '加载中...',
            mask: true
        })
        REQUEST('GET', 'get_mycarlog', {
            unionid: app.globalData.unionid
        }).then(res => {
            wx.hideLoading();
            this.setData({
                mycarlog: res.data ? res.data : [],
                dataList: res.data ? res.data : [],
            })
        })
    },
    delMyCarLogHandle(e) {
        const { code } = e.currentTarget.dataset;
        wx.showModal({
            title: '提示',
            content: '确认删除？',
            success: res => {
                if (res.confirm) {
                    REQUEST('POST', 'del_mycarlog', {
                        code,
                        unionid: app.globalData.unionid
                    }).then(res => {
                        this.getMyCarLog();
                    })
                }
            }
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        const {tabIndex} = this.data;
        if (tabIndex == 0) {
            this.getMyMoveFn();
        } else {
            this.getMyCarLog();
        }
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        console.log("到底了")
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})