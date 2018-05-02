//index.js
//获取应用实例
const app = getApp();
import qqmap from '../../utils/map.js';
import Sort from '../../utils/city_sort';   //城市排序
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
let str = Sort.pySegSort(arr2);

let list = [{
    id:1,
    name: '小妮子',
    num: 53,
    content: '4s-广州每期雪弗兰广州每期雪弗兰广州每期雪弗兰'
}, {
    id:2,
    name: '小伙子',
    num: 13,
    content: '4s-广州每期雪弗兰广州每期雪弗兰广州每期雪弗兰'
}]
Page({
    data: {
        citylist: str,
        list,
        locateCity:''
    },
    onLoad: function () {
        this.getAddress();
    },
    getAddress(){
        let cityOrTime = wx.getStorageSync('locatecity') || {},
            time = new Date().getTime(),
            city = '';
        if (!cityOrTime.time || (time - cityOrTime.time > 1800000)) {//每隔30分钟请求一次定位
            this.getLocate();
        } else {//如果未满30分钟，那么直接从本地缓存里取值
            this.setData({
                locateCity: cityOrTime.city
            })
        }
    },
    cityTap(e) {
        console.log(e);
        const cityName = e.detail.cityname;
        wx.navigateBack();
    },
    //到达联系页面
    selectItemHandle(e){
        console.log(e)
        wx.navigateTo({
            url: '/pages/contact/contact',
        })
    },
    //调用定位
    getLocate() {
        new qqmap().getLocateInfo().then(val => {//这个方法在另一个文件里，下面有贴出代码
            if (val.indexOf('市') !== -1) {//这里是去掉“市”这个字
                val = val.slice(0, val.indexOf('市'));
            }
            this.setData({
                locateCity: val
            });
            //把获取的定位和获取的时间放到本地存储
            wx.setStorageSync('locatecity', { city: val, time: new Date().getTime() });
        });
    }
})
