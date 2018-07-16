import qqmap from '../../utils/map.js';
Component({
    properties: {
        styles: {//这个是可以自定义最外层的view的样式
            type: String,
            value: '',
            observer: function (newval, oldval) {
                // 监听改变
                console.log(newval, oldval);
            }
        },
        citylist:Object
    },
    data: {
        //下面是字母排序
        letter: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
        cityListId: '',
        coverState: false,
        //下面是热门城市数据，模拟数据
        newcity: ['北京', '上海', '广州', '深圳', '成都', '杭州'],
        locateCity: ''
    },
    methods: {
        //点击城市
        cityTap(e) {
            const val = e.currentTarget.dataset.val || '';
            this.triggerEvent('citytap', { city: val });
        },
        //点击城市字母
        letterTap(e) {
            const Item = e.currentTarget.dataset.item;
            this.setData({
                cityListId: Item,
                coverState: true
            });
            setTimeout(() => {
                this.setData({
                    coverState: false
                })
            }, 600)
        },
        //关闭弹框
        closeTap() {
            this.triggerEvent('closeCity');
        }
    },
    
})