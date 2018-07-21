//我的申请页面和我的绑定页面
const app = getApp();
import Sort from './city_sort';
import { REQUEST } from './util';
let arr2 = [
    { "id": "v1", "cityName": "北京" },
    { "id": "v2", "cityName": "上海" },
    { "id": "v5", "cityName": "天津" },
    { "id": "v7", "cityName": "安徽" },
    { "id": "v3", "cityName": "呼和浩特" },
    { "id": "v4", "cityName": "杭州" },
    { "id": "v9", "cityName": "海南" },
    { "id": "v8", "cityName": "张家口" }
];
let citylist = Sort.pySegSort(arr2);
module.exports = {
    dataCom:{
        bannerList: [],
        is_binding: 0,
        cityState: false,
        insurance_data: citylist,
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
    },
    methodsCom:{
        //获取首页数据
        getBannerFn() {
            REQUEST('GET', 'get_banner', {
                unionid: app.globalData.unionid,
                page_type: 2
            }).then(res => {
                let { bannerList, is_binding, insurance_data } = res;
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
                    bannerList,
                    is_binding,
                    insurance_data
                })
            })
        },
        //图片识别
        chooseFn(e) {
            this.chooseImgHandle(e).then(res => {
                console.log(res)
                const { car_number, car_type, proprietor } = res.data;
                this.setData({
                    car_number, car_type, proprietor
                })
            })
        },
        //显示保险公司
        showBaoXian() {
            console.log("显示保险公司")
            this.setData({
                cityState: true
            })
        },
        //选择地址
        cityTap(e) {
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
        getMsgCodeFn() {
            console.log("获取二维码")
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
                    codeStatus: false
                })
                this.countDown();
            })
        },
        //验证码倒计时
        countDown() {
            let { time, codeTxt, codeStatus } = this.data;
            if (time > 1) {
                time = time - 1;
                codeTxt = `获取验证码(${time}s)`;
                this.setData({ time, codeTxt })
                this.countDown();
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
        },
    }
}