// pages/manage/goods/opera/opera.js
import { REQUEST, uploadFile, ShowToast } from '../../../../utils/request.js';
const Promise = require('../../../../utils/request.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        classifyList:[],        //分类列表
        id:'',                  //商品id
        name:'',                //商品名称
        class_id:'',            //分类id
        class_name:'',          //分类名
        descript:'',            //商品描述
        pic:'',                 //商品图片原图
        thumbnail:'',           //商品缩略图
        is_infinite:1,          //是否无限库存 1为是 0为否
        is_discount:1,          //是否折扣，1为是，0为否
        rebate:'',              //折扣值
        pirce:'',               //商品价格
        stock:'',               //库存数量
        status:'',              //商品状态  0-待处理 1-已上架 2-已下架 -1-已删除
        sales:'',               //总销量
        goodInfo:null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const { id } = options;
        this.init(id);
    },
    init(id){
        if (id) {  //编辑
            this.setData({
                id
            })
        } else {  //新增
            wx.showLoading({
                title: '加载中...',
                mask: true
            })
            REQUEST('GET', 'getClassificationInfo', {}).then(res => {
                this.setData({
                    classifyList: res.data
                })
            })
        }
    },
    //获取当前商品详情接口
    getGoodsInfo(){
        const { id } = this.data;
        wx.showLoading({
            title: '加载中...',
            mask:true,
        })
        //获取详细信息和分类列表
        Promise.all(
            REQUEST('GET', 'getGoodsInfo', {
                goods_id: id
            },0), 
            REQUEST('GET','getClassificationInfo',{},0)
        ).then(result=>{
            wx.hideLoading();
            const { name, class_id, class_name, pic, descript, thumbnail, is_infinite, is_discount, rebate, pirce, stock, status, sales } = result[0].data[0];
            const { classifyList } = result[1].data;
            this.setData({
                name, class_id, class_name, pic, descript, thumbnail, is_infinite, is_discount, rebate, pirce, stock, status, sales, classifyList
            })
        })
    },
    //分类选择
    bindPickerChange(e){
        const index = e.detail.value;
        this.setData({
            class_id: this.data.classifyList[index].id,
            class_name:this.data.classifyList[index].name
        })
    },
    //保存商品信息
    saveGoodsInfo() { //postGoodsInfo
        const { id, name, class_id, class_name, pic, descript, is_infinite, is_discount, rebate, pirce, stock } = this.data;
        if(!name || !pic || !price){
            ShowToast("请填写完整信息");
            return;
        }
        wx.showLoading({
            title: '提交中...',
            mask:true
        })
        if(id){  //编辑商品
            REQUEST('POST','pEditGoodsInfo',{
                id,name, class_id, class_name, pic, descript, is_infinite, is_discount, rebate, pirce, stock
            }).then(res=>{
                ShowToast("修改成功");
                setTimeout(res => {
                    wx.navigateBack({
                        delta: 1
                    })
                }, 1500)
            })
        }else{   //新增商品
            REQUEST('POST','postGoodsInfo',{
                name, class_id, class_name, pic, descript, is_infinite, is_discount, rebate, pirce, stock
            }).then(res=>{
                ShowToast("新增成功");
                setTimeout(res=>{
                    wx.navigateBack({
                        delta: 1
                    })
                },1500)
            })
        }
    },

    //删除商品
    getDelGoods(){
        const { id } = this.data;
        wx.showLoading({
            title: '删除中...',
            mask:true
        })
        REQUEST('GET','getDelGoods',{id}).then(res=>{
            ShowToast("删除成功");
            setTimeout(()=>{
                wx.navigateBack({
                    delta:1
                })
            },1500)
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