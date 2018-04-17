//index.js
//获取应用实例
const app = getApp()
const { Actionsheet, extend } = require('../../assets/component/index.js');
Page(extend({}, Actionsheet, {
    data: {
        /*motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo')*/
        imgUrls: [
            'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
            'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
            'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
        ],
        baseActionsheet: {   //点击拨打电话弹层配置
            show: false,
            // cancelText: '关闭 Action',
            closeOnClickOverlay: true,
            componentId: 'baseActionsheet',
            actions: []

        }
    },
    //点击拨打电话
    toggleActionsheet() {
        this.setData({
            'baseActionsheet.actions': [{
                name: '18825039689',
                className: 'action-class',
                loading: false
            },
            {
                name: '17098902598',
                className: 'action-class',
                loading: false
            }],
            'baseActionsheet.show': true
        })
    },
    //选择电话号码
    _handleZanActionsheetBtnClick(res) {
        const { componentId, index } = res.currentTarget.dataset;
        const { actions } = this.data.baseActionsheet;
        console.log(actions[index])
    },
    //弹出层点击消失
    _handleZanActionsheetMaskClick(){
        this.setData({
            'baseActionsheet.show': false
        })
    },
    //点击查看查单
    lookMenu(e){  
        wx.navigateTo({
            url:'/pages/detail/detail'
        })
    },
    onLoad: function () {
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
