// pages/detail/detail.js
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null,
    detail:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id
    });
    this.noteDetail();
  },
  //获取笔记详情
  noteDetail() {
    util.WXREQ('note/detail', 'GET', {
      id: this.data.id
    }, (json) => {
      if (json.meta.success) {
        console.log(json)
        this.setData({ detail: json.data[0] })
      }
    })
  },
  submitNote(e) {
    if (this.data.id) {  //编辑笔记
      this.editNote(e);
    } else {
      this.addNote(e);
    }
  },
 
})