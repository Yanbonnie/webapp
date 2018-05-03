// pages/card/card.js
import { comData, methodsArr } from '../../utils/pageCom';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        animationData: {},
        animation:null,
        showState:true,
        ...comData
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    ...methodsArr,
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.showAnimation();
        this.setTitle('小妮子的个人卡片')
    },
    //展开动画
    showAnimation(){
        let animation = wx.createAnimation({
            duration: 2000,
            timingFunction: 'ease',
        })
        animation.translateX('-160px').step();
        this.setData({
            animationData: animation.export(),
            showState:false
        })
        
    },
    //合上动画
    hideAnimation(){
        let animation = wx.createAnimation({
            duration: 2000,
            timingFunction: 'ease',
        })
        animation.translateX('0').step();
        this.setData({
            animationData: animation.export(),
            showState:true
        })
    },
    //展示动画
    showHandle(){
        if (this.data.showState){
            this.showAnimation();
        }else{
            this.hideAnimation();
        }
    },
    //到达首页
    goHome(){
        wx.switchTab({
            url:'/pages/index/index'
        })
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})