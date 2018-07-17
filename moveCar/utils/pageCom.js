import { REQUEST } from './util';
import Sort from './city_sort';   //城市排序
const app = getApp();
module.exports = {
    chooseImgHandle(page_type){
        return new Promise((resolve,reject)=>{
            wx.chooseImage({
                count: 1,
                sizeType: ['compressed'],
                success: res => {
                    const { tempFilePaths } = res;
                    wx.showLoading({
                        title: '识别中...',
                        mask:true,
                        icon:'none'
                    })
                    REQUEST('POST','post_uploadpic',{
                        openid: app.globalData.openid,
                        page_type: page_type,
                        serverId:tempFilePaths[0]
                    }).then(res=>{
                        wx.hideLoading();
                        resolve(res)
                    })
                },
            })
        })
    },
    isPhone(str){
        if (typeof str === 'number') {
            str = str.toString();
        }
        return /^0?1[3|4|5|7|8][0-9]\d{8}$/.test(str);
    },
    //监听导航栏切换
    changeNav(e){
        const { index } = e.detail;
        const { navIndex } = this.data;
        if (index == navIndex) return;
        if(index == 1){
            wx.redirectTo({
                url: '/pages/apply/apply'
            })
        }else if(index == 2){
            wx.redirectTo({
                url: '/pages/user/index/index'
            })
        }else{
            wx.redirectTo({
                url: '/pages/index/index'
            })
        }
        
    }
}