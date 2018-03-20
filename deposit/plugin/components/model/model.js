const Common = require('/api/common.js');
Component({
  data: {
    list: [],
  },
  attached(){
    // 可以在这里发起网络请求获取插件的数据
    Common.WXREQ('note/list', 'POST', {
      user_id: 'oHKIL0TjpKq3SDByP7h7srbLmQl0',
      pagenum: this.data.pagenum,
      pagesize: 100
    }, (json) => {
      this.setData({
        loading: false
      })
      if (json.meta.success) {
        let data = json.data.list.map((item) => {
          return {
            ...item,
            postime: Common.formatTime(new Date(item.postime * 1000))
          }
        })
        this.setData({ list: data })
      }
    })
  },
  methods:{
    showHandle() {
      console.log("show")
    }
  },
})