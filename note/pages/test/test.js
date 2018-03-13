// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFilePaths:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  uploadFileHandle(){
    let This = this;
    wx.chooseImage({
      success: function (res) {
        This.setData({
          'tempFilePaths': res.tempFilePaths
        })
        
      }
    })
  },
  previewImg(){
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: this.data.tempFilePaths,    // 需要预览的图片http链接列表
      success:function(res){
        console.log(res)
      },
      fail:function(res){
        console.log(res)
      }
    })

    wx.saveImageToPhotosAlbum({
      filePath:this.data.tempFilePaths[0],
      success(res){
        wx.showToast({
          title: '成功保存',
          duration: 2000,
          icon: 'none'
        })
      },
      fail(){
        wx.showToast({
          title: '保存失败',
          duration: 2000,
          icon: 'none'
        })
      }
    })
  }
})