const api = require('./apis');

const baseURL = 'http://192.168.22.212:8888/';

let get = (op={})=>{
  return api.request({
      url: baseURL + op.path,
    ...op,
    method: 'GET'
  }).then(res=>res.data)
}

let post = (op={})=>{
  if(!op.header) op.header = {}
  return api.request({
    url: baseURL + op.path,
    ...op,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      ...op.header
    },
    method: 'POST'
  }).then(res => res.data);
};

//登录
exports.login = (userInfo)=>{
  return api.login()
  .then(res=>{
    return get({
      url: 'https://wx.miaov.com/login',
      header: {
        'X-WX-Code': res.code,
        'X-WX-Encrypted-Data': userInfo.encryptedData,
        'X-WX-IV': userInfo.iv,
      }
    })
  })
  .then(res=>{
    if(res.code===0){
      wx.setStorageSync('userInfo', res.data.userinfo);
      return res.data.userinfo;
    }else{
      throw res;
    }
  })
};

// 获取我的笔记列表
exports.getNoteList = (data = {}) => {
    return  post({
        path: `note/list`,
        data
    })
};