// pages/member/order/order_list/order_list.js
const app = getApp();
const {
    globalData: {
        REQUEST
    }
} = app;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderList:[],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        const {
            unionid
        } = options;
        this.getorderlistData(unionid)

    },
    getorderlistData(unionid) {
        wx.showLoading({
            title: '加载中...',
            mask: true
        })
        REQUEST({
            url: 'getorderlist',
            data: {
                unionId: unionid
            }
        }).then(res => {
            wx.hideLoading();
            let orderList = res.data.map(item=>{
                return{
                    orderStateText: item.orderStatus == 1 ? '已预约':item.orderStatus == 2 ? '已付款' : item.orderStatus == 3 ? '维修中' : '已完成',
                    ...item,
                }
            })
            this.setData({
                orderList: orderList
            })
            console.log(orderList)
            res.data.forEach((orderItem, index)=>{
                let reqArr = orderItem.serviceCategory.map(categoryItem=>{
                    return REQUEST({ url: 'getservicename', data: { id: categoryItem.item } })
                })
                this.getservicename(reqArr,index)
            })

        })
    },
    getservicename(reqArr,index) {
        Promise.all(reqArr).then(res => {
            let list = res.map(item => {
                return {
                    name: item.data[0].name,
                    price: item.data[0].price,
                    id: item.data[0].id
                }
            })
            this.setData({
                ["orderList[" + index + "].serviceCategory"]: list
            })
        })
    },
    goDetail(e) {
        const { id } = e.currentTarget.dataset;
        wx.navigateTo({
            url:`/pages/member/order/order_detail/order_detail?id=${id}`,
        })
    }

})