//获取应用实例
var app = getApp();
var shareFields = {};
var imgUrls = [
    // '/images/intro1.jpg',
    // '/images/intro2.jpg'
    'https://xnt.xhwxpos.com/mining/static/images/intro1.jpg',
    'https://xnt.xhwxpos.com/mining/static/images/intro2.jpg'
]
function resetData(args) {
    if(!args){
        args = {};
    }
    return {
        ajaxLock: false,
        imgUrls: imgUrls
    }
}

Page({
    data: resetData(),
    tapEnter: function (){
        var that = this;
        var url = app.globalData.redirectPath || '/pages/index/index';
        app.globalData.redirectPath = null;
        if(url.match(/pages\/index\/index/) || url.match(/pages\/posting\/posting/) || url.match(/pages\/self\/self/)){
            wx.switchTab({
                url: url
            });
        } else {
            wx.redirectTo({
                url: url
            });
        }
        // console.log(url);
    },
    getUserInfo: function (res){
        // console.log(res);
        var that = this;
        that.setData({
            ajaxLock: true
        });
        app.showLoading({
            title: '加载中'
        });
        app.newBindGetUserInfo(res.detail, function (userInfo){
            that.setData({
                ajaxLock: false
            });
            app.hideLoading();
            if (app.isNotAuthorize()) {
                app.dialog({
                    content: '您没授权，不能进行该操作'
                });
                return;
            }        
            if (app.isLoginFail()) {
                // app.dialog({
                //     content: '登录失败，请稍后再试'
                // });
                return;
            }
            
            that.tapEnter();

            // app.getConfigFields({
            //     callback: function (){
            //         that.setData({
            //             ajaxLock: false
            //         });
            //         that.tapEnter();
            //     }
            // });
        });
    },
    onPageScroll: function (event){
    },
    onShow: function() {
    },
    onHide: function (){
    },
    onLoad: function(options) {
        var that = this;
        
        // 标记渠道
        app.markChannel({
            channel: options.channel
        });

        // app.getShareFields({
        //     success: function (res){
        //         var data = res.data;
        //         shareFields.title = data.content;
        //         shareFields.cover = data.cover;
        //         // console.log('分享字段', res);
        //     }
        // });
    },
    onShareAppMessage: function(event) {
        var that = this;
        var title = shareFields.title || app.globalData.shareTitleByHome;
        var path = app.globalData.sharePath;
        var imageUrl = shareFields.cover || app.globalData.shareCover;
        return {
            title: title,
            path: path,
            imageUrl: imageUrl,
            success: function(res) {
                // code body
            },
            complete: function(){
                // code body
            }
        }
    }
});
