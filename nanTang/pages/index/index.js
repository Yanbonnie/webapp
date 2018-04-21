//index.js
//获取应用实例
const { Actionsheet, extend } = require('../../assets/component/index.js');
const app = getApp();
let { key } = app.globalData;
import { URL, WXREQ } from '../../utils/util';
import { comData, methodsArr} from '../../utils/pageCom';

Page(extend({}, Actionsheet, {
    data: {
        userInfo:{},
        banner: [],
        config: [],
        businessList: null,
        baseActionsheet: {   //点击拨打电话弹层配置
            show: false,
            // cancelText: '关闭 Action',
            closeOnClickOverlay: true,
            componentId: 'baseActionsheet',
            actions: []
        },
        temId:null,
        /*公共数据 */
        ...comData
    },
    ...methodsArr,
    //获取首页基本配置
    getConfig(){
        wx.showLoading({
            title: '加载中...',
        })
        const { unionid } = this.data.userInfo;
        WXREQ('GET', URL['getConfig'],{
            key,
            unionid
        },res=>{
            wx.stopPullDownRefresh();   //处理下拉刷新
            wx.hideLoading();
            if(res.status == 0){
                const { banner, config, data} = res;
                this.setData({
                    banner,
                    config,
                    businessList:data
                })
                app.globalData.is_pay_apply = config.is_pay_apply;
                app.globalData.is_pay_praise = config.is_pay_praise;
            }else{
                wx.showToast({
                    title: res.msg,
                    icon:'none',
                    mask:true
                })
            }
        })
    },   
    onReady: function () {
        let Timer = setInterval(()=>{
            if (app.globalData.userInfo){
                clearInterval(Timer);
                this.setData({
                    userInfo: app.globalData.userInfo
                })
                this.getConfig();
            }
        },100)
    },
    scrolltolowerHandle(e){
        let length = this.data.businessList.length;
        // if (this.data.temId == this.data.businessList[length - 1].id) return;   //如果最后的id相同，不加载
        wx.showLoading({
            title: '加载中...',
            mask:true
        })    
        WXREQ('GET',URL['getShop'],{
            key,
            unionid:app.globalData.userInfo.unionid,
            id: this.data.businessList[length-1].id,
            limit:10
        },res=>{
            wx.hideLoading();
            if(res.status == 0){
                let arr = res.data;
                let temList = this.data.businessList;
                arr.forEach((item,index)=>{
                    temList.push(item)
                })
                this.setData({
                    businessList:temList
                })
                // this.setData({
                //     temId: this.data.businessList[length - 1].id
                // })
            }else{
                wx.showToast({
                    title: res.msg,
                    mask:true,
                    icon:'none'
                })
            }
        })
    },
    onPullDownRefresh(e){
        this.getConfig();
    }
    
}))
