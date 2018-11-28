// pages/member/order.js
const app = getApp();
const {
    globalData: {
        REQUEST
    }
} = app;
const {
    formatTime
} = require('../../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        serverTime: [],
        tool: ["QQ", "Teamviewer"],
        timeValue: [], //时间        
        toolValue: null, //服务工具
        address: '', //地址
        ordernum: '', //快递单号
        message: '', //留言
        orderList: [], //故障列表
        selectIndex: 1, //1-远程服务 2-上门维修 3-送店维修 4-现场服务
        tipArr: ["", "请提供QQ远程或者Teamviewer ID、密码给维修工程师", '请填写详细的上门地址和联系电话', '请寄送到指定的维修地点，自付快递费用', '请在上班期间，送到指定的维修地点'],
        orderState: false, //故障列表弹框展示状态
        agreeState: false,
        storeaddressArr:[],
        storeaddress:[],
        storeaddressVal:0,
        mobile:"",         //手机号码
        keyinCode:'',      //验证码
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            orderList: app.globalData.orderList
        })
        this.setData({
            'serverTime[0]': this.getDay(30).map(item => item.time),
            'serverTime[1]': this.getHour(new Date().getTime()).map(item => item.time)
        })
        console.log(this.data.serverTime)
        this.getstoreaddress();
    },
    // 获取店铺位置
    getstoreaddress() {
        REQUEST({
            url:'getstoreaddress',
        }).then(res=>{
            let storeaddress = res.data.map(item=>item.address)
            this.setData({ storeaddressArr: res.data, storeaddress})
        })
    },
    // 店铺修改
    bindstoreChange({
        detail: {
            value
        }
    }){
        this.setData({ storeaddressVal:value})
    },
    // 选择维修方式
    selectWayHandle(e) {
        const {
            way
        } = e.currentTarget.dataset;
        this.setData({
            selectIndex: way
        })
    },
    // 选择服务时间
    bindMultiPickerChange({
        detail: {
            value
        }
    }) {
        if (!value[1]) {
            value[1] = 0;
        }
        this.setData({
            timeValue: value
        })
    },
    // 选择服务时间日期
    columnchangeHandle({
        detail: {
            value
        }
    }) {
        this.setData({
            'serverTime[1]': this.getHour(new Date(this.data.serverTime[0][value]).getTime()).map(item => item.time)
        })
    },
    // 选择服务工具
    bindselectorChange({
        detail: {
            value
        }
    }) {
        this.setData({
            toolValue: value
        })

    },
    // 选择地址
    chooseAddressHandle() {
        wx.chooseAddress({
            success: res => {
                console.log(res)
                this.setData({
                    address: `${res.userName}:${res.telNumber},地址:${res.cityName}${res.countyName}${res.detailInfo}`
                })
            }
        })
    },
    // 重新选择
    againSelect() {
        wx.navigateBack({
            delta: 1
        })
    },
    //关闭列表弹框
    operOrderHandle() {
        const {
            orderState
        } = this.data;
        this.setData({
            orderState: !orderState
        })
    },
    //监听联系方式输入
    bindMobileInput(e){
        const { value } = e.detail;
        this.setData({
            mobile:value
        })
    },
    //监听验证码方式输入
    bindCodeInput(e) {
        const { value } = e.detail;
        this.setData({
            keyinCode: value
        })
    },
    getCodeHandle(e){
        const { mobile } = this.data;
        if(!mobile){
            wx.showToast({
                icon: 'none',
                title: '请输入手机号码',
            })
            return;
        }
        if (!this.isPhone(mobile)) {            
            wx.showToast({
                icon:'none',
                title: '手机号码格式不正确',
            })
            return;
        }
        wx.showLoading({
            title: '发送中,请注意查收',
        })
        REQUEST({
            method: 'post',
            url: 'sendsms',
            data: {
                mobile
            }
        }).then(res => {
            wx.hideLoading();
        })
    },
    isPhone: function (str) {  //判断是否是正确的手机
        if (typeof str === 'number') {
            str = str.toString();
        }
        return /^0?1[3|4|5|7|8][0-9]\d{8}$/.test(str);
    },
    //验证手机真是性
    // updatesmsHandle(){
    //     const { mobile, keyinCode} = this.data;
        
        
    // },
    // 确定维修
    formSubmit(e) {
        const {
            address,
            ordernum,
            message,
            keyinCode
        } = e.detail.value;
        const {
            selectIndex,
            serverTime,
            timeValue,
            toolValue,
            orderList,
            storeaddressVal,
            storeaddress,
            mobile
        } = this.data;

        if (selectIndex != 3) {
            if (timeValue.length == 0) {
                wx.showToast({
                    title: '请选择时间',
                    mask: true,
                    icon: "none"
                })
                return;
            }
        } else if (selectIndex == 1) {
            if (!toolValue) {
                wx.showToast({
                    title: '请选择远程服务工具',
                    mask: true,
                    icon: "none"
                })
                return;
            }
        } else if (selectIndex == 2) {
            if (address == '') {
                wx.showToast({
                    title: '请填写详细的上门地址',
                    mask: true,
                    icon: "none"
                })
                return;
            }
        } else if (selectIndex == 3) {
            if (ordernum == '') {
                wx.showToast({
                    title: '请填写快递单号',
                    mask: true,
                    icon: "none"
                })
            }
        }
        if (!mobile) {
            wx.showToast({
                icon: 'none',
                title: '请输入手机号码',
            })
            return;
        }
        if (!this.isPhone(mobile)) {
            wx.showToast({
                icon: 'none',
                title: '手机号码格式不正确',
            })
            return;
        }
        if (!keyinCode) {
            wx.showToast({
                icon: 'none',
                title: '请输入验证码',
            })
            return;
        }

        let reqData = {}
        let serviceTime = serverTime[0][timeValue[0]] + " " + serverTime[1][timeValue[1]];
        let serviceTools_id = Number(toolValue) + 1;
        switch (selectIndex) {
            case "1":
                reqData = {
                    serviceTime,
                    serviceTools_id
                }
                break;
            case "2":
                reqData = {
                    serviceTime,
                    serviceAddress: address
                }
                break;
            case "3":
                reqData = {
                    trackingNumber: ordernum,
                    storeAddress: storeaddressVal
                }
                break;
            case "4":
                reqData = {
                    serviceTime,
                    storeAddress: storeaddressVal
                }
                break;
            default:
                break;
        }
        let item = orderList.map(item => item.id);
        wx.showLoading({
            title: '提交中....',
            mask: true
        })
        REQUEST({
            method: 'post',
            url: 'updatesms',
            data: {
                mobile,
                keyinCode
            }
        }).then(res => {
            REQUEST({
                method: 'post',
                url: 'createorders',
                data: {
                    unionId: app.globalData.unionid, //必填
                    item, //必填
                    serviceType_id: selectIndex, //必填
                    orderStatus: '1', //必填
                    message,
                    mobile,
                    // finalPrice,
                    ...reqData
                }
            }).then(res => {
                wx.hideLoading();
                wx.redirectTo({
                    url: `/pages/member/order/success/success?id=${res.id}`
                })

            })
        })
    },
    // 显示隐藏用户协议弹框
    operAgreementBox() {
        const {
            agreeState
        } = this.data;
        this.setData({
            agreeState: !agreeState
        })
    },
    //获取时间
    getDay(dayNum) {
        if (!dayNum) {
            return []
        }
        var oDate = new Date();
        var dayArr = [{
            // time: '今天' + oDate.getFullYear() + '-' + (oDate.getMonth()) + '-' + (oDate.getDate()),
            time: oDate.getFullYear() + '-' + (oDate.getMonth()) + '-' + (oDate.getDate()),
            number: oDate.getTime()
        }];
        for (var i = 1; i < dayNum; i++) {
            //dayArr.push(new Date(oDate.getFullYear(), oDate.getMonth(), oDate.getDate() + i));   //把未来几天的时间放到数组里
            var nextDate = new Date(oDate.getFullYear(), oDate.getMonth(), oDate.getDate() + i);
            var time = {}
            if (i == 1) {
                time = {
                    // time: '明天' + oDate.getFullYear() + '-' + (nextDate.getMonth()) + '-' + (nextDate.getDate()),
                    time: oDate.getFullYear() + '-' + (nextDate.getMonth()) + '-' + (nextDate.getDate()),
                    number: nextDate.getTime()
                }
            } else {
                time = {
                    time: oDate.getFullYear() + '-' + (nextDate.getMonth()) + '-' + (nextDate.getDate()),
                    number: nextDate.getTime()
                }
            }
            dayArr.push(time)
        }
        console.log(dayArr);
        return dayArr;
    },
    //获取小时
    getHour(date, sTime, eTime) {
        if (!date) {
            return []
        }
        date = parseInt(date);
        sTime = parseInt(sTime) || 10;
        eTime = parseInt(eTime) || 22;
        var oDate = new Date();
        var hourArr = [];

        function isToday(str) {
            return (new Date(str).toDateString() === new Date().toDateString()) ? true : false;
            // (new Date(str) < new Date()) //小于今天
        }
        if (isToday(date)) {
            sTime = oDate.getHours() + 2;
            hourArr.push({
                time: '尽快到达',
                number: new Date().getTime()
            });
        }
        for (var i = sTime; i <= eTime; i++) {
            var time = new Date(date);
            var forTime = new Date(time.getFullYear(), time.getMonth(), time.getDate(), i, 0).getTime();
            hourArr.push({
                time: i + ':00',
                number: forTime
            });
        }
        return hourArr;
    }
})