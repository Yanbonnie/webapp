// pages/search/search.js
const app = getApp();
let { key } = app.globalData;
import { URL, WXREQ } from '../../utils/util';
import { comData, methodsArr } from '../../utils/pageCom';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        keyword:'',
        shopList:[],
        /*公共数据 */
        ...comData
    },
    ...methodsArr,
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },    
    postSearch(){
        wx.showLoading({
            title: '加载中...',
            mask:true
        })
        WXREQ('POST', URL['postSearch'],{
            key,
            unionid:app.globalData.userInfo.unionid,
            keyword: this.data.keyword
        },res=>{
            wx.stopPullDownRefresh()
            wx.hideLoading();
            const {data,msg,status} = res;
            if(status == 0){
                this.setData({
                    shopList:data,
                })
            }else{
                wx.showToast({
                    title: msg,
                    icon:'none',
                    mask:true
                })
            }
        })
    },
    inputEnter(e){
        const { value } = e.detail;
        this.setData({
            keyword:value
        })
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh(e) {
        this.postSearch();
    }
})