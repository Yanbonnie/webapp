// pages/add/add.js
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null,
    noteObj:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ id: options.id ? options.id : null });
    if(this.data.id){  //
      this.noteDetail();
    }
  },
  //获取笔记详情
  noteDetail(){
    util.WXREQ('note/detail','GET',{
      id:this.data.id
    },(json)=>{
      console.log(json)
      console.log(json.data[0])
      if(json.meta.success){
        this.setData({noteObj:json.data[0]})
      }
      console.log(this.data.noteObj)
    })
  },
  submitNote(e){
    if(this.data.id){  //编辑笔记
      this.editNote(e);
    }else{
      this.addNote(e);
    }
  },
  //编辑笔记
  editNote(e){
    util.WXREQ('handle/edit','POST',{
      title: util.TRIM(e.detail.value.title),
      context: util.TRIM(e.detail.value.context),
      id:this.data.id,
      postime: parseInt(new Date().getTime() / 1000),
    },(json)=>{
      if (json.meta.success) {
        wx.navigateTo({
          url: "/pages/list/list"
        })
      } else {
        wx.showToast({
          title: json.meta.msg,
          duration: 2000,
          icon: 'none'
        })
      }
    })
  },
  //添加笔记
  addNote(e){   
    util.WXREQ('handle/add','POST',{
      title: util.TRIM(e.detail.value.title),
      context: util.TRIM(e.detail.value.context),
      postime:parseInt(new Date().getTime()/1000)
    },(json)=>{
      if(json.meta.success){
        wx.navigateTo({
          url:"/pages/list/list"
        })
      }else{
        wx.showToast({
          title:json.meta.msg,
          duration: 2000,
          icon:'none'
        })
      }
    })
  }
})