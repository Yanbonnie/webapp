//获取应用实例
var app = getApp();
var rangeDefaultText = '请联系发布者微信索取礼品';

function resetData(args) {
    if (!args) {
        args = {};
    }
    return {
        options: args.options || {},
        canIUseOpenShare: wx.canIUse('button.open-type.share'),
        defaultImage: app.defaultImage,

        is_public: 1,
        goods_type: 1,
        goods_type_list: ['现金红包', '实物'],
        draw_type: 1,
        draw_type_list: ['现场领取', '快递邮寄'],

        pic_thumb_url: '',
        name: '',
        synopsis: '',
        wxname: '',
        max_depth: '',
        prize_num: '',
        money: '',
        forecast_num: '',
        range: rangeDefaultText,

        submitDone: false,

        coverData: {}
    }
}

Page({
    data: resetData(),
    bindGoodsTypeChange: function(e) {
        var that = this;
        var value = parseInt(e.detail.value) + 1;
        this.setData({
            goods_type: value,
            pic_thumb_url: '',
            name: '',
            synopsis: '',
            wxname: '',
            max_depth: '',
            prize_num: '',
            money: '',
            forecast_num: '',
            draw_info: rangeDefaultText
        })
        // console.log('goods_type:', this.data.goods_type)
    },
    bindCheckTypeChange: function(e) {
        var value = parseInt(e.detail.value) + 1;
        this.setData({
            draw_type: value
        });
        // console.log('draw_type:', this.data.draw_type)
    },
    //上传图片
    tapChooseImage: function(event) {
        var that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
                if (!res || !res.tempFilePaths || !res.tempFilePaths.length) {
                    return;
                }

                var tempFilePaths = res.tempFilePaths;

                app.showLoading({
                    title: '请稍后'
                });
                wx.uploadFile({
                    url: app.api.stringifyUrl({
                        path: '/wxapp/Index/uploadFile'
                    }),
                    filePath: tempFilePaths[0],
                    name: 'file',
                    formData: {
                        key: app.api.appKey,
                        unionid: app.globalData.userInfo.unionid || ''
                    },
                    success: function(res) {
                        app.hideLoading();
                        var data = JSON.parse(res.data);
                        if (data.status != 0) {
                            app.dialog({
                                content: data.msg || '图片上传失败，请稍候再试'
                            });
                            return;
                        }
                        that.setData({
                            pic_thumb_url: data.pic,
                            coverData: data
                        })
                        // console.log(data)
                    },
                    fail: function(err) {
                        app.hideLoading();
                        app.dialog({
                            content: '图片上传失败，请稍候再试'
                        });
                    }
                })

            }
        })
    },
    tapTextareaFocus: function(event) {
        var keyname = event.currentTarget.dataset.keyname;
        var data = {};
        data[keyname + '_focus'] = true;
        this.setData(data);
    },
    textareaInput: function(event) {
        var keyname = event.currentTarget.dataset.keyname;
        var value = event.detail.value;
        this.data[keyname] = value;
    },
    textareaBlur: function(event) {
        var keyname = event.currentTarget.dataset.keyname;
        var value = event.detail.value;
        var data = {};
        data[keyname] = value;
        // data[keyname + '_focus'] = false;
        this.setData(data);
        // console.log('textareaBlur==',data)
    },
    switchChange: function(e) {
        var that = this;
        if (e.detail.value) {
            that.setData({
                is_public: 1
            });
        } else {
            that.setData({
                is_public: 0
            });
        }
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
                        that.toDetail();
                    }
                });
            },
            'fail': function(err) {
                wx.showToast({
                    title: err.errMsg || '支付失败，请稍后再试！',
                    icon: 'none',
                    success: function() {
                        that.toDetail();
                    }
                });
            }
        });
    },
    getPayTask: function (args){
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
    postCreat: function(args) {
        var that = this;
        args.url = app.api.stringifyUrl({
            path: '/wxapp/Index/postTask'
        });
        args.method = 'POST';
        app.api.requestHandle(args);
    },
    submitPostBy1: function (ajaxParam){
        var that = this;
        app.showLoading({
            title: '请稍后'
        });
        that.postCreat({
            data: ajaxParam,
            success: function(res) {
                app.hideLoading();
                var data = res.data;
                if (!data || typeof data === 'string') {
                    app.dialog({
                        content: app.globalData.errMsgText
                    });
                    return;
                }
                if (data.status != 0) {
                    app.dialog({
                        content: data.msg || app.globalData.errMsgText
                    });
                    return;
                }

                var code = data.code;
                wx.setStorageSync('new_code', code);
                that.getPayTask({
                    money: ajaxParam.money,
                    code: data.code
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
    submitPostBy2: function (ajaxParam){
        var that = this;
        app.showLoading({
            title: '请稍后'
        });
        that.postCreat({
            data: ajaxParam,
            success: function(res) {
                // console.info(res);
                app.hideLoading();
                var data = res.data;
                if (!data || typeof data === 'string') {
                    app.dialog({
                        content: app.globalData.errMsgText
                    });
                    return;
                }
                if (data.status != 0) {
                    app.dialog({
                        content: data.msg || app.globalData.errMsgText
                    });
                    return;
                }
                
                var code = data.code;
                wx.setStorageSync('new_code', code);
                that.toDetail();
            },
            fail: function(err) {
                app.hideLoading();
                app.dialog({
                    content: err.errMsg || app.globalData.errMsgText
                });
            }
        });
    },
    formSubmit: function(event) {
        var that = this;
        var data = app.common.extend(true, {}, event.detail.value || {});
        var reg = /^\s+$/ig;
        data.form_id = event.detail.formId;
        data.name = that.data.name;
        data.synopsis = that.data.synopsis;
        data.wxname = that.data.wxname;
        data.max_depth = that.data.max_depth;
        data.is_public = that.data.is_public;
        data.pic = that.data.coverData.pic;
        data.thumbnail = that.data.coverData.thumbnail;
        data.draw_info = that.data.coverData.draw_info;

        // test code
        // data.money = that.data.money;
        // data.forecast_num = that.data.forecast_num;
        // console.log(data);
        // return;

        if(!data.pic || reg.test(data.pic)){
                app.dialog({
                    content: '请上传图片！',
                    success: function (){

                    }
                });
                // that.scrollToTarget('#content');
                return;
        }
        if (!data.name || reg.test(data.name)) {
            app.dialog({
                content: '礼品名称不能为空！',
                success: function() {
                    that.setData({
                        name_focus: true
                    });
                }
            });
            // that.scrollToTarget('#title');
            return;
        }
        if (!data.synopsis || reg.test(data.synopsis)) {
            app.dialog({
                content: '礼品详情不能为空！',
                success: function() {
                    that.setData({
                        synopsis_focus: true
                    });
                }
            });
            // that.scrollToTarget('#content');
            return;
        }

        if (!data.wxname || reg.test(data.wxname)) {
            app.dialog({
                content: '发布者信息不能为空！',
                success: function() {
                    that.setData({
                        wxname_focus: true
                    });
                }
            });
            // that.scrollToTarget('#content');
            return;
        }
        if (!data.max_depth || reg.test(data.max_depth)) {
            app.dialog({
                content: '最大深度不能为空！',
                success: function() {
                    that.setData({
                        max_depth_focus: true
                    });
                }
            });
            // that.scrollToTarget('#content');
            return;
        }

        if (!data.prize_num || reg.test(data.prize_num)) {
            app.dialog({
                content: '礼品总数不能为空！',
                success: function() {
                    that.setData({
                        prize_num_focus: true
                    });
                }
            });
            return;
        }

        if (that.data.goods_type == 1) {
            data.money = that.data.money;
            if (!data.money || reg.test(data.money)) {
                app.dialog({
                    content: '礼品金额不能为空！',
                    success: function() {
                        that.setData({
                            money_focus: true
                        });
                    }
                });
                return;
            }
            app.confirm({
                title: '提示',
                content: '确认发布吗？',
                success: function() {
                    that.submitPostBy1(data);
                }
            });
        }

        if (that.data.goods_type == 2) {
            data.forecast_num = that.data.forecast_num;
            if (!data.forecast_num || reg.test(data.forecast_num)) {
                app.dialog({
                    content: '预计参与人数不能为空！',
                    success: function() {
                        that.setData({
                            forecast_num_focus: true
                        });
                    }
                });
                return;
            }


            if (that.data.draw_type == 1) {
                data.draw_info = that.data.draw_info;
                if (!data.draw_info || reg.test(data.draw_info)) {
                    app.dialog({
                        content: '领奖提示不能为空！',
                        success: function() {
                            that.setData({
                                forecast_num_focus: true
                            });
                        }
                    });
                    return;
                }
            }



            app.confirm({
                title: '提示',
                content: '确认发布吗？',
                success: function() {
                    that.submitPostBy2(data);
                }
            });
        }

    },
    toDetail: function() {
        var that = this;
        var code = wx.getStorageSync('new_code');
        if(!code){
            return;
        }
        
        // 清空表单
        that.setData(resetData());

        // 先跳首页
        wx.switchTab({
            url: '/pages/index/index',
            success: function (){
                // 放到首页数据刷新后回调跳转了
                // // 转详情
                // wx.navigateTo({
                //     url: '/pages/details/details?code=' + code
                // });
            }
        });
    },
    scrollToTarget: function(id) {
        var query = wx.createSelectorQuery();
        query.select(id).boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec(function(res) {
            app.pageScrollTo({
                scrollTop: res[0].top + res[1].scrollTop
            });
            query = null;
        });
    },
    onShow: function() {
        var that = this;

        app.checkIsAuthorize({
            success: function(){
                // code body
            }
        });
    },
    onHide: function() {
    },
    onLoad: function(options) {
    }
})