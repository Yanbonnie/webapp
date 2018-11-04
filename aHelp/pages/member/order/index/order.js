// pages/member/order.js
const app = getApp();
const { globalData:{REQUEST} } = app;
const { formatTime } = require('../../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        serverTime: [['11月4日', '11月5日'], ['14:00', '15:00', '16:00', '17:00', '18:00']],
        tool: ["QQ", "Teamviewer"],
        timeValue:[],    //时间        
        toolValue:null,  //服务工具
        address:'',      //地址
        ordernum:'',     //快递单号
        message:'',      //留言
        orderList:[],    //故障列表
        selectIndex:0,   //0-远程服务 1-上门维修 2-送店维修 3-现场服务
        tipArr:["请提供QQ远程或者Teamviewer ID、密码给维修工程师",'请填写详细的上门地址和联系电话','请寄送到指定的维修地点，自付快递费用','请在上班期间，送到指定的维修地点'],
        orderState:false,    //故障列表弹框展示状态
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            orderList: app.globalData.orderList
        })  
    },
    // 处理时间
    operTime(){
        
    },
    // 选择维修方式
    selectWayHandle(e){
        const { way } = e.currentTarget.dataset;
        this.setData({ selectIndex: way})
    },
    // 选择服务时间
    bindMultiPickerChange({detail:{value}}){
        this.setData({
            timeValue:value
        })
    },
    // 选择服务工具
    bindselectorChange({detail:{value}}){
        this.setData({
            toolValue:value
        })
    },
    // 选择地址
    chooseAddressHandle(){
        wx.chooseAddress({
            success:res=> {
                console.log(res)
                this.setData({
                    address: `${res.userName}:${res.telNumber},地址:${res.cityName}${res.countyName}${res.detailInfo}`
                })
            }
        })
    },
    // 重新选择
    againSelect(){
        wx.navigateBack({
            delta:1
        })
    },
    //关闭列表弹框
    operOrderHandle(){
        const { orderState } = this.data;
        this.setData({
            orderState: !orderState
        })
    },
    // 确定维修
    formSubmit(e){
        const { address, ordernum, message } = e.detail.value;
        wx.redirectTo({
            url:'/pages/member/order/success/success'
        })
    }
})