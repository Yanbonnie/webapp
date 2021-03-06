// pages/saveDetail/saveDetail.js
const app = getApp();
const { globalData: { REQUEST, getUrlPara } } = app;
const { onShareAppMessage, closeIdCardHandle, idCardSubmitSuccess } = require('../../utils/pageCom');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        level:1,
        is_pay:null,
        idCardStatus:false,
        is_postidcard: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getMyInfo();
    },
    onShareAppMessage,
    closeIdCardHandle, 
    idCardSubmitSuccess,
    getMyInfo() {
        REQUEST('get', 'getMyInfo', {
            unionid: app.globalData.unionid
        }).then(res => {
            wx.stopPullDownRefresh();
            const {
                level,
                is_postidcard,
                is_pay
            } = res.userinfo;
            this.setData({
                level,
                is_postidcard: is_postidcard || 0,
                is_pay
            })
        })
    },
    payUpgradeHandle(){
        wx.showLoading({
            title: '加载中...',
            mask: true
        })
        REQUEST('POST', 'payUpgrade', {
            unionid: app.globalData.unionid,
        }).then(res => {
            wx.hideLoading();
            const { appId, nonceStr, paySign, signType, timeStamp } = res.data;
            const package2 = res.data.package;
            if (res.status == 0) {
                wx.requestPayment({
                    timeStamp,
                    nonceStr,
                    'package': package2,
                    signType,
                    paySign,
                    'success': res => {
                        //支付成功
                        // wx.switchTab({
                        //     url: '/pages/user/index/index'
                        // })
                        this.setData({
                          idCardStatus:true
                        })
                    },
                    'fail': res => {
                    }
                })
            } else {
                wx.showToast({
                    title: res.msg,
                    mask: false,
                    icon: 'none'
                })
            }

        })
    },
    // 关闭身份信息框
    closeIdCards(){
      this.setData({
        idCardStatus:false,
      })
    },
    // 提交身份证信息
    postIdcardHandle(e){
      console.log(e)
      const { id_num ,id_name } = e.detail.value;
      REQUEST('POST', 'postIdcard', {
        id_num,
        id_name,
        unionid: app.globalData.unionid,
      }).then(res=>{

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
    // onShareAppMessage: function() {
    //     let url = encodeURIComponent(`/pages/saveDetail/saveDetail?friend_unionid=${app.globalData.unionid}`);
    //     return {
    //         title: '我要分享一个好东西',
    //         path: `/pages/enter/enter?share_query=${url}`
    //     }
    // }
})