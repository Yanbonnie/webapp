// pages/user/index/index.js
const {
    changeNav
} = require('../../../utils/pageCom');
const app = getApp();
const {
    globalData: {
        REQUEST
    }
} = app;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        navIndex: 2,
        ewmStatus: false,
        is_binding: null,
        gold:'',       //金币
        wxheadpic: '',
        wxname: '',
        level: 1,      
        car_number:'',
        ewmStatus2:false,
        friendUrl:'',
        videoContext: '',
        videoStatus: false,
        is_source:null,   //0显示是否显示邀请码的列表，1不显示
        inviteState:false,   //填写邀请码弹框
        invite_id: null,
        isfollow:0,
        tip:'',              //二维码分享弹框提示语
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            is_binding: app.globalData.is_binding
        })
    },
    /**
         * 生命周期函数--监听页面显示
         */
    onShow: function () {
        this.getMyInfo();
    },
    changeNav,
    getMyInfo() {
        REQUEST('get', 'getMyInfo', {
            unionid: app.globalData.unionid
        }).then(res => {
            wx.stopPullDownRefresh();
          const { is_source, isfollow} = res;
            const {
                wxheadpic,
                wxname,
                level,
                car_number,
                is_binding,
                gold,
                invite_id
            } = res.userinfo;
            this.setData({
                wxheadpic,
                wxname,
                level,
                car_number,
                is_binding,
                invite_id,
                gold: gold, 
                is_source,
                isfollow
            })
        })
    },
    //分享二维码
    getShareHandle(e){
        const { style } = e.currentTarget.dataset;
        console.log(style)
        if (style == 'getShare'){
            this.setData({
                tip:'点击查看大图（长按大图保存,分享到朋友圈）'
            })
        }else{
            this.setData({
                tip: '点击查看大图（长按大图保存）'
            })
        }
        wx.showLoading({
            title: '二维码加载中...',
            mask:true
        })
        REQUEST('get', style ,{
            unionid:app.globalData.unionid
        }).then(res=>{
            wx.hideLoading();
            this.setData({
                ewmStatus2:true,
                friendUrl:res.url
            })
        })
    },
    goInfoHandle() {
        wx.navigateTo({
            url: '/pages/user/info/info',
        })
    },
    goRecordHandle() {
        wx.navigateTo({
            url: '/pages/user/record/record',
        })
    },
    goApplyHandle(){
        let {is_binding}=this.data;
        if(is_binding){
            wx.navigateTo({
                url: '/pages/apply/apply',
            })
        }else{
            wx.showModal({
                title: '提示',
                content: '抱歉,您未绑定不能申请,请先绑定',
                confirmText: '去绑定',
                success: res => {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '/pages/user/info/info',
                        })
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        }
    },
    //展示图片
    previewImgHandle(e){
        console.log(e)
        const { img } = e.currentTarget.dataset;
        wx.previewImage({
            urls: [img],
        })
    },
    //展示二维码
    showEwmFn(e) {
        const {
            state
        } = e.currentTarget.dataset;
        if(state == 2){   
            this.setData({
                ewmStatus2: false
            })
        }else if (state == 3) {
            this.setData({
                videoStatus: false
            })
            this.videoContext.pause();
        }else{
            this.setData({
                ewmStatus: state == 1 ? true : false
            })
        }
    },
    // 到达提现页面
    goPutForward(){
        wx.navigateTo({
            url: '/pages/user/put_forward/put_forward',
        })
    },
    // 复制
    goCopy() {
      const { invite_id } = this.data;
      wx.setClipboardData({
        data: invite_id,
        success: function (res) {
          wx.getClipboardData({
            success: function (res) {
              wx.showToast({
                title: '复制成功',
              })
            }
          })
        }
      })
    },
    // 显示邀请码弹框
    writeInviteHandle(){
      const { inviteState } = this.data;
      this.setData({
        inviteState: !inviteState
      })
    },
    bindingInvite(e){
      console.log(e);
      const { formId } = e.detail;
      const { invite_id } = e.detail.value;
      if(!invite_id){
        wx.showToast({
          icon:'none',
          title: '邀请码不能为空',
        })
        return;
      }
      wx.showLoading({
        title: '提交中...',
        mask: true
      })
      REQUEST('post', 'bindingInvite', {
        unionid: app.globalData.unionid,
        invite_id: invite_id,
        formId:formId
      }).then(res => {
        wx.hideLoading();
        this.setData({
          is_source:1,
          inviteState:false
        })
      })
    },
    // 播放视频
    playVideoHandle() {
        this.setData({
            videoStatus: true
        })
        if(!this.videoContext){
            this.videoContext = wx.createVideoContext('myVideo');
        }        
        console.log(this.videoContext)
        this.videoContext.play();
    }, 
    onPullDownRefresh: function() {
        this.getMyInfo();
    },
    onShareAppMessage: function() {
        let shareUrl = encodeURIComponent(`/pages/user/index/index?friend_unionid=${app.globalData.unionid}`);
        let enterUrl = `/pages/enter/enter?share_query=${shareUrl}`;
        return {
            title: '我要分享一个好东西',
            path: enterUrl
        }
    }
})