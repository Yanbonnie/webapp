// pages/move/move.js
import Sort from '../../../utils/city_sort'; //城市排序

const app = getApp();
const {
    globalData: {
        REQUEST
    }
} = app;
// const { chooseImgHandle, isPhone } = require('../../../utils/pageCom');
import pageCom from '../../../utils/pageCom';
import {
    dataCom,
    methodsCom
} from '../../../utils/submitCom';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        ...dataCom,
        editStatus: false,
        followState:false,
        reply: false,           //是否接收回复  true false
        is_company:0,           //我是公司用户  1 0
        is_pay:null,             //是否支付
        // bannerList: [],
        // is_binding: 0,
        // cityState: false,
        // insurance_data: '',
        // car_number: '',   //车牌号
        // car_type: '',     //车辆类型
        // proprietor: '',   //所有人
        // address: '',      //地址
        // insurance: '',     //选中保险
        // mobile: '',
        // code: '',
        // submitStatus: true,
        // time: 0,
        // codeStatus: true,
        // codeTxt: '获取验证码',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // console.log(this.data.insurance_data)  保险数据
        this.setData({
            is_binding: app.globalData.is_binding
        })
        const {
            is_binding
        } = app.globalData;
        this.getBannerFn('bind');
        if (is_binding) {
            this.getMyDetailedInfo();
            this.setData({
                canOper:false
            })
        }

    },
    ...pageCom,
    ...methodsCom,
    //提交绑定信息
    postApplyFn(e) {
        const {formId} = e.detail;
        console.log(e)
        const { accounts, password} = e.detail.value;
        const {
            car_number,
            car_type,
            proprietor,
            address,
            insurance,
            mobile,
            code,
            submitStatus,
            is_binding,
            isfollow,
            is_company
        } = this.data;
        if (!car_number || !car_type || !proprietor || !address || !insurance || !mobile || !code) {
            wx.showToast({
                title: '信息不完整',
                icon: 'none',
                mask: true
            })
            return;
        }
        if (is_company && (!accounts || !password)){
            wx.showToast({
                title: '信息不完整',
                icon: 'none',
                mask: true
            })
            return;
        }
        
        if (!submitStatus) return;
        this.setData({
            submitStatus: false
        })
        let url = '';
        if(is_binding){
            url ='resetUserInfo'
        }else{
            url ='post_binding'
        }
        wx.showLoading({
            title: '提交中...',
            mask: true
        })
        REQUEST('POST', url, {
            car_number,
            car_type,
            proprietor,
            address,
            insurance_code: insurance.code,
            mobile,
            code,
            formId,
            is_company,
            accounts: is_company ? accounts:'',
            password: is_company ? password:'',
            unionid: app.globalData.unionid
        },true).then(res => {
            this.setData({
                submitStatus: true,
                time: 0,
                codeStatus: true,
                codeTxt: '获取验证码',
                is_binding: 1
            })            
            app.globalData.is_binding = 1;
            wx.showToast({
                title: '提交成功',
                mask: true,
                icon: 'success'
            })
            setTimeout(() => {
                if (!isfollow) {
        wx.hideLoading();
                    wx.showModal({
                        title: '提示',
                        content: '没有关注公众号无法接收到挪车信息',
                        showCancel: false,
                        success:res2=>{
                            if(res2.confirm){
                                wx.switchTab({
                                    url: '/pages/user/index/index',
                                })
                            }
                        }
                    })
                }else{
        wx.hideLoading();
                    wx.switchTab({
                        url: '/pages/user/index/index',
                    })
                }
                
            }, 1500)
        }).catch(({msg})=>{
        wx.hideLoading();
            wx.showModal({
                title: '提示',
                content: msg,
                showCancel:false,
                success:res=>{
                    if (res.confirm){
                        this.setData({
                            submitStatus:true 
                        })
                    }
                }
            })
        })
    },
    //获取我的资料
    getMyDetailedInfo() {
        wx.showLoading({
            title: '加载中....',
            icon:'none',
            mask:true
        })
        REQUEST('get', 'getMyDetailedInfo', {
            unionid: app.globalData.unionid
        }).then(res => {
            wx.hideLoading()
            const {
                car_number,
                car_type,
                insurance_code,
                insurance_name,
                mobile,
                proprietor,
                wxheadpic,
                wxname,
                address
            } = res.userinfo || {};            
            this.setData({
                car_number,
                car_type,
                insurance:{
                    code:insurance_code,
                    cityName:insurance_name,
                },
                mobile,
                proprietor,
                address
            })
        })
    },
    //是否编辑
    editHandle(e) {
        const {
            is_binding
        } = this.data;
        const {
            index
        } = e.currentTarget.dataset;
        if (is_binding) {
            if (index == 1) {
                this.setData({
                    editStatus: true, 
                    canOper:true
                })
            } else {
                this.setData({
                    editStatus: false,
                    canOper: false
                })
            }
        } /*else {
            this.postApplyFn();
        }*/


    },
    //是否接收回复
    replyHandle() {
        let { isfollow, reply } = this.data;
        if (!isfollow) {  //未关注
            this.setData({
                followState: true
            })
        } else {
            reply = reply ? false : true;
            this.setData({
                reply
            })
        }

    },
    //关闭关注弹窗
    showEwm() {
        this.setData({ followState: false })
    },
    // 我是公司用户
    switchChange(e){
      this.setData({
        is_company:e.detail.value ? 1 : 0
      })
    }
})