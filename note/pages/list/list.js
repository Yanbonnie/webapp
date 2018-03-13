// pages/list/list.js
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
  },
  //获取笔记列表
  getList(){
    util.WXREQ('note/list','GET',{},(json)=>{
      if(json.meta.success){
        let data = json.data.list.map((item)=>{
          return {
            ...item,
            postime: util.formatTime(new Date(item.postime*1000))
          }
        })
        this.setData({ list: data })
      }
    })
  },
  //添加笔记  
  toAddNote(){
    wx.navigateTo({
      url: '/pages/add/add',
    })
  },
  //编辑笔记
  editNote(e){
    wx.navigateTo({
      url: `/pages/add/add?id=${e.target.dataset.id}`,
    })
  },
  //删除笔记
  delNote(e){
    wx.showModal({
      title:'警告',
      content:'确认删除此条笔记？',
      success:res=>{        
        if(res.confirm){ //点击了确定
        console.log('删除')
          util.WXREQ('handle/del','POST',{id:e.target.dataset.id},(json)=>{
            console.log(json)
            if(json.meta.success){
              this.getList();
            }
          })
        }
      },
    })
  }
})