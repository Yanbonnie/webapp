// pages/list/list.js
const util = require('../../utils/util.js');
const app = getApp();
const req = require('../../helper/req.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        loading: false,
        ending: false,
        pagenum: 1,
        pagesize:5
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
    //监听页面显示
    onShow: function() {
        app.globalData.editId = null;
        this.getList();
    },
    //获取笔记列表
    getList() {
        wx.showLoading({
            title: '加载中...',
        })
        const { pagesize, pagenum, list } = this.data;
        req.getNoteList({
            user_id: app.globalData.user_id,
            pagenum,
            pagesize
        }).then(json => {
            wx.hideLoading();
            if (json.meta.success) {
                let data = json.data.list.map((item) => {
                    return {
                        ...item,
                        postime: util.formatTime(new Date(item.postime * 1000))
                    }
                })
                if(json.data.list.length < pagesize){
                    this.setData({
                        ending:true
                    })
                }
                this.setData({
                    list: [...list,...data]
                })
            }
        })
    },
    detailFn(e) {
        wx.navigateTo({
            url: `/pages/detail/detail?id=${e.target.dataset.id}`,
        })
    },
    //编辑笔记
    editNote(e) {
        console.log(e)
        app.globalData.editId = e.target.dataset.id;
        wx.switchTab({
            url: '/pages/add/add',
        })
    },
    //删除笔记
    delNote(e) {
        wx.showModal({
            title: '警告',
            content: '确认删除此条笔记？',
            success: res => {
                if (res.confirm) { //点击了确定
                    console.log('删除')
                    util.WXREQ('handle/del', 'POST', {
                        id: e.target.dataset.id
                    }, (json) => {
                        if (json.meta.success) {
                            this.getList();
                        }
                    })
                }
            },
        })
    },
    addNoteNav() {
        wx.switchTab({
            url: '/pages/add/add',
        })
    },
    //滚动到底部
    scrolltolowerHandle(e) {
        if (!this.data.ending) {
            this.setData({
                pagenum: this.data.pagenum + 1
            })
            this.getList();
        }
    }
})