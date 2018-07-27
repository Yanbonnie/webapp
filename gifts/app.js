var util = require('utils/util.js');
var md5 = require('utils/md5.min.js');
// var mta = require('utils/mta_analysis.js');
var common = require('pages/template/common.js');
var toptips = require('pages/template/toptips.js');
// var posting = require('pages/posting/public-posting.js');
var domain = 'https://mining.gdtengnan.com';
var version = '1.0.0';
var monitorNewsTimer;
var repeatLoginNumberOfTimes = 0;
var key = 'fbed077c306016743663fcebe31717c2';

// posting.getApp = function() {
//     return app;
// }

var app = {
    // mta: mta,
    onLaunch: function(options) {
        //调用API从本地缓存中获取数据
        // var logs = wx.getStorageSync('logs') || []
        // logs.unshift(Date.now())
        // wx.setStorageSync('logs', logs)

        // 流量统计初始化
        // mta.App.init({
        //     "appID": "500405937",
        //     "eventID": "500406294",
        //     "statPullDownFresh": true,
        //     "statShareApp": true,
        //     "statReachBottom": true
        // });

        // 监听网络状态与视频交互
        // app.monitorNetwork();
    },
    onShow: function (options){
        // console.log('onshow');
        this.globalData.shareTicket = options.shareTicket || '';
    },
    onHide: function (){
        // console.log('onhide');
        this.clearChannel();
    },
    shareFields: {},
    // 取分享字段
    getShareFields: function (args){
        var queryData = app.common.extend(true, {type: 2}, args.data || {});
        // console.log(queryData);
        if(app.shareFields[queryData.type]){
            args.success && args.success(app.shareFields[queryData.type]);
            return;
        }
        app.api.requestHandle({
            'ignore10010': true,
            method: 'POST',
            url: app.api.stringifyUrl({
                path: '/index/share'
            }),
            data: queryData,
            success: function (res){
                var data = res.data;
                if(data.code != 0){
                    args.fail && args.fail(res);
                    return;
                }
                app.shareFields[queryData.type] = data;
                args.success && args.success(data);
            },
            fail: function (err){
                args.fail && args.fail(err);
            }
        });
    },
    markChannel: function (param){
        var channelId = param.channel || wx.getStorageSync('channel_id');
        if(!channelId){
            return;
        }
        wx.setStorageSync('channel_id', channelId);
        param.channel = channelId;
        param.page_path = app.util.getCurrentPageUrlWithArgs();
        app.api.requestHandle({
            'ignore10010': true,
            method: 'POST',
            url: app.api.stringifyUrl({
                path: '/task/source'
            }),
            data: param
        });
    },
    clearChannel: function (){
        wx.removeStorageSync('channel_id');
    },
    util: util,
    common: common,
    toptips: toptips,
    // posting: posting,
    // 取两点距离
    getDistance: function (lat1, lng1, lat2, lng2) {
        lat1 = lat1 || 0;
        lng1 = lng1 || 0;
        lat2 = lat2 || 0;
        lng2 = lng2 || 0;

        var rad1 = lat1 * Math.PI / 180.0;
        var rad2 = lat2 * Math.PI / 180.0;
        var a = rad1 - rad2;
        var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;

        var r = 6378137;
        return r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)))
    },
    getShareInfo: function (shareTicket, successCallback, failCallback){
        var that = this;
        wx.getShareInfo({  
            shareTicket: shareTicket,
            success: successCallback,  
            fail: function (res) {
                // that.dialog({
                //     content: 'fail:' + res.errMsg
                // });

                failCallback && failCallback();
            }  
        });
    },
    // 页面滚动条事件
    pageScrollTo: function (args) {
        if (wx.pageScrollTo) {
            wx.pageScrollTo(args);
        } else {
            this.dialog({
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
            });
        }
    },
    getLocation: function (options){
        var success = options.success;
        var fail = options.fail;
        options.success = function (r){
            wx.removeStorageSync('deny_location');
            success && success(r);
        }
        options.fail = function (r){
            wx.setStorageSync('deny_location', true);
            fail && fail(r);
        }
        wx.getLocation(options);
    },
    // 监听网络状态与视频交互
    monitorNetwork: function (){
        if(!wx.onNetworkStatusChange){
            return;
        }
        // 获取网络状态
        wx.getNetworkType({
            success: function(res) {
                // 返回网络类型, 有效值：
                // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
                app.globalData.networkType = res.networkType;
            }
        });
        app.bindNetworkChange();
    },
    bindNetworkChange: function (){
        if(!wx.onNetworkStatusChange){
            return;
        }
        // 不知道为什么播放视频的过程中，切换4G网络，暂停视频后，这个监听网络切换就没用了？？？？？
        wx.onNetworkStatusChange(function(res) {
            // console.log(res.isConnected, '##');
            // console.log(res.networkType, '##');

            app.globalData.networkType = res.networkType;

            app.videoPlayCheck();
        });
    },
    // 检查视频播放
    videoPlayCheck: function (){
        if(!wx.onNetworkStatusChange){
            return;
        }
        
        // console.log(app.globalData.videoId);

        if(app.globalData.videoId && app.globalData.networkType != 'wifi'){
            var videoContext = wx.createVideoContext(app.globalData.videoId);
            videoContext.pause();
            app.videoPlayConfirm({
                success: function (){
                    videoContext.play();
                }
            });
        }
    },
    // 设置视频信息
    videoSetInfo: function(id){
        app.globalData.videoId = id;
    },
    // 清除视频信息
    videoClearInfo: function(){
        app.globalData.videoId = null;
    },
    // 确认是否继续观看视频
    videoPlayConfirm: function (args){
        app.confirm({
            cancelText: '取消观看',
            confirmText: '继续观看',
            content: '您现在不在WIFI环境下，正在使用流量',
            success: args.success,
            cancel: args.cancel
        });
    },
    showLoading: function(args) {
        if (wx.showLoading) {
            wx.showLoading(args);
        } else {
            wx.showToast(common.extend({
                title: '请稍候',
                icon: 'loading',
                duration: 10000
            }, args));
        }
    },
    hideLoading: function() {
        if (wx.hideLoading) {
            wx.hideLoading();
        } else {
            wx.hideToast();
        }
    },
    dialog: function(param) {
        wx.showModal({
            title: param.title || '提示',
            content: param.content || app.globalData.errMsgText,
            showCancel: false,
            confirmText: param.confirmText || '知道了',
            confirmColor: param.confirmColor || '#fbc31d',
            success: function(res) {
                if (res.confirm) {
                    if (typeof param.success == 'function') {
                        param.success(res);
                    }
                }
            }
        })
    },
    confirm: function(param) {
        wx.showModal({
            title: param.title || '提示',
            content: param.content || app.globalData.errMsgText,
            cancelText: param.cancelText || '取消',
            cancelColor: param.cancelColor || '#333',
            confirmText: param.confirmText || '确认',
            confirmColor: param.confirmColor || '#fbc31d',
            success: function(res) {
                if (res.confirm) {
                    if (typeof param.success == 'function') {
                        param.success(res);
                    }
                } else {
                    if (typeof param.cancel == 'function') {
                        param.cancel(res);
                    }
                }
            }
        })
    },
    isLoginFail: function() {
        return wx.getStorageSync('user_login_fail');
    },
    isNotAuthorize: function() {
        return wx.getStorageSync('user_reject_authorize');
    },
    // 跳转授权页
    toAuthorize: function (callb){        
        var curPagePath = app.util.getCurrentPageUrlWithArgs();
        var startPagePath = '/pages/start/start';
        // console.log(curPagePath);
        if(curPagePath != startPagePath){
            callb && callb();
            app.globalData.redirectPath = curPagePath;
            app.clearUserInfo();                                    
            wx.reLaunch({
                url: startPagePath,
                fail: function (){
                    wx.redirectTo({
                        url: startPagePath
                    });
                }
            });
        }
    },
    // 判断用户是否有授权用户信息
    checkIsAuthorize: function (args){
        var that = this;
        var failHandle = function (){
            args.fail && args.fail();
            that.toAuthorize();
        };
        // 假如授权js缓存还在
        if (app.globalData.isAuthorize) {
            args.success && args.success();
            return;
        }
        if (app.isLoginFail() || !app.globalData.userInfo.openid) {
            failHandle();
            return;
        }
        wx.getSetting({
            success: function(res){
                var authSetting = res.authSetting;
                if(authSetting['scope.userInfo']){
                    app.globalData.isAuthorize = true;
                    args.success && args.success();
                } else {
                    failHandle();
                }
            },
            fail: failHandle
        });
    },
    // 新获取用户信息方式（button[open-type="getUserInfo"]）
    newBindGetUserInfo: function (userInfoRes, cb){
        var that = this;   
        // 假如拒绝授权
        if(!userInfoRes.userInfo){
            that.clearUserInfo();
            wx.setStorageSync('user_reject_authorize', true);
            typeof cb == "function" && cb(that.globalData.userInfo);
            return;
        }
        
        that.globalData.userInfoRes = userInfoRes;
        //重新授权登录
        that.userAuthorize(cb);

        // if(!app.globalData.userInfo.openid){
        //     that.globalData.userInfoRes = userInfoRes;
        //     //重新授权登录
        //     that.userAuthorize(cb);
        //     // that.getUserInfo(cb);
        // } else {
        //     typeof cb == "function" && cb(app.globalData.userInfo);
        // }
    },
    // 微信授权
    userAuthorize: function(cb) {
        var that = this;
        wx.removeStorageSync('user_reject_authorize');
        wx.showNavigationBarLoading();
        wx.login({
            success: function(loginRes) {
                // console.log('wx.login success', loginRes);
                
                // 新方式
                // console.log(that.globalData.userInfoRes);
                wx.hideNavigationBarLoading();
                that.doMicroLogin(loginRes, that.globalData.userInfoRes, cb);

                // 老方式
                // // console.log('wx.login success', loginRes);
                // wx.getUserInfo({
                //     success: function(userInfoRes) {
                //         // console.log('wx.getUserInfo success', loginRes, userInfoRes);
                //         that.doMicroLogin(loginRes, userInfoRes, cb);
                //     },
                //     complete: function(res) {
                //         wx.hideNavigationBarLoading();
                //         // console.log('wx.getUserInfo complete', res);
                //         // 用户拒绝授权
                //         if (!res.userInfo) {
                //             wx.removeStorageSync('session_key');
                //             wx.removeStorageSync('user_token');
                //             wx.removeStorageSync('user_info');
                //             wx.setStorageSync('user_reject_authorize', true);
                //             that.globalData.userToken = '';
                //             that.globalData.userInfo = {};
                //             typeof cb == "function" && cb(that.globalData.userInfo);
                //         }
                //     }
                // })
            }
        })
    },
    // 获取用户信息
    // getUserInfo: function(cb) {
    //     var that = this;
    //     wx.checkSession({
    //         success: function(res) {
    //             var userinfo = wx.getStorageSync('user_info');
    //             var userToken = wx.getStorageSync('user_token');
    //             that.globalData.userToken = userToken || '';
    //             that.globalData.userInfo = userinfo || {};
    //             typeof cb == "function" && cb(that.globalData.userInfo);
    //         },
    //         fail: function(res) {
    //             //重新授权登录
    //             that.userAuthorize(cb);
    //         }
    //     });
    // },
    clearUserInfo: function (){
        wx.removeStorageSync('session_key');
        wx.removeStorageSync('user_token');
        wx.removeStorageSync('user_info');
        wx.setStorageSync('user_login_fail', true);
        app.globalData.sessionKey = '';
        app.globalData.userToken = '';
        app.globalData.userInfo = {};
        app.globalData.isAuthorize = false;
        app.globalData.userInfoRes = {};
    },
    // 注册
    doMicroLogin: function(loginRes, userInfoRes, cb) {
        var that = this;
        var failEvent = function(msg) {
            that.dialog({
                content: msg || '登录失败，请稍候再试'
            });
            that.clearUserInfo();
            typeof cb == "function" && cb(that.globalData.userInfo);
        };
        that.api.microLogin({
            data: {
                code: loginRes.code,
                encrypted_data: userInfoRes.encryptedData,
                iv: userInfoRes.iv
            },
            success: function(res) {
                var data = res.data;
                if (!data || typeof data === 'string') {
                    failEvent();
                    return;
                }
                switch (data.status) {
                    case 0:
                        data.userinfo = data.data;

                        app.globalData.isAuthorize = true;

                        wx.removeStorageSync('user_login_fail');
                        wx.setStorageSync('session_key', data.session_key);
                        wx.setStorageSync('user_token', data.token);
                        wx.setStorageSync('user_info', data.userinfo);
                        that.globalData.sessionKey = data.session_key || '';
                        that.globalData.userToken = data.token || '';
                        that.globalData.userInfo = data.userinfo || {};

                        // console.log(data);
                        typeof cb == "function" && cb(that.globalData.userInfo);
                        break;
                    default:
                        failEvent(data.msg);

                }
            },
            fail: function(err) {
                failEvent(err.errMsg);
            }
        });
    },
    // 请求新信息
    doMicroGetNews: function(that) {
        if (!(app.globalData.userInfo || {}).unionid) {
            return;
        }
        app.api.microGetNews({
            success: function(r) {
                var data = r.data;
                // console.log(data);
                if (!data || typeof data === 'string' || data.code != 0) {
                    return;
                }
                app.globalData.news = (data.data || {}).news;

                // 处理页面显示
                var newNum = app.globalData.news;
                var hasNews = parseInt(newNum) > 0;
                app.toptips(that, {
                    newsToptipsMsg: hasNews ? '你有的新消息' : null,
                    newsToptipsNum: hasNews ? newNum : null
                }, true);
            },
            fail: function(err) {
                // console.error(err);
            }
        });
    },
    // 监控新消息
    monitorNews: function(that) {
        app.unMonitorNews(that);

        app.doMicroGetNews(that);

        monitorNewsTimer = setInterval(function() {
            app.doMicroGetNews(that);
        }, 5000);

        // 点击新消息
        that.tapToptips = function() {
            wx.navigateTo({
                url: '/pages/self/news'
            })
        };

        // console.log('监控新消息');
    },
    // 解除监控新消息
    unMonitorNews: function(that) {
        clearInterval(monitorNewsTimer);
        // console.log('解除监控新消息');
    },
    api: {
        domain: domain,
        accesskey: 'tH9fS4mk5ANaFWWX2qR1',
        appKey: 'fbed077c306016743663fcebe31717c2',
        stringifyUrl: function(args) {
            // return this.domain + args.path;
            return this.domain + '/index.php' + args.path;
            // return this.domain + (args.pathname || '/api/Applet/smallapp_api.php') + (args.search || '?v=' + version + '&appid=1&is_micro=1&mod=' + args.method);
        },
        // 签名算法
        stringifySign: function(args) {
            if(!args){
                args = {
                    param: {}
                };
            }
            var userinfo = app.globalData.userInfo || {};
            var that = this;
            var data = args.param || {};
            var Accesskey = that.accesskey;
            var timestamp = Date.parse(new Date()) / 1000;

            if(args.needSessionKey){
                data.session_key = app.globalData.sessionKey;
            }

            // data.token = app.globalData.userToken;
            // token改成unionid
            data.unionid = app.globalData.userInfo.unionid || '';

            data.timestamp = timestamp;

            // 此处切记讲参数key值按照字母顺序
            var ks = (function() {
                var arr = [];
                for (var k in data) {
                    if (data.hasOwnProperty(k)) {
                        arr.push(k);
                    }
                }
                arr.sort();
                return arr;
            })();
            var encryptStr = (function() {
                var str = '';
                for (var i = 0; i < ks.length; i++) {
                    str += data[ks[i]];
                }
                return str;
            })();
            // console.log(encryptStr);
            var sign = md5(encryptStr + Accesskey);

            data.sign = sign;

            return data;
        },
        // 统一请求代理
        requestHandle: function(args) {
            var param = this.stringifySign({
                param: app.common.extend(true, {
                    key: this.appKey
                }, args.data || {}),
                needSessionKey: args.needSessionKey
            });
            if(!args.clearRepeatLoginOfTimes){
                args.clearRepeatLoginOfTimes = true;
                repeatLoginNumberOfTimes = 0;
            }
            wx.request({
                method: args.method || 'GET',
                url: args.url,
                // 参数 {code}
                data: param,
                dataType: 'json',
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                success: function(res) {
                    var lock;
                    var data = res.data;
                    if (!args['ignore10010'] && data && typeof data != 'string') {
                        if(repeatLoginNumberOfTimes > 1){
                            data.status = 10010888;
                        }
                        switch (parseInt(data.status)) {
                            // 用户未注册
                            case 10010:
                                that.toAuthorize(function (){
                                    repeatLoginNumberOfTimes += 1;
                                    lock = 1;
                                });
                                // 缺少userInfoRes信息，有别的方式，暂且不花时间去加缓存判断
                                // app.userAuthorize(function(userinfo) {
                                //     app.api.requestHandle(args);
                                // });
                                break;
                            // default:
                                // code body
                        }
                    }
                    !lock && typeof args.success == 'function' && args.success(res);
                },
                fail: function(err) {
                    // console.error(err);
                    repeatLoginNumberOfTimes += 1;
                    typeof args.fail == 'function' && args.fail(err);
                }
            });
        },
        // 登录接口
        microLogin: function(args) {
            args.url = this.stringifyUrl({
                path: '/wxapp/Index/userLogin'
                // method: 'micro_login'
            });
            args.method = 'POST';
            this.requestHandle(args);
        },
        // 获取消息提醒
        microGetNews: function(args) {
            // 忽略 10010 状态
            args['ignore10010'] = true;
            args.url = this.stringifyUrl({
                method: 'micro_get_news'
            });
            args.method = 'POST';
            this.requestHandle(args);
        }
    },
    defaultImage: {
        // avatar: 'https://football.gdtengnan.com/img/default_avatar.png?t=1526463549555'
    },
    splashScreenImgs: [
        // 'https://football.gdtengnan.com/img/sp_1.jpg?t=1526463549555',
        // 'https://football.gdtengnan.com/img/sp_2.jpg?t=1526463549555'
    ],
    globalData: {
        errMsgText: '系统繁忙，请稍候再试',
        redirectPath: null,
        currentPageThat: null,
        isAuthorize: false,
        userInfoRes: {},
        version: version,
        shareTicket: '',
        sessionKey: wx.getStorageSync('session_key') || '',
        userToken: wx.getStorageSync('user_token') || '',
        userInfo: wx.getStorageSync('user_info') || {},
        shareTitleByHome: '有好礼',
        sharePath: '/pages/index/index',
        shareCover: '/images/share.jpg',
        pageLen: 10
    }
};
App(app)
