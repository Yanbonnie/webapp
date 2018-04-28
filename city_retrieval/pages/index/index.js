//index.js
//获取应用实例
const app = getApp()
import Sort from '../../utils/city_sort';   //城市排序
let arr2 = [
    { "id": "v1", "cityName": "北京" },
    { "id": "v2", "cityName": "上海" },
    { "id": "v5", "cityName": "天津" },
    { "id": "v7", "cityName": "安徽" },
    { "id": "v3", "cityName": "呼和浩特" },
    { "id": "v4", "cityName": "包头" },
    { "id": "v9", "cityName": "海南" },
    { "id": "v8", "cityName": "张家口" }
];
let str = Sort.pySegSort(arr2);
Page({
    data: {
        citylist: str,
    },
    onLoad: function () {

    },
    cityTap(e) {
        console.log(e);
        const cityName = e.detail.cityname;
        wx.navigateBack();
    },
})
