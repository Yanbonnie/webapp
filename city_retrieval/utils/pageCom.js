module.exports = {
    'comData':{

    },
    'methodsArr':{
        //到达联系页面
        selectItemHandle(e) {
            console.log(e)
            const id = e.detail.id ? e.detail.id : e.currentTarget.dataset.id;            
            wx.navigateTo({
                url: '/pages/contact/contact?id=' + id,
            })
            
        },
        //到达卡片页面
        goCard(){
            wx.redirectTo({
                url: '/pages/card/card',
            })            
        },
        //设置title
        setTitle(title){
            wx.setNavigationBarTitle({
                title: title
            })
        },
        //拨打电话
        makePhoneCall(e){
            const {phone} = e.currentTarget.dataset;
            wx.makePhoneCall({
                phoneNumber:phone
            })
        }
    }
}