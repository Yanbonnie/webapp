//app.js
const key = '21ed62ad89c8b67d1a1172d4411a0c21';
// const { WXREQ, URL } = require('/utils/utils');
import { WXREQ, URL } from '/utils/util';
const Promise = require('/utils/es6-promise')
App({
    onLaunch: function () {
    },
    globalData: {
        userInfo: null,
        key,
        is_pay_apply:null,
        is_pay_praise:null
    }
})