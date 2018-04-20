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
        shopData:{},
        menu_pic:[],
        imgUrl: ['../../assets/images/home_page_on.png', '/assets/images/picture.jpeg', '/assets/images/picture.jpeg'],
        /*公共数据 */
        ...comData
    },
    ...methodsArr,
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const { id } = options;
        this.getShopDetails(id);
    },
    getShopDetails(id){
        wx.showLoading({
            title: '加载中...',
            mask:'true'
        })
        WXREQ('GET', URL['getShopDetails'],{
            key,
            unionid: app.globalData.userInfo.unionid,
            id
        },res=>{
            wx.hideLoading();
            const { data, menu_pic, status, msg } = res;
            if (status == 0) {
                this.setData({
                    shopData: data,
                    menu_pic
                })
            } else {
                wx.showToast({
                    title: msg,
                })
            }
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        const { id, logo } = this.data.shopData;
        return {
            'title': '食在南塘',
            'path': '/pages/enter/enter?id='+id,
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
    }
})