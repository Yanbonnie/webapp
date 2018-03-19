// pages/storage/storage.js
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
  //设置本地缓存（异步）
  setStorage(){
    wx.setStorage({
      key: "catch",
      data: "123"
    })
  },
  //获取本地缓存（异步）
  getStorage(){
    wx.getStorage({
      key: 'catch',
      success: function(res) {
        console.log(res)
      },
    })
  },
  //异步获取当前storage的相关信息
  getStorageInfo(){
    wx.getStorageInfo({
      success:res=>{
        console.log(res)
      }
    })
  },
  //从本地缓存中异步移除指定 key 。
  removeStorage(){
    wx.removeStorage({
      key:'catch',
      success:res=>{
        console.log(res)
      }
    })
  },
  //获取当前的地理位置、速度。
  getLocation(){
    wx.getLocation({
      success:res=>{
        console.log(res)
        this.openLocation(res.latitude, res.longitude)
      }
    })
  },
  //打开地图选择位置。
  chooseLocation(){
    wx.chooseLocation({
      success:res=>{
        console.log(res)
      },
    })
  },
  //使用微信内置地图查看位置。
  openLocation(latitude,longitude){
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,      
    })
  },
  go(){
    wx.navigateTo({
      url: '/pages/test/test',
    })
  }
})