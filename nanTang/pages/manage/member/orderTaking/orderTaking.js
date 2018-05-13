// pages/manage/member/orderTaking/orderTaking.js
import { REQUEST, uploadFile, ShowToast } from '../../../../utils/request.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        oper:1,     //1-员工接单页面，  2-订单详情页面
        code:'',    //订单编号
        wxname:'',          //下单用户微信名
        wxheadpic:'',       //下单用户微信头像
        'type':'',          //就餐方式，1为在线点餐，2是送货
        table_num:'',       //餐桌
        name:'',            //收货人姓名
        mobile:'',          //收货人手机
        address:'',         //收货人地址
        goodslist: [],      //⽤户所选择的商品的信息数组  name num price 
        status: '',          //订单状态；0为待处理，1是已接单，2是已拒绝，3是⽤户取消，4已送出，5已完成
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const { code,oper } = options;
        this.setData({code,oper})
    },
    //获取订单详情
    getOrderDetails(){
        const {code} = this.data;
        wx.showLoading({
            title: '加载中...',
            mask:true
        })
        REQUEST('GET','getOrderDetails',{
            code
        }).then(res=>{
            const { wxname, wxheadpic, type, table_num, name, mobile, address, goodslist, status} = res;
            this.setData({
                wxname, wxheadpic, type, table_num, name, mobile, address, goodslist, status
            })
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