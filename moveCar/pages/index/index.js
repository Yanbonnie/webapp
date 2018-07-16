// pages/index/index.js
let imgUrls = ['../../assets/images/banner.jpg', '../../assets/images/banner.jpg'];
Page({

    /**
     * 页面的初始数据
     */

    data: {
        imgUrls: imgUrls,
        array: ['1.车辆影响他人出行', '2.车辆占用他人车位', '3.车辆停放影响营业', '4.车辆停放影响施工','5.在禁止停车点停放','6.车辆没关门窗车灯','7.车辆的报警器误鸣','8.天气恶劣提醒车主移车'],
        index:-1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    bindPickerChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            index: e.detail.value
        })
    },
})