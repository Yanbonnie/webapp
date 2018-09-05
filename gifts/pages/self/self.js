//获取应用实例
var app = getApp();
function resetData(args) {
    if (!args) {
        args = {};
    }

    return {
        userInfo: app.globalData.userInfo,

        contentReady: args.contentReady || false,
        canIUseOpenShare: wx.canIUse('button.open-type.share'),
        defaultImage: app.defaultImage,

        mainData: {},
        signData:null,
        index_id:null,
        is_click:null,
        day_num:null,
        showImg:false,
        signStatus:false
    }
}

Page({
    data: resetData(),
    tapMyRelease: function() {
        wx.navigateTo({
            url: '../self/myRelease'
        })
    },
    tapMyPartake: function() {
        wx.navigateTo({
            url: '../self/myPartake'
        })
    },
    tapMyPrize: function() {
        wx.navigateTo({
            url: '../self/myPrize'
        })
    },
    //管理地址
    chooseAddress: function() {
        var that = this;
        if (wx.chooseAddress) {
            wx.chooseAddress({
                success: function(res) {
                    // console.log(res);
                    // that.setData({
                    //     "userName": res.userName,
                    //     "telNumber": res.telNumber,
                    //     "address": res.provinceName + res.cityName + res.countyName + res.detailInfo,
                    //     // "cityName": res.cityName,
                    //     // "countyName": res.countyName,
                    //     // "detailInfo": res.detailInfo,
                    //     // "postalCode": res.postalCode,
                    //     //具体收货地址显示
                    //     flag: false
                    // })
                },
                fail: function(err) {
                    if(err.Msg != 'chooseAddress:fail cancel'){
                        // app.dialog({
                        //     content: '授权失败，请删除小程序后再次进入重新授权！'
                        // })
                    }
                }
            })
        } else {
            console.log('当前微信版本不支持chooseAddress');
        }
    },
    tapAvatar: function(event) {
        var that = this;
        var url = that.data.userInfo.avatar || app.defaultImage.avatar;
        wx.previewImage({
            current: url,
            urls: [url]
        })
    },
    avatarOnError: function() {
        var that = this;
        var idx = event.currentTarget.dataset.idx;
        var list = that.data.list;
        var data = {};
        data['list[' + idx + '].avatar'] = app.defaultImage.avatar;
        that.setData(data);
    },
    // 获取内容
    getMainData: function(args) {
        var that = this;
        var success = args.success;
        var fail = args.fail;
        if (args.showToastFlag) {
            app.showLoading({
                title: '请稍候'
            })
        }

        app.api.requestHandle({
            url: app.api.stringifyUrl({
                path: '/wxapp/Index/getMyInfo'
            }),
            success: function(res) {
                app.hideLoading();
                that.setData({
                    contentReady: true
                });

                var data = res.data;

                if (!data || typeof data === 'string') {
                    fail && fail();
                    app.dialog({
                        content: app.globalData.errMsgText
                    });
                    return;
                }

                if (data.status != 0) {
                    fail && fail(data.msg);
                    app.dialog({
                        content: data.msg || app.globalData.errMsgText
                    });
                    return;
                }

                typeof success === 'function' && success();

                that.setData({
                    mainData: data.data
                });

                const { gosignCount } = app.globalData;
                if (gosignCount) {
                    that.setData({ signStatus: true })
                    wx.setStorageSync('go_sign_index', 4);
                }
            },
            fail: function(err) {
                app.hideLoading();
                that.setData({
                    contentReady: true
                });
                fail && fail();
                app.dialog({
                    content: app.globalData.errMsgText
                });
            }
        });
    },
    reload: function(args) {
        var that = this;

        if (!args) {
            args = {};
        }

        that.getMainData({
            showToastFlag: args.showToastFlag,
            success: function() {
                typeof args.success == 'function' && args.success();
            },
            fail: args.fail
        });
    },
    stopPullDownRefresh: function() {
        wx.stopPullDownRefresh({
            complete: function(res) {
                // console.log(res, new Date())
            }
        })
    },
    onPullDownRefresh: function() {
        var that = this;
        this.reload({
            success: function() {
                that.stopPullDownRefresh();
            },
            fail: function() {
                that.stopPullDownRefresh();
            }
        });
    },
    onShow: function() {
        const { showImg } = this.data;
        var that = this;
        if (!showImg){
            app.checkIsAuthorize({
                success: function () {
                    that.reload({
                        showToastFlag: true
                    });
                }
            });
        }else{
            this.setData({
                showImg: false
            })
        }
        
    },
    onHide: function() {},
    onLoad: function(options) {
      
        // 标记渠道
        app.markChannel({
            channel: options.channel
        });
      this.getSignData();
    },
    onShareAppMessage: function() {
        return {
            imageUrl: app.globalData.shareCover,
            title: app.globalData.shareTitleByHome,
            path: app.globalData.sharePath
        }
    },
    // 显示广告大图
    showBanner(){
        this.setData({showImg:true})
        wx.previewImage({
            urls: ['https://xnt.xhwxpos.com/mining/static/images/bannerBig.jpg']
        })
    },
    // 获取签到数据接口
    getSignData(status = 1){
      if (status == 2){
            wx.showLoading({
                title: '加载中...',
                mask: true
            })
        }
        app.api.requestHandle({
            method:'GET',
            url: app.api.stringifyUrl({
                path: '/wxapp/Index/getSignData'
            }),
            success:  (res)=> {
                wx.hideLoading();

                var data = res.data;

                if (!data || typeof data === 'string') {
                    fail && fail();
                    app.dialog({
                        content: app.globalData.errMsgText
                    });
                    return;
                }

                if (data.status != 0) {
                    fail && fail(data.msg);
                    app.dialog({
                        content: data.msg || app.globalData.errMsgText
                    });
                    return;
                }

                typeof success === 'function' && success();

                this.setData({
                    signData: data.data,
                    index_id:data.index_id,
                    is_click: data.is_click,
                    day_num: data.day_num
                });
            },
            fail: function (err) {
                wx.hideLoading();
                fail && fail();
                app.dialog({
                    content: app.globalData.errMsgText
                });
            }
        });
    },
    // 用户签到接口
    postSignData(e){
        const { is_click} = this.data;
        if(!is_click) return;
        const {formId}=e.detail;
        wx.showLoading({
            title: '加载中...',
            mask:true
        })
        app.api.requestHandle({
            method: 'post',
            data:{
                form_id: formId,
                index:this.data.index_id,
                unionid:this.data.userInfo.unionid,
            },
            url: app.api.stringifyUrl({
                path: '/wxapp/Index/postSignData'
            }),
            success: res=> {
                wx.hideLoading();
                var data = res.data;

                if (!data || typeof data === 'string') {
                    fail && fail();
                    app.dialog({
                        content: app.globalData.errMsgText
                    });
                    return;
                }

                if (data.status != 0) {
                    fail && fail(data.msg);
                    app.dialog({
                        content: data.msg || app.globalData.errMsgText
                    });
                    return;
                }

                typeof success === 'function' && success();
              wx.setStorageSync('go_sign_index', 5);
                // 成功重新请求数据
                this.getSignData();
            },
            fail: function (err) {
                wx.hideLoading();
                fail && fail();
                app.dialog({
                    content: app.globalData.errMsgText
                });
            }
        });
    },
    // 操作每日签到
    operSign(e){
        const { signStatus } = this.data;
        const { status } = e.currentTarget.dataset;
        this.setData({
            signStatus: !signStatus
        })
        if (this.data.signStatus){
          this.getSignData(status);
        }
      app.globalData.gosignCount = 0;
    }
});