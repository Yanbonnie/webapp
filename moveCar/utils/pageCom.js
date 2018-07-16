import { REQUEST } from './util';
import Sort from './city_sort';   //城市排序
const app = getApp();
console.log(app)
module.exports = {
    chooseImgHandle(e){
        return new Promise((resolve,reject)=>{
            wx.chooseImage({
                count: 1,
                sizeType: ['compressed'],
                success: res => {
                    const { tempFilePaths } = res;
                    REQUEST('POST','post_uploadpic',{
                        openid: app.globalData.openid
                    }).then(res=>{
                        resolve(res)
                    })
                },
            })
        })
    },
}