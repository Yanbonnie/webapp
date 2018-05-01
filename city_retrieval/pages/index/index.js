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
    { "id": "v4", "cityName": "杭州" },
    { "id": "v9", "cityName": "海南" },
    { "id": "v8", "cityName": "张家口" }
];
let str = Sort.pySegSort(arr2);

let list = [{
    name: '小妮子',
    num: 53,
    content: '4s-广州每期雪弗兰广州每期雪弗兰广州每期雪弗兰'
}, {
    name: '小伙子',
    num: 13,
    content: '4s-广州每期雪弗兰广州每期雪弗兰广州每期雪弗兰'
}]
Page({
    data: {
        citylist: str,
        list
    },
    onLoad: function () {

    },
    cityTap(e) {
        console.log(e);
        const cityName = e.detail.cityname;
        wx.navigateBack();
    },
})
