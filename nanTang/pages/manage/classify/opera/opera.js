// pages/manage/operaClassify/operaClassify.js
import { comData, methodsArr } from '../../../../utils/pageCom';
Page({

  /**
   * 页面的初始数据
   */
  data: {
      descript:'',
      num:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  ...methodsArr,
  onLoad: function (options) {
    wx.setNavigationBarTitle({
        title: '增加分类',
    })
  },  
  //监听描述输入框
  textareaInput(e){
      const { value } = e.detail;
      this.setData({
          descript:value,
          num:value.length
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