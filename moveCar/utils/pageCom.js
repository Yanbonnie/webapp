import {
    REQUEST
} from './util';
import Sort from './city_sort'; //城市排序
const app = getApp();
module.exports = {
    chooseImgHandle(e) {
        return new Promise((resolve, reject) => {
            let {
                page_type
            } = e.currentTarget.dataset;
            page_type = Number(page_type);
            wx.chooseImage({
                count: 1,
                sizeType: ['compressed'],
                success: res => {
                    const {
                        tempFilePaths
                    } = res;
                    wx.showLoading({
                        title: '识别中...',
                        mask: true,
                        icon: 'none'
                    })
                    wx.uploadFile({
                        url: `https://car.jc5588.cn/index.php/wxapp/index/post_uploadpic?unionid=${app.globalData.unionid}&page_type=${page_type}`,
                        filePath: tempFilePaths[0],
                        name: 'file',
                        success: res => {
                            var res2 = JSON.parse(res.data);
                            if (res2.status == 0) {
                                wx.hideLoading();
                                resolve(res2);
                            } else {
                                wx.showToast({
                                    icon: 'none',
                                    mask: true,
                                    title: res2.msg || '识别失败，请重试',
                                })
                            }
                        }
                    })
                },
            })
        })
    },
    isPhone(str) {
        if (typeof str === 'number') {
            str = str.toString();
        }
        return /^0?1[3|4|5|7|8][0-9]\d{8}$/.test(str);
    },
    //监听导航栏切换
    changeNav(e) {
        const {
            index
        } = e.detail;
        const {
            navIndex,
            is_binding
        } = this.data;
        console.log(is_binding)
        if (index == navIndex) return;
        if (index == 1) {
            if (is_binding) {
                wx.redirectTo({
                    url: '/pages/apply/apply'
                })
            } else {
                wx.showModal({
                    title: '提示',
                    content: '抱歉,您未绑定不能申请,请先绑定',
                    confirmText: '去绑定',
                    success: res => {
                        if (res.confirm) {
                            console.log('用户点击确定')
                            wx.navigateTo({
                                url: '/pages/user/info/info',
                            })
                        } else if (res.cancel) {
                            console.log('用户点击取消')
                        }
                    }
                })
            }

        } else if (index == 2) {
            wx.redirectTo({
                url: '/pages/user/index/index'
            })
        } else {
            wx.redirectTo({
                url: '/pages/index/index'
            })
        }
    },
    //监听code值变化
    codeInputChange(e) {
        const {
            value
        } = e.detail;
        this.setData({
            code: value
        })
    },
    //监听手机号码变化
    mobileInputChange(e) {
        // console.log(e)
        const {
            value
        } = e.detail;
        this.setData({
            mobile: value
        })
    },
    onShareAppMessage: function () {
        let shareUrl = encodeURIComponent(`/pages/index/index?friend_unionid=${app.globalData.unionid}`);
        let enterUrl = `/pages/enter/enter?share_query=${shareUrl}`;
        return {
            title: '我要分享一个好东西',
            path: enterUrl
        }
    },
    //关闭信息框
    closeIdCardHandle() {
      this.setData({
        idCardStatus: false
      })
    },
}