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
        car_number:'',
        ewmStatus2:false,
        friendUrl:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            is_binding: app.globalData.is_binding
        })
    },
    /**
         * 生命周期函数--监听页面显示
         */
    onShow: function () {
        this.getMyInfo();
    },
    changeNav,
    getMyInfo() {
        REQUEST('get', 'getMyInfo', {
            unionid: app.globalData.unionid
        }).then(res => {
            wx.stopPullDownRefresh();
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
    //分享二维码
    getShareHandle(){
        wx.showLoading({
            title: '二维码加载中...',
            mask:true
        })
        REQUEST('get','getShare',{
            unionid:app.globalData.unionid
        }).then(res=>{
            wx.hideLoading();
            this.setData({
                ewmStatus2:true,
                friendUrl:res.url
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
    goApplyHandle(){
        const {is_binding}=this.data;
        if(is_binding){
            wx.navigateTo({
                url: '/pages/apply/apply',
            })
        }else{
            wx.showModal({
                title: '提示',
                content: '抱歉,您未绑定不能申请,请先绑定',
                confirmText: '去绑定',
                success: res => {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '/pages/user/info/info',
                        })
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        }
    },
    //展示图片
    previewImgHandle(e){
        console.log(e)
        const { img } = e.currentTarget.dataset;
        wx.previewImage({
            urls: [img],
        })
    },
    //展示二维码
    showEwmFn(e) {
        const {
            state
        } = e.currentTarget.dataset;
        if(state == 2){
            this.setData({
                ewmStatus2: false
            })
        }else{
            this.setData({
                ewmStatus: state == 1 ? true : false
            })
        }
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

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
        this.getMyInfo();
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
        let url = encodeURIComponent(`/pages/user/index/index?friend_unionid=${app.globalData.unionid}`);
        console.log(url);
        return {
            title: '我要分享一个好东西',
            path: `/pages/entry/entry?share_query=${url}`
        }
    }
})