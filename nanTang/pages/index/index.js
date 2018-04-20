//index.js
//获取应用实例
const { Actionsheet, extend } = require('../../assets/component/index.js');
const app = getApp();
let { key } = app.globalData;
import { URL, WXREQ, randomWord } from '../../utils/util';
import { comData, methodsArr} from '../../utils/pageCom';

// import { banner, config, data } from '../../utils/data'

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
        console.log(e)
    }
    
}))
