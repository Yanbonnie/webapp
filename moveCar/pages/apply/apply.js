// pages/move/move.js
import Sort from '../../utils/city_sort';   //城市排序
let imgUrls = ['../../assets/images/banner.jpg', '../../assets/images/banner.jpg'];
let arr2 = [
    { "id": "v1", "cityName": "北京" },
    { "id": "v2", "cityName": "上海" },
    { "id": "v5", "cityName": "天津" },
    { "id": "v7", "cityName": "安徽" },
    { "id": "v3", "cityName": "呼和浩特" },
    { "id": "v4", "cityName": "杭州" },
    { "id": "v9", "cityName": "海南" },
    { "id": "v8", "cityName": "张家口" },
    { "id": "v8", "cityName": "张家口" },
    { "id": "v8", "cityName": "张家口" },
    { "id": "v8", "cityName": "张家口" },
    { "id": "v8", "cityName": "张家口" },
    { "id": "v8", "cityName": "张家口" },
    { "id": "v8", "cityName": "张家口" },
    { "id": "v8", "cityName": "张家口" },
    { "id": "v8", "cityName": "张家口" },
    { "id": "v8", "cityName": "张家口" },
    { "id": "v8", "cityName": "张家口" },
    { "id": "v8", "cityName": "张家口" },
    { "id": "v8", "cityName": "张家口" },
    { "id": "v8", "cityName": "张家口" },
    { "id": "v8", "cityName": "张家口" },
    { "id": "v8", "cityName": "张家口" },
    { "id": "v8", "cityName": "张家口" },
    { "id": "v8", "cityName": "张家口" },
    { "id": "v8", "cityName": "张家口" },
    { "id": "v8", "cityName": "张家口" },
    { "id": "v8", "cityName": "张家口" },
    { "id": "v8", "cityName": "张家口" },
    { "id": "v8", "cityName": "张家口" },
    { "id": "v8", "cityName": "张家口" },
    { "id": "v8", "cityName": "张家口" },
    { "id": "v8", "cityName": "张家口" },
    { "id": "v8", "cityName": "张家口" },
    { "id": "v8", "cityName": "张家口" },
];
let citylist = Sort.pySegSort(arr2);
Page({

  /**
   * 页面的初始数据
   */
  data: {
      imgUrls: imgUrls,
      citylist: citylist,
      cityState:false,
      insurance:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  getCityData(key) {
      REQUEST('GET', 'getCity', { key }).then(res => {
          console.log(res)
          let Data = res.data.map(item => {
              return {
                  ...item,
                  cityName: item.name
              }
          })
          let citylist = Sort.pySegSort(Data);
          this.setData({ citylist })
      })
  },
  showBaoXian(){
      this.setData({
          cityState:true
      })
  },
  //选择地址
  cityTap(e) {
      const {city} = e.detail;
      this.setData({
          insurance: city.cityName,
          cityState: false
      })
    //   wx.setStorageSync('locatecity', { city: cityName, time: new Date().getTime() });
  },
  //关闭地址选择
  closeCityHandle() {
      this.setData({
          cityState: false
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})