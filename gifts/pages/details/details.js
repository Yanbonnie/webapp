//获取应用实例
var app = getApp();
var ountdownTimeTimer;
let imgUrls = ['https://xnt.xhwxpos.com/mining/static/images/rule1.png', 'https://xnt.xhwxpos.com/mining/static/images/rule2.png', 'https://xnt.xhwxpos.com/mining/static/images/rule3.png']
function resetData(args) {
    if (!args) {
        args = {};
    }
    return {
        userInfo: wx.getStorageSync('user_info') || {},

        options: args.options || {},
        contentReady: args.contentReady || false,
        contentErrText: '',

        page: 1,
        mainInfo: {},
        userList: [],
        winnerList: [
            // {
            //     id: 1,
            //     avatar: 'https://wx.qlogo.cn/mmopen/vi_32/yhNUouLkIkWj6o24icNU6PIbbNTK972P2jpD6icqjw5LfJuLujnrobyPuSQKNibPtm3wmhO7xhJHgaAicgl8pu8xcg/132',
            //     wxname: 'Bingoo',getPrizeList
            //     name: '曹操',
            //     mobile: '13572687637',
            //     address: '广州大道中289号南方传媒大厦B塔',
            //     time: '2018-02-12 13:34:35',
            //     // 0 待领取，1 已领取
            //     status: 0
            // },
            // {
            //     id: 2,
            //     avatar: 'https://wx.qlogo.cn/mmopen/vi_32/yhNUouLkIkWj6o24icNU6PIbbNTK972P2jpD6icqjw5LfJuLujnrobyPuSQKNibPtm3wmhO7xhJHgaAicgl8pu8xcg/132',
            //     wxname: 'Bingoo',
            //     name: '曹操',
            //     mobile: '13572687637',
            //     address: '广州大道中289号南方传媒大厦B塔',
            //     time: '2018-02-12 13:34:35',
            //     // 0 待领取，1 已领取
            //     status: 1
            // }
        ],
        timeText: '',

        winning: false,                       //挖宝中或中奖
        digging: false,                       //true  挖宝中    false  中奖   结合winning
        diggingCd: false,                     //冷却中
        canDiggingCd: false,                  //可挖宝
        digNothing: false,                    //什么也没挖到
        giftNone: false,                      //礼品被挖光
        hasMoreUser: false,
        showFields: false,
        showPrizeListFlag: false,
        showAddress: false,
        showShareDialog: false,
        friendUrl: '',                        //分享的图片地址
        friendStatus: false,                  //分享到朋友圈
        propertyStatus: false,                //道具弹框
        propertyList: [],                     //道具数组  tools_id-道具ID tools_name-道具名  tools_type-道具类型 （1自动铲子） tools_num-道具数量  pic-道具图标
        exchangeStatus:false,                 //兑奖弹框状态
        getCodeIntroStatus:false,              //获取兑奖码介绍
        swiperStatus:false,                   //活动规则
        imgUrls: imgUrls,
        useState:false,                        //是否可以使用
        useCount:0,                           //使用的数量                    
        bottomDigState:true,                  //底部挖宝是否显示
        animationTop:null,         
        animationTopData: {},
        animationBottom:null,
        animationBottomData:{},
        scrollTopNum:0,

    }
}

Page({
    data: resetData(),
    toggleAddressPop: function(flag) {
        this.setData({
            showAddress: typeof flag == 'boolean' ? flag : !this.data.showAddress
        });
    },
    //预览大图
    previewImg(e) {
        const {
            img
        } = e.currentTarget.dataset;
        wx.previewImage({
            urls: [img],
        })
    },
    //分享到朋友圈
    toggleShareFriend() {
        var that = this;
        wx.showLoading({
            title: '加载中...',
            mask: true
        })
        app.api.requestHandle({
            url: app.api.stringifyUrl({
                path: '/wxapp/Index/getShare'
            }),
            data: {
                unionid: that.data.userInfo.unionid,
                code: that.data.options.code,
            },
            success: function(res) {
                wx.hideLoading();
                let data = res.data;
                if (data.status == 0) {
                    that.setData({
                        friendUrl: data.url,
                        friendStatus: true
                    })
                }
            },
            fail: function(err) {
                app.hideLoading();
                app.dialog({
                    content: err.errMsg || app.globalData.errMsgText
                });
            }
        });
    },
    closeFriend() {
        this.setData({
            friendStatus: false
        })
    },
    toggleSharePop: function() {
        const {
            canDiggingCd
        } = this.data;
        if (!canDiggingCd) {
            this.setData({
                showShareDialog: !this.data.showShareDialog
            });
        } else {
            //调用挖宝接口
            this.setData({
                'mainInfo.is_cd': 1, //冷却
                winning: true,
                digging: true,
                canDiggingCd: false,
                canDiggingCd: false,
                digNothing: false,
                giftNone: false
            })
            setTimeout(() => {
                this.miningTask();
            }, 2000)
        }
    },
    //挖宝接口
    miningTask() {
        const {
            is_manage
        } = this.data.mainInfo;
        var that = this;
        var queryData = {
            code: that.data.options.code,
            is_share: that.data.options.is_share || 0
        };

        if (queryData.is_share == 1) {
            queryData.from_unionid = that.data.options.from_unionid;
        }

        app.api.requestHandle({
            url: app.api.stringifyUrl({
                path: '/wxapp/Index/miningTask'
            }),
            data: queryData,
            success: function(res) {
                // console.info(res);
                app.hideLoading();
                that.setData({
                    contentReady: true
                });

                var data = res.data;

                if (!data || typeof data === 'string' || data.status != 0) {
                    that.getPostsFail((data || '').msg, param, fail);
                    return;
                }

                typeof success === 'function' && success(param);

                var mainInfo = data.data || {};
                // test code
                // mainInfo.status = 0;
                // mainInfo.goods_type = 1;
                // mainInfo.draw_type = 2;
                // mainInfo.is_cd = 0;
                // mainInfo.is_prize = 0;
                mainInfo.is_manage = is_manage;

                that.setData({
                    mainInfo: mainInfo,
                    userList: mainInfo.user || []
                });
                that.getUsedTools();
                if (mainInfo.user.length > 50) {
                    that.setData({
                        hasMoreUser: true
                    });
                }

                //中奖
                if (mainInfo.is_prize == 1) {
                    that.setData({
                        winning: true,
                        digging: false,
                        diggingCd: false,
                        canDiggingCd: false,
                        digNothing: false,
                        gitNone: false,
                    });
                    if (mainInfo.is_draw == 0) {
                        setTimeout(function() {
                            // 如果是实物
                            if (mainInfo.goods_type == 2) {
                                if (mainInfo.draw_type == 2) { //如果是邮寄
                                    that.toggleAddressPop(true);
                                } else { // 如果是现场
                                    app.dialog({
                                        title: '领奖提示',
                                        content: mainInfo.draw_info
                                    });
                                }
                            } else { //红包
                                setTimeout(() => {
                                    app.dialog({
                                        title: '领奖提示',
                                        content: '请到微信零钱查看红包'
                                    });
                                }, 1500)
                            }
                        }, 1500);
                    }
                } else { //没中奖
                    that.setData({
                        winning: false,
                        diggingCd: false,
                        canDiggingCd: false,
                        digNothing: true,
                        gitNone: false,
                    })
                    setTimeout(() => {
                        if (mainInfo.status == 0) { //项目进项中....
                            if (mainInfo.is_cd == 1) { //冷却倒计时
                                that.runCountdownTime(mainInfo.time);
                                that.setData({
                                    winning: false,
                                    canDiggingCd: false,
                                    digNothing: false,
                                    gitNone: false,
                                })
                            }
                        } else { //项目结束
                            that.setData({
                                giftNone: true,
                                winning: false,
                                canDiggingCd: false,
                                diggingCd: false,
                                digNothing: false,
                            })
                        }
                    }, 3000)
                }


            },
            fail: function(err) {
                app.hideLoading();
                app.dialog({
                    content: err.errMsg || app.globalData.errMsgText
                });
            }
        });
    },
    //挖到宝提示
    diggerGiftHandle() {
        const {
            mainInfo
        } = this.data;
        if (mainInfo.is_draw == 0) {
            if (mainInfo.goods_type == 2) {
                if (mainInfo.draw_type == 2) { //如果是邮寄
                    this.toggleAddressPop(true);
                } else { // 如果是现场
                    app.dialog({
                        title: '领奖提示',
                        content: mainInfo.draw_info
                    });
                }
            }
        }else{
            if (mainInfo.goods_type == 2) {
                if (mainInfo.draw_type == 2) { //如果是邮寄
                    app.dialog({
                        title: '领奖提示',
                        content: '请等待商家发货信息'
                    });
                } else { // 如果是现场
                    app.dialog({
                        title: '领奖提示',
                        content: mainInfo.draw_info
                    });
                }
            } else {
                app.dialog({
                    title: '领奖提示',
                    content: '请到微信零钱查看红包'
                });
            }
        }
    },
    toggleFieldsBox: function() {
        this.setData({
            showFields: !this.data.showFields
        });
    },
    tapManagePrizeInfo: function(event) {
        var that = this;
        var type = event.currentTarget.dataset.type;
        var idx = event.currentTarget.dataset.idx;
        var winnerList = that.data.winnerList;
        var item = winnerList[idx];

        app.showLoading({
            title: '请稍候'
        });

        app.api.requestHandle({
            url: app.api.stringifyUrl({
                path: '/wxapp/Index/managePrizeInfo'
            }),
            data: {
                unionid: that.data.userInfo.unionid,
                code: that.data.options.code,
                id: item.id,
                status: item.status
            },
            success: function(res) {
                // console.info(res);
                app.hideLoading();

                var data = res.data;

                if (!data || typeof data === 'string' || data.status != 0) {
                    app.dialog({
                        content: (data || '').msg || app.globalData.errMsgText
                    });
                    return;
                }

                var newData = {};
                newData['winnerList[' + idx + '].status'] = data.data.status;
                newData['winnerList[' + idx + '].time'] = data.data.time;
                that.setData(newData);
            },
            fail: function(err) {
                app.hideLoading();
                app.dialog({
                    content: err.errMsg || app.globalData.errMsgText
                });
            }
        });
    },
    confirmSendNews: function(event) {
        const { formId } = event.detail;
        var that = this;
        var ajaxParam = app.common.extend(true, {}, event.detail.value || {});
        var reg = /^\s+$/ig;
        var phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;

        ajaxParam.code = that.data.options.code;
        ajaxParam.unionid = that.data.userInfo.unionid;
        ajaxParam.formId = formId;

        if (!ajaxParam.name || reg.test(ajaxParam.name)) {
            app.dialog({
                content: '请填写收货人姓名！'
            });
            return;
        }
        if (!ajaxParam.mobile || reg.test(ajaxParam.mobile)) {
            app.dialog({
                content: '请填写联系电话！'
            });
            return;
        }
        if (!phoneReg.test(ajaxParam.mobile)) {
            app.dialog({
                content: '请填写有效电话！'
            });
            return;
        }
        if (!ajaxParam.address || reg.test(ajaxParam.address)) {
            app.dialog({
                content: '请填收件地址！'
            });
            return;
        }

        // console.log(ajaxParam);
        // return;

        app.confirm({
            title: '提示',
            content: '是否确认提交收件地址？',
            success: function() {
                app.showLoading({
                    title: '请稍候'
                });

                app.api.requestHandle({
                    url: app.api.stringifyUrl({
                        path: '/wxapp/Index/postMyPrizeInfo'
                    }),
                    data: ajaxParam,
                    success: function(res) {
                        // console.info(res);
                        app.hideLoading();

                        that.toggleAddressPop(false);

                        var data = res.data;

                        if (!data || typeof data === 'string' || data.status != 0) {
                            app.dialog({
                                content: (data || '').msg || app.globalData.errMsgText
                            });
                            return;
                        }
                        wx.showToast({
                            title: data.msg,
                            icon: 'success',
                            duration: 2000
                        });
                    },
                    fail: function(err) {
                        app.hideLoading();
                        app.dialog({
                            content: err.errMsg || app.globalData.errMsgText
                        });
                    }
                });
            }
        });
    },
    getPostsFail: function(msg, param, fail) {
        typeof fail === 'function' && fail();

        var that = this;
        app.dialog({
            content: msg || app.globalData.errMsgText,
            success: function(res) {
                if (res.confirm) {
                    wx.switchTab({
                        url: '/pages/index/index'
                    });
                    // wx.navigateBack({
                    //     delta: 1
                    // });
                }
            }
        });
        that.setData({
            contentErrText: msg || app.globalData.errMsgText
        });
    },
    getPosts: function(args) {
        var that = this;
        var param = args.param;
        var success = args.success;
        var fail = args.fail;
        args.showToastFlag = true;
        if (args.showToastFlag) {
            app.showLoading({
                title: '请稍候'
            })
        }

        var queryData = {
            code: that.data.options.code,
            is_share: that.data.options.is_share || 0
        };

        if (queryData.is_share == 1) {
            queryData.from_unionid = that.data.options.from_unionid;
        }
        // return;
        app.api.requestHandle({
            url: app.api.stringifyUrl({
                path: '/wxapp/Index/getTaskDetails'
            }),
            data: queryData,
            success: function(res) {
                // 获取我使用过的道具
                
                app.hideLoading();
                that.setData({
                    contentReady: true
                });

                var data = res.data;
                if (!data || typeof data === 'string' || data.status != 0) {
                    that.getPostsFail((data || '').msg, param, fail);
                    return;
                }

                typeof success === 'function' && success(param);

                var mainInfo = data.data || {};
                // test code
                // mainInfo.status = -1;
                // mainInfo.goods_type = 1;
                // mainInfo.draw_type = 2;
                // mainInfo.is_cd = 0;
                // mainInfo.is_prize = 1;

                that.setData({
                    mainInfo: mainInfo,
                    userList: mainInfo.user || []
                });
                that.getUsedTools();
                if (mainInfo.user.length > 50) {
                    that.setData({
                        hasMoreUser: true
                    });
                }
                if (mainInfo.is_prize) { //中奖
                    that.setData({
                        digging: false,
                        winning: true
                    })
                    if(mainInfo.is_draw == 0){
                        if (mainInfo.goods_type == 2) {
                            if (mainInfo.draw_type == 2) { //如果是邮寄
                                that.toggleAddressPop(true);
                            } else { // 如果是现场
                                app.dialog({
                                    title: '领奖提示',
                                    content: mainInfo.draw_info
                                });
                            }
                        }
                    }

                } else { //未中奖
                    if (mainInfo.status == 0) { //项目进项中....
                        if (mainInfo.is_cd == 1) { //冷却倒计时
                            that.runCountdownTime(mainInfo.time);
                            that.setData({
                                winning: false
                            })
                        } else { //可挖宝  is_cd = 0
                            that.setData({
                                winning: false,
                                canDiggingCd: true
                            })
                        }
                    } else { //项目结束
                        that.setData({
                            giftNone: true
                        })
                    }
                }
            },
            fail: function(err) {
                app.hideLoading();
                that.setData({
                    contentReady: true
                });
                that.getPostsFail(null, param, fail);
            }
        });
    },
    runPayment: function(payment) {
        var that = this;

        wx.requestPayment({
            'timeStamp': payment.timeStamp,
            'nonceStr': payment.nonceStr,
            'package': payment.package,
            'signType': payment.signType,
            'paySign': payment.paySign,
            'success': function(res) {
                wx.showToast({
                    title: '成功',
                    icon: 'success',
                    success: function() {
                        that.reload({
                            showToastFlag: true
                        });
                    }
                });
            },
            'fail': function(err) {
                wx.showToast({
                    title: err.errMsg || '支付失败，请稍后再试！',
                    icon: 'none'
                });
            }
        });
    },
    getPayTask: function(args) {
        var that = this;
        app.showLoading({
            title: '请稍后'
        });
        app.api.requestHandle({
            method: 'POST',
            url: app.api.stringifyUrl({
                path: '/wxapp/Index/payTask'
            }),
            data: {
                money: args.money,
                code: args.code
            },
            success: function(res) {
                var data = res.data;
                app.hideLoading();

                if (data.status != 0) {
                    app.dialog({
                        content: data.msg || app.globalData.errMsgText
                    });
                    return;
                }
                var payment = data.data;
                that.runPayment(payment);
            },
            fail: function(err) {
                app.hideLoading();
                app.dialog({
                    content: err.errMsg || app.globalData.errMsgText,
                    success: function() {}
                });
            }
        });
    },
    tapPayTask: function() {
        var that = this;
        that.getPayTask({
            money: that.data.mainInfo.money,
            code: that.data.options.code
        });
    },
    // 倒计时
    runCountdownTime: function(leftTime) {
        var that = this;
        clearInterval(ountdownTimeTimer);
        leftTime = parseInt(leftTime || that.data.detail.time);
        if (!leftTime || leftTime < 0) {
            return;
        }

        that.renderOuntdownTime(leftTime);
        ountdownTimeTimer = setInterval(function() {
            leftTime -= 1;
            that.renderOuntdownTime(leftTime);
            if (leftTime <= 0) {
                clearInterval(ountdownTimeTimer);
                // that.reload({
                //     showToastFlag: true
                // });
                that.setData({
                    canDiggingCd: true,
                    diggingCd: false
                })
            }
        }, 1000);
    },
    renderOuntdownTime: function(leftTime) {
        var that = this;
        that.setData({
            time: leftTime,
            timeText: that.formatSeconds(leftTime),
            diggingCd: true
        })
    },
    formatSeconds: function(value) {
        var secondTime = parseInt(value); // 秒
        var minuteTime = 0; // 分
        var hourTime = 0; // 小时
        if (secondTime > 60) { //如果秒数大于60，将秒数转换成整数
            //获取分钟，除以60取整数，得到整数分钟
            minuteTime = parseInt(secondTime / 60);
            //获取秒数，秒数取佘，得到整数秒数
            secondTime = parseInt(secondTime % 60);
            //如果分钟大于60，将分钟转换成小时
            if (minuteTime > 60) {
                //获取小时，获取分钟除以60，得到整数小时
                hourTime = parseInt(minuteTime / 60);
                //获取小时后取佘的分，获取分钟除以60取佘的分
                minuteTime = parseInt(minuteTime % 60);
            }
        }
        var result = "" + parseInt(secondTime) + "秒";

        if (minuteTime > 0) {
            result = "" + parseInt(minuteTime) + "分" + result;
        }
        if (hourTime > 0) {
            result = "" + parseInt(hourTime) + "小时" + result;
        }
        return result;
    },
    getUsers: function(args) {
        var that = this;
        var param = args.param;
        var success = args.success;
        var fail = args.fail;

        app.showLoading({
            title: '请稍候'
        });

        that.setData({
            loadMoreLock: true
        });

        app.api.requestHandle({
            url: app.api.stringifyUrl({
                path: '/wxapp/Index/getTaskUser'
            }),
            data: {
                code: that.data.options.code,
                page: that.data.page
            },
            success: function(res) {
                app.hideLoading();
                that.setData({
                    loadMoreLock: false
                });

                var data = res.data;

                if (!data || typeof data === 'string' || data.status != 0) {
                    app.dialog({
                        content: (data || '').msg || app.globalData.errMsgText
                    });
                    return;
                }

                typeof success === 'function' && success(param);

                var userList = data.data || [];

                that.setData({
                    userList: that.data.userList.concat(userList)
                });
            },
            fail: function(err) {
                app.hideLoading();
                that.setData({
                    loadMoreLock: false
                });
                app.dialog({
                    content: err.errMsg || app.globalData.errMsgText
                });
            }
        });
    },
    getNextPage: function() {
        var that = this;
        var loadMoreLock = that.data.loadMoreLock;
        var page = that.data.page;
        if (!loadMoreLock) {
            that.setData({
                loadMoreLock: true
            });
            that.getUsers({
                param: {
                    page: page + 1
                },
                success: function(param) {
                    that.setData({
                        page: param.page
                    });
                }
            });
        }
    },
    getMoreUser: function() {
        this.getNextPage();
    },
    hidePrizeListPop: function() {
        var that = this;
        that.setData({
            showPrizeListFlag: false
        });
    },
    showPrizeListPop: function() {
        var that = this;
        app.showLoading({
            title: '请稍候'
        })

        app.api.requestHandle({
            url: app.api.stringifyUrl({
                path: '/wxapp/Index/getPrizeList'
            }),
            data: {
                code: that.data.options.code
            },
            success: function(res) {
                app.hideLoading();

                var data = res.data;

                if (!data || typeof data === 'string' || data.status != 0) {
                    app.dialog({
                        content: (data || '').msg || app.globalData.errMsgText
                    });
                    return;
                }

                var list = data.data || [];

                that.setData({
                    winnerList: list,
                    showPrizeListFlag: true
                });
            },
            fail: function(err) {
                app.hideLoading();
                app.dialog({
                    content: err.errMsg || app.globalData.errMsgText
                });
            }
        });
    },
    renderPosts: function(list) {
        var that = this;
        that.setData({
            list: that.data.list.concat(list)
        });
    },
    // 用户选择收货地址
    chooseAddress: function() {
        var that = this;
        if (wx.chooseAddress) {
            wx.chooseAddress({
                success: function(res) {
                    // console.log(res);
                    that.setData({
                        // "userName": res.userName,
                        // "telNumber": res.telNumber,
                        "address": res.provinceName + res.cityName + res.countyName + res.detailInfo,
                        // "cityName": res.cityName,
                        // "countyName": res.countyName,
                        // "detailInfo": res.detailInfo,
                        // "postalCode": res.postalCode,
                        //具体收货地址显示
                        flag: false
                    })
                },
                fail: function(err) {
                    if (err.Msg != 'chooseAddress:fail cancel') {
                        app.dialog({
                            content: '授权失败，请删除小程序后再次进入重新授权！'
                        })
                    }
                }
            })
        } else {
            console.log('当前微信版本不支持chooseAddress');
        }
    },
    reload: function(args) {
        if (!args) {
            args = {};
        }
        var that = this;

        that.getPosts({
            success: function(param) {
                that.setData(resetData({
                    options: that.data.options,
                    contentReady: that.data.contentReady
                }));
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
    onReachBottom: function() {
        // this.getNextPage();
    },
    onShow: function() {
        var that = this;
        app.checkIsAuthorize({
            success: function() {
                if (!that.data.contentReady) {
                    that.reload({
                        showToastFlag: false
                    });
                }else{
                    that.reload({
                        showToastFlag: true
                    });
                }
            }
        });
    },
    onHide: function() {},
    onLoad: function(options) {
        var that = this;

        // // test code
        // options = {
        //     code: '7a566a469929cc89590de80161ed3e7e'
        // };
        that.setData({
            options: options
        });
        
    },
    onReady(){
        var that = this;
        wx.getSystemInfo({
              success:  function (res)  {
                  let windowHeight = res.windowHeight
                  setTimeout(() => {
                      var query = wx.createSelectorQuery();
                      query.select('#the-id').boundingClientRect().exec(function (res2) {
                          const { bottom, height } = res2[0]
                          that.setData({
                              scrollTopNum: bottom - windowHeight
                          })
                      })
                  }, 600)
              },
            })        
    },
    onShareAppMessage: function() {
        var that = this;
        var userInfo = wx.getStorageSync('user_info') || {};
        // var path = 'pages/details/details?code=' + that.options.code;
        var path = 'pages/index/index?code=' + that.options.code;
        if (that.data.mainInfo.status == 0) {
            path += '&is_share=1&from_unionid=' + userInfo.unionid;
        }
        return {
            title: '我在有好礼小程序看到了一个大宝贝',
            path: path,
            imageUrl: that.data.mainInfo.pic
        }
    },
    //修改倒计时
    modifyTimeHandle() {
        var that = this;
        app.api.requestHandle({
            url: app.api.stringifyUrl({
                path: '/wxapp/Index/testTask'
            }),
            data: {
                unionid: that.data.userInfo.unionid,
                code: that.data.options.code,
            },
            success: function(res) {
                // console.info(res);
                app.hideLoading();
                let data = res.data;
                if (data.status == 0) {
                    const {
                        time
                    } = data;
                    that.runCountdownTime(time);
                }

            },
            fail: function(err) {
                app.hideLoading();
                app.dialog({
                    content: err.errMsg || app.globalData.errMsgText
                });
            }
        });
    },
    // 获取我使用着的道具
    // useToolsArr
    getUsedTools(useTools_id=null){
        app.api.requestHandle({
            url: app.api.stringifyUrl({
                path: '/wxapp/Index/getUsedTools'
            }),
            data: {
                unionid: this.data.userInfo.unionid,
                code: this.data.options.code,
            },
            success: res => {
                // wx.hideLoading();
                let data = res.data;
                if (data.status == 0) {
                    this.setData({
                        // useToolsArr: data.data
                        'mainInfo.tools':data.data,
                        'mainInfo.useTools_id': useTools_id
                    })
                    setTimeout(()=>{
                        this.setData({
                            'mainInfo.useTools_id': null
                        })
                    },2000)
                } else {
                    wx.showToast({
                        title: data.msg || '出错了',
                        icon: 'none'
                    })
                }
            }
        });
    },
    //获取我的道具
    getMytools(state=true) {   //false
        // this.setData({
        //     propertyStatus:true
        // })
        // return;
        if(state){
            wx.showLoading({
                title: '加载中...',
            })
        }
        app.api.requestHandle({
            url: app.api.stringifyUrl({
                path: '/wxapp/Index/getMytools'
            }),
            data: {
                unionid: this.data.userInfo.unionid,
                code: this.data.options.code,
            },
            success: res => {
                wx.hideLoading();
                let data = res.data;
                if (data.status == 0) {
                    this.setData({
                        propertyList: data.data,
                        propertyStatus: true
                    })
                } else {
                    wx.showToast({
                        title: data.msg || '出错了',
                        icon: 'none'
                    })
                }
            }
        });
    },
    animationHandle(val1,val2){
        const { animationTop, animationBottom } = this.data;
        animationTop.top(val1).step();
        animationBottom.bottom(val2).step();
        this.setData({
            animationTopData: animationTop.export()
        })
        this.setData({
            animationBottomData: animationBottom.export()
        })
    },
    useToolsBefore(e){
        let animation = wx.createAnimation({
            transformOrigin: "50% 50%",
            duration: 500,
            timingFunction: "ease-in",
            delay: 0
        })
        let animation2 = wx.createAnimation({
            transformOrigin: "50% 50%",
            duration: 500,
            timingFunction: "ease-in",
            delay: 0
        })
        this.setData({
            animationTop: animation,
            animationBottom: animation2,
            bottomDigState: false
        })
        this.animationHandle('38%', 0);
        const {
            formId
        } = e.detail;
        const {
            tools_id
        } = e.currentTarget.dataset;

    
        let { useCount, Timer, timeCount } = this.data;
        useCount = useCount+1;
        this.setData({ useCount})
        if (useCount==1){
            setTimeout(()=>{
                this.useTools(formId, tools_id)
            },2000)
        }

    },
    //使用道具
    useTools(formId,tools_id) {        
        app.api.requestHandle({
            url: app.api.stringifyUrl({
                path: '/wxapp/Index/useTools'
            }),
            data: {
                unionid: this.data.userInfo.unionid,
                code: this.data.options.code,
                formId,
                tools_id,
                num: this.data.useCount
            },
            success: res => {
                let data = res.data;
                if (data.status == 0) {
                    wx.showToast({
                        title: '成功使用道具',
                        icon: 'success',
                        mask: true
                    })
                    this.getUsedTools(tools_id);
                    this.getMytools(false);
                    this.setData({
                        useState: true,
                        useCount:0
                    })
                } else {
                    wx.showToast({
                        title: data.msg || '出错了',
                        icon: 'none',
                        mask: true
                    })
                }
            }
        });
    },
    // 兑换道具接口
    exchangeTools(e) {
        const { formId } = e.detail;
        const { keycode } = e.detail.value;
        app.api.requestHandle({
            url: app.api.stringifyUrl({
                path: '/wxapp/Index/exchangeTools'
            }),
            data: {
                unionid: this.data.userInfo.unionid,
                code: this.data.options.code,
                formId,
                keycode
            },
            success: res => {
                let data = res.data;
                if (data.status == 0) {
                    this.setData({
                        exchangeStatus:false
                    })
                    wx.showToast({
                        title: '成功兑换道具',
                        icon: 'success',
                        mask: true
                    })
                    //获取我的道具
                    this.getMytools();
                } else {
                    wx.showToast({
                        title: data.msg || '出错了',
                        icon: 'none',
                        mask: true
                    })
                }
            }
        });
    },
    operCover(e){
        const { style } = e.currentTarget.dataset;
        if (style == 'getCodeIntro'){  //兑换码提示弹框
            this.setData({
                getCodeIntroStatus: !this.data.getCodeIntroStatus
            })
        } else if (style == 'exchange'){
            this.setData({
                exchangeStatus: !this.data.exchangeStatus
            })
        } else if (style == 'propertyList'){
            this.setData({
                propertyStatus: !this.data.propertyStatus,
                bottomDigState:true,
                useCount:0
            })
            if(this.animation){
                this.animationHandle('50%', '-330rpx');
            }
            
        }else if ( style == 'rule'){
            this.setData({
                swiperStatus: !this.data.swiperStatus
            })
        }
        
    },
    onPageScroll(res){
        const { scrollTopNum} = this.data;
        const { scrollTop } = res;
        console.log(res)
        console.log(scrollTopNum)
        if (scrollTop > scrollTopNum){
            // 播放动画
            console.log("播放动画")
        }
    }

});