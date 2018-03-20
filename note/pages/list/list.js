// pages/list/list.js
const util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    loading:false,
    ending:false,
    pagenum:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  //监听页面显示
  onShow:function(){
    app.globalData.editId = null;
    this.getList();
  },
  //获取笔记列表
  getList(){
    this.setData({
      loading:true
    })
    util.WXREQ('note/list','POST',{
      user_id:app.globalData.user_id,
      pagenum: this.data.pagenum,
      pagesize:100
    },(json)=>{
      this.setData({
        loading: false
      })
      if(json.meta.success){
        let data = json.data.list.map((item)=>{
          return {
            ...item,
            postime: util.formatTime(new Date(item.postime*1000))
          }
        })
        /*if(data.length == 0){
          this.setData({
            ending:true
          })
        }*/
        /*data.map(item=>{
          this.data.list.push(item)
        })
        var newData = this.data.list.concat(data);*/
        // console.log(util.unique3(newData, 'ID'))
        //this.setData({ list: util.unique3(newData,'ID') })
        this.setData({ list: data})
      }
    })
  },
  detailFn(e){
    wx.navigateTo({
      url: `/pages/detail/detail?id=${e.target.dataset.id}`,
    })
  },
  //编辑笔记
  editNote(e){
    console.log(e)
    app.globalData.editId = e.target.dataset.id;
    wx.switchTab({
      url: '/pages/add/add',
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
            if(json.meta.success){
              this.getList();
            }
          })
        }
      },
    })
  },
  addNoteNav(){
    wx.switchTab({
      url: '/pages/add/add',
    })
  },
  //滚动到底部
  scrolltolowerHandle(e){
    if(!this.data.ending){
      this.setData({
        pagenum: this.data.pagenum + 1,
        loading: true
      })
      setTimeout(() => {
        this.getList();
      }, 1000)
    }
  }
})