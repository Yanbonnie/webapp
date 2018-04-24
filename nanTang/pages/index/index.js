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
        businessList: [],
        baseActionsheet: {   //点击拨打电话弹层配置
            show: false,
            // cancelText: '关闭 Action',
            closeOnClickOverlay: true,
            componentId: 'baseActionsheet',
            actions: []
        },
        shopcount:0,
        pageNum:2,     //翻页数据
        indexEnd:false,
        showVideo:false,
        videoSrc:null,
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
        let temShopCount = this.data.shopcount;
        WXREQ('GET', URL['getConfig'],{
            key,
            unionid
        },res=>{
            wx.stopPullDownRefresh();   //处理下拉刷新
            wx.hideLoading();
            if(res.status == 0){
                const { banner, config, data, shopcount } = res;
                let TemBusinessList = this.data.businessList;
                if (this.data.businessList.length == 0){  //列表没有数据  第一次获取数据
                  this.setData({
                    businessList: data
                  })
                  if (shopcount < 10) {
                    this.setData({
                      indexEnd: true
                    })
                  }
                }else{   //列表有数据    第二次之后获取数据
                  if (temShopCount < shopcount){  //再次获取的时候， 发现数据比之前的要多。
                    this.setData({
                      indexEnd: false
                    })
                  }
                  if(data.length == 0) return;
                  for (let i = 0; i < TemBusinessList.length; i++){
                    for(let j = 0; j < data.length; j++){
                      if (TemBusinessList[i].id == data[j].id){
                        TemBusinessList[i] = data[j]
                      }
                    }
                  }
                  this.setData({
                    businessList: TemBusinessList
                  })
                }                
                this.setData({
                    banner,
                    config,                    
                    shopcount
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
    onReachBottom(e) {
        if (this.data.indexEnd) return;
        wx.showLoading({
            title: '加载中...',
            mask:true
        })    
        WXREQ('GET',URL['getShop'],{
            key,
            unionid:app.globalData.userInfo.unionid,
            page:this.data.pageNum,
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
                    businessList:temList,
                    pageNum:this.data.pageNum+1
                })
                if(arr.length < 10){
                    this.setData({
                        indexEnd:true
                    })
                }
            }else{
                wx.showToast({
                    title: res.msg,
                    mask:true,
                    icon:'none'
                })
            }
        })
    },
    zanUpdate(index,num){
        let tem = this.data.businessList.map(item=>{
            return item;
        });
        tem[index].is_praise = 1;
        tem[index].praise = tem[index].praise+num;
        this.setData({
            businessList: tem,
        })
    },
    //关闭视频
    closeVideoHandle(){
        this.setData({
            showVideo:false
        })
        this.videoContext.pause();
    },
    //去除默认
    delDefault(){},
    geDetail(e){  //banenr跳链接
        const { url, } = e.currentTarget.dataset;
        const typeNum = e.currentTarget.dataset.type;
        if (typeNum == 1){   //小程序
            wx.navigateTo({
                url: url,
            })
        }else if(typeNum == 2) { //外链
            wx.navigateTo({
                url: '/pages/webview/webview?url='+url,
            })
        }else if(typeNum == 3){
            this.setData({
                videoSrc: url,
                showVideo: true
            })
            this.videoContext = wx.createVideoContext('myVideo');
        }    
    },
    onPullDownRefresh(e){
        this.getConfig();
    }
    
}))
