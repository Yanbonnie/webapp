// components/dig_treasure.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        mainInfo: {
            type: Object,
            value: {}
        },
        winning: {
            type: Boolean,
            value: false
        },
        diggingCd: {
            type: Boolean,
            value: false
        },
        canDiggingCd: {
            type: Boolean,
            value: false
        },
        digNothing: {
            type: Boolean,
            value: false,
        },
        giftNone: {
            type: Boolean,
            value: false
        },
        digging:{
            type:Boolean,
            value:false
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 挖到宝啦
        diggerGiftHandle(){
            this.triggerEvent('diggerGiftHandle');
        },
        // 加速
        toggleSharePop(){
            this.triggerEvent('toggleSharePop');
        },

    }
})