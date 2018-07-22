//我的申请页面和我的绑定页面
const app = getApp();
import Sort from './city_sort';
import { REQUEST } from './util';
let arr2 = [
    { "code": "1", "cityName": "平安银行" },
    { "code": "2", "cityName": "中国人寿" }
];
let citylist = Sort.pySegSort(arr2);
module.exports = {
    dataCom:{
        bannerList: [],
        is_binding: 0,
        cityState: false,
        insurance_data: [],
        car_number: '',   //车牌号
        car_type: '',     //车辆类型
        proprietor: '',   //所有人
        address: '',      //地址
        insurance: '',     //选中保险
        mobile: '',
        code: '',
        submitStatus: true,
        time: 0,
        codeStatus: true,
        codeTxt: '获取验证码',
        canOper:true,     //是否可以操作
    },
    methodsCom:{
        //获取首页数据
        getBannerFn() {
            REQUEST('GET', 'get_banner', {
                unionid: app.globalData.unionid,
                page_type: 1
            }).then(res => {
                let { banner_data, is_binding, insurance_data } = res;
                //改造数据
                insurance_data = insurance_data.map(item => {
                    return {
                        ...item,
                        cityName: item.name
                    }
                })
                //字母排序
                insurance_data = Sort.pySegSort(insurance_data);
                this.setData({
                    bannerList:banner_data,
                    is_binding,
                    insurance_data
                })
                
            })
        },
        //图片识别
        chooseFn(e) {
            const { canOper } = this.data;
            if (!canOper) return;
            const { way } = e.currentTarget.dataset;
            this.chooseImgHandle(e).then(res => {
                console.log(res)
                const { car_number, car_type, proprietor,address } = res.data;
                this.setData({
                    car_number, car_type, proprietor
                })
                if(way == 'bind'){
                    this.setData({
                        address
                    })
                }
            })
        },
        //显示保险公司
        showBaoXian() {
            console.log("显示保险公司")
            const { canOper} = this.data;
            if (!canOper) return;
            this.setData({
                cityState: true
            })
        },
        //选择地址
        cityTap(e) {
            const { canOper } = this.data;
            if (!canOper) return;
            const { city } = e.detail;
            this.setData({
                insurance: city,
                cityState: false
            })
        },
        //关闭地址选择
        closeCityHandle() {
            this.setData({
                cityState: false
            })
        },
        //选择邮寄地址
        selectAddress() {
            const { canOper } = this.data;
            if (!canOper) return;
            wx.chooseAddress({
                success: res => {
                    console.log(res)
                    const { provinceName, cityName, countyName, detailInfo } = res;
                    this.setData({
                        address: provinceName + cityName + countyName + detailInfo
                    })
                }
            })
        },
        //获取二维码
        getMsgCodeFn() {
            const { mobile, codeStatus } = this.data;
            if (!codeStatus) return;
            if (!mobile) {
                wx.showToast({
                    title: '请输入手机号码',
                    mask: true,
                    icon: 'none'
                })
                return;
            }
            if (!this.isPhone(mobile)) {
                wx.showToast({
                    title: '手机号码格式不正确',
                    mask: true,
                    icon: 'none'
                })
                return;
            }
            REQUEST('GET', 'get_msgcode', {
                mobile,
                unionid: app.globalData.unionid
            }).then(res => {
                this.setData({
                    time: 60,
                    codeStatus: false,
                    code:res.code
                })
                this.countDown();
            })
        },
        //验证码倒计时
        countDown() {
            let { time, codeTxt, codeStatus } = this.data;
            console.log("开始倒计时")
            if (time > 1) {
                time = time - 1;
                codeTxt = `获取(${time}s)`;
                this.setData({ time, codeTxt })
                setTimeout(()=>{
                    this.countDown();
                },1000)
            } else {
                time = 0;
                codeTxt = '获取验证码',
                    codeStatus = true;
                this.setData({
                    time,
                    codeTxt,
                    codeStatus
                })
            }
            console.log(this.data.time)
        }
    }
}