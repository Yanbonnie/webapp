//index.js
//获取应用实例
const app = getApp()
const { globalData: { REQUEST}} = app;
Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),

        animationData:{},       //动画
        isShow:false,           //是否展示订单状态
        getcategory:[],         //一级分类数据
        getcategorySec:[],      //二级分类数据
        bannerList:[],          //banner数据
        barrierTitle:'',        //故障弹框标题
        barrierState:false,     //故障弹框状态
        orderList:[],           //订单数据
        curOrderId:null,        //当前选中的订单数据,
        code:''
    },
    //事件处理函数
    bindViewTap: function() {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onLoad: function() {
        // 调用接口
        this.getcategoryData();
        this.getslideimageData();

        this.animation = wx.createAnimation({
            duration: 1000,
            timingFunction: 'ease',
        })
        wx.login({
            success:res=>{
                console.log(res)
                this.setData({ code :res.code})
            }
        })
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
           
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                console.log(res)
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
                const { iv, encryptedData} = res;
                this.wechatauth({ iv, encryptedData})
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
                    const { iv, encryptedData } = res;
                    this.wechatauth({ iv, encryptedData })
                }
            })
        }
    },
    getUserInfo: function(e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo;
        console.log(e.detail.userInfo)

        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
        this.wechatauth()
    },
    // 登陆
    wechatauth({ iv, encryptedData}){
        REQUEST({
            method: 'post',
            url: 'wechatauth',
            data: {
                code:this.data.code,
                iv,
                encryptedData
            }
        }).then(res => {
            console.log(res)
            this.setData({
                getcategory: res.data
            })
        }) 
    },
    // 一级分类
    getcategoryData(){
        REQUEST({
            method:'get',
            url:'getcategory',
            data:{
                parentId:0
            }
        }).then(res=>{
            console.log(res)
            this.setData({
                getcategory:res.data
            })
        })
    },
    // 二级分类
    getcategorySecData(e) {
        const { id , name} = e.currentTarget.dataset;
        wx.showLoading({
            title: '请求中...',
        })
        REQUEST({
            method: 'get',
            url: 'getcategory',
            data: {
                parentId: id
            }
        }).then(res => {
            
            this.setData({
                getcategorySec: res.data,
                barrierState:true,
                barrierTitle:name                
            })
        })
    },
    // 二级分类选择
    selectItemHandle(e){
        const { id, name, price, parentid} = e.currentTarget.dataset;
        let { orderList } = this.data;
        // 1.需要先判断当前选中的分类再订单列表中有无同级分类,没有，直接添加到列表，有，需要先把同级的选中分类去除再添加到列表
        if (orderList.some(item =>item.parentid == parentid)){ //有
            orderList = orderList.filter(item => item.parentid != parentid)
        }
        orderList.push({ id, name, price, parentid })
        this.setData({ orderList, curOrderId:id})
    },
    // 删除已选故障数据
    delOrder(e){
        const { id } = e.currentTarget.dataset;
        let { orderList } = this.data;
        orderList = orderList.filter(item=>item.id != id);
        this.setData({ orderList })
        if(this.data.orderList.length == 0){
            this.animation.translateY('100%').step(); 
        }
        this.setData({
            animationData: this.animation.export(),
            isShow:false
        })
    },
    // 幻灯片
    getslideimageData() {
        REQUEST({
            method: 'get',
            url: 'getslideimage'
        }).then(res => {
            console.log(res)
            this.setData({
                bannerList: res.data
            })
        })
    },
    // 展开订单列表
    showListHandle(){
        if(this.data.orderList.length <= 0) return;
        const { isShow } = this.data;
        if(!isShow){ 
            this.animation.translateY(0).step();
        }else{
            this.animation.translateY('100%').step();
        }   
        
        this.setData({
            animationData: this.animation.export(),
            isShow: !isShow
        })
    },
    // 关闭二级弹框
    closeBarrier(e){
        const { stype } = e.currentTarget.dataset;
        let { orderList, curOrderId } = this.data;
        if (stype == 'cancle'){            
            orderList = orderList.filter(item =>item.id != curOrderId)
        }        
        this.setData({
            barrierState:false,
            orderList
        })
    }

})