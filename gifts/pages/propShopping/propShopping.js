// pages/propShopping/propShopping.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        toolList: [],   //道具列表   name-道具名  explain-道具说明   num-道具数量  pic-道具图片
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getToolsList();
    },
    // 获取商城道具接口
    getToolsList(){
        wx.showLoading({
            title: '加载中...',
            mask:true
        })
        wx.request({
            url: app.api.stringifyUrl({
                path: '/wxapp/Index/getToolsList'
            }),
            data:{
                key: app.api.appKey
            },
            success:res=>{
                wx.hideLoading();
                let data = res.data;
                if (data.status == 0) {
                    this.setData({
                        toolList: data.data
                    })
                } else {
                    wx.showToast({
                        title: data.msg || '出错了',
                        icon: 'none',
                        mask: true
                    })
                }
            }
        })
    },
    // 购买道具
    payTools(e){
        const { tools_id } = e.currentTarget.dataset;
        app.api.requestHandle({
            url: app.api.stringifyUrl({
                path: '/wxapp/Index/payTools'
            }),
            data: {
                tools_id
            },
            success: res => {
                let data = res.data;
                if(data.status == 0){
                    const { nonceStr, paySign, signType, timeStamp } = data;
                    const package2 = data.package
                    wx.requestPayment({
                        timeStamp,
                        nonceStr,
                        'package': package2,
                        signType,
                        paySign,
                        'success': res => {
                            //支付成功
                            console.log("支付成功")
                        },
                        'fail': res => {
                        }
                    })
                }else{
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