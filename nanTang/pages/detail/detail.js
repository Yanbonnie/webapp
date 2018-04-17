// pages/detail/detail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: ['../../assets/images/home_page_on.png', '/assets/images/picture.jpeg', '/assets/images/picture.jpeg']
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    /**
     * 预览图片函数
     */
    previewHandle(e) {
        const { ids } = e.currentTarget.dataset;
        const { imgUrl } = this.data;
        console.log(imgUrl[ids])
        wx.previewImage({
            current: imgUrl[ids], // 当前显示图片的http链接
            urls: imgUrl, // 需要预览的图片http链接列表
            success: (res) => {
                console.log(res)
            }
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})