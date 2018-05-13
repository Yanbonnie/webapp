// pages/manage/operaClassify/operaClassify.js
import { comData, methodsArr } from '../../../../utils/pageCom';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: '',
        descript: '',
        name: '',
        num: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    ...methodsArr,
    onLoad: function (options) {
        const { id } = options;
        if (id) {
            this.setData({ id })
            wx.setNavigationBarTitle({
                title: '编辑分类',
            })
            this.getEditClassification();
        } else {
            wx.setNavigationBarTitle({
                title: '新增分类',
            })
        }
    },
    //获取商家分类信息
    getEditClassification() {
        wx.showLoading({
            title: '加载中...',
            mask: true
        })
        REQUEST('GET', 'getEditClassification', { id }).then(res => {
            const { name, descript } = res
            this.setData({
                name,
                descript
            })
        })
    },
    //保存分类
    saveClassify() {
        const { id, name, descript } = this.data;
        wx.showLoading({
            title: '提交中...',
            mask: true
        })
        if (id) {  //修改
            REQUEST('POST', 'postEditClassification', {
                id, name, descript
            }).then(res => {
                wx.navigateBack({
                    delta: 1
                })
            })
        } else {  //新增
            REQUEST('POST', 'postAddClassification', {
                name, descript
            }).then(res => {
                wx.navigateBack({
                    delta: 1
                })
            })
        }
    },
    //删除
    delClassify(){
        const {id} = this.data;
        wx.showLoading({
            title: '删除中...',
            mask: true
        })
        REQUEST('GET','getDelClassification',{
            id
        }).then(res=>{
            wx.navigateBack({
                delta: 1
            })
        })
    },
    //监听描述输入框
    textareaInput(e) {
        const { value } = e.detail;
        this.setData({
            descript: value,
            num: value.length
        })
    },
    //监听分类名称输入框
    nameChange(e){
        const { value } = e.detaill;
        this.setData({
            name:value
        })
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