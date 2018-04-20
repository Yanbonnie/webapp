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

// 随机数
// 3-32位 randomWord(true,3,32)
// 43位  randomWord(false,43)
const randomWord = (randomFlag, min, max) => {
    var str = "",
        pos,
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    // 随机产生
    if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min;
    }
    for (var i = 0; i < range; i++) {
        pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
    }
    return str;
}

const Config = {
    reqUrl: 'https://xnt.xhwxpos.com/sznt/wxapp/Index/'
}

const URL = {
    'userLogin':'userLogin',            //用户登录接口         
    'getConfig': 'getConfig',           //获取小程序配置接口    
    'getShop': 'getShop',               //获取商家列表分页接口   x 
    'getTel': 'getTel',                 //获取商家电话列表接口   
    'postShopInfo': 'postShopInfo',     //商家入驻信息提交接口   
    'getShopInfo': 'getShopInfo',       //获取商家入驻接口       
    'setShopInfo': 'setShopInfo',       //商家信息修改接口       
    'uploadFile': 'uploadFile',         //上传图片接口           
    'deleteFile': 'deleteFile',         //图片删除               
    'getPic':'getPic',                  //获取商家菜单图片接口    
    'postPraise':'postPraise',          //商家点赞接口            
    'getShopDetails':'getShopDetails',  //获取商家详情接口        
    'payPraise':'payPraise',            //点赞拉起支付参数接口  x
    'payApply':'payApply',              //商家入驻支付接口      x 
    'postSearch':'postSearch',          //商家信息搜索接口        
    'postLogTel':'postLogTel',          //拨打电话记录接口        
    'postLogShare':'postLogShare',      //分享记录接口         x
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
  randomWord,
  Trim,
  Check,
  URL,
  WXREQ,
  Config
}
