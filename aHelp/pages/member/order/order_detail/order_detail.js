// pages/member/order/sure_order/sure_order.js
// pages/member/order.js
const app = getApp();
const {
    globalData: {
        REQUEST
    },
    userInfo
} = app;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id:null,
        orderDetail:null,
        userInfo:null,
        categoryList:[],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 在没有 open-type=getUserInfo 版本的兼容处理
        wx.getUserInfo({
            success: res => {
                this.setData({
                    userInfo: res.userInfo,
                })
            }
        })

        const { id } = options;
        this.setData({id});
        this.getorderdetailData(id);
        
    },
    getorderdetailData(id){
        wx.showLoading({
            title: '加载中...',
            mask:true
        })
        REQUEST({
            url: 'getorderdetail',
            data: {
                orderId:'SO1000'+id
            }
        }).then(res => {
            wx.hideLoading();
            let categoryIds = res.data[0].serviceCategory.map(item=>item.item);
            let reqArr = [];
            categoryIds.forEach(item=>{
                reqArr.push(REQUEST({ url: 'getservicename', data: { id: item}}))
            })
            this.setData({ orderDetail:res.data[0]})
            this.getservicename(reqArr);
        })
    },
    getservicename(reqArr){
        Promise.all(reqArr).then(res => {
            let list = res.map(item=>{
                return {
                    name: item.data[0].name,
                    price: item.data[0].price,
                    id:item.data[0].id
                }
            })
            this.setData({
                categoryList:list
            })
        })
    }

})