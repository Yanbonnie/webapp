//index.js
//获取应用实例
const { Actionsheet, extend } = require('../../assets/component/index.js');
const app = getApp();
let { key } = app.globalData;
import { URL, WXREQ } from '../../utils/util';
import { comData, methodsArr} from '../../utils/pageCom';

// import { banner, config, data } from '../../utils/data'

Page(extend({}, Actionsheet, {
    data: {
        /*motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo')*/
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
        /*公共数据 */
        ...comData
    },
    ...methodsArr,
    //获取首页基本配置
    getConfig(){
        // wx.showLoading({
        //     title: '加载中...',
        // })
        const { unionid } = this.data.userInfo;
        WXREQ('GET', URL['getConfig'],{
            key,
            unionid
        },res=>{
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
    //到达详情页
    goDetail(e){
        const { id } = e.currentTarget.dataset;
        wx.navigateTo({
            url: `/pages/detail/detail?id=${id}`,
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
        // if (userInfo){
        //     this.getConfig();
        // }
          
        // this.getUserInfo();    
        /*if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }*/
    },
    getUserInfo: function (e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    }
}))
