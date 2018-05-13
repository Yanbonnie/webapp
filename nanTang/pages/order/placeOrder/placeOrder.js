// pages/order/placeOrder/placeOrder.js
import { REQUEST, uploadFile, ShowToast } from '../../../utils/request.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentIndex:0,
        id:'',           //商家id
        baseinfo:'',     //商店基础信息数组
        classify:[],     //商店分类数据数组
        goods:[],        //商品列表数组
        goodslist:[],    //用户选择的商品列表 
        total:0,         //合计  
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const { id } = options;
        this.setData({
            id
        })
    },    
    //商家店铺详情接口
    getOnlineShop(){
        const { id } = this.data;
        wx.showLoading({
            title: '加载中...',
            mask:true
        })
        REQUEST('GET','getOnlineShop',{
            shop_id:id
        }).then(res=>{
            this.setData({
                baseinfo:res.baseInfo[0],
                classify:res.class,
                goods:res.goods
            })
        })
    },
    //获取商品列表(有待修改)
    getGoods(e){ 
        const { id } = e.currentTarget.dataset;
        wx.showLoading({
            title: '加载中...',
            mask:true
        })
        REQUEST('GET','getGoods',{id}).then(res=>{
            this.setData({
                goods:res.data
            })
        })
    },
    // +（-）号点击
    addGoodsNum(e){
        const { index,oper } = e.currentTarget.dataset;
        const NewGoods = this.data.goods.map((item,INDEX)=>{
            let Num = item.num
            if (index == INDEX){ 
                if(oper == 'add'){  //+
                    if (item.is_infinite) {
                        Num = item.num + 1;
                    } else {
                        if (item.stock > item.num) {   //库存大于所选数量
                            Num = item.num + 1;
                        }
                    }
                }else{  //-
                    Num = item.num - 1 ;
                }
                item.num = Num;
            }
            return item;
        })
        this.setData({
            goods:NewGoods
        })
        //处理已选商品
        let NewSelect = NewGoods.filter((item,index)=>{
            return item.num > 0 ;
        })
        this.setData({
            goodslist: NewSelect
        })
        if(NewSelect.length == 0){
            this.setData({
                total:0
            })
            return;
        }
        //计算总价
        let Total = 0; 
        for (let i = 0; i < NewSelect.length ; i++){
            Total = Total + NewSelect[i].num * NewSelect[i].price;
        }
        this.setData({
            total:Total
        })

    },
    //去结算
    payHandle(e){
        const { shop_id } = e.currentTarget.dataset;
        const { total } = this.data;
        const { shop_name, logo } = this.data.baseinfo;
        wx.setStorageSync('payGoods', this.data.goodslist);
        wx.setStorageSync('shopLogo', logo);
        wx.navigateTo({
            url: `/pages/order/submitOrder/submitOrder?shop_id=${shop_id}&shop_name=${shop_name}&total=${total}`,
        })
    },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

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