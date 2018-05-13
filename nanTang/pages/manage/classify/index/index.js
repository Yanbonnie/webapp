// pages/manage/classify/classify.js
import { REQUEST, uploadFile, ShowToast } from '../../../../utils/request.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        classifyList: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    //获取商家分类
    getClassificationInfo() {
        wx.showLoading({
            title: '加载中...',
            mask: true
        })
        REQUEST('GET', 'getClassificationInfo', {}).then(res => {
            this.setData({
                classifyList:res.data
            })
        })
    },
    //编辑
    eidtClassify(e){
        const { id,name } = e.currentTarget.dataset;        
        wx.navigateTo({
            url: `pages/manage/classify/opera/opera?id=${id}`,
        })
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})