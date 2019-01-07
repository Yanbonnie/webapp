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
        orderId:null,
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
                orderId:id
            }
        }).then(res => {
            wx.hideLoading();
            let categoryIds = res.data[0].serviceCategory.map(item=>item.item);
            let reqArr = [];
            categoryIds.forEach(item=>{
                reqArr.push(REQUEST({ url: 'getservicename', data: { id: item}}))
            })
            let resultData = res.data[0];
            let comment = resultData.orderStatus == 1 ? '订单预约中，代付款' : resultData.orderStatus == 2 ? '订单已付款，待工程师联系' : resultData.orderStatus == 3 ? '维系服务中' : resultData.orderStatus == 4 ?'已完成，很荣幸为您服务' : '订单已取消';
            let orderDetail = {
                ...resultData,
                comment: resultData.comment ? resultData.comment : comment
            }
            this.setData({ orderDetail: orderDetail})
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
    },
    //支付
    payMoney(){
        const { id, orderDetail } = this.data;
        wx.showLoading({
            title: '请求中...',
        })
        REQUEST({
            method:'post',
            url: 'wxpay',
            data: {
                openid:app.globalData.openid,
                total_fee: String(orderDetail.finalPrice*100),
                // total_fee: "1",
                out_trade_no:orderDetail.orderId
            }
        }).then(res => {
            wx.hideLoading();
            const { appId, nonceStr, paySign, signType, timeStamp } = res.data.pay;
            const  package2  = res.data.pay.package;
            wx.requestPayment({
                timeStamp,
                nonceStr,
                'package': package2,
                signType,
                paySign,
                'success': res => {
                    // 支付成功重新刷新页面数据
                    this.getorderdetailData(id)
                },
                'fail': res => {
                }
            })
        })
    },
    cancelOrder(){
        const { id } = this.data;  
        REQUEST({
            method: 'post',
            url: 'cancelorder',
            data: {
                orderStatus:String(5),
                orderId:id
            }
        }).then(res => {
            wx.showToast({
                title: '订单取消成功',
                icon:'success',
                mask:true
            })
            setTimeout(()=>{
                this.getorderdetailData(id)
            },2000)
            // 
        })
    }

})