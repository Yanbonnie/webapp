// pages/manage/member/scan/scan.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        shop_id:'',      //商家id
        shopInfo:'',     //商家信息
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const { shop_id } = options;
        this.setData({
            shop_id
        })
    },

    //获取商家信息接口
    getDealUserShop(){
        const { shop_id } = this.data;
        wx.showLoading({
            title: '加载中...',
            mask:true
        })
        REQUEST('GET','getDealUserShop',{
            shop_id
        }).then(res=>{
            this.setData({
                shopInfo:res.data[0]
            })
        })
    },

    //员工同意拒绝接口
    updateDealUser(e){
        const { status } = e.currentTarget.dataset;
        wx.showLoading({
            title: '处理中...',
            mask:true
        })
        REQUEST('GET','updateDealUser',{
            status
        }).then(res=>{
            //拒绝或成功之后的处理
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