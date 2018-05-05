// pages/order/submitOrder/submitOrder.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderType:'在店就餐',
        address:'选择收货地址'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    selectType() {
        let arr = ['在店就餐', '打包送出']
        wx.showActionSheet({
            itemList: arr,
            success: res=> {
                // console.log(res.tapIndex)
                this.setData({
                    orderType: arr[res.tapIndex]
                })
            },
            fail: res=>{
                console.log(res.errMsg)
            }
        })

    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },
})