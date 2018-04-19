
const app = getApp();
const { key } = app.globalData;
import { URL, WXREQ } from './util';
module.exports = {
    'comData': {
        'phoneList':[1,2]
    },
    'methodsArr':{
        getPhoneList(e){
            const { id } = e.currentTarget.dataset;
            
            return new Promise((resolve,reject)=>{
                console.log(id)
                WXREQ('GET',URL['getTel'],{
                    key,
                    id
                },res=>{
                    if(res.status == 0){
                        resolve(res.data);
                    }else{
                        wx.showToast({
                            title: '获取联系方式失败',
                            icon:'none'
                        })
                    }
                })
            })
        },
        //点击拨打电话
        toggleActionsheet(e) {
            wx.showLoading({
                title: '获取中...',
            })
            this.getPhoneList(e).then(res => {
                wx.hideLoading();
                let telArr = [];
                for (let i = 0; i < res.tel.length; i++) {
                    telArr.push({
                        name: res.tel[i],
                        className: 'action-class',
                        loading: false
                    })
                }
                this.setData({
                    'baseActionsheet.actions': telArr,
                    'baseActionsheet.show': true
                })
            });
        },//选择电话号码
        _handleZanActionsheetBtnClick(res) {
            const { componentId, index } = res.currentTarget.dataset;
            const { actions } = this.data.baseActionsheet;
            console.log(actions[index].name)
            wx.makePhoneCall({
                phoneNumber: actions[index].name
            })
        },
        //弹出层点击消失
        _handleZanActionsheetMaskClick() {
            this.setData({
                'baseActionsheet.show': false
            })
        },
        //点击查看查单
        lookMenu(e) {
            const { id } = e.currentTarget.dataset;
            wx.showLoading({
                title: '',
            })
            WXREQ('GET', URL['getPic'], {
                key,
                unionid: app.globalData.userInfo.unionid,
                id
            }, res => {
                if (res.status == 0) {
                    const { data } = res;
                    let urls = [];
                    for (let i = 0; i < data.length; i++) {
                        urls.push(data[i].pic)
                    }
                    //预览照片
                    wx.previewImage({
                        urls: urls, // 需要预览的图片http链接列表
                        success: res => {
                            wx.hideLoading()
                        }
                    })
                } else {
                    wx.showToast({
                        title: res.msg,
                        icon: 'none',
                        mask: true
                    })
                }
            })
        },   
    }
}