// pages/manage/manage/manage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cashState:false,   //提现弹框状态
    infoState:false,   //提现资料弹框状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  //提现
  withdrawCash(){
      this.setData({
          cashState:true
      })
  },
  //关闭弹框
  closeCover(e){
    const {index} = e.currentTarget.dataset;

    if(index == 1){
        this.setData({
            cashState:false
        })
    }else{
        this.setData({
            infoState: false
        })
    }
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