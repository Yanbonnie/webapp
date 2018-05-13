const app = getApp();
import { URL, WXREQ } from './util';
const Promise = require('./es6-promise');
const key = app.globalData.key;
//返回结果公共函数
const comResponse = function(res,hideLoad){  //hideLoad 为 1 需要关闭loading
    if(hideLoad == 1){
        wx.hideLoading();
    }
    if (res.status == 0) {
        resolve(res)
    } else {
        wx.showToast({
            title: res.msg,
            icon: 'none',
            mask: true
        })
    }
}
//图片上传
const uploadFile = function(options,hideLoad = 1){
    /*options = {
        type,
        tempFilePath,
    }*/
    return new Promise((resolve, reject) => {
        wx.uploadFile({
            url: Config.reqUrl + URL['uploadFile'],
            filePath: options.tempFilePath,
            name: "file",
            formData: {
                unionid: app.globalData.userInfo.unionid,
                key,
                'type': options.type
            },
            success: res => {
                let { status, msg } = JSON.parse(res.data);
                let resData = JSON.parse(res.data);
                if (status == 0) {
                    resolve(resData)
                }else{
                    wx.hideLoading();
                    wx.showToast({
                        title: msg ? msg : '上传失败',
                        icon: 'none',
                        mask: true
                    })
                }
            }
        })
    })
}
const REQUEST = (method, url, options = {}, hideLoad = 1) => {   //hideLoad为1表示隐藏加载弹层，为0不隐藏
    return new Promise((resolve, reject) => {
        /*let data = {
            key,
            ...options
        }
        console.log(data)*/
        WXREQ(method, URL[url], {
            key,
            unionid:app.globalData.userInfo.unionid,
            ...options
        },res=>{
            if (hideLoad == 1) {
                wx.hideLoading();
            }
            if (res.status == 0) {
                resolve(res)
            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    mask: true
                })
            }
        })
    })
}

const ShowToast = function(txt,icon="none",mask=true){
    wx.showToast({
        title: txt,
        icon,
        mask
    })
}

module.exports = {
    uploadFile,
    REQUEST,
    ShowToast
}