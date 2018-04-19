// pages/business/business.js

const app = getApp();
let { key } = app.globalData;
import { URL, WXREQ, Config, Trim, Check } from '../../utils/util';
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
        },
        menuSrc:[],
        is_apply:null,   //是否入驻
        shopStatus:null, //商家状态   0待审核-待确认（不可点击） 1已通过-修改 2已过期-提交续期  -1已拒绝-重新提交
        shopId:null,     //商家id
        submitBtn:""
    },  

    /**
     * 生命周期函数--监听页面加载
     */
    onReady: function (options) {
        // wx.clearStorage({key:'business'})
    },
    //获取上家入驻信息接口
    getShopInfo(){
        return new Promise((resolve,reject)=>{
            WXREQ('GET', URL['getShopInfo'], {
                key,
                unionid: app.globalData.userInfo.unionid
            }, res => {
                if (res.status == 0) { 
                    this.setData({
                        is_apply: res.is_apply
                    })
                    if (res.is_apply == 1) {
                        const { menu_pic } = res;
                        const { name, logo, boss, mobile, tel, address, label, status, id } = res.data;
                        this.setData({
                            shopVal: name,
                            chargeVal: boss,
                            phoneVal: mobile,
                            phonesVal: tel,
                            addressVal: address,
                            labelVal: label,
                            'logo.src': logo.pic,
                            'logo.id': logo.file_id,
                            menuSrc: menu_pic,
                            shopId:id,
                            shopStatus: status
                        })
                    }
                    console.log(this.data)
                    resolve(res.is_apply)
                } else {
                    wx.showToast({
                        title: res.msg,
                        mask: true,
                        icon: 'none'
                    })
                }
            })
        })
    },
    //页面显示调取
    onShow(){
        this.init(); 
    },
    //离开页面保存信息
    onHide() {
        if (this.data.is_apply != 1) {  //没有入驻设置缓存
            const { shopVal, chargeVal, phoneVal, phonesVal, addressVal, labelVal, logo, menuSrc } = this.data;
            wx.setStorage({
                key: 'business',
                data: {
                    shopVal, chargeVal, phoneVal, phonesVal, addressVal, labelVal, logo, menuSrc
                }
            })
        }
    },
    //初始化项目
    init(){
        //获取本地缓存
        if (this.data.is_apply != 1) {  //未入驻
            wx.showLoading({
                title: '加载中...',
            })
            this.getShopInfo().then(res => {  //res - is_apply
                wx.hideLoading()
                this.setData({
                    is_apply: res
                })
                if (res == 0) {   //未入驻
                    wx.getStorage({
                        key: 'business',
                        success: res => {
                            let { addressVal, chargeVal, labelVal, logo, menuSrc, phoneVal, phonesVal, shopVal } = res.data;
                            this.setData({
                                addressVal, chargeVal, labelVal, logo, menuSrc, phoneVal, phonesVal, shopVal
                            })
                        }
                    })
                }
                this.shopStatusHandle();
            })
        } else {   //已入驻
            this.shopStatusHandle();
        }
    },
    shopStatusHandle(){
        if (this.data.shopStatus == 0) {
            this.setData({
                submitBtn: '待审核'
            })
        } else if (this.data.shopStatus == 1) {
            this.setData({
                submitBtn: '修改'
            })
        } else if (this.data.shopStatus == 2) {
            this.setData({
                submitBtn: '提交续期'
            })
        } else if (this.data.shopStatus == -1) {
            this.setData({
                submitBtn: '重新提交'
            })
        }else{
            this.setData({
                submitBtn: '提交'
            })
        }
    },    
    //点击提交按钮
    formSubmit(e){
        if (this.data.shopStatus == 0) return;
        let { address,charge,label,phone,phones,shop} = e.detail.value;
        let { id } = this.data.logo;
        let arr = ['商家名称不能为空','负责人不能为空','联系电话不能为空','联系电话格式不正确','外卖电话不能为空','地址不能为空','标签不能为空','请上传logo'];
        let index = null;
        let showToast = false;
        if (!Trim(shop)){
            index = 0;
            showToast = true;
        }else if(!Trim(charge)){
            index = 1;
            showToast = true;
        }else if (!Trim(phone)) {
            index = 2;
            showToast = true;
        }else if(!Check.isPhone(phone)){
            index = 3;
            showToast = true;
        }else if (!Trim(phones)) {
            index = 4; 
            showToast = true;
        }else if (!Trim(address)) {
            index = 5; 
            showToast = true;
        }else if (!Trim(label)) {
            index = 6; 
            showToast = true;
        }/*else if(!id){
            index = 7; 
            showToast = true;
        }*/else{
            showToast = false;
        }
        if(showToast){
            wx.showToast({
                title: arr[index],
                icon: "none",
                mask: true
            });
            return;
        }
        let objData = null;
        let link = '';
        if (this.data.shopStatus == 1){  //修改
            link = URL['setShopInfo']
            objData = { id: this.data.shopId };
            
        }else{  //提交
            link = URL['postShopInfo'];
            objData = {}
        }
        WXREQ('POST', link ,{
            key,
            unionid: app.globalData.userInfo.unionid,
            form_id:'fromId',
            name: shop,
            // logo:id,
            boss: charge,
            mobile: phone,
            tel: phones,
            address:address,
            label:label,
            ...objData
        },res=>{
            if(res.status == 0){
                wx.removeStorage({
                    key:'business'
                })
                wx.showToast({
                    title: '提交成功',
                    icon:'success',
                    mask:true
                })
                this.init();
            }else{
                wx.showToast({
                    title: '提交失败',
                    icon:'none',
                    mask:true
                })
            }
        })
        
    },
    //选择logo
    selectLogo(e){
        if (this.data.shopStatus == 0) return;
        let { fileid } = e.currentTarget.dataset;  //图片id
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: res=>{
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                let tempFilePaths = res.tempFilePaths;
                wx.showLoading({
                    title: '上传中...',
                    mask: true
                })
                if (fileid){
                    this.deleteFile(fileid).then(res=>{
                        //删除成功
                        this.uploadHandle(tempFilePaths[0], 'logo').then(res => {
                            wx.hideLoading();
                            let { file_id } = res;
                            this.setData({
                                'logo.id': file_id,
                                'logo.src': tempFilePaths[0]
                            })
                        })
                    })
                }else{
                    this.uploadHandle(tempFilePaths[0], 'logo').then(res => {
                        wx.hideLoading();
                        let { file_id } = res;
                        this.setData({
                            'logo.id': file_id,
                            'logo.src': tempFilePaths[0]
                        })
                        
                    })
                }
                
            }
        })
    },
    //选择菜单
    selectMenu(){
        if(this.data.shopStatus == 0) return;
        wx.chooseImage({
            success:res=> {
                let tempFilePaths = res.tempFilePaths;
                let arr = [];
                for(let i = 0 ; i < tempFilePaths.length ; i++){
                    arr.push(this.uploadHandle(tempFilePaths[i],'menu'))
                }
                wx.showLoading({
                    title: '上传中...',
                    mask: true
                })
                Promise.all(arr).then(resArr=>{
                    wx.hideLoading();
                    let menuSrcArr = this.data.menuSrc;
                    for (let j = 0; j < resArr.length; j++){
                        let { file_id } = resArr[j];
                        menuSrcArr.push({
                            pic: tempFilePaths[j],
                            file_id: file_id
                        })
                    }
                    this.setData({
                        menuSrc: menuSrcArr
                    })
                })
            }
        })
    },
    uploadHandle(tempFilePaths,style){/*  */      
        return new Promise((resolve,reject)=>{
            wx.uploadFile({
                url: Config.reqUrl + URL['uploadFile'],
                filePath: tempFilePaths,
                name: "file",
                formData: {
                    unionid: app.globalData.userInfo.unionid,
                    key,
                    'type': style
                },
                success: res => {                    
                    let { status, msg, file_id } = JSON.parse(res.data);
                    let resData = JSON.parse(res.data);
                    if (status == 0) {
                        resolve(resData)
                    } else {
                        wx.hideLoading();
                        wx.showToast({
                            title: msg ? msg : '上传失败',
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
    //删除图片
    deleteFile(file_id){
        const { unionid } = app.globalData.userInfo;
        return new Promise((resolve,reject)=>{
            WXREQ('post', URL['deleteFile'], {
                key,
                unionid,
                file_id
            }, res => {
                const { status, msg } = res;
                if (status == 0) {
                    resolve(res)
                } else {
                    wx.showToast({
                        title: msg ? msg : '失败',
                        icon: 'none',
                        mask: true
                    })
                }
            })
        })
    },
    menuPicDel(e){
        const {file_id} = e.currentTarget.dataset;
        this.deleteFile(file_id).then(res=>{
            wx.showToast({
                title: '删除成功',
                mask:'true',
                icon:'success'
            })
            wx.showLoading({
                title: '加载中...',
            })
            this.getShopInfo().then(res=>{
                wx.hideLoading();
            });
        })
    },
    bindinputHandle(e) {
        const { componentid } = e.currentTarget.dataset;
        const { value } = e.detail;
        switch (componentid) {
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