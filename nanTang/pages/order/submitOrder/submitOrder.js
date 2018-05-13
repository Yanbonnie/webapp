// pages/order/submitOrder/submitOrder.js
import { REQUEST, uploadFile, ShowToast } from '../../../utils/request.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderType:'在店就餐',
        'type':1,       //1-在店点餐 2-送货
        address:'选择收货地址',
        userName:'',    //收货人姓名
        telNumber:'',   //收货人手机号码
        shop_name:'',   //商家名称
        shop_id:'',     //商家id
        total:'',       //总价
        shopLogo:'',    //商家logo
        goods:[],       //购买商品列表   id，num 是需要提交的
        table_num:'',   //桌数
        shop_mobile:'',            //商家电话，当type为1有值
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const { shop_id, shop_name, total } = options;
        this.setData({
            shop_id,
            shop_name,
            total
        })

        let goods = wx.getStorageSync('payGoods');
        let shopLogo = wx.getStorageSync('shopLogo');
        this.setData({
            goods,
            shopLogo
        })
    },
    //选择地址
    selectAddress(){
        wx.chooseAddress({
            success:res=> {
                this.setData({
                    address: `${res.provinceName} ${cityName} ${countyName} ${detailInfo}`,
                    userName:res.userName,
                    telNumber: res.telNumber
                })
            }
        })
    },
    //选择类型
    selectType() {
        let arr = ['在店就餐', '打包送出']
        wx.showActionSheet({
            itemList: arr,
            success: res=> {
                // console.log(res.tapIndex)
                this.setData({
                    orderType: arr[res.tapIndex]
                })
            },
            fail: res=>{
                console.log(res.errMsg)
            }
        })
    },
    //监听桌号输入
    tableNumInput(e){
        const { value } = e.detail;
        this.setData({
            table_num:value
        })
    },
    //提交订单
    submitOrder(){
        const { shop_id, shop_mobile, userName, telNumber,goods,orderType, table_num,address,total } = this.data;
        this.setData({
            "type": orderType == '在店就餐' ? 1 : 2 
        })

        if(this.data.type == 1){
            if (!table_num){
                ShowToast('请输入桌号');
                return;
            }
        }else{
            if (address == '选择收货地址'){
                ShowToast('请选择地址');
                return;
            }
        }

        let goodslist = goods.map((item,index)=>{
            return {
                id:item.id,
                num:item.num
            }
        }) 
        wx.showLoading({
            title: '订单提交中...',
            mask:true
        })
        const TYPE = this.data.type;
       /* REQUEST('POST','payOrder',{
            shop_id,
            'type': TYPE,
            table_num:TYPE == 1 ? table_num : '' ,
            shop_mobile:TYPE == 1 ? shop_mobile : '',
            name: TYPE == 2 ? userName : '',
            mobile:TYPE == 2 ? telNumber : '',
            address: TYPE == 2 ? address : '',
            goodslist
        }).then(res=>{
            let Package = res.package;
            wx.requestPayment({
                timeStamp,
                nonceStr,
                'package': Package,
                signType,
                paySign,
                'success': res => {
                    //支付成功

                },
                'fail': res => {
                }
            })
        })*/

        Promise.all(
            REQUEST('POST', 'payOrder', {
                shop_id,
                'type': TYPE,
                table_num: TYPE == 1 ? table_num : '',
                shop_mobile: TYPE == 1 ? shop_mobile : '',
                name: TYPE == 2 ? userName : '',
                mobile: TYPE == 2 ? telNumber : '',
                address: TYPE == 2 ? address : '',
                goodslist
            },0),
            REQUEST('POST','payPraise',{
                id:shop_id,
                money:total
            },0)
        ).then(result=>{
            let Package = result[0].package;
            const { appId, nonceStr, paySign, signType, timeStamp } = result[1].data;
            this.requestPayment(Package, nonceStr, paySign, signType, timeStamp);
        })

    },
    //支付接口
    requestPayment(Package, nonceStr, paySign, signType, timeStamp){
        wx.requestPayment({
            timeStamp,
            nonceStr,
            'package': Package,
            signType,
            paySign,
            'success': res => {
                wx.redirectTo({
                    url:'/pages/order/orderDetail/orderDetail'
                })
            },
            'fail': res => {
            }
        })
    }
})