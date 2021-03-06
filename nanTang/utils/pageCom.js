
const app = getApp();
const { key } = app.globalData;
import { URL, WXREQ } from './util';
const Promise = require('./es6-promise')
module.exports = {
    'comData': {
        'phoneList': [1, 2],
        'operState':false,
        'zanData': {  //点赞支付弹窗数据
            context: '您今天已经为商家点过赞了，你可购买以下产品为商家增加人气',
            btnArr: [{
                txt: '鲜花',
                price: 1
            }, {
                txt: '壁画',
                price: 6
            }, {
                txt: '装修',
                price: 18
            }],
            btnArr2: [{
              txt:'跑车',
              price:88
            },{
              txt:'别墅',
              price:188
            },{
              txt:'火箭',
              price:666
            }],
            btnArr2State:false,
            icon: 'zan',
            id: null,
            index: null,
            enter: ''
        },
        'operState2': true,
        'shopInfoData': {  //入驻支付弹窗数据
            context: '请选择你的信息服务周期',
            btnArr: [
                {
                    txt: '1个月',
                    price: 12
                },
                {
                    txt: '3个月',
                    price: 30,
                },
                {
                    txt: '12个月',
                    price: 100
                }
            ],
            icon: 'inShop',
            id: null,
        }
    },
    'methodsArr': {
        //获取电话列表
        getPhoneList(e) {
            const { id } = e.currentTarget.dataset;
            return new Promise((resolve, reject) => {
                WXREQ('GET', URL['getTel'], {
                    key,
                    id
                }, res => {
                    if (res.status == 0) {
                        resolve(res.data);
                    } else {
                        wx.showToast({
                          title: res.msg,
                            icon: 'none'
                        })
                    }
                })
            })
        },
        //点击拨打电话
        toggleActionsheet(e) {
            wx.showLoading({
                title: '获取中...',
            })
            this.getPhoneList(e).then(res => {
                wx.hideLoading();
                let telArr = [];
                for (let i = 0; i < res.tel.length; i++) {
                    telArr.push({
                        name: res.tel[i],
                        className: 'action-class',
                        loading: false
                    })
                }
                this.setData({
                    'baseActionsheet.actions': telArr,
                    'baseActionsheet.show': true
                })
            });
        },//选择电话号码
        _handleZanActionsheetBtnClick(res) {
            const { componentId, index } = res.currentTarget.dataset;
            const { actions } = this.data.baseActionsheet;
            wx.makePhoneCall({
                phoneNumber: actions[index].name,
                success: res => {
                  // 转发成功
                  WXREQ('POST', URL['postLogTel'], {
                    key,
                    unionid: app.globalData.userInfo.unionid,
                    tel: actions[index].name
                  }, res => {

                  })
                }
            })
        },
        //弹出层点击消失
        _handleZanActionsheetMaskClick() {
            this.setData({
                'baseActionsheet.show': false
            })
        },
        //点击查看查单
        lookMenu(e) {
            const { id } = e.currentTarget.dataset;
            wx.showLoading({
                title: '加载中...',
            })
            WXREQ('GET', URL['getPic'], {
                key,
                unionid: app.globalData.userInfo.unionid,
                id
            }, res => {
                if (res.status == 0) {
                    const { data } = res;
                    let urls = [];
                    for (let i = 0; i < data.length; i++) {
                        urls.push(data[i].pic)
                    }
                    //预览照片
                    wx.previewImage({
                        urls: urls, // 需要预览的图片http链接列表
                        success: res => {
                            wx.hideLoading()
                        }
                    })
                } else {
                    wx.showToast({
                        title: res.msg,
                        icon: 'none',
                        mask: true
                    })
                }
            })
        },
        //到达详情页
        goDetail(e) {
            const { id } = e.currentTarget.dataset;
            wx.navigateTo({
                url: `/pages/detail/detail?id=${id}`,
            })
        },
        //点赞
        zanHandle(e) {
            const { id, is_praise, enter, index } = e.currentTarget.dataset;
            if (app.globalData.is_pay_praise == 1) {  //支付点赞
                if (is_praise == 0) {  //第一次免费
                    this.postPraise(id, enter, index);
                } else {
                    this.setData({
                        operState: true,
                        'zanData.id': id,
                        'zanData.enter': enter,
                        'zanData.index': index ? index : ''
                    })
                }
            } else {
                if (is_praise == 1) return;
                this.postPraise(id, enter, index);
            }
        },
        //商家点赞接口
        postPraise(id, enter, index) {
            WXREQ('POST', URL['postPraise'], {
                key,
                unionid: app.globalData.userInfo.unionid,
                id
            }, res => {
                if (res.status == 0) {
                    if (enter == 'index') {  //首页点赞
                        this.zanUpdate(index, 1);
                    } else if (enter == 'detail') {  //详情页点赞
                        this.getShopDetails(id);
                    } else if (enter == 'search') {  //搜索页点赞
                        this.postSearch()
                    }

                } else {
                    wx.showToast({
                        title: res.msg,
                        icon: 'none'
                    })
                }
            })
        },
        //商家支付点赞接口
        payMoneyHandle(options) {
            let money = options.detail;
            let id = this.data.zanData.id;
            let enter = this.data.zanData.enter;
            wx.showLoading({
                title: '加载中...',
                mask: true
            })
            WXREQ('POST', URL['payPraise'], {
                key,
                id,
                unionid: app.globalData.userInfo.unionid,
                money
            }, res => {
                wx.hideLoading();
                const { appId, nonceStr, paySign, signType, timeStamp } = res.data;
                const package2 = res.data.package;
                if (res.status == 0) {
                    wx.requestPayment({
                        timeStamp,
                        nonceStr,
                        'package': package2,
                        signType,
                        paySign,
                        'success': res => {
                            this.setData({
                                operState: false
                            })
                            //支付成功
                            if (enter == 'index') {  //首页点赞
                                this.zanUpdate(this.data.zanData.index, money);
                            } else if (enter == 'detail') {  //详情页点赞
                                this.getShopDetails(id);
                            } else if (enter == 'search') {  //搜索页点赞
                                this.postSearch()
                            }

                        },
                        'fail': res => {
                        }
                    })
                } else {
                    wx.showToast({
                        title: res.msg,
                        mask: false,
                        icon: 'none'
                    })
                }

            })
        },
        //关闭弹框操作弹框
        closeHandle() {
            this.setData({
                operState: false
            })
        },
        //点赞展示更多
        showMoreHandle() {
            this.setData({
                'zanData.btnArr2State': !this.data.zanData.btnArr2State
            })
        },
        /**
     * 用户点击右上角分享
     */
        onShareAppMessage: function () {
            return {
                'title': '南塘生活圈',
                'path': '/pages/enter/enter',
                'imageUrl': '/assets/images/picture.jpeg',
                success: res => {
                    // 转发成功
                    WXREQ('POST', URL['postLogShare'], {
                        key,
                        unionid: app.globalData.userInfo.unionid,
                        page: '/pages/index/index'
                    }, res => {

                    })
                }
            }
        }
    }
}