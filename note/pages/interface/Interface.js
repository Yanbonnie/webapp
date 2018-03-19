// pages/interface/Interface.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  chooseInvoiceTitle(){
    wx.chooseInvoiceTitle({
      success:res=>{
        console.log(res)
      }
    })
  },
  chooseAddress(){
    wx.chooseAddress({
      success:res=>{
        console.log(res)
      }
    })
  },
  startPullDownRefresh() {
    console.log(123)
    wx.startPullDownRefresh({
      success: res => {
        console.log(res)
      }
    })
  },
  //下拉刷新
  onPullDownRefresh(){
    console.log('开启了下拉刷新');
    // wx.stopPullDownRefresh()
  },
  setNavigationBarColor(){
    wx.setNavigationBarColor({
      frontColor:"#000000"
    })
  },
  setNavigationBarTitle(){
    wx.setNavigationBarTitle({
      title: '当前页',
    })
  },
  showActionSheet(){
    wx.showActionSheet({
      itemList:['A','B','C']
    })
  },
  showModal(){
    wx.showModal({
      title: '确认删除？',
      content: '',
    })
  },
  showLoading(){
    wx.showLoading({
      title: '加载中',
      mask: true,

    })
  },
  showToast(){
    wx.showToast({
      title: '我是提示框',
      icon:'loading'
    })
  },
})