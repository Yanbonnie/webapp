// pages/index/index.js
// let imgUrls = ['../../assets/images/banner.jpg', '../../assets/images/banner.jpg'];
import qqmap from '../../utils/map.js';
const app = getApp();
const { globalData: { REQUEST } } = app;
const { chooseImgHandle, changeNav, codeInputChange, mobileInputChange, isPhone, onShareAppMessage } = require('../../utils/pageCom');
import {
    methodsCom
} from '../../utils/submitCom';
const { getMsgCodeFn } = methodsCom
Page({

    /**
     * 页面的初始数据
     */

    data: {
        // imgUrls: imgUrls,
        navIndex:0,
        reasonList: ['1.车辆影响他人出行', '2.车辆占用他人车位', '3.车辆停放影响营业', '4.车辆停放影响施工','5.在禁止停车点停放','6.车辆没关门窗车灯','7.车辆的报警器误鸣','8.天气恶劣提醒车主移车'],
        index:-1,
        bannerList:[],
        is_binding: 0,         //绑定状态，1为已绑定，0为未绑定，未绑定⽤用户⽆无权点击 其他⻚页⾯面，只能进入绑定页面
        is_verify_phone:0,    
        isfollow:false,            //是否关注
        car_number: '',        //车牌号码
        reason: '',            //原因
        scene_pic: '',         //照片地址
        address: '',           //地址
        reply: false,           //是否接收回复  true false
        submitStatus:true,      //是否可以提交
        serverState:false,
        followState:false,      //是否关注
        callState:false,        //拨打电话状态
        callUrl:'',            //立即拨打
        code:'',
        time: 0,
        mobile:'',
        codeStatus: true,
        codeTxt: '获取验证码',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // this.setData({
        //     is_binding:0
        // })
        // app.globalData.is_binding = 0;  //判断用户是否绑定
        this.getBannerFn();
        // this.getLocate();
        
    },    
    onShow(){
      this.setData({
        submitStatus: true
      })
    },
    changeNav,    //监听导航栏切换
    mobileInputChange,
    codeInputChange,   //code值改变
    getMsgCodeFn,
    isPhone,
    onShareAppMessage,
    //获取首页数据
    getBannerFn(){
        wx.showLoading({
            title: '加载中...',
            icon:'none',
            mask:true
        })
        REQUEST('GET','get_banner',{
            unionid: app.globalData.unionid,
            page_type: 2
        }).then(res=>{
            wx.hideLoading();
            const { banner_data, is_binding, is_verify_phone, isfollow } = res;
            this.setData({
                bannerList:banner_data,
                is_binding,
                is_verify_phone: is_verify_phone ? is_verify_phone : '',
                isfollow:isfollow || 0,
                reply:isfollow || false
            })
            app.globalData.is_binding = is_binding; 
        })
    },
    //图片识别
    chooseImgHandle,  
    chooseFn(e){
        this.chooseImgHandle(e).then(res=>{
            const { car_number, scene_pic } = res.data;
            this.setData({
                car_number, scene_pic
            })
        })
    }, 
    //挪车原因选择
    bindPickerChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        const { reasonList } = this.data;
        this.setData({
            reason: reasonList[e.detail.value].split('.')[1]
        })
    },
    //调用定位（选择地址）
    getLocate() {
        wx.chooseLocation({
            success: res => {
                this.setData({
                    address: res.address
                })
            }
        })
        /*new qqmap().getLocateInfo().then(val => {//这个方法在另一个文件里，下面有贴出代码
            wx.hideLoading();
            this.setData({
                address:val
            })
        }).catch(res => {
            wx.hideLoading();
            wx.showToast({
                title: '定位失败',
                mask:true,
                icon:'none'
            })
        });*/
    },
    //是否接收回复
    replyHandle(){
        let { reply } = this.data;
        REQUEST('get','getSubscribe',{
            unionid: app.globalData.unionid
        }).then(({ subscribe })=>{
            this.setData({
                isfollow: subscribe ? true : false
            })
            let { isfollow } = this.data;
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
        })       
        
    },
    // 绑定手机成功的时候就提交挪车
    bindPhone(e){
        
        const { formId } = e.detail;
        const { mobile, code, car_number, reason, scene_pic, address, reply, submitStatus, isfollow, is_verify_phone} = this.data;
        if (!submitStatus) return;
        if (car_number == '' || reason == '' || scene_pic == '' || address == '') {
            wx.showToast({
                title: '请填写完整信息',
                mask: true,
                icon: 'none'
            })
            return;
        }

        if (!is_verify_phone){  //没有绑定手机号
            if (!this.isPhone(mobile)) {
                wx.showToast({
                    title: '手机号码格式不正确',
                    mask: true,
                    icon: 'none'
                })
                return;
            }
            if (!code) {
                wx.showToast({
                    title: '验证码不能为空',
                    mask: true,
                    icon: 'none'
                })
                return;
            }

            wx.showLoading({
                title: '提交中...',
                mask: true
            })
            if (!submitStatus) return;
            this.setData({
                submitStatus: false
            })
            // 先绑定手机
            REQUEST('POST', 'bindPhone', {
                mobile,
                code,
                unionid: app.globalData.unionid
            },true).then(res => {
                this.setData({
                    is_verify_phone: 1
                })
                this.PostMoveCarFn(formId);
            }).catch(err=>{
                this.setData({
                    submitStatus: true
                }) 
                wx.showToast({
                    icon: 'none',
                    mask: true,
                    title: err.msg || '请求失败'
                })
            })
        }else{ //绑定了手机号
            wx.showLoading({
                title: '提交中...',
                mask: true
            })
            if (!submitStatus) return;
            this.setData({
                submitStatus: false
            })
            this.PostMoveCarFn(formId);
        }
        
    },
    //提交我要挪车接口
    PostMoveCarFn(formId){
        const { car_number, reason, scene_pic, address, reply, submitStatus, isfollow} = this.data;
        if (car_number == ''  ||  reason == '' || scene_pic == '' || address == ''){
            wx.showToast({
                title: '请填写完整信息',
                mask:true,
                icon:'none'
            })
            return;
        }        
        REQUEST('POST', 'post_move_car', { car_number, reason, scene_pic, address, reply, formId,unionid: app.globalData.unionid}).then(res=>{
            wx.hideLoading();
            // this.setData({
            //     submitStatus: true                
            // })     
            wx.showToast({
                title: '提交成功',
                mask:true,
                icon: 'success'
            })
            setTimeout(()=>{
                this.setData({
                    callUrl: res.url,
                    callState:true
                })          
            },1500)
        })
    },
    operServerCover(e){
        const { index } = e.currentTarget.dataset;
        this.setData({
            serverState:index ==1 ? true : false
        })
    },
    //立即拨打
    callHandle(){
        wx.showLoading({
            title: '请稍等',
            mask:true
        })
        const { car_number } = this.data;
        REQUEST('POST','callMobile',{
            unionid:app.globalData.unionid,
            car_number
        }).then(res=>{
            wx.hideLoading();
            wx.setData({
              callState:false
            })
            // wx.navigateTo({
            //     url: '/pages/user/record/record',
            // })
        })
    },
    //关闭拨打电话弹窗
    closeCallCover(){
        this.setData({
            callState:false
        })
        wx.navigateTo({
            url: '/pages/user/record/record',
        }) 
    },
    //关闭关注弹窗
    showEwm(){
        this.setData({ followState:false})
    }
})