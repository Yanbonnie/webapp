//index.js
//获取应用实例
const app = getApp()
const { globalData: { REQUEST}} = app;
const Promise = require('../../utils/es6-promise.js');
Page({
    data: {
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
        count: 0,               //请求登陆接口count
        btnType:'',             //点击个人中心或者马上预约未登录的情况
    },
    //事件处理函数
    bindViewTap: function() {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onLoad: function() {
        // 调用接口 幻灯片和一级分类数据
        wx.showLoading({
            title: '加载中......',
        })
        Promise.all([REQUEST({ url: 'getslideimage' }), REQUEST({ url: 'getcategory', data: { parentId: 0} })]).then(res=>{
            wx.hideLoading();
            this.setData({
                bannerList:res[0].data,
                getcategory:res[1].data
            })
        })

        this.animation = wx.createAnimation({
            duration: 1000,
            timingFunction: 'ease',
        })

        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo.userInfo,
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
                this.loginHandle(res)
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res;
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                    this.loginHandle(res)
                }
            })
        }
    },
    // 获取用户信息回调函数
    getUserInfo: function(e) {
        console.log(e)
        const { stype } = e.currentTarget.dataset;
        if(e.detail.userInfo){ //拿到了用户信息才往下操作
            app.globalData.userInfo = e.detail;
            this.setData({
                userInfo: e.detail.userInfo,
                hasUserInfo: true,
                btnType: stype
            })
            this.loginHandle(e.detail)
        }        
    },
    //登录获取code
    loginHandle({ iv, encryptedData }) {
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                const { code } = res;
                this.getAllUserInfo(code, iv, encryptedData)
            }
        })
    },
    // 登陆
    getAllUserInfo(code, iv, encryptedData) {
        let { count, btnType } = this.data;
        // if (btnType && btnType == 'appointment') {  //点击马上预约
        //     this.appointmentHandle();
        // }
        // if (btnType && btnType == 'member') {  //点击个人中心
        //     this.goMemberCenter();
        // };
        // return;
        REQUEST({
            method: 'post',
            url: 'wechatauth',
            data: {
                code,
                iv,
                encryptedData
            },
            err:true
        }).then(res => {
            console.log(res)
            let { openid, unionid } = res;
            app.globalData.unionid = unionid;

            // app.globalData.unionid = unionid;
            // if ( btnType && btnType == 'appointment'){  //点击马上预约
            //     this.appointmentHandle();
            // }
            // if(btnType && btnType == 'member'){  //点击个人中心
            //     this.goMemberCenter();
            // }
        }).catch(res => {
            console.log(res)
            if (count < 5) {
                this.loginHandle({ iv, encryptedData })
            } else {
                wx.hideLoading();
                wx.showToast({
                    icon: 'none',
                    mask: true,
                    title: '授权失败，请退出重试',
                    duration: 3000
                })
            }
            ++count;
            this.setData({
                count
            })
        })
    },
    // 二级分类
    getcategorySecData(e) {
        const { parentid , name} = e.currentTarget.dataset;
        const { orderList } = this.data;
        wx.showLoading({
            title: '请求中...',
        })
        REQUEST({
            method: 'get',
            url: 'getcategory',
            data: {
                parentId: parentid
            }
        }).then(res => {
            wx.hideLoading()
            this.setData({
                getcategorySec: res.data,
                barrierState:true,
                barrierTitle:name                
            })
            // 初始化二级选中
            if(orderList.length>0){
                orderList.forEach(item => {
                    if (item.parentId == parentid) {
                        this.setData({ curOrderId: item.id })
                    }
                })
            }else{
                this.setData({ curOrderId: null })
            }
        })
    },
    // 二级分类选择
    selectItemHandle(e){
        const { id } = e.currentTarget.dataset;
        this.setData({ curOrderId: id })
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
        this.getcategoryCount();
        this.setData({
            animationData: this.animation.export(),
            isShow:false
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
    // 关闭二级弹框 确定，取消
    closeBarrier(e){
        const { stype } = e.currentTarget.dataset;
        let { orderList, curOrderId, getcategorySec } = this.data;

        if (stype == 'sure'){  //点击确定按钮
            getcategorySec.forEach(item=>{
                if (item.id == curOrderId){
                    orderList = orderList.filter(item2 => item2.parentId != item.parentId)  //先过滤同级
                    orderList.push({
                        id:item.id, 
                        name:item.name, 
                        price:item.price, 
                        parentId: item.parentId
                    })
                }
            })
        }        
        this.setData({
            barrierState:false,
            orderList
        })
        this.getcategoryCount();
    },
    // 计算一级是否选中
    getcategoryCount(){
        let { getcategory, orderList } = this.data;
        getcategory = getcategory.map(item => {
            let checked = false;
            orderList.forEach(orderItem => {
                if (orderItem.parentId == item.id) {
                    checked = true
                }
            })
            return {
                ...item,
                checked
            }
        })
        this.setData({ getcategory })
    },
    // 跳转到个人中心页面
    goMemberCenter(){
        const { hasUserInfo } = this.data;
        if (hasUserInfo) {
            wx.navigateTo({
                url: '/pages/member/index/index',
            })
        }
    },
    // 马上预约
    appointmentHandle(){
        const { hasUserInfo, orderList } = this.data;
        if(hasUserInfo){
            if (orderList.length <= 0){
                wx.showToast({
                    icon:'none',
                    title: '请选择故障',
                })
                return;
            }
            if(!app.globalData.unionId){
                wx.getUserInfo({
                    success: res => {
                        app.globalData.userInfo = res;
                        this.setData({
                            userInfo: res.userInfo,
                            hasUserInfo: true
                        })
                        this.loginHandle(res)
                    }
                })
            }
            app.globalData.orderList = orderList;
            wx.navigateTo({
                url: '/pages/member/order/index/order',
            })
        }
        
    },

})