// pages/system/system.js
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
  //添加联系人
  addPhoneContact(){
    wx.addPhoneContact({
      firstName: 'nini',
    })
  },
  //扫码
  scanCode(){
    wx.scanCode({
      success:res=>{
        console.log(res)
      }
    })
  },
  //拨打电话
  makePhoneCall(){
    wx.makePhoneCall({
      phoneNumber: '13928987479',
    })
  },
  //设置屏幕亮度
  setScreenBrightness(){
    wx.setScreenBrightness({
      value: 1,
      success:res=>{
        console.log(res)
      }
    })
  },
  //获取网络类型。
  getNetworkType(){
    wx.getNetworkType({
      success: res=>{
        console.log(res)
      },
    })
  },
  //获取系统信息。
  getSystemInfo(){
    wx.getSystemInfo({
      success:res=>{
        console.log(res)
      }
    })
  }
})