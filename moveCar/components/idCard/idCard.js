// components/idCard/idCard.js
const { Config,URL,REQUEST } = require('../../utils/util.js');
const app = getApp();
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        idCardStatus: Boolean,

    },

    /**
     * 组件的初始数据
     */
    data: {
        id_pic:''  
    },

    /**
     * 组件的方法列表
     */
    methods: {
        closeIdCard() {
            this.triggerEvent('idCardStatus', false);
        },
        uploadImg() {
            wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success:res => {
                    // tempFilePath可以作为img标签的src属性显示图片
                    const tempFilePaths = res.tempFilePaths;
                    this.setData({ id_pic: tempFilePaths[0]});
                    wx.showLoading({
                        title: '上传中...',
                        mask:true
                    })
                    this.uploadHandle(tempFilePaths[0]).then(upres=>{
                        wx.showToast({
                            title: '上传成功',
                        })
                        this.setData({ id_pic: upres.id_pic})
                    });
                }
            })
        },
        // 上传图片封装
        uploadHandle(tempFilePaths) {/*  */
            return new Promise((resolve, reject) => {
                wx.uploadFile({
                    url: Config.reqUrl + URL['uploadIdCard'],
                    filePath: tempFilePaths,
                    name: "file",
                    formData: {
                        unionid: app.globalData.unionid
                    },
                    success: res => {
                        wx.hideLoading();
                        let { status, msg, file_id } = JSON.parse(res.data);
                        let resData = JSON.parse(res.data);
                        if (status == 0) {
                            resolve(resData)
                        } else {                            
                            wx.showToast({
                                title: msg ? msg : '上传失败',
                                icon: 'none',
                                mask: true
                            })
                            this.setData({
                                'id_pic': ''
                            })
                        }
                    },
                    fail: err => {
                        console.log('aaaaaaaaaaaa')
                        wx.showToast({
                            icon: 'none',
                            mask: true,
                            title: '服务器出错了',
                        })
                    },
                    complete:function(err,sufn){
                        if(err){
                            wx.showToast({
                                icon: 'none',
                                mask: true,
                                title: '服务器出错了',
                            })
                        }
                    }
                })
            })

        },
        // 提交身份证信息
        postIdcardHandle(e) {
            const { id_num, id_name } = e.detail.value;
            const { id_pic } = this.data;
            if(!id_num || !id_name || id_pic){
                wx.showToast({
                    title: '信息提交不完整',
                    mask:true
                })
                return;
            }
            wx.showLoading({
                title: '提交中...',
                mask:true
            })
            REQUEST('POST', 'postIdcard', {
                id_num,
                id_name,
                id_pic,
                unionid: app.globalData.unionid,
            }).then(res => {
                wx.hideLoading();
                this.triggerEvent('idCardSuccess', true);
                wx.showToast({
                    title: '提交成功',
                    mask:true
                })
                
            })
        },
    }
})