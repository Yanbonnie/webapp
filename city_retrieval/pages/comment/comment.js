// pages/comment/comment.js
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
    ...comData
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setTitle('小妮子')
  },
  ...methodsArr,
  //发表评价
  sendComment(){
      wx.navigateTo({
          url: '/pages/send/send',
      })
      this.setTitle('小妮子')
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
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