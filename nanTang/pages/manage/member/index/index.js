// pages/manage/member/index/index.js
import { REQUEST, uploadFile, ShowToast } from '../../../../utils/request.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    memberList:[],          //员工列表
    qr_url:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.getDealUser();
  },
  getDealUser(){
      wx.showLoading({
          title: '加载中...',
          mask:true
      })
      REQUEST('GET','getDealUser',{}).then(res=>{
        this.setData({
            memberList:res.data
        })
      })
  },
  //添加员工-生成员工注册二维码接口
  addMember(){
      REQUEST('GET','getDealUserQr',{}).then(res=>{
        this.setData({
            qr_url: res.qr_url
        })
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