// pages/business/business.js
const { Dialog, extend } = require('../../assets/component/index.js');
Page(extend({},Dialog, {

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
        labelVal: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.showZanDialog({
            content: '这是一个模态弹窗',
            showCancel: false
        }).then(() => {
            console.log('=== dialog ===', 'type: confirm');
        }).catch(() => {
            console.log('=== dialog ===', 'type: cancel');
        });
    },

    submitInput() {
        console.log(this.data)
    },
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
}))