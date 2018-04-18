// pages/business/business.js

const app = getApp();
let { key } = app.globalData;
import { URL, WXREQ, Config } from '../../utils/util';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        shop: { title: '商家', type: 'input', placeholder: '请输入商家名称', componentId: "shop" },
        shopVal: '',
        charge: { title: '负责人', type: 'input', placeholder: '请输入负责人姓名', componentId: "charge" },
        chargeVal: '',
        phone: { title: '联系电话', type: 'input', placeholder: '请输入联系电话', componentId: 'phone' },
        phoneVal: '',
        phones: { title: '外卖电话', type: 'input', placeholder: '请输入外卖号码用,分隔多个', componentId: 'phones' },
        phonesVal: '',
        address: { title: '地址', type: 'input', placeholder: '请输入地址', componentId: 'address' },
        addressVal: '',
        label: { title: '标签', type: 'input', placeholder: '请输入标签便于用户搜索', componentId: 'label' },
        labelVal: '',
        logo:{
            src:'',
            id:''
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onReady: function (options) {
        
    },
    formSubmit(e){
        console.log(e)
    },
    //选择logo
    selectLogo(){
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: res=>{
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                let tempFilePaths = res.tempFilePaths;
                this.uploadHandle(tempFilePaths,'logo').then(res=>{
                    let { file_id } = res;
                    this.setData({
                        'logo.id': file_id,
                        'logo.src': tempFilePaths[0]
                    })
                })
            }
        })
    },
    //选择菜单
    selectMenu(){
        wx.chooseImage({
            success: function(res) {
                let tempFilePaths = res.tempFilePaths;
            }
        })
    },
    uploadHandle(tempFilePaths,style){/*  */
        wx.showLoading({
            title: '上传中...',
            mask:true
        })
        return new Promise((resolve,reject)=>{
            wx.uploadFile({
                url: Config.reqUrl + URL['uploadFile'],
                filePath: tempFilePaths[0],
                name: "file",
                formData: {
                    unionid: app.globalData.userInfo.unionid,
                    key,
                    'type': style
                },
                success: res => {
                    wx.hideLoading();
                    let { status, msg, file_id } = JSON.parse(res.data);
                    let resData = JSON.parse(res.data);
                    if (status == 0) {
                        resolve(resData)
                    } else {
                        wx.showToast({
                            title: msg ? msg : '',
                            icon: 'none',
                            mask: true
                        })
                        this.setData({
                            'logo.src': ''
                        })
                    }
                }
            })
        })
        
    },
    /*submitInput() {
        console.log(this.data)
    },*/
    _handleZanFieldChange(e) {
        const { componentId } = e.currentTarget.dataset;
        const { value } = e.detail;
        switch (componentId) {
            case 'shop':
                this.setData({
                    shopVal: value
                })
                break;
            case 'charge':
                this.setData({
                    chargeVal: value
                })
                break;
            case 'phone':
                this.setData({
                    phoneVal: value
                })
                break;
            case 'phones':
                this.setData({
                    phonesVal: value
                })
                break;
            case 'address':
                this.setData({
                    addressVal: value
                })
                break;
            case 'label':
                this.setData({
                    labelVal: value
                })
                break;
            default:
                break;

        }
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})