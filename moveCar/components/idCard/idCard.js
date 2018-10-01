// components/idCard/idCard.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        idCardStatus: Boolean,

    },

    /**
     * 组件的初始数据
     */
    data: {
        id_pic:''  
    },

    /**
     * 组件的方法列表
     */
    methods: {
        closeIdCard() {
            this.triggerEvent('idCardStatus', false);
        },
        uploadImg() {
            wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success:res => {
                    // tempFilePath可以作为img标签的src属性显示图片
                    const tempFilePaths = res.tempFilePaths;
                    this.setData({ id_pic: tempFilePaths[0]})
                }
            })
        }
    }
})