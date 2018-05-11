// pages/manage/uploadCert/uploadCert.js

import { REQUEST, uploadFile, ShowToast } from '../../../utils/request.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        license: '',            //营业执照
        license_file_id: null,
        idcard_main: '',        //身份证正面图片
        idcard_main_file_id: null, 
        idcard_back: '',        //身份证反面图片
        idcard_back_file_id: null,

        shop_id:'',           //商家ID
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const { shop_id } = options;
        this.setData({
            shop_id
        })
    },
    //上传资料
    uploadData(e) {
        const style = e.currentTarget.dataset.type;
        let { fileid } = e.currentTarget.dataset;  //图片id
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: res => {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                let tempFilePaths = res.tempFilePaths;
                wx.showLoading({
                    title: '上传中...',
                    mask: true
                })
                if (fileid) {
                    //先删除，后添加
                    REQUEST('POST','deleteFile',{
                        file_id: fileid
                    },0).then(res=>{
                        uploadFile({
                            tempFilePath: tempFilePaths[0],
                            'type': style
                        }).then(res=>{
                            this.HandleUpload(res);
                        })
                    })
                } else {
                    uploadFile({
                        tempFilePath: tempFilePaths[0],
                        'type': style
                    }).then(res => {
                        this.HandleUpload(res);
                    })
                }
            }
        })
    },
    //上传处理
    HandleUpload(res){
        let { file_id, url } = res;
        if (style == 'license') {
            this.setData({
                license_file_id: file_id,
                license: url
            })
        } else if (style == 'idcard_main') {
            this.setData({
                idcard_main_id: file_id,
                idcard_main: url
            })
        } else {
            this.setData({
                idcard_back_file_id: file_id,
                idcard_back: url
            })
        }
    },
    //证书上传接口
    postCredentials(){
        const { shop_id, license, idcard_main, idcard_back} = this.data;
        if (!license && !idcard_main && !idcard_back){
            ShowToast('请提交以上两种材料的其中一个');
            return;
        }
        if(!license){
            if (!idcard_main || !idcard_back){
                ShowToast('身份证信息不完整');
                return;
            }
        }
        wx.showLoading({
            title: '上传中...',
            icon:'none',
            mask:true
        })
        REQUEST('POST','postCredentials',{
            shop_id,
            license,
            idcard_main,
            idcard_back
        }).then(res=>{
            //回到商家页
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})