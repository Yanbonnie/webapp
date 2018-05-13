// pages/manage/goods/index/index.js
import { REQUEST, uploadFile, ShowToast } from '../../../../utils/request.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {        
        currentIndex:0,
        classifyList:[],
        goodsList:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getClassificationInfo(0)
    },
    //获取商家分类
    getClassificationInfo(index=1) {
        wx.showLoading({
            title: '加载中...',
            mask: true
        })
        REQUEST('GET', 'getClassificationInfo', {}).then(res => {
            this.setData({
                classifyList: res.data
            })
            if(index == 0){  //第一次进来获取第一个分类的goods
                if(res.data.length == 0) return;
                this.getGoods({class_id:res.data[0].id,index:0})
            }
        },0)
    },
    //获取当前商家分类中的商品
    getGoods(e){
        const { class_id, index } = e.currentTarget.dataset || e;
        this.setData({
            currentIndex:index
        })
        REQUEST('GET','getGoods',{
            class_id
        }).then(res=>{
            this.setData({
                goodsList:res.data
            })
        })
    },
    //编辑商品
    editGood(e){
        const { id } = e.currentTarget.dataset;
        wx.navigateTo({
            url: '/pages/manage/goods/opera/opera?id='+id,
        })
    },
    //商品下架
    getDealGoods(e){
        const { status,id } = e.currentTarget.dataset;
        let STATUS = null;
        if(status == 0){  //上架
            STATUS = 1;
        }else if(status == 1){  //下架
            STATUS = 2;
        }else{
            //已下架，不做任何处理
            return;
        }
        wx.showLoading({
            title: '处理中...',
            mask:true
        })
        REQUEST('GET','getDealGoods',{
            status:STATUS
        },0).then(res=>{
            this.getGoods({ class_id: id })
        })

    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})