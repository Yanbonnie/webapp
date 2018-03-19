// pages/test/test.js

const recorderManager = wx.getRecorderManager();   //获取全局唯一的录音管理器 recorderManager。
const innerAudioContext = wx.createInnerAudioContext(); //创建并返回内部 audio 上下文 innerAudioContext 对象。
const videoContext = wx.createVideoContext('myVideo')
const Options = {
  duration: 10000,
  sampleRate: 44100,
  numberOfChannels: 1,
  encodeBitRate: 192000,
  format: 'mp3',
  frameSize: 50
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFilePaths:[],
    saveFileSrc:null,
    getSavedFileList: [],   //获取本地已保存的文件列表
    recordState:true,
    recordTempFilePath:null,
    videoSrc:null,
    src:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  takePhoto() {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        console.log(res)
        const { tempImagePath,height} = res;
        console.log(tempImagePath);
        console.log(height)
        this.setData({
          src: tempImagePath
        })
      }
    })
  },
  error(e) {
    console.log(e.detail)
  },
  //选择文件
  uploadFileHandle(){
    let This = this;
    wx.chooseImage({
      success:res=>{
        this.setData({
          'tempFilePaths': res.tempFilePaths
        })
        wx.saveFile({
          tempFilePath: res.tempFilePaths[0],
          success:res=>{
            // console.log(res)
            this.setData({
              "saveFileSrc": res.savedFilePath
            })

            wx.getFileInfo({
              filePath:res.savedFilePath,
              success:res=>{
                console.log(res)
              }
            })
          }
        })
      }
    })
  },
  //预览文件(tip:saveFile 会把临时文件移动，因此调用成功后传入的 tempFilePath 将不可用)
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
    //保存到本地相册
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
  },
  //获取本地已保存的文件列表
  getSavedFileList(){
    wx.getSavedFileList({
      success:res=>{
        this.setData({
          "getSavedFileList": res.fileList
        })
      }
    })
  },
  //删除本地存储的文件
  removeSavedFile(){
    wx.removeSavedFile({
      filePath: this.data.getSavedFileList[0].filePath,
      success:res=>{
        this.getSavedFileList();
      }
    })
  },
  //开始录音
  startRecord(){
    recorderManager.start(Options);
    this.setData({
      "recordState":false
    })

    
  },
  //停止录音
  stopRecord(){
    recorderManager.stop();
    recorderManager.onStop(res=>{
      const { tempFilePath } = res;  
      innerAudioContext.src = tempFilePath ; 
      innerAudioContext.play();
    })
  },
  //选择视频
  startVideo(){
    wx.chooseVideo({
      success:res=>{
        console.log(res)
        const { tempFilePath } = res;
        this.setData({
          "videoSrc":tempFilePath
        })
      }
    })
  }
})