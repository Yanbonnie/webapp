const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const Trim = (str) => {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

const Check = {
    isCardNo: str => {
        let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        return reg.test(str)
    },
    isPhone: str => {
        if (typeof str === 'number') {
            str = str.toString();
        }
        return /^0?1[3|4|5|7|8][0-9]\d{8}$/.test(str);
    }
}


const Config = {
    reqUrl: 'https://xnt.xhwxpos.com/sznt/wxapp/Index/'
}

const URL = {
    'userLogin':'userLogin',            //用户登录接口      
    'getBlackList':'getBlackList',      //获取用户状态（是否是黑名单）   
    'getConfig': 'getConfig',           //获取小程序配置接口    
    'getShop': 'getShop',               //获取商家列表分页接口   
    'getTel': 'getTel',                 //获取商家电话列表接口   
    'postShopInfo': 'postShopInfo',     //商家入驻信息提交接口   
    'getShopInfo': 'getShopInfo',       //获取商家入驻接口       
    'setShopInfo': 'setShopInfo',       //商家信息修改接口       
    'uploadFile': 'uploadFile',         //上传图片接口            type:menu(菜单) logo(Logo) license(营业执照) idcard(身份证)
    'deleteFile': 'deleteFile',         //图片删除               
    'getPic':'getPic',                  //获取商家菜单图片接口    
    'postPraise':'postPraise',          //商家点赞接口            
    'getShopDetails':'getShopDetails',  //获取商家详情接口        
    'payPraise':'payPraise',            //点赞拉起支付参数接口  
    'payApply':'payApply',              //商家入驻支付接口      
    'postSearch':'postSearch',          //商家信息搜索接口        
    'postLogTel':'postLogTel',          //拨打电话记录接口        
    'postLogShare':'postLogShare',      //分享记录接口    
    'getShare':'getShare',              //分享二维码  
    'postAdLog':'postAdLog',            //获取记录   
    'getMyGift':'getMyGift',            //获取我的礼物列表接口

    //2.0
    'postCredentials':'postCredentials',                      //证件上传
    'getCredentialsInfo':'getCredentialsInfo',                //获取证件信息接口，
    'getClassificationInfo':'getClassificationInfo',          //获取当前商家分类接口
    'getEditClassification':'getEditClassification',          //获取商家分类信息接口
    'postEditClassification':'postEditClassification',        //修改分类
    'postAddClassification':'postAddClassification',          //新增分类
    'getDelClassification':'getDelClassification',            //删除分类
    'getGoods': 'getGoods',                                   //获取当前商家分类中商品接口
    'getGoodsInfo':'getGoodsInfo',                            //获取当前中商品详情接⼝
    'postGoodsInfo':'postGoodsInfo',                          //新增商品
    'pEditGoodsInfo':'pEditGoodsInfo',                        //编辑商品
    'getDelGoods':'getDelGoods',                              //删除商品接口
    'getDealGoods':'getDealGoods',                            //商品下架接口

    'getDealUser': 'getDealUser',                             //获取员⼯列表接⼝
    'getDealUserQr': 'getDealUserQr',                         //⽣成员⼯注册⼆维码接⼝
    'getDealUserShop':'getDealUserShop',                      //获取商家信息接口
    'updateDealUser': 'updateDealUser',                       //员⼯注册同意拒绝接⼝

    'getOnlineShop':'getOnlineShop',                          //用户点单页面  商家店铺详情接口  
    'getGoods':'getGoods',                                    //有待修改  ！
    'payOrder': 'payOrder',                                   //⽤户结账提交接⼝

    'getOrderDetails':'getOrderDetails',                      //员工获取订单详情接口

    
}

const WXREQ = (method,url,data,succfn)=>{
    wx.request({
        url: Config.reqUrl + url, //仅为示例，并非真实的接口地址
        data: data,
        method: method,
        header: {
            'content-type': 'application/json' // 默认值
        },
        success: res => {
            succfn(res.data)
        }
    })
}


module.exports = {
  formatTime: formatTime,
  Trim,
  Check,
  URL,
  WXREQ,
  Config
}
