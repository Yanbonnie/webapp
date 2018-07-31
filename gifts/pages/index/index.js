//获取应用实例
var app = getApp();

function resetData(args) {
    if(!args){
        args = {};
    }

    return {
        contentReady: args.contentReady || false,
        canIUseOpenShare: wx.canIUse('button.open-type.share'),
        defaultImage: app.defaultImage,
        page: 1,
        loadMoreLock: false,
        loadMoreStart: null,
        loadMoreEndingText: null,
        list: []
    }
}

Page({
    data: resetData(),
    bindDetail: function(event) {
        var code = event.currentTarget.dataset.code;
        wx.navigateTo({
            url: '/pages/details/details?code=' + code
        });
    },
    tapAvatar: function (event){
        var that = this;
        var idx = event.currentTarget.dataset.idx;
        var list = that.data.list;
        var url = list[idx].avatar || app.defaultImage.avatar;
        wx.previewImage({
            current: url,
            urls: [url]
        })
    },
    avatarOnError: function (){
        var that = this;
        var idx = event.currentTarget.dataset.idx;
        var list = that.data.list;
        var data = {};
        data['list[' + idx + '].avatar'] = app.defaultImage.avatar;
        that.setData(data);
    },
    // 加载更多异常处理
    loadMoreUnusual: function(text) {
        this.setData({
            loadMoreLock: false,
            loadMoreStart: false,
            loadMoreEndingText: text
        });
    },
    // 加载更多结束处理
    loadMoreEndingText: function(text) {
        this.setData({
            loadMoreLock: true,
            loadMoreStart: false,
            loadMoreEndingText: text
        });
    },
    // 帖子头像加载失败
    avatarOnError: function(event) {
        var that = this;
        var idx = event.currentTarget.dataset.idx;
        var list = that.data.list;
        var data = {};
        data['list[' + idx + '].avatar'] = app.defaultImage.avatar;
        that.setData(data);
    },
    // 帖子封面加载失败
    posterOnError: function(event) {
        var that = this;
        var idx = event.currentTarget.dataset.idx;
        var list = that.data.list;
        var data = {};
        data['list[' + idx + '].cover'] = app.defaultImage.frontCover;
        that.setData(data);
    },
    // 帖子小封面加载失败
    msgarrPicOnError: function(event) {
        var that = this;
        var idx = event.currentTarget.dataset.idx;
        var cIdx = event.currentTarget.dataset.cIdx;
        var list = that.data.list;
        var item = list[idx]['contents'][cIdx];
        var data = {};
        data['list[' + idx + '].contents[' + cIdx + '].url_thumb'] = app.defaultImage.badPicture;
        that.setData(data);
    },
    // 点击用户头像或用户名
    // tapAvatar: function(event) {
    //     var authorid = event.currentTarget.dataset.uid;
    //     wx.navigateTo({
    //         url: '/pages/moments/moments?id=' + authorid
    //     })
    // },
    // 获取贴子列表接口
    getList: function(args) {
        args.url = app.api.stringifyUrl({
            path: '/wxapp/Index/getTaskList' 
            // method: 'micro_get_home'
        });
        app.api.requestHandle(args);
    },
    getPostsFail: function(msg, param, fail) {
        typeof fail === 'function' && fail();

        var that = this;
        if (param.page == 1) {
            that.loadMoreEndingText(msg || app.globalData.errMsgText);
        } else {
            app.dialog({
                content: msg || app.globalData.errMsgText
            });
            that.loadMoreUnusual('上拉加载');
        }
    },
    getPostsSuccess: function(param, list, pageCount) {
        var that = this;

        if (!list.length && param.page == 1) {
            that.setData({
                showGuide: true
            });
            that.loadMoreEndingText('暂无内容');
        } else {
            that.renderPosts(list);

            if (param.page >= pageCount) {
                that.loadMoreEndingText('已经到底了');
            } else {
                that.setData({
                    loadMoreStart: false,
                    loadMoreEndingText: '上拉加载'
                });
            }
        }
    },
    getPosts: function(args) {
        var that = this;
        var param = args.param;
        var success = args.success;
        var fail = args.fail;

        if (args.showToastFlag) {
            app.showLoading({
                title: '请稍候'
            })
        }

        var queryData = {
            page: param.page
        };

        that.setData({
            loadMoreLock: true
        });
        // console.log(param.page);
        that.getList({
            data: queryData,
            success: function(res) {
                app.hideLoading();
                that.setData({
                    contentReady: true,
                    loadMoreLock: false
                });

                var data = res.data;

                if (!data || typeof data === 'string') {
                    that.getPostsFail(null, param, fail);
                    return;
                }

                if (data.status != 0) {
                    that.getPostsFail(data.msg, param, fail);
                    return;
                }

                typeof success === 'function' && success(param);

                var list = data.data || [];
                // console.log(list);
                that.getPostsSuccess(param, list, data.page_count);
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
    getNextPage: function() {
        var that = this;
        var loadMoreLock = that.data.loadMoreLock;
        var page = that.data.page;
        if (!loadMoreLock) {
            that.setData({
                loadMoreStart: true,
                loadMoreEndingText: null
            });
            that.getPosts({
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
    renderPosts: function(list) {
        var that = this;
        that.setData({
            list: that.data.list.concat(list)
        });
    },
    reload: function(args) {
        var that = this;

        if (!args) {
            args = {};
        }

        that.getPosts({
            showToastFlag: args.showToastFlag,
            param: {
                page: 1
            },
            success: function(param) {
                that.setData(resetData({
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
        this.getNextPage();
    },
    onShow: function() {
        var that = this;

        app.checkIsAuthorize({            
            success: function(){
                if(that.data.contentReady){
                    var newCode = wx.getStorageSync('new_code');
                    // 如果有新帖
                    if(newCode){
                        wx.removeStorageSync('new_code');
                        that.reload({
                            showToastFlag: true,
                            success: function (){
                                // 转详情
                                wx.navigateTo({
                                    url: '/pages/details/details?code=' + newCode
                                });
                            }
                        });
                    }
                } else {
                    that.reload({
                        showToastFlag: true
                    });
                }
            }
        });
    },
    onHide: function (){
    },
    onLoad: function(options) {   
        //到详情页面
        if (options.code){  
            const { code, from_unionid, is_share}=options;
            if (is_share){
                console.log("跳转1")
                    wx.navigateTo({
                        url: `/pages/details/details?code=${code}&is_share=${is_share}&from_unionid=${from_unionid}`,
                    })
            }else{
                console.log("跳转2")
                    wx.navigateTo({
                        url: `/pages/details/details?code=${code}`,
                    })
            }
        }
        // 标记渠道
        app.markChannel({
            channel: options.channel
        });
    },
    onShareAppMessage: function() {
        return {
            imageUrl: app.globalData.shareCover,
            title: app.globalData.shareTitleByHome,
            path: app.globalData.sharePath
        }
    }
});
