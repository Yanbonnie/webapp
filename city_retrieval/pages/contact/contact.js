// pages/contact/contact.js
import { comData, methodsArr } from '../../utils/pageCom';
var info = {
    name: '小妮子',
    num: 53,
    content: '4s-广州每期雪弗兰广州每期雪弗兰广州每期雪弗兰'
}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        info,
        id:null,
        shareState:false,
        ...comData
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // console.log(options)
        this.setTitle('小妮子')
        const { id } = options;
        this.setData({
            id
        })
    },
    ...methodsArr,
    //查看评论
    lookComment() {
        wx.navigateTo({
            url: '/pages/comment/comment',
        })
        this.setTitle('小妮子')
    },
    //推荐他
    recommendHandle(){
        this.setData({
            shareState:true
        })
    },
    //关闭推荐弹框
    closeShare(){
        this.setData({
            shareState:false
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
        return {
            title: '转发哦',
            path: '/pages/index/index',
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    }
})