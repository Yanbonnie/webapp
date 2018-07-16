// pages/index/index.js
let imgUrls = ['../../assets/images/banner.jpg', '../../assets/images/banner.jpg'];
import qqmap from '../../utils/map.js';
const { chooseImgHandle } = require('../../utils/pageCom');
Page({

    /**
     * 页面的初始数据
     */

    data: {
        imgUrls: imgUrls,
        array: ['1.车辆影响他人出行', '2.车辆占用他人车位', '3.车辆停放影响营业', '4.车辆停放影响施工','5.在禁止停车点停放','6.车辆没关门窗车灯','7.车辆的报警器误鸣','8.天气恶劣提醒车主移车'],
        index:-1,
        address:'',           //地址
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    chooseImgHandle,  //图片识别
    chooseFn(){
        this.chooseImgHandle().then(res=>{
            console.log(res)
        })
    },   
    bindPickerChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            index: e.detail.value
        })
    },
    //调用定位
    getLocate() {
        wx.showLoading({
            title: '定位中...',
            icon:'none',
            mask:true
        })
        new qqmap().getLocateInfo().then(val => {//这个方法在另一个文件里，下面有贴出代码
            console.log(val)
            wx.hideLoading();
            this.setData({
                address:val
            })
        }).catch(res => {
            wx.hideLoading();
            wx.showToast({
                title: '定位失败',
                mask:true,
                icon:'none'
            })
        });
    },
    
})