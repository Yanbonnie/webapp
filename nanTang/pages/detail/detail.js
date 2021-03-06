// pages/detail/detail.js
const app = getApp();
let { key } = app.globalData;
import { URL, WXREQ } from '../../utils/util';
import { comData, methodsArr } from '../../utils/pageCom';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navStatus: false,
        shopData: {},
        menu_pic: [],
        id: null,
        ewmState: false,
        ewmUrl: '',
        lookGiftState:false,
        giftList:[],   //礼物列表
        giftPage:1,    //礼物翻页数据
        giftEnd:false, //礼物是否到底
        gift_type: 0,   //0时是关闭,  1是自己可见，2大家都可以见
        is_myself:0,    //1是自己，0不是自己
        /*公共数据 */
        ...comData
    },
    ...methodsArr,
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {      
        const { id, index } = options;
        this.setData({
            id
        })
        if (options.index) {
            this.setData({
                navStatus: true
            })
        }
        this.getShopDetails(id);
    },
    getShopDetails(id) {
        wx.showLoading({
            title: '加载中...',
            mask: 'true'
        })
        WXREQ('GET', URL['getShopDetails'], {
            key,
            unionid: app.globalData.userInfo.unionid,
            id
        }, res => {
            wx.stopPullDownRefresh();
            wx.hideLoading();
            const { data, menu_pic, status, msg, gift_type, is_myself,is_pay_praise } = res;
            if (status == 0) {
                this.setData({
                    shopData: data,
                    menu_pic,
                    gift_type,
                    is_myself
                })
                app.globalData.is_pay_praise = is_pay_praise;
            } else {
                wx.showToast({
                    title: msg,
                })
            }
        })
    },
    //ta的礼物
    getMyGift(e){
        this.setData({
            lookGiftState: true
        })
        if (this.data.giftEnd) return;
        wx.showLoading({
            title:'加载中...',
            mask:true
        })
        const { id } = e.currentTarget.dataset;
        const { giftPage, giftList } = this.data;
        WXREQ('GET', URL['getMyGift'],{
            key,
            unionid: app.globalData.userInfo.unionid,
            id,
            page: giftPage
        },res=>{
            wx.hideLoading();
            if(res.status == 0){
                if(res.is_data == 1){  //有数据
                    let nextPate = giftPage + 1;
                    let temGiftList = giftList;
                    for (let i = 0; i < res.date.length ; i++){
                        temGiftList.push(res.date[i])
                    }
                    this.setData({
                        giftList: temGiftList,                        
                        giftPage:nextPate
                    })
                    if (res.date.length < 10 && this.data.giftList.length > 10){
                        this.setData({
                            giftEnd:true  //数据到底了
                        })
                    }
                }
            }else{
                wx.showToast({
                    title: res.msg,
                    icon:'none',
                    mask:true
                })
            }
        })
    },
    //关闭它的礼物弹框
    closeGiftHandle(){
        this.setData({
            lookGiftState:false
        })
    },
    /**
     * 预览图片函数
     */
    previewHandle(e) {
        const { id } = e.currentTarget.dataset;
        const { menu_pic } = this.data;
        let urls = [];
        menu_pic.forEach(item => urls.push(item.pic))
        wx.previewImage({
            current: menu_pic[id].pic, // 当前显示图片的http链接
            urls: urls, // 需要预览的图片http链接列表
            success: (res) => {

            }
        })
    },
    preImg() {
        let urls = [];
        urls.push(this.data.ewmUrl)
        wx.previewImage({
            urls,
            success: res => { }
        })
    },
    /**name
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        const { id, logo, name } = this.data.shopData;
        return {
            'title': '南塘生活圈·' + name,
            'path': '/pages/enter/enter?id=' + id,
            'imageUrl': logo,
            success: res => {
                // 转发成功
                WXREQ('POST', URL['postLogShare'], {
                    key,
                    unionid: app.globalData.userInfo.unionid,
                    page: '/pages/detail/detail'
                }, res => {

                })
            }
        }
    },
    showEwm(e) {
        const { id } = e.currentTarget.dataset;
        wx.showLoading({
            title: '加载中...',
            mask: true
        })
        WXREQ('GET', URL['getShare'], {
            key,
            unionid: app.globalData.userInfo.unionid,
            id
        }, res => {
            wx.hideLoading()
            if (res.status == 0) {
                this.setData({
                    ewmUrl: res.url,
                    ewmState: true
                })
            } else {
                wx.showToast({
                    title: res.msg,
                    mask: true,
                    icon: 'none'
                })
            }
        })
    },
    hideEwm() {
        this.setData({
            ewmState: false
        })
    },
    onPullDownRefresh(e) {
        this.getShopDetails(this.data.id);
    },
    go(e) {
        const { index } = e.currentTarget.dataset;
        switch (index) {
            case '1':
                wx.switchTab({
                    url: '/pages/index/index',
                })
                break;
            case '2':
                wx.switchTab({
                    url: '/pages/business/business',
                })
                break;
            case '3':
                wx.switchTab({
                    url: '/pages/search/search',
                })
                break;
            default:
                break;
        }
    }

})