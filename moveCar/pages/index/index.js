// pages/index/index.js
// let imgUrls = ['../../assets/images/banner.jpg', '../../assets/images/banner.jpg'];
import qqmap from '../../utils/map.js';
const app = getApp();
const { globalData: { REQUEST } } = app;
const { chooseImgHandle, changeNav } = require('../../utils/pageCom');
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
        car_number: '',        //车牌号码
        reason: '',            //原因
        scene_pic: '',         //照片地址
        address: '',           //地址
        reply: false,           //是否接收回复  true false
        submitStatus:true,      //是否可以提交
        serverState:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    changeNav,    //监听导航栏切换
    // onTabItemTap(item){
    //     console.log(item)
    // },
    //获取首页数据
    getBannerFn(){
        REQUEST('GET','get_banner',{
            openid:app.globalData.openid,
            page_type: 2
        }).then(res=>{
            const { bannerList,is_binding } = res;
            this.setData({
                bannerList,
                is_binding
            })
        })
    },
    //图片识别
    chooseImgHandle,  
    chooseFn(){
        this.chooseImgHandle(2).then(res=>{
            console.log(res)
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
        wx.showLoading({
            title: '定位中...',
            icon:'none',
            mask:true
        })
        new qqmap().getLocateInfo().then(val => {//这个方法在另一个文件里，下面有贴出代码
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
        });
    },
    //是否接收回复
    replyHandle(){
        let { reply } = this.data;
        console.log(reply)
        reply = reply ? false : true;
        this.setData({
            reply
        })
    },
    //提交我要挪车接口
    PostMoveCarFn(){
        const { car_number, reason, scene_pic, address, reply, submitStatus} = this.data;
        if (!car_number && !reason && !scene_pic && !address){
            wx.showToast({
                title: '请填写完整信息',
                mask:true,
                icon:'none'
            })
            return;
        }
        wx.showLoading({
            title: '提交中...',
            mask:true
        })
        if (!submitStatus) return;
        this.setData({
            submitStatus:false
        })
        REQUEST('POST', 'post_move_car', { car_number, reason, scene_pic, address, reply ,openid:app.globalData.openid}).then(res=>{
            wx.hideLoading();
            this.setData({
                submitStatus: true
            })
            wx.showToast({
                title: '提交成功',
                mask:true,
                icon: 'success'

            })
            setTimeout(()=>{
                wx.navigateTo({
                    url: '/pages/user/record/record',
                })
            },1500)
        })
    },
    operServerCover(e){
        const { index } = e.currentTarget.dataset;
        this.setData({
            serverState:index ==1 ? true : false
        })
    }
})